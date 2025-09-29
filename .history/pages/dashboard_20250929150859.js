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
      leaveCol.where('username', '==', window.currentUser?.username || '')
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
      restCol.where('username', '==', window.currentUser?.username || '')
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

  const modalHTML = `
    <div id="leaveDetailsModal" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
      padding: 20px;
    ">
      <div style="
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-height: 90vh;
        overflow-y: auto;
        animation: slideIn 0.4s ease;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <h2 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 800;">
            <i class="fas fa-calendar-alt" style="color: #22c55e; margin-right: 12px;"></i>
            Leave Request Details
          </h2>
          <button onclick="document.getElementById('leaveDetailsModal').remove()" style="
            background: none;
            border: none;
            font-size: 24px;
            color: #94a3b8;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          " onmouseover="this.style.background='#f1f5f9'; this.style.color='#ef4444';"
             onmouseout="this.style.background='none'; this.style.color='#94a3b8';">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Leave Type</label>
              <div style="color: #0f172a; font-size: 16px; font-weight: 600;">
                <i class="fas fa-${getLeaveIcon(leave.type)}" style="color: #22c55e; margin-right: 8px;"></i>
                ${leaveTypeLabels[leave.type] || leave.type}
              </div>
            </div>
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Status</label>
              <div>
                <span style="
                  padding: 6px 16px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 700;
                  text-transform: uppercase;
                  background: rgba(${statusColors[leave.status] === '#22c55e' ? '34, 197, 94' : statusColors[leave.status] === '#ef4444' ? '239, 68, 68' : '245, 158, 11'}, 0.15);
                  color: ${statusColors[leave.status] || '#f59e0b'};
                  border: 1px solid rgba(${statusColors[leave.status] === '#22c55e' ? '34, 197, 94' : statusColors[leave.status] === '#ef4444' ? '239, 68, 68' : '245, 158, 11'}, 0.3);
                ">${leave.status || 'pending'}</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Start Date</label>
              <div style="color: #0f172a; font-size: 15px; font-weight: 600;">${formatDate(leave.startDate)}</div>
            </div>
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">End Date</label>
              <div style="color: #0f172a; font-size: 15px; font-weight: 600;">${formatDate(leave.endDate)}</div>
            </div>
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Duration</label>
              <div style="color: #0f172a; font-size: 15px; font-weight: 600;">${calculateDays(leave.startDate, leave.endDate)} days</div>
            </div>
          </div>

          <div>
            <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Reason</label>
            <div style="color: #475569; font-size: 14px; line-height: 1.6;">${leave.reason || 'No reason provided'}</div>
          </div>
        </div>

        ${leave.status === 'pending' ? `
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button onclick="cancelLeaveRequest('${id}')" style="
              padding: 12px 24px;
              border: 2px solid #ef4444;
              border-radius: 12px;
              background: white;
              color: #ef4444;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='#fef2f2';"
               onmouseout="this.style.background='white';">
              <i class="fas fa-times-circle"></i> Cancel Request
            </button>
          </div>
        ` : ''}

        ${leave.approvedBy ? `
          <div style="margin-top: 20px; padding: 16px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #22c55e;">
            <div style="color: #166534; font-size: 13px; font-weight: 600;">
              <i class="fas fa-info-circle"></i> ${leave.status === 'approved' ? 'Approved' : 'Processed'} by ${leave.approvedBy}
            </div>
            ${leave.approverNotes ? `<div style="color: #15803d; font-size: 13px; margin-top: 8px;">${leave.approverNotes}</div>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Show Rest Details Modal
function showRestDetailsModal(id, rest) {
  const restTypeLabels = {
    early_departure: 'Early Departure',
    late_arrival: 'Late Arrival',
    half_day: 'Half Day',
    shift_change: 'Shift Change Request'
  };

  const statusColors = {
    pending: '#f59e0b',
    approved: '#22c55e',
    denied: '#ef4444'
  };

  const modalHTML = `
    <div id="restDetailsModal" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
      padding: 20px;
    ">
      <div style="
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-height: 90vh;
        overflow-y: auto;
        animation: slideIn 0.4s ease;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <h2 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 800;">
            <i class="fas fa-clock" style="color: #f59e0b; margin-right: 12px;"></i>
            Early Rest Request Details
          </h2>
          <button onclick="document.getElementById('restDetailsModal').remove()" style="
            background: none;
            border: none;
            font-size: 24px;
            color: #94a3b8;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          " onmouseover="this.style.background='#f1f5f9'; this.style.color='#ef4444';"
             onmouseout="this.style.background='none'; this.style.color='#94a3b8';">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Request Type</label>
              <div style="color: #0f172a; font-size: 16px; font-weight: 600;">
                <i class="fas fa-clock" style="color: #f59e0b; margin-right: 8px;"></i>
                ${restTypeLabels[rest.type] || rest.type}
              </div>
            </div>
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Status</label>
              <div>
                <span style="
                  padding: 6px 16px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 700;
                  text-transform: uppercase;
                  background: rgba(${statusColors[rest.status] === '#22c55e' ? '34, 197, 94' : statusColors[rest.status] === '#ef4444' ? '239, 68, 68' : '245, 158, 11'}, 0.15);
                  color: ${statusColors[rest.status] || '#f59e0b'};
                  border: 1px solid rgba(${statusColors[rest.status] === '#22c55e' ? '34, 197, 94' : statusColors[rest.status] === '#ef4444' ? '239, 68, 68' : '245, 158, 11'}, 0.3);
                ">${rest.status || 'pending'}</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Date</label>
              <div style="color: #0f172a; font-size: 15px; font-weight: 600;">${formatDate(rest.date)}</div>
            </div>
            <div>
              <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Time</label>
              <div style="color: #0f172a; font-size: 15px; font-weight: 600;">${rest.time || 'N/A'}</div>
            </div>
          </div>

          <div>
            <label style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Reason</label>
            <div style="color: #475569; font-size: 14px; line-height: 1.6;">${rest.reason || 'No reason provided'}</div>
          </div>
        </div>

        ${rest.status === 'pending' ? `
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button onclick="cancelRestRequest('${id}')" style="
              padding: 12px 24px;
              border: 2px solid #ef4444;
              border-radius: 12px;
              background: white;
              color: #ef4444;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='#fef2f2';"
               onmouseout="this.style.background='white';">
              <i class="fas fa-times-circle"></i> Cancel Request
            </button>
          </div>
        ` : ''}

        ${rest.approvedBy ? `
          <div style="margin-top: 20px; padding: 16px; background: #fef3c7; border-radius: 12px; border-left: 4px solid #f59e0b;">
            <div style="color: #78350f; font-size: 13px; font-weight: 600;">
              <i class="fas fa-info-circle"></i> ${rest.status === 'approved' ? 'Approved' : 'Processed'} by ${rest.approvedBy}
            </div>
            ${rest.approverNotes ? `<div style="color: #92400e; font-size: 13px; margin-top: 8px;">${rest.approverNotes}</div>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Cancel Leave Request
function cancelLeaveRequest(leaveId) {
  if (!confirm('Are you sure you want to cancel this leave request?')) {
    return;
  }

  if (!window.db) {
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Database not initialized', 'error');
    }
    return;
  }

  window.db.collection('leave_requests').doc(leaveId).update({
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  }).then(() => {
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Leave request cancelled successfully', 'success');
    }
    document.getElementById('leaveDetailsModal')?.remove();
    loadLeaveRequests();
  }).catch((error) => {
    console.error('Error cancelling leave request:', error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error cancelling request', 'error');
    }
  });
}

