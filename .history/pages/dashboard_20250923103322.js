// pages/dashboard.js

//-- Dashboard Rendering ---
function renderDashboard(user = { username: "Employee" }) {
  return `
    ${renderNav()}
    <div class="container app">
      <main class="main">
        <div class="header">
          <div>
            <h2 style="margin:0">Dashboard</h2>
            <div style="color:var(--muted)">Welcome, ${user.username}</div>
          </div>
          <div style="display:flex; gap:12px; align-items:center">
            <img src="https://i.pravatar.cc/44" alt="avatar" style="border-radius:999px; border:2px solid #eee;">
          </div>
        </div>

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

        <div class="table">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 style="margin:0">My Requests</h4>
            <button id="newRequestBtn" class="btn" onClick="mountRequestModal('${user.username}')">+ New Request</button>
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

        <button id="backBtn" class="btn" style="margin-top:12px;">Logout</button>
      </main>
    </div>
  `;
}

// --- Attach Dashboard ---
async function attachDashboard(user) {
  if (!user || !user.username) {
    console.error("No user provided to attachDashboard.");
    return;
  }

  const ordersCol = window.db.collection("it_service_orders");
  let unsubscribe = null;

  function loadOrders(currentUser) {
    if (unsubscribe) unsubscribe();
    Modal.show("Loading your requests...");
    console.log("Loading IT service orders for:", currentUser.username);

    unsubscribe = ordersCol
      .where("username", "==", currentUser.username) // Filter by current user
      // .orderBy("dateSubmitted", "desc") // Uncomment after creating index
      .onSnapshot(
        snapshot => {
          const tbody = document.getElementById("requestsTable");
          tbody.innerHTML = "";

          const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

          if (snapshot.empty) {
            console.log("No IT service requests found for user.");
            tbody.innerHTML = `<tr><td colspan="5" style="padding:12px; text-align:center; color:var(--muted)">No IT service requests yet.</td></tr>`;
            updateStats(stats);
            return;
          }

          snapshot.forEach(doc => {
            const order = doc.data();
            console.log("Order loaded:", doc.id, order);

            const createdAt = order.dateSubmitted?.toDate
              ? order.dateSubmitted.toDate().toLocaleString()
              : "-";

            const statusKey = (order.status || "pending").toLowerCase();
            stats[statusKey] = (stats[statusKey] || 0) + 1;

            const row = document.createElement("tr");
            row.style.borderTop = "1px solid #f1f5f9";
            row.innerHTML = `
              <td style="padding:10px 0">${order.type || "-"}</td>
              <td style="padding:10px 0">${order.description || "-"}</td>
              <td style="padding:10px 0">${createdAt}</td>
              <td style="padding:10px 0; color:${statusColor(statusKey)}">${statusKey}</td>
              <td style="padding:10px 0">${statusKey === "pending" ? `<button class="btn btn-cancel" data-id="${doc.id}">Cancel</button>` : "-"}</td>
            `;
            tbody.appendChild(row);
          });

          updateStats(stats);

          // Attach cancel button events
          document.querySelectorAll(".btn-cancel").forEach(btn => {
            btn.addEventListener("click", async () => {
              const id = btn.dataset.id;
              const confirmCancel = confirm("Cancel this request?");
              if (!confirmCancel) return;

              try {
                await ordersCol.doc(id).update({ status: "cancelled" });
                alert("Request cancelled.");
                console.log("Request cancelled:", id);
              } catch (err) {
                console.error("Failed to cancel request:", err);
                alert("Failed to cancel request.");
              }
            });
          });
          Modal.hide();
        },
        err => {
          Modal.hide();
          console.error("Firestore snapshot error:", err);
        }
      );
  }

  function updateStats(stats) {
    console.log("Updating stats:", stats);
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
      default: return "orange"; // pending
    }
  }

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      console.log("Logging out...");
      if (unsubscribe) unsubscribe();
      window.mountLogin();
    });
  }

  loadOrders(user);
}

// --- Mount Dashboard ---
function mountDashboard(user) {
  if (!user) {
    console.error("No user provided for mountDashboard.");
    return;
  }

  mount(renderDashboard(user));
  attachDashboard(user);
}


// Expose globally
window.renderDashboard = renderDashboard;
window.mountDashboard = mountDashboard;
