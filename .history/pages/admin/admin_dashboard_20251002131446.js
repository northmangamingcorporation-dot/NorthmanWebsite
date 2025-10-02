// Enhanced Admin Dashboard - Based on IT Dashboard Design
function renderEnhancedAdminDashboard(admin = { username: "Admin", position: "" }) {
  return `
    ${renderNav()}
    <div class="container app">
      
      <!-- Enhanced Sidebar -->
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
        <!-- Improved Header -->
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

        <!-- Dashboard Section -->
        <div id="dashboardSection" class="section">
          <!-- Stats Cards -->
          <div class="stats-container">
            ${["pending","approved","denied","cancelled"].map(status => `
              <div class="stat-card enhanced ${status}">
                <div class="stat-icon">
                  <i class="fas fa-${getAdminStatusIcon(status)}"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
                  <div id="admin-${status}" class="stat-value ${status}">
                    <span class="number">0</span>
                  </div>
                </div>
                <div class="stat-progress">
                  <div class="progress-bar" id="progress-${status}"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Quick Overview Cards -->
          <div class="dashboard-grid">
            <div class="dashboard-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-chart-bar"></i>
                  Recent Activity
                </h4>
              </div>
              <div id="recentActivityList" class="activity-list">
                <div class="loading-state">
                  <div class="loading-spinner"></div>
                  <span>Loading recent activity...</span>
                </div>
              </div>
            </div>

            <div class="dashboard-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-users"></i>
                  Top Requesters
                </h4>
              </div>
              <div id="topRequestersList" class="top-list">
                <div class="loading-state">
                  <div class="loading-spinner"></div>
                  <span>Loading top requesters...</span>
                </div>
              </div>
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
              </div>
            </div>
            
            <div class="section-controls enhanced">
              <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchTravelInput" placeholder="Search travel orders..." class="search-input enhanced">
              </div>
              
              <div class="filter-group">
                <select id="travelStatusFilter" class="filter-select">
                  <option value="">All Status</option>
                </select>
                
                <select id="travelDestFilter" class="filter-select">
                  <option value="">All Destinations</option>
                </select>
              </div>
              
              <button class="btn-icon" id="clearTravelFilters" title="Clear Filters">
                <i class="fas fa-redo"></i>
              </button>
            </div>
          </div>
          
          <div class="enhanced-table-wrapper">
            <table class="enhanced-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Destination</th>
                  <th>Purpose</th>
                  <th>Date From</th>
                  <th>Date To</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="travelOrdersTable">
                <tr>
                  <td colspan="8" class="loading-state">
                    <div class="loading-content">
                      <div class="loading-spinner"></div>
                      <span>Loading travel orders...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
              </div>
            </div>
            
            <div class="section-controls enhanced">
              <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="searchDriverInput" placeholder="Search driver trips..." class="search-input enhanced">
              </div>
              
              <div class="filter-group">
                <select id="driverStatusFilter" class="filter-select">
                  <option value="">All Status</option>
                </select>
                
                <select id="driverVehicleFilter" class="filter-select">
                  <option value="">All Vehicles</option>
                </select>
              </div>
              
              <button class="btn-icon" id="clearDriverFilters" title="Clear Filters">
                <i class="fas fa-redo"></i>
              </button>
            </div>
          </div>
          
          <div class="enhanced-table-wrapper">
            <table class="enhanced-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Vehicle</th>
                  <th>Destination</th>
                  <th>Purpose</th>
                  <th>Departure</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="driverTripsTable">
                <tr>
                  <td colspan="8" class="loading-state">
                    <div class="loading-content">
                      <div class="loading-spinner"></div>
                      <span>Loading driver trips...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Analytics Section -->
        <div id="analyticsSection" class="section">
          <div class="section-header">
            <h4>
              <i class="fas fa-chart-line"></i>
              Performance Analytics
            </h4>
          </div>
          
          <div class="analytics-grid">
            <div class="analytics-card">
              <h5>Monthly Trends</h5>
              <div class="chart-placeholder">
                <i class="fas fa-chart-area"></i>
                <span>Chart visualization coming soon</span>
              </div>
            </div>
            
            <div class="analytics-card">
              <h5>Department Overview</h5>
              <div class="chart-placeholder">
                <i class="fas fa-chart-pie"></i>
                <span>Department metrics</span>
              </div>
            </div>
          </div>
        </div>
      </main>
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

// Enhanced attach function
async function attachEnhancedAdminDashboard(admin) {
  injectEnhancedAdminStyles();
  initializeDashboardOnLoad();
  initializeRealTimeUpdates();

  let unsubscribeTravel = null;
  let unsubscribeDrivers = null;
  let allTravelOrders = [];
  let allDriverTrips = [];

  // Collection configurations
  const collections = {
    travel: {
      name: 'travel_orders',
      fields: ['username', 'destination', 'purpose', 'dateFrom', 'dateTo', 'dateSubmitted', 'status'],
      searchFields: ['username', 'destination', 'purpose'],
      filters: ['status', 'destination']
    },
    drivers: {
      name: 'drivers_trip_tickets',
      fields: ['driverName', 'vehicle', 'destination', 'purpose', 'departureDate', 'dateSubmitted', 'status'],
      searchFields: ['driverName', 'vehicle', 'destination', 'purpose'],
      filters: ['status', 'vehicle']
    }
  };

  // Load Travel Orders
  function loadTravelOrders() {
    if (unsubscribeTravel) unsubscribeTravel();
    
    unsubscribeTravel = window.db.collection(collections.travel.name)
      .orderBy("dateSubmitted", "desc")
      .onSnapshot(snapshot => {
        const tbody = document.getElementById("travelOrdersTable");
        tbody.innerHTML = "";
        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };
        const destinations = new Set();

        if (snapshot.empty) {
          tbody.innerHTML = createEmptyState(8, "No travel orders yet", "fas fa-plane-departure");
          updateStats(stats);
          populateTravelFilters([], []);
          return;
        }

        allTravelOrders = [];
        
        snapshot.forEach(doc => {
          const order = doc.data();
          const statusKey = (order.status || "pending").toLowerCase();
          stats[statusKey] = (stats[statusKey] || 0) + 1;

          if (order.destination) destinations.add(order.destination);

          const dateSubmitted = formatTimestamp(order.dateSubmitted);
          
          allTravelOrders.push({
            id: doc.id,
            ...order,
            dateSubmitted,
            statusKey
          });

          const row = createTravelRow(doc.id, order, dateSubmitted, statusKey, admin);
          tbody.appendChild(row);
        });

        updateStats(stats);
        document.getElementById('travelPendingCount').textContent = stats.pending || 0;
        populateTravelFilters(Array.from(destinations));
        initializeTravelFilters();
      }, err => {
        console.error("Travel orders error:", err);
        showNotification("Error loading travel orders", "error");
      });
  }

  // Load Driver Trips
  function loadDriverTrips() {
    if (unsubscribeDrivers) unsubscribeDrivers();
    
    unsubscribeDrivers = window.db.collection(collections.drivers.name)
      .orderBy("dateSubmitted", "desc")
      .onSnapshot(snapshot => {
        const tbody = document.getElementById("driverTripsTable");
        tbody.innerHTML = "";
        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };
        const vehicles = new Set();

        if (snapshot.empty) {
          tbody.innerHTML = createEmptyState(8, "No driver trips yet", "fas fa-car");
          updateStats(stats);
          populateDriverFilters([], []);
          return;
        }

        allDriverTrips = [];
        
        snapshot.forEach(doc => {
          const trip = doc.data();
          const statusKey = (trip.status || "pending").toLowerCase();
          stats[statusKey] = (stats[statusKey] || 0) + 1;

          if (trip.vehicle) vehicles.add(trip.vehicle);

          const dateSubmitted = formatTimestamp(trip.dateSubmitted);
          
          allDriverTrips.push({
            id: doc.id,
            ...trip,
            dateSubmitted,
            statusKey
          });

          const row = createDriverRow(doc.id, trip, dateSubmitted, statusKey, admin);
          tbody.appendChild(row);
        });

        updateStats(stats);
        document.getElementById('driverPendingCount').textContent = stats.pending || 0;
        populateDriverFilters(Array.from(vehicles));
        initializeDriverFilters();
      }, err => {
        console.error("Driver trips error:", err);
        showNotification("Error loading driver trips", "error");
      });
  }

  // Create table rows
  function createTravelRow(docId, order, dateSubmitted, statusKey, admin) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="user-info">
          <img src="https://i.pravatar.cc/32?u=${order.username}" class="user-avatar" alt="">
          <span class="user-name">${order.username || "-"}</span>
        </div>
      </td>
      <td>${order.destination || "-"}</td>
      <td class="description-cell">
        <div class="description-text" title="${order.purpose || '-'}">${truncateText(order.purpose || '-', 50)}</div>
      </td>
      <td>${formatDate(order.dateFrom) || "-"}</td>
      <td>${formatDate(order.dateTo) || "-"}</td>
      <td>${dateSubmitted}</td>
      <td><span class="status-badge ${statusKey}">${order.status || "Pending"}</span></td>
      <td>
        <div class="action-buttons">
          ${statusKey === "pending" 
            ? `<button class="btn-icon assign-btn" data-id="${docId}" title="Review">
                 <i class="fas fa-user-check"></i>
               </button>`
            : `<button class="btn-icon view-btn" data-id="${docId}" title="View">
                 <i class="fas fa-eye"></i>
               </button>`
          }
        </div>
      </td>
    `;

    row.querySelector(".assign-btn, .view-btn")?.addEventListener("click", () => {
      if (window.mountAdminITServiceModal) {
        mountAdminITServiceModal(admin, { ...order, id: docId, collection: "travel_orders" });
      }
    });

    return row;
  }

  function createDriverRow(docId, trip, dateSubmitted, statusKey, admin) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="user-info">
          <img src="https://i.pravatar.cc/32?u=${trip.driverName}" class="user-avatar" alt="">
          <span class="user-name">${trip.driverName || "-"}</span>
        </div>
      </td>
      <td><span class="type-badge">${trip.vehicle || "-"}</span></td>
      <td>${trip.destination || "-"}</td>
      <td class="description-cell">
        <div class="description-text" title="${trip.purpose || '-'}">${truncateText(trip.purpose || '-', 50)}</div>
      </td>
      <td>${formatDate(trip.departureDate) || "-"}</td>
      <td>${dateSubmitted}</td>
      <td><span class="status-badge ${statusKey}">${trip.status || "Pending"}</span></td>
      <td>
        <div class="action-buttons">
          ${statusKey === "pending" 
            ? `<button class="btn-icon assign-btn" data-id="${docId}" title="Review">
                 <i class="fas fa-user-check"></i>
               </button>`
            : `<button class="btn-icon view-btn" data-id="${docId}" title="View">
                 <i class="fas fa-eye"></i>
               </button>`
          }
        </div>
      </td>
    `;

    row.querySelector(".assign-btn, .view-btn")?.addEventListener("click", () => {
      if (window.mountAdminITServiceModal) {
        mountAdminITServiceModal(admin, { ...trip, id: docId, collection: "drivers_trip_tickets" });
      }
    });

    return row;
  }

  // Filter functions
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
  }

  function initializeTravelFilters() {
    const searchInput = document.getElementById("searchTravelInput");
    const statusFilter = document.getElementById("travelStatusFilter");
    const destFilter = document.getElementById("travelDestFilter");
    const clearBtn = document.getElementById("clearTravelFilters");

    const debouncedFilter = debounce(() => {
      filterTravelTable();
    }, 300);

    searchInput?.addEventListener("input", debouncedFilter);
    statusFilter?.addEventListener("change", filterTravelTable);
    destFilter?.addEventListener("change", filterTravelTable);
    clearBtn?.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "";
      destFilter.value = "";
      filterTravelTable();
    });
  }

  function initializeDriverFilters() {
    const searchInput = document.getElementById("searchDriverInput");
    const statusFilter = document.getElementById("driverStatusFilter");
    const vehicleFilter = document.getElementById("driverVehicleFilter");
    const clearBtn = document.getElementById("clearDriverFilters");

    const debouncedFilter = debounce(() => {
      filterDriverTable();
    }, 300);

    searchInput?.addEventListener("input", debouncedFilter);
    statusFilter?.addEventListener("change", filterDriverTable);
    vehicleFilter?.addEventListener("change", filterDriverTable);
    clearBtn?.addEventListener("click", () => {
      searchInput.value = "";
      statusFilter.value = "";
      vehicleFilter.value = "";
      filterDriverTable();
    });
  }

  function filterTravelTable() {
    const searchValue = document.getElementById("searchTravelInput")?.value.toLowerCase() || "";
    const statusValue = document.getElementById("travelStatusFilter")?.value.toLowerCase() || "";
    const destValue = document.getElementById("travelDestFilter")?.value.toLowerCase() || "";

    const tbody = document.getElementById("travelOrdersTable");
    const rows = tbody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.getElementsByTagName("td");
      
      if (cells.length === 0) continue;

      const username = cells[0]?.textContent.toLowerCase() || "";
      const destination = cells[1]?.textContent.toLowerCase() || "";
      const purpose = cells[2]?.textContent.toLowerCase() || "";
      const status = cells[6]?.textContent.toLowerCase() || "";

      const matchesSearch = !searchValue || username.includes(searchValue) || 
                           destination.includes(searchValue) || purpose.includes(searchValue);
      const matchesStatus = !statusValue || status.includes(statusValue);
      const matchesDest = !destValue || destination.includes(destValue);

      row.style.display = (matchesSearch && matchesStatus && matchesDest) ? "" : "none";
    }
  }

  function filterDriverTable() {
    const searchValue = document.getElementById("searchDriverInput")?.value.toLowerCase() || "";
    const statusValue = document.getElementById("driverStatusFilter")?.value.toLowerCase() || "";
    const vehicleValue = document.getElementById("driverVehicleFilter")?.value.toLowerCase() || "";

    const tbody = document.getElementById("driverTripsTable");
    const rows = tbody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.getElementsByTagName("td");
      
      if (cells.length === 0) continue;

      const driverName = cells[0]?.textContent.toLowerCase() || "";
      const vehicle = cells[1]?.textContent.toLowerCase() || "";
      const destination = cells[2]?.textContent.toLowerCase() || "";
      const purpose = cells[3]?.textContent.toLowerCase() || "";
      const status = cells[6]?.textContent.toLowerCase() || "";

      const matchesSearch = !searchValue || driverName.includes(searchValue) || 
                           vehicle.includes(searchValue) || destination.includes(searchValue) || 
                           purpose.includes(searchValue);
      const matchesStatus = !statusValue || status.includes(statusValue);
      const matchesVehicle = !vehicleValue || vehicle.includes(vehicleValue);

      row.style.display = (matchesSearch && matchesStatus && matchesVehicle) ? "" : "none";
    }
  }

  // Update stats
  function updateStats(stats) {
    Object.entries(stats).forEach(([status, count]) => {
      const element = document.getElementById(`admin-${status}`);
      if (element) {
        const numberElement = element.querySelector('.number');
        if (numberElement) {
          animateCounter(numberElement, parseInt(numberElement.textContent) || 0, count);
        }
        
        const progressBar = document.getElementById(`progress-${status}`);
        if (progressBar) {
          const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
          const percentage = total > 0 ? (count / total) * 100 : 0;
          progressBar.style.width = `${percentage}%`;
        }
      }
    });
  }

  // Sidebar navigation
  attachSidebarNavigation();

  // Logout handler
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      window.logoutManager?.registerCallback(async () => {
        if (unsubscribeTravel) unsubscribeTravel();
        if (unsubscribeDrivers) unsubscribeDrivers();
        console.log("Admin dashboard cleanup completed");
      });

      const success = await window.logout?.({
        customMessage: "Are you sure you want to logout from the admin dashboard?",
        redirectTo: "home"
      });

      if (success) {
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        logoutBtn.disabled = true;
      }
    });
  }

  // Load initial data
  loadTravelOrders();
  loadDriverTrips();

  // Real-time clock update
  setInterval(() => {
    document.getElementById('lastUpdated').textContent = 
      `Last updated: ${new Date().toLocaleTimeString()}`;
  }, 30000);
}

