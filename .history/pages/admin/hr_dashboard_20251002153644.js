// HR Dashboard - Firestore Integration
function renderHRDashboard(user = { username: "HRManager", position: "HR Manager", department: "HR" }) {
  return `
    ${renderNav()}
    <div class="hr-container">
      <!-- Sidebar -->
      <aside class="hr-sidebar">
        <div class="hr-sidebar-header">
          <div class="hr-icon-wrapper">
            <i class="fas fa-users"></i>
          </div>
          <div class="hr-title">HR PORTAL</div>
          <div class="hr-subtitle">Human Resources</div>
        </div>
        
        <nav class="hr-nav">
          <button class="hr-nav-btn active" data-section="dashboard">
            <i class="fas fa-chart-pie"></i>
            <span>Dashboard</span>
          </button>
          <button class="hr-nav-btn" data-section="leave">
            <i class="fas fa-calendar-alt"></i>
            <span>Leave Requests</span>
            <span id="leaveBadge" class="hr-badge">0</span>
          </button>
          <button class="hr-nav-btn" data-section="restday">
            <i class="fas fa-clock"></i>
            <span>Rest Day Requests</span>
            <span id="restdayBadge" class="hr-badge">0</span>
          </button>
          <button class="hr-nav-btn" data-section="employees">
            <i class="fas fa-user-friends"></i>
            <span>Employees</span>
          </button>
          <button class="hr-nav-btn" data-section="analytics">
            <i class="fas fa-chart-line"></i>
            <span>Analytics</span>
          </button>
        </nav>
        
        <button class="hr-logout-btn" id="hrLogoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </aside>

      <!-- Main Content -->
      <main class="hr-main">
        <!-- Header -->
        <header class="hr-header">
          <div class="hr-header-content">
            <h2>HR Department Dashboard</h2>
            <div class="hr-header-subtitle">
              Welcome, ${user.username} (${user.position})
              <span class="hr-last-updated" id="hrLastUpdated">Last updated: ${new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div class="hr-header-actions">
            <button class="hr-header-btn" id="hrRefreshBtn" title="Refresh Data">
              <i class="fas fa-sync-alt"></i>
            </button>
            <div class="hr-header-avatar">
              <img src="https://i.pravatar.cc/44?u=${user.username}" alt="avatar">
              <div class="hr-online-indicator"></div>
            </div>
          </div>
        </header>

        <!-- Dashboard Section -->
        <div id="dashboardSection" class="hr-section">
          <!-- Stats Cards -->
          <div class="hr-stats-container">
            <div class="hr-stat-card pending">
              <div class="hr-stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="hr-stat-content">
                <div class="hr-stat-label">Pending</div>
                <div class="hr-stat-value" id="statPending">0</div>
              </div>
            </div>
            <div class="hr-stat-card approved">
              <div class="hr-stat-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="hr-stat-content">
                <div class="hr-stat-label">Approved</div>
                <div class="hr-stat-value" id="statApproved">0</div>
              </div>
            </div>
            <div class="hr-stat-card denied">
              <div class="hr-stat-icon">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="hr-stat-content">
                <div class="hr-stat-label">Denied</div>
                <div class="hr-stat-value" id="statDenied">0</div>
              </div>
            </div>
            <div class="hr-stat-card total">
              <div class="hr-stat-icon">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <div class="hr-stat-content">
                <div class="hr-stat-label">Total Requests</div>
                <div class="hr-stat-value" id="statTotal">0</div>
              </div>
            </div>
          </div>

          <!-- Quick Overview -->
          <div class="hr-dashboard-grid">
            <!-- Recent Leave Requests -->
            <div class="hr-card">
              <div class="hr-card-header">
                <h4><i class="fas fa-calendar-alt"></i> Recent Leave Requests</h4>
                <span class="hr-pill pending" id="recentLeavePending">0 Pending</span>
              </div>
              <div class="hr-card-body" id="recentLeaveList">
                <div class="hr-loading">Loading...</div>
              </div>
            </div>

            <!-- Employee Overview -->
            <div class="hr-card">
              <div class="hr-card-header">
                <h4><i class="fas fa-users"></i> Employee Overview</h4>
              </div>
              <div class="hr-card-body">
                <div class="hr-overview-item active">
                  <div class="hr-overview-icon">
                    <i class="fas fa-user-check"></i>
                  </div>
                  <div class="hr-overview-content">
                    <div class="hr-overview-label">Active Employees</div>
                    <div class="hr-overview-value" id="activeEmployees">0</div>
                  </div>
                </div>
                <div class="hr-overview-item departments">
                  <div class="hr-overview-icon">
                    <i class="fas fa-building"></i>
                  </div>
                  <div class="hr-overview-content">
                    <div class="hr-overview-label">Departments</div>
                    <div class="hr-overview-value" id="totalDepartments">0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leave Requests Section -->
        <div id="leaveSection" class="hr-section" style="display: none;">
          <div class="hr-section-header">
            <h3><i class="fas fa-calendar-alt"></i> Leave Requests Management</h3>
            <div class="hr-section-controls">
              <input type="text" id="leaveSearchInput" placeholder="Search..." class="hr-search-input">
              <select id="leaveStatusFilter" class="hr-filter-select">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
              <select id="leaveTypeFilter" class="hr-filter-select">
                <option value="">All Types</option>
                <option value="vacation">Vacation</option>
                <option value="sick">Sick</option>
                <option value="emergency">Emergency</option>
                <option value="personal">Personal</option>
              </select>
            </div>
          </div>
          <div class="hr-table-wrapper">
            <table class="hr-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="leaveRequestsTable">
                <tr><td colspan="8" class="hr-loading">Loading leave requests...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Rest Day Requests Section -->
        <div id="restdaySection" class="hr-section" style="display: none;">
          <div class="hr-section-header">
            <h3><i class="fas fa-clock"></i> Rest Day Requests Management</h3>
            <div class="hr-section-controls">
              <input type="text" id="restdaySearchInput" placeholder="Search..." class="hr-search-input">
              <select id="restdayStatusFilter" class="hr-filter-select">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </div>
          </div>
          <div class="hr-table-wrapper">
            <table class="hr-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="restdayRequestsTable">
                <tr><td colspan="7" class="hr-loading">Loading rest day requests...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Employees Section -->
        <div id="employeesSection" class="hr-section" style="display: none;">
          <div class="hr-section-header">
            <h3><i class="fas fa-user-friends"></i> Employee Directory</h3>
            <div class="hr-section-controls">
              <input type="text" id="employeeSearchInput" placeholder="Search employees..." class="hr-search-input">
              <select id="departmentFilter" class="hr-filter-select">
                <option value="">All Departments</option>
              </select>
            </div>
          </div>
          <div class="hr-employee-grid" id="employeeGrid">
            <div class="hr-loading">Loading employees...</div>
          </div>
        </div>

        <!-- Analytics Section -->
        <div id="analyticsSection" class="hr-section" style="display: none;">
          <div class="hr-section-header">
            <h3><i class="fas fa-chart-line"></i> Analytics & Reports</h3>
          </div>
          
          <!-- Department Breakdown -->
          <div class="hr-card">
            <div class="hr-card-header">
              <h4>Requests by Department</h4>
            </div>
            <div class="hr-card-body" id="departmentBreakdown">
              <div class="hr-loading">Loading analytics...</div>
            </div>
          </div>

          <!-- Monthly Stats -->
          <div class="hr-analytics-grid">
            <div class="hr-analytics-card approved">
              <div class="hr-analytics-value" id="analyticsApproved">0</div>
              <div class="hr-analytics-label">Approved This Month</div>
            </div>
            <div class="hr-analytics-card pending">
              <div class="hr-analytics-value" id="analyticsPending">0</div>
              <div class="hr-analytics-label">Awaiting Review</div>
            </div>
            <div class="hr-analytics-card total-days">
              <div class="hr-analytics-value" id="analyticsTotalDays">0</div>
              <div class="hr-analytics-label">Total Leave Days</div>
            </div>
          </div>
        </div>
      </main>
    </div>
    ${renderHRStyles()}
  `;
}

