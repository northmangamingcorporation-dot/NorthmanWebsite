// Enhanced assets/js/travel_order_form_modal.js

// Utility function to format date for input
function formatDateForInput(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
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
                <input type="text" name="employeeName" value="${fullName}" required 
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
                <input type="text" name="department" value="${user.department || ''}" required 
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
                <input type="date" name="dateFiled" value="${today}" required 
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
                <input type="date" name="travelDate" required 
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
                ">Travel From</label>
                <input type="text" name="travelFrom" 
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
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Travel To</label>
                <input type="text" name="travelTo" 
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
                <input type="time" name="timeOut" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., 09:00 AM" />
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Time In</label>
                <input type="time" name="timeIn" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., 05:00 PM" />
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
                <input type="text" name="driversName" 
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
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Reliever's Name</label>
                <input type="text" name="relieversName" 
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
                <input type="text" name="passenger[]" placeholder="Enter passenger name (optional)" 
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
                <input type="text" name="carUnit" 
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
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Purpose <span style="color: #ef4444;">*</span></label>
                <textarea name="purpose" rows="4" required 
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
            <button type="submit" id="submitTravelOrder" class="btn primary-btn" style="
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
              <i class="fas fa-paper-plane"></i>
              Submit Request
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
          padding: 32px 24px;
          margin: 16px;
        }
        
        .form-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .form-actions {
          flex-direction: column;
        }
        
        .btn {
          width: 100%;
          justify-content: center;
        }
      }
      
      /* Form validation styles */
      .form-group input:invalid,
      .form-group textarea:invalid {
        border-color: #ef4444;
      }
      
      .field-error.show {
        display: block;
      }
      
      /* Passenger row styles */
      .passenger-row {
        transition: all 0.3s ease;
      }
      
      .passenger-row:hover {
        background: rgba(59, 130, 246, 0.02);
      }
      
      .remove-passenger:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
      }
      
      /* Button disabled state */
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
      
      /* Custom scrollbar */
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

