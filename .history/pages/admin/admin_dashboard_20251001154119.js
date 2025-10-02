// --- Dynamic Admin Dashboard for Multiple Collections ---
function renderAdminDashboard(admin = { username: "Admin", position: "" }) {
  return `
    ${renderNav()}
    <div class="container app" style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
      <main class="main">
        <!-- Header Section -->
        <div class="header" style="
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 16px;
          padding: 28px;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">Admin Dashboard</h2>
              <div style="opacity: 0.95; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-user-shield"></i>
                Welcome, ${admin.username} (${admin.position || 'Admin'})
              </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="text-align: right; margin-right: 8px;">
                <div style="font-size: 12px; opacity: 0.9;">Current Date</div>
                <div id="currentDate" style="font-size: 14px; font-weight: 600;"></div>
              </div>
              <img src="https://i.pravatar.cc/44?u=${admin.username}" alt="avatar" 
                style="border-radius: 999px; border: 3px solid rgba(255,255,255,0.5); width: 48px; height: 48px;">
            </div>
          </div>
        </div>

        <!-- Collection Tabs -->
        <div style="
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        ">
          <div style="
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
          ">
            <button class="collection-tab active" data-collection="travel_orders" style="
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 14px;
            ">
              <i class="fas fa-plane-departure"></i> Travel Orders
            </button>
            <button class="collection-tab" data-collection="drivers_trip_tickets" style="
              padding: 12px 24px;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              background: white;
              color: #64748b;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 14px;
            ">
              <i class="fas fa-car"></i> Driver Trip Tickets
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        ">
          <div style="
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-radius: 12px;
            padding: 20px;
            border: 2px solid #fbbf24;
          ">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <i class="fas fa-clock" style="font-size: 24px; color: #f59e0b;"></i>
              <span style="color: #92400e; font-weight: 600;">Pending</span>
            </div>
            <div id="admin-pending" style="font-size: 32px; font-weight: 700; color: #f59e0b;">0</div>
          </div>

          <div style="
            background: linear-gradient(135deg, #d1fae5, #a7f3d0);
            border-radius: 12px;
            padding: 20px;
            border: 2px solid #10b981;
          ">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <i class="fas fa-check-circle" style="font-size: 24px; color: #059669;"></i>
              <span style="color: #065f46; font-weight: 600;">Approved</span>
            </div>
            <div id="admin-approved" style="font-size: 32px; font-weight: 700; color: #059669;">0</div>
          </div>

          <div style="
            background: linear-gradient(135deg, #fee2e2, #fecaca);
            border-radius: 12px;
            padding: 20px;
            border: 2px solid #ef4444;
          ">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <i class="fas fa-times-circle" style="font-size: 24px; color: #dc2626;"></i>
              <span style="color: #991b1b; font-weight: 600;">Denied</span>
            </div>
            <div id="admin-denied" style="font-size: 32px; font-weight: 700; color: #dc2626;">0</div>
          </div>

          <div style="
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-radius: 12px;
            padding: 20px;
            border: 2px solid #94a3b8;
          ">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <i class="fas fa-ban" style="font-size: 24px; color: #64748b;"></i>
              <span style="color: #475569; font-weight: 600;">Cancelled</span>
            </div>
            <div id="admin-cancelled" style="font-size: 32px; font-weight: 700; color: #64748b;">0</div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div style="
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        ">
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <input 
              type="text" 
              id="requestSearchInput" 
              placeholder="🔍 Search..."
              style="
                flex: 1;
                min-width: 250px;
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

            <select 
              id="statusFilter" 
              style="
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                font-size: 14px;
                cursor: pointer;
                background: white;
                color: #334155;
                font-weight: 500;
                outline: none;
              "
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select 
              id="dynamicFilter" 
              style="
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                font-size: 14px;
                cursor: pointer;
                background: white;
                color: #334155;
                font-weight: 500;
                outline: none;
              "
            >
              <option value="">All Types</option>
            </select>

            <button 
              id="clearFiltersBtn"
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
            >
              <i class="fas fa-redo"></i>
              Reset
            </button>
          </div>
        </div>

        <!-- Requests Table -->
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
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 12px;
          ">
            <h4 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a;">
              <i class="fas fa-list-ul" style="margin-right: 8px; color: #10b981;"></i>
              <span id="tableTitle">All Requests</span>
            </h4>
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              color: #64748b;
              font-size: 14px;
              font-weight: 600;
            ">
              <i class="fas fa-filter"></i>
              <span id="filterInfo">Showing all requests</span>
              <span style="margin: 0 8px; color: #cbd5e1;">•</span>
              Total: <span id="totalRequests" style="color: #10b981; font-size: 16px; font-weight: 700;">0</span>
            </div>
          </div>

          <div class="table-container" style="
            overflow-x: auto;
            overflow-y: auto;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            height: 40vh;
          ">
            <table style="
              width: 100%;
              border-collapse: collapse;
              background: white;
              min-width: 900px;
            ">
              <thead id="tableHeader" style="
                background: linear-gradient(135deg, #f8fafc, #f1f5f9);
                border-bottom: 2px solid #e2e8f0;
                position: sticky;
                top: 0;
                z-index: 10;
              ">
              </thead>
              <tbody id="adminRequestsTable">
                <tr>
                  <td colspan="10" style="padding: 40px; text-align: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #10b981;"></i>
                    <p style="margin-top: 16px; color: #64748b;">Loading requests...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Logout Button -->
        <button id="adminLogoutBtn" style="
          width: 100%;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        " onmouseover="
          this.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
        " onmouseout="
          this.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
        ">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </main>
    </div>
  `;
}


