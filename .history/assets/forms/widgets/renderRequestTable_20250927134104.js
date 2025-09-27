// --- Initialize the listener (call this after rendering the dashboard) ---
document.addEventListener("DOMContentLoaded", attachStaffViewDetails);

// Export for global access
window.attachStaffViewDetails = attachStaffViewDetails;

// --- Enhanced Attach Staff View Details ---
// UPDATED: Expanded to load data from three collections: travel_orders, it_service_orders, and drivers_trip_tickets.
// Each has a dedicated real-time loader (loadTravelOrders, loadITServiceOrders, loadTripTickets) with consistent design:
// - Per-section loading overlays, animated rows, empty/error states with icons/titles, high-contrast text, status badges.
// - Shared styles injected for all tables (add class="dashboard-table" to HTML tables).
// - Stats: Retained for IT service orders; placeholders for travel/trip (extend if needed).
// - Actions: Cancel for pending IT; View buttons for travel/trip (calling openTravelModal/openTripModal - implement separately).
// - Assumes: attachAccomplishmentsSection(user) loads accomplishments; Font Awesome loaded; table HTML with IDs (travelTable, requestsTable, tripTicketsTable).
// - Query: Filters by "username" (adjust to "uniquekey" if needed); orders by "dateSubmitted" desc.
// - Helpers: Shared getStatusColor, hideLoading; updateStats for IT.

