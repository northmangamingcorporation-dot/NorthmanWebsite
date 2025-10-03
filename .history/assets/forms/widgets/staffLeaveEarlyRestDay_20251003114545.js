// Enhanced Approval Management System

// ============================================
// LOAD LEAVE REQUESTS
// ============================================
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
    showNotification('Error loading leave requests', 'error');
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="error-state" style="text-align: center; padding: 20px; color: #ef4444;">
          <i class="fas fa-exclamation-triangle"></i>
          Error loading leave requests. Please refresh the page.
        </td>
      </tr>
    `;
  }
}

// ============================================
// LOAD EARLY REST DAY REQUESTS
// ============================================
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
    showNotification('Error loading rest day requests', 'error');
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="error-state" style="text-align: center; padding: 20px; color: #ef4444;">
          <i class="fas fa-exclamation-triangle"></i>
          Error loading rest day requests. Please refresh the page.
        </td>
      </tr>
    `;
  }
}

// ============================================
// CREATE LEAVE REQUEST ROW
// ============================================
function createLeaveRequestRow(docId, request) {
  const row = document.createElement('tr');
  row.className = 'request-row';
  row.dataset.requestId = docId;
  
  const startDate = request.startDate || '-';
  const endDate = request.endDate || '-';
  const deptStatus = request.departmentApproval || 'pending';
  const hrStatus = request.hrApproval || 'pending';
  const finalStatus = request.status || 'pending';

  row.innerHTML = `
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${encodeURIComponent(request.employeeName || 'default')}" class="user-avatar" alt="${request.employeeName || 'User'}">
        <span class="user-name">${escapeHtml(request.employeeName || '-')}</span>
      </div>
    </td>
    <td><span class="department-badge">${escapeHtml(request.department || '-')}</span></td>
    <td><span class="type-badge ${request.type}">${formatLeaveType(request.type)}</span></td>
    <td>${formatDate(startDate)}</td>
    <td>${formatDate(endDate)}</td>
    <td><span class="task-count completed">${request.totalDays || 0}</span></td>
    <td>
      <div class="description-text" title="${escapeHtml(request.reason || '-')}">
        ${escapeHtml(truncateText(request.reason || '-', 40))}
      </div>
    </td>
    <td>
      <span class="status-badge ${finalStatus.toLowerCase()}">${capitalizeFirst(finalStatus)}</span>
      <div style="font-size: 11px; margin-top: 4px; color: #64748b;">
        Dept: <span class="status-badge ${deptStatus}" style="font-size: 10px; padding: 2px 6px;">${capitalizeFirst(deptStatus)}</span><br>
        HR: <span class="status-badge ${hrStatus}" style="font-size: 10px; padding: 2px 6px;">${capitalizeFirst(hrStatus)}</span>
      </div>
    </td>
    <td>
      <div class="action-buttons">
        ${deptStatus === 'pending' ? `
          <button class="btn-icon approve-leave-btn" data-id="${docId}" title="Approve" aria-label="Approve leave request">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn-icon deny-leave-btn" data-id="${docId}" title="Deny" aria-label="Deny leave request">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
        <button class="btn-icon view-btn" data-id="${docId}" title="View Details" aria-label="View request details">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners with error handling
  if (deptStatus === 'pending') {
    row.querySelector('.approve-leave-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleLeaveApproval(docId, 'approved', request);
    });

    row.querySelector('.deny-leave-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleLeaveApproval(docId, 'denied', request);
    });
  }

  row.querySelector('.view-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showLeaveDetails(request);
  });

  return row;
}

