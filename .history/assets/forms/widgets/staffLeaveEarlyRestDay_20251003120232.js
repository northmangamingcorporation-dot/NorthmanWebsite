// Enhanced Approval Management System with Advanced Features

// ============================================
// STATE MANAGEMENT
// ============================================
const approvalState = {
  filters: {
    leave: { status: 'all', type: 'all', search: '' },
    rest: { status: 'all', search: '' }
  },
  sortBy: {
    leave: { field: 'submittedAt', direction: 'desc' },
    rest: { field: 'submittedAt', direction: 'desc' }
  }
};

// ============================================
// LOAD LEAVE REQUESTS WITH FILTERING
// ============================================
async function loadLeaveRequests() {
  const tbody = document.getElementById('leaveRequestsTableBody');
  const countElement = document.getElementById('leaveRequestsCount');
  
  // Show loading state
  tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
  
  try {
    const snapshot = await window.db.collection('leave_requests')
      .orderBy('submittedAt', 'desc')
      .get();

    let requests = [];
    snapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    // Apply filters
    const filtered = applyLeaveFilters(requests);
    
    // Apply sorting
    const sorted = applySorting(filtered, approvalState.sortBy.leave);

    tbody.innerHTML = '';
    let pendingCount = requests.filter(r => r.status === 'pending').length;

    if (sorted.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            <div class="empty-content">
              <i class="fas fa-calendar-alt empty-icon"></i>
              <span>${requests.length === 0 ? 'No leave requests yet' : 'No requests match your filters'}</span>
            </div>
          </td>
        </tr>
      `;
    } else {
      sorted.forEach(request => {
        const row = createLeaveRequestRow(request.id, request);
        tbody.appendChild(row);
      });
    }

    countElement.textContent = pendingCount;
    updateLeaveStats(requests);

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
// LOAD REST REQUESTS WITH FILTERING
// ============================================
async function loadRestRequests() {
  const tbody = document.getElementById('restRequestsTableBody');
  const countElement = document.getElementById('restRequestsCount');
  
  // Show loading state
  tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
  
  try {
    const snapshot = await window.db.collection('early_rest_requests')
      .orderBy('submittedAt', 'desc')
      .get();

    let requests = [];
    snapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    // Apply filters
    const filtered = applyRestFilters(requests);
    
    // Apply sorting
    const sorted = applySorting(filtered, approvalState.sortBy.rest);

    tbody.innerHTML = '';
    let pendingCount = requests.filter(r => r.status === 'pending').length;

    if (sorted.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <div class="empty-content">
              <i class="fas fa-clock empty-icon"></i>
              <span>${requests.length === 0 ? 'No rest day requests yet' : 'No requests match your filters'}</span>
            </div>
          </td>
        </tr>
      `;
    } else {
      sorted.forEach(request => {
        const row = createRestRequestRow(request.id, request);
        tbody.appendChild(row);
      });
    }

    countElement.textContent = pendingCount;
    updateRestStats(requests);

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
// FILTERING FUNCTIONS
// ============================================
function applyLeaveFilters(requests) {
  const filters = approvalState.filters.leave;
  
  return requests.filter(req => {
    // Status filter
    if (filters.status !== 'all' && req.status !== filters.status) return false;
    
    // Type filter
    if (filters.type !== 'all' && req.type !== filters.type) return false;
    
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchName = req.employeeName?.toLowerCase().includes(search);
      const matchDept = req.department?.toLowerCase().includes(search);
      const matchReason = req.reason?.toLowerCase().includes(search);
      if (!matchName && !matchDept && !matchReason) return false;
    }
    
    return true;
  });
}

function applyRestFilters(requests) {
  const filters = approvalState.filters.rest;
  
  return requests.filter(req => {
    // Status filter
    if (filters.status !== 'all' && req.status !== filters.status) return false;
    
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchName = req.employeeName?.toLowerCase().includes(search);
      const matchDept = req.department?.toLowerCase().includes(search);
      const matchReason = req.reason?.toLowerCase().includes(search);
      if (!matchName && !matchDept && !matchReason) return false;
    }
    
    return true;
  });
}

