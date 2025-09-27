// REQUIRED DEPENDENCIES: (Updated for dynamic collections)
let itCol, travelCol, driversCol;  // Will be set dynamically if needed
let unsubscribes = [];  // Array for multiple listener cleanups

// NEW: Fetch active request types from DB config (one-time)
async function fetchActiveRequestTypes() {
  try {
    const configDoc = await window.db.collection('config').doc('activeRequests').get();
    if (configDoc.exists) {
      const config = configDoc.data();
      const types = config.types || [];  // Array: [{name: 'it_service_orders', label: 'IT Service Orders', icon: 'fas fa-cog', color: '#3b82f6'}, ...]
      console.log('Fetched active request types from DB:', types);
      return types;
    } else {
      console.warn('No config/activeRequests doc found; using fallback types.');
      return [];  // Will trigger fallback
    }
  } catch (err) {
    console.error('Failed to fetch request types config:', err);
    return [];  // Fallback
  }
}

// NEW: Map DB type name to collection reference
function getCollectionByType(typeName) {
  const colMap = {
    'it_service_orders': window.db.collection("it_service_orders"),
    'travel_orders': window.db.collection("travel_orders"),
    'drivers_trip_tickets': window.db.collection("drivers_trip_tickets")
    // Add more mappings here as needed (e.g., 'accomplishments': window.db.collection("accomplishments"))
  };
  return colMap[typeName] || null;
}

// Helpers (unchanged from previous - include if not defined)
function getStatusColor(status) {
  const colors = {
    pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24' },
    approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
    denied: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
    cancelled: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' }
  };
  return colors[status] || colors.pending;
}

function updateStats(stats) {
  console.log("Updating stats:", stats);
  
  const statElements = {
    pending: document.getElementById("stat-pending"),
    approved: document.getElementById("stat-approved"),
    denied: document.getElementById("stat-denied"),
    cancelled: document.getElementById("stat-cancelled")
  };

  Object.keys(stats).forEach(key => {
    if (statElements[key]) {
      const element = statElements[key];
      const oldValue = parseInt(element.textContent) || 0;
      const newValue = stats[key] || 0;
      
      if (newValue !== oldValue) {
        element.style.transition = "all 0.5s ease";
        element.textContent = newValue;
        if (element.parentElement) {
          element.parentElement.classList.add("stat-loading");
          setTimeout(() => {
            element.parentElement.classList.remove("stat-loading");
          }, 500);
        }
      } else {
        element.textContent = newValue;
      }
    }
  });
}

function getCurrentStats() {
  return {
    pending: parseInt(document.getElementById("stat-pending")?.textContent) || 0,
    approved: parseInt(document.getElementById("stat-approved")?.textContent) || 0,
    denied: parseInt(document.getElementById("stat-denied")?.textContent) || 0,
    cancelled: parseInt(document.getElementById("stat-cancelled")?.textContent) || 0
  };
}

function hideLoading() {
  const loadingOverlay = document.getElementById("dashboard-loading");
  if (loadingOverlay) {
    loadingOverlay.style.opacity = "0";
    setTimeout(() => {
      loadingOverlay.remove();
    }, 300);
  }
}

// Spinner CSS (unchanged)
if (!document.querySelector('#spinner-animation')) {
  const spinnerStyle = document.createElement('style');
  spinnerStyle.id = 'spinner-animation';
  spinnerStyle.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerStyle);
}