// ============================================
// CREATE REST REQUEST ROW
// ============================================
function createRestRequestRow(docId, request) {
  const row = document.createElement('tr');
  row.className = 'request-row';
  row.dataset.requestId = docId;
  
  const deptStatus = request.departmentApproval || 'pending';
  const hrStatus = request.hrApproval || 'pending';
  const finalStatus = request.status || 'pending';

  row.innerHTML = `
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${encodeURIComponent(request.employeeName || 'default')}" class="user-avatar" alt="${request.employeeName || 'User'}">
        <span class="user-name">${escapeHtml(request.employeeName || '-')}</span>
      </div>
    </td>
    <td><span class="department-badge">${escapeHtml(request.department || '-')}</span></td>
    <td><span class="type-badge">${escapeHtml(request.type || '-')}</span></td>
    <td>${formatDate(request.date || '-')}</td>
    <td>
      <div class="description-text" title="${escapeHtml(request.reason || '-')}">
        ${escapeHtml(truncateText(request.reason || '-', 40))}
      </div>
    </td>
    <td>
      <span class="status-badge ${finalStatus.toLowerCase()}">${capitalizeFirst(finalStatus)}</span>
      <div style="font-size: 11px; margin-top: 4px; color: #64748b;">
        Dept: <span class="status-badge ${deptStatus}" style="font-size: 10px; padding: 2px 6px;">${capitalizeFirst(deptStatus)}</span><br>
        HR: <span class="status-badge ${hrStatus}" style="font-size: 10px; padding: 2px 6px;">${capitalizeFirst(hrStatus)}</span>
      </div>
    </td>
    <td>
      <div class="action-buttons">
        ${deptStatus === 'pending' ? `
          <button class="btn-icon approve-rest-btn" data-id="${docId}" title="Approve" aria-label="Approve rest day request">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn-icon deny-rest-btn" data-id="${docId}" title="Deny" aria-label="Deny rest day request">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
        <button class="btn-icon view-btn" data-id="${docId}" title="View Details" aria-label="View request details">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners with error handling
  if (deptStatus === 'pending') {
    row.querySelector('.approve-rest-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleRestApproval(docId, 'approved', request);
    });

    row.querySelector('.deny-rest-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleRestApproval(docId, 'denied', request);
    });
  }

  row.querySelector('.view-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showRestDetails(request);
  });

  return row;
}

// ============================================
// HANDLE LEAVE APPROVAL/DENIAL
// ============================================
async function handleLeaveApproval(docId, status, request) {
  const action = status === 'approved' ? 'approve' : 'deny';
  const confirmMsg = `Are you sure you want to ${action} the leave request for ${request.employeeName}?\n\nLeave Type: ${formatLeaveType(request.type)}\nDuration: ${formatDate(request.startDate)} to ${formatDate(request.endDate)}`;

  if (!confirm(confirmMsg)) return;

  // Disable buttons to prevent double-clicks
  const row = document.querySelector(`tr[data-request-id="${docId}"]`);
  const buttons = row?.querySelectorAll('button');
  buttons?.forEach(btn => btn.disabled = true);

  try {
    const updateData = {
      departmentApproval: status,
      departmentReviewedAt: new Date().toISOString(),
      departmentReviewedBy: window.currentUser?.username || window.currentUser?.email || 'admin',
      updatedAt: new Date().toISOString()
    };

    // If department denies, set final status to denied immediately
    if (status === 'denied') {
      updateData.status = 'denied';
      updateData.deniedBy = 'department';
      updateData.deniedAt = new Date().toISOString();
    }
    // If department approves, keep status as pending (waiting for HR)
    // The overall status will be updated when HR approves

    await window.db.collection('leave_requests').doc(docId).update(updateData);

    const message = status === 'approved' 
      ? 'Leave request approved by department. Awaiting HR approval.' 
      : 'Leave request denied by department.';
    
    showNotification(message, 'success');
    
    // Reload the table to reflect changes
    await loadLeaveRequests();

  } catch (error) {
    console.error('Error updating leave request:', error);
    showNotification('Failed to update leave request. Please try again.', 'error');
    
    // Re-enable buttons on error
    buttons?.forEach(btn => btn.disabled = false);
  }
}

// ============================================
// HANDLE REST DAY APPROVAL/DENIAL
// ============================================
async function handleRestApproval(docId, status, request) {
  const action = status === 'approved' ? 'approve' : 'deny';
  const confirmMsg = `Are you sure you want to ${action} the early rest day request for ${request.employeeName}?\n\nDate: ${formatDate(request.date)}\nReason: ${request.reason || 'Not specified'}`;

  if (!confirm(confirmMsg)) return;

  // Disable buttons to prevent double-clicks
  const row = document.querySelector(`tr[data-request-id="${docId}"]`);
  const buttons = row?.querySelectorAll('button');
  buttons?.forEach(btn => btn.disabled = true);

  try {
    const updateData = {
      departmentApproval: status,
      departmentReviewedAt: new Date().toISOString(),
      departmentReviewedBy: window.currentUser?.username || window.currentUser?.email || 'admin',
      updatedAt: new Date().toISOString()
    };

    // If department denies, set final status to denied immediately
    if (status === 'denied') {
      updateData.status = 'denied';
      updateData.deniedBy = 'department';
      updateData.deniedAt = new Date().toISOString();
    }
    // If department approves, keep status as pending (waiting for HR)

    await window.db.collection('early_rest_requests').doc(docId).update(updateData);

    const message = status === 'approved' 
      ? 'Rest day request approved by department. Awaiting HR approval.' 
      : 'Rest day request denied by department.';
    
    showNotification(message, 'success');
    
    // Reload the table to reflect changes
    await loadRestRequests();

  } catch (error) {
    console.error('Error updating rest request:', error);
    showNotification('Failed to update rest day request. Please try again.', 'error');
    
    // Re-enable buttons on error
    buttons?.forEach(btn => btn.disabled = false);
  }
}

