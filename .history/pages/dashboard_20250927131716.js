// Enhanced pages/dashboard.js

// -- Enhanced Dashboard Rendering ---
function renderDashboard(user = { username: "Employee", firstName: "User " }) {
  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;
  return `
    ${renderNav ? renderNav() : ''} <!-- Assuming renderNav is defined elsewhere -->
    <div class="container app" style="
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(145deg, #f7fafc, #f0fdfa);
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    ">
      <main class="main" style="
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 32px;
        margin-bottom: 20px;
      ">
        
        <!-- Enhanced Header -->
        <div class="header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        ">
          <div class="header-left" style="
            display: flex;
            flex-direction: column;
            gap: 4px;
          ">
            <h1 style="
              margin: 0;
              color: #0f172a;
              font-size: 32px;
              font-weight: 700;
              background: linear-gradient(135deg, #0f172a, #3b82f6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            ">
              Dashboard
            </h1>
            <p style="
              margin: 0;
              color: #64748b;
              font-size: 16px;
              font-weight: 500;
            ">
              Welcome back, ${fullName}!
            </p>
          </div>
          <div class="header-right" style="
            display: flex;
            align-items: center;
            gap: 16px;
          ">
            <div class="user-info" style="
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 20px;
              background: rgba(59, 130, 246, 0.05);
              border-radius: 12px;
              border: 1px solid rgba(59, 130, 246, 0.1);
            ">
              <img src="https://i.pravatar.cc/44" alt="Avatar" style="
                width: 44px;
                height: 44px;
                border-radius: 50%;
                border: 2px solid #e2e8f0;
                transition: all 0.3s ease;
              " onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='scale(1.05)';"
                 onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='scale(1)';"
              />
              <span style="
                color: #0f172a;
                font-weight: 600;
                font-size: 14px;
              ">${fullName}</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Stats Grid -->
        <div class="stats-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        ">
          <div class="stat-card pending-stat" style="
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
            border: 1px solid rgba(251, 191, 36, 0.2);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px rgba(251, 191, 36, 0.15)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)';">
            <div class="stat-icon" style="
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 12px;
              color: white;
              font-size: 20px;
            ">
              <i class="fas fa-clock"></i>
            </div>
            <div style="color: #64748b; font-size: 14px; margin-bottom: 8px; font-weight: 500;">
              Pending Requests
            </div>
            <div id="stat-pending" style="
              font-size: 32px;
              font-weight: 700;
              color: #fbbf24;
              margin: 0;
            ">0</div>
          </div>

          <div class="stat-card approved-stat" style="
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px rgba(34, 197, 94, 0.15)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)';">
            <div class="stat-icon" style="
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #22c55e, #16a34a);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 12px;
              color: white;
              font-size: 20px;
            ">
              <i class="fas fa-check-circle"></i>
            </div>
            <div style="color: #64748b; font-size: 14px; margin-bottom: 8px; font-weight: 500;">
              Approved
            </div>
            <div id="stat-approved" style="
              font-size: 32px;
              font-weight: 700;
              color: #22c55e;
              margin: 0;
            ">0</div>
          </div>

          <div class="stat-card denied-stat" style="
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px rgba(239, 68, 68, 0.15)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)';">
            <div class="stat-icon" style="
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #ef4444, #dc2626);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 12px;
              color: white;
              font-size: 20px;
            ">
              <i class="fas fa-times-circle"></i>
            </div>
            <div style="color: #64748b; font-size: 14px; margin-bottom: 8px; font-weight: 500;">
              Denied
            </div>
            <div id="stat-denied" style="
              font-size: 32px;
              font-weight: 700;
              color: #ef4444;
              margin: 0;
            ">0</div>
          </div>

          <div class="stat-card cancelled-stat" style="
            background: linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.1));
            border: 1px solid rgba(107, 114, 128, 0.2);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px rgba(107, 114, 128, 0.15)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)';">
            <div class="stat-icon" style="
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #6b7280, #4b5563);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 12px;
              color: white;
              font-size: 20px;
            ">
              <i class="fas fa-ban"></i>
            </div>
            <div style="color: #64748b; font-size: 14px; margin-bottom: 8px; font-weight: 500;">
              Cancelled
            </div>
            <div id="stat-cancelled" style="
              font-size: 32px;
              font-weight: 700;
              color: #6b7280;
              margin: 0;
            ">0</div>
          </div>
        </div>

        <!-- Enhanced Requests Section -->
        <div class="requests-section" style="
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
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
            <h3 style="
              margin: 0;
              color: #0f172a;
              font-size: 24px;
              font-weight: 600;
            ">
              My Requests
            </h3>
            <button id="newRequestBtn" class="btn primary-btn" style="
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              border: none;
              border-radius: 12px;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
            " onmouseover="
              this.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
              this.style.transform = 'translateY(-2px)';
              this.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
            " onmouseout="
              this.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.2)';
            ">
              <i class="fas fa-plus"></i>
              New Request
            </button>
          </div>

          <!-- Enhanced Table -->
          <div class="table-container" style="
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          ">
            <table style="
              width: 100%;
              border-collapse: collapse;
              background: white;
              min-width: 600px;
            ">
              <thead style="
                background: #f8fafc;
                border-bottom: 2px solid #e2e8f0;
              ">
                <tr>
                  <th style="
                    text-align: left;
                    padding: 16px 12px;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    border-bottom: 1px solid #e2e8f0;
                  ">Type</th>
                  <th style="
                    text-align: left;
                    padding: 16px 12px;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    border-bottom: 1px solid #e2e8f0;
                  ">Details</th>
                  <th style="
                    text-align: left;
                    padding: 16px 12px;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    border-bottom: 1px solid #e2e8f0;
                  ">Date</th>
                  <th style="
                    text-align: left;
                    padding: 16px 12px;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    border-bottom: 1px solid #e2e8f0;
                  ">Status</th>
                  <th style="
                    text-align: left;
                    padding: 16px 12px;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    border-bottom: 1px solid #e2e8f0;
                  ">Action</th>
                </tr>
              </thead>
              <tbody id="requestsTable" style="
                animation: fadeIn 0.5s ease;
              ">
                <tr class="no-data-row" style="
                  text-align: center;
                  color: #94a3b8;
                  font-style: italic;
                ">
                  <td colspan="5" style="
                    padding: 40px 12px;
                    border: none;
                  ">
                    <div style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 12px;
                    ">
                      <i class="fas fa-inbox" style="font-size: 48px; color: #cbd5e1;"></i>
                      <span>No requests yet. Create your first one!</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Accomplishments / Reports Section -->
        <div class="accomplishments-section" style="
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
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
            <h3 style="
              margin: 0;
              color: #0f172a;
              font-size: 24px;
              font-weight: 600;
            ">
              My Accomplishments
            </h3>
            <button id="addReportBtn" class="btn primary-btn" style="
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              border: none;
              border-radius: 12px;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
            " onmouseover="
              this.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
              this.style.transform = 'translateY(-2px)';
              this.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
            " onmouseout="
              this.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.2)';
            "
            onClick="${mountAccomplishmentForm(user)}"
            >
              <i class="fas fa-plus"></i>
              Add Report
            </button>
          </div>

          <div class="table-container" style="
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          ">
            <table style="
              width: 100%;
              border-collapse: collapse;
              background: white;
              min-width: 600px;
            ">
              <thead style="
                background: #f8fafc;
                border-bottom: 2px solid #e2e8f0;
              ">
                <tr>
                  <th style="text-align: left; padding: 16px 12px; color: #64748b; font-weight: 600; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Report</th>
                  <th style="text-align: left; padding: 16px 12px; color: #64748b; font-weight: 600; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Description</th>
                  <th style="text-align: left; padding: 16px 12px; color: #64748b; font-weight: 600; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Date</th>
                  <th style="text-align: left; padding: 16px 12px; color: #64748b; font-weight: 600; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Status</th>
                  <th style="text-align: left; padding: 16px 12px; color: #64748b; font-weight: 600; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Action</th>
                </tr>
              </thead>
              <tbody id="accomplishmentsTable" style="animation: fadeIn 0.5s ease;">
                <tr class="no-data-row" style="text-align: center; color: #94a3b8; font-style: italic;">
                  <td colspan="5" style="padding: 40px;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                      <i class="fas fa-clipboard-list" style="font-size: 48px; color: #cbd5e1;"></i>
                      <span>No reports yet. Add your first accomplishment!</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Enhanced Logout Button -->
        <div style="text-align: center; margin-top: 24px;">
          <button id="backBtn" class="btn secondary-btn" style="
            padding: 12px 32px;
            font-size: 16px;
            font-weight: 600;
            border: 1px solid #ef4444;
            border-radius: 12px;
            background: transparent;
            color: #ef4444;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 0 auto;
          " onmouseover="
            this.style.background = 'rgba(239, 68, 68, 0.1)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.15)';
          " onmouseout="
            this.style.background = 'transparent';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
          ">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </main>
    </div>

    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .container.app {
          padding: 16px;
        }
        
        .main {
          padding: 24px 16px;
        }
        
        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          text-align: center;
        }
        
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .requests-section {
          padding: 20px 16px;
        }
        
        .table-container {
          font-size: 14px;
        }
        
                th, td {
          padding: 12px 8px;
        }
        
        .header-right {
          width: 100%;
          justify-content: center;
        }
        
        .user-info {
          padding: 8px 16px;
        }
      }


      .photo-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }
      .photo-item {
        margin: 10px;
        text-align: center;
        max-width: 200px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 10px;
        background: white;
      }
      .photo-item img {
        width: 100%;
        max-width: 200px;
        height: auto;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      /* Ensure modal is wide enough */
      .modal-content {
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
      }
      
      @media (max-width: 480px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        .table-container table {
          min-width: 100%;
          font-size: 13px;
        }
        
        th, td {
          padding: 8px 4px;
        }
      }
      
      /* Enhanced table row hover effects */
      tbody tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f1f5f9;
      }
      
      tbody tr:hover {
        background: rgba(59, 130, 246, 0.02);
        transform: scale(1.01);
      }
      
      tbody tr:last-child {
        border-bottom: none;
      }
      
      /* Status badges */
      .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }
      
      .status-pending { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }
      .status-approved { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
      .status-denied { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      .status-cancelled { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
      
      /* Button styles */
      .btn {
        transition: all 0.3s ease;
      }
      
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
      
      /* Loading animation for stats */
      .stat-loading {
        opacity: 0.5;
      }
      
      .stat-loading::after {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #cbd5e1;
        border-top: 2px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-left: 8px;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `;
}


