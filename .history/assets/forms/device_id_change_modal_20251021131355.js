// Enhanced assets/js/device_id_change_modal.js - Modern Device ID Change Form
// Stores in device_id_changes collection with operator summaries

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

// Enhanced rendering with modern UI (IT-themed: blue/green gradients)
function renderDeviceIDChangeModal(user = { username: "Employee", firstName: "", lastName: "", department: "" }) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const today = formatDateForInput(new Date());

  return `
    <div id="deviceIDChangeModal" class="modal-overlay device-id-modal" style="
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
      
      <div class="modal-content device-form-content" style="
        background: linear-gradient(145deg, #ffffff, #f0fdf4);
        border-radius: 20px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 40px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.3);
        border: 1px solid rgba(16, 185, 129, 0.2);
        transform: translateY(20px);
        animation: slideIn 0.4s ease forwards;
      ">
        
        <!-- Enhanced Close Button -->
        <button id="closeDeviceModal" class="close-btn" style="
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
        " aria-label="Close Device ID Change Modal">
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
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
          ">
            <i class="fas fa-mobile-alt" style="font-size: 36px; color: white;"></i>
          </div>
          <h2 style="
            margin: 0 0 8px 0;
            color: #0f172a;
            font-weight: 700;
            font-size: 28px;
            background: linear-gradient(135deg, #0f172a, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            Device ID Change Request
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Submit POS or Phone device changes quickly
          </p>
        </div>

        <!-- Processing Message -->
        <div id="processingDeviceMessage" style="display: none; color: #10b981; font-weight: 500; text-align: center; margin-bottom: 16px;">
          <i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>
          Submitting device change...
        </div>

        <!-- Form -->
        <form id="deviceIDChangeForm" style="
          display: flex;
          flex-direction: column;
          gap: 32px;
        ">
          
          <!-- SECTION 1: Device Type Selection -->
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
              <i class="fas fa-desktop" style="color: #10b981; margin-right: 8px;"></i>
              Device Type
            </h3>
            <div class="device-type-selector" style="
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            ">
              <label class="device-option" style="
                display: flex;
                align-items: center;
                padding: 20px;
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
              " data-device="pos">
                <input type="radio" name="deviceType" value="pos" required style="
                  margin-right: 12px;
                  width: 20px;
                  height: 20px;
                  cursor: pointer;
                  accent-color: #10b981;
                ">
                <div>
                  <div style="font-weight: 600; color: #0f172a; font-size: 16px;">
                    <i class="fas fa-cash-register" style="color: #10b981; margin-right: 8px;"></i>
                    POS Device
                  </div>
                  <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
                    Point of Sale terminal
                  </div>
                </div>
              </label>
              
              <label class="device-option" style="
                display: flex;
                align-items: center;
                padding: 20px;
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
              " data-device="phone">
                <input type="radio" name="deviceType" value="phone" required style="
                  margin-right: 12px;
                  width: 20px;
                  height: 20px;
                  cursor: pointer;
                  accent-color: #10b981;
                ">
                <div>
                  <div style="font-weight: 600; color: #0f172a; font-size: 16px;">
                    <i class="fas fa-mobile-alt" style="color: #10b981; margin-right: 8px;"></i>
                    Phone Device
                  </div>
                  <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
                    Mobile phone
                  </div>
                </div>
              </label>
            </div>
          </section>

          <!-- SECTION 2: Dynamic Form Fields -->
          <section class="form-section dynamic-fields" style="
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 24px;
            display: none;
          ">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-edit" style="color: #10b981; margin-right: 8px;"></i>
              Device Details
            </h3>
            
            <!-- POS Fields (shown conditionally) -->
            <div id="posFields" class="device-fields" style="display: none;">
              <div class="form-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
              ">
                <div class="form-group">
                  <label style="
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                    font-size: 14px;
                    display: block;
                  ">Old Booth Code <span style="color: #ef4444;">*</span></label>
                  <input type="text" name="oldBoothCode" placeholder="e.g., BOOTH-001"
                         style="
                           padding: 12px 16px;
                           border: 2px solid #e2e8f0;
                           border-radius: 12px;
                           font-size: 16px;
                           transition: all 0.3s ease;
                           background: white;
                           width: 100%;
                         " onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 3px rgba(16, 185, 129, 0.1)';"
                         onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';" />
                  <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
                </div>
                
                <div class="form-group">
                  <label style="
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                    font-size: 14px;
                    display: block;
                  ">New Booth Code <span style="color: #ef4444;">*</span></label>
                  <input type="text" name="newBoothCode" placeholder="e.g., BOOTH-002"
                         style="
                           padding: 12px 16px;
                           border: 2px solid #e2e8f0;
                           border-radius: 12px;
                           font-size: 16px;
                           transition: all 0.3s ease;
                           background: white;
                           width: 100%;
                         " onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 3px rgba(16, 185, 129, 0.1)';"
                         onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';" />
                  <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
                </div>
                
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label style="
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                    font-size: 14px;
                    display: block;
                  ">POS Serial Number <span style="color: #ef4444;">*</span></label>
                  <input type="text" name="posSerialNumber" placeholder="e.g., SN123456789"
                         style="
                           padding: 12px 16px;
                           border: 2px solid #e2e8f0;
                           border-radius: 12px;
                           font-size: 16px;
                           transition: all 0.3s ease;
                           background: white;
                           width: 100%;
                         " onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 3px rgba(16, 185, 129, 0.1)';"
                         onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';" />
                  <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
                </div>
              </div>
            </div>
            
            <!-- Phone Fields (shown conditionally) -->
            <div id="phoneFields" class="device-fields" style="display: none;">
              <div class="form-grid" style="
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
              ">
                <div class="form-group">
                  <label style="
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                    font-size: 14px;
                    display: block;
                  ">Booth Code <span style="color: #ef4444;">*</span></label>
                  <input type="text" name="phoneBoothCode" placeholder="e.g., BOOTH-001"
                         style="
                           padding: 12px 16px;
                           border: 2px solid #e2e8f0;
                           border-radius: 12px;
                           font-size: 16px;
                           transition: all 0.3s ease;
                           background: white;
                           width: 100%;
                         " onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 3px rgba(16, 185, 129, 0.1)';"
                         onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';" />
                  <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
                </div>
              </div>
            </div>
            
            <!-- Common Fields -->
            <div class="form-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 20px;
              margin-top: 20px;
            ">
              <div class="form-group">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                  display: block;
                ">Operator <span style="color: #ef4444;">*</span></label>
                <input type="text" name="operator"
                       style="
                         padding: 12px 16px;
                           border: 2px solid #e2e8f0;
                           border-radius: 12px;
                           font-size: 16px;
                           transition: all 0.3s ease;
                           background: white;
                           width: 100%;
                       " />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              
              <div class="form-group" style="grid-column: 1 / -1;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                  display: block;
                ">Reason for Change <span style="color: #ef4444;">*</span></label>
                <textarea name="reason" rows="3" placeholder="e.g., Device malfunction, upgrade, replacement..." required
                          style="
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 16px;
                            transition: all 0.3s ease;
                            background: white;
                            resize: vertical;
                            width: 100%;
                            min-height: 80px;
                          " onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 3px rgba(16, 185, 129, 0.1)';"
                          onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"></textarea>
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
                <div class="char-counter" style="font-size: 12px; color: #9ca3af; text-align: right; margin-top: 4px;">0/500</div>
              </div>
            </div>
          </section>

          <!-- SECTION 3: Preview (Dynamic) -->
          <section class="form-section" id="previewSection" style="display: none;">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-eye" style="color: #10b981; margin-right: 8px;"></i>
              Change Preview
            </h3>
            <div id="changePreview" style="
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              border-left: 4px solid #10b981;
            ">
              <p style="color: #94a3b8; font-style: italic; margin: 0;">Select device type and fill details to see preview...</p>
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
            <button type="button" id="cancelDeviceChange" class="btn secondary-btn" style="
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
            <button type="submit" id="submitDeviceChange" class="btn primary-btn" disabled style="
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
        <div id="deviceFormLoading" class="loading-overlay" style="
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
              border-top: 4px solid #10b981;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing change...</p>
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
        0% { transform: translateY(20px) scale(0.9); opacity: 0; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Device Option Hover States */
      .device-option:hover {
        border-color: #10b981 !important;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      }
      
      .device-option.selected {
        border-color: #10b981 !important;
        background: linear-gradient(135deg, #dcfce7, #d1fae5) !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      /* Form Sections */
      .form-section {
        padding: 20px 0;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .form-section:last-child {
        border-bottom: none;
      }

      /* Button States */
      .btn.primary-btn:not(:disabled) {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      .btn.primary-btn:not(:disabled):hover {
        background: linear-gradient(135deg, #059669, #047857) !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .device-form-content {
          padding: 24px 20px;
          margin: 16px;
        }
        
        .form-header h2 {
          font-size: 24px;
        }
        
        .device-type-selector {
          grid-template-columns: 1fr !important;
        }
        
        .form-actions {
          flex-direction: column;
        }
        
        .btn {
          width: 100%;
        }
      }
    </style>
  `;
}

