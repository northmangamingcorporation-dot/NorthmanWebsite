// pages/dashboard.js

function renderDashboard(user = { username: "Employee" }) {
  return `
    ${renderNav()}
    <div class="container app">
      <main class="main">
        <!-- Header -->
        <div class="header">
          <div>
            <h2 style="margin:0">Employee Dashboard</h2>
            <div style="color:var(--muted)">Welcome, ${user.username}</div>
          </div>
          <div style="display:flex; gap:12px; align-items:center">
            <img src="https://i.pravatar.cc/44" alt="avatar" 
              style="border-radius:999px; border:2px solid #eee;">
          </div>
        </div>

        <!-- Stats -->
        <div class="stats">
          <div class="stat">
            <div style="color:var(--muted)">Pending Requests</div>
            <div id="stat-pending" style="font-size:20px; font-weight:700; color:orange">0</div>
          </div>
          <div class="stat">
            <div style="color:var(--muted)">Approved</div>
            <div id="stat-approved" style="font-size:20px; font-weight:700; color:green">0</div>
          </div>
          <div class="stat">
            <div style="color:var(--muted)">Denied</div>
            <div id="stat-denied" style="font-size:20px; font-weight:700; color:red">0</div>
          </div>
          <div class="stat">
            <div style="color:var(--muted)">Cancelled</div>
            <div id="stat-cancelled" style="font-size:20px; font-weight:700; color:gray">0</div>
          </div>
        </div>

        <!-- Request Table -->
        <div class="table">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 style="margin:0">My Requests</h4>
            <button id="newRequestBtn" class="btn">+ New Request</button>
          </div>
          <table style="width:100%; border-collapse:collapse;">
            <thead style="color:var(--muted)">
              <tr>
                <th style="text-align:left; padding:8px 0">Type</th>
                <th style="text-align:left; padding:8px 0">Details</th>
                <th style="text-align:left; padding:8px 0">Date</th>
                <th style="text-align:left; padding:8px 0">Status</th>
                <th style="text-align:left; padding:8px 0">Action</th>
              </tr>
            </thead>
            <tbody id="requestsTable">
              <tr><td colspan="5" style="padding:12px; text-align:center; color:var(--muted)">No requests yet.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Optional logout button -->
        <button id="backBtn" class="btn" style="margin-top:12px;">Logout</button>

      </main>
    </div>
  `;
}

// Firestore logic + attach events
async function attachDashboard(user) {
  const requestsCol = window.db.collection("requests");
  let unsubscribe = null;

  // Load requests
  function loadRequests() {
    if (unsubscribe) unsubscribe();

    unsubscribe = requestsCol
      .where("username", "==", user.username)
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        const tbody = document.getElementById("requestsTable");
        tbody.innerHTML = "";
        let stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

        if (snapshot.empty) {
          tbody.innerHTML = `
            <tr>
              <td colspan="5" style="padding:12px; text-align:center; color:var(--muted)">
                No requests yet.
              </td>
            </tr>`;
          updateStats(stats);
          return;
        }

        snapshot.forEach(doc => {
          const req = doc.data();
          const createdAt = req.createdAt?.toDate
            ? req.createdAt.toDate().toLocaleString()
            : "-";

          stats[req.status] = (stats[req.status] || 0) + 1;

          const row = document.createElement("tr");
          row.style.borderTop = "1px solid #f1f5f9";
          row.innerHTML = `
            <td style="padding:10px 0">${req.type}</td>
            <td style="padding:10px 0">${req.details || "-"}</td>
            <td style="padding:10px 0">${createdAt}</td>
            <td style="padding:10px 0; color:${statusColor(req.status)}">${req.status}</td>
            <td style="padding:10px 0">
              ${req.status === "pending" 
                ? `<button class="btn btn-cancel" data-id="${doc.id}">Cancel</button>` 
                : "-"}
            </td>
          `;
          tbody.appendChild(row);
        });

        updateStats(stats);

        // Attach cancel events
        document.querySelectorAll(".btn-cancel").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const confirmCancel = await Modal.confirm("Cancel this request?");
            if (confirmCancel) {
              await requestsCol.doc(id).update({ status: "cancelled" });
            }
          });
        });
      });
  }

  function updateStats(stats) {
    document.getElementById("stat-pending").textContent = stats.pending || 0;
    document.getElementById("stat-approved").textContent = stats.approved || 0;
    document.getElementById("stat-denied").textContent = stats.denied || 0;
    document.getElementById("stat-cancelled").textContent = stats.cancelled || 0;
  }

  function statusColor(status) {
    switch (status) {
      case "approved": return "green";
      case "denied": return "red";
      case "cancelled": return "gray";
      default: return "orange";
    }
  }

  // ✅ Attach events AFTER HTML exists
  const newReqBtn = document.getElementById("newRequestBtn");
  if (newReqBtn) {
    console.log("New Request button found, attaching event.");
    newReqBtn.addEventListener("click", () => {
      closeAllModals?.();
      mountRequestModal();
    });
  }

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (unsubscribe) unsubscribe();
      window.mountLogin();
    });
  }

  const newReqBtn = document.getElementById("newRequestBtn");
  if (newReqBtn) newReqBtn.addEventListener("click", () => window.mountLogin());

  // Initial load
  loadRequests();
}

// Mount dashboard
function mountDashboard(user) {
  mount(renderDashboard(user));
  // Wait a tick to ensure DOM is injected
  setTimeout(() => attachDashboard(user), 0);
}


window.renderDashboard = renderDashboard;
window.mountDashboard = mountDashboard;
