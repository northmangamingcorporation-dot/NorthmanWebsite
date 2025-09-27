// Enhanced assets/js/travel_order_form_modal.js - FIXED VERSION

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

// Enhanced rendering with modern UI
function renderTravelOrderForm(user = { username: "Employee", firstName: "", lastName: "", department: "" }) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const today = formatDateForInput(new Date());

  return `
    <div id="travelOrderModal" class="modal-overlay travel-order-modal" style="
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
      
      <div class="modal-content travel-form-content" style="
        background: linear-gradient(145deg, #ffffff, #f8fafc);
        border-radius: 20px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 40px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(226, 232, 240, 0.8);
        transform: translateY(20px);
        animation: slideIn 0.4s ease forwards;
      ">
        
        <!-- Enhanced Close Button -->
        <button id="closeTravelOrderModal" class="close-btn" style="
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
        " aria-label="Close Travel Order Form">
          <i class="fas fa-times"></i>
        </button>

        <!-- Enhanced Title -->
        <div class="form-header" style="
          text-align: center;
          margin-bottom: 32px;
          animation: logoFloat 0.6s ease forwards;
        ">
          <h2 style="
            margin: 0 0 8px 0;
            color: #0f172a;
            font-weight: 700;
            font-size: 28px;
            background: linear-gradient(135deg, #0f172a, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            Travel Order Request
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Fill out the details for your official travel authorization
          </p>
        </div>

        <!-- Form -->
        <form id="travelOrderForm" style="
          display: flex;
          flex-direction: column;
          gap: 32px;
        ">
          
          <!-- SECTION 1: Employee Information -->
          <section class="form-section" style="
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 24px;
          ">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-user" style="color: #3b82f6; margin-right: 8px;"></i>
              Employee Information
            </h3>
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Employee Name <span style="color: #ef4444;">*</span></label>
                <input type="text" name="employeeName" value="${fullName}" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       aria-required="true" />
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
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Date Filed <span style="color: #ef4444;">*</span></label>
                <input type="date" name="dateFiled" value="${today}" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       min="${today}" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- SECTION 2: Travel Details -->
          <section class="form-section" style="
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 24px;
          ">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-map-marker-alt" style="color: #3b82f6; margin-right: 8px;"></i>
              Travel Details
            </h3>
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Travel Date <span style="color: #ef4444;">*</span></label>
                <input type="date" name="travelDate" required data-required="true"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
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
                ">Travel From <span style="color: #ef4444;">*</span></label>
                <input type="text" name="travelFrom" data-required="true" required
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Office Location" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Travel To <span style="color: #ef4444;">*</span></label>
                <input type="text" name="travelTo" data-required="true" required
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Client Meeting Venue" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- SECTION 3: Schedule -->
          <section class="form-section" style="
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 24px;
          ">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-clock" style="color: #3b82f6; margin-right: 8px;"></i>
              Schedule
            </h3>
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Time Out</label>
                <input type="time" name="timeOut" data-required="false"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Time In</label>
                <input type="time" name="timeIn" data-required="false"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- SECTION 4: Driver & Reliever -->
          <section class="form-section" style="
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 24px;
          ">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-car" style="color: #3b82f6; margin-right: 8px;"></i>
              Driver & Reliever
            </h3>
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Driver's Name</label>
                <input type="text" name="driversName" data-required="false"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., John Doe" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Reliever's Name</label>
                <input type="text" name="relieversName" data-required="false"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Jane Smith" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- SECTION 5: Passengers -->
          <section class="form-section" style="
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 24px;
          ">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-users" style="color: #3b82f6; margin-right: 8px;"></i>
              Passengers
            </h3>
            <div id="passengersWrapper" class="passengers-wrapper" style="
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 16px;
            ">
              <div class="passenger-row" style="
                display: flex;
                gap: 12px;
                align-items: center;
              ">
                <input type="text" name="passenger[]" placeholder="Enter passenger name (optional)" data-required="false"
                       style="
                         flex: 1;
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       maxlength="100" />
                <button type="button" class="remove-passenger" style="
                  padding: 12px;
                  border: none;
                  background: rgba(239, 68, 68, 0.1);
                  color: #ef4444;
                  border-radius: 12px;
                  cursor: pointer;
                  font-size: 16px;
                  transition: all 0.3s ease;
                  width: 44px;
                  height: 44px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                " onmouseover="this.style.background='rgba(239, 68, 68, 0.2)';"
                   onmouseout="this.style.background='rgba(239, 68, 68, 0.1)';"
                   aria-label="Remove passenger">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <button type="button" id="addPassengerBtn" class="add-btn" style="
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: 600;
              font-size: 16px;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              margin: 0 auto;
              box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
            " onmouseover="
              this.style.transform = 'translateY(-2px)';
              this.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.3)';
            " onmouseout="
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.2)';
            ">
              <i class="fas fa-plus"></i>
              Add Passenger
            </button>
            <div id="passengersError" class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 8px; text-align: center; display: none;"></div>
          </section>

          <!-- SECTION 6: Vehicle & Purpose -->
          <section class="form-section">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-car-side" style="color: #3b82f6; margin-right: 8px;"></i>
              Vehicle & Purpose
            </h3>
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
            ">
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Car Unit / Plate #</label>
                <input type="text" name="carUnit" data-required="false"
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., ABC-123" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Purpose <span style="color: #ef4444;">*</span></label>
                <textarea name="purpose" rows="4" required data-required="true"
                          style="
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 16px;
                            transition: all 0.3s ease;
                            background: white;
                            resize: vertical;
                            min-height: 100px;
                          " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                          onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                          placeholder="Describe the purpose of your travel (e.g., Client meeting, Conference attendance)..."
                          maxlength="1000" aria-required="true"></textarea>
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
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
            <button type="button" id="cancelTravelOrder" class="btn secondary-btn" style="
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
            <button type="submit" id="submitTravelOrder" class="btn primary-btn" disabled style="
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
        <div id="travelFormLoading" class="loading-overlay" style="
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
              border-top: 4px solid #3b82f6;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing your request...</p>
          </div>
        </div>
      </div>
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
      
      @keyframes logoFloat {
        from { 
          opacity: 0;
          transform: translateY(-10px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .travel-form-content {
          padding: 24px 16px;
          margin: 8px;
          max-height: 95vh;
        }
        
        .form-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .form-actions {
          flex-direction: column;
          gap: 12px;
        }
        
        .btn, .add-btn {
          width: 100%;
          justify-content: center;
        }
        
        .passenger-row {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }
        
        .remove-passenger {
          align-self: flex-end;
          width: auto;
          padding: 8px 12px;
        }
      }
      
      /* Enhanced Validation Styles */
      .form-group input:invalid,
      .form-group textarea:invalid,
      .form-group input.error,
      .form-group textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }
      
      .field-error.show {
        display: block !important;
      }
      
      /* Passenger Styles */
      .passenger-row {
        transition: all 0.3s ease;
      }
      
      .passenger-row:hover {
        background: rgba(59, 130, 246, 0.02);
      }
      
      .passenger-row.error-row {
        border: 2px solid #ef4444;
        border-radius: 8px;
        padding: 8px;
        background: rgba(239, 68, 68, 0.05);
      }
      
      .remove-passenger:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
      }
      
      /* Submit Button States */
      .primary-btn.valid {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
        cursor: pointer !important;
        opacity: 1 !important;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2) !important;
      }
      
      .primary-btn.valid:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3) !important;
      }
      
      .primary-btn:disabled {
        background: linear-gradient(135deg, #9ca3af, #6b7280) !important;
        cursor: not-allowed !important;
        opacity: 0.6 !important;
        transform: none !important;
      }
      
      /* Custom Scrollbar */
      .travel-form-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .travel-form-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      
      .travel-form-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      
      .travel-form-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    </style>
  `;
}