// UPDATED: Enhanced table styles with divider support
if (!document.querySelector('#requests-table-styles')) {
  const tableStyle = document.createElement('style');
  tableStyle.id = 'requests-table-styles';
  tableStyle.textContent = `
    #requestsTable {
      background: white;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      width: 100%;
      margin: 20px 0;
    }
    #requestsTable thead th {
      background: #f8fafc;
      color: #374151;
      font-weight: 600;
      padding: 16px 12px;
      text-align: left;
      border-bottom: 2px solid #e2e8f0;
    }
    #requestsTable thead th:first-child { border-top-left-radius: 12px; }
    #requestsTable thead th:last-child { border-top-right-radius: 12px; }
    #requestsTable tbody tr {
      background: white;
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.2s ease;
    }
    #requestsTable tbody tr:hover {
      background: #f8fafc;
    }
    #requestsTable td {
      padding: 16px 12px;
      color: #1e293b;
      vertical-align: middle;
    }
    #requestsTable tbody tr:last-child td {
      border-bottom: none;
    }
    #requestsTable tbody tr:last-child td:first-child { border-bottom-left-radius: 12px; }
    #requestsTable tbody tr:last-child td:last-child { border-bottom-right-radius: 12px; }
    .no-data-row td {
      background: white !important;
      text-align: center !important;
    }
    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: capitalize;
      white-space: nowrap;
    }
    .btn-cancel {
      transition: all 0.3s ease;
    }
    .btn-cancel:hover {
      background: rgba(239, 68, 68, 0.2) !important;
      transform: scale(1.05) !important;
    }
    .btn-cancel:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    /* NEW: Divider styles for sections */
    .section-divider {
      background: linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9) !important;
      border: none !important;
      height: 1px !important;
      padding: 0 !important;
    }
    .section-header-row {
      background: #f8fafc !important;
      border-bottom: 2px solid #e2e8f0 !important;
      font-weight: 600 !important;
    }
    .section-header-row td {
      padding: 12px 16px !important;
      color: #1e40af !important;
      font-size: 16px !important;
      text-align: left !important;
      border: none !important;
    }
    .section-header-row td:first-child {
      border-left: 4px solid #3b82f6 !important;
      padding-left: 20px !important;
    }
    @media (max-width: 768px) {
      #requestsTable { font-size: 14px; }
      #requestsTable td, #requestsTable th { padding: 12px 8px; }
      .section-header-row td { padding: 10px 12px !important; font-size: 15px !important; }
    }
  `;
  document.head.appendChild(tableStyle);
}