// Render HR Styles
function renderHRStyles() {
  return `
    <style>
      .hr-container {
        display: grid;
        grid-template-columns: 280px 1fr;
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }

      /* Sidebar */
      .hr-sidebar {
        background: linear-gradient(145deg, #1e293b, #0f172a);
        color: white;
        padding: 24px;
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 0;
        height: 100vh;
      }

      .hr-sidebar-header {
        text-align: center;
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .hr-icon-wrapper {
        width: 80px;
        height: 80px;
        margin: 0 auto 16px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
      }

      .hr-title {
        font-size: 20px;
        font-weight: 800;
        background: linear-gradient(135deg, #60a5fa, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hr-subtitle {
        font-size: 14px;
        color: #94a3b8;
        margin-top: 4px;
      }

      .hr-nav {
        flex: 1;
        margin-bottom: 24px;
      }

      .hr-nav-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: transparent;
        border: none;
        color: #cbd5e1;
        border-radius: 10px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 8px;
        transition: all 0.3s ease;
        position: relative;
      }

      .hr-nav-btn:hover,
      .hr-nav-btn.active {
        background: rgba(59, 130, 246, 0.2);
        color: white;
        transform: translateX(4px);
      }

      .hr-badge {
        margin-left: auto;
        background: #ef4444;
        color: white;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 700;
      }

      .hr-logout-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border: none;
        color: white;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .hr-logout-btn:hover {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        transform: translateY(-2px);
      }

      /* Main Content */
      .hr-main {
        padding: 24px;
        overflow-y: auto;
      }

      .hr-header {
        background: white;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .hr-header h2 {
        font-size: 28px;
        font-weight: 800;
        background: linear-gradient(135deg, #0f172a, #3b82f6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
      }

      .hr-header-subtitle {
        font-size: 14px;
        color: #64748b;
        margin-top: 4px;
      }

      .hr-last-updated {
        display: block;
        font-size: 12px;
        color: #3b82f6;
        font-weight: 600;
        margin-top: 4px;
      }

      .hr-header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .hr-header-btn {
        width: 40px;
        height: 40px;
        border: none;
        background: #f1f5f9;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .hr-header-btn:hover {
        background: #3b82f6;
        color: white;
      }

      .hr-header-avatar {
        position: relative;
      }

      .hr-header-avatar img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 3px solid #3b82f6;
      }

      .hr-online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
      }

      /* Stats Cards */
      .hr-stats-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }

      .hr-stat-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 16px;
        transition: transform 0.3s ease;
      }

      .hr-stat-card:hover {
        transform: translateY(-4px);
      }

      .hr-stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
      }

      .hr-stat-card.pending .hr-stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
      .hr-stat-card.approved .hr-stat-icon { background: linear-gradient(135deg, #10b981, #059669); }
      .hr-stat-card.denied .hr-stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
      .hr-stat-card.total .hr-stat-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }

      .hr-stat-label {
        font-size: 14px;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .hr-stat-value {
        font-size: 32px;
        font-weight: 800;
        color: #0f172a;
      }

      /* Dashboard Grid */
      .hr-dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }

      .hr-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .hr-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f1f5f9;
      }

      .hr-card-header h4 {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .hr-pill {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
      }

      .hr-pill.pending {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }

      .hr-overview-item {
        padding: 16px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .hr-overview-item.active {
        background: rgba(16, 185, 129, 0.1);
      }

      .hr-overview-item.departments {
        background: rgba(59, 130, 246, 0.1);
      }

      .hr-overview-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }

      .hr-overview-item.active .hr-overview-icon {
        background: #10b981;
        color: white;
      }

      .hr-overview-item.departments .hr-overview-icon {
        background: #3b82f6;
        color: white;
      }

      .hr-overview-label {
        font-size: 14px;
        color: #64748b;
        font-weight: 600;
      }

      .hr-overview-value {
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
      }

      /* Section */
      .hr-section {
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .hr-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .hr-section-header h3 {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .hr-section-controls {
        display: flex;
        gap: 12px;
      }

      .hr-search-input {
        padding: 10px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
        min-width: 250px;
        transition: border-color 0.3s ease;
      }

      .hr-search-input:focus {
        outline: none;
        border-color: #3b82f6;
      }

      .hr-filter-select {
        padding: 10px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
        cursor: pointer;
        background: white;
        transition: border-color 0.3s ease;
      }

      .hr-filter-select:focus {
        outline: none;
        border-color: #3b82f6;
      }

      /* Table */
      .hr-table-wrapper {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .hr-table {
        width: 100%;
        border-collapse: collapse;
      }

      .hr-table thead {
        background: #f8fafc;
      }

      .hr-table th {
        padding: 16px;
        text-align: left;
        font-weight: 700;
        color: #0f172a;
        font-size: 14px;
        border-bottom: 2px solid #e2e8f0;
      }

      .hr-table td {
        padding: 16px;
        border-bottom: 1px solid #f1f5f9;
        color: #475569;
      }

      .hr-table tr:hover {
        background: #f8fafc;
      }

      .hr-table-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 12px;
      }

      .hr-status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        text-transform: capitalize;
      }

      .hr-status-badge.pending {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }

      .hr-status-badge.approved {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      .hr-status-badge.denied {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }

      .hr-type-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        text-transform: capitalize;
      }

      .hr-action-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 8px;
      }

      .hr-action-btn.approve {
        background: #10b981;
        color: white;
      }

      .hr-action-btn.approve:hover {
        background: #059669;
        transform: translateY(-2px);
      }

      .hr-action-btn.deny {
        background: #ef4444;
        color: white;
      }

      .hr-action-btn.deny:hover {
        background: #dc2626;
        transform: translateY(-2px);
      }

      .hr-action-btn.view {
        background: #3b82f6;
        color: white;
      }

      .hr-action-btn.view:hover {
        background: #2563eb;
      }

      /* Employee Grid */
      .hr-employee-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .hr-employee-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .hr-employee-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      .hr-employee-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .hr-employee-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 3px solid #3b82f6;
      }

      .hr-employee-name {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
      }

      .hr-employee-position {
        font-size: 14px;
        color: #64748b;
      }

      .hr-employee-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 16px;
      }

      .hr-employee-info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #475569;
      }

      /* Analytics */
      .hr-analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .hr-analytics-card {
        background: white;
        border-radius: 16px;
        padding: 32px;
        text-align: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .hr-analytics-card.approved {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
      }

      .hr-analytics-card.pending {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
      }

      .hr-analytics-card.total-days {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
      }

      .hr-analytics-value {
        font-size: 48px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 8px;
      }

      .hr-analytics-label {
        font-size: 14px;
        color: #64748b;
        font-weight: 600;
      }

      .hr-loading {
        text-align: center;
        padding: 40px;
        color: #64748b;
        font-size: 14px;
      }

      @media (max-width: 1024px) {
        .hr-container {
          grid-template-columns: 1fr;
        }

        .hr-sidebar {
          position: static;
          height: auto;
        }

        .hr-dashboard-grid,
        .hr-stats-container {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
}

// Initialize HR Dashboard
async function attachHRDashboard(user) {
  injectHREventHandlers();
  
  // Load initial data
  await loadHRStats();
  await loadLeaveRequests();
  await loadRestDayRequests();
  await loadEmployees();
  await loadRecentLeaveList();
  
  // Update time
  setInterval(() => {
    document.getElementById('hrLastUpdated').textContent = 
      `Last updated: ${new Date().toLocaleTimeString()}`;
  }, 30000);

  // Logout handler
  const logoutBtn = document.getElementById('hrLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      window.registerLogoutCallback(async () => {
        console.log('HR dashboard cleanup');
      });
      
      const success = await window.logout({
        customMessage: "Are you sure you want to logout from HR dashboard?"
      });

      if (success) {
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        logoutBtn.disabled = true;
      }
    });
  }
}

// Inject Event Handlers
function injectHREventHandlers() {
  // Navigation
  document.querySelectorAll('.hr-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.hr-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Hide all sections
      document.querySelectorAll('.hr-section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Show target section
      const section = btn.getAttribute('data-section');
      document.getElementById(`${section}Section`).style.display = 'block';
    });
  });

  // Refresh button
  const refreshBtn = document.getElementById('hrRefreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      await loadHRStats();
      await loadLeaveRequests();
      await loadRestDayRequests();
      await loadRecentLeaveList();
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    });
  }

  // Search and filters for leave requests
  const leaveSearch = document.getElementById('leaveSearchInput');
  const leaveStatusFilter = document.getElementById('leaveStatusFilter');
  const leaveTypeFilter = document.getElementById('leaveTypeFilter');
  
  if (leaveSearch) {
    leaveSearch.addEventListener('input', () => filterLeaveRequests());
  }
  if (leaveStatusFilter) {
    leaveStatusFilter.addEventListener('change', () => filterLeaveRequests());
  }
  if (leaveTypeFilter) {
    leaveTypeFilter.addEventListener('change', () => filterLeaveRequests());
  }

  // Search and filter for rest day requests
  const restdaySearch = document.getElementById('restdaySearchInput');
  const restdayStatusFilter = document.getElementById('restdayStatusFilter');
  
  if (restdaySearch) {
    restdaySearch.addEventListener('input', () => filterRestDayRequests());
  }
  if (restdayStatusFilter) {
    restdayStatusFilter.addEventListener('change', () => filterRestDayRequests());
  }

  // Employee search
  const employeeSearch = document.getElementById('employeeSearchInput');
  const departmentFilter = document.getElementById('departmentFilter');
  
  if (employeeSearch) {
    employeeSearch.addEventListener('input', () => filterEmployees());
  }
  if (departmentFilter) {
    departmentFilter.addEventListener('change', () => filterEmployees());
  }
}

// Load HR Stats
async function loadHRStats() {
  try {
    const [leaveSnapshot, restdaySnapshot] = await Promise.all([
      window.db.collection('leave_requests').get(),
      window.db.collection('early_rest_requests').get()
    ]);

    const allRequests = [
      ...leaveSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })),
      ...restdaySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    ];

    const stats = {
      pending: allRequests.filter(r => r.status === 'pending').length,
      approved: allRequests.filter(r => r.status === 'approved').length,
      denied: allRequests.filter(r => r.status === 'denied').length,
      total: allRequests.length
    };

    // Update stat cards
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statApproved').textContent = stats.approved;
    document.getElementById('statDenied').textContent = stats.denied;
    document.getElementById('statTotal').textContent = stats.total;

    // Update badges
    const leavePending = leaveSnapshot.docs.filter(doc => doc.data().status === 'pending').length;
    const restdayPending = restdaySnapshot.docs.filter(doc => doc.data().status === 'pending').length;
    
    document.getElementById('leaveBadge').textContent = leavePending;
    document.getElementById('restdayBadge').textContent = restdayPending;

  } catch (error) {
    console.error('Error loading HR stats:', error);
  }
}

// Load Leave Requests
async function loadLeaveRequests() {
  try {
    const snapshot = await window.db.collection('leave_requests')
      .orderBy('submittedAt', 'desc')
      .get();

    const tbody = document.getElementById('leaveRequestsTable');
    tbody.innerHTML = '';

    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="8" class="hr-loading">No leave requests found</td></tr>';
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const row = createLeaveRequestRow(doc.id, data);
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading leave requests:', error);
    document.getElementById('leaveRequestsTable').innerHTML = 
      '<tr><td colspan="8" class="hr-loading">Error loading leave requests</td></tr>';
  }
}

// Update createLeaveRequestRow in hr_dashboard.js
function createLeaveRequestRow(id, data) {
  const row = document.createElement('tr');
  row.className = 'leave-request-row';
  row.dataset.id = id;
  row.dataset.status = data.status || 'pending';
  row.dataset.type = data.type || '';
  row.dataset.employee = data.employeeName || '';
  row.dataset.department = data.department || '';
  
  const deptStatus = data.departmentApproval || 'pending';
  const hrStatus = data.hrApproval || 'pending';
  
  row.innerHTML = `
    <td>
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="https://i.pravatar.cc/40?u=${data.employeeName}" class="hr-table-avatar" alt="">
        <span style="font-weight: 600;">${data.employeeName || 'N/A'}</span>
      </div>
    </td>
    <td>${data.department || 'N/A'}</td>
    <td><span class="hr-type-badge">${data.type || 'N/A'}</span></td>
    <td style="font-size: 13px;">
      ${data.startDate || 'N/A'} to ${data.endDate || 'N/A'}
    </td>
    <td style="font-weight: 700;">${data.totalDays || 0}</td>
    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${data.reason || ''}">${data.reason || 'N/A'}</td>
    <td>
      <span class="hr-status-badge ${data.status || 'pending'}">${data.status || 'pending'}</span>
      <div style="font-size: 11px; margin-top: 4px;">
        <div>Dept: <span class="hr-status-badge ${deptStatus}" style="font-size: 10px; padding: 2px 6px;">${deptStatus}</span></div>
        <div>HR: <span class="hr-status-badge ${hrStatus}" style="font-size: 10px; padding: 2px 6px;">${hrStatus}</span></div>
      </div>
    </td>
    <td>
      ${deptStatus === 'approved' && hrStatus === 'pending' ? `
        <button class="hr-action-btn approve" onclick="handleApproveLeave('${id}')">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="hr-action-btn deny" onclick="handleDenyLeave('${id}')">
          <i class="fas fa-times"></i> Deny
        </button>
      ` : deptStatus === 'pending' ? `
        <span style="color: #f59e0b; font-size: 12px; font-weight: 600;">
          <i class="fas fa-clock"></i> Awaiting Dept Approval
        </span>
      ` : deptStatus === 'denied' ? `
        <span style="color: #ef4444; font-size: 12px; font-weight: 600;">
          <i class="fas fa-times-circle"></i> Denied by Dept
        </span>
      ` : `
        <button class="hr-action-btn view" onclick="viewLeaveDetails('${id}')">
          <i class="fas fa-eye"></i> View
        </button>
      `}
    </td>
  `;
  
  return row;
}

// Load Rest Day Requests
async function loadRestDayRequests() {
  try {
    const snapshot = await window.db.collection('early_rest_requests')
      .orderBy('submittedAt', 'desc')
      .get();

    const tbody = document.getElementById('restdayRequestsTable');
    tbody.innerHTML = '';

    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="7" class="hr-loading">No rest day requests found</td></tr>';
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const row = createRestDayRequestRow(doc.id, data);
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading rest day requests:', error);
    document.getElementById('restdayRequestsTable').innerHTML = 
      '<tr><td colspan="7" class="hr-loading">Error loading rest day requests</td></tr>';
  }
}

// Update createRestDayRequestRow in hr_dashboard.js
function createRestDayRequestRow(id, data) {
  const row = document.createElement('tr');
  row.className = 'restday-request-row';
  row.dataset.id = id;
  row.dataset.status = data.status || 'pending';
  row.dataset.employee = data.employeeName || '';
  row.dataset.department = data.department || '';
  
  const deptStatus = data.departmentApproval || 'pending';
  const hrStatus = data.hrApproval || 'pending';
  
  row.innerHTML = `
    <td>
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="https://i.pravatar.cc/40?u=${data.employeeName}" class="hr-table-avatar" alt="">
        <span style="font-weight: 600;">${data.employeeName || 'N/A'}</span>
      </div>
    </td>
    <td>${data.department || 'N/A'}</td>
    <td><span class="hr-type-badge">${data.type || 'N/A'}</span></td>
    <td>${data.date || 'N/A'}</td>
    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${data.reason || ''}">${data.reason || 'N/A'}</td>
    <td>
      <span class="hr-status-badge ${data.status || 'pending'}">${data.status || 'pending'}</span>
      <div style="font-size: 11px; margin-top: 4px;">
        <div>Dept: <span class="hr-status-badge ${deptStatus}" style="font-size: 10px; padding: 2px 6px;">${deptStatus}</span></div>
        <div>HR: <span class="hr-status-badge ${hrStatus}" style="font-size: 10px; padding: 2px 6px;">${hrStatus}</span></div>
      </div>
    </td>
    <td>
      ${deptStatus === 'approved' && hrStatus === 'pending' ? `
        <button class="hr-action-btn approve" onclick="handleApproveRestDay('${id}')">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="hr-action-btn deny" onclick="handleDenyRestDay('${id}')">
          <i class="fas fa-times"></i> Deny
        </button>
      ` : deptStatus === 'pending' ? `
        <span style="color: #f59e0b; font-size: 12px; font-weight: 600;">
          <i class="fas fa-clock"></i> Awaiting Dept Approval
        </span>
      ` : deptStatus === 'denied' ? `
        <span style="color: #ef4444; font-size: 12px; font-weight: 600;">
          <i class="fas fa-times-circle"></i> Denied by Dept
        </span>
      ` : `
        <button class="hr-action-btn view" onclick="viewRestDayDetails('${id}')">
          <i class="fas fa-eye"></i> View
        </button>
      `}
    </td>
  `;
  
  return row;
}
// Load Employees
async function loadEmployees() {
  try {
    const snapshot = await window.db.collection('clients').get();

    const container = document.getElementById('employeeGrid');
    const departmentFilter = document.getElementById('departmentFilter');
    
    if (snapshot.empty) {
      container.innerHTML = '<div class="hr-loading">No employees found</div>';
      return;
    }

    container.innerHTML = '';
    const departments = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      departments.add(data.department || 'N/A');
      
      const card = createEmployeeCard(data);
      container.appendChild(card);
    });

    // Update employee stats
    document.getElementById('activeEmployees').textContent = 
      snapshot.docs.filter(doc => doc.data().status !== 'inactive').length;
    document.getElementById('totalDepartments').textContent = departments.size;

    // Populate department filter
    departmentFilter.innerHTML = '<option value="">All Departments</option>';
    Array.from(departments).sort().forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      departmentFilter.appendChild(option);
    });

  } catch (error) {
    console.error('Error loading employees:', error);
    document.getElementById('employeeGrid').innerHTML = 
      '<div class="hr-loading">Error loading employees</div>';
  }
}

// Create Employee Card
function createEmployeeCard(data) {
  const card = document.createElement('div');
  card.className = 'hr-employee-card';
  card.dataset.name = data.firstName + ' ' + data.lastName;
  card.dataset.department = data.department || '';
  
  card.innerHTML = `
    <div class="hr-employee-header">
      <img src="https://i.pravatar.cc/64?u=${data.username}" class="hr-employee-avatar" alt="">
      <div>
        <h4 class="hr-employee-name">${data.firstName || ''} ${data.lastName || ''}</h4>
        <p class="hr-employee-position">${data.position || 'N/A'}</p>
      </div>
    </div>
    <div class="hr-employee-info">
      <div class="hr-employee-info-item">
        <i class="fas fa-building"></i>
        <span>${data.department || 'N/A'}</span>
      </div>
      <div class="hr-employee-info-item">
        <i class="fas fa-envelope"></i>
        <span>${data.email || 'N/A'}</span>
      </div>
      <div class="hr-employee-info-item">
        <i class="fas fa-circle" style="color: ${data.status === 'inactive' ? '#ef4444' : '#10b981'}; font-size: 8px;"></i>
        <span>${data.status === 'inactive' ? 'Inactive' : 'Active'}</span>
      </div>
    </div>
  `;
  
  return card;
}

// Load Recent Leave List
async function loadRecentLeaveList() {
  try {
    const snapshot = await window.db.collection('leave_requests')
      .orderBy('submittedAt', 'desc')
      .limit(5)
      .get();

    const container = document.getElementById('recentLeaveList');
    
    if (snapshot.empty) {
      container.innerHTML = '<div class="hr-loading">No recent requests</div>';
      return;
    }

    container.innerHTML = '';
    let pendingCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'pending') pendingCount++;
      
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border-radius: 12px; margin-bottom: 12px;';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="https://i.pravatar.cc/40?u=${data.employeeName}" style="width: 40px; height: 40px; border-radius: 50%;" alt="">
          <div>
            <div style="font-weight: 600; color: #0f172a;">${data.employeeName}</div>
            <div style="font-size: 13px; color: #64748b;">${data.type} • ${data.totalDays} days</div>
          </div>
        </div>
        <span class="hr-status-badge ${data.status}">${data.status}</span>
      `;
      container.appendChild(item);
    });

    document.getElementById('recentLeavePending').textContent = `${pendingCount} Pending`;

  } catch (error) {
    console.error('Error loading recent leave list:', error);
  }
}

