// --- Admin Dashboard Rendering ---
function renderAdminDashboard(admin = { username: "Admin", position: "" }) {
  return `
    ${renderNav()}
    <div class="container app">
      <main class="main">
        <div class="header">
          <div>
            <h2 style="margin:0">Admin Dashboard</h2>
            <div style="color:var(--muted)">Welcome, ${admin.username} (${admin.position})</div>
          </div>
          <div style="display:flex; gap:12px; align-items:center">
            <img src="https://i.pravatar.cc/44?u=${admin.username}" alt="avatar" 
              style="border-radius:999px; border:2px solid #eee;">
          </div>
        </div>

        <!-- Stats -->
        <div class="stats">
          <div class="stat">
            <div style="color:var(--muted)">Pending</div>
            <div id="admin-pending" style="font-size:20px; font-weight:700; color:orange">0</div>
          </div>
          <div class="stat">
            <div style="color:var(--muted)">Approved</div>
            <div id="admin-approved" style="font-size:20px; font-weight:700; color:green">0</div>
          </div>
          <div class="stat">
            <div style="color:var(--muted)">Denied</div>
            <div id="admin-denied" style="font-size:20px; font-weight:700; color:red">0</div>
          </div>
          <div class="stat">
            <div style="color:var(--muted)">Cancelled</div>
            <div id="admin-cancelled" style="font-size:20px; font-weight:700; color:gray">0</div>
          </div>
        </div>

        <!-- All Requests Table -->
        <div class="table">
          <h4 style="margin:0 0 8px 0">All Requests</h4>
          <table style="width:100%; border-collapse:collapse;">
            <thead style="color:var(--muted)">
              <tr>
                <th style="padding:8px 0; text-align:left">Employee</th>
                <th style="padding:8px 0; text-align:left">Type</th>
                <th style="padding:8px 0; text-align:left">Details</th>
                <th style="padding:8px 0; text-align:left">Date</th>
                <th style="padding:8px 0; text-align:left">Status</th>
                <th style="padding:8px 0; text-align:left">Action</th>
              </tr>
            </thead>
            <tbody id="adminRequestsTable">
              <tr><td colspan="6" style="padding:12px; text-align:center; color:var(--muted)">Loading requests...</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Logout -->
        <button id="adminLogoutBtn" class="btn" style="margin-top:12px;">Logout</button>
      </main>
    </div>

    <!-- Modal for request details -->
    <div id="requestDetailsModal" class="modal" style="display:none;">
      <div class="modal-content" style="padding:20px; background:#fff; border-radius:8px; max-width:500px; margin:auto;">
        <h3>Request Details</h3>
        <pre id="requestDetails" style="white-space:pre-wrap; font-size:14px; background:#f8f9fa; padding:12px; border-radius:6px;"></pre>
        <button id="closeDetailsBtn" class="btn" style="margin-top:12px;">Close</button>
      </div>
    </div>
  `;
}


// --- Attach Admin Dashboard ---
async function attachAdminDashboard(admin) {
  // Choose collection based on role/department
  let collectionName = "it_service_orders";
  if ((admin.position || "").toLowerCase() === "admin head") {
    collectionName = "drivers_trip_tickets";
  } else if (admin.department?.toLowerCase() === "hr") {
    collectionName = "travel_orders";
  }

  const ordersCol = window.db.collection(collectionName);
  let unsubscribe = null;

  function loadOrders() {
    if (unsubscribe) unsubscribe();
    Modal.show("Loading all employee requests...");

    unsubscribe = ordersCol.onSnapshot(
      snapshot => {
        const tbody = document.getElementById("adminRequestsTable");
        tbody.innerHTML = "";
        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0, assigned: 0 };

        if (snapshot.empty) {
          tbody.innerHTML = `<tr><td colspan="6" style="padding:12px; text-align:center; color:var(--muted)">No requests yet.</td></tr>`;
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

          // ✅ Assign button → open Admin modal
          row.querySelector(".btn-assign")?.addEventListener("click", async () => {
            mountAdminITServiceModal(admin, {
              ...order,
              id: doc.id,
              collection: collectionName
            });
          });

          tbody.appendChild(row);
        });

        updateAdminStats(stats);
        Modal.hide();
      },
      err => {
        Modal.hide();
        console.error("Admin snapshot error:", err);
      }
    );
  }


  function updateAdminStats(stats) {
    document.getElementById("admin-pending").textContent = stats.pending || 0;
    document.getElementById("admin-approved").textContent = stats.approved || 0;
    document.getElementById("admin-denied").textContent = stats.denied || 0;
    document.getElementById("admin-cancelled").textContent = stats.cancelled || 0;
  }

  function statusColor(status) {
    switch (status) {
      case "approved": return "green";
      case "denied": return "red";
      case "cancelled": return "gray";
      default: return "orange"; // pending
    }
  }

  // Logout
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (unsubscribe) unsubscribe();
      // Clear session
      
      localStorage.removeItem("loggedInUser");
      // Show guest home instead of login modal
      mount(renderHome());
    });
  }

  loadOrders();
}

// --- Mount Admin Dashboard ---
function mountAdminDashboard(admin) {
  mount(renderAdminDashboard(admin));
  attachAdminDashboard(admin);
}

// Expose globally
window.renderAdminDashboard = renderAdminDashboard;
window.mountAdminDashboard = mountAdminDashboard;

