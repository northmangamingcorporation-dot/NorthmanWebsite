// Enhanced assets/js/hr_request_modal.js - Leave & Early Rest Day Forms



// Utility function to format date for input
function formatDateForInput(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Debounce utility for performance
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

// Render Leave Request Form
function renderLeaveRequestForm(user = { username: "Employee", firstName: "", lastName: "", department: "" }) {
    
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const today = formatDateForInput(new Date());

  return `
    <div id="leaveRequestModal" class="modal-overlay leave-request-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1001;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
      overflow: auto;
    ">
      
      <div class="modal-content leave-form-content" style="
        background: linear-gradient(145deg, #ffffff, #f0fdf4);
        border-radius: 20px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 40px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.3);
        border: 1px solid rgba(34, 197, 94, 0.2);
        transform: translateY(20px);
        animation: slideIn 0.4s ease forwards;
      ">
        
        <!-- Enhanced Close Button -->
        <button id="closeLeaveModal" class="close-btn" style="
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(100, 116, 139, 0.1);
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        " onmouseover="
          this.style.background = 'rgba(239, 68, 68, 0.1)';
          this.style.color = '#ef4444';
        " onmouseout="
          this.style.background = 'rgba(100, 116, 139, 0.1)';
          this.style.color = '#64748b';
        " aria-label="Close Leave Request Form">
          <i class="fas fa-times"></i>
        </button>

        <!-- Enhanced Title -->
        <div class="form-header" style="
          text-align: center;
          margin-bottom: 32px;
          animation: logoFloat 0.6s ease forwards;
        ">
          <div style="
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
          ">
            <i class="fas fa-calendar-alt" style="font-size: 36px; color: white;"></i>
          </div>
          <h2 style="
            margin: 0 0 8px 0;
            color: #0f172a;
            font-weight: 700;
            font-size: 28px;
            background: linear-gradient(135deg, #0f172a, #22c55e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            Leave Request
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Apply for vacation, sick leave, or other time off
          </p>
        </div>

        <!-- Form -->
        <form id="leaveRequestForm" style="
          display: flex;
          flex-direction: column;
          gap: 24px;
        ">
          
          <!-- Employee Information -->
          <section class="form-section">
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Employee Name <span style="color: #ef4444;">*</span></label>
                <input type="text" name="employeeName" value="${fullName}" required data-required="true" readonly
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         background: #f8fafc;
                         color: #64748b;
                       " aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Department <span style="color: #ef4444;">*</span></label>
                <input type="text" name="department" value="${user.department || ''}" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- Leave Type -->
          <section class="form-section">
            <div class="form-group" style="display: flex; flex-direction: column;">
              <label style="
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
              ">Leave Type <span style="color: #ef4444;">*</span></label>
              <select name="leaveType" required data-required="true" style="
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.3s ease;
                background: white;
                cursor: pointer;
              " onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)';"
                 onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                 aria-required="true">
                <option value="">Select leave type...</option>
                <option value="vacation">Vacation Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="emergency">Emergency Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="bereavement">Bereavement Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="other">Other</option>
              </select>
              <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
            </div>
          </section>

          <!-- Date Range -->
          <section class="form-section">
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Start Date <span style="color: #ef4444;">*</span></label>
                <input type="date" name="startDate" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       min="${today}" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">End Date <span style="color: #ef4444;">*</span></label>
                <input type="date" name="endDate" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       min="${today}" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Total Days</label>
                <input type="text" name="totalDays" readonly value="0"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         background: #f0fdf4;
                         color: #16a34a;
                         font-weight: 700;
                       " />
              </div>
            </div>
          </section>

          <!-- Reason -->
          <section class="form-section">
            <div class="form-group" style="display: flex; flex-direction: column;">
              <label style="
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
              ">Reason <span style="color: #ef4444;">*</span></label>
              <textarea name="reason" rows="4" required data-required="true"
                        style="
                          padding: 12px 16px;
                          border: 2px solid #e2e8f0;
                          border-radius: 12px;
                          font-size: 16px;
                          transition: all 0.3s ease;
                          background: white;
                          resize: vertical;
                          min-height: 100px;
                        " onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)';"
                        onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                        placeholder="Please provide details for your leave request..."
                        maxlength="1000" aria-required="true"></textarea>
              <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
            </div>
          </section>

          <!-- Form Actions -->
          <div class="form-actions" style="
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          ">
            <button type="button" id="cancelLeaveRequest" class="btn secondary-btn" style="
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              border: 2px solid #6b7280;
              border-radius: 12px;
              background: transparent;
              color: #6b7280;
              cursor: pointer;
              transition: all 0.3s ease;
            " onmouseover="
              this.style.background = 'rgba(107, 114, 128, 0.1)';
              this.style.transform = 'translateY(-2px)';
            " onmouseout="
              this.style.background = 'transparent';
              this.style.transform = 'translateY(0)';
            ">
              <i class="fas fa-times" style="margin-right: 8px;"></i>
              Cancel
            </button>
            <button type="submit" id="submitLeaveRequest" class="btn primary-btn" disabled style="
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              border: none;
              border-radius: 12px;
              background: linear-gradient(135deg, #9ca3af, #6b7280);
              color: white;
              cursor: not-allowed;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 6px -1px rgba(156, 163, 175, 0.2);
              opacity: 0.6;
            " title="Please fill required fields to enable submission">
              <i class="fas fa-times" style="color: #ef4444;"></i>
              Complete Form First
            </button>
          </div>
        </form>

        <!-- Loading Overlay -->
        <div id="leaveFormLoading" class="loading-overlay" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          display: none;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          z-index: 10;
        ">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          ">
            <div style="
              width: 48px;
              height: 48px;
              border: 4px solid #e2e8f0;
              border-top: 4px solid #22c55e;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing your request...</p>
          </div>
        </div>
      </div>
    </div>

    ${renderHRStyles()}
  `;
}

// Render Early Rest Day Form
function renderEarlyRestForm(user = { username: "Employee", firstName: "User" }) {
  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;
  const today = formatDateForInput(new Date());
  return `
    <div id="earlyRestModal" class="modal-overlay early-rest-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1001;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
      overflow: auto;
    ">
      
      <div class="modal-content rest-form-content" style="
        background: linear-gradient(145deg, #ffffff, #fef3c7);
        border-radius: 20px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 40px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(245, 158, 11, 0.3);
        border: 1px solid rgba(245, 158, 11, 0.2);
        transform: translateY(20px);
        animation: slideIn 0.4s ease forwards;
      ">
        
        <!-- Enhanced Close Button -->
        <button id="closeRestModal" class="close-btn" style="
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(100, 116, 139, 0.1);
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        " onmouseover="
          this.style.background = 'rgba(239, 68, 68, 0.1)';
          this.style.color = '#ef4444';
        " onmouseout="
          this.style.background = 'rgba(100, 116, 139, 0.1)';
          this.style.color = '#64748b';
        " aria-label="Close Early Rest Form">
          <i class="fas fa-times"></i>
        </button>

        <!-- Enhanced Title -->
        <div class="form-header" style="
          text-align: center;
          margin-bottom: 32px;
          animation: logoFloat 0.6s ease forwards;
        ">
          <div style="
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 16px rgba(245, 158, 11, 0.3);
          ">
            <i class="fas fa-clock" style="font-size: 36px; color: white;"></i>
          </div>
          <h2 style="
            margin: 0 0 8px 0;
            color: #0f172a;
            font-weight: 700;
            font-size: 28px;
            background: linear-gradient(135deg, #0f172a, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            Early Rest Day Request
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Request early departure, late arrival, or schedule change
          </p>
        </div>

        <!-- Form -->
        <form id="earlyRestForm" style="
          display: flex;
          flex-direction: column;
          gap: 24px;
        ">
          
          <!-- Employee Information -->
          <section class="form-section">
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Employee Name <span style="color: #ef4444;">*</span></label>
                <input type="text" name="employeeName" value="${fullName}" required data-required="true" readonly
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         background: #f8fafc;
                         color: #64748b;
                       " aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Department <span style="color: #ef4444;">*</span></label>
                <input type="text" name="department" value="${user.department || ''}" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- Request Type -->
          <section class="form-section">
            <div class="form-group" style="display: flex; flex-direction: column;">
              <label style="
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
              ">Request Type <span style="color: #ef4444;">*</span></label>
              <select name="requestType" required data-required="true" style="
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.3s ease;
                background: white;
                cursor: pointer;
              " onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)';"
                 onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                 aria-required="true">
                <option value="">Select request type...</option>
                <option value="early_departure">Early Departure</option>
                <option value="late_arrival">Late Arrival</option>
                <option value="half_day">Half Day</option>
                <option value="shift_change">Shift Change Request</option>
                <option value="other">Other</option>
              </select>
              <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
            </div>
          </section>

          <!-- Date and Time -->
          <section class="form-section">
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Date <span style="color: #ef4444;">*</span></label>
                <input type="date" name="requestDate" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       min="${today}" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Time <span style="color: #ef4444;">*</span></label>
                <input type="time" name="requestTime" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- Reason -->
          <section class="form-section">
            <div class="form-group" style="display: flex; flex-direction: column;">
              <label style="
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
              ">Reason <span style="color: #ef4444;">*</span></label>
              <textarea name="reason" rows="4" required data-required="true"
                        style="
                          padding: 12px 16px;
                          border: 2px solid #e2e8f0;
                          border-radius: 12px;
                          font-size: 16px;
                          transition: all 0.3s ease;
                          background: white;
                          resize: vertical;
                          min-height: 100px;
                        " onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)';"
                        onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                        placeholder="Please provide details for your request..."
                        maxlength="1000" aria-required="true"></textarea>
              <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
            </div>
          </section>

          <!-- Form Actions -->
          <div class="form-actions" style="
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          ">
            <button type="button" id="cancelRestRequest" class="btn secondary-btn" style="
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              border: 2px solid #6b7280;
              border-radius: 12px;
              background: transparent;
              color: #6b7280;
              cursor: pointer;
              transition: all 0.3s ease;
            " onmouseover="
              this.style.background = 'rgba(107, 114, 128, 0.1)';
              this.style.transform = 'translateY(-2px)';
            " onmouseout="
              this.style.background = 'transparent';
              this.style.transform = 'translateY(0)';
            ">
              <i class="fas fa-times" style="margin-right: 8px;"></i>
              Cancel
            </button>
            <button type="submit" id="submitRestRequest" class="btn primary-btn" disabled style="
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              border: none;
              border-radius: 12px;
              background: linear-gradient(135deg, #9ca3af, #6b7280);
              color: white;
              cursor: not-allowed;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 6px -1px rgba(156, 163, 175, 0.2);
              opacity: 0.6;
            " title="Please fill required fields to enable submission">
              <i class="fas fa-times" style="color: #ef4444;"></i>
              Complete Form First
            </button>
          </div>
        </form>

        <!-- Loading Overlay -->
        <div id="restFormLoading" class="loading-overlay" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          display: none;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          z-index: 10;
        ">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          ">
            <div style="
              width: 48px;
              height: 48px;
              border: 4px solid #e2e8f0;
              border-top: 4px solid #f59e0b;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing your request...</p>
          </div>
        </div>
      </div>
    </div>

    ${renderHRStyles()}
  `;
}

// Render HR Styles (shared for both modals)
function renderHRStyles() {
  return `
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
      
      @keyframes logoFloat {
        0% { transform: translateY(20px) scale(0.9); opacity: 0; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Modal Overlay */
      .modal-overlay {
        z-index: 1001;
      }
      
      /* Form Sections */
      .form-section {
        padding: 20px 0;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .form-section:last-child {
        border-bottom: none;
      }
      
      /* Form Grid Responsiveness */
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
      
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .modal-content {
          padding: 24px 20px;
          margin: 16px;
        }
        
        .form-header h2 {
          font-size: 24px;
        }
        
        .form-actions {
          flex-direction: column;
        }
        
        .btn {
          width: 100%;
        }
      }
      
      /* Field Error Display */
      .field-error {
        color: #ef4444;
        font-size: 14px;
        margin-top: 4px;
        display: none;
        min-height: 18px;
      }
      
      .field-error.show {
        display: block;
      }
      
      /* Input Focus States */
      input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #22c55e;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
      }
      
      /* Button States */
      .btn.primary-btn:not(:disabled) {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      }
      
      .btn.primary-btn:not(:disabled):hover {
        background: linear-gradient(135deg, #16a34a, #15803d);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
      }
      
      .btn.secondary-btn:hover {
        background: rgba(107, 114, 128, 0.1);
        transform: translateY(-2px);
      }
      
      /* Loading Overlay */
      .loading-overlay {
        backdrop-filter: blur(2px);
      }
      
      /* Success/Error Messages */
      .form-message {
        padding: 12px 16px;
        border-radius: 8px;
        margin: 16px 0;
        font-weight: 500;
        display: none;
      }
      
      .form-message.success {
        background: #f0fdf4;
        color: #16a34a;
        border: 1px solid #22c55e;
      }
      
      .form-message.error {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #ef4444;
      }
      
      .form-message.show {
        display: block;
        animation: slideIn 0.3s ease;
      }
      
      /* Character Counter */
      .char-counter {
        font-size: 12px;
        color: #9ca3af;
        text-align: right;
        margin-top: 4px;
      }
      
      .char-counter.warning {
        color: #f59e0b;
      }
      
      .char-counter.danger {
        color: #ef4444;
      }
    </style>
  `;
}

// Show Leave Request Modal
function showLeaveRequestModal() {
  // Check if user is already logged in with better UX
  const user = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  const user = JSON.parse(loggedInUser);
  if (document.getElementById('leaveRequestModal')) {
    document.getElementById('leaveRequestModal').remove();
  }
  
  document.body.insertAdjacentHTML('beforeend', renderLeaveRequestForm(user));
  
  // Initialize form functionality after DOM insertion
  setTimeout(() => initializeLeaveForm(), 100);
}

// Show Early Rest Request Modal
function showEarlyRestModal() {
  // Check if user is already logged in with better UX
  const user = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  if (document.getElementById('earlyRestModal')) {
    document.getElementById('earlyRestModal').remove();
  }
  
  document.body.insertAdjacentHTML('beforeend', renderEarlyRestForm(user));
  
  // Initialize form functionality after DOM insertion
  setTimeout(() => initializeEarlyRestForm(), 100);
}

// Initialize Leave Form (Event Listeners & Validation)
function initializeLeaveForm() {
  const modal = document.getElementById('leaveRequestModal');
  const form = document.getElementById('leaveRequestForm');
  const submitBtn = document.getElementById('submitLeaveRequest');
  const cancelBtn = document.getElementById('cancelLeaveRequest');
  const closeBtn = document.getElementById('closeLeaveModal');
  const loadingOverlay = document.getElementById('leaveFormLoading');
  const startDateInput = form.querySelector('input[name="startDate"]');
  const endDateInput = form.querySelector('input[name="endDate"]');
  const totalDaysInput = form.querySelector('input[name="totalDays"]');
  const leaveTypeSelect = form.querySelector('select[name="leaveType"]');
  const reasonTextarea = form.querySelector('textarea[name="reason"]');

  if (!form) return;

  // Close modal handlers
  function closeModal() {
    if (modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }
  }

  cancelBtn?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Date change handler for total days calculation
  function calculateTotalDays() {
    const start = startDateInput.value;
    const end = endDateInput.value;
    
    if (start && end && new Date(end) >= new Date(start)) {
      const diffTime = Math.abs(new Date(end) - new Date(start));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
      totalDaysInput.value = diffDays;
      return diffDays;
    }
    
    totalDaysInput.value = '0';
    return 0;
  }

  startDateInput?.addEventListener('change', calculateTotalDays);
  endDateInput?.addEventListener('change', calculateTotalDays);

  // Character counter for reason
  function updateCharCounter() {
    const maxLength = 1000;
    const length = reasonTextarea.value.length;
    const counter = reasonTextarea.parentElement.querySelector('.char-counter') || 
                    document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = `${length}/${maxLength}`;
    
    if (!reasonTextarea.parentElement.querySelector('.char-counter')) {
      reasonTextarea.parentElement.appendChild(counter);
    }
    
    if (length > maxLength * 0.9) counter.classList.add('warning');
    else if (length > maxLength * 0.95) counter.classList.add('danger');
    else counter.classList.remove('warning', 'danger');
  }

  reasonTextarea?.addEventListener('input', debounce(updateCharCounter, 300));

  // Form validation
  function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[data-required="true"]');
    
    requiredFields.forEach(field => {
      const fieldContainer = field.closest('.form-group');
      const errorEl = fieldContainer.querySelector('.field-error');
      
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        errorEl.textContent = 'This field is required.';
        errorEl.classList.add('show');
      } else {
        field.style.borderColor = '#22c55e';
        field.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
        errorEl.classList.remove('show');
      }
    });

    // Additional validations
    const start = startDateInput.value;
    const end = endDateInput.value;
    if (start && end && new Date(end) < new Date(start)) {
      isValid = false;
      const errorEl = endDateInput.closest('.form-group').querySelector('.field-error');
      errorEl.textContent = 'End date must be after start date.';
      errorEl.classList.add('show');
    }

    // Enable/disable submit button
    if (isValid && calculateTotalDays() > 0 && leaveTypeSelect.value && reasonTextarea.value.trim()) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Complete Form First';
      submitBtn.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    }

    return isValid;
  }

  // Real-time validation
  form.addEventListener('input', debounce(validateForm, 300));
  form.addEventListener('change', validateForm);

  // Initial validation
  validateForm();

  // Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  const formData = new FormData(form);
  const leaveData = {
    username: window.currentUser?.username || '',
    employeeName: formData.get('employeeName'),
    department: formData.get('department'),
    type: formData.get('leaveType'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    totalDays: parseInt(formData.get('totalDays')),
    reason: formData.get('reason').trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    submittedBy: window.currentUser?.uid || ''
  };

  // Show loading
  loadingOverlay.style.display = 'flex';
  submitBtn.disabled = true;

  try {
    if (!window.db) {
      throw new Error('Database not initialized');
    }

    // Save to Firestore
    const docRef = await window.db.collection('leave_requests').add(leaveData);
    const savedId = docRef.id;

    // ✅ Send Telegram notification (group + optional DM)
    try {
      if (window.TelegramConnect && typeof window.TelegramConnect.sendRequest === "function") {
        await window.TelegramConnect.sendRequest(
          { ...leaveData, id: savedId },
          "Leave Request"
        );
        console.log("Telegram notification sent for leave request.");
      } else {
        console.warn("TelegramConnect not available.");
      }
    } catch (tgErr) {
      console.error("Failed to send Telegram notification:", tgErr);
    }

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'form-message success show';
    successMsg.innerHTML = `
      <i class="fas fa-check-circle" style="margin-right: 8px; color: #16a34a;"></i>
      Leave request submitted successfully! It will be reviewed by HR.
    `;
    form.insertBefore(successMsg, form.firstElementChild);
    
    // Reset form and close after delay
    setTimeout(() => {
      form.reset();
      totalDaysInput.value = '0';
      closeModal();
      if (typeof loadLeaveRequests === 'function') loadLeaveRequests(); // Refresh dashboard
    }, 2000);

  } catch (error) {
    console.error('Error submitting leave request:', error);
    
    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-message error show';
    errorMsg.innerHTML = `
      <i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #dc2626;"></i>
      Error submitting request. Please try again.
    `;
    form.insertBefore(errorMsg, form.firstElementChild);
    
    setTimeout(() => errorMsg.remove(), 5000);
  } finally {
    loadingOverlay.style.display = 'none';
    submitBtn.disabled = false;
  }
});
}

