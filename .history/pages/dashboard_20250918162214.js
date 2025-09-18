// pages/dashboard.js

function renderDashboard(user = { username: "Employee" }) {
  return `
    ${renderNav()}
    <div class="container app">
      <main class="main">
        <!-- Header -->
        <div class="header">
          <div>
            <h2 style="margin:0">Dashboard</h2>
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

        <!-- Optional logout button -->
        <button id="backBtn" class="btn" style="margin-top:12px;">Logout</button>

      </main>
    </div>
  `;
}

// --- Login and Dashboard Integration ---
async function login(username, password) {
  const errorMsg = document.getElementById("loginError");

  try {
    Modal.show("Checking credentials...");

    // Fetch the user from Firestore
    const clientsCol = window.db.collection("clients");
    const snapshot = await clientsCol
      .where("username", "==", username)
      .where("password", "==", password)
      .get();

    if (!snapshot.empty) {
      const user = snapshot.docs[0].data();
      console.log("User logged in:", user);

      // Close login modal
      const loginModal = document.getElementById("loginModal");
      if (loginModal) loginModal.remove();

      // Mount dashboard for this user
      mountDashboard(user);
    } else {
      errorMsg.textContent = "Invalid username or password.";
      errorMsg.style.display = "block";
    }

    Modal.hide();
  } catch (err) {
    Modal.hide();
    console.error("Login error:", err);
    errorMsg.textContent = "Error logging in. Try again.";
    errorMsg.style.display = "block";
  }
}

// --- Dashboard Rendering ---
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
  const ordersCol = window.db.collection("it_service_orders");
  let unsubscribe = null;

  // Pass the user object here
  function loadOrders(currentUser) {
    if (unsubscribe) unsubscribe();

    unsubscribe = ordersCol
      .where("name", "==", currentUser.username) // only user's requests
      // .orderBy("dateSubmitted", "desc")
      .onSnapshot(snapshot => {
        const tbody = document.getElementById("requestsTable");
        tbody.innerHTML = "";

        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

        if (snapshot.empty) {
          tbody.innerHTML = `<tr><td colspan="5" style="padding:12px; text-align:center; color:var(--muted)">No IT service requests yet.</td></tr>`;
          updateStats(stats);
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
            <td style="padding:10px 0">${order.type || "-"}</td>
            <td style="padding:10px 0">${order.description || "-"}</td>
            <td style="padding:10px 0">${createdAt}</td>
            <td style="padding:10px 0; color:${statusColor(statusKey)}">${statusKey}</td>
            <td style="padding:10px 0">${statusKey === "pending" ? `<button class="btn btn-cancel" data-id="${doc.id}">Cancel</button>` : "-"}</td>
          `;
          tbody.appendChild(row);
        });

        updateStats(stats);

        document.querySelectorAll(".btn-cancel").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const confirmCancel = confirm("Cancel this request?");
            if (confirmCancel) {
              await ordersCol.doc(id).update({ status: "cancelled" });
              alert("Request cancelled.");
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

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (unsubscribe) unsubscribe();
      window.mountLogin();
    });
  }

  // ✅ Pass the user object here
  loadOrders(user);
}

// Mount function
function mountDashboard(user) {
  mount(renderDashboard(user));
  attachDashboard(user);
}

// Expose globally
window.renderDashboard = renderDashboard;
window.mountDashboard = mountDashboard;