// Helper functions
function formatTimestamp(timestamp) {
  if (!timestamp) return "-";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString();
}

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString();
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
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

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function initializeDashboardOnLoad() {
  const dashboardBtn = document.querySelector('.sidebar-btn[data-section="dashboard"]');
  if (dashboardBtn && !dashboardBtn.classList.contains('active')) {
    dashboardBtn.classList.add('active');
  }
  
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => {
    if (section.id !== 'dashboardSection') {
      section.style.display = "none";
    }
  });
  
  const dashboardSection = document.getElementById('dashboardSection');
  if (dashboardSection) {
    dashboardSection.style.display = "block";
    dashboardSection.style.opacity = "0";
    dashboardSection.style.transform = "translateY(20px)";
    setTimeout(() => {
      dashboardSection.style.opacity = "1";
      dashboardSection.style.transform = "translateY(0)";
    }, 100);
  }
}

function attachSidebarNavigation() {
  document.querySelectorAll(".sidebar-btn[data-section]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const sections = document.querySelectorAll(".section");
      sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        setTimeout(() => {
          section.style.display = "none";
        }, 200);
      });
      
      const targetSection = btn.getAttribute("data-section");
      const section = document.getElementById(`${targetSection}Section`);
      
      setTimeout(() => {
        section.style.display = "block";
        section.offsetHeight;
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }, 250);
    });
  });
}

