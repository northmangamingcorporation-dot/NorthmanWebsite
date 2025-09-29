// Load Leave Requests (placeholder)
function loadLeaveRequests() {
  const leaveTable = document.getElementById('leaveRequestsTable');
  if (!leaveTable) return;

  // Show loading state
  leaveTable.innerHTML = `
    <tr>
      <td colspan="6" style="padding: 40px; text-align: center;">
        <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #22c55e;"></i>
        <p style="margin-top: 16px; color: #64748b;">Loading leave requests...</p>
      </td>
    </tr>
  `;

  // TODO: Replace with actual Firestore query
  setTimeout(() => {
    if (window.db) {
      const leaveCol = window.db.collection("leave_requests");
      leaveCol.where('username', '==', window.currentUser ?.username || '')
        .orderBy('submittedAt', 'desc')
        .onSnapshot((snapshot) => {
          if (snapshot.empty) {
            leaveTable.innerHTML = `
              <tr class="no-data-row">
                <td colspan="6" style="padding: 60px 20px; text-align: center; border: none;">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                    <div style="
                      width: 80px;
                      height: 80px;
                      background: linear-gradient(135deg, #dcfce7, #d1fae5);
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      <i class="fas fa-calendar-alt" style="font-size: 36px; color: #22c55e;"></i>
                    </div>
                    <div>
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                        No leave requests yet
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                        Click "Request Leave" to apply for vacation or sick leave
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            `;
            return;
          }

          let html = '';
          snapshot.forEach((doc) => {
            const leave = doc.data();
            const status = leave.status || 'pending';
            const startDate = formatDate(leave.startDate);
            const endDate = formatDate(leave.endDate);
            const days = calculateDays(leave.startDate, leave.endDate);

            html += renderLeaveRow(doc.id, leave, startDate, endDate, days, status);
          });

          leaveTable.innerHTML = html;
        });
    } else {
      // Show empty state
      leaveTable.innerHTML = `
        <tr class="no-data-row">
          <td colspan="6" style="padding: 60px 20px; text-align: center; border: none;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
              <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #dcfce7, #d1fae5);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <i class="fas fa-calendar-alt" style="font-size: 36px; color: #22c55e;"></i>
              </div>
              <div>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                  No leave requests yet
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                  Click "Request Leave" to apply for vacation or sick leave
                </p>
              </div>
            </div>
          </td>
        </tr>
      `;
    }
  }, 500);
}

// Load Early Rest Requests (placeholder)
function loadEarlyRestRequests() {
  const earlyRestTable = document.getElementById('earlyRestTable');
  if (!earlyRestTable) return;

  // Show loading state
  earlyRestTable.innerHTML = `
    <tr>
      <td colspan="5" style="padding: 40px; text-align: center;">
        <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #f59e0b;"></i>
        <p style="margin-top: 16px; color: #64748b;">Loading early rest requests...</p>
      </td>
    </tr>
  `;

  // TODO: Replace with actual Firestore query
  setTimeout(() => {
    if (window.db) {
      const restCol = window.db.collection("early_rest_requests");
      restCol.where('username', '==', window.currentUser ?.username || '')
        .orderBy('submittedAt', 'desc')
        .onSnapshot((snapshot) => {
          if (snapshot.empty) {
            earlyRestTable.innerHTML = `
              <tr class="no-data-row">
                <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                    <div style="
                      width: 80px;
                      height: 80px;
                      background: linear-gradient(135deg, #fef3c7, #fde68a);
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      <i class="fas fa-clock" style="font-size: 36px; color: #f59e0b;"></i>
                    </div>
                    <div>
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                        No early rest requests yet
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                        Click "Request Early Rest" to apply for early departure
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            `;
            return;
          }

          let html = '';
          snapshot.forEach((doc) => {
            const rest = doc.data();
            const status = rest.status || 'pending';
            const date = formatDate(rest.date);
            const time = rest.time || 'N/A';

            html += renderEarlyRestRow(doc.id, rest, date, time, status);
          });

          earlyRestTable.innerHTML = html;
        });
    } else {
      // Show empty state
      earlyRestTable.innerHTML = `
        <tr class="no-data-row">
          <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
              <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <i class="fas fa-clock" style="font-size: 36px; color: #f59e0b;"></i>
              </div>
              <div>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                  No early rest requests yet
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                  Click "Request Early Rest" to apply for early departure
                </p>
              </div>
            </div>
          </td>
        </tr>
      `;
    }
  }, 500);
}