// --- Attach Dynamic Admin Dashboard ---
async function attachAdminDashboard(admin) {
  // Update current date
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .table-container::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .table-container::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .table-container::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .table-container::-webkit-scrollbar-thumb:hover {
      background: #10b981;
    }
    .table-container {
      scroll-behavior: smooth;
    }
    .table-container tbody tr:not(.no-data-row):hover {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      transition: background 0.2s ease;
    }
    .collection-tab:hover {
      transform: translateY(-2px);
    }
    .collection-tab.active {
      background: linear-gradient(135deg, #10b981, #059669) !important;
      color: white !important;
      border: 2px solid #10b981 !important;
    }
  `;
  document.head.appendChild(style);

  let currentCollection = "travel_orders";
  let allRequests = [];
  let unsubscribeMap = {};

  // Collection configurations
  const collectionConfigs = {
    travel_orders: {
      title: "Travel Orders",
      icon: "fa-plane-departure",
      fields: ["username", "destination", "purpose", "dateFrom", "dateTo", "dateSubmitted", "status"],
      searchFields: ["username", "destination", "purpose"],
      dynamicFilterField: "destination",
      dynamicFilterLabel: "Destination"
    },
    drivers_trip_tickets: {
      title: "Driver Trip Tickets",
      icon: "fa-car",
      fields: ["driverName", "vehicle", "destination", "purpose", "departureDate", "dateSubmitted", "status"],
      searchFields: ["driverName", "vehicle", "destination", "purpose"],
      dynamicFilterField: "vehicle",
      dynamicFilterLabel: "Vehicle"
    }
  };

  function loadCollection(collectionName) {
    currentCollection = collectionName;
    const config = collectionConfigs[collectionName];
    
    // Update table title
    const tableTitle = document.getElementById('tableTitle');
    if (tableTitle) {
      tableTitle.innerHTML = `<i class="fas ${config.icon}" style="margin-right: 8px;"></i>${config.title}`;
    }

    // Clear existing subscription
    if (unsubscribeMap[collectionName]) {
      unsubscribeMap[collectionName]();
    }

    const tbody = document.getElementById("adminRequestsTable");
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="padding: 40px; text-align: center;">
          <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #10b981;"></i>
          <p style="margin-top: 16px; color: #64748b;">Loading ${config.title}...</p>
        </td>
      </tr>
    `;

    // Subscribe to collection
    const ordersCol = window.db.collection(collectionName);
    unsubscribeMap[collectionName] = ordersCol.onSnapshot(
      snapshot => {
        const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

        if (snapshot.empty) {
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="10" style="padding: 60px 20px; text-align: center; border: none;">
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
                    <i class="fas fa-inbox" style="font-size: 36px; color: #10b981;"></i>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                      No ${config.title.toLowerCase()} yet
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                      Records will appear here when submitted
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          `;
          updateAdminStats(stats);
          updateTotalRequests(0);
          updateDynamicFilter([]);
          return;
        }

        allRequests = [];
        const dynamicValues = new Set();

        snapshot.forEach(doc => {
          const data = doc.data();
          const statusKey = (data.status || "pending").toLowerCase();
          stats[statusKey] = (stats[statusKey] || 0) + 1;

          // Convert Firestore timestamp to readable date
          let dateSubmitted = "-";
          if (data.dateSubmitted) {
            if (data.dateSubmitted.toDate) {
              dateSubmitted = data.dateSubmitted.toDate().toLocaleString();
            } else if (typeof data.dateSubmitted === 'string') {
              dateSubmitted = new Date(data.dateSubmitted).toLocaleString();
            }
          }

          allRequests.push({
            id: doc.id,
            ...data,
            dateSubmitted,
            statusKey
          });

          // Collect dynamic filter values
          if (data[config.dynamicFilterField]) {
            dynamicValues.add(data[config.dynamicFilterField]);
          }
        });

        renderTableHeaders(config);
        renderRequests(allRequests, config);
        updateAdminStats(stats);
        updateTotalRequests(allRequests.length);
        updateDynamicFilter(Array.from(dynamicValues), config.dynamicFilterLabel);
      },
      err => {
        console.error("Collection snapshot error:", err);
        tbody.innerHTML = `
          <tr>
            <td colspan="10" style="padding: 40px; text-align: center; color: #ef4444;">
              <i class="fas fa-exclamation-triangle" style="font-size: 32px;"></i>
              <p style="margin-top: 16px;">Error loading ${config.title}: ${err.message}</p>
            </td>
          </tr>
        `;
      }
    );
  }

  function renderTableHeaders(config) {
    const thead = document.getElementById('tableHeader');
    const headers = config.fields.map(field => {
      return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
    });
    headers.push('Action');

    thead.innerHTML = `
      <tr>
        ${headers.map(h => `
          <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${h}
          </th>
        `).join('')}
      </tr>
    `;
  }

  function renderRequests(requests, config) {
    const tbody = document.getElementById("adminRequestsTable");
    tbody.innerHTML = "";

    requests.forEach((data) => {
      const row = document.createElement("tr");
      row.style.borderTop = "1px solid #f1f5f9";
      row.style.transition = "all 0.2s ease";

      let cellsHTML = '';
      
      // Render each field dynamically
      config.fields.forEach((field, index) => {
        let value = data[field] || "-";
        
        // Special formatting for certain fields
        if (field === 'status') {
          cellsHTML += `<td style="padding: 16px;">${getStatusBadge(data.statusKey, value)}</td>`;
        } else if (field === 'username' || field === 'driverName') {
          cellsHTML += `
            <td style="padding: 16px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="https://i.pravatar.cc/32?u=${value}" 
                  style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #e2e8f0;">
                <span style="font-weight: 600; color: #0f172a;">${value}</span>
              </div>
            </td>
          `;
        } else if (field.toLowerCase().includes('date') && value !== "-") {
          // Format dates
          if (data[field]?.toDate) {
            value = data[field].toDate().toLocaleDateString();
          } else if (typeof value === 'string' && value !== '-') {
            try {
              value = new Date(value).toLocaleDateString();
            } catch (e) {
              // Keep original value if parsing fails
            }
          }
          cellsHTML += `<td style="padding: 16px; color: #64748b; font-size: 14px;">${value}</td>`;
        } else {
          // Truncate long text
          const displayValue = typeof value === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
          cellsHTML += `<td style="padding: 16px; color: #475569;">${displayValue}</td>`;
        }
      });

      // Add action button
      cellsHTML += `
        <td style="padding: 16px;">
          ${data.statusKey === "pending" 
            ? `<button class="btn-assign" data-id="${data.id}" style="
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13px;
              ">
                <i class="fas fa-user-check"></i> Assign
              </button>`
            : `<span style="color: #94a3b8; font-size: 14px;">-</span>`
          }
        </td>
      `;

      row.innerHTML = cellsHTML;

      // Assign button handler
      const assignBtn = row.querySelector(".btn-assign");
      if (assignBtn) {
        assignBtn.addEventListener("mouseover", () => {
          assignBtn.style.background = "linear-gradient(135deg, #059669, #047857)";
          assignBtn.style.transform = "translateY(-2px)";
        });
        assignBtn.addEventListener("mouseout", () => {
          assignBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
          assignBtn.style.transform = "translateY(0)";
        });
        assignBtn.addEventListener("click", async () => {
          if (window.mountAdminITServiceModal) {
            mountAdminITServiceModal(admin, {
              ...data,
              collection: currentCollection
            });
          } else {
            alert('Action handler not available');
          }
        });
      }

      tbody.appendChild(row);
    });
  }

  function getStatusBadge(statusKey, statusText) {
    const badges = {
      pending: `<span style="padding: 6px 14px; background: #fef3c7; color: #92400e; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #fbbf24;"><i class="fas fa-clock" style="margin-right: 6px;"></i>${statusText || "Pending"}</span>`,
      approved: `<span style="padding: 6px 14px; background: #d1fae5; color: #065f46; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #10b981;"><i class="fas fa-check-circle" style="margin-right: 6px;"></i>${statusText || "Approved"}</span>`,
      denied: `<span style="padding: 6px 14px; background: #fee2e2; color: #991b1b; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #ef4444;"><i class="fas fa-times-circle" style="margin-right: 6px;"></i>${statusText || "Denied"}</span>`,
      cancelled: `<span style="padding: 6px 14px; background: #f1f5f9; color: #475569; border-radius: 8px; font-size: 13px; font-weight: 700; border: 1px solid #94a3b8;"><i class="fas fa-ban" style="margin-right: 6px;"></i>${statusText || "Cancelled"}</span>`
    };
    return badges[statusKey] || badges.pending;
  }

  function updateAdminStats(stats) {
    document.getElementById("admin-pending").textContent = stats.pending || 0;
    document.getElementById("admin-approved").textContent = stats.approved || 0;
    document.getElementById("admin-denied").textContent = stats.denied || 0;
    document.getElementById("admin-cancelled").textContent = stats.cancelled || 0;
  }

  function updateTotalRequests(count) {
    const totalEl = document.getElementById("totalRequests");
    if (totalEl) totalEl.textContent = count;
  }

  function updateDynamicFilter(values, label = "Filter") {
    const filterSelect = document.getElementById("dynamicFilter");
    if (!filterSelect) return;

    filterSelect.innerHTML = `<option value="">All ${label}s</option>`;
    values.sort().forEach(val => {
      filterSelect.innerHTML += `<option value="${val}">${val}</option>`;
    });
  }

  // Filter and Search functionality
  function applyFilters() {
    const config = collectionConfigs[currentCollection];
    const searchValue = document.getElementById("requestSearchInput").value.toLowerCase();
    const statusValue = document.getElementById("statusFilter").value.toLowerCase();
    const dynamicValue = document.getElementById("dynamicFilter").value.toLowerCase();

    const filtered = allRequests.filter(req => {
      // Search across all searchable fields
      const matchesSearch = !searchValue || config.searchFields.some(field => 
        (req[field] || "").toLowerCase().includes(searchValue)
      );
      
      const matchesStatus = !statusValue || req.statusKey === statusValue;
      const matchesDynamic = !dynamicValue || 
        (req[config.dynamicFilterField] || "").toLowerCase() === dynamicValue;

      return matchesSearch && matchesStatus && matchesDynamic;
    });

    renderRequests(filtered, config);
    updateTotalRequests(filtered.length);
    updateFilterInfo(searchValue, statusValue, dynamicValue);
  }

  function updateFilterInfo(search, status, dynamic) {
    const filterInfo = document.getElementById("filterInfo");
    if (!filterInfo) return;

    if (!search && !status && !dynamic) {
      filterInfo.textContent = "Showing all requests";
    } else {
      const filters = [];
      if (search) filters.push(`search: "${search}"`);
      if (status) filters.push(`status: ${status}`);
      if (dynamic) filters.push(`filter: ${dynamic}`);
      filterInfo.textContent = `Filtered by ${filters.join(", ")}`;
    }
  }

  // Collection tab switching
  document.querySelectorAll('.collection-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const collection = tab.dataset.collection;
      
      // Update active state
      document.querySelectorAll('.collection-tab').forEach(t => {
        t.classList.remove('active');
        t.style.background = 'white';
        t.style.color = '#64748b';
        t.style.border = '2px solid #e2e8f0';
      });
      tab.classList.add('active');
      
      // Clear filters
      document.getElementById('requestSearchInput').value = '';
      document.getElementById('statusFilter').value = '';
      document.getElementById('dynamicFilter').value = '';
      
      // Load new collection
      loadCollection(collection);
    });
  });

  // Attach filter event listeners
  document.getElementById("requestSearchInput")?.addEventListener("input", applyFilters);
  document.getElementById("statusFilter")?.addEventListener("change", applyFilters);
  document.getElementById("dynamicFilter")?.addEventListener("change", applyFilters);
  
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    document.getElementById("requestSearchInput").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("dynamicFilter").value = "";
    applyFilters();
  });

  // Logout handler
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      window.logoutManager?.registerCallback(async () => {
        // Unsubscribe from all collections
        Object.values(unsubscribeMap).forEach(unsub => {
          if (unsub) unsub();
        });
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

  // Load initial collection
  loadCollection(currentCollection);
}

// --- Mount Admin Dashboard ---
function mountAdminDashboard(admin) {
  mount(renderAdminDashboard(admin));
  attachAdminDashboard(admin);
}

// Expose globally
window.renderAdminDashboard = renderAdminDashboard;
window.mountAdminDashboard = mountAdminDashboard;