// Enhanced assets/js/it_service_order_form_modal.js

// Utility function to format date for input (if needed in future)
function formatDateForInput(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Enhanced rendering with modern UI (matching driver's trip ticket design, teal theme for IT)
function renderITServiceOrderForm(user = { username: "User ", firstName: "", lastName: "", department: "" }) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const today = formatDateForInput(new Date());

  return `
    <div id="itServiceModal" class="modal-overlay it-service-modal" style="
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
      
      <div class="modal-content it-service-content" style="
        background: linear-gradient(145deg, #ffffff, #f0fdfa);
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
        <button id="closeITServiceModal" class="close-btn" style="
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
        " aria-label="Close IT Service Order Form">
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
            background: linear-gradient(135deg, #0f172a, #0ea5a4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            IT Service Order Request
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Submit your IT support request for quick resolution
          </p>
        </div>

        <!-- Form -->
        <form id="itServiceForm" style="
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
              <i class="fas fa-user-tie" style="color: #0ea5a4; margin-right: 8px;"></i>
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
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
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
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., IT Department" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Position</label>
                <input type="text" name="position" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., System Administrator" />
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Contact (Email/Phone) <span style="color: #ef4444;">*</span></label>
                <input type="text" name="contact" required 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., john@example.com or +1-234-567-8900" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- SECTION 2: Service Request Details -->
          <section class="form-section">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-tools" style="color: #0ea5a4; margin-right: 8px;"></i>
              Service Request Details
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
                ">Type of Request <span style="color: #ef4444;">*</span></label>
                <select name="type" required 
                        style="
                          padding: 12px 16px;
                          border: 2px solid #e2e8f0;
                          border-radius: 12px;
                          font-size: 16px;
                          transition: all 0.3s ease;
                          background: white;
                        " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                        onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                        aria-required="true">
                  <option value="">Select Type</option>
                  <option value="Hardware Issue">Hardware Issue</option>
                  <option value="Software Installation">Software Installation</option>
                  <option value="Network Problem">Network Problem</option>
                  <option value="Account Access">Account Access</option>
                  <option value="Peripheral Setup">Peripheral Setup</option>
                  <option value="Other">Other</option>
                </select>
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Priority Level <span style="color: #ef4444;">*</span></label>
                <select name="priority" required 
                        style="
                          padding: 12px 16px;
                          border: 2px solid #e2e8f0;
                          border-radius: 12px;
                          font-size: 16px;
                          transition: all 0.3s ease;
                          background: white;
                        " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                        onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                        aria-required="true">
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Asset/Device Involved</label>
                <input type="text" name="asset" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Laptop Serial #123, Printer Model XYZ" />
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Location</label>
                <input type="text" name="location" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Main Office / Building A, Room 101" />
              </div>
              <div class="form-group" style="display: flex; flex-direction: column; grid-column: 1 / -1;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Problem / Request Description <span style="color: #ef4444;">*</span></label>
                <textarea name="description" rows="4" required 
                          style="
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 16px;
                            transition: all 0.3s ease;
                            background: white;
                            resize: vertical;
                            min-height: 100px;
                          " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                          onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                          placeholder="Provide a detailed description of the issue or request (e.g., 'Laptop screen flickers when connected to external monitor...')..."
                          maxlength="2000" aria-required="true"></textarea>
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
            <button type="button" id="cancelITForm" class="btn secondary-btn" style="
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
            <button type="submit" id="submitITService" class="btn primary-btn" style="
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              border: none;
              border-radius: 12px;
              background: linear-gradient(135deg, #0ea5a4, #0891b2);
              color: white;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 6px               -1px rgba(14, 165, 164, 0.2);
            " onmouseover="
              this.style.background = 'linear-gradient(135deg, #0891b2, #0e7490)';
              this.style.transform = 'translateY(-2px)';
              this.style.boxShadow = '0 8px 16px rgba(14, 165, 164, 0.3)';
            " onmouseout="
              this.style.background = 'linear-gradient(135deg, #0ea5a4, #0891b2)';
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 4px 6px -1px rgba(14, 165, 164, 0.2)';
            ">
              <i class="fas fa-paper-plane"></i>
              Submit Request
            </button>
          </div>
        </form>

        <!-- Loading Overlay -->
        <div id="itServiceLoading" class="loading-overlay" style="
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
              border-top: 4px solid #0ea5a4;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing your IT service request...</p>
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
        .it-service-content {
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
      .form-group textarea:invalid,
      .form-group select:invalid {
        border-color: #ef4444;
      }
      
      .field-error.show {
        display: block;
      }
      
      /* Button disabled state */
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
      
      /* Custom scrollbar */
      .it-service-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .it-service-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      
      .it-service-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      
      .it-service-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      
      /* Fade out animation for close */
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    </style>
  `;
}

// Enhanced attach logic with validation and Firebase integration
function attachITServiceOrderForm(user) {
  if (!user || !user.username) {
    console.error("No valid user provided for IT service order form.");
    return;
  }

  const modal = document.getElementById("itServiceModal");
  const form = document.getElementById("itServiceForm");
  const loadingOverlay = document.getElementById("itServiceLoading");
  const submitBtn = document.getElementById("submitITService");
  const closeBtn = document.getElementById("closeITServiceModal");
  const cancelBtn = document.getElementById("cancelITForm");

  if (!form || !modal) return;

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

    // Description validation (min 10 chars)
    const description = form.querySelector('[name="description"]').value.trim();
    if (description.length < 10) {
      isValid = false;
      const errorEl = form.querySelector('[name="description"] + .field-error');
      if (errorEl) {
        errorEl.textContent = 'Description must be at least 10 characters long';
        errorEl.classList.add('show');
        form.querySelector('[name="description"]').style.borderColor = '#ef4444';
        form.querySelector('[name="description"]').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      }
    }

    // Contact validation (basic email/phone check)
    const contact = form.querySelector('[name="contact"]').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!emailRegex.test(contact) && !phoneRegex.test(contact.replace(/\D/g, ''))) {
      isValid = false;
      const errorEl = form.querySelector('[name="contact"] + .field-error');
      if (errorEl) {
        errorEl.textContent = 'Please enter a valid email or phone number';
        errorEl.classList.add('show');
        form.querySelector('[name="contact"]').style.borderColor = '#ef4444';
        form.querySelector('[name="contact"]').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
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
      const formDataObj = {};
      for (let [key, value] of formData.entries()) {
        formDataObj[key] = typeof value === "string" ? value.toUpperCase().trim() : value;
      }

      const data = { 
        id: `IT-${Date.now()}`,
        username: user.username,
        ...formDataObj, 
        status: "Pending", 
        dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Save to Firestore
      if (!window.db) {
        throw new Error("Database not initialized.");
      }
      await window.db.collection("it_service_orders").doc(data.id).set(data);

      // Success handling
      loadingOverlay.style.display = "none";
      closeModal();

      if (window.Modal && window.Modal.show) {
        window.Modal.show(`IT Service Order submitted successfully!\nReference ID: ${data.id}`, "success");
      } else {
        alert(`✅ IT Service Order Submitted!\nReference ID: ${data.id}`);
      }

      console.log("IT Service Order saved:", data.id);

      // Optional: Send via Telegram if available
      if (window.TelegramConnect && typeof window.TelegramConnect.sendRequest === "function") {
        window.TelegramConnect.sendRequest(data, "IT Service Order");
      }

      // Refresh dashboard if user is on it
      if (window.mountDashboard && window.currentUser  ) {
        window.mountDashboard(window.currentUser  );
      }

      // Reset form
      form.reset();
      // Re-validate to reset errors
      validateForm();

    } catch (error) {
      console.error("Error submitting IT Service Order:", error);
      loadingOverlay.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';

      let errorMessage = "Failed to submit IT Service Order. Please try again.";
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
function mountITServiceOrderForm(user) {
  try {
    if (!user || !user.username) {
      console.error("No valid user provided for mountITServiceOrderForm.");
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Please log in to submit an IT service order.", "warning");
      }
      return;
    }

    // Close any existing modals
    if (typeof closeAllModals === "function") {
      closeAllModals();
    }

    // Remove existing IT service modal if present
    const existingModal = document.getElementById("itServiceModal");
    if (existingModal) {
      existingModal.remove();
    }

    // Render and insert
    const html = renderITServiceOrderForm(user);
    document.body.insertAdjacentHTML("beforeend", html);

    // Attach functionality
    attachITServiceOrderForm(user);

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

    // Focus first field for accessibility
    setTimeout(() => {
      const firstField = document.querySelector('#itServiceForm input[required]');
      if (firstField) firstField.focus();
    }, 100);

    console.log("IT Service Order form mounted successfully.");

  } catch (error) {
    console.error("Error mounting IT Service Order form:", error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Unable to load IT Service Order form. Please try again.", "error");
    } else {
      alert("Unable to load IT Service Order form. Please refresh the page.");
    }
  }
}

// Expose globally
window.mountITServiceOrderForm = mountITServiceOrderForm;

// Utility to close all modals (if not defined elsewhere)
if (typeof closeAllModals === "undefined") {
  window.closeAllModals = function() {
    document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
  };
}

// Additional fadeOut animation if needed (already in style, but ensure)
if (!document.querySelector('style[data-it-fadeout]')) {
  const style = document.createElement("style");
  style.setAttribute('data-it-fadeout', 'true');
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
  if (event.filename && event.filename.includes('it_service_order_form_modal.js')) {
    console.error('IT Service Order Form Error:', {
      message: event.message,
      line: event.lineno,
      error: event.error
    });
  }
});