// Helper function to render leave row
function renderLeaveRow(id, leave, startDate, endDate, days, status) {
  const statusColors = {
    pending: { bg: 'rgba(251, 191, 36, 0.15)', color: '#d97706', border: 'rgba(251, 191, 36, 0.3)' },
    approved: { bg: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', border: 'rgba(34, 197, 94, 0.3)' },
    denied: { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' }
  };

  const statusStyle = statusColors[status] || statusColors.pending;
  const leaveTypeLabels = {
    vacation: 'Vacation',
    sick: 'Sick Leave',
    emergency: 'Emergency',
    maternity: 'Maternity',
    paternity: 'Paternity',
    bereavement: 'Bereavement',
    other: 'Other'
  };

  return `
    <tr style="transition: all 0.3s ease;">
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-${getLeaveIcon(leave.type)}" style="color: #22c55e;"></i>
          <span style="font-weight: 600; color: #0f172a;">${leaveTypeLabels[leave.type] || leave.type}</span>
        </div>
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #475569;">${startDate}</td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #475569;">${endDate}</td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">${days}</td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
        <span class="status-badge" style="
          background: ${statusStyle.bg};
          color: ${statusStyle.color};
          border: 1px solid ${statusStyle.border};
        ">${status}</span>
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
        <button onclick="viewLeaveDetails('${id}')" style="
          padding: 8px 16px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 13px;
        " onmouseover="this.style.transform='scale(1.05)'"
           onmouseout="this.style.transform='scale(1)'">
          <i class="fas fa-eye"></i> View
        </button>
      </td>
    </tr>
  `;
}

// Helper function to render early rest row
function renderEarlyRestRow(id, rest, date, time, status) {
  const statusColors = {
    pending: { bg: 'rgba(251, 191, 36, 0.15)', color: '#d97706', border: 'rgba(251, 191, 36, 0.3)' },
    approved: { bg: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', border: 'rgba(34, 197, 94, 0.3)' },
    denied: { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' }
  };

  const statusStyle = statusColors[status] || statusColors.pending;
  const restTypeLabels = {
    early_departure: 'Early Departure',
    late_arrival: 'Late Arrival',
    half_day: 'Half Day',
    shift_change: 'Shift Change'
  };

  return `
    <tr style="transition: all 0.3s ease;">
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600;">${date}</td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #475569;">${time}</td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #64748b;">
        ${truncateText(rest.reason || 'No reason provided', 40)}
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
        <span class="status-badge" style="
          background: ${statusStyle.bg};
          color: ${statusStyle.color};
          border: 1px solid ${statusStyle.border};
        ">${status}</span>
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
        <button onclick="viewRestDetails('${id}')" style="
          padding: 8px 16px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 13px;
        " onmouseover="this.style.transform='scale(1.05)'"
           onmouseout="this.style.transform='scale(1)'">
          <i class="fas fa-eye"></i> View
        </button>
      </td>
    </tr>
  `;
}

// Helper functions
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

function getLeaveIcon(type) {
  const icons = {
    vacation: 'umbrella-beach',
    sick: 'heartbeat',
    emergency: 'exclamation-triangle',
    maternity: 'baby',
    paternity: 'baby-carriage',
    bereavement: 'dove',
    other: 'calendar-alt'
  };
  return icons[type] || 'calendar-alt';
}

// NEW: Missing helper - truncate text
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// View Leave Details
function viewLeaveDetails(leaveId) {
  console.log('Viewing leave request:', leaveId);
  
  if (!window.db) {
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Database not initialized', 'error');
    }
    return;
  }

  window.db.collection('leave_requests').doc(leaveId).get().then((doc) => {
    if (!doc.exists) {
      if (window.Modal && window.Modal.show) {
        window.Modal.show('Leave request not found', 'error');
      }
      return;
    }

    const leave = doc.data();
    showLeaveDetailsModal(leaveId, leave);
  }).catch((error) => {
    console.error('Error fetching leave details:', error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error loading leave details', 'error');
    }
  });
}

// View Rest Details
function viewRestDetails(restId) {
  console.log('Viewing early rest request:', restId);
  
  if (!window.db) {
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Database not initialized', 'error');
    }
    return;
  }

  window.db.collection('early_rest_requests').doc(restId).get().then((doc) => {
    if (!doc.exists) {
      if (window.Modal && window.Modal.show) {
        window.Modal.show('Request not found', 'error');
      }
      return;
    }

    const rest = doc.data();
    showRestDetailsModal(restId, rest);
  }).catch((error) => {
    console.error('Error fetching rest details:', error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error loading request details', 'error');
    }
  });
}

// Show Leave Details Modal
function showLeaveDetailsModal(id, leave) {
  const leaveTypeLabels = {
    vacation: 'Vacation Leave',
    sick: 'Sick Leave',
    emergency: 'Emergency Leave',
    maternity: 'Maternity Leave',
    paternity: 'Paternity Leave',
    bereavement: 'Bereavement Leave',
    other: 'Other'
  };

  const statusColors = {
    pending: '#f59e0b',
    approved: '#22c55e',
    denied: '#ef4444'
  };

  const statusRgba = {
    pending: '245, 158, 11',
    approved: '34, 197, 94',
    denied: '239, 68, 68'
  };

  const statusColor = statusColors[leave.status] || '#f59e0b';
  const rgbaValue = statusRgba[leave.status] || '245, 158, 11';

  const modalHTML = `
    <div id="leaveDetailsModal" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba