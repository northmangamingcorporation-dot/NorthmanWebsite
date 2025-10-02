// Load Leave Requests
async function loadLeaveRequests() {
  const tbody = document.getElementById('leaveRequestsTableBody');
  const countElement = document.getElementById('leaveRequestsCount');
  
  try {
    const snapshot = await window.db.collection('leave_requests')
      .orderBy('submittedAt', 'desc')
      .get();

    tbody.innerHTML = '';
    let pendingCount = 0;

    if (snapshot.empty) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            <div class="empty-content">
              <i class="fas fa-calendar-alt empty-icon"></i>
              <span>No leave requests yet</span>
            </div>
          </td>
        </tr>
      `;
      countElement.textContent = '0';
      return;
    }

    snapshot.forEach(doc => {
      const request = doc.data();
      if (request.status === 'pending') pendingCount++;

      const row = createLeaveRequestRow(doc.id, request);
      tbody.appendChild(row);
    });

    countElement.textContent = pendingCount;

  } catch (error) {
    console.error('Error loading leave requests:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="error-state" style="text-align: center; padding: 20px; color: #ef4444;">
          <i class="fas fa-exclamation-triangle"></i>
          Error loading leave requests
        </td>
      </tr>
    `;
  }
}

// Load Early Rest Day Requests
async function loadRestRequests() {
  const tbody = document.getElementById('restRequestsTableBody');
  const countElement = document.getElementById('restRequestsCount');
  
  try {
    const snapshot = await window.db.collection('early_rest_requests')
      .orderBy('submittedAt', 'desc')
      .get();

    tbody.innerHTML = '';
    let pendingCount = 0;

    if (snapshot.empty) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <div class="empty-content">
              <i class="fas fa-clock empty-icon"></i>
              <span>No rest day requests yet</span>
            </div>
          </td>
        </tr>
      `;
      countElement.textContent = '0';
      return;
    }

    snapshot.forEach(doc => {
      const request = doc.data();
      if (request.status === 'pending') pendingCount++;

      const row = createRestRequestRow(doc.id, request);
      tbody.appendChild(row);
    });

    countElement.textContent = pendingCount;

  } catch (error) {
    console.error('Error loading rest requests:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="error-state" style="text-align: center; padding: 20px; color: #ef4444;">
          <i class="fas fa-exclamation-triangle"></i>
          Error loading rest day requests
        </td>
      </tr>
    `;
  }
}

// Create Leave Request Row
function createLeaveRequestRow(docId, request) {
  const row = document.createElement('tr');
  row.className = 'request-row';
  
  const startDate = request.startDate || '-';
  const endDate = request.endDate || '-';
  const statusClass = (request.status || 'pending').toLowerCase();

  row.innerHTML = `
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${request.employeeName}" class="user-avatar" alt="">
        <span class="user-name">${request.employeeName || '-'}</span>
      </div>
    </td>
    <td><span class="department-badge">${request.department || '-'}</span></td>
    <td><span class="type-badge ${request.type}">${formatLeaveType(request.type)}</span></td>
    <td>${formatDate(startDate)}</td>
    <td>${formatDate(endDate)}</td>
    <td><span class="task-count completed">${request.totalDays || 0}</span></td>
    <td>
      <div class="description-text" title="${request.reason || '-'}">
        ${truncateText(request.reason || '-', 40)}
      </div>
    </td>
    <td><span class="status-badge ${statusClass}">${request.status || 'Pending'}</span></td>
    <td>
      <div class="action-buttons">
        ${statusClass === 'pending' ? `
          <button class="btn-icon approve-leave-btn" data-id="${docId}" title="Approve">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn-icon deny-leave-btn" data-id="${docId}" title="Deny">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
        <button class="btn-icon view-btn" data-id="${docId}" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners
  if (statusClass === 'pending') {
    row.querySelector('.approve-leave-btn')?.addEventListener('click', () => {
      handleLeaveApproval(docId, 'approved', request);
    });

    row.querySelector('.deny-leave-btn')?.addEventListener('click', () => {
      handleLeaveApproval(docId, 'denied', request);
    });
  }

  row.querySelector('.view-btn')?.addEventListener('click', () => {
    showLeaveDetails(request);
  });

  return row;
}

// Create Rest Request Row
function createRestRequestRow(docId, request) {
  const row = document.createElement('tr');
  row.className = 'request-row';
  
  const statusClass = (request.status || 'pending').toLowerCase();

  row.innerHTML = `
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${request.employeeName}" class="user-avatar" alt="">
        <span class="user-name">${request.employeeName || '-'}</span>
      </div>
    </td>
    <td><span class="department-badge">${request.department || '-'}</span></td>
    <td><span class="type-badge">${request.type || '-'}</span></td>
    <td>${formatDate(request.date || '-')}</td>
    <td>
      <div class="description-text" title="${request.reason || '-'}">
        ${truncateText(request.reason || '-', 40)}
      </div>
    </td>
    <td><span class="status-badge ${statusClass}">${request.status || 'Pending'}</span></td>
    <td>
      <div class="action-buttons">
        ${statusClass === 'pending' ? `
          <button class="btn-icon approve-rest-btn" data-id="${docId}" title="Approve">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn-icon deny-rest-btn" data-id="${docId}" title="Deny">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
        <button class="btn-icon view-btn" data-id="${docId}" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners
  if (statusClass === 'pending') {
    row.querySelector('.approve-rest-btn')?.addEventListener('click', () => {
      handleRestApproval(docId, 'approved', request);
    });

    row.querySelector('.deny-rest-btn')?.addEventListener('click', () => {
      handleRestApproval(docId, 'denied', request);
    });
  }

  row.querySelector('.view-btn')?.addEventListener('click', () => {
    showRestDetails(request);
  });

  return row;
}

