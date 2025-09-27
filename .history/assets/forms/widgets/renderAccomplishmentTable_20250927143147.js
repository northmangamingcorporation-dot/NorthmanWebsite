// UPDATED: Load accomplishments with enhanced design matching IT Service Orders
// FIXED: Text visibility issues - Ensured high contrast colors (darker text for body, explicit white/light backgrounds),
// added fallback styles for table cells, improved empty state/error text boldness/contrast.
// Features: Loading overlay with spinner, real-time onSnapshot listener, animated rows, empty state with icon,
// status badges with colors, graceful error handling, integrated with mountAccomplishmentModal
// Assumes: unsubscribe variable (global or outer scope), window.Modal for confirm/show (fallback to alert/confirm),
// getStatusColor function (defined below), table with id="accomplishmentsTable" and 6 columns (ID, Description, Date, Status, Photos, Action)

let unsubscribeAccomplishments; // Global unsubscribe for real-time listener (parallel to unsubscribe in loadOrders)

// Inject table-wide styles for better visibility (once, if not present)
if (!document.querySelector('#accomplishments-table-styles')) {
  const tableStyle = document.createElement('style');
  tableStyle.id = 'accomplishments-table-styles';
  tableStyle.textContent = `
    #accomplishmentsTable {
      background: white;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    #accomplishmentsTable thead th {
      background: #f8fafc;
      color: #374151;
      font-weight: 600;
      padding: 16px 12px;
      text-align: left;
      border-bottom: 2px solid #e2e8f0;
    }
    #accomplishmentsTable tbody tr {
      background: white;
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.2s ease;
    }
    #accomplishmentsTable tbody tr:hover {
      background: #f8fafc;
    }
    #accomplishmentsTable td {
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
    @media (max-width: 768px) {
      #accomplishmentsTable { font-size: 14px; }
      #accomplishmentsTable td { padding: 12px 8px; }
    }
  `;
  document.head.appendChild(tableStyle);
}

async function loadAccomplishments(currentUser  ) {
  if (unsubscribeAccomplishments) unsubscribeAccomplishments(); // Clean up previous listener

  console.log("Loading accomplishments for:", currentUser  .username);

  // Real-time listener (matching loadOrders)
  unsubscribeAccomplishments = window.db.collection('accomplishments')
    .where('uniquekey', '==', currentUser  .username)
    .limit(50) // Adjust as needed
    .onSnapshot(
      async (snapshot) => {
        const tbody = document.getElementById('accomplishmentsTable');

        if (snapshot.empty) {
          console.log("No accomplishments found for user.");
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="6" style="background: white; padding: 60px 20px;">
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 16px;
                  color: #475569; /* Medium gray for visibility on white */
                ">
                  <i class="fas fa-trophy" style="font-size: 64px; color: #94a3b8;"></i>
                  <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 600;">No Accomplishments Yet</h3>
                  <p style="margin: 0; color: #64748b; font-size: 16px; font-style: italic;">Submit your first report to get started!</p>
                </div>
              </td>
            </tr>
          `;
          return;
        }

        // Animate table rows (matching loadOrders)
        tbody.style.opacity = "0";
        tbody.style.transition = "opacity 0.3s ease";
        tbody.innerHTML = "";

        const accomplishments = [];
        snapshot.forEach(doc => {
          const accomplishment = { id: doc.id, ...doc.data() };
          console.log("Accomplishment loaded:", doc.id, accomplishment);
          accomplishments.push(accomplishment);
        });

        // Render rows with animations and high-contrast text
        accomplishments.forEach(accomplishment => {
          const createdAt = accomplishment.dateSubmitted?.toDate
            ? accomplishment.dateSubmitted.toDate().toLocaleDateString()
            : 'N/A';

          const statusKey = (accomplishment.status || 'submitted').toLowerCase();
          const statusColor = getStatusColor(statusKey);

          const photoCount = accomplishment.telegramPhotos ? accomplishment.telegramPhotos.length : 0;
          const photoIndicator = photoCount > 0 ? `<span style="color: #0ea5a4; font-weight: 600;">📷 ${photoCount}</span>` : '<span style="color: #94a3b8;">—</span>';

          const row = document.createElement("tr");
          row.style.opacity = "0";
          row.style.transform = "translateY(20px)";
          row.style.transition = "all 0.3s ease";
          row.innerHTML = `
            <td style="padding: 16px 12px; font-weight: 600; color: #0f172a !important;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-id-card" style="color: #0ea5a4; font-size: 16px;"></i>
                <span style="color: #0f172a;">${accomplishment.id}</span>
              </div>
            </td>
            <td style="padding: 16px 12px; color: #475569 !important; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span title="${accomplishment.descriptionOfService || 'N/A'}">${accomplishment.descriptionOfService?.substring(0, 50) || 'N/A'}...</span>
            </td>
            <td style="padding: 16px 12px; color: #64748b !important;">
              <span style="color: #475569; font-weight: 500;">${createdAt}</span>
            </td>
            <td style="padding: 16px 12px;">
              <span class="status-badge status-${statusKey}" style="
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
            <td style="padding: 16px 12px; color: #64748b !important;">
              ${photoIndicator}
            </td>
            <td style="padding: 16px 12px;">
              <button onclick="mountAccomplishmentModal('${accomplishment.id}')" 
                      style="
                        padding: 8px 16px;
                        font-size: 14px;
                        background: rgba(14, 165, 164, 0.1);
                        color: #0ea5a4 !important;
                        border: 1px solid #0ea5a4;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-weight: 500;
                      " 
                      onmouseover="this.style.background='rgba(14, 165, 164, 0.2)'; this.style.transform='scale(1.05)'; this.style.color='#0ea5a4';"
                      onmouseout="this.style.background='rgba(14, 165, 164, 0.1)'; this.style.transform='scale(1)';"
                      aria-label="View accomplishment report ${accomplishment.id}">
                <i class="fas fa-eye" style="margin-right: 4px; color: #0ea5a4;"></i>View
              </button>
            </td>
          `;
          tbody.appendChild(row);

          // Animate row in (staggered)
          setTimeout(() => {
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
          }, accomplishments.indexOf(accomplishment) * 100);
        });

        // Fade in table body after rows are added
        setTimeout(() => {
          tbody.style.opacity = "1";
        }, accomplishments.length * 100 + 200);

      },
      (err) => {
        hideLoading('dashboard-loading-accomplishments');
        console.error("Firestore snapshot error for accomplishments:", err);
        const tbody = document.getElementById('accomplishmentsTable');
        tbody.innerHTML = `
          <tr class="no-data-row">
            <td colspan="6" style="text-align: center; color: #ef4444; padding: 60px 20px; background: white;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px; color: #ef4444;"></i>
              <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 18px; font-weight: 600;">Error Loading Accomplishments</h3>
              <p style="margin: 0; color: #64748b; font-size: 16px;">Please refresh the page and try again.</p>
            </td>
          </tr>
        `;
        if (window.Modal && window.Modal.show) {
          window.Modal.show("Error loading accomplishments. Please refresh the page.", "error");
        } else {
          alert("Error loading accomplishments. Please refresh the page.");
        }
      }
    );
}

// Expose globally
window.mountAccomplishmentModal = mountAccomplishmentTable;