// ============================================
// SORTING FUNCTION
// ============================================
function applySorting(requests, sortConfig) {
  return [...requests].sort((a, b) => {
    let aVal = a[sortConfig.field];
    let bVal = b[sortConfig.field];
    
    // Handle dates
    if (sortConfig.field === 'submittedAt' || sortConfig.field === 'startDate' || sortConfig.field === 'date') {
      aVal = new Date(aVal || 0).getTime();
      bVal = new Date(bVal || 0).getTime();
    }
    
    // Handle strings
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }
    
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

// ============================================
// UPDATE STATISTICS
// ============================================
function updateLeaveStats(requests) {
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    denied: requests.filter(r => r.status === 'denied').length
  };
  
  const statsContainer = document.getElementById('leaveStats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Total</span>
        <span class="stat-value">${stats.total}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Pending</span>
        <span class="stat-value" style="color: #f59e0b;">${stats.pending}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Approved</span>
        <span class="stat-value" style="color: #10b981;">${stats.approved}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Denied</span>
        <span class="stat-value" style="color: #ef4444;">${stats.denied}</span>
      </div>
    `;
  }
}

function updateRestStats(requests) {
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    denied: requests.filter(r => r.status === 'denied').length
  };
  
  const statsContainer = document.getElementById('restStats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Total</span>
        <span class="stat-value">${stats.total}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Pending</span>
        <span class="stat-value" style="color: #f59e0b;">${stats.pending}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Approved</span>
        <span class="stat-value" style="color: #10b981;">${stats.approved}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Denied</span>
        <span class="stat-value" style="color: #ef4444;">${stats.denied}</span>
      </div>
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

  // Calculate urgency indicator
  const urgencyClass = calculateUrgency(request.startDate);

  row.innerHTML = `
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${encodeURIComponent(request.employeeName || 'default')}" class="user-avatar" alt="${request.employeeName || 'User'}">
        <div>
          <span class="user-name">${escapeHtml(request.employeeName || '-')}</span>
          ${urgencyClass ? `<span class="urgency-badge ${urgencyClass}"><i class="fas fa-exclamation-circle"></i> Urgent</span>` : ''}
        </div>
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
        <button class="btn-icon export-btn" data-id="${docId}" title="Export to PDF" aria-label="Export request">
          <i class="fas fa-file-pdf"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners
  if (deptStatus === 'pending') {
    row.querySelector('.approve-leave-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleLeaveApproval(docId, 'approved', request);
    });

    row.querySelector('.deny-leave-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showDenyReasonModal(docId, 'leave', request);
    });
  }

  row.querySelector('.view-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showLeaveDetails(request);
  });

  row.querySelector('.export-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    exportRequestToPDF(request, 'leave');
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

  // Calculate urgency indicator
  const urgencyClass = calculateUrgency(request.date);

  row.innerHTML = `
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${encodeURIComponent(request.employeeName || 'default')}" class="user-avatar" alt="${request.employeeName || 'User'}">
        <div>
          <span class="user-name">${escapeHtml(request.employeeName || '-')}</span>
          ${urgencyClass ? `<span class="urgency-badge ${urgencyClass}"><i class="fas fa-exclamation-circle"></i> Urgent</span>` : ''}
        </div>
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
        <button class="btn-icon export-btn" data-id="${docId}" title="Export to PDF" aria-label="Export request">
          <i class="fas fa-file-pdf"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners
  if (deptStatus === 'pending') {
    row.querySelector('.approve-rest-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleRestApproval(docId, 'approved', request);
    });

    row.querySelector('.deny-rest-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showDenyReasonModal(docId, 'rest', request);
    });
  }

  row.querySelector('.view-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showRestDetails(request);
  });

  row.querySelector('.export-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    exportRequestToPDF(request, 'rest');
  });

  return row;
}

// ============================================
// CALCULATE URGENCY
// ============================================
function calculateUrgency(date) {
  if (!date) return null;
  
  const requestDate = new Date(date);
  const now = new Date();
  const daysUntil = Math.ceil((requestDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntil <= 3 && daysUntil >= 0) return 'urgent';
  return null;
}

// ============================================
// DENY WITH REASON MODAL
// ============================================
function showDenyReasonModal(docId, type, request) {
  const modal = createModal(`Deny ${type === 'leave' ? 'Leave' : 'Rest Day'} Request`, `
    <div style="padding: 20px;">
      <p style="margin-bottom: 15px; color: #64748b;">
        Please provide a reason for denying this request from <strong>${escapeHtml(request.employeeName)}</strong>:
      </p>
      <textarea id="denyReason" placeholder="Enter reason for denial..." 
        style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit;"
      ></textarea>
      <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-danger" id="confirmDenyBtn">Deny Request</button>
      </div>
    </div>
  `);
  
  showModal(modal);
  
  document.getElementById('confirmDenyBtn')?.addEventListener('click', async () => {
    const reason = document.getElementById('denyReason')?.value.trim();
    if (!reason) {
      showNotification('Please provide a reason for denial', 'error');
      return;
    }
    
    closeModal();
    
    if (type === 'leave') {
      await handleLeaveApproval(docId, 'denied', request, reason);
    } else {
      await handleRestApproval(docId, 'denied', request, reason);
    }
  });
}

// ============================================
// HANDLE LEAVE APPROVAL/DENIAL
// ============================================
async function handleLeaveApproval(docId, status, request, denialReason = null) {
  const action = status === 'approved' ? 'approve' : 'deny';
  
  if (status === 'approved') {
    const confirmMsg = `Are you sure you want to ${action} the leave request for ${request.employeeName}?\n\nLeave Type: ${formatLeaveType(request.type)}\nDuration: ${formatDate(request.startDate)} to ${formatDate(request.endDate)}`;
    if (!confirm(confirmMsg)) return;
  }

  // Disable buttons
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

    if (status === 'denied') {
      updateData.status = 'denied';
      updateData.deniedBy = 'department';
      updateData.deniedAt = new Date().toISOString();
      if (denialReason) updateData.denialReason = denialReason;
    }

    await window.db.collection('leave_requests').doc(docId).update(updateData);

    const message = status === 'approved' 
      ? 'Leave request approved by department. Awaiting HR approval.' 
      : 'Leave request denied by department.';
    
    showNotification(message, 'success');
    await loadLeaveRequests();

  } catch (error) {
    console.error('Error updating leave request:', error);
    showNotification('Failed to update leave request. Please try again.', 'error');
    buttons?.forEach(btn => btn.disabled = false);
  }
}

// ============================================
// HANDLE REST DAY APPROVAL/DENIAL
// ============================================
async function handleRestApproval(docId, status, request, denialReason = null) {
  const action = status === 'approved' ? 'approve' : 'deny';
  
  if (status === 'approved') {
    const confirmMsg = `Are you sure you want to ${action} the early rest day request for ${request.employeeName}?\n\nDate: ${formatDate(request.date)}\nReason: ${request.reason || 'Not specified'}`;
    if (!confirm(confirmMsg)) return;
  }

  // Disable buttons
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

    if (status === 'denied') {
      updateData.status = 'denied';
      updateData.deniedBy = 'department';
      updateData.deniedAt = new Date().toISOString();
      if (denialReason) updateData.denialReason = denialReason;
    }

    await window.db.collection('early_rest_requests').doc(docId).update(updateData);

    const message = status === 'approved' 
      ? 'Rest day request approved by department. Awaiting HR approval.' 
      : 'Rest day request denied by department.';
    
    showNotification(message, 'success');
    await loadRestRequests();

  } catch (error) {
    console.error('Error updating rest request:', error);
    showNotification('Failed to update rest day request. Please try again.', 'error');
    buttons?.forEach(btn => btn.disabled = false);
  }
}

// ============================================
// EXPORT TO PDF
// ============================================
function exportRequestToPDF(request, type) {
  const content = type === 'leave' 
    ? generateLeavePDFContent(request)
    : generateRestPDFContent(request);
  
  // Create a printable window
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
  
  showNotification('PDF export initiated', 'success');
}

function generateLeavePDFContent(request) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leave Request - ${request.employeeName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1e293b; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
        .section { margin: 20px 0; }
        .label { font-weight: bold; color: #64748b; }
        .value { margin-left: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <h1>Leave Request</h1>
      <table>
        <tr><td class="label">Employee:</td><td>${escapeHtml(request.employeeName || 'N/A')}</td></tr>
        <tr><td class="label">Department:</td><td>${escapeHtml(request.department || 'N/A')}</td></tr>
        <tr><td class="label">Leave Type:</td><td>${formatLeaveType(request.type)}</td></tr>
        <tr><td class="label">Start Date:</td><td>${formatDate(request.startDate)}</td></tr>
        <tr><td class="label">End Date:</td><td>${formatDate(request.endDate)}</td></tr>
        <tr><td class="label">Total Days:</td><td>${request.totalDays || 0} days</td></tr>
        <tr><td class="label">Reason:</td><td>${escapeHtml(request.reason || 'No reason provided')}</td></tr>
        <tr><td class="label">Status:</td><td>${capitalizeFirst(request.status || 'Pending')}</td></tr>
        <tr><td class="label">Submitted:</td><td>${formatDate(request.submittedAt)}</td></tr>
      </table>
    </body>
    </html>
  `;
}

