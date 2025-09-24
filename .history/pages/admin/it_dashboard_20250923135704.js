function renderITAdminDashboard(admin = { username: "ITAdmin", position: "" }, staffTasks = []) {
  return `
    ${renderNav()}
    <div class="container app">
      
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-title">IT ADMIN MENU</div>
        <button class="sidebar-btn" data-section="dashboard">Dashboard</button>
        <button class="sidebar-btn" data-section="requests">IT Requests</button>
        <button class="sidebar-btn" data-section="clients">Clients</button>
        <div class="sidebar-spacer"></div>
        <button class="sidebar-btn logout" id="adminLogoutBtn">Logout</button>
      </aside>

      <!-- Main Content -->
      <main class="main">
        <!-- Header -->
        <div class="header">
          <div>
            <h2>IT Department Dashboard</h2>
            <div class="header-subtitle">Welcome, ${admin.username} (${admin.position})</div>
          </div>
          <div class="header-avatar">
            <img src="https://i.pravatar.cc/44?u=${admin.username}" alt="avatar">
          </div>
        </div>

<!-- Dashboard Stats -->
<div id="dashboardSection" class="section">
  <div class="stats">
    ${["pending","approved","denied","cancelled"].map(status => `
      <div class="stat-card">
        <div class="stat-label">${status}</div>
        <div id="admin-${status}" class="stat-value ${status}">0</div>
      </div>
    `).join('')}
  </div>

  <!-- Staff Task Stats -->
  <h4>Staff Task Overview</h4>
  <div class="staff-stats">
    <table>
      <thead>
        <tr>
          <th>Staff Name</th>
          <th>Position</th>
          <th>Pending</th>
          <th>Ongoing</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody>
        ${staffTasks.length > 0
          ? staffTasks.map(staff => `
              <tr>
                <td>${staff.name}</td>
                <td>${staff.position}</td>
                <td>${staff.pending}</td>
                <td>${staff.ongoing}</td>
                <td>${staff.completed}</td>
              </tr>
            `).join('')
          : `<tr><td colspan="5" class="loading">Loading staff tasks...</td></tr>`
        }
      </tbody>
    </table>
  </div>
</div>


        <!-- IT Requests -->
      <div id="requestsSection" class="section">
        <div class="section-header">
          <h4>All IT Requests</h4>
          <input type="text" id="searchRequestsInput" placeholder="Search IT requests..." class="search-input">
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Details</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="adminRequestsTable">
              <tr><td colspan="6" class="loading">Loading IT requests...</td></tr>
            </tbody>
          </table>
        </div>
      </div>


      <!-- Clients Section -->
        <div id="clientsSection" class="section">
          <div class="section-header">
            <h4>All Clients</h4>
            <div class="section-controls">
              <input type="text" id="searchClientsInput" placeholder="Search clients..." class="search-input">
              <button id="addClientBtn" class="btn btn-primary" onclick="mountSignIn()">Add User</button>
            </div>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody id="adminClientsTable">
                <tr><td colspan="5" class="loading">Loading clients...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

  
      </main>
    </div>
  `;
}

async function getStaffTasks() {
  const staffTasks = [];

  try {
    // 1. Get all staff from clients collection
    const clientsSnapshot = await db.collection("clients").where("department", "==", "IT").get();
    const staffList = clientsSnapshot.docs.map(doc => doc.data());

    // 2. For each staff, count tasks in it_service_orders
    for (const staff of staffList) {
      const querySnapshot = await db.collection("ITdepartment_tasks")
        .where("staff", "==", staff.username)
        .get();

      let pending = 0, ongoing = 0, completed = 0;

      querySnapshot.forEach(doc => {
        const status = doc.data().status.toLowerCase();
        if (status === "pending") pending++;
        else if (status === "ongoing") ongoing++;
        else if (status === "completed") completed++;
      });

      staffTasks.push({
        name: staff.username,
        position: staff.position,
        pending,
        ongoing,
        completed
      });
    }

    return staffTasks;

  } catch (error) {
    console.error("Error fetching staff tasks:", error);
    return [];
  }
}