// ============================================
// SHOW LEAVE DETAILS MODAL
// ============================================
function showLeaveDetails(request) {
  const approvalTimeline = generateApprovalTimeline(request, 'leave');
  
  const modal = createModal("Leave Request Details", `
    <div class="request-details">
      <div class="detail-section">
        <h4>Employee Information</h4>
        <div class="detail-group">
          <label>Employee:</label>
          <span>${escapeHtml(request.employeeName || 'N/A')}</span>
        </div>
        <div class="detail-group">
          <label>Department:</label>
          <span>${escapeHtml(request.department || 'N/A')}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Leave Information</h4>
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
          <span><strong>${request.totalDays || 0}</strong> days</span>
        </div>
        <div class="detail-group">
          <label>Reason:</label>
          <p style="margin: 0; padding: 8px; background: #f8fafc; border-radius: 4px;">${escapeHtml(request.reason || 'No reason provided')}</p>
        </div>
      </div>

      <div class="detail-section">
        <h4>Approval Status</h4>
        <div class="detail-group">
          <label>Overall Status:</label>
          <span class="status-badge ${(request.status || 'pending').toLowerCase()}">${capitalizeFirst(request.status || 'Pending')}</span>
        </div>
        <div class="detail-group">
          <label>Department Approval:</label>
          <span class="status-badge ${request.departmentApproval || 'pending'}">${capitalizeFirst(request.departmentApproval || 'Pending')}</span>
          ${request.departmentReviewedBy ? `<small style="display: block; color: #64748b; margin-top: 4px;">by ${escapeHtml(request.departmentReviewedBy)} on ${formatDate(request.departmentReviewedAt)}</small>` : ''}
        </div>
        <div class="detail-group">
          <label>HR Approval:</label>
          <span class="status-badge ${request.hrApproval || 'pending'}">${capitalizeFirst(request.hrApproval || 'Pending')}</span>
          ${request.hrReviewedBy ? `<small style="display: block; color: #64748b; margin-top: 4px;">by ${escapeHtml(request.hrReviewedBy)} on ${formatDate(request.hrReviewedAt)}</small>` : ''}
        </div>
      </div>

      ${approvalTimeline}

      <div class="detail-section">
        <h4>Submission Details</h4>
        <div class="detail-group">
          <label>Submitted:</label>
          <span>${formatDate(request.submittedAt)}</span>
        </div>
      </div>
    </div>
  `);
  showModal(modal);
}

