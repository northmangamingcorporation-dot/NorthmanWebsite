// Enhanced IT Admin Dashboard - Keeping your original structure pages\admin\it_dashboard.js
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
          <button class="sidebar-btn" data-section="tampermonkey">
            <i class="fas fa-puzzle-piece"></i>
            <span>Tampermonkey</span>
            <span class="extension-badge">EXT</span>
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
            ${["pending","approved","denied","payout"].map(status => `
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
                  Staff Task & Teller Reported Overview 
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
              
                <!-- Total Count Label Above Table -->
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 12px 16px;
                  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                  border-radius: 10px;
                  margin-top: 16px;
                  border: 1px solid #86efac;
                ">
                 <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-calendar-day" style="color: #16a34a; font-size: 18px;"></i>
                    <input 
                      type="date" 
                      id="ticketDateFilter" 
                      onchange="filterTicketsByDate()"
                      style="
                        padding: 6px 12px;
                        border: 2px solid #86efac;
                        border-radius: 8px;
                        font-size: 13px;
                        cursor: pointer;
                        background: white;
                        color: #166534;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        outline: none;
                      "
                      onfocus="this.style.borderColor='#16a34a';"
                      onblur="this.style.borderColor='#86efac';"
                    />
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-list-ol" style="color: #16a34a; font-size: 18px;"></i>
                    <span style="color: #166534; font-size: 15px; font-weight: 700;">
                      Total Tickets: <span id="ticketsTotalCount" style="color: #16a34a; font-size: 20px;">0</span>
                    </span>
                  </div>
                </div>

                <!-- Filters and Search Bar -->
                <div style="
                  display: flex;
                  gap: 12px;
                  margin-top: 5px;
                  margin-bottom: 5px;
                  flex-wrap: wrap;
                  align-items: center;
                ">
                  <!-- Search Input -->
                  <div style="flex: 1; min-width: 250px;">
                    <input 
                      type="text" 
                      id="ticketSearchInput" 
                      placeholder="🔍 Search by ticket code, teller, or submitter..."
                      oninput="filterTickets()"
                      style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 10px;
                        font-size: 14px;
                        transition: all 0.3s ease;
                        outline: none;
                      "
                      onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 3px rgba(16, 185, 129, 0.1)';"
                      onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                    />
                  </div>

                  <!-- Type Filter -->
                  <select 
                    id="ticketTypeFilter" 
                    onchange="filterTickets()"
                    style="
                      padding: 12px 16px;
                      border: 2px solid #e2e8f0;
                      border-radius: 10px;
                      font-size: 14px;
                      cursor: pointer;
                      background: white;
                      color: #334155;
                      font-weight: 500;
                      transition: all 0.3s ease;
                      outline: none;
                    "
                    onfocus="this.style.borderColor='#10b981';"
                    onblur="this.style.borderColor='#e2e8f0';"
                  >
                    <option value="">All Types</option>
                    <option value="Human Error">Human Error</option>
                    <option value="System Error">System Error</option>
                    <option value="Other">Other</option>
                  </select>

                  <!-- Sort By -->
                  <select 
                    id="ticketSortBy" 
                    onchange="sortTicketsBy()"
                    style="
                      padding: 12px 16px;
                      border: 2px solid #e2e8f0;
                      border-radius: 10px;
                      font-size: 14px;
                      cursor: pointer;
                      background: white;
                      color: #334155;
                      font-weight: 500;
                      transition: all 0.3s ease;
                      outline: none;
                    "
                    onfocus="this.style.borderColor='#10b981';"
                    onblur="this.style.borderColor='#e2e8f0';"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="teller-asc">Teller (A-Z)</option>
                    <option value="teller-desc">Teller (Z-A)</option>
                    <option value="code-asc">Code (A-Z)</option>
                    <option value="code-desc">Code (Z-A)</option>
                  </select>

                  <!-- Clear Filters Button -->
                  <button 
                    onclick="clearTicketFilters()"
                    style="
                      padding: 12px 20px;
                      border: 2px solid #e2e8f0;
                      border-radius: 10px;
                      font-size: 14px;
                      cursor: pointer;
                      background: white;
                      color: #64748b;
                      font-weight: 600;
                      transition: all 0.3s ease;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                    "
                    onmouseover="this.style.background='#f8fafc'; this.style.borderColor='#cbd5e1';"
                    onmouseout="this.style.background='white'; this.style.borderColor='#e2e8f0';"
                  >
                    <i class="fas fa-redo"></i>
                    Reset
                  </button>
                </div>

              <div class="table-container" style="
                    overflow-x: auto;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    margin-top: 10px;
                    height: 30vh
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
                          <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Ticket Code</th>
                          <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Teller</th>
                          <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Type</th>
                          <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Submitted By</th>
                          <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</th>
                        </tr>
                      </thead>
                      <tbody id="ticketsTable">
                        <tr class="no-data-row">
                          <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                              <div style="
                                width: 80px;
                                height: 80px;
                                background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              ">
                                <i class="fas fa-clipboard-list" style="font-size: 36px; color: #10b981;"></i>
                              </div>
                              <div>
                                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                                  No tickets yet
                                </p>
                                <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                                  Click "New Ticket" to paste and analyze a ticket
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- Device Change Section -->
                      <div style="margin-top: 32px;">
                        <!-- Section Header with Action Button -->
                        <div style="
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          margin-bottom: 20px;
                          padding: 16px 20px;
                          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                          border-radius: 12px;
                          border: 1px solid #86efac;
                        ">
                          <h4 style="
                            margin: 0;
                            color: #166534;
                            font-size: 20px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                          ">
                            <i class="fas fa-mobile-alt" style="color: #10b981; font-size: 24px;"></i>
                            Device ID Change Management
                          </h4>
                          <button 
                            onclick="showDeviceIDChangeModal()"
                            style="
                              padding: 12px 24px;
                              font-size: 15px;
                              font-weight: 600;
                              border: none;
                              border-radius: 10px;
                              background: linear-gradient(135deg, #10b981, #059669);
                              color: white;
                              cursor: pointer;
                              transition: all 0.3s ease;
                              display: flex;
                              align-items: center;
                              gap: 10px;
                              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                            "
                            onmouseover="
                              this.style.background = 'linear-gradient(135deg, #059669, #047857)';
                              this.style.transform = 'translateY(-2px)';
                              this.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                            "
                            onmouseout="
                              this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                              this.style.transform = 'translateY(0)';
                              this.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            "
                          >
                            <i class="fas fa-plus-circle"></i>
                            New Device Change
                          </button>
                        </div>

                        <!-- Stats Grid -->
                        <div style="
                          display: grid;
                          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                          gap: 16px;
                          margin-bottom: 24px;
                        ">
                          <!-- POS Resets -->
                          <div style="
                            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                            border-radius: 12px;
                            padding: 20px;
                            border: 2px solid #93c5fd;
                            transition: all 0.3s ease;
                          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                            <div style="
                              width: 48px;
                              height: 48px;
                              background: linear-gradient(135deg, #3b82f6, #2563eb);
                              border-radius: 12px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              margin-bottom: 12px;
                            ">
                              <i class="fas fa-cash-register" style="font-size: 24px; color: white;"></i>
                            </div>
                            <div style="font-size: 32px; font-weight: 700; color: #1e40af; margin-bottom: 8px;" id="totalPosResets">0</div>
                            <div style="font-size: 14px; color: #475569; font-weight: 500;">Total POS Resets</div>
                          </div>

                          <!-- Phone Resets -->
                          <div style="
                            background: linear-gradient(135deg, #fce7f3, #fbcfe8);
                            border-radius: 12px;
                            padding: 20px;
                            border: 2px solid #f9a8d4;
                            transition: all 0.3s ease;
                          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(236, 72, 153, 0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                            <div style="
                              width: 48px;
                              height: 48px;
                              background: linear-gradient(135deg, #ec4899, #db2777);
                              border-radius: 12px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              margin-bottom: 12px;
                            ">
                              <i class="fas fa-mobile-alt" style="font-size: 24px; color: white;"></i>
                            </div>
                            <div style="font-size: 32px; font-weight: 700; color: #be185d; margin-bottom: 8px;" id="totalPhoneResets">0</div>
                            <div style="font-size: 14px; color: #475569; font-weight: 500;">Total Phone Resets</div>
                          </div>

                          <!-- All Resets -->
                          <div style="
                            background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                            border-radius: 12px;
                            padding: 20px;
                            border: 2px solid #6ee7b7;
                            transition: all 0.3s ease;
                          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                            <div style="
                              width: 48px;
                              height: 48px;
                              background: linear-gradient(135deg, #10b981, #059669);
                              border-radius: 12px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              margin-bottom: 12px;
                            ">
                              <i class="fas fa-sync-alt" style="font-size: 24px; color: white;"></i>
                            </div>
                            <div style="font-size: 32px; font-weight: 700; color: #166534; margin-bottom: 8px;" id="totalResets">0</div>
                            <div style="font-size: 14px; color: #475569; font-weight: 500;">All Device Resets</div>
                          </div>

                          <!-- Active Operators -->
                          <div style="
                            background: linear-gradient(135deg, #fef3c7, #fde68a);
                            border-radius: 12px;
                            padding: 20px;
                            border: 2px solid #fcd34d;
                            transition: all 0.3s ease;
                          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(245, 158, 11, 0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                            <div style="
                              width: 48px;
                              height: 48px;
                              background: linear-gradient(135deg, #f59e0b, #d97706);
                              border-radius: 12px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              margin-bottom: 12px;
                            ">
                              <i class="fas fa-users" style="font-size: 24px; color: white;"></i>
                            </div>
                            <div style="font-size: 32px; font-weight: 700; color: #92400e; margin-bottom: 8px;" id="totalOperators">0</div>
                            <div style="font-size: 14px; color: #475569; font-weight: 500;">Active Operators</div>
                          </div>
                        </div>

                        <!-- Summary Table Container -->
                        <div id="deviceChangeSummaryContainer" style="
                          background: white;
                          border-radius: 12px;
                          padding: 24px;
                          border: 1px solid #e2e8f0;
                          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                        ">
                          <!-- Table will be loaded here by JavaScript -->
                          <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #10b981;"></i>
                            <p style="margin-top: 16px; color: #64748b;">Loading device change summary...</p>
                          </div>
                        </div>
                      </div>
            </div>

           <!-- Enhanced Top Tellers Card with Dynamic Filters -->
<div class="dashboard-card top-tellers">
  <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-chart-bar" style="font-size: 22px; color: #f59e0b;"></i>
      <h4 style="margin: 0; color: #92400e; font-size: 18px; font-weight: 700;">
        Top Reported Tellers
      </h4>
    </div>

    <div style="display: flex; align-items: center; gap: 16px;">
      <button onclick="window.showTicketInputModal()" style="
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        border: none;
        border-radius: 10px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
      " onmouseover="
        this.style.background = 'linear-gradient(135deg, #059669, #047857)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
      " onmouseout="
        this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(16, 185, 129, 0.3)';
      ">
        <i class="fas fa-paste"></i>
        Report Teller
      </button>
    </div>
  </div>

  <!-- Filter Buttons -->
  <div class="filter-container">
    <button class="filter-btn active" data-filter="today" onclick="updateFilter('today')">
      <i class="fas fa-clock" style="font-size: 12px;"></i>
      Today
    </button>

    <button class="filter-btn" data-filter="week" onclick="updateFilter('week')">
      <i class="fas fa-calendar-week" style="font-size: 12px;"></i>
      Last 7 Days
    </button>

    <button class="filter-btn" data-filter="month" onclick="updateFilter('month')">
      <i class="fas fa-calendar-alt" style="font-size: 12px;"></i>
      Last 30 Days
    </button>

    <button class="filter-btn" data-filter="custom" onclick="showCustomDatePicker()">
      <i class="fas fa-calendar-day" style="font-size: 12px;"></i>
      Custom Range
    </button>
  </div>

  <!-- Rankings List -->
  <div class="teller-ranking-content" id="tellerRankingsList">
    <!-- Rankings will render here dynamically -->
    <div class="loading-state" style="text-align:center; padding:20px; color:#64748b;">
      <i class="fas fa-spinner fa-spin" style="font-size: 20px; color:#10b981;"></i>
      <p style="margin:8px 0 0 0;">Loading rankings...</p>
    </div>
  </div>
</div>

<!-- Staff Leave & Early Rest Day Approval Section -->
<div class="dashboard-card staff-approvals" style="grid-column: 1 / -1;">
  <div class="card-header">
    <div style="display: flex; align-items: center; gap: 12px;">
      <i class="fas fa-user-check" style="font-size: 22px; color: #10b981;"></i>
      <h4 style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 700;">
        Staff Leave & Early Rest Day Requests
      </h4>
    </div>
    <div class="approval-stats" style="display: flex; gap: 16px;">
      <span class="stat-pill pending">
        <i class="fas fa-clock"></i>
        <span id="leaveRequestsCount">0</span> Leave
      </span>
      <span class="stat-pill urgent">
        <i class="fas fa-calendar-day"></i>
        <span id="restRequestsCount">0</span> Rest Day
      </span>
    </div>
  </div>

  <!-- Tabs -->
  <div class="approval-tabs" style="
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0;
  ">
    <button class="approval-tab active" data-tab="leave">
      <i class="fas fa-calendar-alt"></i>
      Leave Requests
    </button>
    <button class="approval-tab" data-tab="rest">
      <i class="fas fa-clock"></i>
      Early Rest Day
    </button>
  </div>

  <!-- Leave Requests Table -->
  <div id="leaveRequestsTab" class="approval-content active">
    <div class="enhanced-table-wrapper">
      <table class="enhanced-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="leaveRequestsTableBody">
          <tr>
            <td colspan="9" class="loading-state">
              <div class="loading-content">
                <span>Loading leave requests...</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Early Rest Day Requests Table -->
  <div id="restRequestsTab" class="approval-content" style="display: none;">
    <div class="enhanced-table-wrapper">
      <table class="enhanced-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Request Type</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="restRequestsTableBody">
          <tr>
            <td colspan="7" class="loading-state">
              <div class="loading-content">
                <div class="loading-spinner"></div>
                <span>Loading rest day requests...</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
            
            <div class="manager-task-content">
              <div class="top-tellers-list" id="tellerRankingsList">
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
                  <option value="Accounting">Accounting</option>
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
<!-- Enhanced Tampermonkey Extensions Section -->
<div id="tampermonkeySection" class="section">
  <div class="section-header enhanced">
    <div class="section-title-group">
      <h4>
        <i class="fas fa-puzzle-piece"></i>
        Tampermonkey Extensions
      </h4>
      <div class="section-stats">
        <span class="stat-pill info">
          <i class="fas fa-code"></i>
          <span id="totalScripts">0</span> Total
        </span>
        <span class="stat-pill success">
          <i class="fas fa-check-circle"></i>
          <span id="activeScripts">0</span> Active
        </span>
        <span class="stat-pill warning">
          <i class="fas fa-pause-circle"></i>
          <span id="disabledScripts">0</span> Disabled
        </span>
      </div>
    </div>
    
    <div class="section-controls enhanced">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input type="text" id="searchScriptsInput" placeholder="Search scripts..." class="search-input enhanced">
      </div>
      
      <div class="filter-group">
        <select id="scriptStatusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
      
      <button id="addScriptBtn" class="btn btn-primary" onclick="showAddScriptModal()">
        <i class="fas fa-plus"></i>
        Add Script
      </button>
    </div>
  </div>
  
  <div class="enhanced-table-wrapper">
    <table class="enhanced-table">
      <thead>
        <tr>
          <th>Script Name</th>
          <th>Script ID</th>
          <th>Version</th>
          <th>Status</th>
          <th>Last Updated</th>
          <th>Users</th>
          <th>Changelog</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tampermonkeyScriptsTable">
        <tr>
          <td colspan="8" class="loading-state">
            <div class="loading-content">
              <div class="loading-spinner"></div>
              <span>Loading scripts...</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
        <!-- Enhanced Analytics Section -->
        <div id="analyticsSection" class="section">
          <div class="section-header enhanced">
            <div class="section-title-group">
              <h4>
                <i class="fas fa-chart-line"></i>
                Performance Analytics
              </h4>
              <span id="analyticsTimestamp" class="last-updated"></span>
            </div>
            
            <div class="section-controls enhanced">
              <button class="btn btn-secondary" onclick="loadAdvancedAnalytics()">
                <i class="fas fa-sync-alt"></i>
                Refresh
              </button>
              <button class="btn btn-primary" onclick="exportAnalyticsReport()">
                <i class="fas fa-download"></i>
                Export Report
              </button>
            </div>
          </div>
          
          <!-- Analytics Content -->
          <div id="cancellationAnalytics"></div>
          <div id="payoutAnalytics"></div>
          <div id="deviceChangeAnalytics"></div>
          <div id="serverErrorAnalytics"></div>
          <div id="ticketVerificationAnalytics"></div>
          <div id="boothActivityAnalytics"></div>
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
    payout: 'money-bill-wave' // ✅ visible icon for payout
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
        lastActive: new Date().toISOString() // You can get real data from your system
      });
    }

    // Cache the result
    setCache(cacheKey, staffTasks);
    return staffTasks;

  } catch (error) {
    console.error("Error fetching staff tasks:", error);
    showNotification("Error loading staff tasks", "error");
    return [];
  }
}

// Enhanced cache management
function getFromCache(key, maxAge) {
  const cached = localStorage.getItem(`cache_${key}`);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > maxAge) {
    localStorage.removeItem(`cache_${key}`);
    return null;
  }
  
  return data;
}

function setCache(key, data) {
  const cacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
}

// Enhanced status color function
function statusColor(status) {
  const colors = {
    approved: "#10b981",
    denied: "#ef4444", 
    cancelled: "#6b7280",
    pending: "#f59e0b",
    ongoing: "#3b82f6",
    completed: "#8b5cf6"
  };
  return colors[status] || "#6b7280";
}

function attachSidebarNavigation() {
  document.querySelectorAll(".sidebar-btn[data-section]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Remove active class from all buttons
      document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Hide all sections with animation
      const sections = document.querySelectorAll(".section");
      sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        setTimeout(() => {
          section.style.display = "none";
        }, 200);
      });
      
      // Show target section with animation
      const targetSection = btn.getAttribute("data-section");
      const section = document.getElementById(`${targetSection}Section`);
      
      if (!section) {
        console.error(`Section not found: ${targetSection}Section`);
        return;
      }
      
setTimeout(() => {
    section.style.display = "block";
    section.offsetHeight; // Force reflow
    section.style.opacity = "1";
    section.style.transform = "translateY(0)";
    
    // Load section-specific data AFTER section is visible
    switch(targetSection) {
      case 'analytics':
        // Remove the extra call - let initializeAnalytics handle it
        // The button click will trigger the listener we set up
        break;
      case 'tampermonkey':
        if (typeof injectTampermonkeyStyles === 'function') {
          injectTampermonkeyStyles();
        }
        if (typeof loadTampermonkeyScripts === 'function') {
          loadTampermonkeyScripts();
        }
        break;
    }
}, 250);
    });
  });
}
  // New: Initialize Dashboard on Load (shows dashboard by default with animation)
  function initializeDashboardOnLoad() {
    try {
      // Ensure dashboard button is active (already in HTML, but confirm)
      const dashboardBtn = document.querySelector('.sidebar-btn[data-section="dashboard"]');
      if (dashboardBtn && !dashboardBtn.classList.contains('active')) {
        dashboardBtn.classList.add('active');
      }
      
      // Hide all non-dashboard sections immediately
      const sections = document.querySelectorAll(".section");
      sections.forEach(section => {
        if (section.id !== 'dashboardSection') {
          section.style.display = "none";
          section.classList.remove('active-section');
        }
      });
      
      // Show and animate dashboard section
      const dashboardSection = document.getElementById('dashboardSection');
      if (dashboardSection) {
        dashboardSection.style.display = "block";
        dashboardSection.classList.add('active-section');
        // Initial animation: Start hidden and fade in
        dashboardSection.style.opacity = "0";
        dashboardSection.style.transform = "translateY(20px)";
        setTimeout(() => {
          dashboardSection.offsetHeight; // Force reflow
          dashboardSection.style.opacity = "1";
          dashboardSection.style.transform = "translateY(0)";
        }, 100);
        
        console.log("Dashboard initialized and shown on load.");
      } else {
        console.warn("Dashboard section (#dashboardSection) not found.");
      }
    } catch (error) {
      console.error("Error initializing dashboard on load:", error);
    }
  }

// Enhanced IT Manager tasks loading
async function loadITManagerTasks(user) {
  console.log(user);
  try {
    const querySnapshot = await db.collection("ITdepartment_tasks")
      .where("staff", "==", user)
      .limit(10)
      .get();

    const taskContainer = document.querySelector(".it-manager-tasks");
    taskContainer.innerHTML = "";

    if (querySnapshot.empty) {
      taskContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-tasks empty-icon"></i>
          <p>No tasks assigned for ${user}</p>
          <button class="btn btn-primary btn-sm" onclick="mountRequestModal()">
            <i class="fas fa-plus"></i> Create First Task
          </button>
        </div>
      `;
      return;
    }

    let totalTasks = 0;
    querySnapshot.forEach(doc => {
      const task = doc.data();
      totalTasks++;

      // Map details object to HTML
      let detailsHTML = '';
      if (task.details && typeof task.details === 'object') {
        detailsHTML = '<ul class="task-details">';
        Object.entries(task.details).forEach(([key, value]) => {
          detailsHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        });
        detailsHTML += '</ul>';
      }

      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item enhanced";
      taskDiv.innerHTML = `
        <div class="task-header">
          <div class="task-info">
            <span class="task-name">${task.type || "Untitled Task"}</span>
            <span class="task-meta">${formatDate(task.dateCreated || task.createdAt)}</span>
          </div>
          <span class="status-badge ${task.status.toLowerCase()}">${task.status}</span>
        </div>
        <div class="task-details-container">
          ${detailsHTML}
        </div>
        <div class="task-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${getTaskProgress(task)}%"></div>
          </div>
          <span class="progress-text">${getTaskProgress(task)}%</span>
        </div>
        <div class="task-actions">
          <button class="btn-icon view-btn" onclick="showTaskDetails(${task})" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-icon" onclick="editTask('${doc.id}')" title="Edit Task">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      `;
      taskContainer.appendChild(taskDiv);
    });

    // Update task summary
    document.getElementById('totalTasks').textContent = totalTasks;

  } catch (error) {
    console.error("Error fetching IT Manager tasks:", error);
    showNotification("Error loading your tasks", "error");
  }
}