// Show Device ID Change Modal
function showDeviceIDChangeModal() {
  const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  const user = JSON.parse(loggedInUser);
  if (!user || !user.username) {
    console.error("No valid user provided for showDeviceIDChangeModal.");
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Please log in to submit a device change.", "warning");
    } else {
      alert("Please log in to submit a device change.");
    }
    return;
  }

  if (typeof closeAllModals === "function") {
    closeAllModals();
  }

  const existingModal = document.getElementById("deviceIDChangeModal");
  if (existingModal) {
    existingModal.remove();
  }

  const html = renderDeviceIDChangeModal(user);
  document.body.insertAdjacentHTML("beforeend", html);

  setTimeout(() => initializeDeviceIDChangeForm(user), 100);

  if (!document.querySelector('link[href*="fontawesome"]')) {
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    faLink.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
    faLink.crossOrigin = "anonymous";
    faLink.referrerPolicy = "no-referrer";
    document.head.appendChild(faLink);
  }

  console.log("Device ID Change Modal mounted successfully.");
}

// Initialize Device ID Change Form (Event Listeners & Validation)
function initializeDeviceIDChangeForm(user) {
  function waitForElements(callback, maxRetries = 10, delay = 50) {
    let retries = 0;
    function attempt() {
      const modal = document.getElementById("deviceIDChangeModal");
      const form = document.getElementById("deviceIDChangeForm");
      const submitBtn = document.getElementById("submitDeviceChange");
      const cancelBtn = document.getElementById("cancelDeviceChange");
      const closeBtn = document.getElementById("closeDeviceModal");
      const loadingOverlay = document.getElementById("deviceFormLoading");
      const preview = document.getElementById("changePreview");
      const previewSection = document.getElementById("previewSection");
      const deviceTypeInputs = form.querySelectorAll('input[name="deviceType"]');
      const posFields = document.getElementById("posFields");
      const phoneFields = document.getElementById("phoneFields");
      const dynamicSection = form.querySelector('.dynamic-fields');
      const reasonTextarea = form.querySelector('textarea[name="reason"]');
      const charCounter = form.querySelector('.char-counter');

      if (modal && form && submitBtn && cancelBtn && closeBtn && loadingOverlay && preview && previewSection && deviceTypeInputs.length && posFields && phoneFields && dynamicSection && reasonTextarea && charCounter) {
        callback({ modal, form, submitBtn, cancelBtn, closeBtn, loadingOverlay, preview, previewSection, deviceTypeInputs, posFields, phoneFields, dynamicSection, reasonTextarea, charCounter });
      } else if (retries < maxRetries) {
        retries++;
        console.warn(`Device form elements not ready (retry ${retries}/${maxRetries})...`);
        setTimeout(attempt, delay);
      } else {
        console.error("Failed to find required device form elements after retries.");
        showError("Form elements failed to load. Please refresh.");
      }
    }
    attempt();
  }

  function showError(message, type = "error") {
    if (window.Modal && window.Modal.show) {
      window.Modal.show(message, type);
    } else {
      alert(`${type === "error" ? "Error: " : "Success: "}${message}`);
    }
  }

  waitForElements(({ modal, form, submitBtn, cancelBtn, closeBtn, loadingOverlay, preview, previewSection, deviceTypeInputs, posFields, phoneFields, dynamicSection, reasonTextarea, charCounter }) => {
    console.log("All device form elements attached successfully.");

    let selectedDeviceType = null;

    function closeModal() {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        modal.remove();
        document.removeEventListener("keydown", keydownHandler);
      }, 300);
    }

    const keydownHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", keydownHandler);

    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Handle device type selection
    deviceTypeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        selectedDeviceType = e.target.value;
        
        // Update visual selection
        document.querySelectorAll('.device-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        e.target.closest('.device-option').classList.add('selected');
        
        // Show/hide appropriate fields
        dynamicSection.style.display = 'block';
        posFields.style.display = selectedDeviceType === 'pos' ? 'block' : 'none';
        phoneFields.style.display = selectedDeviceType === 'phone' ? 'block' : 'none';
        
        // Clear fields when switching
        if (selectedDeviceType === 'pos') {
          phoneFields.querySelector('input[name="phoneBoothCode"]').value = '';
          phoneFields.querySelector('input[name="phoneBoothCode"]').removeAttribute('required');
        } else {
          posFields.querySelectorAll('input').forEach(inp => {
            inp.value = '';
            inp.removeAttribute('required');
          });
        }
        
        // Set required attributes based on device type
        if (selectedDeviceType === 'pos') {
          posFields.querySelectorAll('input').forEach(inp => inp.setAttribute('required', 'true'));
        } else {
          phoneFields.querySelector('input[name="phoneBoothCode"]').setAttribute('required', 'true');
        }
        
        previewSection.style.display = 'block';
        updatePreview();
        validateForm();
      });
    });

    // Character counter for reason
    reasonTextarea.addEventListener('input', () => {
      const length = reasonTextarea.value.length;
      charCounter.textContent = `${length}/500`;
      
      if (length > 450) {
        charCounter.style.color = '#f59e0b';
      } else if (length > 480) {
        charCounter.style.color = '#ef4444';
      } else {
        charCounter.style.color = '#9ca3af';
      }
      
      if (length > 500) {
        reasonTextarea.value = reasonTextarea.value.substring(0, 500);
        charCounter.textContent = '500/500';
      }
      
      updatePreview();
      validateForm();
    });

    // Real-time preview update
    function updatePreview() {
      if (!selectedDeviceType) {
        preview.innerHTML = '<p style="color: #94a3b8; font-style: italic; margin: 0;">Select device type and fill details to see preview...</p>';
        return;
      }

      const formData = new FormData(form);
      let previewHTML = '<ul style="margin: 0; padding-left: 20px; color: #0f172a;">';
      
      previewHTML += `<li style="margin-bottom: 12px;"><strong style="color: #10b981;">Device Type:</strong> ${selectedDeviceType === 'pos' ? 'POS Device' : 'Phone Device'}</li>`;
      
      if (selectedDeviceType === 'pos') {
        const oldBooth = formData.get('oldBoothCode');
        const newBooth = formData.get('newBoothCode');
        const serial = formData.get('posSerialNumber');
        
        if (oldBooth) previewHTML += `<li style="margin-bottom: 12px;"><strong style="color: #10b981;">Old Booth:</strong> ${oldBooth}</li>`;
        if (newBooth) previewHTML += `<li style="margin-bottom: 12px;"><strong style="color: #10b981;">New Booth:</strong> ${newBooth}</li>`;
        if (serial) previewHTML += `<li style="margin-bottom: 12px;"><strong style="color: #10b981;">Serial Number:</strong> ${serial}</li>`;
      } else {
        const booth = formData.get('phoneBoothCode');
        if (booth) previewHTML += `<li style="margin-bottom: 12px;"><strong style="color: #10b981;">Booth Code:</strong> ${booth}</li>`;
      }
      
      const operator = formData.get('operator');
      const reason = formData.get('reason');
      
      if (operator) previewHTML += `<li style="margin-bottom: 12px;"><strong style="color: #10b981;">Operator:</strong> ${operator}</li>`;
      if (reason) previewHTML += `<li style="margin-bottom: 12px;"><strong style="color: #10b981;">Reason:</strong> ${reason}</li>`;
      
      previewHTML += '</ul>';
      preview.innerHTML = previewHTML;
      preview.style.background = 'linear-gradient(135deg, #f0fdf4, #dcfce7)';
    }

    // Validation function
    function validateForm() {
      let isValid = true;
      
      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
      });
      
      form.querySelectorAll('input:not([readonly]), textarea').forEach(field => {
        field.style.borderColor = '#e2e8f0';
        field.style.boxShadow = 'none';
      });

      // Check device type
      if (!selectedDeviceType) {
        isValid = false;
      }

      // Check device-specific fields
      if (selectedDeviceType === 'pos') {
        const oldBooth = form.querySelector('input[name="oldBoothCode"]');
        const newBooth = form.querySelector('input[name="newBoothCode"]');
        const serial = form.querySelector('input[name="posSerialNumber"]');
        const operator = form.querySelector('input[name="operator"]');
        
        [oldBooth, newBooth, serial,].forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            const errorEl = field.closest('.form-group').querySelector('.field-error');
            if (errorEl) {
              errorEl.textContent = 'This field is required';
              errorEl.style.display = 'block';
            }
          }
        });
      } else if (selectedDeviceType === 'phone') {
        const booth = form.querySelector('input[name="phoneBoothCode"]');
        if (!booth.value.trim()) {
          isValid = false;
          booth.style.borderColor = '#ef4444';
          booth.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
          const errorEl = booth.closest('.form-group').querySelector('.field-error');
          if (errorEl) {
            errorEl.textContent = 'This field is required';
            errorEl.style.display = 'block';
          }
        }
      }

      // Check reason
      if (!reasonTextarea.value.trim()) {
        isValid = false;
        reasonTextarea.style.borderColor = '#ef4444';
        reasonTextarea.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        const errorEl = reasonTextarea.closest('.form-group').querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = 'Please provide a reason for the change';
          errorEl.style.display = 'block';
        }
      }

      // Update submit button
      if (isValid) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Change Request';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.title = 'Click to submit device change';
      } else {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Complete Form First';
        submitBtn.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.title = 'Please complete all required fields';
      }

      return isValid;
    }

    // Attach input listeners for real-time validation
    form.addEventListener('input', debounce(() => {
      updatePreview();
      validateForm();
    }, 300));
    
    form.addEventListener('change', () => {
      updatePreview();
      validateForm();
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showError('Please complete all required fields', 'warning');
        return;
      }

      const formData = new FormData(form);
      
      const changeData = {
        deviceType: selectedDeviceType,
        operator: formData.get('operator'),
        reason: formData.get('reason'),
        submittedAt: new Date().toISOString(),
        submittedBy: window.currentUser?.uid || user.username,
        status: 'pending'
      };

      if (selectedDeviceType === 'pos') {
        changeData.oldBoothCode = formData.get('oldBoothCode');
        changeData.newBoothCode = formData.get('newBoothCode');
        changeData.posSerialNumber = formData.get('posSerialNumber');
      } else {
        changeData.boothCode = formData.get('phoneBoothCode');
      }

      const processingMessage = document.getElementById('processingDeviceMessage');
      if (processingMessage) processingMessage.style.display = 'block';
      loadingOverlay.style.display = 'flex';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      try {
        if (!window.db) {
          throw new Error('Database not initialized');
        }

        // Save to Firestore
        const docRef = await window.db.collection('device_id_changes').add(changeData);
        console.log('Device change saved with ID:', docRef.id);

        // Update operator summary
        await updateOperatorSummary(changeData.operator, selectedDeviceType);

        const successMsg = document.createElement('div');
        successMsg.className = 'form-message success show';
        successMsg.innerHTML = `
          <i class="fas fa-check-circle" style="margin-right: 8px; color: #16a34a;"></i>
          Device change request submitted successfully!
        `;
        form.insertBefore(successMsg, form.firstElementChild);

        setTimeout(() => {
          form.reset();
          selectedDeviceType = null;
          dynamicSection.style.display = 'none';
          previewSection.style.display = 'none';
          preview.innerHTML = '<p style="color: #94a3b8; font-style: italic; margin: 0;">Select device type and fill details to see preview...</p>';
          charCounter.textContent = '0/500';
          document.querySelectorAll('.device-option').forEach(opt => opt.classList.remove('selected'));
          
          // Refresh summary if function exists
          if (typeof loadDeviceChangeSummary === 'function') {
            loadDeviceChangeSummary();
          }
          
          successMsg.remove();
        }, 2000);

      } catch (error) {
        console.error('Error submitting device change:', error);

        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-message error show';
        errorMsg.innerHTML = `
          <i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #dc2626;"></i>
          ${error.message || 'Error submitting device change. Please try again.'}
        `;
        form.insertBefore(errorMsg, form.firstElementChild);

        setTimeout(() => errorMsg.remove(), 5000);
      } finally {
        loadingOverlay.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Change Request';
        if (processingMessage) processingMessage.style.display = 'none';
      }
    });

    // Initial validation
    validateForm();
  });
}