async function attachStaffViewDetails(user) {
  attachAccomplishmentsSection(user);
  
  if (!user || !user.username) {
    console.error("No user provided to attachStaffViewDetails.");
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error: User session invalid. Redirecting to login...", "error");
    }
    setTimeout(() => {
      sessionStorage.removeItem("loggedInUser    ");
      localStorage.removeItem("loggedInUser    ");
      if (window.mountLogin) window.mountLogin();
    }, 2000);
    return;
  }

  // Firestore collections
  const travelCol = window.db.collection("travel_orders");
  const ordersCol = window.db.collection("it_service_orders");
  const tripCol = window.db.collection("drivers_trip_tickets");
  
  // Unsubscribe handlers for each section
  let unsubscribeTravel = null;
  let unsubscribeIT = null;
  let unsubscribeTrip = null;
  
  const loadingStates = {
    stats: { pending: false, approved: false, denied: false, cancelled: false }
  };

  // Inject shared table styles for all dashboard tables (once, if not present)
  if (!document.querySelector('#dashboard-table-styles')) {
    const tableStyle = document.createElement('style');
    tableStyle.id = 'dashboard-table-styles';
    tableStyle.textContent = `
      .dashboard-table {
        background: white;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        width: 100%;
      }
      .dashboard-table thead th {
        background: #f8fafc;
        color: #374151;
        font-weight: 600;
        padding: 16px 12px;
        text-align: left;
        border-bottom: 2px solid #e2e8f0;
      }
      .dashboard-table tbody tr {
        background: white;
        border-bottom: 1px solid #f1f5f9;
        transition: background 0.2s ease;
      }
      .dashboard-table tbody tr:hover {
        background: #f8fafc;
      }
      .dashboard-table td {
        padding: 16px 12px;
        color: #1e293b; /* Darker base color for better visibility */
        vertical-align: middle;
      }
      .no-data-row td {
        background: white !important;
        text-align: center !important;
      }
      .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        text-transform: capitalize;
        white-space: nowrap;
      }
      .btn-cancel, .btn-view {
        transition: all 0.3s ease;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      }
      .btn-cancel:hover { background: rgba(239, 68, 68, 0.2) !important; transform: scale(1.05) !important; }
      .btn-view:hover { background: rgba(14, 165, 164, 0.2) !important; transform: scale(1.05) !important; }
      .btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }
      @media (max-width: 768px) {
        .dashboard-table { font-size: 14px; }
        .dashboard-table td { padding: 12px 8px; }
      }
    `;
    document.head.appendChild(tableStyle);
  }

  // Shared helper: Hide loading overlay by ID
  function hideLoading(loadingId) {
    const overlay = document.getElementById(loadingId);
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
      }, 300);
    }
  }

  // Shared helper: Status colors (extended for all sections)
  function getStatusColor(statusKey) {
    const colors = {
      pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
      approved: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
      denied: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
      cancelled: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
      submitted: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
      completed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
      default: { bg: 'rgba(107, 114, 128, 0.1)', text: '#374151' } // Darker default
    };
    return colors[statusKey] || colors.default;
  }

  // IT Service Orders Loader (enhanced with visibility fixes)
  function loadITServiceOrders(currentUser   ) {
    if (unsubscribeIT) unsubscribeIT();
    
    const loadingId = "dashboard-loading-it";
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = loadingId;
    loadingOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(10px);
      display: flex; justify-content: center; align-items: center;
      z-index: 2000; opacity: 0; transition: opacity 0.3s ease;
    `;
    loadingOverlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); color: #1e293b;">
        <div style="width: 48px; height: 48px; border: 4px solid #e2e8f0; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
        <p style="margin: 0; color: #1e293b; font-weight: 600; font-size: 16px;">Loading your IT requests...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    setTimeout(() => loadingOverlay.style.opacity = "1", 10);

    console.log("Loading IT service orders for:", currentUser   .username);

    unsubscribeIT = ordersCol
      .where("username", "==", currentUser   .username)
      .orderBy("dateSubmitted", "desc")
      .onSnapshot(async (snapshot) => {
        const tbody = document.getElementById("requestsTable");
        if (!tbody) return;
        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

        if (snapshot.empty) {
          console.log("No IT service requests found for user.");
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="5" style="background: white; padding: 60px 20px;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; color: #475569;">
                  <i class="fas fa-inbox" style="font-size: 64px; color: #94a3b8;"></i>
                  <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 600;">No IT Requests Yet</h3>
                  <p style="margin: 0; color: #64748b; font-size: 16px; font-style: italic;">Create your first IT service request to get started!</p>
                </div>
              </td>
            </tr>
          `;
          updateStats(stats);
          hideLoading(loadingId);
          return;
        }

        tbody.style.opacity = "0";
        tbody.style.transition = "opacity 0.3s ease";
        tbody.innerHTML = "";

        const orders = [];
        snapshot.forEach(doc => {
          const order = { id: doc.id, ...doc.data() };
          console.log("Order loaded:", doc.id, order);
          orders.push(order);
        });

        orders.forEach((order, index) => {
          const createdAt = order.dateSubmitted?.toDate ? order.dateSubmitted.toDate().toLocaleString() : new Date().toLocaleString();
          const statusKey = (order.status || "pending").toLowerCase();
          stats[statusKey] = (stats[statusKey] || 0) + 1;
          const statusColor = getStatusColor(statusKey);

          const row = document.createElement("tr");
          row.style.opacity = "0";
          row.style.transform = "translateY(20px)";
          row.style.transition = "all 0.3s ease";
          row.innerHTML = `
            <td style="padding: 16px 12px; font-weight: 600; color: #0f172a !important;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-cog" style="color: #3b82f6; font-size: 16px;"></i>
                <span style="color: #0f172a;">${order.type || "-"}</span>
              </div>
            </td>
            <td style="padding: 16px 12px; color: #475569 !important; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span title="${order.description || '-'}">${order.description?.substring(0, 50) || "-"}...</span>
            </td>
            <td style="padding: 16px 12px; color: #64748b !important;">
              <span style="color: #475569; font-weight: 500;">${createdAt}</span>
            </td>
            <td style="padding: 16px 12px;">
              <span class="status-badge" style="background: ${statusColor.bg}; color: ${statusColor.text} !important; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
            </td>
            <td style="padding: 16px 12px;">
              ${statusKey === "pending" ? 
                `<button class="btn btn-cancel" data-id="${order.id}" style="padding: 8px 16px; font-size: 14px; background: rgba(239, 68, 68, 0.1); color: #ef4444 !important; border: 1px solid #ef4444;">
                  <i class="fas fa-times" style="margin-right: 4px; color: #ef4444;"></i>Cancel
                </button>` : 
                '<span style="color: #94a3b8; font-style: italic;">-</span>'
              }
            </td>
          `;
          tbody.appendChild(row);

          setTimeout(() => {
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
          }, index * 100);
        });

        setTimeout(() => tbody.style.opacity = "1", orders.length * 100 + 200);
        updateStats(stats);
        hideLoading(loadingId);

        // Attach cancel button events
        document.querySelectorAll(".btn-cancel").forEach(btn => {
          btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            
            const confirmed = (window.Modal && window.Modal.confirm) 
              ? await window.Modal.confirm("Are you sure you want to cancel this request? This action cannot be undone.")
              : confirm("Cancel this request?");
            if (!confirmed) return;

            try {
              btn.disabled = true;
              btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 4px;"></i> Cancelling...';
              
              await ordersCol.doc(id).update({ 
                status: "cancelled",
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
              
              // Update local row
              const row = btn.closest("tr");
              row.cells[3].innerHTML = '<span class="status-badge" style="background: rgba(107, 114, 128, 0.1); color: #6b7280 !important; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">Cancelled</span>';
              row.cells[4].innerHTML = '<span style="color: #94a3b8; font-style: italic;">Cancelled</span>';
              
              // Update stats
              const currentStats = getCurrentStats();
              currentStats.pending--;
              currentStats.cancelled++;
              updateStats(currentStats);
              
              if (window.Modal && window.Modal.show) {
                window.Modal.show("Request cancelled successfully.", "success");
              } else {
                alert("Request cancelled successfully.");
              }
              
              console.log("Request cancelled:", id);
            } catch (err) {
              console.error("Failed to cancel request:", err);
              btn.disabled = false;
              btn.innerHTML = '<i class="fas fa-times" style="margin-right: 4px; color: #ef4444;"></i>Cancel';
              if (window.Modal && window.Modal.show) {
                window.Modal.show("Failed to cancel request. Please try again.", "error");
              } else {
                alert("Failed to cancel request. Please try again.");
              }
            }
          });
        });
      }, (err) => {
        hideLoading(loadingId);
        console.error("Firestore snapshot error for IT:", err);
        const tbody = document.getElementById("requestsTable");
        if (tbody) {
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="5" style="text-align: center; color: #ef4444; padding: 60px 20px; background: white;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px; color: #ef4444;"></i>
                <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 18px; font-weight: 600;">Error Loading IT Requests</h3>
                <p style="margin: 0; color: #64748b; font-size: 16px;">Please refresh the page and try again.</p>
              </td>
            </tr>
          `;
        }
        if (window.Modal && window.Modal.show) {
          window.Modal.show("Error loading IT requests. Please refresh the page.", "error");
        } else {
          alert("Error loading IT requests. Please refresh the page.");
        }
      });
  }

  // Travel Orders Loader (adapt fields as needed: e.g., destination, description, status)
  function loadTravelOrders(currentUser   ) {
    if (unsubscribeTravel) unsubscribeTravel();
    
    const loadingId = "dashboard-loading-travel";
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = loadingId;
    loadingOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(10px);
      display: flex; justify-content: center; align-items: center;
      z-index: 2000; opacity: 0; transition: opacity 0.3s ease;
    `;
    loadingOverlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); color: #1e293b;">
        <div style="width: 48px; height: 48px; border: 4px solid #e2e8f0; border-top: 4px solid #0ea5a4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
        <p style="margin: 0; color: #1e293b; font-weight: 600; font-size: 16px;">Loading your travel orders...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    setTimeout(() => loadingOverlay.style.opacity = "1", 10);

    console.log("Loading travel orders for:", currentUser   .username);

    unsubscribeTravel = travelCol
      .where("username", "==", currentUser.username)
      .onSnapshot(async (snapshot) => {
  const tbody = document.getElementById("travelTable");
  if (!tbody) return;

  if (snapshot.empty) {
    tbody.innerHTML = `
      <tr class="no-data-row">
        <td colspan="5" style="background: white; padding: 60px 20px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; color: #475569;">
            <i class="fas fa-plane" style="font-size: 64px; color: #94a3b8;"></i>
            <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 600;">No Travel Orders Yet</h3>
            <p style="margin: 0; color: #64748b; font-size: 16px; font-style: italic;">Submit your first travel request to get started!</p>
          </div>
        </td>
      </tr>
    `;
    // Update travel stats if elements exist (placeholder; extend as needed)
    updateSectionStats("travel", { pending: 0, approved: 0, denied: 0, cancelled: 0 });
    hideLoading(loadingId);
    return;
  }

  tbody.style.opacity = "0";
  tbody.style.transition = "opacity 0.3s ease";
  tbody.innerHTML = "";

  const orders = [];
  snapshot.forEach(doc => {
    const order = { id: doc.id, ...doc.data() };
    console.log("Travel order loaded:", doc.id, order);
    orders.push(order);
  });

  orders.forEach((order, index) => {
    const createdAt = order.dateSubmitted?.toDate ? order.dateSubmitted.toDate().toLocaleString() : new Date().toLocaleString();
    const statusKey = (order.status || "pending").toLowerCase();
    // Update travel stats
    const travelStats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };
    travelStats[statusKey] = (travelStats[statusKey] || 0) + 1;
    updateSectionStats("travel", travelStats);
    const statusColor = getStatusColor(statusKey);

    const row = document.createElement("tr");
    row.style.opacity = "0";
    row.style.transform = "translateY(20px)";
    row.style.transition = "all 0.3s ease";
    row.innerHTML = `
      <td style="padding: 16px 12px; font-weight: 600; color: #0f172a !important;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-plane" style="color: #3b82f6; font-size: 16px;"></i>
          <span style="color: #0f172a;">${order.destination || order.type || "-"}</span> <!-- Adapt to your fields -->
        </div>
      </td>
      <td style="padding: 16px 12px; color: #475569 !important; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span title="${order.description || '-'}">${order.description?.substring(0, 50) || "-"}...</span>
      </td>
      <td style="padding: 16px 12px; color: #64748b !important;">
        <span style="color: #475569; font-weight: 500;">${createdAt}</span>
      </td>
      <td style="padding: 16px 12px;">
        <span class="status-badge" style="background: ${statusColor.bg}; color: ${statusColor.text} !important; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
      </td>
      <td style="padding: 16px 12px;">
        <button class="btn btn-view" onclick="openTravelModal('${order.id}')" style="padding: 8px 16px; font-size: 14px; background: rgba(14, 165, 164, 0.1); color: #0ea5a4 !important; border: 1px solid #0ea5a4;">
          <i class="fas fa-eye" style="margin-right: 4px; color: #0ea5a4;"></i>View
        </button>
      </td>
    `;
    tbody.appendChild(row);

    setTimeout(() => {
      row.style.opacity = "1";
      row.style.transform = "translateY(0)";
    }, index * 100);
  });

  setTimeout(() => tbody.style.opacity = "1", orders.length * 100 + 200);
  hideLoading(loadingId);
}, (err) => {
  hideLoading(loadingId);
  console.error("Firestore snapshot error for Travel:", err);
  const tbody = document.getElementById("travelTable");
  if (tbody) {
    tbody.innerHTML = `
      <tr class="no-data-row">
        <td colspan="5" style="text-align: center; color: #ef4444; padding: 60px 20px; background: white;">
          <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px; color: #ef4444;"></i>
          <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 18px; font-weight: 600;">Error Loading Travel Orders</h3>
          <p style="margin: 0; color: #64748b; font-size: 16px;">Please refresh the page and try again.</p>
        </td>
      </tr>
    `;
  }
  if (window.Modal && window.Modal.show) {
    window.Modal.show("Error loading travel orders. Please refresh the page.", "error");
  } else {
    alert("Error loading travel orders. Please refresh the page.");
  }
});
  }

  // Drivers Trip Tickets Loader (adapt fields as needed: e.g., vehicle, route, description, status)
  function loadTripTickets(currentUser     ) {
    if (unsubscribeTrip) unsubscribeTrip();
    
    const loadingId = "dashboard-loading-trip";
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = loadingId;
    loadingOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(10px);
      display: flex; justify-content: center; align-items: center;
      z-index: 2000; opacity: 0; transition: opacity 0.3s ease;
    `;
    loadingOverlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); color: #1e293b;">
        <div style="width: 48px; height: 48px; border: 4px solid #e2e8f0; border-top: 4px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
        <p style="margin: 0; color: #1e293b; font-weight: 600; font-size: 16px;">Loading your trip tickets...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    setTimeout(() => loadingOverlay.style.opacity = "1", 10);

    console.log("Loading trip tickets for:", currentUser     .username);

    unsubscribeTrip = tripCol
      .where("username", "==", currentUser     .username)
      .orderBy("dateSubmitted", "desc")
      .onSnapshot(async (snapshot) => {
        const tbody = document.getElementById("tripTicketsTable");
        if (!tbody) return;

        if (snapshot.empty) {
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="5" style="background: white; padding: 60px 20px;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; color: #475569;">
                  <i class="fas fa-road" style="font-size: 64px; color: #94a3b8;"></i>
                  <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 600;">No Trip Tickets Yet</h3>
                  <p style="margin: 0; color: #64748b; font-size: 16px; font-style: italic;">Log your first trip to get started!</p>
                </div>
              </td>
            </tr>
          `;
          // Update trip stats if elements exist (placeholder)
          updateSectionStats("trip", { pending: 0, completed: 0, approved: 0 });
          hideLoading(loadingId);
          return;
        }

        tbody.style.opacity = "0";
        tbody.style.transition = "opacity 0.3s ease";
        tbody.innerHTML = "";

        const tickets = [];
        snapshot.forEach(doc => {
          const ticket = { id: doc.id, ...doc.data() };
          console.log("Trip ticket loaded:", doc.id, ticket);
          tickets.push(ticket);
        });

        tickets.forEach((ticket, index) => {
          const createdAt = ticket.dateSubmitted?.toDate ? ticket.dateSubmitted.toDate().toLocaleString() : new Date().toLocaleString();
          const statusKey = (ticket.status || "pending").toLowerCase();
          // Update trip stats
          const tripStats = { pending: 0, completed: 0, approved: 0 };
          tripStats[statusKey] = (tripStats[statusKey] || 0) + 1;
          updateSectionStats("trip", tripStats);
          const statusColor = getStatusColor(statusKey);

          const row = document.createElement("tr");
          row.style.opacity = "0";
          row.style.transform = "translateY(20px)";
          row.style.transition = "all 0.3s ease";
          row.innerHTML = `
            <td style="padding: 16px 12px; font-weight: 600; color: #0f172a !important;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-truck" style="color: #10b981; font-size: 16px;"></i>
                <span style="color: #0f172a;">${ticket.vehicle || ticket.route || "-"}</span> <!-- Adapt to your fields -->
              </div>
            </td>
            <td style="padding: 16px 12px; color: #475569 !important; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span title="${ticket.description || '-'}">${ticket.description?.substring(0, 50) || "-"}...</span>
            </td>
            <td style="padding: 16px 12px; color: #64748b !important;">
              <span style="color: #475569; font-weight: 500;">${createdAt}</span>
            </td>
            <td style="padding: 16px 12px;">
              <span class="status-badge" style="background: ${statusColor.bg}; color: ${statusColor.text} !important; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
            </td>
            <td style="padding: 16px 12px;">
              <button class="btn btn-view" onclick="openTripModal('${ticket.id}')" style="padding: 8px 16px; font-size: 14px; background: rgba(14, 165, 164, 0.1); color: #0ea5a4 !important; border: 1px solid #0ea5a4;">
                <i class="fas fa-eye" style="margin-right: 4px; color: #0ea5a4;"></i>View
              </button>
            </td>
          `;
          tbody.appendChild(row);

          setTimeout(() => {
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
          }, index * 100);
        });

        setTimeout(() => tbody.style.opacity = "1", tickets.length * 100 + 200);
        hideLoading(loadingId);
      }, (err) => {
        hideLoading(loadingId);
        console.error("Firestore snapshot error for Trip Tickets:", err);
        const tbody = document.getElementById("tripTicketsTable");
        if (tbody) {
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="5" style="text-align: center; color: #ef4444; padding: 60px 20px; background: white;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px; color: #ef4444;"></i>
                <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 18px; font-weight: 600;">Error Loading Trip Tickets</h3>
                <p style="margin: 0; color: #64748b; font-size: 16px;">Please refresh the page and try again.</p>
              </td>
            </tr>
          `;
        }
        if (window.Modal && window.Modal.show) {
          window.Modal.show("Error loading trip tickets. Please refresh the page.", "error");
        } else {
          alert("Error loading trip tickets. Please refresh the page.");
        }
      });
  }

  // IT Stats Updater (original; for stat-pending, etc. elements)
  function updateStats(stats) {
    console.log("Updating IT stats:", stats);
    const statElements = {
      pending: document.getElementById("stat-pending"),
      approved: document.getElementById("stat-approved"),
      denied: document.getElementById("stat-denied"),
      cancelled: document.getElementById("stat-cancelled")
    };

    Object.keys(stats).forEach(key => {
      if (statElements[key]) {
        const element = statElements[key];
        const oldValue = parseInt(element.textContent) || 0;
        const newValue = stats[key] || 0;
        if (newValue !== oldValue) {
          element.style.transition = "all 0.5s ease";
          element.textContent = newValue;
          if (element.parentElement) {
            element.parentElement.classList.add("stat-loading");
            setTimeout(() => element.parentElement.classList.remove("stat-loading"), 500);
          }
        } else {
          element.textContent = newValue;
        }
      }
    });
  }

  // Placeholder for section stats (travel/trip; extend with specific elements if needed)
  function updateSectionStats(section, stats) {
    console.log(`Updating ${section} stats:`, stats);
    // Example: const elements = { pending: document.getElementById(`stat-${section}-pending`) };
    // Implement animation similar to updateStats if HTML elements exist
  }

  function getCurrentStats() {
    return {
      pending: parseInt(document.getElementById("stat-pending")?.textContent) || 0,
      approved: parseInt(document.getElementById("stat-approved")?.textContent) || 0,
      denied: parseInt(document.getElementById("stat-denied")?.textContent) || 0,
      cancelled: parseInt(document.getElementById("stat-cancelled")?.textContent) || 0
    };
  }

  // Ensure spinner CSS is injected (once)
  if (!document.querySelector('#spinner-animation')) {
    const spinnerStyle = document.createElement('style');
    spinnerStyle.id = 'spinner-animation';
    spinnerStyle.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyle);
  }

  // Initialize all section loaders
  loadTravelOrders(user);
  loadITServiceOrders(user);
  loadTripTickets(user);
}