// Enhanced attach logic with full field validation
function attachTravelOrderForm(user) {
  // Wait for DOM to render (retry if elements not ready)
  function waitForElements(callback, maxRetries = 10, delay = 50) {
    let retries = 0;
    function attempt() {
      const modal = document.getElementById("travelOrderModal");
      const form = document.getElementById("travelOrderForm");
      const loadingOverlay = document.getElementById("travelFormLoading");
      const submitBtn = document.getElementById("submitTravelOrder");
      const addPassengerBtn = document.getElementById("addPassengerBtn");
      const passengersWrapper = document.getElementById("passengersWrapper");
      const closeBtn = document.getElementById("closeTravelOrderModal");
      const cancelBtn = document.getElementById("cancelTravelOrder");
      const passengersError = document.getElementById("passengersError");

      if (modal && form && loadingOverlay && submitBtn && addPassengerBtn && passengersWrapper && closeBtn && cancelBtn && passengersError) {
        callback({ modal, form, loadingOverlay, submitBtn, addPassengerBtn, passengersWrapper, closeBtn, cancelBtn, passengersError });
      } else if (retries < maxRetries) {
        retries++;
        console.warn(`Elements not ready (retry ${retries}/${maxRetries})...`);
        setTimeout(attempt, delay);
      } else {
        console.error("Failed to find required elements after retries.");
        showError("Form elements failed to load. Please refresh.");
      }
    }
    attempt();
  }

  // Helper function to show errors
  function showError(message, type = "error") {
    if (window.Modal && window.Modal.show) {
      window.Modal.show(message, type);
    } else {
      alert(message);
    }
  }

  waitForElements(({ modal, form, loadingOverlay, submitBtn, addPassengerBtn, passengersWrapper, closeBtn, cancelBtn, passengersError }) => {
    console.log("All form elements attached successfully.");

    let passengerCount = 1; // Start with 1 (initial row)

    // Close modal functions
    function closeModal() {
      modal.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => {
        modal.remove();
        document.removeEventListener("keydown", keydownHandler);
      }, 300);
    }

    // Global keydown handler
    const keydownHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", keydownHandler);

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Dynamic passenger management
    function addPassengerRow() {
      if (passengersWrapper.querySelectorAll(".passenger-row").length >= 10) {
        showError("Maximum 10 passengers allowed.", "warning");
        return;
      }

      passengerCount++;
      const row = document.createElement("div");
      row.className = "passenger-row";
      row.style.cssText = `
        display: flex;
        gap: 12px;
        align-items: center;
        transition: all 0.3s ease;
      `;

      const input = document.createElement("input");
      input.type = "text";
      input.name = "passenger[]";
      input.placeholder = `Passenger ${passengerCount}`;
      input.dataset.required = "false";
      input.maxLength = 100;
      input.style.cssText = `
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.3s ease;
        background: white;
      `;
      
      // Add focus/blur handlers
      input.addEventListener('focus', () => {
        input.style.borderColor = '#3b82f6';
        input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
      });
      input.addEventListener('blur', () => {
        input.style.borderColor = '#e2e8f0';
        input.style.boxShadow = 'none';
      });
      input.addEventListener('input', debounce(validateForm, 300));
      input.addEventListener('change', validateForm);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-passenger";
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.style.cssText = `
        padding: 12px;
        border: none;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-radius: 12px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      removeBtn.addEventListener('mouseover', () => removeBtn.style.background = 'rgba(239, 68, 68, 0.2)');
      removeBtn.addEventListener('mouseout', () => removeBtn.style.background = 'rgba(239, 68, 68, 0.1)');
      removeBtn.addEventListener('click', () => {
        row.remove();
        if (passengersWrapper.querySelectorAll(".passenger-row").length === 0) {
          addPassengerRow();
          passengerCount = 1;
        }
        validateForm();
      });

      row.appendChild(input);
      row.appendChild(removeBtn);
      passengersWrapper.appendChild(row);
      console.log(`Added passenger row #${passengerCount}`);
      validateForm();
    }

    addPassengerBtn.addEventListener("click", addPassengerRow);

    // Fix initial remove button and add listeners
    const initialRemoveBtn = passengersWrapper.querySelector(".remove-passenger");
    const initialInput = passengersWrapper.querySelector('input[name="passenger[]"]');
    
    if (initialRemoveBtn) {
      initialRemoveBtn.addEventListener('click', () => {
        const row = initialRemoveBtn.closest(".passenger-row");
        row.remove();
        if (passengersWrapper.querySelectorAll(".passenger-row").length === 0) {
          addPassengerRow();
          passengerCount = 1;
        }
        validateForm();
      });
    }
    
    if (initialInput) {
      initialInput.addEventListener('input', debounce(validateForm, 300));
      initialInput.addEventListener('change', validateForm);
    }

    // Enhanced validation function with detailed field checks
    function validateForm() {
      console.log("Running validation...");
      let isValid = true;
      const missingFields = [];
      const requiredFields = form.querySelectorAll('[data-required="true"]');

      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
        el.style.display = 'none';
      });
      form.querySelectorAll('input, textarea').forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '#e2e8f0';
        field.style.boxShadow = 'none';
      });
      passengersWrapper.querySelectorAll('.passenger-row').forEach(row => row.classList.remove('error-row'));
      passengersError.classList.remove('show');
      passengersError.style.display = 'none';

      // Check required fields
      requiredFields.forEach(field => {
        const value = field.value.trim();
        const errorEl = field.parentElement.querySelector('.field-error');
        const fieldLabel = field.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        if (!value) {
          isValid = false;
          missingFields.push(fieldLabel);
          field.classList.add('error');
          field.style.borderColor = '#ef4444';
          field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
          if (errorEl) {
            errorEl.textContent = `${fieldLabel} is required`;
            errorEl.classList.add('show');
            errorEl.style.display = 'block';
          }
        }
      });

      // Enhanced Purpose validation (min 10 chars)
      const purpose = form.querySelector('[name="purpose"]').value.trim();
      if (purpose.length > 0 && purpose.length < 10) {
        isValid = false;
        missingFields.push("Purpose (too short)");
        const errorEl = form.querySelector('[name="purpose"]').parentElement.querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = 'Purpose must be at least 10 characters long';
          errorEl.classList.add('show');
          errorEl.style.display = 'block';
          form.querySelector('[name="purpose"]').style.borderColor = '#ef4444';
          form.querySelector('[name="purpose"]').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
      }

      // Date validation (Travel Date >= Date Filed)
      const travelDate = form.querySelector('[name="travelDate"]').value;
      const dateFiled = form.querySelector('[name="dateFiled"]').value;
      if (travelDate && dateFiled && new Date(travelDate) < new Date(dateFiled)) {
        isValid = false;
        missingFields.push("Travel Date (must be on or after Date Filed)");
        const errorEl = form.querySelector('[name="travelDate"]').parentElement.querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = 'Travel date cannot be before the filing date';
          errorEl.classList.add('show');
          errorEl.style.display = 'block';
          form.querySelector('[name="travelDate"]').style.borderColor = '#ef4444';
          form.querySelector('[name="travelDate"]').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
      }

      // Time validation (Time In should be after Time Out if both provided)
      const timeOut = form.querySelector('[name="timeOut"]').value;
      const timeIn = form.querySelector('[name="timeIn"]').value;
      if (timeOut && timeIn && timeOut >= timeIn) {
        isValid = false;
        missingFields.push("Time In (must be after Time Out)");
        const errorEl = form.querySelector('[name="timeIn"]').parentElement.querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = 'Time In must be after Time Out';
          errorEl.classList.add('show');
          errorEl.style.display = 'block';
          form.querySelector('[name="timeIn"]').style.borderColor = '#ef4444';
          form.querySelector('[name="timeIn"]').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
      }

      // Passenger validation - remove empty rows automatically
      const passengerInputs = passengersWrapper.querySelectorAll('input[name="passenger[]"]');
      let emptyPassengerRows = 0;
      passengerInputs.forEach((input, index) => {
        const value = input.value.trim();
        const row = input.closest('.passenger-row');
        
        if (!value) {
          emptyPassengerRows++;
          // Auto-remove empty rows if there are multiple rows
          if (passengerInputs.length > 1) {
            setTimeout(() => row.remove(), 100);
          }
        }
      });

      // Ensure at least one passenger row remains
      if (passengersWrapper.querySelectorAll(".passenger-row").length === 0) {
        addPassengerRow();
        passengerCount = 1;
      }

      // Passenger max check
      if (passengersWrapper.querySelectorAll(".passenger-row").length > 10) {
        isValid = false;
        missingFields.push("Too many passengers (max 10)");
        passengersError.textContent = 'Maximum 10 passengers allowed';
        passengersError.classList.add('show');
        passengersError.style.display = 'block';
      }

      // Update submit button state
      if (isValid) {
        submitBtn.disabled = false;
        submitBtn.classList.add('valid');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submit Request';
        submitBtn.title = 'Form is complete. Ready to submit.';
      } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove('valid');
        submitBtn.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Complete Form First';
        submitBtn.title = missingFields.length > 0 ? `Missing: ${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? '...' : ''}` : 'Please fill required fields';
      }

      console.log(`Validation result: ${isValid ? 'PASS' : 'FAIL'}. Missing: ${missingFields.join(', ')}`);
      return { isValid, missingFields };
    }

    // Attach real-time validation listeners
    form.addEventListener('input', debounce(validateForm, 300));
    form.addEventListener('change', validateForm);

    // Form submission with Firebase integration
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Submit handler triggered.");

      const { isValid, missingFields } = validateForm();

      if (!isValid) {
        console.log("Validation failed on submit. Missing fields:", missingFields);
        const errorSummary = `Please complete the form. Missing fields:\n${missingFields.join('\n')}`;
        showError(errorSummary, "warning");
        
        // Focus first missing field
        const firstMissing = form.querySelector('.error');
        if (firstMissing) firstMissing.focus();
        return;
      }

      console.log("All fields validated. Preparing data...");

      // Show loading overlay
      loadingOverlay.style.display = 'flex';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      try {
        // Collect form data
        const formData = new FormData(form);
        const formDataObj = {};
        
        // Process regular fields
        for (let [key, value] of formData.entries()) {
          if (key === 'passenger[]') {
            if (!formDataObj.passengers) formDataObj.passengers = [];
            if (value.trim()) formDataObj.passengers.push(value.trim().toUpperCase());
          } else {
            formDataObj[key] = typeof value === "string" ? value.toUpperCase().trim() : value;
          }
        }

        // Prepare final data object
        const data = {
          id: `TO-${Date.now()}`,
          username: user.username,
          ...formDataObj,
          status: "Pending",
          dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log("Form data prepared:", data);

        // Save to Firestore
        if (!window.db) {
          throw new Error("Database not initialized.");
        }
        await window.db.collection("travel_orders").doc(data.id).set(data);

        // Success handling
        loadingOverlay.style.display = 'none';
        closeModal();

        showError(`Travel Order submitted successfully!\nReference ID: ${data.id}`, "success");
        console.log("Travel Order saved:", data.id);

        // Optional: Send via Telegram if available
        if (window.TelegramConnect && typeof window.TelegramConnect.sendRequest === "function") {
          window.TelegramConnect.sendRequest(data, "Travel Order");
        }

        // Refresh dashboard if user is on it
        if (window.mountDashboard && window.currentUser) {
          window.mountDashboard(window.currentUser);
        }

        // Reset form
        form.reset();
        validateForm(); // Reset validation state

      } catch (error) {
        console.error("Submission error:", error);
        loadingOverlay.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submit Request';

        let errorMessage = "Failed to submit travel order. Please try again.";
        if (error.code === 'permission-denied') {
          errorMessage = "Permission denied. Please check your account.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.message.includes('Database not initialized')) {
          errorMessage = "System not ready. Please refresh the page and try again.";
        }

        showError(errorMessage, "error");
      }
    });

    // Run initial validation
    validateForm();

    console.log("Travel order form initialization complete.");
  });
}

