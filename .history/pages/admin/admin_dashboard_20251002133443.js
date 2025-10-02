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

// Advanced attach function with full functionality
async function attachAdvancedAdminDashboard(admin) {
  injectAdvancedAdminStyles();
  initializeDashboardOnLoad();

  let unsubscribeTravel = null;
  let unsubscribeDrivers = null;
  let unsubscribeUsers = null;
  let allTravelOrders = [];
  let allDriverTrips = [];
  let allUsers = [];
  
  // Pagination state
  const paginationState = {
    travel: { currentPage: 1, itemsPerPage: 10, sortField: null, sortOrder: 'asc' },
    driver: { currentPage: 1, itemsPerPage: 10, sortField: null, sortOrder: 'asc' }
  };

  // Initialize all sections
  initializeRealTimeUpdates();
  initializeSidebar();
  initializeCharts();

  // Load Travel Orders with full features
  function loadTravelOrders() {
    if (unsubscribeTravel) unsubscribeTravel();
    
    unsubscribeTravel = window.db.collection('travel_orders')
      .orderBy("dateSubmitted", "desc")
      .onSnapshot(snapshot => {
        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };
        const destinations = new Set();
        allTravelOrders = [];

        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            const order = doc.data();
            const statusKey = (order.status || "pending").toLowerCase();
            stats[statusKey] = (stats[statusKey] || 0) + 1;

            if (order.destination) destinations.add(order.destination);

            allTravelOrders.push({
              id: doc.id,
              ...order,
              statusKey,
              dateSubmittedTimestamp: order.dateSubmitted?.toDate?.() || new Date(order.dateSubmitted || Date.now())
            });
          });
        }

        updateGlobalStats(stats);
        updateSectionStats('travel', stats);
        populateTravelFilters(Array.from(destinations));
        renderTravelTable();
        updateRecentActivity();
        updateTopRequesters();
      }, err => {
        console.error("Travel orders error:", err);
        showNotification("Error loading travel orders", "error");
      });
  }

  // Load Driver Trips
  function loadDriverTrips() {
    if (unsubscribeDrivers) unsubscribeDrivers();
    
    unsubscribeDrivers = window.db.collection('drivers_trip_tickets')
      .orderBy("dateSubmitted", "desc")
      .onSnapshot(snapshot => {
        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };
        const vehicles = new Set();
        allDriverTrips = [];

        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            const trip = doc.data();
            const statusKey = (trip.status || "pending").toLowerCase();
            stats[statusKey] = (stats[statusKey] || 0) + 1;

            if (trip.vehicle) vehicles.add(trip.vehicle);

            allDriverTrips.push({
              id: doc.id,
              ...trip,
              statusKey,
              dateSubmittedTimestamp: trip.dateSubmitted?.toDate?.() || new Date(trip.dateSubmitted || Date.now())
            });
          });
        }

        updateSectionStats('driver', stats);
        populateDriverFilters(Array.from(vehicles));
        renderDriverTable();
      }, err => {
        console.error("Driver trips error:", err);
        showNotification("Error loading driver trips", "error");
      });
  }

  // Load Users
  function loadUsers() {
    if (unsubscribeUsers) unsubscribeUsers();
    
    window.db.collection('clients').get().then(snapshot => {
      const departments = new Set();
      allUsers = [];

      snapshot.forEach(doc => {
        const user = doc.data();
        if (user.department) departments.add(user.department);
        allUsers.push({ id: doc.id, ...user });
      });

      document.getElementById('totalUsers').textContent = allUsers.length;
      populateUserFilters(Array.from(departments));
      renderUsersTable();
    }).catch(err => {
      console.error("Users error:", err);
      showNotification("Error loading users", "error");
    });
  }

  // Render Travel Table with pagination and sorting
  function renderTravelTable(filteredData = null) {
    const data = filteredData || allTravelOrders;
    const { currentPage, itemsPerPage, sortField, sortOrder } = paginationState.travel;
    
    // Apply sorting
    let sortedData = [...data];
    if (sortField) {
      sortedData.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'dateSubmitted' || sortField === 'dateFrom' || sortField === 'dateTo') {
          aVal = a.dateSubmittedTimestamp?.getTime() || 0;
          bVal = b.dateSubmittedTimestamp?.getTime() || 0;
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Apply pagination
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = sortedData.slice(startIndex, endIndex);
    
    // Render table
    const tbody = document.getElementById("travelOrdersTable");
    tbody.innerHTML = "";
    
    if (paginatedData.length === 0) {
      tbody.innerHTML = createEmptyState(9, "No travel orders found", "fas fa-plane-departure");
      updatePaginationInfo('travel', 0, 0, 0);
      return;
    }
    
    paginatedData.forEach(order => {
      const row = createTravelRow(order, admin);
      tbody.appendChild(row);
    });
    
    updatePaginationInfo('travel', startIndex + 1, endIndex, totalItems);
    renderPagination('travel', currentPage, totalPages);
  }

  // Render Driver Table
  function renderDriverTable(filteredData = null) {
    const data = filteredData || allDriverTrips;
    const { currentPage, itemsPerPage, sortField, sortOrder } = paginationState.driver;
    
    let sortedData = [...data];
    if (sortField) {
      sortedData.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'dateSubmitted' || sortField === 'departureDate') {
          aVal = a.dateSubmittedTimestamp?.getTime() || 0;
          bVal = b.dateSubmittedTimestamp?.getTime() || 0;
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = sortedData.slice(startIndex, endIndex);
    
    const tbody = document.getElementById("driverTripsTable");
    tbody.innerHTML = "";
    
    if (paginatedData.length === 0) {
      tbody.innerHTML = createEmptyState(9, "No driver trips found", "fas fa-car");
      updatePaginationInfo('driver', 0, 0, 0);
      return;
    }
    
    paginatedData.forEach(trip => {
      const row = createDriverRow(trip, admin);
      tbody.appendChild(row);
    });
    
    updatePaginationInfo('driver', startIndex + 1, endIndex, totalItems);
    renderPagination('driver', currentPage, totalPages);
  }

  // Render Users Table
  function renderUsersTable(filteredData = null) {
    const data = filteredData || allUsers;
    const tbody = document.getElementById("usersTable");
    tbody.innerHTML = "";
    
    if (data.length === 0) {
      tbody.innerHTML = createEmptyState(7, "No users found", "fas fa-users");
      return;
    }
    
    data.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="user-info">
            <img src="https://i.pravatar.cc/32?u=${user.username}" class="user-avatar" alt="">
            <div>
              <div class="user-name">${user.firstName || ''} ${user.lastName || ''}</div>
              <div class="user-meta">@${user.username}</div>
            </div>
          </div>
        </td>
        <td><span class="dept-badge">${user.department || '-'}</span></td>
        <td>${user.position || '-'}</td>
        <td>${user.email || '-'}</td>
        <td>
          <span class="status-badge ${user.status === 'active' ? 'approved' : 'cancelled'}">
            ${user.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>${formatDate(user.lastLogin) || 'Never'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon view-btn" title="View Details" onclick="viewUserDetails('${user.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon edit-btn" title="Edit User" onclick="editUser('${user.id}')">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Create table rows
  function createTravelRow(order, admin) {
    const row = document.createElement("tr");
    row.dataset.id = order.id;
    row.innerHTML = `
      <td>
        <input type="checkbox" class="checkbox travel-checkbox" data-id="${order.id}">
      </td>
      <td>
        <div class="user-info">
          <img src="https://i.pravatar.cc/32?u=${order.username}" class="user-avatar" alt="">
          <span class="user-name">${order.username || "-"}</span>
        </div>
      </td>
      <td>${order.destination || "-"}</td>
      <td class="description-cell">
        <div class="description-text" title="${order.purpose || '-'}">${truncateText(order.purpose || '-', 40)}</div>
      </td>
      <td>${formatDate(order.dateFrom) || "-"}</td>
      <td>${formatDate(order.dateTo) || "-"}</td>
      <td>${formatTimestamp(order.dateSubmitted)}</td>
      <td><span class="status-badge ${order.statusKey}">${order.status || "Pending"}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon view-btn" title="View Details" onclick="viewTravelDetails('${order.id}')">
            <i class="fas fa-eye"></i>
          </button>
          ${order.statusKey === "pending" 
            ? `<button class="btn-icon assign-btn" title="Review" onclick="reviewTravel('${order.id}')">
                 <i class="fas fa-user-check"></i>
               </button>`
            : ''
          }
        </div>
      </td>
    `;
    
    row.querySelector('.travel-checkbox')?.addEventListener('change', updateTravelBulkBar);
    return row;
  }

  function createDriverRow(trip, admin) {
    const row = document.createElement("tr");
    row.dataset.id = trip.id;
    row.innerHTML = `
      <td>
        <input type="checkbox" class="checkbox driver-checkbox" data-id="${trip.id}">
      </td>
      <td>
        <div class="user-info">
          <img src="https://i.pravatar.cc/32?u=${trip.driverName}" class="user-avatar" alt="">
          <span class="user-name">${trip.driverName || "-"}</span>
        </div>
      </td>
      <td><span class="type-badge">${trip.vehicle || "-"}</span></td>
      <td>${trip.destination || "-"}</td>
      <td class="description-cell">
        <div class="description-text" title="${trip.purpose || '-'}">${truncateText(trip.purpose || '-', 40)}</div>
      </td>
      <td>${formatDate(trip.departureDate) || "-"}</td>
      <td>${formatTimestamp(trip.dateSubmitted)}</td>
      <td><span class="status-badge ${trip.statusKey}">${trip.status || "Pending"}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon view-btn" title="View Details" onclick="viewDriverDetails('${trip.id}')">
            <i class="fas fa-eye"></i>
          </button>
          ${trip.statusKey === "pending" 
            ? `<button class="btn-icon assign-btn" title="Review" onclick="reviewDriver('${trip.id}')">
                 <i class="fas fa-user-check"></i>
               </button>`
            : ''
          }
        </div>
      </td>
    `;
    
    row.querySelector('.driver-checkbox')?.addEventListener('change', updateDriverBulkBar);
    return row;
  }

  // Bulk actions
  function updateTravelBulkBar() {
    const checkboxes = document.querySelectorAll('.travel-checkbox:checked');
    const count = checkboxes.length;
    const bar = document.getElementById('travelBulkBar');
    
    if (count > 0) {
      bar.style.display = 'flex';
      document.getElementById('travelSelectedCount').textContent = `${count} selected`;
    } else {
      bar.style.display = 'none';
    }
  }

  function updateDriverBulkBar() {
    const checkboxes = document.querySelectorAll('.driver-checkbox:checked');
    const count = checkboxes.length;
    const bar = document.getElementById('driverBulkBar');
    
    if (count > 0) {
      bar.style.display = 'flex';
      document.getElementById('driverSelectedCount').textContent = `${count} selected`;
    } else {
      bar.style.display = 'none';
    }
  }

  // Bulk approve/deny/cancel
  async function bulkUpdateStatus(collection, status) {
    const checkboxes = document.querySelectorAll(`.${collection}-checkbox:checked`);
    const ids = Array.from(checkboxes).map(cb => cb.dataset.id);
    
    if (ids.length === 0) return;
    
    const confirm = await showConfirmDialog(
      `Bulk ${status}`,
      `Are you sure you want to ${status} ${ids.length} item(s)?`
    );
    
    if (!confirm) return;
    
    showNotification(`Processing ${ids.length} items...`, 'info');
    
    const collectionName = collection === 'travel' ? 'travel_orders' : 'drivers_trip_tickets';
    const batch = window.db.batch();
    
    ids.forEach(id => {
      const ref = window.db.collection(collectionName).doc(id);
      batch.update(ref, { 
        status: status,
        updatedBy: admin.username,
        updatedAt: new Date()
      });
    });
    
    try {
      await batch.commit();
      showNotification(`Successfully ${status}d ${ids.length} item(s)`, 'success');
      checkboxes.forEach(cb => cb.checked = false);
      if (collection === 'travel') updateTravelBulkBar();
      else updateDriverBulkBar();
    } catch (error) {
      console.error('Bulk update error:', error);
      showNotification(`Error: ${error.message}`, 'error');
    }
  }

  // Filters and search
  function initializeTravelFilters() {
    const searchInput = document.getElementById("searchTravelInput");
    const statusFilter = document.getElementById("travelStatusFilter");
    const destFilter = document.getElementById("travelDestFilter");
    const dateFilter = document.getElementById("travelDateFilter");
    const clearBtn = document.getElementById("clearTravelFilters");

    const debouncedFilter = debounce(() => {
      filterTravelOrders();
    }, 300);

    searchInput?.addEventListener("input", debouncedFilter);
    statusFilter?.addEventListener("change", filterTravelOrders);
    destFilter?.addEventListener("change", filterTravelOrders);
    dateFilter?.addEventListener("change", filterTravelOrders);
    clearBtn?.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "";
      destFilter.value = "";
      dateFilter.value = "";
      paginationState.travel.currentPage = 1;
      renderTravelTable();
    });

    // Sorting
    document.querySelectorAll('#travelOrdersTable th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const sortField = th.dataset.sort;
        if (paginationState.travel.sortField === sortField) {
          paginationState.travel.sortOrder = paginationState.travel.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          paginationState.travel.sortField = sortField;
          paginationState.travel.sortOrder = 'asc';
        }
        renderTravelTable();
      });
    });

    // Select all
    document.getElementById('selectAllTravelHead')?.addEventListener('change', (e) => {
      document.querySelectorAll('.travel-checkbox').forEach(cb => {
        cb.checked = e.target.checked;
      });
      updateTravelBulkBar();
    });
  }

  function initializeDriverFilters() {
    const searchInput = document.getElementById("searchDriverInput");
    const statusFilter = document.getElementById("driverStatusFilter");
    const vehicleFilter = document.getElementById("driverVehicleFilter");
    const dateFilter = document.getElementById("driverDateFilter");
    const clearBtn = document.getElementById("clearDriverFilters");

    const debouncedFilter = debounce(() => {
      filterDriverTrips();
    }, 300);

    searchInput?.addEventListener("input", debouncedFilter);
    statusFilter?.addEventListener("change", filterDriverTrips);
    vehicleFilter?.addEventListener("change", filterDriverTrips);
    dateFilter?.addEventListener("change", filterDriverTrips);
    clearBtn?.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "";
      vehicleFilter.value = "";
      dateFilter.value = "";
      paginationState.driver.currentPage = 1;
      renderDriverTable();
    });

    document.querySelectorAll('#driverTripsTable th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const sortField = th.dataset.sort;
        if (paginationState.driver.sortField === sortField) {
          paginationState.driver.sortOrder = paginationState.driver.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          paginationState.driver.sortField = sortField;
          paginationState.driver.sortOrder = 'asc';
        }
        renderDriverTable();
      });
    });

    document.getElementById('selectAllDriverHead')?.addEventListener('change', (e) => {
      document.querySelectorAll('.driver-checkbox').forEach(cb => {
        cb.checked = e.target.checked;
      });
      updateDriverBulkBar();
    });
  }

  function initializeUserFilters() {
    const searchInput = document.getElementById("searchUserInput");
    const deptFilter = document.getElementById("userDeptFilter");

    const debouncedFilter = debounce(() => {
      filterUsers();
    }, 300);

    searchInput?.addEventListener("input", debouncedFilter);
    deptFilter?.addEventListener("change", filterUsers);
  }

  function filterTravelOrders() {
    const searchValue = document.getElementById("searchTravelInput")?.value.toLowerCase() || "";
    const statusValue = document.getElementById("travelStatusFilter")?.value.toLowerCase() || "";
    const destValue = document.getElementById("travelDestFilter")?.value || "";
    const dateValue = document.getElementById("travelDateFilter")?.value || "";

    let filtered = allTravelOrders.filter(order => {
      const matchesSearch = !searchValue || 
        (order.username || '').toLowerCase().includes(searchValue) ||
        (order.destination || '').toLowerCase().includes(searchValue) ||
        (order.purpose || '').toLowerCase().includes(searchValue);
      
      const matchesStatus = !statusValue || order.statusKey === statusValue;
      const matchesDest = !destValue || order.destination === destValue;
      
      let matchesDate = true;
      if (dateValue) {
        const orderDate = order.dateSubmittedTimestamp;
        const now = new Date();
        
        if (dateValue === 'today') {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (dateValue === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
        } else if (dateValue === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesDest && matchesDate;
    });

    paginationState.travel.currentPage = 1;
    renderTravelTable(filtered);
  }

  function filterDriverTrips() {
    const searchValue = document.getElementById("searchDriverInput")?.value.toLowerCase() || "";
    const statusValue = document.getElementById("driverStatusFilter")?.value.toLowerCase() || "";
    const vehicleValue = document.getElementById("driverVehicleFilter")?.value || "";
    const dateValue = document.getElementById("driverDateFilter")?.value || "";

    let filtered = allDriverTrips.filter(trip => {
      const matchesSearch = !searchValue || 
        (trip.driverName || '').toLowerCase().includes(searchValue) ||
        (trip.vehicle || '').toLowerCase().includes(searchValue) ||
        (trip.destination || '').toLowerCase().includes(searchValue) ||
        (trip.purpose || '').toLowerCase().includes(searchValue);
      
      const matchesStatus = !statusValue || trip.statusKey === statusValue;
      const matchesVehicle = !vehicleValue || trip.vehicle === vehicleValue;
      
      let matchesDate = true;
      if (dateValue) {
        const tripDate = trip.dateSubmittedTimestamp;
        const now = new Date();
        
        if (dateValue === 'today') {
          matchesDate = tripDate.toDateString() === now.toDateString();
        } else if (dateValue === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = tripDate >= weekAgo;
        } else if (dateValue === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = tripDate >= monthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesVehicle && matchesDate;
    });

    paginationState.driver.currentPage = 1;
    renderDriverTable(filtered);
  }

  function filterUsers() {
    const searchValue = document.getElementById("searchUserInput")?.value.toLowerCase() || "";
    const deptValue = document.getElementById("userDeptFilter")?.value || "";

    let filtered = allUsers.filter(user => {
      const matchesSearch = !searchValue || 
        (user.username || '').toLowerCase().includes(searchValue) ||
        (user.firstName || '').toLowerCase().includes(searchValue) ||
        (user.lastName || '').toLowerCase().includes(searchValue) ||
        (user.email || '').toLowerCase().includes(searchValue);
      
      const matchesDept = !deptValue || user.department === deptValue;

      return matchesSearch && matchesDept;
    });

    renderUsersTable(filtered);
  }

  // Populate filters
  function populateTravelFilters(destinations) {
    const statusFilter = document.getElementById("travelStatusFilter");
    const destFilter = document.getElementById("travelDestFilter");

    if (statusFilter) {
      statusFilter.innerHTML = '<option value="">All Status</option>';
      ['pending', 'approved', 'denied', 'cancelled'].forEach(status => {
        statusFilter.innerHTML += `<option value="${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</option>`;
      });
    }

    if (destFilter) {
      destFilter.innerHTML = '<option value="">All Destinations</option>';
      destinations.sort().forEach(dest => {
        destFilter.innerHTML += `<option value="${dest}">${dest}</option>`;
      });
    }

    initializeTravelFilters();
  }

  function populateDriverFilters(vehicles) {
    const statusFilter = document.getElementById("driverStatusFilter");
    const vehicleFilter = document.getElementById("driverVehicleFilter");

    if (statusFilter) {
      statusFilter.innerHTML = '<option value="">All Status</option>';
      ['pending', 'approved', 'denied', 'cancelled'].forEach(status => {
        statusFilter.innerHTML += `<option value="${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</option>`;
      });
    }

    if (vehicleFilter) {
      vehicleFilter.innerHTML = '<option value="">All Vehicles</option>';
      vehicles.sort().forEach(vehicle => {
        vehicleFilter.innerHTML += `<option value="${vehicle}">${vehicle}</option>`;
      });
    }

    initializeDriverFilters();
  }

  function populateUserFilters(departments) {
    const deptFilter = document.getElementById("userDeptFilter");

    if (deptFilter) {
      deptFilter.innerHTML = '<option value="">All Departments</option>';
      departments.sort().forEach(dept => {
        deptFilter.innerHTML += `<option value="${dept}">${dept}</option>`;
      });
    }

    initializeUserFilters();
  }

  // Pagination
  function renderPagination(type, currentPage, totalPages) {
    const container = document.getElementById(`${type}Pagination`);
    if (!container) return;

    container.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        paginationState[type].currentPage--;
        if (type === 'travel') renderTravelTable();
        else renderDriverTable();
      }
    };
    container.appendChild(prevBtn);

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.onclick = () => {
        paginationState[type].currentPage = i;
        if (type === 'travel') renderTravelTable();
        else renderDriverTable();
      };
      container.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        paginationState[type].currentPage++;
        if (type === 'travel') renderTravelTable();
        else renderDriverTable();
      }
    };
    container.appendChild(nextBtn);
  }

  function updatePaginationInfo(type, start, end, total) {
    document.getElementById(`${type}ShowingStart`).textContent = start;
    document.getElementById(`${type}ShowingEnd`).textContent = end;
    document.getElementById(`${type}Total`).textContent = total;
  }

  // Update stats
  function updateGlobalStats(stats) {
    const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
    
    Object.entries(stats).forEach(([status, count]) => {
      const element = document.getElementById(`admin-${status}`);
      if (element) {
        const numberElement = element.querySelector('.number');
        if (numberElement) {
          animateCounter(numberElement, parseInt(numberElement.textContent) || 0, count);
        }
        
        const metaElement = document.getElementById(`meta-${status}`);
        if (metaElement && total > 0) {
          const percentage = Math.round((count / total) * 100);
          metaElement.textContent = `${percentage}% of total`;
        }
        
        const progressBar = document.getElementById(`progress-${status}`);
        if (progressBar && total > 0) {
          const percentage = (count / total) * 100;
          progressBar.style.width = `${percentage}%`;
        }
      }
    });

    document.getElementById('totalRequests').textContent = total;
    
    const approvalRate = total > 0 ? Math.round((stats.approved / total) * 100) : 0;
    document.getElementById('approvalRate').textContent = `${approvalRate}%`;

    const pendingBadges = document.querySelectorAll('.notification-badge');
    pendingBadges.forEach(badge => {
      if (stats.pending > 0) {
        badge.style.display = 'flex';
        badge.textContent = stats.pending;
      } else {
        badge.style.display = 'none';
      }
    });
  }

  function updateSectionStats(section, stats) {
    document.getElementById(`${section}PendingCount`).textContent = stats.pending || 0;
    document.getElementById(`${section}ApprovedCount`).textContent = stats.approved || 0;
  }

  // Recent activity
  function updateRecentActivity() {
    const container = document.getElementById('recentActivityList');
    if (!container) return;

    const allActivity = [
      ...allTravelOrders.map(o => ({ ...o, type: 'Travel Order' })),
      ...allDriverTrips.map(t => ({ ...t, type: 'Driver Trip' }))
    ].sort((a, b) => {
      const aTime = a.dateSubmittedTimestamp?.getTime() || 0;
      const bTime = b.dateSubmittedTimestamp?.getTime() || 0;
      return bTime - aTime;
    }).slice(0, 5);

    container.innerHTML = '';

    if (allActivity.length === 0) {
      container.innerHTML = '<div class="empty-state">No recent activity</div>';
      return;
    }

    allActivity.forEach(item => {
      const div = document.createElement('div');
      div.className = 'activity-item';
      div.innerHTML = `
        <div class="activity-icon ${item.statusKey}">
          <i class="fas fa-${item.type === 'Travel Order' ? 'plane' : 'car'}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">${item.username || item.driverName}</div>
          <div class="activity-meta">${item.type} - ${item.status}</div>
          <div class="activity-time">${getTimeAgo(item.dateSubmittedTimestamp)}</div>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // Top requesters
  function updateTopRequesters() {
    const container = document.getElementById('topRequestersList');
    if (!container) return;

    const userCounts = {};
    
    [...allTravelOrders, ...allDriverTrips].forEach(item => {
      const user = item.username || item.driverName;
      if (user) {
        userCounts[user] = (userCounts[user] || 0) + 1;
      }
    });

    const sorted = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    container.innerHTML = '';

    if (sorted.length === 0) {
      container.innerHTML = '<div class="empty-state">No data available</div>';
      return;
    }

    sorted.forEach(([user, count], index) => {
      const div = document.createElement('div');
      div.className = 'top-item';
      div.innerHTML = `
        <div class="top-rank">#${index + 1}</div>
        <img src="https://i.pravatar.cc/32?u=${user}" class="top-avatar" alt="">
        <div class="top-name">${user}</div>
        <div class="top-count">${count}</div>
      `;
      container.appendChild(div);
    });
  }

  // Initialize charts
  function initializeCharts() {
    // Placeholder for chart initialization
    console.log('Charts initialized');
  }

  // Sidebar navigation
  function initializeSidebar() {
    document.querySelectorAll(".sidebar-btn[data-section]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        document.querySelectorAll(".section").forEach(section => {
          section.classList.remove('active');
          section.style.display = "none";
        });
        
        const sectionName = btn.dataset.section;
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
          targetSection.classList.add('active');
          targetSection.style.display = "block";
        }
      });
    });
  }

  // Real-time updates
  function initializeRealTimeUpdates() {
    setInterval(() => {
      const lastUpdated = document.getElementById('lastUpdated');
      if (lastUpdated) {
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
      }
    }, 60000); // Update every minute
  }

  // Header actions
  document.getElementById('refreshBtn')?.addEventListener('click', () => {
    showNotification('Refreshing data...', 'info');
    loadTravelOrders();
    loadDriverTrips();
    loadUsers();
  });

  document.getElementById('exportBtn')?.addEventListener('click', () => {
    exportAllData();
  });

  document.getElementById('adminLogoutBtn')?.addEventListener('click', async () => {
    const confirm = await showConfirmDialog('Logout', 'Are you sure you want to logout?');
    if (confirm) {
      await firebase.auth().signOut();
      window.location.href = 'login.html';
    }
  });

  // Bulk action handlers
  document.getElementById('bulkApproveTravel')?.addEventListener('click', () => {
    bulkUpdateStatus('travel', 'Approved');
  });

  document.getElementById('bulkDenyTravel')?.addEventListener('click', () => {
    bulkUpdateStatus('travel', 'Denied');
  });

  document.getElementById('bulkCancelTravel')?.addEventListener('click', () => {
    bulkUpdateStatus('travel', 'Cancelled');
  });

  document.getElementById('bulkApproveDriver')?.addEventListener('click', () => {
    bulkUpdateStatus('driver', 'Approved');
  });

  document.getElementById('bulkDenyDriver')?.addEventListener('click', () => {
    bulkUpdateStatus('driver', 'Denied');
  });

  document.getElementById('bulkCancelDriver')?.addEventListener('click', () => {
    bulkUpdateStatus('driver', 'Cancelled');
  });

  // Export handlers
  document.getElementById('exportTravelBtn')?.addEventListener('click', () => {
    exportToCSV(allTravelOrders, 'travel_orders');
  });

  document.getElementById('exportDriverBtn')?.addEventListener('click', () => {
    exportToCSV(allDriverTrips, 'driver_trips');
  });

  // Load all data
  loadTravelOrders();
  loadDriverTrips();
  loadUsers();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (unsubscribeTravel) unsubscribeTravel();
    if (unsubscribeDrivers) unsubscribeDrivers();
    if (unsubscribeUsers) unsubscribeUsers();
  });
}

// Utility functions
function createEmptyState(colspan, message, icon) {
  return `
    <tr>
      <td colspan="${colspan}" class="empty-state">
        <i class="${icon} fa-3x"></i>
        <p>${message}</p>
      </td>
    </tr>
  `;
}

function formatDate(dateInput) {
  if (!dateInput) return '-';
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTimestamp(timestamp) {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getTimeAgo(date) {
  if (!date) return 'Unknown';
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function animateCounter(element, start, end) {
  const duration = 500;
  const startTime = Date.now();
  
  const animate = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * progress);
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
}

function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    showNotification('No data to export', 'warning');
    return;
  }
  
  const headers = Object.keys(data[0]).filter(key => 
    !key.includes('Timestamp') && key !== 'id'
  );
  
  let csv = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      let value = row[header];
      if (value && typeof value === 'object' && value.toDate) {
        value = formatDate(value);
      }
      return `"${value || ''}"`;
    });
    csv += values.join(',') + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  showNotification('Export successful', 'success');
}

function exportAllData() {
  showNotification('Preparing export...', 'info');
  setTimeout(() => {
    exportToCSV(allTravelOrders, 'all_travel_orders');
    setTimeout(() => {
      exportToCSV(allDriverTrips, 'all_driver_trips');
    }, 500);
  }, 500);
}

// Global functions for modal interactions
window.viewTravelDetails = function(id) {
  const order = allTravelOrders.find(o => o.id === id);
  if (!order) return;
  
  showDetailsModal('Travel Order Details', `
    <div class="details-grid">
      <div class="detail-item">
        <strong>Username:</strong> ${order.username || '-'}
      </div>
      <div class="detail-item">
        <strong>Destination:</strong> ${order.destination || '-'}
      </div>
      <div class="detail-item">
        <strong>Purpose:</strong> ${order.purpose || '-'}
      </div>
      <div class="detail-item">
        <strong>Date From:</strong> ${formatDate(order.dateFrom)}
      </div>
      <div class="detail-item">
        <strong>Date To:</strong> ${formatDate(order.dateTo)}
      </div>
      <div class="detail-item">
        <strong>Status:</strong> <span class="status-badge ${order.statusKey}">${order.status}</span>
      </div>
      <div class="detail-item">
        <strong>Submitted:</strong> ${formatTimestamp(order.dateSubmitted)}
      </div>
    </div>
  `);
};

window.viewDriverDetails = function(id) {
  const trip = allDriverTrips.find(t => t.id === id);
  if (!trip) return;
  
  showDetailsModal('Driver Trip Details', `
    <div class="details-grid">
      <div class="detail-item">
        <strong>Driver Name:</strong> ${trip.driverName || '-'}
      </div>
      <div class="detail-item">
        <strong>Vehicle:</strong> ${trip.vehicle || '-'}
      </div>
      <div class="detail-item">
        <strong>Destination:</strong> ${trip.destination || '-'}
      </div>
      <div class="detail-item">
        <strong>Purpose:</strong> ${trip.purpose || '-'}
      </div>
      <div class="detail-item">
        <strong>Departure Date:</strong> ${formatDate(trip.departureDate)}
      </div>
      <div class="detail-item">
        <strong>Status:</strong> <span class="status-badge ${trip.statusKey}">${trip.status}</span>
      </div>
      <div class="detail-item">
        <strong>Submitted:</strong> ${formatTimestamp(trip.dateSubmitted)}
      </div>
    </div>
  `);
};

window.reviewTravel = async function(id) {
  const order = allTravelOrders.find(o => o.id === id);
  if (!order || order.statusKey !== 'pending') return;
  
  const action = await showActionDialog('Review Travel Order', order);
  if (!action) return;
  
  try {
    await window.db.collection('travel_orders').doc(id).update({
      status: action,
      updatedBy: admin.username,
      updatedAt: new Date()
    });
    showNotification(`Travel order ${action.toLowerCase()}`, 'success');
  } catch (error) {
    console.error('Review error:', error);
    showNotification(`Error: ${error.message}`, 'error');
  }
};

window.reviewDriver = async function(id) {
  const trip = allDriverTrips.find(t => t.id === id);
  if (!trip || trip.statusKey !== 'pending') return;
  
  const action = await showActionDialog('Review Driver Trip', trip);
  if (!action) return;
  
  try {
    await window.db.collection('drivers_trip_tickets').doc(id).update({
      status: action,
      updatedBy: admin.username,
      updatedAt: new Date()
    });
    showNotification(`Driver trip ${action.toLowerCase()}`, 'success');
  } catch (error) {
    console.error('Review error:', error);
    showNotification(`Error: ${error.message}`, 'error');
  }
};

window.closeDetailsModal = function() {
  const modal = document.getElementById('detailsModal');
  if (modal) modal.style.display = 'none';
};

function showDetailsModal(title, content) {
  const modal = document.getElementById('detailsModal');
  if (!modal) return;
  
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = content;
  modal.style.display = 'flex';
}

function showActionDialog(title, item) {
  return new Promise(resolve => {
    const content = `
      <p>Review this ${title.includes('Travel') ? 'travel order' : 'driver trip'}?</p>
      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
        <button class="btn btn-success" onclick="this.closest('.modal-content').dataset.action='Approved'; closeDetailsModal();">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="btn btn-danger" onclick="this.closest('.modal-content').dataset.action='Denied'; closeDetailsModal();">
          <i class="fas fa-times"></i> Deny
        </button>
        <button class="btn btn-secondary" onclick="closeDetailsModal();">
          Cancel
        </button>
      </div>
    `;
    
    showDetailsModal(title, content);
    
    const modal = document.getElementById('detailsModal');
    const modalContent = modal.querySelector('.modal-content');
    
    const checkAction = setInterval(() => {
      if (modal.style.display === 'none') {
        clearInterval(checkAction);
        resolve(modalContent.dataset.action || null);
        delete modalContent.dataset.action;
      }
    }, 100);
  });
}

function showConfirmDialog(title, message) {
  return new Promise(resolve => {
    const content = `
      <p>${message}</p>
      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
        <button class="btn btn-primary" onclick="this.closest('.modal-content').dataset.confirmed='true'; closeDetailsModal();">
          Confirm
        </button>
        <button class="btn btn-secondary" onclick="closeDetailsModal();">
          Cancel
        </button>
      </div>
    `;
    
    showDetailsModal(title, content);
    
    const modal = document.getElementById('detailsModal');
    const modalContent = modal.querySelector('.modal-content');
    
    const checkConfirm = setInterval(() => {
      if (modal.style.display === 'none') {
        clearInterval(checkConfirm);
        const confirmed = modalContent.dataset.confirmed === 'true';
        delete modalContent.dataset.confirmed;
        resolve(confirmed);
      }
    }, 100);
  });
}

function showNotification(message, type = 'info') {
  // Simple notification implementation
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function initializeDashboardOnLoad() {
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function injectAdvancedAdminStyles() {
  // Placeholder for additional styles
  console.log('Advanced admin styles injected');
}

// Mount function for integration with login system
window.mountAdminDashboard = async function(userData) {
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
        const existingContent = document.body.innerHTML;
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