function initializeRealTimeUpdates() {
  document.getElementById('refreshBtn')?.addEventListener('click', () => {
    location.reload();
  });

  document.getElementById('notificationBtn')?.addEventListener('click', () => {
    showNotification("Notification panel coming soon", "info");
  });
}

// Inject enhanced styles
function injectEnhancedAdminStyles() {
  const style = document.createElement("style");
  style.textContent = `
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

    .container.app {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
      gap: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 24px;
    }

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
    }

    .sidebar-btn:hover,
    .sidebar-btn.active {
      color: #ffffff;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      background: rgba(59, 130, 246, 0.1);
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

    .main {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 32px;
      overflow: hidden;
      box-shadow: var(--shadow);
    }

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

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      text-transform: capitalize;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .stat-value .number {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
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
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

    .section {
      display: none;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }

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
      margin-bottom: 16px;
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

    .enhanced-table-wrapper {
      background: var(--surface);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow);
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

    .enhanced-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    .enhanced-table tr:hover {
      background: rgba(59, 130, 246, 0.02);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--border);
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .type-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
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

    .description-cell {
      max-width: 200px;
    }

    .description-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

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

    .assign-btn {
      background: var(--primary);
      color: white;
    }

    .assign-btn:hover {
      background: var(--primary-dark);
    }

    .view-btn {
      background: var(--info);
      color: white;
    }

    .view-btn:hover {
      background: #0891b2;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
    }

    .loading-content, .empty-content {
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
      to { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 3rem;
      opacity: 0.5;
    }

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

    @media (max-width: 768px) {
      .container.app {
        grid-template-columns: 1fr;
        padding: 16px;
      }

      .sidebar {
        position: static;
        height: auto;
      }
    }
  `;
  document.head.appendChild(style);
}

// Mount function
async function mountEnhancedAdminDashboard(admin) {
  mount(renderEnhancedAdminDashboard(admin));
  attachEnhancedAdminDashboard(admin);
}

// Export functions
window.renderEnhancedAdminDashboard = renderEnhancedAdminDashboard;
window.mountEnhancedAdminDashboard = mountEnhancedAdminDashboard