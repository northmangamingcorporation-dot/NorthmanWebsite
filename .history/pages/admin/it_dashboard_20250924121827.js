// Enhanced IT Admin Dashboard - Keeping your original structure
function renderITAdminDashboard(admin = { username: "ITAdmin", position: "" }, staffTasks = []) {
  return `
    ${renderNav()}
    <div class="container app">
      
      <!-- Enhanced Sidebar with better design -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-title">IT ADMIN PORTAL</div>
          <div class="admin-badge">
            <i class="fas fa-shield-alt"></i>
            <span>Administrator</span>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <button class="sidebar-btn active" data-section="dashboard">
            <i class="fas fa-chart-pie"></i>
            <span>Dashboard</span>
            <div class="nav-indicator"></div>
          </button>
          <button class="sidebar-btn" data-section="requests">
            <i class="fas fa-tasks"></i>
            <span>IT Requests</span>
            <span id="pending-badge" class="notification-badge">0</span>
          </button>
          <button class="sidebar-btn" data-section="clients">
            <i class="fas fa-users"></i>
            <span>Clients</span>
          </button>
          <button class="sidebar-btn" data-section="analytics">
            <i class="fas fa-chart-line"></i>
            <span>Analytics</span>
          </button>
        </nav>
        
        <div class="sidebar-spacer"></div>
        <button class="sidebar-btn logout" id="adminLogoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </aside>

      <!-- Enhanced Main Content -->
      <main class="main">
        <!-- Improved Header with real-time info -->
        <div class="header">
          <div class="header-content">
            <h2>IT Department Dashboard</h2>
            <div class="header-subtitle">
              Welcome, ${admin.username} (${admin.position})
              <span class="last-updated" id="lastUpdated">Last updated: ${new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" id="refreshBtn" title="Refresh Data">
              <i class="fas fa-sync-alt"></i>
            </button>
            <button class="header-btn" id="notificationBtn" title="Notifications">
              <i class="fas fa-bell"></i>
              <span class="notification-dot"></span>
            </button>
            <div class="header-avatar">
              <img src="https://i.pravatar.cc/44?u=${admin.username}" alt="avatar">
              <div class="online-indicator"></div>
            </div>
          </div>
        </div>

        <!-- Enhanced Dashboard Stats with better animations -->
        <div id="dashboardSection" class="section">
          <div class="stats-container">
            ${["pending","approved","denied","cancelled"].map(status => `
              <div class="stat-card enhanced ${status}">
                <div class="stat-icon">
                  <i class="fas fa-${getStatusIcon(status)}"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
                  <div id="admin-${status}" class="stat-value ${status}">
                    <span class="number">0</span>
                    <span class="trend" id="trend-${status}"></span>
                  </div>
                </div>
                <div class="stat-progress">
                  <div class="progress-bar" id="progress-${status}"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Enhanced Staff Task Overview with performance metrics -->
          <div class="dashboard-grid">
            <div class="dashboard-card staff-overview">
              <div class="card-header">
                <h4>
                  <i class="fas fa-users-cog"></i>
                  Staff Task Overview
                </h4>
                <div class="card-actions">
                  <button class="btn-icon" id="exportStaffBtn" title="Export Data">
                    <i class="fas fa-download"></i>
                  </button>
                  <select id="staffFilter" class="filter-select">
                    <option value="all">All Staff</option>
                    <option value="active">Active Only</option>
                    <option value="overdue">With Overdue</option>
                  </select>
                </div>
              </div>
              
              <div class="enhanced-table-container">
                <table class="enhanced-table">
                  <thead>
                    <tr>
                      <th>
                        <div class="th-content">
                          Staff Name
                          <i class="fas fa-sort sort-icon" data-sort="name"></i>
                        </div>
                      </th>
                      <th>
                        <div class="th-content">
                          Position
                          <i class="fas fa-sort sort-icon" data-sort="position"></i>
                        </div>
                      </th>
                      <th>
                        <div class="th-content">
                          Pending
                          <i class="fas fa-sort sort-icon" data-sort="pending"></i>
                        </div>
                      </th>
                      <th>
                        <div class="th-content">
                          Ongoing
                          <i class="fas fa-sort sort-icon" data-sort="ongoing"></i>
                        </div>
                      </th>
                      <th>
                        <div class="th-content">
                          Completed
                          <i class="fas fa-sort sort-icon" data-sort="completed"></i>
                        </div>
                      </th>
                      <th>Performance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="staffTasksTable">
                    ${staffTasks.length > 0
                      ? staffTasks.map(staff => `
                          <tr class="staff-row" data-staff="${staff.name}">
                            <td>
                              <div class="staff-info">
                                <img src="https://i.pravatar.cc/32?u=${staff.name}" class="staff-avatar" alt="">
                                <span class="staff-name">${staff.name}</span>
                              </div>
                            </td>
                            <td><span class="position-badge">${staff.position}</span></td>
                            <td><span class="task-count pending">${staff.pending}</span></td>
                            <td><span class="task-count ongoing">${staff.ongoing}</span></td>
                            <td><span class="task-count completed">${staff.completed}</span></td>
                            <td>
                              <div class="performance-indicator">
                                <div class="performance-bar">
                                  <div class="performance-fill" style="width: ${calculatePerformance(staff)}%"></div>
                                </div>
                                <span class="performance-text">${calculatePerformance(staff)}%</span>
                              </div>
                            </td>
                            <td>
                              <div class="action-buttons">
                                <button class="btn-icon view-details" data-staff="${staff.name}" title="View Details">
                                  <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon assign-task" data-staff="${staff.name}" title="Assign Task">
                                  <i class="fas fa-plus"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        `).join('')
                      : `<tr><td colspan="7" class="loading-state">
                          <div class="loading-content">
                            <div class="loading-spinner"></div>
                            <span>Loading staff tasks...</span>
                          </div>
                        </td></tr>`
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Enhanced IT Manager Tasks Card -->
            <div class="dashboard-card manager-tasks">
              <div class="card-header">
                <h4>
                  <i class="fas fa-user-tie"></i>
                  Your Task Overview
                </h4>
                <div class="task-summary" id="taskSummary">
                  <span class="summary-item">Total: <strong id="totalTasks">0</strong></span>
                </div>
              </div>
              
              <div class="manager-task-content">
                <div class="it-manager-tasks" id="managerTasksList">
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Loading your tasks...</span>
                  </div>
                </div>
                
                <div class="task-actions">
                  <button class="btn btn-primary" id="addTaskBtn">
                    <i class="fas fa-plus"></i>
                    Add New Task
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Panel -->
          <div class="dashboard-card quick-actions">
            <div class="card-header">
              <h4>
                <i class="fas fa-bolt"></i>
                Quick Actions
              </h4>
            </div>
            <div class="quick-actions-grid">
              <button class="quick-action-btn" id="bulkAssignBtn">
                <i class="fas fa-tasks"></i>
                <span>Bulk Assign</span>
              </button>
              <button class="quick-action-btn" id="generateReportBtn">
                <i class="fas fa-chart-bar"></i>
                <span>Generate Report</span>
              </button>
              <button class="quick-action-btn" id="systemHealthBtn">
                <i class="fas fa-heartbeat"></i>
                <span>System Health</span>
              </button>
              <button class="quick-action-btn" id="backupBtn">
                <i class="fas fa-database"></i>
                <span>Backup Data</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced IT Requests Section -->
        <div id="requestsSection" class="section">
          <div class="section-header enhanced">
            <div class="section-title-group">
              <h4>
                <i class="fas fa-clipboard-list"></i>
                All IT Requests
              </h4>
              <div class="section-stats">
                <span class="stat-pill pending">
                  <i class="fas fa-clock"></i>
                  <span id="pendingCount">0</span> Pending
                </span>
                <span class="stat-pill urgent">
                  <i class="fas fa-exclamation-triangle"></i>
                  <span id="urgentCount">0</span> Urgent
                </span>
              </div>
            </div>
            
            <div class="section-controls enhanced">
              <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchRequestsInput" placeholder="Search requests..." class="search-input enhanced">
                <button class="search-clear" id="clearSearchBtn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="filter-group">
                <select id="statusFilter" class="filter-select">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <select id="typeFilter" class="filter-select">
                  <option value="">All Types</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="network">Network</option>
                  <option value="access">Access</option>
                </select>
              </div>
              
              <button class="btn btn-primary" id="addRequestBtn" onclick="mountRequestModal()">
                <i class="fas fa-plus"></i>
                New Request
              </button>
            </div>
          </div>
          
          <div class="enhanced-table-wrapper">
            <table class="enhanced-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" id="selectAllRequests" class="checkbox">
                  </th>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Details</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="adminRequestsTable">
                <tr>
                  <td colspan="9" class="loading-state">
                    <div class="loading-content">
                      <div class="loading-spinner"></div>
                      <span>Loading IT requests...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="table-footer">
            <div class="bulk-actions">
              <button class="btn btn-secondary" id="bulkApproveBtn" disabled>
                <i class="fas fa-check"></i> Approve Selected
              </button>
              <button class="btn btn-secondary" id="bulkDenyBtn" disabled>
                <i class="fas fa-times"></i> Deny Selected
              </button>
            </div>
            
            <div class="pagination" id="requestsPagination">
              <!-- Pagination will be generated here -->
            </div>
          </div>
        </div>

        <!-- Enhanced Clients Section -->
        <div id="clientsSection" class="section">
          <div class="section-header enhanced">
            <div class="section-title-group">
              <h4>
                <i class="fas fa-users"></i>
                Client Management
              </h4>
              <div class="section-stats">
                <span class="stat-pill info">
                  <i class="fas fa-user"></i>
                  <span id="totalClients">0</span> Total
                </span>
                <span class="stat-pill success">
                  <i class="fas fa-user-check"></i>
                  <span id="activeClients">0</span> Active
                </span>
              </div>
            </div>
            
            <div class="section-controls enhanced">
              <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchClientsInput" placeholder="Search clients..." class="search-input enhanced">
              </div>
              
              <div class="filter-group">
                <select id="departmentFilter" class="filter-select">
                  <option value="">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              
              <button id="addClientBtn" class="btn btn-primary" onclick="mountSignIn()">
                <i class="fas fa-user-plus"></i>
                Add User
              </button>
            </div>
          </div>
          
          <div class="enhanced-table-wrapper">
            <table class="enhanced-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="adminClientsTable">
                <tr>
                  <td colspan="8" class="loading-state">
                    <div class="loading-content">
                      <div class="loading-spinner"></div>
                      <span>Loading clients...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- New Analytics Section -->
        <div id="analyticsSection" class="section">
          <div class="section-header">
            <h4>
              <i class="fas fa-chart-line"></i>
              Performance Analytics
            </h4>
          </div>
          
          <div class="analytics-grid">
            <div class="analytics-card">
              <h5>Request Trends</h5>
              <div class="chart-placeholder">
                <i class="fas fa-chart-area"></i>
                <span>Chart visualization coming soon</span>
              </div>
            </div>
            
            <div class="analytics-card">
              <h5>Staff Performance</h5>
              <div class="chart-placeholder">
                <i class="fas fa-chart-bar"></i>
                <span>Performance metrics</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

// Enhanced helper functions
function getStatusIcon(status) {
  const icons = {
    pending: 'clock',
    approved: 'check-circle',
    denied: 'times-circle',
    cancelled: 'ban'
  };
  return icons[status] || 'circle';
}

function calculatePerformance(staff) {
  const total = staff.pending + staff.ongoing + staff.completed;
  if (total === 0) return 0;
  return Math.round((staff.completed / total) * 100);
}

// Enhanced staff tasks function with caching and optimization
async function getStaffTasks() {
  const cacheKey = 'staffTasks';
  const cacheTime = 5 * 60 * 1000; // 5 minutes
  const cached = getFromCache(cacheKey, cacheTime);
  
  if (cached) {
    return cached;
  }

  const staffTasks = [];
  try {
    // Batch queries for better performance
    const [clientsSnapshot, tasksSnapshot] = await Promise.all([
      db.collection("clients").where("department", "==", "IT").get(),
      db.collection("ITdepartment_tasks").get()
    ]);

    const staffList = clientsSnapshot.docs.map(doc => doc.data());
    const allTasks = tasksSnapshot.docs.map(doc => doc.data());

    // Process tasks efficiently using Map for O(1) lookups
    const tasksByStaff = new Map();
    
    allTasks.forEach(task => {
      const staff = task.staff;
      if (!tasksByStaff.has(staff)) {
        tasksByStaff.set(staff, { pending: 0, ongoing: 0, completed: 0 });
      }
      
      const status = task.status.toLowerCase();
      const counts = tasksByStaff.get(staff);
      if (status === "pending") counts.pending++;
      else if (status === "ongoing") counts.ongoing++;
      else if (status === "completed") counts.completed++;
    });

    // Build final result with performance metrics
    for (const staff of staffList) {
      const counts = tasksByStaff.get(staff.username) || { pending: 0, ongoing: 0, completed: 0 };
      staffTasks.push({
        name: staff.username,
        position: staff.position,
        ...counts,
        performance: calculatePerformance(counts),
        lastActive: new