// Cancel Rest Request
function cancelRestRequest(restId) {
  if (!confirm('Are you sure you want to cancel this request?')) {
    return;
  }

  if (!window.db) {
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Database not initialized', 'error');
    }
    return;
  }

  window.db.collection('early_rest_requests').doc(restId).update({
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  }).then(() => {
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Request cancelled successfully', 'success');
    }
    document.getElementById('restDetailsModal')?.remove();
    loadEarlyRestRequests();
  }).catch((error) => {
    console.error('Error cancelling request:', error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error cancelling request', 'error');
    }
  });
}// Enhanced pages/dashboard.js with HR Features

// -- Enhanced Dashboard Rendering ---
function renderDashboard(user = { username: "Employee", firstName: "User" }) {
  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return `
    ${renderNav()}
    
    <div class="container app" style="
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(145deg, #f0f9ff, #f0fdfa);
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    ">
      <main class="main" style="
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        padding: 40px;
        margin-bottom: 20px;
        position: relative;
        overflow: hidden;
      ">
        
        <!-- Decorative Background Elements -->
        <div style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        "></div>
        <div style="
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        "></div>

        <!-- Enhanced Header -->
        <div class="header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
          position: relative;
          z-index: 1;
        ">
          <div class="header-left" style="
            display: flex;
            flex-direction: column;
            gap: 8px;
          ">
            <h1 style="
              margin: 0;
              color: #0f172a;
              font-size: 36px;
              font-weight: 800;
              background: linear-gradient(135deg, #0f172a, #3b82f6, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              letter-spacing: -0.5px;
            ">
              Dashboard
            </h1>
            <p style="
              margin: 0;
              color: #64748b;
              font-size: 18px;
              font-weight: 600;
            ">
              Welcome back, ${fullName}! 👋
            </p>
            <p style="
              margin: 0;
              color: #94a3b8;
              font-size: 14px;
              font-weight: 500;
            ">
              ${currentDate}
            </p>
          </div>
          <div class="header-right" style="
            display: flex;
            align-items: center;
            gap: 16px;
          ">
            <!-- Quick Actions Dropdown -->
            <div class="quick-actions" style="position: relative;">
              <button id="quickActionsBtn" style="
                padding: 12px 16px;
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: #475569;
              " onmouseover="this.style.borderColor='#3b82f6'; this.style.background='#f8fafc';"
                 onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white';">
                <i class="fas fa-bolt"></i>
                <span>Quick Actions</span>
                <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
              </button>
            </div>

            <!-- User Profile -->
            <div class="user-info" style="
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 20px;
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
              border-radius: 16px;
              border: 2px solid rgba(59, 130, 246, 0.2);
              cursor: pointer;
              transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.2)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              <img src="https://i.pravatar.cc/48" alt="Avatar" style="
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              "/>
              <div style="display: flex; flex-direction: column;">
                <span style="
                  color: #0f172a;
                  font-weight: 700;
                  font-size: 14px;
                ">${fullName}</span>
                <span style="
                  color: #64748b;
                  font-size: 12px;
                  font-weight: 500;
                ">Employee</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Stats Grid with Animations -->
        <div class="stats-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        ">
          <!-- IT Requests Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border: 2px solid rgba(251, 146, 60, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(251, 146, 60, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(251, 146, 60, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #fb923c, #f97316);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(251, 146, 60, 0.3);
              ">
                <i class="fas fa-laptop-code"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(251, 146, 60, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #ea580c;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Active</div>
            </div>
            <div style="color: #78350f; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              IT Service Requests
            </div>
            <div id="stat-pending" style="
              font-size: 36px;
              font-weight: 800;
              color: #ea580c;
              margin: 0;
              line-height: 1;
            ">0</div>
            <div style="color: #92400e; font-size: 12px; margin-top: 8px; font-weight: 500;">
              Pending approval
            </div>
          </div>

          <!-- Leave Requests Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid rgba(34, 197, 94, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(34, 197, 94, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(34, 197, 94, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #22c55e, #16a34a);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
              ">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(34, 197, 94, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #15803d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Balance</div>
            </div>
            <div style="color: #14532d; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              Leave Credits
            </div>
            <div id="stat-leave-balance" style="
              font-size: 36px;
              font-weight: 800;
              color: #16a34a;
              margin: 0;
              line-height: 1;
            ">15</div>
            <div style="color: #166534; font-size: 12px; margin-top: 8px; font-weight: 500;">
              Days available
            </div>
          </div>

          <!-- Accomplishments Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(59, 130, 246, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(59, 130, 246, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
              ">
                <i class="fas fa-trophy"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(59, 130, 246, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #1e40af;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">This Month</div>
            </div>
            <div style="color: #1e3a8a; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              Accomplishments
            </div>
            <div id="stat-accomplishments" style="
              font-size: 36px;
              font-weight: 800;
              color: #2563eb;
              margin: 0;
              line-height: 1;
            ">0</div>
            <div style="color: #1e40af; font-size: 12px; margin-top: 8px; font-weight: 500;">
              Reports submitted
            </div>
          </div>

          <!-- Attendance Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
            border: 2px solid rgba(168, 85, 247, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(168, 85, 247, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(168, 85, 247, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #a855f7, #9333ea);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(168, 85, 247, 0.3);
              ">
                <i class="fas fa-user-check"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(168, 85, 247, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #7e22ce;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Rate</div>
            </div>
            <div style="color: #581c87; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              Attendance
            </div>
            <div id="stat-attendance" style="
              font-size: 36px;
              font-weight: 800;
              color: #9333ea;
              margin: 0;
              line-height: 1;
            ">98%</div>
            <div style="color: #6b21a8; font-size: 12px; margin-top: 8px; font-weight: 500;">
              This month
            </div>
          </div>
        </div>

        <!-- Quick Action Cards -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        ">
          <!-- IT Service Request -->
          <div class="action-card" onclick="document.getElementById('newRequestBtn').click()" style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 16px;
          " onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(59, 130, 246, 0.15)';"
             onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            ">
              <i class="fas fa-laptop-code" style="color: white; font-size: 24px;"></i>
            </div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                IT Service Request
              </h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Request IT support or services
              </p>
            </div>
            <i class="fas fa-arrow-right" style="color: #cbd5e1; margin-left: auto;"></i>
          </div>

          <!-- Leave Request -->
          <div class="action-card" onclick="window.showLeaveRequestModal()" style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 16px;
          " onmouseover="this.style.borderColor='#22c55e'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(34, 197, 94, 0.15)';"
             onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #22c55e, #16a34a);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            ">
              <i class="fas fa-calendar-alt" style="color: white; font-size: 24px;"></i>
            </div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                Request Leave
              </h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Apply for vacation or sick leave
              </p>
            </div>
            <i class="fas fa-arrow-right" style="color: #cbd5e1; margin-left: auto;"></i>
          </div>

          <!-- Early Rest Day -->
          <div class="action-card" onclick="window.showEarlyRestModal()" style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 16px;
          " onmouseover="this.style.borderColor='#f59e0b'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(245, 158, 11, 0.15)';"
             onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #f59e0b, #d97706);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            ">
              <i class="fas fa-clock" style="color: white; font-size: 24px;"></i>
            </div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                Early Rest Day
              </h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Request early departure or rest
              </p>
            </div>
            <i class="fas fa-arrow-right" style="color: #cbd5e1; margin-left: auto;"></i>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs-container" style="
          margin-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
          position: relative;
          z-index: 1;
        ">
          <div class="tabs" style="
            display: flex;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
          ">
            <button class="tab-btn active" data-tab="it-requests" style="
              padding: 12px 24px;
              background: transparent;
              border: none;
              border-bottom: 3px solid #3b82f6;
              color: #3b82f6;
              font-weight: 700;
              font-size: 15px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
            " >
              <i class="fas fa-laptop-code"></i> IT Requests
            </button>
            <button class="tab-btn" data-tab="hr-requests" style="
              padding: 12px 24px;
              background: transparent;
              border: none;
              border-bottom: 3px solid transparent;
              color: #64748b;
              font-weight: 600;
              font-size: 15px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
            " onmouseover="if(!this.classList.contains('active')) this.style.color='#3b82f6';"
               onmouseout="if(!this.classList.contains('active')) this.style.color='#64748b';">
              <i class="fas fa-briefcase"></i> HR Requests
            </button>
            <button class="tab-btn" data-tab="accomplishments" style="
              padding: 12px 24px;
              background: transparent;
              border: none;
              border-bottom: 3px solid transparent;
              color: #64748b;
              font-weight: 600;
              font-size: 15px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
            " onmouseover="if(!this.classList.contains('active')) this.style.color='#3b82f6';"
               onmouseout="if(!this.classList.contains('active')) this.style.color='#64748b';">
              <i class="fas fa-trophy"></i> Accomplishments
            </button>
          </div>
        </div>

        <!-- Tab Contents -->
        <div class="tab-content active" id="it-requests-content" style="
          animation: fadeIn 0.5s ease;
        ">
          ${renderITRequestsSection()}
        </div>

        <div class="tab-content" id="hr-requests-content" style="
          display: none;
          animation: fadeIn 0.5s ease;
        ">
          ${renderHRRequestsSection()}
        </div>

        <div class="tab-content" id="accomplishments-content" style="
          display: none;
          animation: fadeIn 0.5s ease;
        ">
          ${renderAccomplishmentsSection()}
        </div>

        <!-- Hidden Action Buttons -->
        <button id="newRequestBtn" style="display: none;"></button>
        <button id="leaveRequestBtn" style="display: none;"></button>
        <button id="earlyRestBtn" style="display: none;"></button>
        <button id="addReportBtn" style="display: none;"></button>

        <!-- Enhanced Logout Button -->
        <div style="text-align: center; margin-top: 40px;">
          <button id="backBtn" class="btn secondary-btn" style="
            padding: 14px 40px;
            font-size: 16px;
            font-weight: 700;
            border: 2px solid #ef4444;
            border-radius: 14px;
            background: transparent;
            color: #ef4444;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          " onmouseover="
            this.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            this.style.color = 'white';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
          " onmouseout="
            this.style.background = 'transparent';
            this.style.color = '#ef4444';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
          ">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </main>
    </div>

    ${renderStyles()}
  `;
}