// Enhanced mount function with better error handling
function mountTravelOrderForm(user) {
  try {
    if (!user || !user.username) {
      console.error("No valid user provided for mountTravelOrderForm.");
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Please log in to submit a travel order.", "warning");
      } else {
        alert("Please log in to submit a travel order.");
      }
      return;
    }

    // Close any existing modals
    if (typeof closeAllModals === "function") {
      closeAllModals();
    }

    // Remove existing travel order modal if present
    const existingModal = document.getElementById("travelOrderModal");
    if (existingModal) {
      existingModal.remove();
    }

    // Render and insert
    const html = renderTravelOrderForm(user);
    document.body.insertAdjacentHTML("beforeend", html);

    // Attach functionality
    attachTravelOrderForm(user);

    // Ensure Font Awesome is loaded
    if (!document.querySelector('link[href*="fontawesome"]')) {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      faLink.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
      faLink.crossOrigin = "anonymous";
      faLink.referrerPolicy = "no-referrer";
      document.head.appendChild(faLink);
    }

    // Focus first required field for accessibility
    setTimeout(() => {
      const firstField = document.querySelector('#travelOrderForm input[required]');
      if (firstField) firstField.focus();
    }, 100);

    console.log("Travel Order form mounted successfully.");

  } catch (error) {
    console.error("Error mounting Travel Order form:", error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Unable to load Travel Order form. Please try again.", "error");
    } else {
      alert("Unable to load Travel Order form. Please refresh the page.");
    }
  }
}

// Expose globally
window.mountTravelOrderForm = mountTravelOrderForm;

// Utility to close all modals (if not defined elsewhere)
if (typeof closeAllModals === "undefined") {
  window.closeAllModals = function() {
    document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
  };
}

// Additional fadeOut animation if needed
if (!document.querySelector('style[data-travel-fadeout]')) {
  const style = document.createElement("style");
  style.setAttribute('data-travel-fadeout', 'true');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Enhanced error boundary for this module
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('travel_order_form_modal.js')) {
    console.error('Travel Order Form Error:', {
      message: event.message,
      line: event.lineno,
      error: event.error
    });
  }
});