function generateRestPDFContent(request) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rest Day Request - ${request.employeeName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1e293b; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
        .label { font-weight: bold; color: #64748b; }
      </style>
    </head>
    <body>
      <h1>Early Rest Day Request</h1>
      <table>
        <tr><td class="label">Employee:</td><td>${escapeHtml(request.employeeName || 'N/A')}</td></tr>
        <tr><td class="label">Department:</td><td>${escapeHtml(request.department || 'N/A')}</td></tr>
        <tr><td class="label">Request Type:</td><td>${escapeHtml(request.type || 'N/A')}</td></tr>
        <tr><td class="label">Date:</td><td>${formatDate(request.date)}</td></tr>
        <tr><td class="label">Reason:</td><td>${escapeHtml(request.reason || 'No reason provided')}</td></tr>
        <tr><td class="label">Status:</td><td>${capitalizeFirst(request.status || 'Pending')}</td></tr>
        <tr><td class="label">Submitted:</td><td>${formatDate(request.submittedAt)}</td></tr>
      </table>
    </body>
    </html>
  `;
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
        ${request.denialReason ? `
        <div class="detail-group">
          <label>Denial Reason:</label>
          <p style="margin: 0; padding: 8px; background: #fef2f2; border-radius: 4px; color: #991b1b;">${escapeHtml(request.denialReason)}</p>
        </div>
        ` : ''}
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
        ${request.denialReason ? `
        <div class="detail-group">
          <label>Denial Reason:</label>
          <p style="margin: 0; padding: 8px; background: #fef2f2; border-radius: 4px; color: #991b1b;">${escapeHtml(request.denialReason)}</p>
        </div>
        ` : ''}
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
// INITIALIZE FILTERS
// ============================================
function initializeFilters() {
  // Leave filters
  const leaveStatusFilter = document.getElementById('leaveStatusFilter');
  const leaveTypeFilter = document.getElementById('leaveTypeFilter');
  const leaveSearchInput = document.getElementById('leaveSearchInput');
  
  leaveStatusFilter?.addEventListener('change', (e) => {
    approvalState.filters.leave.status = e.target.value;
    loadLeaveRequests();
  });
  
  leaveTypeFilter?.addEventListener('change', (e) => {
    approvalState.filters.leave.type = e.target.value;
    loadLeaveRequests();
  });
  
  leaveSearchInput?.addEventListener('input', debounce((e) => {
    approvalState.filters.leave.search = e.target.value;
    loadLeaveRequests();
  }, 300));
  
  // Rest filters
  const restStatusFilter = document.getElementById('restStatusFilter');
  const restSearchInput = document.getElementById('restSearchInput');
  
  restStatusFilter?.addEventListener('change', (e) => {
    approvalState.filters.rest.status = e.target.value;
    loadRestRequests();
  });
  
  restSearchInput?.addEventListener('input', debounce((e) => {
    approvalState.filters.rest.search = e.target.value;
    loadRestRequests();
  }, 300));
}

// ============================================
// BATCH APPROVAL
// ============================================
async function batchApproveLeave() {
  const checkboxes = document.querySelectorAll('.leave-checkbox:checked');
  if (checkboxes.length === 0) {
    showNotification('Please select requests to approve', 'error');
    return;
  }
  
  if (!confirm(`Approve ${checkboxes.length} leave request(s)?`)) return;
  
  let success = 0;
  let failed = 0;
  
  for (const checkbox of checkboxes) {
    try {
      const docId = checkbox.dataset.id;
      await window.db.collection('leave_requests').doc(docId).update({
        departmentApproval: 'approved',
        departmentReviewedAt: new Date().toISOString(),
        departmentReviewedBy: window.currentUser?.username || 'admin',
        updatedAt: new Date().toISOString()
      });
      success++;
    } catch (error) {
      console.error('Error approving request:', error);
      failed++;
    }
  }
  
  showNotification(`${success} approved, ${failed} failed`, success > 0 ? 'success' : 'error');
  await loadLeaveRequests();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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

// Format date helper
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
window.initializeFilters = initializeFilters;
window.handleLeaveApproval = handleLeaveApproval;
window.handleRestApproval = handleRestApproval;
window.batchApproveLeave = batchApproveLeave;
window.approvalState = approvalState;