function showTaskDetails(task) {
  // Map details object to HTML
  let detailsHTML = '';
  if (task.details && typeof task.details === 'object') {
    detailsHTML = '<ul class="task-details">';
    Object.entries(task.details).forEach(([key, value]) => {
      detailsHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    });
    detailsHTML += '</ul>';
  }

  const modalContent = `
    <div class="task-details-modal">
      <div class="detail-group">
        <label>Task Type:</label>
        <span>${task.type || 'Untitled Task'}</span>
      </div>
      <div class="detail-group">
        <label>Assigned To:</label>
        <span>${task.staff || 'Unassigned'}</span>
      </div>
      <div class="detail-group">
        <label>Priority:</label>
        <span class="priority-badge ${task.priority || 'normal'}">${task.priority || 'Normal'}</span>
      </div>
      <div class="detail-group">
        <label>Status:</label>
        <span class="status-badge ${task.status?.toLowerCase() || 'pending'}">${task.status || 'Pending'}</span>
      </div>
      <div class="detail-group">
        <label>Created At:</label>
        <span>${formatDate(task.createdAt || task.dateCreated)}</span>
      </div>
      <div class="detail-group">
        <label>Details:</label>
        <div class="task-details-container">
          ${detailsHTML || '<p>No details provided</p>'}
        </div>
      </div>
    </div>
  `;

  const modal = createModal("Task Details", modalContent);
  showModal(modal);
}