// Render IT Requests Section
function renderITRequestsSection() {
  return `
    <div class="requests-section" style="
      background: white;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      ">
        <div>
          <h3 style="
            margin: 0 0 4px 0;
            color: #0f172a;
            font-size: 24px;
            font-weight: 700;
          ">
            IT Service Requests
          </h3>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Track your IT support tickets and requests
          </p>
        </div>
        <button onclick="document.getElementById('newRequestBtn').click()" class="btn primary-btn" style="
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        " onmouseover="
          this.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
        " onmouseout="
          this.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        ">
          <i class="fas fa-plus-circle"></i>
          New Request
        </button>
      </div>

      <div class="table-container" style="
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      ">
        <table style="
          width: 100%;
          border-collapse: collapse;
          background: white;
          min-width: 700px;
        ">
          <thead style="
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-bottom: 2px solid #e2e8f0;
          ">
            <tr>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Type</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Details</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
            </tr>
          </thead>
          <tbody id="requestsTable">
            <tr class="no-data-row">
              <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                  <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #e0e7ff, #dbeafe);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <i class="fas fa-inbox" style="font-size: 36px; color: #3b82f6;"></i>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                      No IT requests yet
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                      Click "New Request" to create your first IT service request
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Render HR Requests Section
function renderHRRequestsSection(user) {
  return `
    <div class="hr-requests-section">
      <!-- Leave Requests -->
      <div style="
        background: white;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        margin-bottom: 24px;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        ">
          <div>
            <h3 style="
              margin: 0 0 4px 0;
              color: #0f172a;
              font-size: 24px;
              font-weight: 700;
            ">
              Leave Requests
            </h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Manage your vacation and sick leave applications
            </p>
          </div>
          <button onclick="window.showLeaveRequestModal()" style="
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          " onmouseover="
            this.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
          " onmouseout="
            this.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
          ">
            <i class="fas fa-calendar-plus"></i>
            Request Leave
          </button>
        </div>

        <div class="table-container" style="
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            background: white;
            min-width: 800px;
          ">
            <thead style="
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              border-bottom: 2px solid #e2e8f0;
            ">
              <tr>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Type</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Start Date</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">End Date</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Days</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
              </tr>
            </thead>
            <tbody id="leaveRequestsTable">
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
            </tbody>
          </table>
        </div>
      </div>

      <!-- Early Rest Day Requests -->
      <div style="
        background: white;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        ">
          <div>
            <h3 style="
              margin: 0 0 4px 0;
              color: #0f172a;
              font-size: 24px;
              font-weight: 700;
            ">
              Early Rest Day Requests
            </h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Request early departure or rest day adjustments
            </p>
          </div>
          <button onclick="window.showEarlyRestModal()" style="
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          " onmouseover="
            this.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.4)';
          " onmouseout="
            this.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
          ">
            <i class="fas fa-clock"></i>
            Request Early Rest
          </button>
        </div>

        <div class="table-container" style="
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            background: white;
            min-width: 700px;
          ">
            <thead style="
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              border-bottom: 2px solid #e2e8f0;
            ">
              <tr>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Time</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Reason</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
              </tr>
            </thead>
            <tbody id="earlyRestTable">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Render Accomplishments Section
