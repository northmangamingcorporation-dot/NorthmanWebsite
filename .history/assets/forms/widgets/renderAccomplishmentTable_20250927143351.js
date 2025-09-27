// MOUNT FUNCTION: Initializes the accomplishments table structure (if not present) and loads data
// Usage: mountAccomplishmentTable(currentUser ) - Creates table HTML with headers, injects styles, then calls loadAccomplishments
// Assumes: Font Awesome icons available (fas classes), getStatusColor function defined, window.db for Firestore
// Table ID: "accomplishmentsTable" - 6 columns: ID, Description, Date Submitted, Status, Photos, Actions

function mountAccomplishmentTable(user) {
  if (!user || !user.username) {
    console.error('Invalid user provided to mountAccomplishmentTable');
    return;
  }

  console.log('Mounting accomplishments table for user:', user.username);

  // Step 1: Inject table-wide styles (once, if not present) - Enhanced for visibility
  if (!document.querySelector('#accomplishments-table-styles')) {
    const tableStyle = document.createElement('style');
    tableStyle.id = 'accomplishments-table-styles';
    tableStyle.textContent = `
      #accomplishmentsTable {
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
      #accomplishmentsTable thead th {
        background: #f8fafc;
        color: #374151;
        font-weight: 600;
        padding: 16px 12px;
        text-align: left;
        border-bottom: 2px solid #e2e8f0;
      }
      #accomplishmentsTable thead th:first-child { border-top-left-radius: 12px; }
      #accomplishmentsTable thead th:last-child { border-top-right-radius: 12px; }
      #accomplishmentsTable tbody tr {
        background: white;
        border-bottom: 1px solid #f1f5f9;
        transition: background 0.2s ease;
      }
      #accomplishmentsTable tbody tr:hover {
        background: #f8fafc;
      }
      #accomplishmentsTable td {
        padding: 16px 12px;
        color: #1e293b; /* Darker base color for better visibility */
        vertical-align: middle;
      }
      #accomplishmentsTable tbody tr:last-child td {
        border-bottom: none;
      }
      #accomplishmentsTable tbody tr:last-child td:first-child { border-bottom-left-radius: 12px; }
      #accomplishmentsTable tbody tr:last-child td:last-child { border-bottom-right-radius: 12px; }
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
      @media (max-width: 768px) {
        #accomplishmentsTable { font-size: 14px; }
        #accomplishmentsTable td, #accomplishmentsTable th { padding: 12px 8px; }
      }
    `;
    document.head.appendChild(tableStyle);
  }

  // Step 2: Create table structure if it doesn't exist (or clear/rebuild)
  let tableContainer = document.getElementById('accomplishmentsTable');
  if (!tableContainer) {
    // Assume a container div exists (e.g., id="accomplishments-container"); if not, append to body or a dashboard section
    const container = document.getElementById('accomplishments-container') || document.body;
    tableContainer = document.createElement('table');
    tableContainer.id = 'accomplishmentsTable';
    container.appendChild(tableContainer);
    console.log('Created new accomplishments table');
  } else {
    // Clear existing content to rebuild
    tableContainer.innerHTML = '';
  }

  // Step 3: Add thead with column headers
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th style="width: 15%;"><i class="fas fa-id-card" style="margin-right: 6px; color: #0ea5a4;"></i>ID</th>
      <th style="width: 30%;"><i class="fas fa-file-alt" style="margin-right: 6px; color: #0ea5a4;"></i>Description</th>
      <th style="width: 15%;"><i class="fas fa-calendar" style="margin-right: 6px; color: #0ea5a4;"></i>Date Submitted</th>
      <th style="width: 15%;"><i class="fas fa-tag" style="margin-right: 6px; color: #0ea5a4;"></i>Status</th>
      <th style="width: 10%;"><i class="fas fa-images" style="margin-right: 6px; color: #0ea5a4;"></i>Photos</th>
      <th style="width: 15%;"><i class="fas fa-cogs" style="margin-right: 6px; color: #0ea5a4;"></i>Actions</th>
    </tr>
  `;
  tableContainer.appendChild(thead);

  // Step 4: Add empty tbody
  const tbody = document.createElement('tbody');
  tableContainer.appendChild(tbody);

  // Step 5: Show loading state (optional spinner overlay)
  showLoading('dashboard-loading-accomplishments');  // Assumes showLoading function exists (e.g., spinner)

  // Step 6: Load data into the table (calls the real-time listener)
  loadAccomplishments(user);

  console.log('Accomplishments table mounted successfully');
}

// Ensure loadAccomplishments is defined before mounting (include the full loadAccomplishments function here or assume it's loaded)
// ... (Insert the full loadAccomplishments function from previous code here if needed)

// Expose globally for easy access (e.g., from dashboard init)
window.mountAccomplishmentTable = mountAccomplishmentTable;