// Filter Functions
function filterLeaveRequests() {
  const searchTerm = document.getElementById('leaveSearchInput').value.toLowerCase();
  const statusFilter = document.getElementById('leaveStatusFilter').value;
  const typeFilter = document.getElementById('leaveTypeFilter').value;
  
  document.querySelectorAll('.leave-request-row').forEach(row => {
    const employee = row.dataset.employee.toLowerCase();
    const department = row.dataset.department.toLowerCase();
    const status = row.dataset.status;
    const type = row.dataset.type;
    
    const matchesSearch = employee.includes(searchTerm) || department.includes(searchTerm);
    const matchesStatus = !statusFilter || status === statusFilter;
    const matchesType = !typeFilter || type === typeFilter;
    
    row.style.display = (matchesSearch && matchesStatus && matchesType) ? '' : 'none';
  });
}

function filterRestDayRequests() {
  const searchTerm = document.getElementById('restdaySearchInput').value.toLowerCase();
  const statusFilter = document.getElementById('restdayStatusFilter').value;
  
  document.querySelectorAll('.restday-request-row').forEach(row => {
    const employee = row.dataset.employee.toLowerCase();
    const department = row.dataset.department.toLowerCase();
    const status = row.dataset.status;
    
    const matchesSearch = employee.includes(searchTerm) || department.includes(searchTerm);
    const matchesStatus = !statusFilter || status === statusFilter;
    
    row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
  });
}