// Update operator summary in Firestore
async function updateOperatorSummary(operatorName, deviceType) {
  if (!window.db) return;
  
  try {
    const summaryRef = window.db.collection('operator_device_summary').doc(operatorName);
    const summaryDoc = await summaryRef.get();
    
    if (summaryDoc.exists) {
      const data = summaryDoc.data();
      const posCount = deviceType === 'pos' ? (data.posResets || 0) + 1 : (data.posResets || 0);
      const phoneCount = deviceType === 'phone' ? (data.phoneResets || 0) + 1 : (data.phoneResets || 0);
      
      await summaryRef.update({
        posResets: posCount,
        phoneResets: phoneCount,
        totalResets: posCount + phoneCount,
        lastUpdated: new Date().toISOString()
      });
    } else {
      await summaryRef.set({
        operator: operatorName,
        posResets: deviceType === 'pos' ? 1 : 0,
        phoneResets: deviceType === 'phone' ? 1 : 0,
        totalResets: 1,
        lastUpdated: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error updating operator summary:', error);
  }
}

// Load Device Change Summary Dashboard
function loadDeviceChangeSummary() {
  const summaryContainer = document.getElementById('deviceChangeSummaryContainer');
  
  if (!summaryContainer || !window.db) {
    console.warn('Summary container or database not available');
    return;
  }

  // Show loading state
  summaryContainer.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #10b981;"></i>
      <p style="margin-top: 16px; color: #64748b;">Loading summary...</p>
    </div>
  `;

  // Listen to operator summary collection
  window.db.collection('operator_device_summary')
    .orderBy('totalResets', 'desc')
    .onSnapshot((snapshot) => {
      if (snapshot.empty) {
        summaryContainer.innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <i class="fas fa-inbox" style="font-size: 48px; color: #cbd5e1;"></i>
            <p style="margin-top: 12px; color: #64748b;">No device changes recorded yet</p>
          </div>
        `;
        return;
      }

      let tableHTML = `
        <div style="overflow-x: auto; border-radius: 12px; border: 1px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse; background: white;">
            <thead style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-bottom: 2px solid #10b981;">
              <tr>
                <th style="text-align: left; padding: 16px; color: #166534; font-weight: 700; font-size: 14px;">Operator</th>
                <th style="text-align: center; padding: 16px; color: #166534; font-weight: 700; font-size: 14px;">POS Resets</th>
                <th style="text-align: center; padding: 16px; color: #166534; font-weight: 700; font-size: 14px;">Phone Resets</th>
                <th style="text-align: center; padding: 16px; color: #166534; font-weight: 700; font-size: 14px;">Total Resets</th>
              </tr>
            </thead>
            <tbody>
      `;

      snapshot.forEach((doc) => {
        const data = doc.data();
        tableHTML += `
          <tr style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;" 
              onmouseover="this.style.background='#f8fafc'" 
              onmouseout="this.style.background='white'">
            <td style="padding: 16px; color: #0f172a; font-weight: 600;">
              <i class="fas fa-user" style="color: #10b981; margin-right: 8px;"></i>
              ${data.operator}
            </td>
            <td style="padding: 16px; text-align: center;">
              <span style="
                background: #dbeafe;
                color: #1e40af;
                padding: 6px 12px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
              ">${data.posResets || 0}</span>
            </td>
            <td style="padding: 16px; text-align: center;">
              <span style="
                background: #fce7f3;
                color: #be185d;
                padding: 6px 12px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
              ">${data.phoneResets || 0}</span>
            </td>
            <td style="padding: 16px; text-align: center;">
              <span style="
                background: #dcfce7;
                color: #166534;
                padding: 6px 12px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 14px;
              ">${data.totalResets || 0}</span>
            </td>
          </tr>
        `;
      });

      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      summaryContainer.innerHTML = tableHTML;
    }, (error) => {
      console.error('Error loading device change summary:', error);
      summaryContainer.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444;"></i>
          <p style="margin-top: 12px; color: #64748b;">Error loading summary</p>
        </div>
      `;
    });
}

// Expose functions globally
window.showDeviceIDChangeModal = showDeviceIDChangeModal;
window.loadDeviceChangeSummary = loadDeviceChangeSummary;
window.updateOperatorSummary = updateOperatorSummary;

// Auto-load summary on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('deviceChangeSummaryContainer')) {
      loadDeviceChangeSummary();
    }
  });
} else {
  if (document.getElementById('deviceChangeSummaryContainer')) {
    loadDeviceChangeSummary();
  }
}