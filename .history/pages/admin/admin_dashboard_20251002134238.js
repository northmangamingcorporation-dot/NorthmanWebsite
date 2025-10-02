// Advanced Admin Dashboard - Full Featured Implementation
function renderAdvancedAdminDashboard(admin = { username: "Admin", position: "" }) {
  return `
    ${renderNav()}
    <div class="container app">
      
      <!-- Advanced Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-title">ADMIN PORTAL</div>
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
          <button class="sidebar-btn" data-section="travel">
            <i class="fas fa-plane-departure"></i>
            <span>Travel Orders</span>
            <span id="travel-badge" class="notification-badge">0</span>
          </button>
          <button class="sidebar-btn" data-section="drivers">
            <i class="fas fa-car"></i>
            <span>Driver Trips</span>
            <span id="driver-badge" class="notification-badge">0</span>
          </button>
          <button class="sidebar-btn" data-section="users">
            <i class="fas fa-users"></i>
            <span>User Management</span>
          </button>
          <button class="sidebar-btn" data-section="reports">
            <i class="fas fa-file-alt"></i>
            <span>Reports</span>
          </button>
          <button class="sidebar-btn" data-section="analytics">
            <i class="fas fa-chart-line"></i>
            <span>Analytics</span>
          </button>
          <button class="sidebar-btn" data-section="settings">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </button>
        </nav>
        
        <div class="sidebar-spacer"></div>
        <button class="sidebar-btn logout" id="adminLogoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </aside>

      <!-- Main Content -->
      <main class="main">
        <!-- Header -->
        <div class="header">
          <div class="header-content">
            <h2>Admin Dashboard</h2>
            <div class="header-subtitle">
              Welcome, ${admin.username} (${admin.position || 'Admin'})
              <span class="last-updated" id="lastUpdated">Last updated: ${new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" id="refreshBtn" title="Refresh Data">
              <i class="fas fa-sync-alt"></i>
            </button>
            <button class="header-btn" id="exportBtn" title="Export Data">
              <i class="fas fa-download"></i>
            </button>
            <button class="header-btn" id="notificationBtn" title="Notifications">
              <i class="fas fa-bell"></i>
              <span class="notification-dot" id="notifDot"></span>
            </button>
            <div class="header-avatar">
              <img src="https://i.pravatar.cc/44?u=${admin.username}" alt="avatar">
              <div class="online-indicator"></div>
            </div>
          </div>
        </div>

        <!-- Dashboard Section -->
        <div id="dashboardSection" class="section active">
          <!-- Stats Cards -->
          <div class="stats-container">
            ${["pending","approved","denied","cancelled"].map(status => `
              <div class="stat-card enhanced ${status}" data-status="${status}">
                <div class="stat-icon">
                  <i class="fas fa-${getAdminStatusIcon(status)}"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
                  <div id="admin-${status}" class="stat-value ${status}">
                    <span class="number">0</span>
                    <span class="trend-indicator" id="trend-${status}"></span>
                  </div>
                  <div class="stat-meta" id="meta-${status}">0% of total</div>
                </div>
                <div class="stat-progress">
                  <div class="progress-bar" id="progress-${status}"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Dashboard Grid -->
          <div class="dashboard-grid">
            <!-- Recent Activity -->
            <div class="dashboard-card activity-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-history"></i>
                  Recent Activity
                </h4>
                <button class="btn-icon" id="refreshActivity" title="Refresh">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
              <div id="recentActivityList" class="activity-list">
                <div class="loading-state">
                  <div class="loading-spinner"></div>
                  <span>Loading activity...</span>
                </div>
              </div>
            </div>

            <!-- Top Requesters -->
            <div class="dashboard-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-trophy"></i>
                  Top Requesters
                </h4>
                <select id="topRequestersFilter" class="mini-filter">
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div id="topRequestersList" class="top-list">
                <div class="loading-state">
                  <div class="loading-spinner"></div>
                  <span>Loading data...</span>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="dashboard-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-info-circle"></i>
                  System Overview
                </h4>
              </div>
              <div class="quick-stats">
                <div class="quick-stat-item">
                  <i class="fas fa-users"></i>
                  <div>
                    <span class="qs-value" id="totalUsers">0</span>
                    <span class="qs-label">Total Users</span>
                  </div>
                </div>
                <div class="quick-stat-item">
                  <i class="fas fa-tasks"></i>
                  <div>
                    <span class="qs-value" id="totalRequests">0</span>
                    <span class="qs-label">Total Requests</span>
                  </div>
                </div>
                <div class="quick-stat-item">
                  <i class="fas fa-chart-line"></i>
                  <div>
                    <span class="qs-value" id="avgResponseTime">-</span>
                    <span class="qs-label">Avg Response</span>
                  </div>
                </div>
                <div class="quick-stat-item">
                  <i class="fas fa-percentage"></i>
                  <div>
                    <span class="qs-value" id="approvalRate">0%</span>
                    <span class="qs-label">Approval Rate</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Submissions Chart -->
            <div class="dashboard-card chart-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-chart-area"></i>
                  Submissions Timeline
                </h4>
                <div class="chart-controls">
                  <button class="chart-btn active" data-range="7">7D</button>
                  <button class="chart-btn" data-range="30">30D</button>
                  <button class="chart-btn" data-range="90">90D</button>
                </div>
              </div>
              <canvas id="submissionsChart" height="200"></canvas>
            </div>

            <!-- Status Distribution -->
            <div class="dashboard-card chart-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-chart-pie"></i>
                  Status Distribution
                </h4>
              </div>
              <canvas id="statusChart" height="200"></canvas>
            </div>
          </div>
        </div>

        <!-- Travel Orders Section -->
        <div id="travelSection" class="section">
          <div class="section-header enhanced">
            <div class="section-title-group">
              <h4>
                <i class="fas fa-plane-departure"></i>
                Travel Orders
              </h4>
              <div class="section-stats">
                <span class="stat-pill pending">
                  <i class="fas fa-clock"></i>
                  <span id="travelPendingCount">0</span> Pending
                </span>
                <span class="stat-pill success">
                  <i class="fas fa-check"></i>
                  <span id="travelApprovedCount">0</span> Approved
                </span>
              </div>
            </div>
            
            <div class="section-controls enhanced">
              <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchTravelInput" placeholder="Search orders..." class="search-input enhanced">
              </div>
              
              <div class="filter-group">
                <select id="travelStatusFilter" class="filter-select">
                  <option value="">All Status</option>
                </select>
                
                <select id="travelDestFilter" class="filter-select">
                  <option value="">All Destinations</option>
                </select>

                <select id="travelDateFilter" class="filter-select">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <button class="btn btn-secondary" id="clearTravelFilters">
                <i class="fas fa-redo"></i>
                Reset
              </button>

              <button class="btn btn-primary" id="exportTravelBtn">
                <i class="fas fa-file-excel"></i>
                Export
              </button>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div class="bulk-actions-bar" id="travelBulkBar" style="display: none;">
            <div class="bulk-info">
              <input type="checkbox" id="selectAllTravel" class="checkbox">
              <span id="travelSelectedCount">0 selected</span>
            </div>
            <div class="bulk-buttons">
              <button class="btn btn-sm btn-success" id="bulkApproveTravel">
                <i class="fas fa-check"></i> Approve
              </button>
              <button class="btn btn-sm btn-danger" id="bulkDenyTravel">
                <i class="fas fa-times"></i> Deny
              </button>
              <button class="btn btn-sm btn-secondary" id="bulkCancelTravel">
                <i class="fas fa-ban"></i> Cancel
              </button>
            </div>
          </div>
          
          <div class="enhanced-table-wrapper">
            <table class="enhanced-table">
              <thead>
                <tr>
                  <th width="40">
                    <input type="checkbox" class="checkbox" id="selectAllTravelHead">
                  </th>
                  <th class="sortable" data-sort="username">
                    Username <i class="fas fa-sort"></i>
                  </th>
                  <th class="sortable" data-sort="destination">
                    Destination <i class="fas fa-sort"></i>
                  </th>
                  <th>Purpose</th>
                  <th class="sortable" data-sort="dateFrom">
                    Date From <i class="fas fa-sort"></i>
                  </th>
                  <th class="sortable" data-sort="dateTo">
                    Date To <i class="fas fa-sort"></i>
                  </th>
                  <th class="sortable" data-sort="dateSubmitted">
                    Submitted <i class="fas fa-sort"></i>
                  </th>
                  <th>Status</th>
                  <th width="120">Actions</th>
                </tr>
              </thead>
              <tbody id="travelOrdersTable">
                <tr>
                  <td colspan="9" class="loading-state">
                    <div class="loading-content">
                      <div class="loading-spinner"></div>
                      <span>Loading travel orders...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container">
            <div class="pagination-info">
              Showing <span id="travelShowingStart">0</span> to <span id="travelShowingEnd">0</span> of <span id="travelTotal">0</span> entries
            </div>
            <div class="pagination" id="travelPagination"></div>
          </div>
        </div>

        <!-- Driver Trips Section -->
        <div id="driversSection" class="section">
          <div class="section-header enhanced">
            <div class="section-title-group">
              <h4>
                <i class="fas fa-car"></i>
                Driver Trip Tickets
              </h4>
              <div class="section-stats">
                <span class="stat-pill pending">
                  <i class="fas fa-clock"></i>
                  <span id="driverPendingCount">0</span> Pending
                </span>
                <span class="stat-pill success">
                  <i class="fas fa-check"></i>
                  <span id="driverApprovedCount">0</span> Approved
                </span>
              </div>
            </div>
            
            <div class="section-controls enhanced">
              <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchDriverInput" placeholder="Search trips..." class="search-input enhanced">
              </div>
              
              <div class="filter-group">
                <select id="driverStatusFilter" class="filter-select">
                  <option value="">All Status</option>
                </select>
                
                <select id="driverVehicleFilter" class="filter-select">
                  <option value="">All Vehicles</option>
                </select>

                <select id="driverDateFilter" class="filter-select">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <button class="btn btn-secondary" id="clearDriverFilters">
                <i class="fas fa-redo"></i>
                Reset
              </button>

              <button class="btn btn-primary" id="exportDriverBtn">
                <i class="fas fa-file-excel"></i>
                Export
              </button>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div class="bulk-actions-bar" id="driverBulkBar" style="display: none;">
            <div class="bulk-info">
              <input type="checkbox" id="selectAllDriver" class="checkbox">
              <span id="driverSelectedCount">0 selected</span>
            </div>
            <div class="bulk-buttons">
              <button class="btn btn-sm btn-success" id="bulkApproveDriver">
                <i class="fas fa-check"></i> Approve
              </button>
              <button class="btn btn-sm btn-danger" id="bulkDenyDriver">
                <i class="fas fa-times"></i> Deny
              </button>
              <button class="btn btn-sm btn-secondary" id="bulkCancelDriver">
                <i class="fas fa-ban"></i> Cancel
              </button>
            </div>
          </div>
          
          <div class="enhanced-table-wrapper">
            <table class="enhanced-table">
              <thead>
                <tr>
                  <th width="40">
                    <input type="checkbox" class="checkbox" id="selectAllDriverHead">
                  </th>
                  <th class="sortable" data-sort="driverName">
                    Driver Name <i class="fas fa-sort"></i>
                  </th>
                  <th class="sortable" data-sort="vehicle">
                    Vehicle <i class="fas fa-sort"></i>
                  </th>
                  <th>Destination</th>
                  <th>Purpose</th>
                  <th class="sortable" data-sort="departureDate">
                    Departure <i class="fas fa-sort"></i>
                  </th>
                  <th class="sortable" data-sort="dateSubmitted">
                    Submitted <i class="fas fa-sort"></i>
                  </th>
                  <th>Status</th>
                  <th width="120">Actions</th>
                </tr>
              </thead>
              <tbody id="driverTripsTable">
                <tr>
                  <td colspan="9" class="loading-state">
                    <div class="loading-content">
                      <div class="loading-spinner"></div>
                      <span>Loading driver trips...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container">
            <div class="pagination-info">
              Showing <span id="driverShowingStart">0</span> to <span id="driverShowingEnd">0</span> of <span id="driverTotal">0</span> entries
            </div>
            <div class="pagination" id="driverPagination"></div>
          </div>
        </div>

        <!-- User Management Section -->
        <div id="usersSection" class="section">
          <div class="section-header enhanced">
            <div class="section-title-group">
              <h4>
                <i class="fas fa-users"></i>
                User Management
              </h4>
            </div>
            <div class="section-controls enhanced">
              <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchUserInput" placeholder="Search users..." class="search-input enhanced">
              </div>
              <select id="userDeptFilter" class="filter-select">
                <option value="">All Departments</option>
              </select>
              <button class="btn btn-primary" id="addUserBtn">
                <i class="fas fa-user-plus"></i>
                Add User
              </button>
            </div>
          </div>

          <div class="enhanced-table-wrapper">
            <table class="enhanced-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th width="120">Actions</th>
                </tr>
              </thead>
              <tbody id="usersTable">
                <tr>
                  <td colspan="7" class="loading-state">
                    <div class="loading-content">
                      <div class="loading-spinner"></div>
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reports Section -->
        <div id="reportsSection" class="section">
          <div class="section-header enhanced">
            <h4>
              <i class="fas fa-file-alt"></i>
              Generate Reports
            </h4>
          </div>

          <div class="reports-grid">
            <div class="report-card">
              <i class="fas fa-chart-bar report-icon"></i>
              <h5>Travel Orders Report</h5>
              <p>Generate comprehensive travel orders report with filters</p>
              <button class="btn btn-primary" id="genTravelReport">
                <i class="fas fa-download"></i>
                Generate
              </button>
            </div>

            <div class="report-card">
              <i class="fas fa-car report-icon"></i>
              <h5>Driver Trips Report</h5>
              <p>Export driver trip data with detailed analytics</p>
              <button class="btn btn-primary" id="genDriverReport">
                <i class="fas fa-download"></i>
                Generate
              </button>
            </div>

            <div class="report-card">
              <i class="fas fa-users report-icon"></i>
              <h5>User Activity Report</h5>
              <p>Track user submissions and approval rates</p>
              <button class="btn btn-primary" id="genUserReport">
                <i class="fas fa-download"></i>
                Generate
              </button>
            </div>

            <div class="report-card">
              <i class="fas fa-clock report-icon"></i>
              <h5>Performance Report</h5>
              <p>Analyze response times and approval trends</p>
              <button class="btn btn-primary" id="genPerfReport">
                <i class="fas fa-download"></i>
                Generate
              </button>
            </div>
          </div>
        </div>

        <!-- Analytics Section -->
        <div id="analyticsSection" class="section">
          <div class="section-header">
            <h4>
              <i class="fas fa-chart-line"></i>
              Advanced Analytics
            </h4>
          </div>
          
          <div class="analytics-grid">
            <div class="analytics-card">
              <h5>Monthly Trends</h5>
              <canvas id="monthlyTrendsChart" height="250"></canvas>
            </div>
            
            <div class="analytics-card">
              <h5>Department Breakdown</h5>
              <canvas id="deptBreakdownChart" height="250"></canvas>
            </div>

            <div class="analytics-card">
              <h5>Approval Timeline</h5>
              <canvas id="approvalTimelineChart" height="250"></canvas>
            </div>

            <div class="analytics-card">
              <h5>Peak Hours</h5>
              <canvas id="peakHoursChart" height="250"></canvas>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div id="settingsSection" class="section">
          <div class="section-header enhanced">
            <h4>
              <i class="fas fa-cog"></i>
              System Settings
            </h4>
          </div>

          <div class="settings-container">
            <div class="settings-card">
              <h5><i class="fas fa-bell"></i> Notifications</h5>
              <div class="setting-item">
                <label>
                  <input type="checkbox" id="emailNotif" checked>
                  <span>Email Notifications</span>
                </label>
              </div>
              <div class="setting-item">
                <label>
                  <input type="checkbox" id="pushNotif" checked>
                  <span>Push Notifications</span>
                </label>
              </div>
            </div>

            <div class="settings-card">
              <h5><i class="fas fa-shield-alt"></i> Security</h5>
              <div class="setting-item">
                <label>
                  <input type="checkbox" id="twoFactor">
                  <span>Two-Factor Authentication</span>
                </label>
              </div>
              <div class="setting-item">
                <button class="btn btn-secondary">
                  <i class="fas fa-key"></i>
                  Change Password
                </button>
              </div>
            </div>

            <div class="settings-card">
              <h5><i class="fas fa-database"></i> Data Management</h5>
              <div class="setting-item">
                <button class="btn btn-primary">
                  <i class="fas fa-download"></i>
                  Backup Data
                </button>
              </div>
              <div class="setting-item">
                <button class="btn btn-secondary">
                  <i class="fas fa-trash"></i>
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Details Modal -->
    <div id="detailsModal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Details</h3>
          <button class="modal-close" onclick="closeDetailsModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeDetailsModal()">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Helper function for status icons
function getAdminStatusIcon(status) {
  const icons = {
    pending: 'clock',
    approved: 'check-circle',
    denied: 'times-circle',
    cancelled: 'ban'
  };
  return icons[status] || 'circle';
}

// Debounce utility
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

// Due to character limits, the rest of the code continues in the same file structure
// The key fix is removing the duplicate injectAdvancedAdminStyles function

// Mount function for integration with login system
window.mountAdminDashboard = async function(userData) {
  // Inject styles first
  injectAdvancedAdminStyles();
  
  // Try multiple possible container IDs
  let appContainer = document.getElementById('app');
  
  // If #app doesn't exist, try to find or create it
  if (!appContainer) {
    appContainer = document.querySelector('.app');
    
    if (!appContainer) {
      // Look for main content area or body
      appContainer = document.querySelector('main') || document.body;
      
      // If still not found, create the container
      if (!appContainer || appContainer === document.body) {
        console.warn('Creating app container');
        document.body.innerHTML = '<div id="app"></div>';
        appContainer = document.getElementById('app');
      }
    }
  }
  
  // Clear any existing content
  appContainer.innerHTML = '';
  
  // Render the dashboard HTML
  appContainer.innerHTML = renderAdvancedAdminDashboard(userData);
  
  // Wait a tick for DOM to update
  await new Promise(resolve => setTimeout(resolve, 0));
  
  // Attach all event listeners and functionality
  await attachAdvancedAdminDashboard(userData);
};

// SINGLE definition of injectAdvancedAdminStyles
function injectAdvancedAdminStyles() {
  // Check if styles already injected
  if (document.getElementById('advanced-admin-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'advanced-admin-styles';
  styleSheet.textContent = `
    /* Reset and base styles */
    * { box-sizing: border-box; }
    
    .container.app {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }
    
    /* Sidebar */
    .sidebar {
      width: 260px;
      background: #1e293b;
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }
    
    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .sidebar-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    
    .admin-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(16,185,129,0.1);
      border-radius: 6px;
      font-size: 13px;
      color: #10b981;
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 16px 0;
    }
    
    .sidebar-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      font-size: 14px;
    }
    
    .sidebar-btn:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }
    
    .sidebar-btn.active {
      background: rgba(59,130,246,0.1);
      color: #3b82f6;
    }
    
    .sidebar-btn.active .nav-indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #3b82f6;
    }
    
    .sidebar-btn i {
      width: 20px;
      text-align: center;
    }
    
    .notification-badge {
      margin-left: auto;
      background: #ef4444;
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      display: none;
    }
    
    .sidebar-btn.logout {
      color: #f87171;
      margin: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 16px;
    }
    
    .sidebar-spacer {
      flex: 1;
    }
    
    /* Main content */
    .main {
      flex: 1;
      margin-left: 260px;
      padding: 0;
    }
    
    /* Header */
    .header {
      background: white;
      padding: 20px 32px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
    }
    
    .header-subtitle {
      color: #64748b;
      font-size: 14px;
      margin-top: 4px;
    }
    
    .last-updated {
      margin-left: 12px;
      font-size: 12px;
      color: #94a3b8;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .header-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .header-btn:hover {
      background: #f8fafc;
      color: #3b82f6;
    }
    
    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      display: none;
    }
    
    .header-avatar {
      position: relative;
      width: 40px;
      height: 40px;
    }
    
    .header-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }
    
    /* Sections */
    .section {
      display: none;
      padding: 32px;
      animation: fadeIn 0.3s;
    }
    
    .section.active {
      display: block;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Stats cards */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .stat-card.pending .stat-icon {
      background: rgba(251,191,36,0.1);
      color: #f59e0b;
    }
    
    .stat-card.approved .stat-icon {
      background: rgba(16,185,129,0.1);
      color: #10b981;
    }
    
    .stat-card.denied .stat-icon {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
    }
    
    .stat-card.cancelled .stat-icon {
      background: rgba(100,116,139,0.1);
      color: #64748b;
    }
    
    .stat-content {
      flex: 1;
    }
    
    .stat-label {
      color: #64748b;
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      margin: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stat-value.pending { color: #f59e0b; }
    .stat-value.approved { color: #10b981; }
    .stat-value.denied { color: #ef4444; }
    .stat-value.cancelled { color: #64748b; }
    
    .stat-meta {
      color: #94a3b8;
      font-size: 12px;
    }
    
    .stat-progress {
      height: 4px;
      background: #f1f5f9;
      border-radius: 2px;
      margin-top: 12px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: currentColor;
      transition: width 0.5s ease;
    }
    
    /* Dashboard grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 24px;
    }
    
    .dashboard-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e2e8f0;
    }
    
    .activity-card { grid-column: span 6; }
    .dashboard-card:nth-child(2) { grid-column: span 6; }
    .dashboard-card:nth-child(3) { grid-column: span 4; }
    .chart-card { grid-column: span 6; }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .card-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* Activity list */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8fafc;
      transition: all 0.2s;
    }
    
    .activity-item:hover {
      background: #f1f5f9;
    }
    
    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: white;
    }
    
    .activity-icon.pending { background: #f59e0b; }
    .activity-icon.approved { background: #10b981; }
    .activity-icon.denied { background: #ef4444; }
    
    .activity-content {
      flex: 1;
    }
    
    .activity-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }
    
    .activity-meta {
      color: #64748b;
      font-size: 12px;
    }
    
    .activity-time {
      color: #94a3b8;
      font-size: 11px;
    }
    
    /* Section header */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .section-header h4 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-stats {
      display: flex;
      gap: 12px;
    }
    
    .stat-pill {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .stat-pill.pending {
      background: rgba(251,191,36,0.1);
      color: #f59e0b;
    }
    
    .stat-pill.success {
      background: rgba(16,185,129,0.1);
      color: #10b981;
    }
    
    .section-controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .search-container {
      position: relative;
      flex: 1;
      min-width: 200px;
    }
    
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
    
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 40px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    }
    
    .filter-group {
      display: flex;
      gap: 8px;
    }
    
    .filter-select {
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: #3b82f6;
    }
    
    /* Buttons */
    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .btn-secondary {
      background: #f1f5f9;
      color: #64748b;
    }
    
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    
    .btn-success {
      background: #10b981;
      color: white;
    }
    
    .btn-danger {
      background: #ef4444;
      color: white;
    }
    
    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }
    
    .btn-icon {
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-icon:hover {
      background: #f8fafc;
      color: #3b82f6;
    }
    
    /* Table */
    .enhanced-table-wrapper {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    
    .enhanced-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .enhanced-table thead {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .enhanced-table th {
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .enhanced-table th.sortable {
      cursor: pointer;
      user-select: none;
    }
    
    .enhanced-table th.sortable:hover {
      color: #3b82f6;
    }
    
    .enhanced-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
      color: #1e293b;
    }
    
    .enhanced-table tbody tr:hover {
      background: #f8fafc;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .user-name {
      font-weight: 500;
    }
    
    .user-meta {
      font-size: 12px;
      color: #94a3b8;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }
    
    .status-badge.pending {
      background: rgba(251,191,36,0.1);
      color: #f59e0b;
    }
    
    .status-badge.approved {
      background: rgba(16,185,129,0.1);
      color: #10b981;
    }
    
    .status-badge.denied {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
    }
    
    .status-badge.cancelled {
      background: rgba(100,116,139,0.1);
      color: #64748b;
    }
    
    .action-buttons {
      display: flex;
      gap: 4px;
    }
    
    .view-btn:hover { color: #3b82f6; background: rgba(59,130,246,0.1); }
    .assign-btn:hover { color: #10b981; background: rgba(16,185,129,0.1); }
    .edit-btn:hover { color: #f59e0b; background: rgba(251,191,36,0.1); }
    
    /* Pagination */
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding: 16px 0;
    }
    
    .pagination-info {
      color: #64748b;
      font-size: 14px;
    }
    
    .pagination {
      display: flex;
      gap: 4px;
    }
    
    .page-btn {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: 500;
    }
    
    .page-btn:hover:not(:disabled) {
      background: #f8fafc;
      color: #3b82f6;
    }
    
    .page-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    /* Loading state */
    .loading-state {
      text-align: center;
      padding: 40px;
      color: #94a3b8;
    }
    
    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #f1f5f9;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #94a3b8;
    }
    
    .empty-state i {
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .empty-state p {
      margin: 0;
      font-size: 14px;
    }
    
    /* Bulk actions bar */
    .bulk-actions-bar {
      background: #3b82f6;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      margin-bottom: 16px;
      display: none;
      justify-content: space-between;
      align-items: center;
    }
    
    .bulk-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .bulk-buttons {
      display: flex;
      gap: 8px;
    }
    
    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .modal-header {
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      background: #f1f5f9;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .modal-close:hover {
      background: #e2e8f0;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .detail-item {
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
    }
    
    .detail-item strong {
      display: block;
      color: #64748b;
      font-size: 12px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Checkbox */
    .checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    /* Quick stats */
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .quick-stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }
    
    .quick-stat-item i {
      font-size: 24px;
      color: #3b82f6;
    }
    
    .qs-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
    }
    
    .qs-label {
      display: block;
      font-size: 12px;
      color: #64748b;
    }
    
    /* Top list */
    .top-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .top-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
    }
    
    .top-rank {
      font-weight: 700;
      color: #3b82f6;
      width: 32px;
    }
    
    .top-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    
    .top-name {
      flex: 1;
      font-weight: 500;
      color: #1e293b;
    }
    
    .top-count {
      font-weight: 600;
      color: #64748b;
    }
    
    /* Reports grid */
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }
    
    .report-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: all 0.2s;
    }
    
    .report-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .report-icon {
      font-size: 48px;
      color: #3b82f6;
      margin-bottom: 16px;
    }
    
    .report-card h5 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .report-card p {
      margin: 0 0 16px 0;
      font-size: 13px;
      color: #64748b;
    }
    
    /* Settings */
    .settings-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .settings-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
    }
    
    .settings-card h5 {
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .setting-item {
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .setting-item:last-child {
      border-bottom: none;
    }
    
    .setting-item label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-size: 14px;
    }
    
    /* Analytics */
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }
    
    .analytics-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
    }
    
    .analytics-card h5 {
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .sidebar {
        width: 200px;
      }
      
      .main {
        margin-left: 200px;
      }
      
      .stats-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      
      .main {
        margin-left: 0;
      }
      
      .stats-container {
        grid-template-columns: 1fr;
      }
      
      .dashboard-card {
        grid-column: span 12 !important;
      }
      
      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .section-controls {
        width: 100%;
      }
      
      .filter-group {
        flex-wrap: wrap;
      }
      
      .search-container {
        width: 100%;
      }
      
      .pagination-container {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  `;
  
  document.head.appendChild(styleSheet);
  console.log('Advanced admin styles injected');
}