// Helper functions
function formatDate(timestamp) {
  if (!timestamp) return "No date";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString();
}

function getTaskProgress(task) {
  const statusProgress = {
    'pending': 0,
    'ongoing': 50,
    'completed': 100,
    'cancelled': 0
  };
  return statusProgress[task.status.toLowerCase()] || 0;
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Enhanced attach IT Admin Dashboard function
async function attachITAdminDashboard(admin) {
  injectEnhancedITAdminStyles();
  
  // Initialize components
  initializeDashboardOnLoad(); // ← ADD THIS LINE
  loadITManagerTasks(admin.username);
  initializeRealTimeUpdates();
  initializeSearchAndFilters();
  initializeQuickActions();
  listenAndShowTellerRankings()
  loadTickets()
  loadLeaveRequests();
  loadRestRequests();
  initializeApprovalTabs();
  showAnnouncementModal(admin);
  loadDeviceChangeSummary()
  const ordersCol = window.db.collection("it_service_orders");
  const tasksCol = window.db.collection("ITdepartment_tasks");
  const clientsCol = window.db.collection("clients");
  let unsubscribeOrders = null;

// Enhanced load orders with real-time update (updated with dynamic filters)
function loadOrders() {
  if (unsubscribeOrders) unsubscribeOrders();
  showLoadingState("adminRequestsTable", 9);

  unsubscribeOrders = ordersCol
    .orderBy("dateSubmitted", "desc")
    .onSnapshot(async snapshot => {
      const tbody = document.getElementById("adminRequestsTable");
      tbody.innerHTML = "";
      const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0, urgent: 0 };

      if (snapshot.empty) {
        tbody.innerHTML = createEmptyState(9, "No IT requests yet", "fas fa-clipboard-list");
        updateAdminStats(stats);
        
        // NEW: Populate filters even on empty (dropdowns have "All" only)
        populateStatusFilter();
        populateTypeFilter();
        initializeSearchAndFilters();
        
        return;
      }

      // Collect all order IDs
      const orderIds = snapshot.docs.map(doc => doc.id);

      // Fetch tasks related to these orders
      const tasksSnapshot = await tasksCol
        .where("relatedId", "in", orderIds)
        .get();

      const tasksMap = {};
      tasksSnapshot.forEach(taskDoc => {
        const task = taskDoc.data();
        tasksMap[task.relatedId] = task; // Assume one task per order
      });

      snapshot.forEach(doc => {
        const order = doc.data();

        // Override only status and assignedTo if related task exists
        const task = tasksMap[doc.id];
        if (task) {
          order.status = task.status || order.status;
          order.assignedTo = task.staff || order.assignedTo;
        }

        const createdAt = order.dateSubmitted?.toDate
          ? order.dateSubmitted.toDate().toLocaleString()
          : "-";
        const statusKey = (order.status || "pending").toLowerCase();
        stats[statusKey] = (stats[statusKey] || 0) + 1; 
        // Count urgent requests
        if (order.priority?.toUpperCase() === "HIGH") {
          stats.urgent += 1;
        }

        const row = createEnhancedRequestRow(doc.id, order, createdAt, statusKey, admin);
        tbody.appendChild(row);
      });

      updateAdminStats(stats);
      updateNotificationBadge(stats.pending);
      
      // NEW: Populate dynamic filters AFTER data is added (runs on every real-time update)
      populateStatusFilter();
      populateTypeFilter();
      
      // NEW: Initialize search and filters (attaches/re-attaches listeners safely)
      initializeSearchAndFilters();
      
    }, err => {
      console.error("IT Admin snapshot error:", err);
      showNotification("Error loading requests", "error");
      
      // Optional: Init filters on error (no population, as no data)
      initializeSearchAndFilters();
    });
}

// Enhanced load clients (updated with dynamic filters)
function loadClients() {
  showLoadingState("adminClientsTable", 8);
  
  clientsCol.get().then(snapshot => {
    const tbody = document.getElementById("adminClientsTable");
    tbody.innerHTML = "";

    if (snapshot.empty) {
      tbody.innerHTML = createEmptyState(8, "No clients found", "fas fa-users");
      
      // NEW: Populate filters even on empty (dropdown has "All" only)
      populateDepartmentFilter();
      initializeSearchAndFilters();
      
      return;
    }

    let totalClients = 0;
    let activeClients = 0;

    snapshot.forEach(doc => {
      const client = doc.data();
      totalClients++;
      if (client.status !== 'inactive') activeClients++;
      
      const row = createEnhancedClientRow(client);
      tbody.appendChild(row);
    });

    // Update client stats
    document.getElementById('totalClients').textContent = totalClients;
    document.getElementById('activeClients').textContent = activeClients;

    // NEW: Populate dynamic department filter AFTER data is added
    populateDepartmentFilter();
    
    // NEW: Initialize search and filters (attaches listeners to #searchClientsInput and #departmentFilter)
    initializeSearchAndFilters();

  }).catch(err => {
    console.error("Error loading clients:", err);
    showNotification("Error loading clients", "error");
    
    // Optional: Init filters on error (no population, as no data)
    initializeSearchAndFilters();
  });
}

  // Enhanced update admin stats with animations
  function updateAdminStats(stats) {
    Object.entries(stats).forEach(([status, count]) => {
      const element = document.getElementById(`admin-${status}`);
      if (element) {
        const numberElement = element.querySelector('.number');
        animateCounter(numberElement, parseInt(numberElement.textContent) || 0, count);
        
        // Update progress bar
        const progressBar = document.getElementById(`progress-${status}`);
        if (progressBar) {
          const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
          const percentage = total > 0 ? (count / total) * 100 : 0;
          progressBar.style.width = `${percentage}%`;
        }

        const pillCountElement = document.getElementById(`${status}Count`);
        if (pillCountElement) {
          animateCounter(pillCountElement, parseInt(pillCountElement.textContent) || 0, count);
        }
      }
    });
  }


// --- Debounce Utility (unchanged) ---
function debounce(func, wait) {
  let timeout;
  return function executedFunction(searchTerm) {
    const later = () => {
      clearTimeout(timeout);
      func(searchTerm);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- Dynamically Populate Status Filter (Requests: Column 6) ---
function populateStatusFilter() {
  const table = document.getElementById("adminRequestsTable");
  const filterSelect = document.getElementById("statusFilter");

  if (!table || !filterSelect) {
    console.error("Table '#adminRequestsTable' or filter '#statusFilter' not found!");
    return;
  }

  const rows = table.getElementsByTagName("tr");
  const uniqueStatuses = new Set();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    
    if (cells.length < 7 || row.classList.contains("loading-state")) continue;

    const statusCell = cells[6];
    const statusText = (statusCell.textContent || statusCell.innerText || '').trim();
    
    if (statusText && statusText !== 'N/A' && statusText !== '') {
      uniqueStatuses.add(statusText.toLowerCase() + '|' + statusText);
    }
  }

  filterSelect.innerHTML = '<option value="">All Status</option>';

  const sortedStatuses = Array.from(uniqueStatuses)
    .map(item => item.split('|')[1])
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  sortedStatuses.forEach(status => {
    const option = document.createElement("option");
    option.value = status.toLowerCase();
    option.textContent = status;
    filterSelect.appendChild(option);
  });

  console.log(`Status filter populated with ${sortedStatuses.length} unique statuses:`, sortedStatuses);
}

// --- Dynamically Populate Type Filter (Requests: Column 2) ---
function populateTypeFilter() {
  const table = document.getElementById("adminRequestsTable");
  const filterSelect = document.getElementById("typeFilter");

  if (!table || !filterSelect) {
    console.error("Table '#adminRequestsTable' or filter '#typeFilter' not found!");
    return;
  }

  const rows = table.getElementsByTagName("tr");
  const uniqueTypes = new Set();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    
    if (cells.length < 3 || row.classList.contains("loading-state")) continue;

    const typeCell = cells[2];
    const typeText = (typeCell.textContent || typeCell.innerText || '').trim();
    
    if (typeText && typeText !== 'N/A' && typeText !== '') {
      uniqueTypes.add(typeText.toLowerCase() + '|' + typeText);
    }
  }

  filterSelect.innerHTML = '<option value="">All Types</option>';

  const sortedTypes = Array.from(uniqueTypes)
    .map(item => item.split('|')[1])
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  sortedTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type.toLowerCase();
    option.textContent = type;
    filterSelect.appendChild(option);
  });

  console.log(`Type filter populated with ${sortedTypes.length} unique types:`, sortedTypes);
}