// Enhanced attach logic with validation and Firebase integration
function attachTravelOrderForm(user) {
  if (!user || !user.username) {
    console.error("No valid user provided for travel order form.");
    return;
  }

  const modal = document.getElementById("travelOrderModal");
  const form = document.getElementById("travelOrderForm");
  const loadingOverlay = document.getElementById("travelFormLoading");
  const submitBtn = document.getElementById("submitTravelOrder");
  const addPassengerBtn = document.getElementById("addPassengerBtn");
  const passengersWrapper = document.getElementById("passengersWrapper");
  const closeBtn = document.getElementById("closeTravelOrderModal");
  const cancelBtn = document.getElementById("cancelTravelOrder");

  if (!form || !modal) return;

  let passengerCount = 1;

  // Close modal functions
  function closeModal() {
    modal.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modal.remove();
    }, 300);
  }

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.contains(document.activeElement)) {
      closeModal();
    }
  });

  // Dynamic passenger management
  function addPassengerRow() {
    if (passengerCount >= 10) { // Limit to 10 passengers
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Maximum 10 passengers allowed.", "warning");
      } else {
        alert("Maximum 10 passengers allowed.");
      }
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
    input.style.cssText = `
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: white;
    `;
    input.onfocus = () => {
      input.style.borderColor = '#3b82f6';
      input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    };
    input.onblur = () => {
      input.style.borderColor = '#e2e8f0';
      input.style.boxShadow = 'none';
    };
    input.maxLength = 100;

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
    removeBtn.onmouseover = () => removeBtn.style.background = 'rgba(239, 68, 68, 0.2)';
    removeBtn.onmouseout = () => removeBtn.style.background = 'rgba(239, 68, 68, 0.1)';
    removeBtn.onclick = () => {
      row.remove();
      passengerCount--;
    };

    row.appendChild(input);
    row.appendChild(removeBtn);
    passengersWrapper.appendChild(row);
  }

  addPassengerBtn.addEventListener("click", addPassengerRow);

  // Remove existing remove buttons (for initial row)
  const initialRemoveBtn = passengersWrapper.querySelector(".remove-passenger");
  if (initialRemoveBtn) {
    initialRemoveBtn.onclick = () => {
      const row = initialRemoveBtn.closest(".passenger-row");
      row.remove();
      passengerCount--;
      if (passengerCount === 0) {
        addPassengerRow(); // Add back one empty row
        passengerCount = 1;
      }
    };
  }

  // Real-time form validation
  function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    const errors = {};

    requiredFields.forEach(field => {
      const fieldName = field.name;
      const value = field.value.trim();
      const errorEl = field.parentElement.querySelector('.field-error');

      if (!value) {
        isValid = false;
        errors[fieldName] = 'This field is required';
        if (errorEl) {
          errorEl.textContent = errors[fieldName];
          errorEl.classList.add('show');
          field.style.borderColor = '#ef4444';
          field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
      } else {
        if (errorEl) {
          errorEl.classList.remove('show');
          field.style.borderColor = '#e2e8f0';
          field.style.boxShadow = 'none';
        }
      }
    });

    // Additional validations
    const travelDate = form.querySelector('[name="travelDate"]').value;
    const dateFiled = form.querySelector('[name="dateFiled"]').value;
    if (travelDate && dateFiled && new Date(travelDate) < new Date(dateFiled)) {
      isValid = false;
      const errorEl = form.querySelector('[name="travelDate"] + .field-error');
            if (errorEl) {
        errorEl.textContent = 'Travel date cannot be before the filing date';
        errorEl.classList.add('show');
        form.querySelector('[name="travelDate"]').style.borderColor = '#ef4444';
        form.querySelector('[name="travelDate"]').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      }
    }

    // Purpose validation
    const purpose = form.querySelector('[name="purpose"]').value.trim();
    if (purpose.length < 10) {
      isValid = false;
      const errorEl = form.querySelector('[name="purpose"] + .field-error');
      if (errorEl) {
        errorEl.textContent = 'Purpose must be at least 10 characters long';
        errorEl.classList.add('show');
        form.querySelector('[name="purpose"]').style.borderColor = '#ef4444';
        form.querySelector('[name="purpose"]').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      }
    }

    // Enable/disable submit button
    submitBtn.disabled = !isValid;
    if (!isValid) {
      submitBtn.style.opacity = '0.6';
    } else {
      submitBtn.style.opacity = '1';
    }

    return isValid;
  }

  // Attach real-time validation
  form.addEventListener('input', validateForm);
  form.addEventListener('change', validateForm);

  // Initial validation
  validateForm();

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Please fill in all required fields correctly.", "warning");
      } else {
        alert("Please fill in all required fields correctly.");
      }
      return;
    }

    // Show loading
    loadingOverlay.style.display = "flex";
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
      const formData = new FormData(form);
      const data = {
        id: `TO-${Date.now()}`,
        employeeName: formData.get("employeeName")?.toUpperCase().trim() || "",
        department: formData.get("department")?.toUpperCase().trim() || "",
        dateFiled: formData.get("dateFiled"),
        travelDate: formData.get("travelDate"),
        travelFrom: formData.get("travelFrom")?.trim() || "",
        travelTo: formData.get("travelTo")?.trim() || "",
        timeOut: formData.get("timeOut") || "",
        timeIn: formData.get("timeIn") || "",
        driversName: formData.get("driversName")?.toUpperCase().trim() || "",
        relieversName: formData.get("relieversName")?.toUpperCase().trim() || "",
        carUnit: formData.get("carUnit")?.toUpperCase().trim() || "",
        purpose: formData.get("purpose")?.trim() || "",
        username: user.username,
        status: "Pending",
        dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Collect passengers
      data.passengers = [];
      for (let [key, value] of formData.entries()) {
        if (key === "passenger[]" && value.trim()) {
          data.passengers.push(value.trim().toUpperCase());
        }
      }

      // Validate passengers if any
      if (data.passengers.length > 10) {
        throw new Error("Maximum 10 passengers allowed.");
      }

      // Save to Firestore (assuming window.db is firebase.firestore())
      if (!window.db) {
        throw new Error("Database not initialized.");
      }

      await window.db.collection("travel_orders").doc(data.id).set(data);

      // Success handling
      loadingOverlay.style.display = "none";
      closeModal();

      if (window.Modal && window.Modal.show) {
        window.Modal.show(`Travel Order submitted successfully!\nReference ID: ${data.id}`, "success");
      } else {
        alert(`✅ Travel Order Submitted!\nReference ID: ${data.id}`);
      }

      console.log("Travel Order saved:", data.id);

      // Optional: Send via Telegram if available
      if (window.TelegramConnect && typeof window.TelegramConnect.sendRequest === "function") {
        window.TelegramConnect.sendRequest(data, "Travel Order");
      }

      // Refresh dashboard if user is on it
      if (window.mountDashboard && window.currentUser ) {
        window.mountDashboard(window.currentUser );
      }

      // Reset form if modal persists
      form.reset();

    } catch (error) {
      console.error("Error submitting Travel Order:", error);
      loadingOverlay.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';

      let errorMessage = "Failed to submit Travel Order. Please try again.";
      if (error.code === 'permission-denied') {
        errorMessage = "Permission denied. Please check your account.";
      } else if (error.message.includes('network')) {
        errorMessage = "Network error. Please check your connection.";
      }

      if (window.Modal && window.Modal.show) {
        window.Modal.show(errorMessage, "error");
      } else {
        alert(`❌ ${errorMessage}`);
      }
    }
  });
}

// Enhanced mount function
function mountTravelOrderForm(user) {
  try {
    if (!user || !user.username) {
      console.error("No valid user provided for mountTravelOrderForm.");
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Please log in to create a travel order.", "warning");
      }
      return;
    }

    // Close any existing modals
    closeAllModals?.();

    // Remove existing travel modal if present
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
      document.head.appendChild(faLink);
    }

    // Focus first field for accessibility
    setTimeout(() => {
      const firstField = document.querySelector('#travelOrderForm input[required]');
      if (firstField) firstField.focus();
    }, 100);

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