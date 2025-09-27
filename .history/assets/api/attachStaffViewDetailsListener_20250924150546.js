// --- Attach View Details Event Listener for Staff Table ---
function attachStaffViewDetails() {
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".view-details")) {
      e.preventDefault();
      const btn = e.target.closest(".view-details");
      const staffName = btn.dataset.staff;
      
      if (!staffName) {
        showNotification("Staff name not found.", "warning");
        return;
      }

      showNotification(`Loading tasks for ${staffName}...`, "info");

      try {
        // Query ITdepartment_tasks for this specific staff
        const tasksSnapshot = await db.collection("ITdepartment_tasks")
          .where("staff", "==", staffName)

          .limit(50) // Limit for performance (adjust as needed)
          .get();

        if (tasksSnapshot.empty) {
          showNotification(`No tasks found for ${staffName}.`, "info");
          return;
        }

        // Process tasks data
        const tasks = tasksSnapshot.docs.map(doc => {
          const task = doc.data();
          const details = task.details || {};
          return {
            id: doc.id,
            type: task.type || 'Unknown',
            relatedId: task.relatedId || 'N/A',
            status: task.status || 'Pending',
            createdAt: task.createdAt ? task.createdAt.toDate().toLocaleString() : 'N/A',
            priority: details.priority || 'N/A',
            description: details.description || 'No description',
            remarks: task.remarks || '',
            asset: details.asset || 'N/A',
            location: details.location || 'N/A'
          };
        });

        // Display tasks (simple modal or console for now; extend as needed)
        displayStaffTasksModal(staffName, tasks);

      } catch (err) {
        console.error("Error querying staff tasks:", err);
        showNotification("Failed to load staff tasks.", "error");
      }
    }
  });
}

// --- Simple Modal to Display Staff Tasks (minimal implementation) ---
function displayStaffTasksModal(staffName, tasks) {
  // Create or reuse a simple modal (inject if not exists)
  let modal = document.getElementById("staffTasksQuickModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "staffTasksQuickModal";
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
      padding: 16px; overflow: auto; z-index: 1200; backdrop-filter: blur(8px);
    `;
    modal.innerHTML = `
      <div style="background: white; border-radius: 12px; max-width: 900px; width: 100%; max-height: 80vh; overflow-y: auto;
                  padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;">
        <button id="closeStaffTasksQuick" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        <h3 style="text-align: center; margin-bottom: 20px; color: #1e293b;">Tasks for ${staffName}</h3>
        <div id="staffTasksQuickContent" style="max-height: 60vh; overflow-y: auto;"></div>
        <div style="text-align: center; margin-top: 20px;">
          <button id="closeStaffTasksQuickBtn" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close handlers
    document.getElementById("closeStaffTasksQuick").addEventListener("click", () => modal.remove());
    document.getElementById("closeStaffTasksQuickBtn").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  }

  // Render tasks table in modal
  const content = document.getElementById("staffTasksQuickContent");
  const tableHtml = `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="background: #f8fafc; font-weight: 600;">
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Type</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Related ID</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Status</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Created</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Priority</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">Description</th>
        </tr>
      </thead>
      <tbody>
        ${tasks.map(task => `
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 12px;"><span style="background: #dbeafe; color: #2563eb; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${task.type}</span></td>
            <td style="padding: 12px; font-family: monospace; color: #64748b;">${task.relatedId}</td>
            <td style="padding: 12px;">
              <span style="background: ${getStatusColor(task.status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
                ${task.status}
              </span>
            </td>
            <td style="padding: 12px; color: #64748b;">${task.createdAt}</td>
            <td style="padding: 12px;">
              <span style="background: ${getPriorityColor(task.priority)}; color: white; padding: 4px 6px; border-radius: 3px; font-size: 11px;">
                ${task.priority}
              </span>
            </td>
            <td style="padding: 12px; max-width: 200px;" title="${task.description}">${task.description.substring(0, 80)}${task.description.length > 80 ? '...' : ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${tasks.length === 0 ? '<p style="text-align: center; color: #64748b; padding: 40px;">No tasks found.</p>' : ''}
  `;
  content.innerHTML = tableHtml;
  modal.style.display = "flex";
}

// --- Helper: Get Status Color ---
function getStatusColor(status) {
  const colors = {
    'Pending': '#fbbf24',
    'Ongoing': '#3b82f6',
    'Completed': '#10b981',
    'Rejected': '#ef4444',
    'Approved': '#10b981'
  };
  return colors[status] || '#6b7280';
}

// --- Helper: Get Priority Color ---
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
document.addEventListener("DOMContentLoaded", attachStaffViewDetails);

// Export for global access
window.attachStaffViewDetails = attachStaffViewDetails;