// --- Dynamically Populate Department Filter (Clients: Column 2) ---
function populateDepartmentFilter() {
  const table = document.getElementById("adminClientsTable");
  const filterSelect = document.getElementById("departmentFilter");

  if (!table || !filterSelect) {
    console.error("Table '#adminClientsTable' or filter '#departmentFilter' not found!");
    return;
  }

  const rows = table.getElementsByTagName("tr");
  const uniqueDepts = new Set();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    
    if (cells.length < 3 || row.classList.contains("loading-state")) continue;

    const deptCell = cells[2];
    const deptText = (deptCell.textContent || deptCell.innerText || '').trim();
    
    if (deptText && deptText !== 'N/A' && deptText !== '') {
      uniqueDepts.add(deptText.toLowerCase() + '|' + deptText);
    }
  }

  filterSelect.innerHTML = '<option value="">All Departments</option>';

  const sortedDepts = Array.from(uniqueDepts)
    .map(item => item.split('|')[1])
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  sortedDepts.forEach(dept => {
    const option = document.createElement("option");
    option.value = dept.toLowerCase();
    option.textContent = dept;
    filterSelect.appendChild(option);
  });

  console.log(`Department filter populated with ${sortedDepts.length} unique departments:`, sortedDepts);
}


  // Initialize everything
  loadOrders();
  loadClients();
  loadTickets()
  
  // Enhanced logout with confirmation
  const backBtn = document.getElementById("adminLogoutBtn");
  if (backBtn) {
    backBtn.addEventListener("click", async () => {
          // In dashboard.js
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
            // Use centralized logout
      const success = await window.logout({
        customMessage: "Are you sure you want to logout from the dashboard?"
      });

      if (success) {
        // Animate logout button
        backBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        backBtn.disabled = true;
      }
    });
  }

  // Real-time updates
  setInterval(() => {
    document.getElementById('lastUpdated').textContent = 
      `Last updated: ${new Date().toLocaleTimeString()}`;
  }, 30000);
}

