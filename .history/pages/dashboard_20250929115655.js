// Enhanced pages/dashboard.js with HR Features

// -- Enhanced Dashboard Rendering ---
function renderDashboard(user = { username: "Employee", firstName: "User" }) {
  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
    ${renderNav()}
    <div class="container app" style="
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(145deg, #f0f9ff, #f0fdfa);
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    ">
      <main class="main" style="
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        padding: 40px;
        margin-bottom: 20px;
        position: relative;
        overflow: hidden;
      ">
        
        <!-- Decorative Background Elements -->
        <div style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        "></div>
        <div style="
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        "></div>

        <!-- Enhanced Header -->
        <div class="header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
          position: relative;
          z-index: 1;
        ">
          <div class="header-left" style="
            display: flex;
            flex-direction: column;
            gap: 8px;
          ">
            <h1 style="
              margin: 0;
              color: #0f172a;
              font-size: 36px;
              font-weight: 800;
              background: linear-gradient(135deg, #0f172a, #3b82f6, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              letter-spacing: -0.5px;
            ">
              Dashboard
            </h1>
            <p style="
              margin: 0;
              color: #64748b;
              font-size: 18px;
              font-weight: 600;
            ">
              Welcome back, ${fullName}! 👋
            </p>
            <p style="
              margin: 0;
              color: #94a3b8;
              font-size: 14px;
              font-weight: 500;
            ">
              ${currentDate}
            </p>
          </div>
          <div class="header-right" style="
            display: flex;
            align-items: center;
            gap: 16px;
          ">
            <!-- Quick Actions Dropdown -->
            <div class="quick-actions" style="position: relative;">
              <button id="quickActionsBtn" style="
                padding: 12px 16px;
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: #475569;
              " onmouseover="this.style.borderColor='#3b82f6'; this.style.background='#f8fafc';"
                 onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white';">
                <i class="fas fa-bolt"></i>
                <span>Quick Actions</span>
                <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
              </button>
            </div>

            <!-- User Profile -->
            <div class="user-info" style="
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 20px;
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
              border-radius: 16px;
              border: 2px solid rgba(59, 130, 246, 0.2);
              cursor: pointer;
              transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.2)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              <img src="https://i.pravatar.cc/48" alt="Avatar" style="
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              "/>
              <div style="display: flex; flex-direction: column;">
                <span style="
                  color: #0f172a;
                  font-weight: 700;
                  font-size: 14px;
                ">${fullName}</span>
                <span style="
                  color: #64748b;
                  font-size: 12px;
                  font-weight: 500;
                ">Employee</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Stats Grid with Animations -->
        <div class="stats-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        ">
          <!-- IT Requests Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border: 2px solid rgba(251, 146, 60, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(251, 146, 60, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(251, 146, 60, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #fb923c, #f97316);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(251, 146, 60, 0.3);
              ">
                <i class="fas fa-laptop-code"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(251, 146, 60, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #ea580c;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Active</div>
            </div>
            <div style="color: #78350f; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              IT Service Requests
            </div>
            <div id="stat-pending" style="
              font-size: 36px;
              font-weight: 800;
              color: #ea580c;
              margin: 0;
              line-height: 1;
            ">0</div>
            <div style="color: #92400e; font-size: 12px; margin-top: 8px; font-weight: 500;">
              Pending approval
            </div>
          </div>

          <!-- Leave Requests Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid rgba(34, 197, 94, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(34, 197, 94, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(34, 197, 94, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #22c55e, #16a34a);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
              ">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(34, 197, 94, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #15803d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Balance</div>
            </div>
            <div style="color: #14532d; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              Leave Credits
            </div>
            <div id="stat-leave-balance" style="
              font-size: 36px;
              font-weight: 800;
              color: #16a34a;
              margin: 0;
              line-height: 1;
            ">15</div>
            <div style="color: #166534; font-size: 12px; margin-top: 8px; font-weight: 500;">
              Days available
            </div>
          </div>

          <!-- Accomplishments Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(59, 130, 246, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(59, 130, 246, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
              ">
                <i class="fas fa-trophy"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(59, 130, 246, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #1e40af;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">This Month</div>
            </div>
            <div style="color: #1e3a8a; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              Accomplishments
            </div>
            <div id="stat-accomplishments" style="
              font-size: 36px;
              font-weight: 800;
              color: #2563eb;
              margin: 0;
              line-height: 1;
            ">0</div>
            <div style="color: #1e40af; font-size: 12px; margin-top: 8px; font-weight: 500;">
              Reports submitted
            </div>
          </div>

          <!-- Attendance Stats -->
          <div class="stat-card" style="
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
            border: 2px solid rgba(168, 85, 247, 0.3);
            border-radius: 16px;
            padding: 28px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          " onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(168, 85, 247, 0.25)';"
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
            <div style="
              position: absolute;
              top: -20px;
              right: -20px;
              width: 100px;
              height: 100px;
              background: rgba(168, 85, 247, 0.1);
              border-radius: 50%;
              filter: blur(30px);
            "></div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div class="stat-icon" style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #a855f7, #9333ea);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 8px 16px rgba(168, 85, 247, 0.3);
              ">
                <i class="fas fa-user-check"></i>
              </div>
              <div style="
                padding: 6px 12px;
                background: rgba(168, 85, 247, 0.2);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: #7e22ce;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Rate</div>
            </div>
            <div style="color: #581c87; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
              Attendance
            </div>
            <div id="stat-attendance" style="
              font-size: 36px;
              font-weight: 800;
              color: #9333ea;
              margin: 0;
              line-height: 1;
            ">98%</div>
            <div style="color: #6b21a8; font-size: 12px; margin-top: 8px; font-weight: 500;">
              This month
            </div>
          </div>
        </div>

        <!-- Quick Action Cards -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        ">
          <!-- IT Service Request -->
          <div class="action-card" onclick="document.getElementById('newRequestBtn').click()" style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 16px;
          " onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(59, 130, 246, 0.15)';"
             onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            ">
              <i class="fas fa-laptop-code" style="color: white; font-size: 24px;"></i>
            </div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                IT Service Request
              </h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Request IT support or services
              </p>
            </div>
            <i class="fas fa-arrow-right" style="color: #cbd5e1; margin-left: auto;"></i>
          </div>

          <!-- Leave Request -->
          <div class="action-card" onclick="document.getElementById('leaveRequestBtn').click()" style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 16px;
          " onmouseover="this.style.borderColor='#22c55e'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(34, 197, 94, 0.15)';"
             onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #22c55e, #16a34a);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            ">
              <i class="fas fa-calendar-alt" style="color: white; font-size: 24px;"></i>
            </div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                Request Leave
              </h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Apply for vacation or sick leave
              </p>
            </div>
            <i class="fas fa-arrow-right" style="color: #cbd5e1; margin-left: auto;"></i>
          </div>

          <!-- Early Rest Day -->
          <div class="action-card" onclick="document.getElementById('earlyRestBtn').click()" style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 16px;
          " onmouseover="this.style.borderColor='#f59e0b'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(245, 158, 11, 0.15)';"
             onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #f59e0b, #d97706);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            ">
              <i class="fas fa-clock" style="color: white; font-size: 24px;"></i>
            </div>
            <div>
              <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
                Early Rest Day
              </h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Request early departure or rest
              </p>
            </div>
            <i class="fas fa-arrow-right" style="color: #cbd5e1; margin-left: auto;"></i>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs-container" style="
          margin-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
          position: relative;
          z-index: 1;
        ">
          <div class="tabs" style="
            display: flex;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
          ">
            <button class="tab-btn active" data-tab="it-requests" style="
              padding: 12px 24px;
              background: transparent;
              border: none;
              border-bottom: 3px solid #3b82f6;
              color: #3b82f6;
              font-weight: 700;
              font-size: 15px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
            ">
              <i class="fas fa-laptop-code"></i> IT Requests
            </button>
            <button class="tab-btn" data-tab="hr-requests" style="
              padding: 12px 24px;
              background: transparent;
              border: none;
              border-bottom: 3px solid transparent;
              color: #64748b;
              font-weight: 600;
              font-size: 15px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
            " onmouseover="if(!this.classList.contains('active')) this.style.color='#3b82f6';"
               onmouseout="if(!this.classList.contains('active')) this.style.color='#64748b';">
              <i class="fas fa-briefcase"></i> HR Requests
            </button>
            <button class="tab-btn" data-tab="accomplishments" style="
              padding: 12px 24px;
              background: transparent;
              border: none;
              border-bottom: 3px solid transparent;
              color: #64748b;
              font-weight: 600;
              font-size: 15px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
            " onmouseover="if(!this.classList.contains('active')) this.style.color='#3b82f6';"
               onmouseout="if(!this.classList.contains('active')) this.style.color='#64748b';">
              <i class="fas fa-trophy"></i> Accomplishments
            </button>
          </div>
        </div>

        <!-- Tab Contents -->
        <div class="tab-content active" id="it-requests-content" style="
          animation: fadeIn 0.5s ease;
        ">
          ${renderITRequestsSection()}
        </div>

        <div class="tab-content" id="hr-requests-content" style="
          display: none;
          animation: fadeIn 0.5s ease;
        ">
          ${renderHRRequestsSection()}
        </div>

        <div class="tab-content" id="accomplishments-content" style="
          display: none;
          animation: fadeIn 0.5s ease;
        ">
          ${renderAccomplishmentsSection()}
        </div>

        <!-- Hidden Action Buttons -->
        <button id="newRequestBtn" style="display: none;"></button>
        <button id="leaveRequestBtn" style="display: none;"></button>
        <button id="earlyRestBtn" style="display: none;"></button>
        <button id="addReportBtn" style="display: none;"></button>

        <!-- Enhanced Logout Button -->
        <div style="text-align: center; margin-top: 40px;">
          <button id="backBtn" class="btn secondary-btn" style="
            padding: 14px 40px;
            font-size: 16px;
            font-weight: 700;
            border: 2px solid #ef4444;
            border-radius: 14px;
            background: transparent;
            color: #ef4444;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          " onmouseover="
            this.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            this.style.color = 'white';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
          " onmouseout="
            this.style.background = 'transparent';
            this.style.color = '#ef4444';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
          ">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </main>
    </div>

    ${renderStyles()}
  `;
}

// Render IT Requests Section
function renderITRequestsSection() {
  return `
    <div class="requests-section" style="
      background: white;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      ">
        <div>
          <h3 style="
            margin: 0 0 4px 0;
            color: #0f172a;
            font-size: 24px;
            font-weight: 700;
          ">
            IT Service Requests
          </h3>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Track your IT support tickets and requests
          </p>
        </div>
        <button onclick="document.getElementById('newRequestBtn').click()" class="btn primary-btn" style="
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        " onmouseover="
          this.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
        " onmouseout="
          this.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        ">
          <i class="fas fa-plus-circle"></i>
          New Request
        </button>
      </div>

      <div class="table-container" style="
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
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
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Type</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Details</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
            </tr>
          </thead>
          <tbody id="requestsTable">
            <tr class="no-data-row">
              <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                  <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #e0e7ff, #dbeafe);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <i class="fas fa-inbox" style="font-size: 36px; color: #3b82f6;"></i>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                      No IT requests yet
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                      Click "New Request" to create your first IT service request
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Render HR Requests Section
function renderHRRequestsSection() {
  return `
    <div class="hr-requests-section">
      <!-- Leave Requests -->
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
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        ">
          <div>
            <h3 style="
              margin: 0 0 4px 0;
              color: #0f172a;
              font-size: 24px;
              font-weight: 700;
            ">
              Leave Requests
            </h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Manage your vacation and sick leave applications
            </p>
          </div>
          <button onclick="document.getElementById('leaveRequestBtn').click()" style="
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          " onmouseover="
            this.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
          " onmouseout="
            this.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
          ">
            <i class="fas fa-calendar-plus"></i>
            Request Leave
          </button>
        </div>

        <div class="table-container" style="
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            background: white;
            min-width: 800px;
          ">
            <thead style="
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              border-bottom: 2px solid #e2e8f0;
            ">
              <tr>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Type</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Start Date</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">End Date</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Days</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
              </tr>
            </thead>
            <tbody id="leaveRequestsTable">
              <tr class="no-data-row">
                <td colspan="6" style="padding: 60px 20px; text-align: center; border: none;">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                    <div style="
                      width: 80px;
                      height: 80px;
                      background: linear-gradient(135deg, #dcfce7, #d1fae5);
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      <i class="fas fa-calendar-alt" style="font-size: 36px; color: #22c55e;"></i>
                    </div>
                    <div>
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                        No leave requests yet
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                        Click "Request Leave" to apply for vacation or sick leave
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Early Rest Day Requests -->
      <div style="
        background: white;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        ">
          <div>
            <h3 style="
              margin: 0 0 4px 0;
              color: #0f172a;
              font-size: 24px;
              font-weight: 700;
            ">
              Early Rest Day Requests
            </h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Request early departure or rest day adjustments
            </p>
          </div>
          <button onclick="document.getElementById('earlyRestBtn').click()" style="
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          " onmouseover="
            this.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.4)';
          " onmouseout="
            this.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
          ">
            <i class="fas fa-clock"></i>
            Request Early Rest
          </button>
        </div>

        <div class="table-container" style="
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
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
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Time</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Reason</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
                <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
              </tr>
            </thead>
            <tbody id="earlyRestTable">
              <tr class="no-data-row">
                <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                    <div style="
                      width: 80px;
                      height: 80px;
                      background: linear-gradient(135deg, #fef3c7, #fde68a);
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      <i class="fas fa-clock" style="font-size: 36px; color: #f59e0b;"></i>
                    </div>
                    <div>
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                        No early rest requests yet
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                        Click "Request Early Rest" to apply for early departure
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Render Accomplishments Section
function renderAccomplishmentsSection() {
  return `
    <div class="accomplishments-section" style="
      background: white;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      ">
        <div>
          <h3 style="
            margin: 0 0 4px 0;
            color: #0f172a;
            font-size: 24px;
            font-weight: 700;
          ">
            My Accomplishments
          </h3>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Track and showcase your achievements and completed tasks
          </p>
        </div>
        <button onclick="document.getElementById('addReportBtn').click()" style="
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        " onmouseover="
          this.style.background = 'linear-gradient(135deg, #9333ea, #7e22ce)';
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.4)';
        " onmouseout="
          this.style.background = 'linear-gradient(135deg, #a855f7, #9333ea)';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
        ">
          <i class="fas fa-plus-circle"></i>
          Add Report
        </button>
      </div>

      <div class="table-container" style="
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      ">
        <table style="
          width: 100%;
          border-collapse: collapse;
          background: white;
          min-width: 900px;
        ">
          <thead style="
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-bottom: 2px solid #e2e8f0;
          ">
            <tr>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Report</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Photos</th>
              <th style="text-align: left; padding: 18px 16px; color: #475569; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Action</th>
            </tr>
          </thead>
          <tbody id="accomplishmentsTable">
            <tr class="no-data-row">
              <td colspan="6" style="padding: 60px 20px; text-align: center; border: none;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                  <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #e0e7ff, #ddd6fe);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <i class="fas fa-trophy" style="font-size: 36px; color: #a855f7;"></i>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                      No accomplishments yet
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                      Click "Add Report" to document your first accomplishment
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Render Styles
function renderStyles() {
  return `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      /* Scrollbar Styling */
      .tabs::-webkit-scrollbar {
        display: none;
      }

      .table-container::-webkit-scrollbar {
        height: 8px;
      }

      .table-container::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }

      .table-container::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }

      .table-container::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      
      /* Responsive Design */
      @media (max-width: 1024px) {
        .container.app {
          padding: 16px;
        }
        
        .main {
          padding: 32px 24px;
        }
        
        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }
        
        .header-right {
          width: 100%;
          justify-content: space-between;
        }
      }

      @media (max-width: 768px) {
        .main {
          padding: 24px 16px;
        }
        
        .header h1 {
          font-size: 28px;
        }
        
        .header p {
          font-size: 16px;
        }
        
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .stat-card {
          padding: 20px;
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          font-size: 20px;
        }
        
        .stat-card > div:nth-child(3) {
          font-size: 28px;
        }
        
        .action-card {
          padding: 20px;
        }

        .quick-actions {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        .header-right {
          flex-direction: column;
          width: 100%;
        }
        
        .user-info {
          width: 100%;
          justify-content: center;
        }
        
        .action-card {
          flex-direction: column;
          text-align: center;
        }
        
        .action-card i.fa-arrow-right {
          display: none;
        }
      }
      
      /* Enhanced table row hover effects */
      tbody tr:not(.no-data-row) {
        transition: all 0.3s ease;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
      }
      
      tbody tr:not(.no-data-row):hover {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(147, 51, 234, 0.03));
        transform: translateX(4px);
        box-shadow: -4px 0 0 #3b82f6;
      }
      
      tbody tr:last-child {
        border-bottom: none;
      }
      
      /* Status badges */
      .status-badge {
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline-block;
      }
      
      .status-pending { background: rgba(251, 191, 36, 0.15); color: #d97706; border: 1px solid rgba(251, 191, 36, 0.3); }
      .status-approved { background: rgba(34, 197, 94, 0.15); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.3); }
      .status-denied { background: rgba(239, 68, 68, 0.15); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.3); }
      .status-cancelled { background: rgba(107, 114, 128, 0.15); color: #4b5563; border: 1px solid rgba(107, 114, 128, 0.3); }
      
      /* Button states */
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        filter: grayscale(50%);
      }
      
      /* Tab styling */
      .tab-content {
        animation: fadeIn 0.5s ease;
      }
      
      .tab-btn.active {
        border-bottom-color: #3b82f6;
        color: #3b82f6;
      }

      /* Photo gallery */
      .photo-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
      }
      
      .photo-item {
        margin: 8px;
        text-align: center;
        max-width: 200px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        background: white;
        transition: all 0.3s ease;
      }
      
      .photo-item:hover {
        border-color: #3b82f6;
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
      }
      
      .photo-item img {
        width: 100%;
        max-width: 200px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
    </style>
  `;
}