// UPDATED: loadOrders(user) - Dynamic sections/dividers based on DB config
async function loadOrders(user) {
  if (!user || !user.username) {
    console.error("Invalid user provided to loadOrders.");
    return;
  }

  // Cleanup previous listeners
  unsubscribes.forEach(unsub => unsub && unsub());
  unsubscribes = [];

  console.log("Loading requests for multiple types (DB-based) for:", user.username);

  const tbody = document.getElementById("requestsTable");
  if (!tbody) {
    console.error("Table body (#requestsTable) not found.");
    return;
  }

  // Stats only for IT (as original; extend if needed for other types)
  let itStats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

  // NEW: Fetch active types from DB and build collections dynamically
  const dbTypes = await fetchActiveRequestTypes();
  let collections = [];

  if (dbTypes.length > 0) {
    // Build from DB
    collections = dbTypes.map(({ name, label, icon, color }) => {
      const col = getCollectionByType(name);
      if (col) {
        const type = name.split('_')[0].toUpperCase();  // e.g., 'it_service_orders' → 'IT'
        return { col, type, label, icon, color };
      } else {
        console.warn(`Skipping unknown type from DB: ${name}`);
        return null;
      }
    }).filter(Boolean);  // Remove nulls
  }

  // FALLBACK: Hardcoded if DB empty/fails
  if (collections.length === 0) {
    console.log('Using fallback collections (no DB config)');
    collections = [
      { col: window.db.collection("it_service_orders"), type: 'IT', label: 'IT Service Orders', icon: 'fas fa-cog', color: '#3b82f6' },
      { col: window.db.collection("travel_orders"), type: 'Travel', label: 'Travel Orders', icon: 'fas fa-plane', color: '#10b981' },
      { col: window.db.collection("drivers_trip_tickets"), type: 'Drivers', label: "Driver's Trip Tickets", icon: 'fas fa-car', color: '#f59e0b' }
    ];
  }

  console.log('Active collections (DB-based):', collections.map(c => c.type));

  // Function to render a section (with divider and header)
  const renderSection = (orders, sectionType, label, icon, color) => {
    if (orders.length === 0) return;  // Skip empty sections

    // Add divider row (except for first section)
    if (tbody.children.length > 0 && tbody.lastElementChild.tagName === 'TR') {
      const divider = document.createElement('tr');
      divider.className = 'section-divider';
      divider.innerHTML = `<td colspan="5" style="height: 1px; background: linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9);"></td>`;
      tbody.appendChild(divider);
    }

    // Add section header row
    const headerRow = document.createElement('tr');
    headerRow.className = 'section-header-row';
    headerRow.innerHTML = `
      <td colspan="5" style="padding: 12px 16px; color: ${color} !important; font-size: 16px; font-weight: 600; border: none;">
        <i class="${icon}" style="margin-right: 8px; color: ${color};"></i>
        ${label} (${orders.length} ${orders.length === 1 ? 'item' : 'items'})
      </td>
    `;
    tbody.appendChild(headerRow);

    // Render order rows
    orders.forEach((order, index) => {
      const createdAt = order.dateSubmitted?.toDate
        ? order.dateSubmitted.toDate().toLocaleString()
        : new Date().toLocaleString();

      const statusKey = (order.status || "pending").toLowerCase();
      if (sectionType === 'IT') {
        itStats[statusKey] = (itStats[statusKey] || 0) + 1;  // Only track IT stats
      }

      const statusClass = `status-${statusKey}`;
      const statusColor = getStatusColor(statusKey);

      const row = document.createElement("tr");
      row.style.opacity = "0";
      row.style.transform = "translateY(20px)";
      row.style.transition = "all 0.3s ease";
      row.innerHTML = `
        <td style="padding: 16px 12px; font-weight: 600; color: #0f172a !important;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="${sectionType === 'IT' ? 'fas fa-cog' : sectionType === 'Travel' ? 'fas fa-plane' : 'fas fa-car'}" style="color: ${color}; font-size: 16px;"></i>
            <span style="color: #0f172a;">${order.type || sectionType}</span>
          </div>
        </td>
        <td style="padding: 16px 12px; color: #475569 !important; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <span title="${order.description || '-'}">${order.description?.substring(0, 50) || "-"}...</span>
        </td>
        <td style="padding: 16px 12px; color: #64748b !important;">
          <span style="color: #475569; font-weight: 500;">${createdAt}</span>
        </td>
        <td style="padding: 16px 12px;">
          <span class="status-badge ${statusClass}" style="
            background: ${statusColor.bg};
            color: ${statusColor.text} !important;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            text-transform: capitalize;
            white-space: nowrap;
          ">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
        </td>
        <td style="padding: 16px 12px;">
          ${statusKey === "pending" ? 
            `<button class="btn btn-cancel" data-id="${order.id}" data-type="${sectionType}" style="
              padding: 8px 16px;
              font-size: 14px;
              background: rgba(239, 68, 68, 0.1);
              color: #ef4444 !important;
              border: 1px solid #ef4444;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.3s ease;
              font-weight: 500;
            ">
              <i class="fas fa-times" style="margin-right: 4px; color: #ef4444;"></i>Cancel
            </button>` : 
            '<span style="color: #94a3b8; font-style: italic;">-</span>'
          }
        </td>
      `;
      tbody.appendChild(row);

      setTimeout(() => {
        row.style.opacity = "1";
        row.style.transform = "translateY(0)";
      }, index * 100);
    });
  };

  // Function to handle empty state for all sections
  const renderEmptyState = () => {
    tbody.innerHTML = `
      <tr class="no-data-row">
        <td colspan="5" style="background: white; padding: 60px 20px;">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            color: #475569;
          ">
            <i class="fas fa-inbox" style="font-size: 64px; color: #94a3b8;"></i>
            <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 600;">No Requests Yet</h3>
            <p style="margin: 0; color: #64748b; font-size: 16px; font-style: italic;">Create your first request (IT Service, Travel Order, or Driver's Trip Ticket) to get started!</p>
          </div>
        </td>
      </tr>
    `;
    updateStats({ pending: 0, approved: 0, denied: 0, cancelled: 0 });
  };

  // Initial empty state
  renderEmptyState();

  // Set up real-time listeners for each (dynamic) collection
  collections.forEach(({ col, type, label, icon, color }) => {
    const unsub = col
      .where("username", "==", user.username)
      .onSnapshot(
        async (snapshot) => {
          console.log(`Snapshot for ${type}:`, snapshot.size, "documents");

          // Clear table and re-render all sections (for simplicity; ensures order)
          tbody.innerHTML = "";
          itStats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };  // Reset IT stats

          let hasData = false;

          // Re-query and render each (dynamic) section on any change
          for (const coll of collections) {
            const collSnapshot = await coll.col.where("username", "==", user.username).get();
            const orders = [];
            collSnapshot.forEach(doc => {
              orders.push({ id: doc.id, type: coll.type, ...doc.data() });
            });
            if (orders.length > 0) {
              hasData = true;
              renderSection(orders, coll.type, coll.label, coll.icon, coll.color);
            }
          }

          if (!hasData) {
            renderEmptyState();
          } else {
            updateStats(itStats);  // Update IT stats only
          }

          // Animate in
          tbody.style.opacity = "0";
          tbody.style.transition = "opacity 0.3s ease";
          setTimeout(() => {
            tbody.style.opacity = "1";
          }, 100);

          // FIXED: Attach cancel events after rendering (fresh buttons)
          const cancelButtons = document.querySelectorAll(".btn-cancel");
          cancelButtons.forEach(btn => {
            if (!btn || !btn.closest('tr')) {
              console.warn("Skipping invalid cancel button.");
              return
              