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
      </main>
    </div>

    <!-- New Request Modal -->
    <div id="newRequestModal" style="display:none;
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:9999;">
      <div style="background:#fff; padding:24px; border-radius:10px; width:520px; max-width:95%;">
        <h3 style="margin:0 0 16px 0; text-align:center;">Choose Request Type</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="req-card" data-type="travel" style="cursor:pointer; border:1px solid #ccc; border-radius:8px; padding:20px; text-align:center;">
            <h4>🧳 Travel Order</h4>
            <p style="color:var(--muted); font-size:14px;">Submit official travel requests</p>
          </div>
          <div class="req-card" data-type="driver" style="cursor:pointer; border:1px solid #ccc; border-radius:8px; padding:20px; text-align:center;">
            <h4>🚐 Driver Trip Ticket</h4>
            <p style="color:var(--muted); font-size:14px;">Request driver services</p>
          </div>
          <div class="req-card" data-type="it" style="cursor:pointer; border:1px solid #ccc; border-radius:8px; padding:20px; text-align:center;">
            <h4>💻 IT Service Order</h4>
            <p style="color:var(--muted); font-size:14px;">Report IT issues or requests</p>
          </div>
        </div>
        <div style="margin-top:20px; text-align:center;">
          <button id="closeNewRequest" class="btn">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Firestore logic + attach events
async function attachDashboard(user) {
  const requestsCol = window.db.collection("requests");

  function loadRequests() {
    requestsCol.where("username", "==", user.username).orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        const tbody = document.getElementById("requestsTable");
        tbody.innerHTML = "";
        let stats = { pending:0, approved:0, denied:0, cancelled:0 };

        if (snapshot.empty) {
          tbody.innerHTML = `<tr><td colspan="5" style="padding:12px; text-align:center; color:var(--muted)">No requests yet.</td></tr>`;
          return;
        }

        snapshot.forEach(doc => {
          const req = doc.data();
          stats[req.status] = (stats[req.status] || 0) + 1;

          const row = document.createElement("tr");
          row.style.borderTop = "1px solid #f1f5f9";
          row.innerHTML = `
            <td style="padding:10px 0">${req.type}</td>
            <td style="padding:10px 0">${req.details || "-"}</td>
            <td style="padding:10px 0">${req.createdAt?.toDate().toLocaleString() || "-"}</td>
            <td style="padding:10px 0; color:${statusColor(req.status)}">${req.status}</td>
            <td style="padding:10px 0">
              ${req.status === "pending" 
                ? `<button class="btn btn-cancel" data-id="${doc.id}">Cancel</button>` 
                : "-"}
            </td>
          `;
          tbody.appendChild(row);
        });

        document.getElementById("stat-pending").textContent = stats.pending;
        document.getElementById("stat-approved").textContent = stats.approved;
        document.getElementById("stat-denied").textContent = stats.denied;
        document.getElementById("stat-cancelled").textContent = stats.cancelled;

        document.querySelectorAll(".btn-cancel").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await requestsCol.doc(id).update({ status: "cancelled" });
          });
        });
      });
  }

  // New Request button
  document.getElementById("newRequestBtn").addEventListener("click", () => {
    document.getElementById("newRequestModal").style.display = "flex";
  });

  // Close modal
  document.getElementById("closeNewRequest").addEventListener("click", () => {
    document.getElementById("newRequestModal").style.display = "none";
  });

  // Grid card clicks
  document.querySelectorAll(".req-card").forEach(card => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;
      document.getElementById("newRequestModal").style.display = "none";

      if (type === "it") {
        mountITServiceForm();
        document.getElementById("itServiceModal").style.display = "flex";
      } else if (type === "travel") {
        alert("🚧 Travel Order Form coming soon.");
      } else if (type === "driver") {
        alert("🚧 Driver Trip Ticket Form coming soon.");
      }
    });
  });

  // Logout
  document.getElementById("backBtn").addEventListener("click", () => {
    window.mountLogin();
  });

  loadRequests();

  function statusColor(status) {
    switch(status) {
      case "approved": return "green";
      case "denied": return "red";
      case "cancelled": return "gray";
      default: return "orange";
    }
  }
}

// Mount function
function mountDashboard(user) {
  mount(renderDashboard(user));
  attachDashboard(user);
}
window.renderDashboard = renderDashboard;
window.mountDashboard = mountDashboard;
