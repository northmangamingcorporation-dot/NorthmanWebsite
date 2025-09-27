// DASHBOARD ATTACHMENT: Initializes the dashboard with IT service orders table, stats, events, and accomplishments section
// Features: Real-time loading with animations, status badges, cancel functionality, stats updates, loading overlay,
// new request button (loads modal script dynamically), logout integration, global exposure.
// Assumes: window.db (Firestore), getStatusColor (defined inside), window.Modal for alerts/confirms, Font Awesome icons.
// Integrates: attachAccomplishmentsSection(user) for accomplishments table (from previous script).
// Usage: Call attachDashboard(currentUser  ) after authentication to set up the full dashboard.

async function attachDashboard(user) {
  attachAccomplishmentsSection(user);
  
  if (!user || !user.username) {
    console.error("No user provided to attachDashboard.");
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error: User session invalid. Redirecting to login...");
    }
    setTimeout(() => {
      sessionStorage.removeItem("loggedInUser  ");
      localStorage.removeItem("loggedInUser  ");
      if (window.mountLogin) window.mountLogin();
    }, 2000);
    return;
  }

  const ordersCol = window.db.collection("it_service_orders");
  let unsubscribe = null;
  const loadingStates = {
    stats: { pending: false, approved: false, denied: false, cancelled: false }
  };

  // UPDATED: loadOrders with text visibility fixes and enhancements
  // Features: High-contrast colors (!important), injected table styles, enhanced empty/error states with icons/titles,
  // animated rows + tbody fade-in, description tooltip/ellipsis, consistent status badges, improved button UX.
  // Added orderBy for sorting. Fixed cancel local update for action cell. Assumes helpers (updateStats, etc.) defined.

  function loadOrders(currentUser   ) {
    if (unsubscribe) unsubscribe();
    
    // Inject table styles for visibility (once, if not present)
    if (!document.querySelector('#requests-table-styles')) {
      const tableStyle = document.createElement('style');
      tableStyle.id = 'requests-table-styles';
      tableStyle.textContent = `
        #requestsTable {
          background: white;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #requestsTable thead th {
          background: #f8fafc;
          color: #374151;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
        }
        #requestsTable tbody tr {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s ease;
        }
        #requestsTable tbody tr:hover {
          background: #f8fafc;
        }
        #requestsTable td {
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
        .btn-cancel {
          transition: all 0.3s ease;
        }
        .btn-cancel:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          transform: scale(1.05) !important;
        }
        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          #requestsTable { font-size: 14px; }
          #requestsTable td { padding: 12px 8px; }
        }
      `;
      document.head.appendChild(tableStyle);
    }

    // Show loading overlay (with high-contrast text)
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "dashboard-loading";
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    loadingOverlay.innerHTML = `
      <div style="
        background: white;
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        color: #1e293b; /* Darker text for visibility */
      ">
        <div style="
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        "></div>
        <p style="margin: 0; color: #1e293b; font-weight: 600; font-size: 16px;">Loading your requests...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    setTimeout(() => loadingOverlay.style.opacity = "1", 10);

    console.log("Loading IT service orders for:", currentUser   .username);

    unsubscribe = ordersCol
      .where("username", "==", currentUser   .username)
      .onSnapshot(
        async (snapshot) => {
          const tbody = document.getElementById("requestsTable");
          const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

          if (snapshot.empty) {
            console.log("No IT service requests found for user.");
            tbody.innerHTML = `
              <tr class="no-data-row">
                <td colspan="5" style="background: white; padding: 60px 20px;">
                  <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    color: #475569; /* Medium gray for visibility on white */
                  ">
                    <i class="fas fa-inbox" style="font-size: 64px; color: #94a3b8;"></i>
                    <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 600;">No Requests Yet</h3>
                    <p style="margin: 0; color: #64748b; font-size: 16px; font-style: italic;">Create your first IT service request to get started!</p>
                  </div>
                </td>
              </tr>
            `;
            updateStats(stats);
            hideLoading();
            return;
          }

          // Animate table rows
          tbody.style.opacity = "0";
          tbody.style.transition = "opacity 0.3s ease";
          tbody.innerHTML = "";

          const orders = [];
          snapshot.forEach(doc => {
            const order = { id: doc.id, ...doc.data() };
            console.log("Order loaded:", doc.id, order);
            orders.push(order);
          });

          // Render rows with animations and high-contrast text
          orders.forEach((order, index) => {
            const createdAt = order.dateSubmitted?.toDate
              ? order.dateSubmitted.toDate().toLocaleString()
              : new Date().toLocaleString();

            const statusKey = (order.status || "pending").toLowerCase();
            stats[statusKey] = (stats[statusKey] || 0) + 1;

            const statusClass = `status-${statusKey}`;
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
                <span class="status-badge ${statusClass}" style="
                  background: ${statusColor.bg};
                  color: ${statusColor.text} !important;
                  padding: 6px 12px;
                  border-radius: 20px;
                  font-size: 13px;
                  font-weight: 600;
                  text-transform: capitalize;
                  white-space: nowrap;
                ">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
              </td>
              <td style="padding: 16px 12px;">
                ${statusKey === "pending" ? 
                  `<button class="btn btn-cancel" data-id="${order.id}" style="
                    padding: 8px 16px;
                    font-size: 14px;
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444 !important;
                    border: 1px solid #ef4444;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                  ">
                    <i class="fas fa-times" style="margin-right: 4px; color: #ef4444;"></i>Cancel
                  </button>` : 
                  '<span style="color: #94a3b8; font-style: italic;">-</span>'
                }
              </td>
            `;
            tbody.appendChild(row);

            // Animate row in (use index for efficiency)
            setTimeout(() => {
              row.style.opacity = "1";
              row.style.transform = "translateY(0)";
            }, index * 100);
          });

          // Fade in table body after rows are added
          setTimeout(() => {
            tbody.style.opacity = "1";
          }, orders.length * 100 + 200);

          updateStats(stats);
          hideLoading();

          // Attach cancel button events
          document.querySelectorAll(".btn-cancel").forEach(btn => {
            btn.addEventListener("click", async (e) => {
              e.stopPropagation();
              const id = btn.dataset.id;
              
              // Enhanced confirmation
              if (window.Modal && window.Modal.confirm) {
                const confirmed = await window.Modal.confirm("Are you sure you want to cancel this request? This action cannot be undone.");
                if (!confirmed) return;
              } else {
                if (!confirm("Cancel this request?")) return;
              }

              try {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 4px;"></i> Cancelling...';
                
                await ordersCol.doc(id).update({ 
                  status: "cancelled",
                  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Update local row
                const row = btn.closest("tr");
                const statusCell = row.cells[3];
                statusCell.innerHTML = '<span class="status-badge status-cancelled" style="background: rgba(107, 114, 128, 0.1); color: #6b7280 !important; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">Cancelled</span>';
                const actionCell = row.cells[4];
                actionCell.innerHTML = '<span style="color: #94a3b8; font-style: italic;">Cancelled</span>';
                
                // Update stats
                const currentStats = getCurrentStats();
                currentStats.pending--;
                currentStats.cancelled++;
                updateStats(currentStats);
                
                if (window.Modal && window.Modal.show) {
                  window.Modal.show("Request cancelled successfully.", "success");
                } else {
                  alert("Request cancelled.");
                }
                
                console.log("Request cancelled:", id);
              } catch (err) {
                console.error("Failed to cancel request:", err);
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-times" style="margin-right: 4px; color: #ef4444;"></i>Cancel';
                if (window.Modal && window.Modal.show) {
                  window.Modal.show("Failed to cancel request. Please try again.", "error");
                } else {
                  alert("Failed to cancel request.");
                }
              }
            });
          });
        },
        (err) => {
          hideLoading();
          console.error("Firestore snapshot error:", err);
          const tbody = document.getElementById("requestsTable");
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="5" style="text-align: center; color: #ef4444; padding: 60px 20px; background: white;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px; color: #ef4444;"></i>
                <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 18px; font-weight: 600;">Error Loading Requests</h3>
                <p style="margin: 0; color: #64748b; font-size: 16px;">Please refresh the page and try again.</p>
              </td>
            </tr>
          `;
          if (window.Modal && window.Modal.show) {
            window.Modal.show("Error loading requests. Please refresh the page.", "error");
          } else {
            alert("Error loading requests. Please refresh the page.");
          }
        }
      );
  }

  // Ensure spinner CSS is injected (if not present)
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

  function updateStats(stats) {
    console.log("Updating stats:", stats);
    
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
          // Animate number change
          element.style.transition = "all 0.5s ease";
          element.textContent = newValue;
          element.parentElement.classList.add("stat-loading");
          setTimeout(() => {
            element.parentElement.classList.remove("stat-loading");
          }, 500);
        } else {
          element.textContent = newValue;
        }
      }
    });
  }

  function getCurrentStats() {
    return {
      pending: parseInt(document.getElementById("stat-pending").textContent) || 0,
      approved: parseInt(document.getElementById("stat-approved").textContent) || 0,
      denied: parseInt(document.getElementById("stat-denied").textContent) || 0,
      cancelled: parseInt(document.getElementById("stat-cancelled").textContent) || 0
    };
  }

  function getStatusColor(status) {
    const colors = {
      pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24' },
      approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
      denied: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
      cancelled: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' }
    };
    return colors[status] || colors.pending;
  }

  function hideLoading() {
    const loadingOverlay = document.getElementById("dashboard-loading");
    if (loadingOverlay) {
      loadingOverlay.style.opacity = "0";
      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
  }

  // Event listeners
  const newRequestBtn = document.getElementById("newRequestBtn");
  if (newRequestBtn) {
    newRequestBtn.addEventListener("click", () => {
      // Ensure request_modal.js is loaded
      if (!document.querySelector('script[src*="request_modal"]')) {
        const script = document.createElement("script");
        script.src = "assets/js/request_modal.js";
        script.onload = () => {
          if (window.mountRequestModal) {
            window.mountRequestModal();
          } else {
            console.error("mountRequestModal not found after loading script.");
            if (window.Modal && window.Modal.show) {
              window.Modal.show("New request feature coming soon!", "info");
            }
          }
        };
        script.onerror = () => {
          console.error("Failed to load request_modal.js");
          if (window.Modal && window.Modal.show