// Initialize Early Rest Form (Event Listeners & Validation)
function initializeEarlyRestForm() {
  const modal = document.getElementById('earlyRestModal');
  const form = document.getElementById('earlyRestForm');
  const submitBtn = document.getElementById('submitRestRequest');
  const cancelBtn = document.getElementById('cancelRestRequest');
  const closeBtn = document.getElementById('closeRestModal');
  const loadingOverlay = document.getElementById('restFormLoading');
  const dateInput = form.querySelector('input[name="requestDate"]');
  const timeInput = form.querySelector('input[name="requestTime"]');
  const requestTypeSelect = form.querySelector('select[name="requestType"]');
  const reasonTextarea = form.querySelector('textarea[name="reason"]');

  if (!form) return;

  // Close modal handlers
  function closeModal() {
    if (modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }
  }

  cancelBtn?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Character counter for reason
  function updateCharCounter() {
    const maxLength = 1000;
    const length = reasonTextarea.value.length;
    const counter = reasonTextarea.parentElement.querySelector('.char-counter') || 
                    document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = `${length}/${maxLength}`;
    
    if (!reasonTextarea.parentElement.querySelector('.char-counter')) {
      reasonTextarea.parentElement.appendChild(counter);
    }
    
    if (length > maxLength * 0.9) counter.classList.add('warning');
    else if (length > maxLength * 0.95) counter.classList.add('danger');
    else counter.classList.remove('warning', 'danger');
  }

  reasonTextarea?.addEventListener('input', debounce(updateCharCounter, 300));

  // Form validation
  function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[data-required="true"]');
    
    requiredFields.forEach(field => {
      const fieldContainer = field.closest('.form-group');
      const errorEl = fieldContainer.querySelector('.field-error');
      
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        errorEl.textContent = 'This field is required.';
        errorEl.classList.add('show');
      } else {
        field.style.borderColor = '#f59e0b';
               field.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
        errorEl.classList.remove('show');
      }
    });

    // Enable/disable submit button
    if (
      isValid &&
      dateInput.value &&
      timeInput.value &&
      requestTypeSelect.value &&
      reasonTextarea.value.trim()
    ) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
      submitBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Complete Form First';
      submitBtn.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    }

    return isValid;
  }

  // Real-time validation
  form.addEventListener('input', debounce(validateForm, 300));
  form.addEventListener('change', validateForm);

  // Initial validation
  validateForm();

  // Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const formData = new FormData(form);
  const restData = {
    username: window.currentUser?.username || '',
    employeeName: formData.get('employeeName'),
    department: formData.get('department'),
    type: formData.get('requestType'),
    date: formData.get('requestDate'),
    time: formData.get('requestTime'),
    reason: formData.get('reason').trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    submittedBy: window.currentUser?.uid || ''
  };

  // Show loading
  loadingOverlay.style.display = 'flex';
  submitBtn.disabled = true;

  try {
    if (!window.db) {
      throw new Error('Database not initialized');
    }

    const docRef = await window.db.collection('early_rest_requests').add(restData);

    // ✅ Notify Telegram (HR + dept head)
    if (window.TelegramConnect && typeof window.TelegramConnect.sendRequest === 'function') {
      await window.TelegramConnect.sendRequest('Early Rest Day', { id: docRef.id, ...restData });
    }

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'form-message success show';
    successMsg.innerHTML = `
      <i class="fas fa-check-circle" style="margin-right: 8px; color: #16a34a;"></i>
      Early rest request submitted successfully! It will be reviewed by HR.
    `;
    form.insertBefore(successMsg, form.firstElementChild);

    // Reset form and close after delay
    setTimeout(() => {
      form.reset();
      closeModal();
      if (typeof loadEarlyRestRequests === 'function') loadEarlyRestRequests(); // Refresh dashboard
    }, 2000);

  } catch (error) {
    console.error('Error submitting early rest request:', error);

    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-message error show';
    errorMsg.innerHTML = `
      <i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #dc2626;"></i>
      Error submitting request. Please try again.
    `;
    form.insertBefore(errorMsg, form.firstElementChild);

    setTimeout(() => errorMsg.remove(), 5000);
  } finally {
    loadingOverlay.style.display = 'none';
    submitBtn.disabled = false;
  }
});
}