// Handle Leave Approval/Denial
async function handleLeaveApproval(docId, status, request) {
  const confirmMsg = status === 'approved' 
    ? `Approve leave request for ${request.employeeName}?`
    : `Deny leave request for ${request.employeeName}?`;

  if (!confirm(confirmMsg)) return;

  try {
    await window.db.collection('leave_requests').doc(docId).update({
      status: status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: window.currentUser?.username || 'admin'
    });

    showNotification(`Leave request ${status}`, 'success');
    loadLeaveRequests(); // Reload table

  } catch (error) {
    console.error('Error updating leave request:', error);
    showNotification('Error updating request', 'error');
  }
}

// Handle Rest Day Approval/Denial
async function handleRestApproval(docId, status, request) {
  const confirmMsg = status === 'approved' 
    ? `Approve early rest request for ${request.employeeName}?`
    : `Deny early rest request for ${request.employeeName}?`;

  if (!confirm(confirmMsg)) return;

  try {
    await window.db.collection('early_rest_requests').doc(docId).update({
      status: status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: window.currentUser?.username || 'admin'
    });

    showNotification(`Rest day request ${status}`, 'success');
    loadRestRequests(); // Reload table

  } catch (error) {
    console.error('Error updating rest request:', error);
    showNotification('Error updating request', 'error');
  }
}

// Show Leave Details Modal
function showLeaveDetails(request) {
  const modal = createModal("Leave Request Details", `
    <div class="request-details">
      <div class="detail-group">
        <label>Employee:</label>
        <span>${request.employeeName || 'N/A'}</span>
      </div>
      <div class="detail-group">
        <label>Department:</label>
        <span>${request.department || 'N/A'}</span>
      </div>
      <div class="detail-group">
        <label>Leave Type:</label>
        <span class="type-badge ${request.type}">${formatLeaveType(request.type)}</span>
      </div>
      <div class="detail-group">
        <label>Start Date:</label>
        <span>${formatDate(request.startDate)}</span>
      </div>
      <div class="detail-group">
        <label>End Date:</label>
        <span>${formatDate(request.endDate)}</span>
      </div>
      <div class="detail-group">
        <label>Total Days:</label>
        <span>${request.totalDays || 0} days</span>
      </div>
      <div class="detail-group">
        <label>Reason:</label>
        <p style="margin: 0;">${request.reason || 'No reason provided'}</p>
      </div>
      <div class="detail-group">
        <label>Status:</label>
        <span class="status-badge ${(request.status || 'pending').toLowerCase()}">${request.status || 'Pending'}</span>
      </div>
      <div class="detail-group">
        <label>Submitted:</label>
        <span>${formatDate(request.submittedAt)}</span>
      </div>
    </div>
  `);
  showModal(modal);
}

// Show Rest Details Modal
function showRestDetails(request) {
  const modal = createModal("Early Rest Day Request Details", `
    <div class="request-details">
      <div class="detail-group">
        <label>Employee:</label>
        <span>${request.employeeName || 'N/A'}</span>
      </div>
      <div class="detail-group">
        <label>Department:</label>
        <span>${request.department || 'N/A'}</span>
      </div>
      <div class="detail-group">
        <label>Request Type:</label>
        <span class="type-badge">${request.type || 'N/A'}</span>
      </div>
      <div class="detail-group">
        <label>Date:</label>
        <span>${formatDate(request.date)}</span>
      </div>
      <div class="detail-group">
        <label>Reason:</label>
        <p style="margin: 0;">${request.reason || 'No reason provided'}</p>
      </div>
      <div class="detail-group">
        <label>Status:</label>
        <span class="status-badge ${(request.status || 'pending').toLowerCase()}">${request.status || 'Pending'}</span>
      </div>
      <div class="detail-group">
        <label>Submitted:</label>
        <span>${formatDate(request.submittedAt)}</span>
      </div>
    </div>
  `);
  showModal(modal);
}

// Helper: Format Leave Type
function formatLeaveType(type) {
  const types = {
    'vacation': 'Vacation',
    'sick': 'Sick Leave',
    'emergency': 'Emergency',
    'maternity': 'Maternity',
    'paternity': 'Paternity',
    'bereavement': 'Bereavement',
    'personal': 'Personal',
    'other': 'Other'
  };
  return types[type] || type;
}

// Initialize Tab Switching
function initializeApprovalTabs() {
  const tabs = document.querySelectorAll('.approval-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.borderBottomColor = 'transparent';
        t.style.color = '#64748b';
      });
      
      // Add active to clicked tab
      tab.classList.add('active');
      tab.style.borderBottomColor = '#10b981';
      tab.style.color = '#10b981';
      
      // Show corresponding content
      const tabName = tab.dataset.tab;
      document.getElementById('leaveRequestsTab').style.display = tabName === 'leave' ? 'block' : 'none';
      document.getElementById('restRequestsTab').style.display = tabName === 'rest' ? 'block' : 'none';
    });
  });
}

// Call these functions in attachITAdminDashboard
winloadLeaveRequests();
loadRestRequests();
initializeApprovalTabs();