// Helper functions for enhanced UI
function showLoadingState(tableId, colspan) {
  const tbody = document.getElementById(tableId);
  tbody.innerHTML = `
    <tr>
      <td colspan="${colspan}" class="loading-state">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <span>Loading data...</span>
        </div>
      </td>
    </tr>
  `;
}

function createEmptyState(colspan, message, icon) {
  return `
    <tr>
      <td colspan="${colspan}" class="empty-state">
        <div class="empty-content">
          <i class="${icon} empty-icon"></i>
          <span>${message}</span>
        </div>
      </td>
    </tr>
  `;
}

function createEnhancedRequestRow(docId, order, createdAt, statusKey, admin) {
  const row = document.createElement("tr");
  row.className = "request-row";
  row.innerHTML = `
    <td>
      <input type="checkbox" class="checkbox request-checkbox" data-id="${docId}">
    </td>
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${order.username}" class="user-avatar" alt="">
        <span class="user-name">${order.username || "-"}</span>
      </div>
    </td>
    <td>
      <span class="type-badge ${order.type || 'general'}">${order.type || "-"}</span>
    </td>
    <td>
      <span class="priority-badge ${order.priority || 'normal'}">${order.priority || "Normal"}</span>
    </td>
    <td class="description-cell">
      <div class="description-text" title="${order.description || '-'}">${truncateText(order.description || '-', 50)}</div>
    </td>
    <td>
      <div class="date-info">
        <span class="date-text">${createdAt}</span>
      </div>
    </td>
    <td>
      <span class="status-badge ${statusKey}">${order.status || "Pending"}</span>
    </td>
    <td>
      <span class="assigned-to">${order.assignedTo || "Unassigned"}</span>
    </td>
    <td>
      <div class="action-buttons">
        ${statusKey === "pending" 
          ? `<button class="btn-icon assign-btn" data-id="${docId}" title="Assign Task">
               <i class="fas fa-user-plus"></i>
             </button>`
          : ""
        }
        <button class="btn-icon view-btn" data-id="${docId}" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners
  row.querySelector(".assign-btn")?.addEventListener("click", () => {
    mountAdminITServiceModal(admin, { ...order, id: docId, collection: "it_service_orders" });
  });

  row.querySelector(".view-btn")?.addEventListener("click", () => {
    showRequestDetails(order, docId);
  });

  row.querySelector(".edit-btn")?.addEventListener("click", () => {
    editRequest(order, docId);
  });

  return row;
}

function createEnhancedClientRow(client) {
  const row = document.createElement("tr");
  row.className = "client-row";
  row.innerHTML = `
    <td>
      <div class="user-info">
        <img src="https://i.pravatar.cc/32?u=${client.username}" class="user-avatar" alt="">
        <div class="user-details">
          <span class="user-name">${client.firstName || ""} ${client.lastName || ""}</span>
          <span class="user-email">${client.email || ""}</span>
        </div>
      </div>
    </td>
    <td>
      <span class="username">${client.username || ""}</span>
    </td>
    <td>
      <span class="department-badge ${client.department || 'general'}">${client.department || ""}</span>
    </td>
    <td>
      <span class="position-text">${client.position || ""}</span>
    </td>
    <td>
      <span class="email-text">${client.email || ""}</span>
    </td>
    <td>
      <span class="status-badge ${client.status === 'inactive' ? 'inactive' : 'active'}">
        ${client.status === 'inactive' ? 'Inactive' : 'Active'}
      </span>
    </td>
    <td>
      <span class="last-active">${getLastActiveTime(client.lastLogin)}</span>
    </td>
    <td>
      <div class="action-buttons">
        <button class="btn-icon view-profile-btn" data-user="${client.username}" title="View Profile">
          <i class="fas fa-user"></i>
        </button>
        <button class="btn-icon edit-client-btn" data-user="${client.username}" title="Edit Client">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon ${client.status === 'inactive' ? 'activate-btn' : 'deactivate-btn'}" 
                data-user="${client.username}" 
                title="${client.status === 'inactive' ? 'Activate' : 'Deactivate'}">
          <i class="fas fa-${client.status === 'inactive' ? 'user-check' : 'user-times'}"></i>
        </button>
      </div>
    </td>
  `;

  // Add event listeners for client actions
  row.querySelector(".view-profile-btn")?.addEventListener("click", () => {
    showClientProfile(client);
  });

  row.querySelector(".edit-client-btn")?.addEventListener("click", () => {
    editClient(client);
  });

  const toggleBtn = row.querySelector(".activate-btn, .deactivate-btn");
  toggleBtn?.addEventListener("click", () => {
    toggleClientStatus(client);
  });

  return row;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

function getLastActiveTime(lastLogin) {
  if (!lastLogin) return "Never";
  const date = lastLogin.toDate ? lastLogin.toDate() : new Date(lastLogin);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return date.toLocaleDateString();
}

function animateCounter(element, start, end) {
  const duration = 1000;
  const increment = (end - start) / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

function updateNotificationBadge(count) {
  const badge = document.getElementById('pending-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function initializeRealTimeUpdates() {
  // Refresh button
  document.getElementById('refreshBtn')?.addEventListener('click', () => {
    location.reload();
  });

  // Notification button
  document.getElementById('notificationBtn')?.addEventListener('click', () => {
    showNotificationPanel();
  });
}

function initializeQuickActions() {
  // Bulk assign
  document.getElementById('bulkAssignBtn')?.addEventListener('click', () => {
    const selectedRequests = getSelectedRequests();
    if (selectedRequests.length === 0) {
      showNotification("Please select requests to assign", "warning");
      return;
    }
    showBulkAssignModal(selectedRequests);
  });

  // Generate report
  document.getElementById('generateReportBtn')?.addEventListener('click', () => {
    generatePerformanceReport();
  });

  // System health
  document.getElementById('systemHealthBtn')?.addEventListener('click', () => {
    showSystemHealthModal();
  });

  // Backup
  document.getElementById('backupBtn')?.addEventListener('click', () => {
    initiateDataBackup();
  });
}

// --- Debounce Utility (unchanged) ---
function debounce(func, wait) {
  let timeout;
  return function executedFunction(searchTerm) { // Accept searchTerm as param
    const later = () => {
      clearTimeout(timeout);
      func(searchTerm); // Pass the captured value
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initializeSearchAndFilters() {
  // Enhanced search for requests
  const requestSearch = document.getElementById("searchRequestsInput");
  if (requestSearch) {
    const debouncedRequestsFilter = debounce(function(searchTerm) {
      console.log("Search input event fired:", searchTerm); // Debug: Now shows correct value
      filterTable("adminRequestsTable", searchTerm, [1, 2, 4]); // Search in employee, type, description columns
    }, 300);

    requestSearch.addEventListener("input", function() {
      debouncedRequestsFilter(this.value); // Capture and pass value immediately
    });
  }

  // Enhanced search for clients
  const clientSearch = document.getElementById("searchClientsInput");
  if (clientSearch) {
    const debouncedClientsFilter = debounce(function(searchTerm) {
      filterTable("adminClientsTable", searchTerm, [0, 1, 2, 4]); // Search in name, username, department, email
    }, 300);

    clientSearch.addEventListener("input", function() {
      debouncedClientsFilter(this.value); // Capture and pass value immediately
    });
  }

  // Status filter (unchanged)
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", function() {
      filterTableByColumn("adminRequestsTable", 6, this.value); // Status column
    });
  }

  // Type filter (unchanged)
  const typeFilter = document.getElementById("typeFilter");
  if (typeFilter) {
    typeFilter.addEventListener("change", function() {
      filterTableByColumn("adminRequestsTable", 2, this.value); // Type column
    });
  }

  // Department filter (unchanged)
  const deptFilter = document.getElementById("departmentFilter");
  if (deptFilter) {
    deptFilter.addEventListener("change", function() {
      filterTableByColumn("adminClientsTable", 2, this.value); // Department column
    });
  }

  console.log("Search and filters initialized.");
}

function filterTable(tableId, searchTerm, columnIndexes) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = table.getElementsByTagName("tr");
  const lowerSearch = searchTerm ? searchTerm.toLowerCase() : "";

  for (let i = 1; i < rows.length; i++) { // Skip header row
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    
    if (cells.length === 0) continue; // Skip empty rows (e.g., loading states)

    let shouldShow = !lowerSearch; // Show all rows if no search term

    if (lowerSearch) { // Only search if term exists
      shouldShow = false; // Reset to false, then check for matches
      columnIndexes.forEach(colIndex => {
        if (colIndex < cells.length) { // Safety check
          const text = cells[colIndex].textContent || "";
          if (text.toLowerCase().includes(lowerSearch)) {
            shouldShow = true;
            return; // Early exit on match
          }
        }
      });
    }

    row.style.display = shouldShow ? "" : "none";
  }
}

function filterTableByColumn(tableId, columnIndex, filterValue) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = table.getElementsByTagName("tr");
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    
    if (cells.length === 0 || cells.length <= columnIndex) continue; // Skip empty or invalid rows
    
    const cell = cells[columnIndex];
    const cellText = cell.textContent || "";
    
    if (!filterValue || cellText.toLowerCase().includes(filterValue.toLowerCase())) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  }
}

function getSelectedRequests() {
  const checkboxes = document.querySelectorAll('.request-checkbox:checked');
  return Array.from(checkboxes).map(cb => cb.dataset.id);
}

// Modal and action functions
function showRequestDetails(order, docId) {
  const modal = createModal("Request Details", `
    <div class="request-details">
      <div class="detail-group">
        <label>Employee:</label>
        <span>${order.username || 'N/A'}</span>
      </div>
      <div class="detail-group">
        <label>Type:</label>
        <span>${order.type || 'N/A'}</span>
      </div>
      <div class="detail-group">
        <label>Priority:</label>
        <span class="priority-badge ${order.priority || 'normal'}">${order.priority || 'Normal'}</span>
      </div>
      <div class="detail-group">
        <label>Description:</label>
        <p>${order.description || 'No description provided'}</p>
      </div>
      <div class="detail-group">
        <label>Status:</label>
        <span class="status-badge ${order.status?.toLowerCase() || 'pending'}">${order.status || 'Pending'}</span>
      </div>
    </div>
  `);
  showModal(modal);
}

function showClientProfile(client) {
  const modal = createModal("Client Profile", `
    <div class="client-profile">
      <div class="profile-header">
        <img src="https://i.pravatar.cc/64?u=${client.username}" class="profile-avatar" alt="">
        <div class="profile-info">
          <h3>${client.firstName} ${client.lastName}</h3>
          <p>${client.position} - ${client.department}</p>
        </div>
      </div>
      <div class="profile-details">
        <div class="detail-group">
          <label>Username:</label>
          <span>${client.username}</span>
        </div>
        <div class="detail-group">
          <label>Email:</label>
          <span>${client.email}</span>
        </div>
        <div class="detail-group">
          <label>Department:</label>
          <span>${client.department}</span>
        </div>
        <div class="detail-group">
          <label>Status:</label>
          <span class="status-badge ${client.status === 'inactive' ? 'inactive' : 'active'}">
            ${client.status === 'inactive' ? 'Inactive' : 'Active'}
          </span>
        </div>
      </div>
    </div>
  `);
  showModal(modal);
}

function createModal(title, content) {
  return `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    </div>
  `;
}

function showModal(modalHTML) {
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  
  // Animate in
  setTimeout(() => {
    modalContainer.querySelector('.modal-overlay').classList.add('active');
  }, 10);
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.parentElement.remove();
    }, 200);
  }
}

// Mount function remains the same
async function mountITAdminDashboard(admin) {
  const staffTasks = await getStaffTasks();
  mount(renderITAdminDashboard(admin, staffTasks));
  attachITAdminDashboard(admin);
  attachSidebarNavigation();
}

// Enhanced styles injection
function injectEnhancedITAdminStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* Enhanced Variables */
    :root {
      --primary: #3b82f6;
      --primary-light: #60a5fa;
      --primary-dark: #1d4ed8;
      --secondary: #64748b;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --info: #06b6d4;
      --background: #f8fafc;
      --surface: #ffffff;
      --surface-2: #f1f5f9;
      --text-primary: #0f172a;
      --text-secondary: #64748b;
      --border: #e2e8f0;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --radius: 12px;
      --radius-lg: 16px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

/* Analytics Section Styles */
.analytics-section {
  margin-bottom: 32px;
  background: var(--surface);
  border-radius: var(--radius);
  padding: 24px;
  border: 1px solid var(--border);
}

.analytics-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border);
}

.section-badge {
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.analytics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: var(--surface-2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--border);
  transition: var(--transition);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-content h4 {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 4px;
}

.metric-value.success { color: var(--success); }
.metric-value.error { color: var(--error); }
.metric-value.warning { color: var(--warning); }
.metric-value.info { color: var(--info); }
.metric-value.purple { color: #8b5cf6; }

.metric-subtext {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.charts-grid.full-width {
  grid-template-columns: 1fr;
}

.chart-container {
  background: var(--surface);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border);
}

.chart-container h5 {
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.chart-container canvas {
  height: 300px !important;
}

/* Loading State */
.analytics-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.analytics-loading .loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Error State */
.analytics-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
}

.analytics-error .error-icon {
  width: 80px;
  height: 80px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--error);
}

/* Responsive */
@media (max-width: 768px) {
  .analytics-summary {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
}

/* Staff Approval Section */
.staff-approvals {
  background: linear-gradient(145deg, #ffffff, #f0fdf4);
  border-left: 4px solid #10b981;
}

.approval-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0;
}

.approval-tab {
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.approval-tab.active {
  border-bottom-color: #10b981;
  color: #10b981;
}

.approval-tab:hover {
  color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.approval-content {
  display: none;
}

.approval-content.active {
  display: block;
}

.approve-leave-btn,
.approve-rest-btn {
  background: #10b981;
  color: white;
}

.approve-leave-btn:hover,
.approve-rest-btn:hover {
  background: #059669;
}

.deny-leave-btn,
.deny-rest-btn {
  background: #ef4444;
  color: white;
}

.deny-leave-btn:hover,
.deny-rest-btn:hover {
  background: #dc2626;
}

    /* Enhanced Container */
    .container.app {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
      gap: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 24px;
    }

    .section.active-section {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }

    /* Enhanced Sidebar */
    .sidebar {
      background: linear-gradient(145deg, #1e293b, #0f172a);
      color: #f8fafc;
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 24px;
      height: fit-content;
      backdrop-filter: blur(10px);
    }

    .sidebar-header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-title {
      font-weight: 800;
      font-size: 1.25rem;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .admin-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: rgba(59, 130, 246, 0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      color: #93c5fd;
      font-weight: 600;
    }

    .sidebar-nav {
      flex: 1;
      margin-bottom: 24px;
    }

    .sidebar-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      background: transparent;
      color: #cbd5e1;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      font-weight: 500;
      font-size: 0.95rem;
      margin-bottom: 8px;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .sidebar-btn::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), transparent);
      transition: width 0.3s ease;
      z-index: 1;
    }

    .sidebar-btn:hover::before,
    .sidebar-btn.active::before {
      width: 100%;
    }

    .sidebar-btn:hover,
    .sidebar-btn.active {
      color: #ffffff;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .sidebar-btn > * {
      position: relative;
      z-index: 2;
    }

    .nav-indicator {
      width: 4px;
      height: 4px;
      background: var(--primary);
      border-radius: 50%;
      margin-left: auto;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .sidebar-btn.active .nav-indicator {
      opacity: 1;
    }

    .notification-badge {
      background: var(--error);
      color: white;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: auto;
      min-width: 18px;
      text-align: center;
      display: none;
    }

    .sidebar-btn.logout {
      background: linear-gradient(135deg, var(--error), #dc2626);
      color: white;
      margin-top: auto;
    }

    .sidebar-btn.logout:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
    }

    /* Enhanced Main Content */
    .main {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 32px;
      overflow: hidden;
      box-shadow: var(--shadow);
      backdrop-filter: blur(10px);
    }

    /* Enhanced Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--border);
    }

    .header-content h2 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      background: linear-gradient(135deg, var(--text-primary), var(--primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .last-updated {
      font-size: 0.8rem;
      color: var(--info);
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: var(--surface-2);
      border-radius: 10px;
      cursor: pointer;
      transition: var(--transition);
      position: relative;
    }

    .header-btn:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-2px);
    }

    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: var(--error);
      border-radius: 50%;
    }

    .header-avatar {
      position: relative;
    }

    .header-avatar img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 3px solid var(--primary);
    }

    .online-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: var(--success);
      border: 2px solid white;
      border-radius: 50%;
    }

    /* Enhanced Stats Container */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card.enhanced {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      border-left: 4px solid var(--primary);
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .stat-card.enhanced::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.03));
      border-radius: 0 0 0 100px;
    }

    .stat-card.enhanced:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .stat-card.pending { border-color: var(--warning); }
    .stat-card.approved { border-color: var(--success); }
    .stat-card.denied { border-color: var(--error); }
    .stat-card.cancelled { border-color: var(--secondary); }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      margin-bottom: 16px;
    }

    .stat-card.pending .stat-icon { background: var(--warning); }
    .stat-card.approved .stat-icon { background: var(--success); }
    .stat-card.denied .stat-icon { background: var(--error); }
    .stat-card.cancelled .stat-icon { background: var(--secondary); }

    .stat-content {
      position: relative;
      z-index: 2;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      text-transform: capitalize;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .stat-value {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-value .number {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .trend {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .trend.up {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .trend.down {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .stat-progress {
      margin-top: 16px;
      height: 4px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: var(--primary);
      border-radius: 2px;
      transition: width 1s ease;
      width: 0%;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .dashboard-card {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .card-header h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Enhanced Table */
    .enhanced-table-container {
      overflow-x: auto;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .enhanced-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--surface);
      font-size: 0.9rem;
    }

    .enhanced-table th {
      background: var(--surface-2);
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 2px solid var(--border);
      white-space: nowrap;
    }

    .th-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .sort-icon {
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .sort-icon:hover {
      opacity: 1;
    }

    .enhanced-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    .enhanced-table tr:hover {
      background: rgba(59, 130, 246, 0.02);
    }

    /* Staff Info Styling */
    .staff-info, .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .staff-avatar, .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--border);
    }

    .staff-name, .user-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-email {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    /* Badges and Status */
    .position-badge, .type-badge, .department-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .position-badge {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }

    .type-badge.hardware {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .type-badge.software {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary);
    }

    .type-badge.network {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .type-badge.access {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .priority-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .priority-badge.low {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .priority-badge.normal {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary);
    }

    .priority-badge.high {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .priority-badge.urgent {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.pending {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .status-badge.approved {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .status-badge.denied {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .status-badge.cancelled {
      background: rgba(100, 116, 139, 0.1);
      color: var(--secondary);
    }

    .status-badge.ongoing {
      background: rgba(6, 182, 212, 0.1);
      color: var(--info);
    }

    .status-badge.completed {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .status-badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .status-badge.inactive {
      background: rgba(100, 116, 139, 0.1);
      color: var(--secondary);
    }

    /* Performance Indicator */
    .performance-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .performance-bar {
      width: 60px;
      height: 8px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .performance-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--error), var(--warning), var(--success));
      border-radius: 4px;
      transition: width 1s ease;
    }

    .performance-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    /* Task Count */
    .task-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
      color: white;
    }

    .task-count.pending { background: var(--warning); }
    .task-count.ongoing { background: var(--info); }
    .task-count.completed { background: var(--success); }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }

    .btn-icon:hover {
      transform: translateY(-2px);
    }

    .assign-btn, .view-details {
      background: var(--primary);
      color: white;
    }

    .assign-btn:hover, .view-details:hover {
      background: var(--primary-dark);
    }

    .view-btn, .view-profile-btn {
      background: var(--info);
      color: white;
    }

    .view-btn:hover, .view-profile-btn:hover {
      background: #0891b2;
    }

    .edit-btn, .edit-client-btn {
      background: var(--warning);
      color: white;
    }

    .edit-btn:hover, .edit-client-btn:hover {
      background: #d97706;
    }

    .assign-task {
      background: var(--success);
      color: white;
    }

    .assign-task:hover {
      background: #059669;
    }

    .activate-btn {
      background: var(--success);
      color: white;
    }

    .activate-btn:hover {
      background: #059669;
    }

    .deactivate-btn {
      background: var(--error);
      color: white;
    }

    .deactivate-btn:hover {
      background: #dc2626;
    }

    /* Manager Tasks Card */
    .manager-tasks {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
    }

    .manager-tasks .card-header {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .manager-tasks .card-header h4 {
      color: white;
    }

    .task-summary {
      display: flex;
      gap: 16px;
    }

    .summary-item {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .manager-task-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .it-manager-tasks {
      max-height: 300px;
      overflow-y: auto;
      padding-right: 8px;
    }

    .task-item.enhanced {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .task-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .task-name {
      font-weight: 600;
      color: white;
    }

    .task-meta {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .task-progress {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .task-progress .progress-bar {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      overflow: hidden;
    }

    .task-progress .progress-fill {
      height: 100%;
      background: white;
      border-radius: 3px;
      transition: width 1s ease;
    }

    .progress-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: white;
    }

    .task-actions {
      display: flex;
      gap: 8px;
    }

    .task-actions .btn-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .task-actions .btn-icon:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Quick Actions */
    .quick-actions {
      grid-column: 1 / -1;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .quick-action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      border: 2px dashed var(--border);
      border-radius: 10px;
      background: transparent;
      cursor: pointer;
      transition: var(--transition);
      color: var(--text-secondary);
    }

    .quick-action-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: rgba(59, 130, 246, 0.05);
    }

    .quick-action-btn i {
      font-size: 1.5rem;
    }

    /* Enhanced Section Headers */
    .section-header.enhanced {
      background: var(--surface-2);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 24px;
    }

    .section-title-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .section-title-group h4 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .section-stats {
      display: flex;
      gap: 12px;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .stat-pill.pending {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .stat-pill.urgent {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .stat-pill.info {
      background: rgba(6, 182, 212, 0.1);
      color: var(--info);
    }

    .stat-pill.success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    /* Enhanced Controls */
    .section-controls.enhanced {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-container {
      position: relative;
      min-width: 300px;
    }

    .search-input.enhanced {
      width: 100%;
      padding: 12px 16px 12px 40px;
      border: 2px solid var(--border);
      border-radius: 10px;
      font-size: 0.9rem;
      transition: var(--transition);
      background: var(--surface);
    }

    .search-input.enhanced:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      pointer-events: none;
    }

    .search-clear {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }

    .search-input.enhanced:not(:placeholder-shown) + .search-clear {
      display: flex;
    }

    .filter-group {
      display: flex;
      gap: 12px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--text-primary);
      cursor: pointer;
      transition: var(--transition);
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--primary);
    }

    /* Enhanced Table Wrapper */
    .enhanced-table-wrapper {
      background: var(--surface);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }

    /* Table Footer */
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--surface-2);
      border-top: 1px solid var(--border);
    }

    .bulk-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--secondary);
      color: white;
    }

    .btn-secondary:hover {
      background: #475569;
    }

    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Checkboxes */
    .checkbox {
      width: 16px;
      height: 16px;
      border: 2px solid var(--border);
      border-radius: 4px;
      cursor: pointer;
      transition: var(--transition);
    }

    .checkbox:checked {
      background: var(--primary);
      border-color: var(--primary);
    }

    /* Loading States */
    .loading-state {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Empty States */
    .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--text-secondary);
      opacity: 0.5;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .modal-overlay.active {
      opacity: 1;
    }

    .modal-content {
      background: var(--surface);
      border-radius: var(--radius);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      transform: translateY(20px);
      transition: transform 0.2s ease;
    }

    .modal-overlay.active .modal-content {
      transform: translateY(0);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid var(--border);
    }

    .modal-header h3 {
      margin: 0;
      font-weight: 700;
      color: var(--text-primary);
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: var(--transition);
    }

    .modal-close:hover {
      background: var(--surface-2);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 20px;
    }

    /* Request/Client Details */
    .request-details, .client-profile {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-group {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      align-items: center;
    }

    .detail-group label {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;
    }

    .profile-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 3px solid var(--primary);
    }

    .profile-info h3 {
      margin: 0;
      font-weight: 700;
      color: var(--text-primary);
    }

    .profile-info p {
      margin: 4px 0 0 0;
      color: var(--text-secondary);
    }

    .profile-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Description Cell */
    .description-cell {
      max-width: 200px;
    }

    .description-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .description-text:hover {
      white-space: normal;
      overflow: visible;
      background: var(--surface-2);
      padding: 8px;
      border-radius: 4px;
      box-shadow: var(--shadow);
      position: relative;
      z-index: 10;
    }

    /* Analytics */
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .analytics-card {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }

    .analytics-card h5 {
      margin: 0 0 16px 0;
      font-weight: 700;
      color: var(--text-primary);
    }

    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--text-secondary);
      border: 2px dashed var(--border);
      border-radius: 8px;
    }

    .chart-placeholder i {
      font-size: 2rem;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    /* Sections */
    .section {
      display: none;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }

    .section.active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .container.app {
        grid-template-columns: 1fr;
        padding: 16px;
        gap: 16px;
      }

      .sidebar {
        position: static;
        height: auto;
      }

      .stats-container {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .section-controls.enhanced {
        flex-direction: column;
        align-items: stretch;
      }

      .search-container {
        min-width: auto;
      }

      .enhanced-table-container {
        font-size: 0.8rem;
      }

      .enhanced-table th,
      .enhanced-table td {
        padding: 8px;
      }
    }

    /* Scrollbar Styling */
    .it-manager-tasks::-webkit-scrollbar,
    .enhanced-table-container::-webkit-scrollbar {
      width: 6px;
    }

    .it-manager-tasks::-webkit-scrollbar-track,
    .enhanced-table-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .it-manager-tasks::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }

    .enhanced-table-container::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 3px;
    }

    .it-manager-tasks::-webkit-scrollbar-thumb:hover,
    .enhanced-table-container::-webkit-scrollbar-thumb:hover {
      background: var(--text-secondary);
    }

    /* Notification Styles */
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--surface);
      color: var(--text-primary);
      padding: 16px 20px;
      border-radius: 10px;
      box-shadow: var(--shadow-lg);
      border-left: 4px solid var(--primary);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1001;
      animation: slideIn 0.3s ease;
    }

    .notification.error {
      border-color: var(--error);
      background: #fef2f2;
      color: #b91c1c;
    }

    .notification.warning {
      border-color: var(--warning);
      background: #fffbeb;
      color: #d97706;
    }

    .notification.success {
      border-color: var(--success);
      background: #f0fdf4;
      color: #16a34a;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* ADVANCED RESPONSIVE ENHANCEMENTS - Add to injectEnhancedITAdminStyles() */

/* ========== ULTRA-RESPONSIVE GRID SYSTEM ========== */
@media (max-width: 1400px) {
  .container.app {
    grid-template-columns: 240px 1fr;
    gap: 20px;
    padding: 20px;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .dashboard-grid {
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .container.app {
    grid-template-columns: 200px 1fr;
    gap: 16px;
    padding: 16px;
  }
  
  .main {
    padding: 24px;
    border-radius: 16px;
  }
  
  .sidebar {
    top: 16px;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .dashboard-card {
    padding: 20px;
  }
  
  .section-controls.enhanced {
    gap: 12px;
  }
  
  .search-container {
    min-width: 250px;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .container.app {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
  
  .sidebar {
    position: sticky;
    top: 0;
    z-index: 100;
    border-radius: 12px;
    padding: 16px;
    height: auto;
  }
  
  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .sidebar-btn {
    padding: 10px 12px;
    font-size: 0.85rem;
    border-radius: 8px;
  }
  
  .sidebar-btn span:not(.notification-badge):not(.extension-badge) {
    display: none;
  }
  
  .sidebar-btn i {
    margin: 0;
  }
  
  .notification-badge,
  .extension-badge {
    display: none !important;
  }
  
  .sidebar-btn:hover,
  .sidebar-btn.active {
    transform: translateY(-1px);
  }
  
  .sidebar-logout {
    grid-column: 1 / -1;
  }
  
  .main {
    padding: 16px;
    border-radius: 12px;
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  .header-content h2 {
    font-size: 1.5rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-card.enhanced {
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .stat-value .number {
    font-size: 2rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .section-controls.enhanced {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .search-container {
    min-width: auto;
    width: 100%;
  }
  
  .search-input.enhanced {
    width: 100%;
    font-size: 1rem;
  }
  
  .filter-group {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .filter-select {
    flex: 1;
    min-width: 120px;
  }
  
  .section-title-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .section-title-group h4 {
    font-size: 1.25rem;
  }
  
  .section-stats {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .enhanced-table {
    font-size: 0.8rem;
  }
  
  .enhanced-table th,
  .enhanced-table td {
    padding: 10px 8px;
  }
  
  .staff-info, .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .btn-icon {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .quick-action-btn {
    padding: 16px;
    font-size: 0.9rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-actions {
    width: 100%;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
    font-size: 0.9rem;
    padding: 10px 12px;
  }
  
  .table-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .bulk-actions {
    width: 100%;
  }
  
  .bulk-actions .btn {
    flex: 1;
  }
  
  .modal-content {
    width: 95%;
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 16px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .detail-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .detail-group label {
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .profile-avatar {
    width: 56px;
    height: 56px;
  }
  
  /* Table Horizontal Scroll for Mobile */
  .enhanced-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .enhanced-table {
    min-width: 500px;
  }
  
  /* Hamburger-style sidebar toggle helper */
  .sidebar-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
  
  .sidebar-title {
    font-size: 1rem;
  }
  
  .admin-badge {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .container.app {
    gap: 8px;
    padding: 8px;
  }
  
  .sidebar {
    padding: 12px;
  }
  
  .sidebar-nav {
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }
  
  .main {
    padding: 12px;
  }
  
  .header-content h2 {
    font-size: 1.25rem;
  }
  
  .header-subtitle {
    font-size: 0.75rem;
  }
  
  .stat-card.enhanced {
    padding: 12px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    margin-bottom: 8px;
  }
  
  .stat-value .number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .card-header {
    padding-bottom: 12px;
  }
  
  .card-header h4 {
    font-size: 1rem;
  }
  
  .card-header h4 i {
    font-size: 1.1rem;
  }
  
  .dashboard-card {
    padding: 12px;
    border-radius: 10px;
  }
  
  .enhanced-table th,
  .enhanced-table td {
    padding: 8px 6px;
    font-size: 0.7rem;
  }
  
  .search-input.enhanced {
    padding: 10px 12px 10px 32px;
    font-size: 0.9rem;
  }
  
  .filter-select {
    padding: 8px 10px;
    font-size: 0.8rem;
  }
  
  .stat-pill {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
  
  .status-badge,
  .priority-badge {
    font-size: 0.65rem;
    padding: 4px 6px;
  }
  
  .position-badge,
  .type-badge,
  .department-badge {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
  
  .quick-action-btn {
    padding: 12px;
    font-size: 0.8rem;
  }
  
  .quick-action-btn i {
    font-size: 1.2rem;
  }
  
  .btn {
    font-size: 0.8rem;
    padding: 8px 10px;
  }
  
  .btn i {
    font-size: 0.85rem;
  }
  
  /* Stack modal actions */
  .modal-body {
    padding: 12px;
  }
  
  /* Simplify task details */
  .task-details-container {
    max-height: 200px;
    overflow-y: auto;
  }
  
  /* Hide unnecessary columns on ultra-small screens */
  .enhanced-table th:nth-child(n+6),
  .enhanced-table td:nth-child(n+6) {
    display: none;
  }
  
  /* Exception for critical columns */
  .enhanced-table th:nth-child(1),
  .enhanced-table th:nth-child(2),
  .enhanced-table th:nth-child(7),
  .enhanced-table td:nth-child(1),
  .enhanced-table td:nth-child(2),
  .enhanced-table td:nth-child(7) {
    display: table-cell;
  }
}

/* ========== TOUCH-FRIENDLY ENHANCEMENTS ========== */
@media (hover: none) and (pointer: coarse) {
  .sidebar-btn {
    padding: 12px 16px;
    min-height: 44px;
  }
  
  .btn-icon {
    min-width: 44px;
    min-height: 44px;
  }
  
  .filter-select,
  .search-input.enhanced {
    min-height: 44px;
  }
  
  .btn {
    min-height: 44px;
  }
  
  /* Remove hover effects on touch */
  .btn:active,
  .sidebar-btn:active {
    transform: scale(0.98);
  }
}

/* ========== HIGH RESOLUTION SCREENS ========== */
@media (min-width: 1920px) {
  .container.app {
    grid-template-columns: 320px 1fr;
    gap: 32px;
    padding: 32px;
  }
  
  .main {
    padding: 40px;
  }
  
  .stats-container {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 2.5fr 1fr;
    gap: 32px;
  }
  
  .header-content h2 {
    font-size: 2.5rem;
  }
  
  .stat-value .number {
    font-size: 3rem;
  }
}

/* ========== PORTRAIT/LANDSCAPE ORIENTATION ========== */
@media (max-height: 600px) and (orientation: landscape) {
  .sidebar {
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .main {
    padding: 12px;
  }
  
  .header {
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .dashboard-grid {
    gap: 12px;
  }
}

/* ========== PRINT STYLES ========== */
@media print {
  .sidebar,
  .header-actions,
  .section-controls,
  .quick-actions,
  .bulk-actions,
  .btn-icon,
  .action-buttons {
    display: none;
  }
  
  .container.app {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .main {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .enhanced-table {
    page-break-inside: avoid;
  }
  
  .dashboard-card {
    page-break-inside: avoid;
    border: 1px solid #ccc;
  }
}
  `;
  document.head.appendChild(style);
}

// Export functions for global access
window.renderITAdminDashboard = renderITAdminDashboard;
window.mountITAdminDashboard = mountITAdminDashboard;
window.getStaffTasks = getStaffTasks;
window.attachSidebarNavigation = attachSidebarNavigation;
window.loadITManagerTasks = loadITManagerTasks;