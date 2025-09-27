// Enhanced pages/dashboard.js

// -- Enhanced Dashboard Rendering ---
function renderDashboard(user = { username: "Employee", firstName: "User  " }) {
  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;
  
  // Safe nav inclusion: Use global window.renderNav if available
  const navHTML = (typeof window.renderNav === 'function') ? window.renderNav() : '';
  
  return `
    ${navHTML}
    <div class="container app" style="
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(145deg, #f7fafc, #f0fdfa);
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
      ${navHTML ? 'margin-top: 80px;' : ''} /* Adjust for fixed nav height */
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
                 

// UPDATED: Attach accomplishments section (no changes needed, but included for context)
function attachAccomplishmentsSection(user) {
  const addReportBtn = document.getElementById('addReportBtn');
  if (addReportBtn) {
    addReportBtn.addEventListener('click', () => {
      if (typeof window.mountAccomplishmentForm === 'function') {
        window.mountAccomplishmentForm(user);
      } else {
        console.error('mountAccomplishmentForm not loaded');
        if (window.Modal && window.Modal.show) {
          window.Modal.show('Form not available. Please refresh.', 'warning');
        } else {
          alert('Form not available. Please refresh.');
        }
      }
    });
  }
  
  // Safe load accomplishments data (assuming mountAccomplishmentTable is defined elsewhere)
  if (typeof mountAccomplishmentTable === 'function') {
    mountAccomplishmentTable(user);
  } else {
    console.warn('mountAccomplishmentTable not defined. Skipping accomplishments load.');
    // Optional: Dynamically load script if needed
    // const script = document.createElement('script');
    // script.src = 'assets/js/accomplishment_table.js';
    // script.onload = () => mountAccomplishmentTable(user);
    // document.head.appendChild(script);
  }
}

// --- Enhanced Attach Dashboard ---
async function attachDashboard(user) {
  try {
    attachAccomplishmentsSection(user);
    
    if (!user || !user.username) {
      console.error("No user provided to attachDashboard.");
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Error: User session invalid. Redirecting to login...", "error");
      }
      setTimeout(() => {
        sessionStorage.removeItem("loggedInUser ");
        localStorage.removeItem("loggedInUser ");
        if (typeof window.mountLogin === 'function') window.mountLogin();
      }, 2000);
      return;
    }

    const ordersCol = window.db ? window.db.collection("it_service_orders") : null;
    let unsubscribe = null;
    const loadingStates = {
      stats: { pending: false, approved: false, denied: false, cancelled: false }
    };

    // Event listeners
    const newRequestBtn = document.getElementById("newRequestBtn");
    if (newRequestBtn) {
      newRequestBtn.addEventListener("click", () => {
        // Ensure request_modal.js is loaded
        if (!document.querySelector('script[src*="request_modal"]')) {
          const script = document.createElement("script");
          script.src = "assets/js/request_modal.js";
          script.onload = () => {
            if (typeof window.mountRequestModal === 'function') {
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
          if (typeof window.mountRequestModal === 'function') {
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
        try {
          // Register cleanup callback if available
          if (typeof window.registerLogoutCallback === 'function') {
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
          }

          // Use centralized logout if available
          let success = false;
          if (typeof window.logout === 'function') {
            success = await window.logout({
              customMessage: "Are you sure you want to logout from the dashboard?"
            });
          } else {
            console.warn('window.logout not defined. Using fallback logout.');
            // Fallback: Clear storage and redirect
            sessionStorage.clear();
            localStorage.clear();
            if (typeof window.mountLogin === 'function') window.mountLogin();
            success = true;
          }

          if (success){
                        // Animate logout button
            backBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
            backBtn.disabled = true;
            backBtn.style.opacity = '0.7';

            // Additional delay for UX if needed (e.g., redirect happens in logout)
            setTimeout(() => {
              if (backBtn.parentNode) {
                // Reset if still there (error case)
                backBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                backBtn.disabled = false;
                backBtn.style.opacity = '1';
              }
            }, 3000); // Reset after 3s if not cleared
          }
        } catch (error) {
          console.error('Logout error:', error);
          // Reset button on error
          backBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
          backBtn.disabled = false;
          backBtn.style.opacity = '1';
          if (window.Modal && window.Modal.show) {
            window.Modal.show('Logout failed. Please try again.', 'error');
          }
        }
      });
    }

    // Initial load (safe call to loadOrders)
    if (typeof loadOrders === 'function') {
      loadOrders(user);
    } else {
      console.warn('loadOrders not defined. Skipping requests load.');
      // Optional: Dynamically load if needed (e.g., from another script)
      // const script = document.createElement('script');
      // script.src = 'assets/js/orders_loader.js';
      // script.onload = () => loadOrders(user);
      // document.head.appendChild(script);
    }

    // Firestore listener setup (if ordersCol exists and loadOrders doesn't handle it)
    if (ordersCol && !unsubscribe) {
      // Example listener (uncomment/adapt if needed; assuming loadOrders sets it)
      // unsubscribe = ordersCol.where('uniquekey', '==', user.username).onSnapshot(
      //   (snapshot) => { /* Update UI */ },
      //   (error) => { console.error('Firestore listener error:', error); }
      // );
      console.log('Firestore listener ready (unsubscribe available for cleanup).');
    }

    // Cleanup on page unload (safe even if unsubscribe is null)
    const cleanupHandler = () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      // Additional cleanup (e.g., clear intervals)
      if (window.dashboardRefreshInterval) {
        clearInterval(window.dashboardRefreshInterval);
        window.dashboardRefreshInterval = null;
      }
    };
    window.addEventListener("beforeunload", cleanupHandler);
    // Also cleanup on module unload if possible
    if (window.addEventListener) {
      window.addEventListener('unload', cleanupHandler);
    }

  } catch (error) {
    console.error('attachDashboard error:', error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error attaching dashboard functionality. Please refresh.', 'error');
    }
  }
}

// --- Enhanced Mount Dashboard ---
function mountDashboard(user) {
  if (!user) {
    console.error("No user provided for mountDashboard.");
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error: No user session. Redirecting to login...", "error");
    }
    setTimeout(() => {
      if (typeof window.mountLogin === 'function') window.mountLogin();
    }, 1000);
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
    
    // Initial loading state for stats (remove after load)
    const statElements = document.querySelectorAll('.stat-loading');
    setTimeout(() => {
      statElements.forEach(el => el.classList.remove('stat-loading'));
    }, 2000); // Assume data loads within 2s; adjust or tie to actual load
    
    // Attach functionality after DOM update
    attachDashboard(user);
    
    // Ensure Font Awesome is loaded (updated to v6.4.0 for consistency)
    if (!document.querySelector('link[href*="fontawesome"]')) {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      faLink.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
      faLink.crossOrigin = "anonymous";
      faLink.referrerPolicy = "no-referrer";
      document.head.appendChild(faLink);
    }
    
    console.log("Dashboard mounted successfully for user:", user.username);
    
  } catch (error) {
    console.error("Error mounting dashboard:", error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Error loading dashboard. Please try again.", "error");
    } else {
      alert("Error loading dashboard. Please refresh the page.");
    }
  }
}

// Expose globally
window.renderDashboard = renderDashboard;
window.attachDashboard = attachDashboard;
window.mountDashboard = mountDashboard;

// Optional: Error boundary for dashboard module
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('dashboard.js')) {
    console.error('Dashboard Error:', {
      message: event.message,
      line: event.lineno,
      error: event.error
    });
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Dashboard encountered an error. Please refresh.', 'error');
    }
  }
});