function filterEmployees() {
  const searchTerm = document.getElementById('employeeSearchInput').value.toLowerCase();
  const departmentFilter = document.getElementById('departmentFilter').value;
  
  document.querySelectorAll('.hr-employee-card').forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const department = card.dataset.department;
    
    const matchesSearch = name.includes(searchTerm);
    const matchesDepartment = !departmentFilter || department === departmentFilter;
    
    card.style.display = (matchesSearch && matchesDepartment) ? '' : 'none';
  });
}

// Update handleApproveLeave function
async function handleApproveLeave(id) {
  if (!confirm('Are you sure you want to approve this leave request?')) return;
  
  try {
    const docRef = window.db.collection('leave_requests').doc(id);
    const doc = await docRef.get();
    const data = doc.data();

    // Check if department has approved first
    if (data.departmentApproval !== 'approved') {
      alert('This request must be approved by the department head first.');
      return;
    }

    const updateData = {
      hrApproval: 'approved',
      hrApprovedAt: firebase.firestore.FieldValue.serverTimestamp(),
      hrApprovedBy: window.currentUser?.username || 'HR',
      status: 'approved' // Final approval - set overall status to approved
    };

    await docRef.update(updateData);
    
    alert('Leave request approved successfully!');
    await loadLeaveRequests();
    await loadHRStats();
    await loadRecentLeaveList();
  } catch (error) {
    console.error('Error approving leave:', error);
    alert('Error approving leave request');
  }
}