function renderAccomplishmentsSection(user) {
  return `
    <div class="accomplishments-section" style="
      background: white;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      ">
        <div>
          <h3 style="
            margin: 0 0 4px 0;
            color: #0f172a;
            font-size: 24px;
            font-weight: 700;
          ">
            My Accomplishments
          </h3>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Track and showcase your achievements and completed tasks
          </p>
        </div>
        <button onclick="document.getElementById('addReportBtn').click()" style="
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        " onmouseover="
          this.style.background = 'linear-gradient(135deg, #9333ea, #7e22ce)';
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.4)';
        " onmouseout="
          this.style.background = 'linear-gradient(135deg, #a855f7, #9333ea)';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
        ">
          <i class="fas fa-plus-circle"></i>
          Add Report
        </button>
      </div>

      <div class="table-container" style="
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      ">
        <table style="
          width: 100%;
          border-collapse: collapse;
          background: white;
          min-width: 900px;
        ">
          <thead style="
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-bottom: 2px solid #e2e8f0;
          ">
            <tr>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Report</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Photos</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
            </tr>
          </thead>
          <tbody id="accomplishmentsTable">
            <tr class="no-data-row">
              <td colspan="6" style="padding: 60px 20px; text-align: center; border: none;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                  <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #e0e7ff, #ddd6fe);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <i class="fas fa-trophy" style="font-size: 36px; color: #a855f7;"></i>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                      No accomplishments yet
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                      Click "Add Report" to document your first accomplishment
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Render Styles
function renderStyles() {
  return `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      /* Scrollbar Styling */
      .tabs::-webkit-scrollbar {
        display: none;
      }

      .table-container::-webkit-scrollbar {
        height: 8px;
      }

      .table-container::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }

      .table-container::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }

      .table-container::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      
      /* Responsive Design */
      @media (max-width: 1024px) {
        .container.app {
          padding: 16px;
        }
        
        .main {
          padding: 32px 24px;
        }
        
        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }
        
        .header-right {
          width: 100%;
          justify-content: space-between;
        }
      }

      @media (max-width: 768px) {
        .main {
          padding: 24px 16px;
        }
        
        .header h1 {
          font-size: 28px;
        }
        
        .header p {
          font-size: 16px;
        }
        
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .stat-card {
          padding: 20px;
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          font-size: 20px;
        }
        
        .stat-card > div:nth-child(3) {
          font-size: 28px;
        }
        
        .action-card {
          padding: 20px;
        }

        .quick-actions {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        .header-right {
          flex-direction: column;
          width: 100%;
        }
        
        .user-info {
          width: 100%;
          justify-content: center;
        }
        
        .action-card {
          flex-direction: column;
          text-align: center;
        }
        
        .action-card i.fa-arrow-right {
          display: none;
        }
      }
      
      /* Enhanced table row hover effects */
      tbody tr:not(.no-data-row) {
        transition: all 0.3s ease;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
      }
      
      tbody tr:not(.no-data-row):hover {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(147, 51, 234, 0.03));
        transform: translateX(4px);
        box-shadow: -4px 0 0 #3b82f6;
      }
      
      tbody tr:last-child {
        border-bottom: none;
      }
      
      /* Status badges */
      .status-badge {
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline-block;
      }
      
      .status-pending { background: rgba(251, 191, 36, 0.15); color: #d97706; border: 1px solid rgba(251, 191, 36, 0.3); }
      .status-approved { background: rgba(34, 197, 94, 0.15); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.3); }
      .status-denied { background: rgba(239, 68, 68, 0.15); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.3); }
      .status-cancelled { background: rgba(107, 114, 128, 0.15); color: #4b5563; border: 1px solid rgba(107, 114, 128, 0.3); }
      
      /* Button states */
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        filter: grayscale(50%);
      }
      
      /* Tab styling */
      .tab-content {
        animation: fadeIn 0.5s ease;
      }
      
      .tab-btn.active {
        border-bottom-color: #3b82f6;
        color: #3b82f6;
      }

      /* Photo gallery */
      .photo-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
      }
      
      .photo-item {
        margin: 8px;
        text-align: center;
        max-width: 200px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        background: white;
        transition: all 0.3s ease;
      }
      
      .photo-item:hover {
        border-color: #3b82f6;
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
      }
      
      .photo-item img {
        width: 100%;
        max-width: 200px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
    </style>
  `;
}



// UPDATED: Attach accomplishments section (no changes needed, but included for context)
function attachAccomplishmentsSection(user) {
  const addReportBtn = document.getElementById('addReportBtn');
  if (addReportBtn) {
    addReportBtn.addEventListener('click', () => {
      if (typeof window.mountAccomplishmentForm === 'function') {
        window.mountAccomplishmentForm(user);
      } else {
        console.error('mountAccomplishmentForm not loaded');
        if (window.Modal && window.Modal.show) {
          window.Modal.show('Form not available. Please refresh.', 'warning');
        } else {
          alert('Form not available. Please refresh.');
        }
      }
    });
  }
  
  // Safe load accomplishments data (assuming mountAccomplishmentTable is defined elsewhere)
  if (typeof mountAccomplishmentTable === 'function') {
    mountAccomplishmentTable(user);
  } else {
    console.warn('mountAccomplishmentTable not defined. Skipping accomplishments load.');
    // Optional: Dynamically load script if needed
    // const script = document.createElement('script');
    // script.src = 'assets/js/accomplishment_table.js';
    // script.onload = () => mountAccomplishmentTable(user);
    // document.head.appendChild(script);
  }
}

// --- Enhanced Attach Dashboard ---
async function attachDashboard(user) {
  try {
    attachAccomplishmentsSection(user);
    const tabButtons = document.querySelectorAll('.tab-btn');
            console.log(`[DEBUG] Found ${tabButtons.length} tab buttons`);

            tabButtons.forEach(button => {
              const tabName = button.getAttribute('data-tab');
              console.log(`[DEBUG] Attaching click event to button: data-tab="${tabName}"`);
              button.addEventListener('click', () => {
                console.log(`[DEBUG] Button clicked: data-tab="${tabName}"`);
                switchTab(tabName);
              });
            });
    if (!user || !user.username) {
      console.error("No user provided to attachDashboard.");
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Error: User session invalid. Redirecting to login...", "error");
      }
      setTimeout(() => {
        sessionStorage.removeItem("loggedInUser ");
        localStorage.removeItem("loggedInUser ");
        if (typeof window.mountLogin === 'function') window.mountLogin();
      }, 2000);
      return;
    }

    const ordersCol = window.db ? window.db.collection("it_service_orders") : null;
    let unsubscribe = null;
    const loadingStates = {
      stats: { pending: false, approved: false, denied: false, cancelled: false }
    };

    // Event listeners
    const newRequestBtn = document.getElementById("newRequestBtn");
    if (newRequestBtn) {
      newRequestBtn.addEventListener("click", () => {
        // Ensure request_modal.js is loaded
        if (!document.querySelector('script[src*="request_modal"]')) {
          const script = document.createElement("script");
          script.src = "assets/js/request_modal.js";
          script.onload = () => {
            if (typeof window.mountRequestModal === 'function') {
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
            if (window.Modal && window.Modal.show) {
              window.Modal.show("New request feature coming soon!", "info");
            }
          };
          document.head.appendChild(script);
        } else {
          if (typeof window.mountRequestModal === 'function') {
            window.mountRequestModal();
          } else {
            console.warn("mountRequestModal not defined.");
            if (window.Modal && window.Modal.show) {
              window.Modal.show("New request feature coming soon!", "info");
            }
          }
        }
      });
    }
    

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", async () => {
        try {
          // Register cleanup callback if available
          if (typeof window.registerLogoutCallback === 'function') {
            window.registerLogoutCallback(async () => {
              try {
                // Your existing cleanup code with null checks
                const refreshInterval = window.dashboardRefreshInterval;
                if (refreshInterval) {
                  clearInterval(refreshInterval);
                  window.dashboardRefreshInterval = null;
                }

                // Safe DOM cleanup
                const elementsToClean = document.querySelectorAll('[id*="dashboard"], [class*="dashboard"]');
                elementsToClean.forEach(el => {
                  if (el && el.onclick) {
                    el.onclick = null;
                  }
                });

                console.log('Dashboard cleanup completed');
              } catch (error) {
                console.warn('Dashboard cleanup error:', error);
              }
            });
          }

          // Use centralized logout if available
          let success = false;
          if (typeof window.logout === 'function') {
            success = await window.logout({
              customMessage: "Are you sure you want to logout from the dashboard?"
            });
          } else {
            console.warn('window.logout not defined. Using fallback logout.');
            // Fallback: Clear storage and redirect
            sessionStorage.clear();
            localStorage.clear();
            if (typeof window.mountLogin === 'function') window.mountLogin();
            success = true;
          }

          if (success){
                        // Animate logout button
            backBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
            backBtn.disabled = true;
            backBtn.style.opacity = '0.7';

            // Additional delay for UX if needed (e.g., redirect happens in logout)
            setTimeout(() => {
              if (backBtn.parentNode) {
                // Reset if still there (error case)
                backBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                backBtn.disabled = false;
                backBtn.style.opacity = '1';
              }
            }, 3000); // Reset after 3s if not cleared
          }

        } catch (error) {
          console.error('Logout error:', error);
          // Reset button on error
          backBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
          backBtn.disabled = false;
          backBtn.style.opacity = '1';
          if (window.Modal && window.Modal.show) {
            window.Modal.show('Logout failed. Please try again.', 'error');
          }
        }
      });
    }

    // Initial load (safe call to loadOrders)
    if (typeof loadOrders === 'function') {
      loadOrders(user);
    } else {
      console.warn('loadOrders not defined. Skipping requests load.');
      // Optional: Dynamically load if needed (e.g., from another script)
      // const script = document.createElement('script');
      // script.src = 'assets/js/orders_loader.js';
      // script.onload = () => loadOrders(user);
      // document.head.appendChild(script);
    }

    // Firestore listener setup (if ordersCol exists and loadOrders doesn't handle it)
    if (ordersCol && !unsubscribe) {
      // Example listener (uncomment/adapt if needed; assuming loadOrders sets it)
      // unsubscribe = ordersCol.where('uniquekey', '==', user.username).onSnapshot(
      //   (snapshot) => { /* Update UI */ },
      //   (error) => { console.error('Firestore listener error:', error); }
      // );
      console.log('Firestore listener ready (unsubscribe available for cleanup).');
    }

    // Cleanup on page unload (safe even if unsubscribe is null)
    const cleanupHandler = () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      // Additional cleanup (e.g., clear intervals)
      if (window.dashboardRefreshInterval) {
        clearInterval(window.dashboardRefreshInterval);
        window.dashboardRefreshInterval = null;
      }
    };
    window.addEventListener("beforeunload", cleanupHandler);
    // Also cleanup on module unload if possible
    if (window.addEventListener) {
      window.addEventListener('unload', cleanupHandler);
    }

  } catch (error) {
    console.error('attachDashboard error:', error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error attaching dashboard functionality. Please refresh.', 'error');
    }
  }
}

// --- Enhanced Mount Dashboard ---
function mountDashboard(user) {
  if (!user) {
    console.error("No user provided for mountDashboard.");
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error: No user session. Redirecting to login...", "error");
    }
    setTimeout(() => {
      if (typeof window.mountLogin === 'function') window.mountLogin();
    }, 1000);
    return;
  }

  try {
    // Clear existing content if needed
    const existingApp = document.querySelector(".container.app");
    if (existingApp) {
      existingApp.remove();
    }

    const dashboardHTML = renderDashboard(user);
    document.body.innerHTML = dashboardHTML;
    
    // Initial loading state for stats (remove after load)
    const statElements = document.querySelectorAll('.stat-loading');
    setTimeout(() => {
      statElements.forEach(el => el.classList.remove('stat-loading'));
    }, 2000); // Assume data loads within 2s; adjust or tie to actual load
    
    // Attach functionality after DOM update
    attachDashboard(user);
    
    // Ensure Font Awesome is loaded (updated to v6.4.0 for consistency)
    if (!document.querySelector('link[href*="fontawesome"]')) {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      faLink.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
      faLink.crossOrigin = "anonymous";
      faLink.referrerPolicy = "no-referrer";
      document.head.appendChild(faLink);
    }
    

    
    console.log("Dashboard mounted successfully for user:", user.username);
    
  } catch (error) {
    console.error("Error mounting dashboard:", error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error loading dashboard. Please try again.", "error");
    } else {
      alert("Error loading dashboard. Please refresh the page.");
    }
  }
}

// Function to switch tabs by tab name (e.g., 'it-requests', 'hr-requests', 'accomplishments')
function switchTab(tabName) {
  console.log(`[DEBUG] Switching to tab: ${tabName}`);

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    const btnTab = button.getAttribute('data-tab');
    if (btnTab === tabName) {
      console.log(`[DEBUG] Activating button: data-tab="${btnTab}"`);
      button.classList.add('active');
      button.style.borderBottomColor = '#3b82f6';
      button.style.color = '#3b82f6';
      button.style.fontWeight = '700';
    } else {
      console.log(`[DEBUG] Deactivating button: data-tab="${btnTab}"`);
      button.classList.remove('active');
      button.style.borderBottomColor = 'transparent';
      button.style.color = '#64748b';
      button.style.fontWeight = '600';
    }
  });

  tabContents.forEach(content => {
    if (content.id === `${tabName}-content`) {
      console.log(`[DEBUG] Showing content: id="${content.id}"`);
      content.classList.add('active');
      content.style.display = '';
      // Trigger fadeIn animation
      content.style.animation = 'none';
      content.offsetHeight; // Trigger reflow
      content.style.animation = 'fadeIn 0.5s ease';
    } else {
      console.log(`[DEBUG] Hiding content: id="${content.id}"`);
      content.classList.remove('active');
      content.style.display = 'none';
    }
  });
}

// Expose globally
window.renderDashboard = renderDashboard;
window.attachDashboard = attachDashboard;
window.mountDashboard = mountDashboard;

// Optional: Error boundary for dashboard module
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('dashboard.js')) {
    console.error('Dashboard Error:', {
      message: event.message,
      line: event.lineno,
      error: event.error
    });
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Dashboard encountered an error. Please refresh.', 'error');
    }
  }
});