// ============================================
// SHOW REST DETAILS MODAL
// ============================================
function showRestDetails(request) {
  const approvalTimeline = generateApprovalTimeline(request, 'rest');
  
  const modal = createModal("Early Rest Day Request Details", `
    <div class="request-details">
      <div class="detail-section">
        <h4>Employee Information</h4>
        <div class="detail-group">
          <label>Employee:</label>
          <span>${escapeHtml(request.employeeName || 'N/A')}</span>
        </div>
        <div class="detail-group">
          <label>Department:</label>
          <span>${escapeHtml(request.department || 'N/A')}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Request Information</h4>
        <div class="detail-group">
          <label>Request Type:</label>
          <span class="type-badge">${escapeHtml(request.type || 'N/A')}</span>
        </div>
        <div class="detail-group">
          <label>Date:</label>
          <span>${formatDate(request.date)}</span>
        </div>
        <div class="detail-group">
          <label>Reason:</label>
          <p style="margin: 0; padding: 8px; background: #f8fafc; border-radius: 4px;">${escapeHtml(request.reason || 'No reason provided')}</p>
        </div>
      </div>

      <div class="detail-section">
        <h4>Approval Status</h4>
        <div class="detail-group">
          <label>Overall Status:</label>
          <span class="status-badge ${(request.status || 'pending').toLowerCase()}">${capitalizeFirst(request.status || 'Pending')}</span>
        </div>
        <div class="detail-group">
          <label>Department Approval:</label>
          <span class="status-badge ${request.departmentApproval || 'pending'}">${capitalizeFirst(request.departmentApproval || 'Pending')}</span>
          ${request.departmentReviewedBy ? `<small style="display: block; color: #64748b; margin-top: 4px;">by ${escapeHtml(request.departmentReviewedBy)} on ${formatDate(request.departmentReviewedAt)}</small>` : ''}
        </div>
        <div class="detail-group">
          <label>HR Approval:</label>
          <span class="status-badge ${request.hrApproval || 'pending'}">${capitalizeFirst(request.hrApproval || 'Pending')}</span>
          ${request.hrReviewedBy ? `<small style="display: block; color: #64748b; margin-top: 4px;">by ${escapeHtml(request.hrReviewedBy)} on ${formatDate(request.hrReviewedAt)}</small>` : ''}
        </div>
      </div>

      ${approvalTimeline}

      <div class="detail-section">
        <h4>Submission Details</h4>
        <div class="detail-group">
          <label>Submitted:</label>
          <span>${formatDate(request.submittedAt)}</span>
        </div>
      </div>
    </div>
  `);
  showModal(modal);
}

// ============================================
// GENERATE APPROVAL TIMELINE
// ============================================
function generateApprovalTimeline(request, type) {
  const events = [];
  
  // Submitted
  if (request.submittedAt) {
    events.push({
      date: request.submittedAt,
      label: 'Submitted',
      icon: 'fa-paper-plane',
      color: '#3b82f6'
    });
  }
  
  // Department Review
  if (request.departmentReviewedAt) {
    events.push({
      date: request.departmentReviewedAt,
      label: `Department ${capitalizeFirst(request.departmentApproval)}`,
      icon: request.departmentApproval === 'approved' ? 'fa-check-circle' : 'fa-times-circle',
      color: request.departmentApproval === 'approved' ? '#10b981' : '#ef4444',
      by: request.departmentReviewedBy
    });
  }
  
  // HR Review
  if (request.hrReviewedAt) {
    events.push({
      date: request.hrReviewedAt,
      label: `HR ${capitalizeFirst(request.hrApproval)}`,
      icon: request.hrApproval === 'approved' ? 'fa-check-circle' : 'fa-times-circle',
      color: request.hrApproval === 'approved' ? '#10b981' : '#ef4444',
      by: request.hrReviewedBy
    });
  }
  
  if (events.length === 0) return '';
  
  return `
    <div class="detail-section">
      <h4>Timeline</h4>
      <div class="timeline">
        ${events.map(event => `
          <div class="timeline-item">
            <div class="timeline-icon" style="background: ${event.color};">
              <i class="fas ${event.icon}"></i>
            </div>
            <div class="timeline-content">
              <div class="timeline-label">${event.label}</div>
              <div class="timeline-date">${formatDate(event.date)}</div>
              ${event.by ? `<div class="timeline-by">by ${escapeHtml(event.by)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================
// INITIALIZE TAB SWITCHING
// ============================================
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
      const leaveTab = document.getElementById('leaveRequestsTab');
      const restTab = document.getElementById('restRequestsTab');
      
      if (leaveTab && restTab) {
        leaveTab.style.display = tabName === 'leave' ? 'block' : 'none';
        restTab.style.display = tabName === 'rest' ? 'block' : 'none';
      }
    });
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format Leave Type
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
  return types[type] || capitalizeFirst(type || 'Unknown');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Capitalize first letter
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Truncate text
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Format date helper (if not already defined)
function formatDate(date) {
  if (!date) return 'N/A';
  
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

// ============================================
// EXPORT TO GLOBAL SCOPE
// ============================================
window.loadLeaveRequests = loadLeaveRequests;
window.loadRestRequests = loadRestRequests;
window.initializeApprovalTabs = initializeApprovalTabs;
window.handleLeaveApproval = handleLeaveApproval;
window.handleRestApproval = handleRestApproval;