// Update handleDenyLeave function
async function handleDenyLeave(id) {
  const reason = prompt('Please provide a reason for denial:');
  if (!reason) return;
  
  try {
    await window.db.collection('leave_requests').doc(id).update({
      hrApproval: 'denied',
      status: 'denied', // HR denial sets final status to denied
      hrDeniedAt: firebase.firestore.FieldValue.serverTimestamp(),
      hrDeniedBy: window.currentUser?.username || 'HR',
      hrDenialReason: reason
    });
    
    alert('Leave request denied by HR.');
    await loadLeaveRequests();
    await loadHRStats();
    await loadRecentLeaveList();
  } catch (error) {
    console.error('Error denying leave:', error);
    alert('Error denying leave request');
  }
}

// Update handleApproveRestDay function
async function handleApproveRestDay(id) {
  if (!confirm('Are you sure you want to approve this rest day request?')) return;
  
  try {
    const docRef = window.db.collection('early_rest_requests').doc(id);
    const doc = await docRef.get();
    const data = doc.data();

    // Check if department has approved first
    if (data.departmentApproval !== 'approved') {
      alert('This request must be approved by the department head first.');
      return;
    }

    const updateData = {
      hrApproval: 'approved',
      hrApprovedAt: firebase.firestore.FieldValue.serverTimestamp(),
      hrApprovedBy: window.currentUser?.username || 'HR',
      status: 'approved' // Final approval
    };

    await docRef.update(updateData);
    
    alert('Rest day request approved successfully!');
    await loadRestDayRequests();
    await loadHRStats();
  } catch (error) {
    console.error('Error approving rest day:', error);
    alert('Error approving rest day request');
  }
}

// Update handleDenyRestDay function
async function handleDenyRestDay(id) {
  const reason = prompt('Please provide a reason for denial:');
  if (!reason) return;
  
  try {
    await window.db.collection('early_rest_requests').doc(id).update({
      hrApproval: 'denied',
      status: 'denied',
      hrDeniedAt: firebase.firestore.FieldValue.serverTimestamp(),
      hrDeniedBy: window.currentUser?.username || 'HR',
      hrDenialReason: reason
    });
    
    alert('Rest day request denied by HR.');
    await loadRestDayRequests();
    await loadHRStats();
  } catch (error) {
    console.error('Error denying rest day:', error);
    alert('Error denying rest day request');
  }
}

// Export functions
window.mountHRDashboard = mountHRDashboard;
window.handleApproveLeave = handleApproveLeave;
window.handleDenyLeave = handleDenyLeave;
window.handleApproveRestDay = handleApproveRestDay;
window.handleDenyRestDay = handleDenyRestDay;