// UPDATED: Attach accomplishments section (no changes needed, but included for context)
function attachAccomplishmentsSection(user) {
  const addReportBtn = document.getElementById('addReportBtn');
  if (addReportBtn) {
    addReportBtn.addEventListener('click', () => {
      if (typeof window.mountAccomplishmentForm === 'function') {
        window.mountAccomplishmentForm(user);
      } else {
        console.error('mountAccomplishmentForm not loaded');
        alert('Form not available. Please refresh.');
      }
    });
  }
  // Load accomplishments data
  loadAccomplishments(user);
}

// UPDATED: Load accomplishments with enhanced design matching IT Service Orders
// Features: Loading overlay with spinner, real-time onSnapshot listener, animated rows, empty state with icon,
// status badges with colors, graceful error handling, integrated with openAccomplishmentModal
// Assumes: unsubscribe variable (global or outer scope), window.Modal for confirm/show (fallback to alert/confirm),
// getStatusColor function (defined below), table with id="accomplishmentsTable" and 6 columns (ID, Description, Date, Status, Photos, Action)

let unsubscribeAccomplishments; // Global unsubscribe for real-time listener (parallel to unsubscribe in loadOrders)

async function loadAccomplishments(currentUser ) {
  if (unsubscribeAccomplishments) unsubscribeAccomplishments(); // Clean up previous listener


  console.log("Loading accomplishments for:", currentUser .username);

  // Real-time listener (matching loadOrders)
  unsubscribeAccomplishments = window.db.collection('accomplishments')
    .where('uniquekey', '==', currentUser .username)
    .limit(50) // Adjust as needed
    .onSnapshot(
      async (snapshot) => {
        const tbody = document.getElementById('accomplishmentsTable');

        if (snapshot.empty) {
          console.log("No accomplishments found for user.");
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="6">
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 12px;
                  padding: 40px 12px;
                ">
                  <i class="fas fa-trophy" style="font-size: 48px; color: #cbd5e1;"></i>
                  <span style="color: #94a3b8; font-style: italic;">No accomplishments yet. Submit your first report!</span>
                </div>
              </td>
            </tr>
          `;
          hideLoading('dashboard-loading-accomplishments');
          return;
        }

        // Animate table rows (matching loadOrders)
        tbody.style.opacity = "0";
        tbody.innerHTML = "";

        const accomplishments = [];
        snapshot.forEach(doc => {
          const accomplishment = { id: doc.id, ...doc.data() };
          console.log("Accomplishment loaded:", doc.id, accomplishment);
          accomplishments.push(accomplishment);
        });

        // Render rows with animations
        accomplishments.forEach(accomplishment => {
          const createdAt = accomplishment.dateSubmitted?.toDate
            ? accomplishment.dateSubmitted.toDate().toLocaleDateString()
            : 'N/A';

          const statusKey = (accomplishment.status || 'submitted').toLowerCase();
          const statusColor = getStatusColor(statusKey);

          const photoCount = accomplishment.telegramPhotos ? accomplishment.telegramPhotos.length : 0;
          const photoIndicator = photoCount > 0 ? `📷 ${photoCount}` : '—';

          const row = document.createElement("tr");
          row.style.opacity = "0";
          row.style.transform = "translateY(20px)";
          row.style.transition = "all 0.3s ease";
          row.innerHTML = `
            <td style="padding: 16px 12px; font-weight: 500; color: #0f172a;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-id-card" style="color: #0ea5a4; font-size: 16px;"></i>
                ${accomplishment.id}
              </div>
            </td>
            <td style="padding: 16px 12px; color: #475569;">
              ${accomplishment.descriptionOfService?.substring(0, 50) || 'N/A'}...
            </td>
            <td style="padding: 16px 12px; color: #64748b;">
              ${createdAt}
            </td>
            <td style="padding: 16px 12px;">
              <span class="status-badge status-${statusKey}" style="
                background: ${statusColor.bg};
                color: ${statusColor.text};
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
            </td>
            <td style="padding: 16px 12px; color: #64748b; font-weight: 500;">
              ${photoIndicator}
            </td>
            <td style="padding: 16px 12px;">
              <button onclick="openAccomplishmentModal('${accomplishment.id}')" 
                      style="
                        padding: 8px 16px;
                        font-size: 14px;
                        background: rgba(14, 165, 164, 0.1);
                        color: #0ea5a4;
                        border: 1px solid #0ea5a4;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                      " 
                      onmouseover="this.style.background='rgba(14, 165, 164, 0.2)'; this.style.transform='scale(1.05)';"
                      onmouseout="this.style.background='rgba(14, 165, 164, 0.1)'; this.style.transform='scale(1)';"
                      aria-label="View accomplishment report ${accomplishment.id}">
                <i class="fas fa-eye" style="margin-right: 4px;"></i>View
              </button>
            </td>
          `;
          tbody.appendChild(row);

          // Animate row in (staggered)
          setTimeout(() => {
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
          }, accomplishments.indexOf(accomplishment) * 100);
        });
      },
      (err) => {
        console.error("Firestore snapshot error for accomplishments:", err);
        const tbody = document.getElementById('accomplishmentsTable');
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: #ef4444; padding: 40px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 8px;"></i>
              Error loading accomplishments. Please refresh the page.
            </td>
          </tr>
        `;
        if (window.Modal && window.Modal.show) {
          window.Modal.show("Error loading accomplishments. Please refresh the page.", "error");
        } else {
          alert("Error loading accomplishments. Please refresh the page.");
        }
      }
    );
}

// Helper function for status colors (adapt for accomplishment statuses: submitted, approved, completed, etc.)
// Matching loadOrders style; extend as needed for your statuses
function getStatusColor(statusKey) {
  const colors = {
    submitted: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
    pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
    approved: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
    completed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
    denied: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
    cancelled: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
    default: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' }
  };
  return colors[statusKey] || colors.default;
}

// --- Enhanced Attach Dashboard ---
async function attachDashboard(user) {
  attachAccomplishmentsSection(user)
  
  if (!user || !user.username) {
    console.error("No user provided to attachDashboard.");
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error: User session invalid. Redirecting to login...");
    }
    setTimeout(() => {
      sessionStorage.removeItem("loggedInUser ");
      localStorage.removeItem("loggedInUser ");
      if (window.mountLogin) window.mountLogin();
    }, 2000);
    return;
  }

  const ordersCol = window.db.collection("it_service_orders");
  let unsubscribe = null;
  const loadingStates = {
    stats: { pending: false, approved: false, denied: false, cancelled: false }
  };

  function loadOrders(currentUser ) {
    if (unsubscribe) unsubscribe();
    
    // Show loading overlay
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "dashboard-loading";
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    loadingOverlay.innerHTML = `
      <div style="
        background: white;
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      ">
        <div style="
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        "></div>
        <p style="margin: 0; color: #64748b; font-weight: 500;">Loading your requests...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    setTimeout(() => loadingOverlay.style.opacity = "1", 10);

    console.log("Loading IT service orders for:", currentUser .username);

    unsubscribe = ordersCol
      .where("username", "==", currentUser .username)
      .orderBy("dateSubmitted", "desc")
      .onSnapshot(
        async (snapshot) => {
          const tbody = document.getElementById("requestsTable");
          const stats = { pending: 0, approved: 0, denied: 0, cancelled: 0 };

          if (snapshot.empty) {
            console.log("No IT service requests found for user.");
            tbody.innerHTML = `
              <tr class="no-data-row">
                <td colspan="5">
                  <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding: 40px 12px;
                  ">
                    <i class="fas fa-inbox" style="font-size: 48px; color: #cbd5e1;"></i>
                    <span style="color: #94a3b8; font-style: italic;">No requests yet. Create your first one!</span>
                  </div>
                </td>
              </tr>
            `;
            updateStats(stats);
            hideLoading();
            return;
          }

          // Animate table rows
          tbody.style.opacity = "0";
          tbody.innerHTML = "";

          const orders = [];
          snapshot.forEach(doc => {
            const order = { id: doc.id, ...doc.data() };
            console.log("Order loaded:", doc.id, order);
            orders.push(order);
          });

          // Sort by date if needed (already ordered by query)
          orders.forEach(order => {
            const createdAt = order.dateSubmitted?.toDate
              ? order.dateSubmitted.toDate().toLocaleString()
              : new Date().toLocaleString();

            const statusKey = (order.status || "pending").toLowerCase();
            stats[statusKey] = (stats[statusKey] || 0) + 1;

            const statusClass = `status-${statusKey}`;
            const statusColor = getStatusColor(statusKey);

            const row = document.createElement("tr");
            row.style.opacity = "0";
            row.style.transform = "translateY(20px)";
            row.style.transition = "all 0.3s ease";
            row.innerHTML = `
              <td style="padding: 16px 12px; font-weight: 500; color: #0f172a;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <i class="fas fa-cog" style="color: #3b82f6; font-size: 16px;"></i>
                  ${order.type || "-"}
                </div>
              </td>
              <td style="padding: 16px 12px; color: #475569;">
                ${order.description || "-"}
              </td>
              <td style="padding: 16px 12px; color: #64748b;">
                ${createdAt}
              </td>
              <td style="padding: 16px 12px;">
                <span class="status-badge ${statusClass}" style="
                  background: ${statusColor.bg};
                  color: ${statusColor.text};
                ">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
              </td>
              <td style="padding: 16px 12px;">
                ${statusKey === "pending" ? 
                  `<button class="btn btn-cancel" data-id="${order.id}" style="
                    padding: 6px 12px;
                    font-size: 14px;
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid #ef4444;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                  " onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'; this.style.transform='scale(1.05)';"
                     onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.transform='scale(1)';">
                    <i class="fas fa-times" style="margin-right: 4px;"></i>Cancel
                  </button>` : 
                  "-"
                }
              </td>
            `;
            tbody.appendChild(row);

            // Animate row in
            setTimeout(() => {
              row.style.opacity = "1";
              row.style.transform = "translateY(0)";
            }, orders.indexOf(order) * 100);
          });

          updateStats(stats);
          hideLoading();

          // Attach cancel button events
          document.querySelectorAll(".btn-cancel").forEach(btn => {
            btn.addEventListener("click", async (e) => {
              e.stopPropagation();
              const id = btn.dataset.id;
              
              // Enhanced confirmation
              if (window.Modal && window.Modal.confirm) {
                const confirmed = await window.Modal.confirm("Are you sure you want to cancel this request? This action cannot be undone.");
                if (!confirmed) return;
              } else {
                if (!confirm("Cancel this request?")) return;
              }

              try {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cancelling...';
                
                await ordersCol.doc(id).update({ 
                  status: "cancelled",
                  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Update local row
                const row = btn.closest("tr");
                const statusCell = row.cells[3];
                statusCell.innerHTML = '<span class="status-badge status-cancelled" style="background: rgba(107, 114, 128, 0.1); color: #6b7280;">Cancelled</span>';
                btn.remove();
                
                // Update stats
                const currentStats = getCurrentStats();
                currentStats.pending--;
                currentStats.cancelled++;
                updateStats(currentStats);
                
                if (window.Modal && window.Modal.show) {
                  window.Modal.show("Request cancelled successfully.", "success");
                } else {
                  alert("Request cancelled.");
                }
                
                console.log("Request cancelled:", id);
              } catch (err) {
                console.error("Failed to cancel request:", err);
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-times" style="margin-right: 4px;"></i>Cancel';
                if (window.Modal && window.Modal.show) {
                  window.Modal.show("Failed to cancel request. Please try again.", "error");
                } else {
                  alert("Failed to cancel request.");
                }
              }
            });
          });
        },
        (err) => {
          hideLoading();
          console.error("Firestore snapshot error:", err);
          if (window.Modal && window.Modal.show) {
            window.Modal.show("Error loading requests. Please refresh the page.", "error");
          }
        }
      );
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
          // Animate number change
          element.style.transition = "all 0.5s ease";
          element.textContent = newValue;
          element.parentElement.classList.add("stat-loading");
          setTimeout(() => {
            element.parentElement.classList.remove("stat-loading");
          }, 500);
        } else {
          element.textContent = newValue;
        }
      }
    });
  }

  function getCurrentStats() {
    return {
      pending: parseInt(document.getElementById("stat-pending").textContent) || 0,
      approved: parseInt(document.getElementById("stat-approved").textContent) || 0,
      denied: parseInt(document.getElementById("stat-denied").textContent) || 0,
      cancelled: parseInt(document.getElementById("stat-cancelled").textContent) || 0
    };
  }

  function getStatusColor(status) {
    const colors = {
      pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24' },
      approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
      denied: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
      cancelled: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' }
    };
    return colors[status] || colors.pending;
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

  // Event listeners
  const newRequestBtn = document.getElementById("newRequestBtn");
  if (newRequestBtn) {
    newRequestBtn.addEventListener("click", () => {
      // Ensure request_modal.js is loaded
      if (!document.querySelector('script[src*="request_modal"]')) {
        const script = document.createElement("script");
        script.src = "assets/js/request_modal.js";
        script.onload = () => {
          if (window.mountRequestModal) {
            window.mountRequestModal();
          } else {
            console.error("mountRequestModal not found after loading script.");
            if (window.Modal && window.Modal.show) {
              window.Modal.show("New request feature coming soon!", "info");
            }
          }
        };
        script.onerror = () => {
          console.error("Failed to load request_modal.js");
          if (window.Modal && window.Modal.show) {
            window.Modal.show("New request feature coming soon!", "info");
          }
        };
        document.head.appendChild(script);
      } else {
        if (window.mountRequestModal) {
          window.mountRequestModal();
        } else {
          console.warn("mountRequestModal not defined.");
          if (window.Modal && window.Modal.show) {
            window.Modal.show("New request feature coming soon!", "info");
          }
        }
      }
    });
  }

  const backBtn = document.getElementById("backBtn");
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

  // Initial load
  loadOrders(user);

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (unsubscribe) unsubscribe();
  });
}

// --- Enhanced Mount Dashboard ---
function mountDashboard(user) {
  if (!user) {
    console.error("No user provided for mountDashboard.");
    return;
  }

  try {
    // Clear existing content if needed
    const existingApp = document.querySelector(".container.app");
    if (existingApp) {
      existingApp.remove();
    }

    const dashboardHTML = renderDashboard(user);
    document.body.innerHTML = dashboardHTML;
    
    // Attach functionality after DOM update
    attachDashboard(user);
    
    // Ensure Font Awesome is loaded (if not already)
    if (!document.querySelector('link[href*="fontawesome"]')) {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
      document.head.appendChild(faLink);
    }
    
  } catch (error) {
    console.error("Error mounting dashboard:", error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error loading dashboard. Please try again.", "error");
    }
  }
}

// Expose globally
window.renderDashboard = renderDashboard;
window.attachDashboard = attachDashboard;
window.mountDashboard = mountDashboard;