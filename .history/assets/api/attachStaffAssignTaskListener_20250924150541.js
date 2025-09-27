// --- Attach Assign Task Event Listener for Staff Table ---
function attachStaffAssignTask() {
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".assign-task")) {
      e.preventDefault();
      const btn = e.target.closest(".assign-task");
      const staffName = btn.dataset.staff;
      
      if (!staffName) {
        showNotification("Staff name not found.", "warning");
        return;
      }

      // Assume 'admin' object is available globally (from dashboard login/session)
      // If not, pass it or fetch from localStorage/session
      const admin = window.currentAdmin || { department: 'IT', username: 'admin' }; // Fallback; replace with actual

      showNotification(`Loading pending tasks for assignment to ${staffName}...`, "info");

      try {
        // Query it_service_orders for approved/pending tasks (ready for assignment)
        // Based on sample data, using status: "approved" (adjust filter as needed, e.g., "Pending" or "Approved")
        const ordersSnapshot = await db.collection("it_service_orders")
          .where("status", "==", "approved") // Or "Pending" if that's the state before assignment
          .limit(20) // Limit for performance (adjust as needed)
          .get();

        if (ordersSnapshot.empty) {
          showNotification(`No pending tasks available for assignment.`, "info");
          return;
        }

        // Process orders data
        const pendingOrders = ordersSnapshot.docs.map(doc => {
          const order = doc.data();
          return {
            id: doc.id,
            relatedId: order.id || doc.id, // Use 'id' from data or doc.id
            type: order.type || 'Unknown',
            priority: order.priority || 'N/A',
            description: order.description || 'No description',
            employeeName: order.username || order.employeeName || 'N/A',
            department: order.department || 'N/A',
            asset: order.asset || 'N/A',
            location: order.location || 'N/A',
            dateSubmitted: order.dateSubmitted ? order.dateSubmitted.toDate().toLocaleString() : 'N/A',
            status: order.status || 'Approved'
          };
        });

        // Display pending orders for assignment
        displayPendingOrdersModal(staffName, pendingOrders, admin);

      } catch (err) {
        console.error("Error querying pending IT service orders:", err);
        showNotification("Failed to load pending tasks.", "error");
      }
    }
  });
}

// --- Modal to Display Pending Orders for Assignment ---
function displayPendingOrdersModal(staffName, pendingOrders, admin) {
  // Create or reuse a simple modal (inject if not exists)
  let modal = document.getElementById("pendingOrdersAssignModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "pendingOrdersAssignModal";
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
      padding: 16px; overflow: auto; z-index: 1200; backdrop-filter: blur(8px);
    `;
    modal.innerHTML = `
      <div style="background: white; border-radius: 12px; max-width: 1000px; width: 100%; max-height: 80vh; overflow-y: auto;
                  padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;">
        <button id="closePendingOrdersAssign" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        <h3 style="text-align: center; margin-bottom: 20px; color: #1e293b;">
          Assign Pending IT Service Orders to <strong>${staffName}</strong>
        </h3>
        <div id="pendingOrdersAssignContent" style="max-height: 60vh; overflow-y: auto;"></div>
        <div style="text-align: center; margin-top: 20px;">
          <button id="closePendingOrdersAssignBtn" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close handlers
    document.getElementById("closePendingOrdersAssign").addEventListener("click", () => modal.remove());
    document.getElementById("closePendingOrdersAssignBtn").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  }

  // Render pending orders table in modal
  const content = document.getElementById("pendingOrdersAssignContent");
  const tableHtml = `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="background: #f8fafc; font-weight: 600;">
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Type</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Employee</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Department</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Priority</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Asset/Location</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Description</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Submitted</th>
          <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e2e8f0;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${pendingOrders.map(order => {
          // Reconstruct full orderData for mountAdminITServiceModal
          const fullOrderData = {
            id: order.relatedId,
            type: order.type,
            priority: order.priority,
            asset: order.asset,
            location: order.location,
            description: order.description,
            username: order.employeeName,
            department: order.department,
            position: order.position || 'N/A', // Add if available
            contact: order.contact || 'N/A', // Add if available
            dateSubmitted: order.dateSubmitted,
            status: order.status
          };
          return `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px;">
                <span style="background: #dbeafe; color: #2563eb; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                  ${order.type}
                </span>
              </td>
              <td style="padding: 12px; font-weight: 500;">${order.employeeName}</td>
              <td style="padding: 12px; color: #64748b;">${order.department}</td>
              <td style="padding: 12px;">
                <span style="background: ${getPriorityColor(order.priority)}; color: white; padding: 4px 6px; border-radius: 3px; font-size: 11px;">
                  ${order.priority}
                </span>
              </td>
              <td style="padding: 12px; color: #64748b;">${order.asset}<br><small>${order.location}</small></td>
              <td style="padding: 12px; max-width: 200px;" title="${order.description}">${order.description.substring(0, 80)}${order.description.length > 80 ? '...' : ''}</td>
              <td style="padding: 12px; color: #64748b;">${order.dateSubmitted}</td>
              <td style="padding: 12px; text-align: center;">
                <button class="assign-to-staff-btn" 
                        data-staff="${staffName}" 
                        data-order='${JSON.stringify(fullOrderData).replace(/'/g, "\\'")}' 
                        style="padding: 6px 12px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background 0.2s;">
                  Assign to ${staffName}
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    ${pendingOrders.length === 0 ? '<p style="text-align: center; color: #64748b; padding: 40px;">No pending tasks found.</p>' : ''}
  `;
  content.innerHTML = tableHtml;

  // Attach event listeners for assign buttons
  content.querySelectorAll(".assign-to-staff-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const orderData = JSON.parse(e.currentTarget.dataset.order.replace(/\\'/g, "'"));
      const selectedStaff = e.currentTarget.dataset.staff;

      // Close the pending orders modal
      modal.remove();

      // Open the full IT Service assignment modal, pre-filled with this order and staff
      // Note: mountAdminITServiceModal will populate staff dropdown; we can pre-select or directly assign
      // For now, open the modal; you can modify mountAdminITServiceModal to pre-select staff if needed
      mountAdminITServiceModal(admin, orderData);

      // Optional: Pre-select staff in the modal (add this to mountAdminITServiceModal if not already)
      setTimeout(() => {
        const staffDropdown = document.getElementById("staffDropdown");
        if (staffDropdown) {
          const option = Array.from(staffDropdown.options).find(opt => opt.value.includes(selectedStaff));
          if (option) {
            staffDropdown.value = option.value;
            showNotification(`Pre-selected ${selectedStaff} for assignment.`, "info");
          }
        }
      }, 500); // Delay to allow modal to render

      showNotification(`Opening assignment for ${orderData.type} to ${selectedStaff}...`, "info");
    });
  });

  modal.style.display = "flex";
}

// --- Helper: Get Priority Color (reused from previous) ---
function getPriorityColor(priority) {
  const colors = {
    'HIGH': '#ef4444',
    'MEDIUM': '#f59e0b',
    'LOW': '#10b981',
    'N/A': '#6b7280'
  };
  return colors[priority] || '#6b7280';
}

// --- Initialize the listener (call this after rendering the dashboard) ---
document.addEventListener("DOMContentLoaded", attachStaffAssignTask);

// Export for global access
window.attachStaffAssignTask = attachStaffAssignTask;