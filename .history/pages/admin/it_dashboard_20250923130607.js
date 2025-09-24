function renderITAdminDashboard(admin = { username: "ITAdmin", position: "" }) {
  return `
    ${renderNav()}
    <div class="container app" style="display:flex; min-height:90vh; font-family:sans-serif; gap:16px; background:#f1f3f5; padding:16px;">
      
      <!-- Sidebar -->
      <aside class="sidebar" style="
        width:220px; background:#1e1e2f; color:#fff; border-radius:12px; padding:16px;
        display:flex; flex-direction:column; gap:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <div style="font-weight:700; font-size:16px; margin-bottom:16px; text-align:center; letter-spacing:0.5px;">IT ADMIN MENU</div>
        <button class="sidebar-btn" data-section="dashboard" style="padding:10px; background:#2c2c3e; color:#fff; border:none; border-radius:8px; cursor:pointer; text-align:left; transition:0.2s;">Dashboard</button>
        <button class="sidebar-btn" data-section="requests" style="padding:10px; background:#2c2c3e; color:#fff; border:none; border-radius:8px; cursor:pointer; text-align:left; transition:0.2s;">IT Requests</button>
        <button class="sidebar-btn" data-section="clients" style="padding:10px; background:#2c2c3e; color:#fff; border:none; border-radius:8px; cursor:pointer; text-align:left; transition:0.2s;">Clients</button>
        <div style="flex:1"></div>
        <button class="sidebar-btn" id="adminLogoutBtn" style="padding:10px; background:#ff4d4f; color:#fff; border:none; border-radius:8px; cursor:pointer;">Logout</button>
      </aside>

      <!-- Main Content -->
      <main class="main" style="flex:1; background:#fff; border-radius:12px; padding:24px; overflow:auto; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div class="header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div>
            <h2 style="margin:0; color:#1e1e2f;">IT Department Dashboard</h2>
            <div style="color:#6c757d; font-size:14px;">Welcome, ${admin.username} (${admin.position})</div>
          </div>
          <div style="display:flex; gap:12px; align-items:center">
            <img src="https://i.pravatar.cc/44?u=${admin.username}" alt="avatar" 
              style="border-radius:999px; border:2px solid #eee;">
          </div>
        </div>

        <!-- Dashboard Stats -->
        <div id="dashboardSection" style="display:block;">
          <div class="stats" style="display:flex; gap:16px; margin-bottom:24px;">
            ${["pending","approved","denied","cancelled"].map(status => `
              <div class="stat-card" style="
                flex:1; background:#f8f9fa; padding:16px; border-radius:12px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="color:#6c757d; text-transform:capitalize;">${status}</div>
                <div id="admin-${status}" style="font-size:22px; font-weight:700; color:${statusColor(status)}">0</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- IT Requests -->
        <div id="requestsSection" style="display:none;">
          <h4 style="margin-bottom:16px; color:#1e1e2f;">All IT Requests</h4>
          <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse;">
            <thead style="color:#6c757d; border-bottom:2px solid #dee2e6;">
              <tr>
                <th style="padding:12px 8px; text-align:left">Employee</th>
                <th style="padding:12px 8px; text-align:left">Type</th>
                <th style="padding:12px 8px; text-align:left">Details</th>
                <th style="padding:12px 8px; text-align:left">Date</th>
                <th style="padding:12px 8px; text-align:left">Status</th>
                <th style="padding:12px 8px; text-align:left">Action</th>
              </tr>
            </thead>
            <tbody id="adminRequestsTable">
              <tr><td colspan="6" style="padding:12px; text-align:center; color:#6c757d">Loading IT requests...</td></tr>
            </tbody>
          </table>
          </div>
        </div>

        <!-- Clients Section -->
        <div id="clientsSection" style="display:none; margin-top:24px;">
          <h4 style="margin-bottom:16px; color:#1e1e2f;">All Clients</h4>
          <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse;">
            <thead style="color:#6c757d; border-bottom:2px solid #dee2e6;">
              <tr>
                <th style="padding:12px 8px; text-align:left">Name</th>
                <th style="padding:12px 8px; text-align:left">Username</th>
                <th style="padding:12px 8px; text-align:left">Department</th>
                <th style="padding:12px 8px; text-align:left">Position</th>
                <th style="padding:12px 8px; text-align:left">Email</th>
              </tr>
            </thead>
            <tbody id="adminClientsTable">
              <tr><td colspan="5" style="padding:12px; text-align:center; color:#6c757d">Loading clients...</td></tr>
            </tbody>
          </table>
          </div>
        </div>
      </main>
    </div>
  `;
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
  const ordersCol = window.db.collection("it_service_orders");
  const clientsCol = window.db.collection("clients");
  let unsubscribeOrders = null;

  function loadOrders() {
    if (unsubscribeOrders) unsubscribeOrders();
    Modal.show("Loading IT service requests...");

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
function mountITAdminDashboard(admin) {
  mount(renderITAdminDashboard(admin));
  attachITAdminDashboard(admin);
  attachSidebarNavigation(); // <-- enable sidebar
}


window.renderITAdminDashboard = renderITAdminDashboard;
window.mountITAdminDashboard = mountITAdminDashboard;