// Status colors
function statusColor(status) {
  switch (status) {
    case "approved": return "green";
    case "denied": return "red";
    case "cancelled": return "gray";
    default: return "orange"; // pending
  }
}

function attachSidebarNavigation() {
  document.querySelectorAll(".sidebar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section");
      document.getElementById("dashboardSection").style.display = "none";
      document.getElementById("requestsSection").style.display = "none";
      document.getElementById("clientsSection").style.display = "none";

      if (section === "dashboard") document.getElementById("dashboardSection").style.display = "block";
      if (section === "requests") document.getElementById("requestsSection").style.display = "block";
      if (section === "clients") document.getElementById("clientsSection").style.display = "block";
    });
  });
}

// --- Attach IT Admin Dashboard ---
async function attachITAdminDashboard(admin) {
  // Inject modern styles
  injectITAdminStyles();
  const ordersCol = window.db.collection("it_service_orders");
  const clientsCol = window.db.collection("clients");
  let unsubscribeOrders = null;

  function loadOrders() {
    if (unsubscribeOrders) unsubscribeOrders();
    Modal.show("Loading IT service requests...");


    document.getElementById("searchRequestsInput").addEventListener("input", function() {
      const query = this.value.toLowerCase();
      const rows = document.querySelectorAll("#adminRequestsTable tr");

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });

    document.getElementById("searchClientsInput").addEventListener("input", function() {
      const query = this.value.toLowerCase();
      const rows = document.querySelectorAll("#adminClientsTable tr");

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });


    unsubscribeOrders = ordersCol.onSnapshot(snapshot => {
      const tbody = document.getElementById("adminRequestsTable");
      tbody.innerHTML = "";
      const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

      if (snapshot.empty) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding:12px; text-align:center; color:var(--muted)">No IT requests yet.</td></tr>`;
        updateAdminStats(stats);
        Modal.hide();
        return;
      }

      snapshot.forEach(doc => {
        const order = doc.data();
        const createdAt = order.dateSubmitted?.toDate
          ? order.dateSubmitted.toDate().toLocaleString()
          : "-";
        const statusKey = (order.status || "pending").toLowerCase();
        stats[statusKey] = (stats[statusKey] || 0) + 1;

        const row = document.createElement("tr");
        row.style.borderTop = "1px solid #f1f5f9";
        row.innerHTML = `
          <td style="padding:10px 0">${order.username || "-"}</td>
          <td style="padding:10px 0">${order.type || "-"}</td>
          <td style="padding:10px 0">${order.description || "-"}</td>
          <td style="padding:10px 0">${createdAt}</td>
          <td style="padding:10px 0; color:${statusColor(statusKey)}">${order.status || "Pending"}</td>
          <td style="padding:10px 0">
            ${statusKey === "pending" 
              ? `<button class="btn btn-assign" data-id="${doc.id}">Assign</button>`
              : "-"
            }
          </td>
        `;

        row.querySelector(".btn-assign")?.addEventListener("click", () => {
          mountAdminITServiceModal(admin, { ...order, id: doc.id, collection: "it_service_orders" });
        });

        tbody.appendChild(row);
      });

      updateAdminStats(stats);
      Modal.hide();
    }, err => {
      Modal.hide();
      console.error("IT Admin snapshot error:", err);
    });
  }

  function loadClients() {
    clientsCol.get().then(snapshot => {
      const tbody = document.getElementById("adminClientsTable");
      tbody.innerHTML = "";

      if (snapshot.empty) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding:12px; text-align:center; color:var(--muted)">No clients found.</td></tr>`;
        return;
      }

      snapshot.forEach(doc => {
        const client = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="padding:10px 0">${client.firstName || ""} ${client.lastName || ""}</td>
          <td style="padding:10px 0">${client.username || ""}</td>
          <td style="padding:10px 0">${client.department || ""}</td>
          <td style="padding:10px 0">${client.position || ""}</td>
          <td style="padding:10px 0">${client.email || ""}</td>
        `;
        tbody.appendChild(row);
      });
    }).catch(err => console.error("Error loading clients:", err));
  }

  function updateAdminStats(stats) {
    document.getElementById("admin-pending").textContent = stats.pending || 0;
    document.getElementById("admin-approved").textContent = stats.approved || 0;
    document.getElementById("admin-denied").textContent = stats.denied || 0;
    document.getElementById("admin-cancelled").textContent = stats.cancelled || 0;
  }

  // Logout
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (unsubscribeOrders) unsubscribeOrders();
      sessionStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUser");
      mount(renderHome());
    });
  }

  loadOrders();
  loadClients();
}

// --- Mount IT Admin Dashboard ---
async function mountITAdminDashboard(admin) {
  const staffTasks = await getStaffTasks(); // wait for async function
  mount(renderITAdminDashboard(admin, staffTasks)); // now we have actual data
  attachITAdminDashboard(admin);
  attachSidebarNavigation(); // <-- enable sidebar
}


window.renderITAdminDashboard = renderITAdminDashboard;
window.mountITAdminDashboard = mountITAdminDashboard;

function injectITAdminStyles() {
  const style = document.createElement("style");
  style.textContent = `

  .stat-value.it-manager {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
    }

    .stat-value.it-manager div {
      margin: 4px 0;
    }

    .stat-card .stat-label {
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
      font-size: 13px;
      color: #6b7280;
    }

    /* Container */
    .container.app {
      display: flex;
      min-height: 90vh;
      max-height: 400vh;
      gap: 20px;
      font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
      background: #f9fafb;
      padding: 20px;
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      background: linear-gradient(180deg, #1f2937, #111827);
      color: #f9fafb;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .sidebar-title {
      font-weight: 700;
      font-size: 18px;
      text-align: center;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }
    .sidebar-btn {
      padding: 12px;
      background: #374151;
      color: #f9fafb;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      text-align: left;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .sidebar-btn:hover {
      background: #4b5563;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .sidebar-spacer { flex: 1; }
    .sidebar-btn.logout {
      background: #ef4444;
    }
    .sidebar-btn.logout:hover {
      background: #dc2626;
    }

    /* Main */
    .main {
      flex: 1;
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      overflow: auto;
      box-shadow: 0 8px 24px rgba(0,0,0,0.05);
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .header h2 { margin: 0; font-size: 24px; }
    .header-subtitle {
      color: #6b7280;
      font-size: 14px;
      margin-top: 4px;
    }
    .header-avatar img {
      border-radius: 999px;
      border: 2px solid #e5e7eb;
      width: 44px;
      height: 44px;
    }

    /* Stats */
    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      flex: 1;
      background: #f3f4f6;
      padding: 20px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .stat-label {
      color: #6b7280;
      text-transform: capitalize;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .stat-value.pending { color: #f59e0b; font-size: 24px; font-weight: 700; }
    .stat-value.approved { color: #10b981; font-size: 24px; font-weight: 700; }
    .stat-value.denied { color: #ef4444; font-size: 24px; font-weight: 700; }
    .stat-value.cancelled { color: #6b7280; font-size: 24px; font-weight: 700; }

    /* Tables */
    .table-wrapper { overflow-x: auto; border-radius: 12px; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      /* Added to enable scrolling if content exceeds container */
      overflow-y: auto;        /* vertical scroll */
      overflow-x: hidden;      /* prevent horizontal scroll */
    }
    thead { color: #6b7280; border-bottom: 2px solid #e5e7eb; }
    th, td { padding: 14px 12px; text-align: left; font-size: 14px; }
    .loading { text-align: center; color: #9ca3af; }

    /* Sections */
    .section { display: none; margin-top: 24px; }
    #dashboardSection { display: block; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    #addClientBtn {
      padding: 5px 10px;
      font-size: 0.9rem;
      cursor: pointer;
    }

    /* General Section Styling */
    .section {
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    /* Section Header */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .section-header h4 {
      font-size: 1.2rem;
      color: #333;
      margin: 0;
    }

    /* Controls (search + button) */
    .section-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .search-input {
      padding: 6px 12px;
      font-size: 0.9rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      outline: none;
      transition: border 0.2s;
    }

    .search-input:focus {
      border-color: #007bff;
    }
  `;
  document.head.appendChild(style);
}


