// Enhanced pages/dashboard.js

// -- Enhanced Dashboard Rendering ---
function renderDashboard(user = { username: "Employee", firstName: "User " }) {
  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;
  
  // Safe renderNav check
  const navHTML = (typeof renderNav === 'function') ? renderNav() : '';
  
  return `
    ${navHTML}
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
            <div id="stat-pending" class="stat-loading" style="
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
            <div id="stat-approved" class="stat-loading" style="
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
            <div id="stat-denied" class="stat-loading" style="
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
            <div id="stat-cancelled" class="stat-loading" style="
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
             