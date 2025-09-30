// Enhanced assets/js/ticket_input_modal.js - Modern Ticket Input Form
// Fixed: Stores in ticket_humanErr_report and checks duplicates by reference_code + teller

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

// Enhanced rendering with modern UI (IT-themed: blue gradients)
function renderTicketInputModal(user = { username: "Employee", firstName: "", lastName: "", department: "" }) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const today = formatDateForInput(new Date());

  return `
    <div id="ticketInputModal" class="modal-overlay ticket-input-modal" style="
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
      
      <div class="modal-content ticket-form-content" style="
        background: linear-gradient(145deg, #ffffff, #eff6ff);
        border-radius: 20px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 40px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.3);
        border: 1px solid rgba(59, 130, 246, 0.2);
        transform: translateY(20px);
        animation: slideIn 0.4s ease forwards;
      ">
        
        <!-- Enhanced Close Button -->
        <button id="closeTicketModal" class="close-btn" style="
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
        " aria-label="Close Ticket Input Modal">
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
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
          ">
            <i class="fas fa-paste" style="font-size: 36px; color: white;"></i>
          </div>
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
            Paste Ticket Details
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Paste your raw ticket text below. It will be automatically parsed and previewed.
          </p>
        </div>

        <!-- Processing Message -->
        <div id="processingMessage" style="display: none; color: #3b82f6; font-weight: 500; text-align: center; margin-bottom: 16px;">
          <i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>
          Submitting ticket...
        </div>

        <!-- Form -->
        <form id="ticketInputForm" style="
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
                ">Department</label>
                <input type="text" name="department" value="${user.department || ''}"
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
            </div>
          </section>

          <!-- SECTION 2: Ticket Input -->
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
              <i class="fas fa-clipboard-list" style="color: #3b82f6; margin-right: 8px;"></i>
              Raw Ticket Input
            </h3>
            <div class="form-group" style="display: flex; flex-direction: column;">
              <label style="
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
              ">Paste Ticket Details <span style="color: #ef4444;">*</span></label>
              <textarea name="ticketRaw" id="ticketRawInput" rows="6" required data-required="true"
                        style="
                          padding: 12px 16px;
                          border: 2px solid #e2e8f0;
                          border-radius: 12px;
                          font-size: 14px;
                          line-height: 1.5;
                          font-family: 'Courier New', monospace;
                          transition: all 0.3s ease;
                          background: #f8fafc;
                          resize: vertical;
                          min-height: 150px;
                        " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                        onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                        placeholder="Paste your ticket details here...&#10;Example:&#10;Ticket Code&#10;ABC123&#10;Reference Code&#10;ef31fb9dc29e4&#10;Teller&#10;DDN-165"
                        maxlength="5000" aria-required="true"></textarea>
              <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              <div class="char-counter" style="font-size: 12px; color: #9ca3af; text-align: right; margin-top: 4px;">0/5000</div>
            </div>
          </section>

          <!-- SECTION 3: Parsed Preview (Dynamic) -->
          <section class="form-section">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-eye" style="color: #3b82f6; margin-right: 8px;"></i>
              Parsed Preview
            </h3>
            <div id="parsedPreview" style="
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              min-height: 120px;
              transition: all 0.3s ease;
            ">
              <p style="color: #94a3b8; font-style: italic; margin: 0;">Paste ticket details above to see parsed data here...</p>
            </div>
            <div id="parseError" class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 8px; text-align: center; display: none;">Unable to parse ticket. Please check the format.</div>
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
            <button type="button" id="cancelTicketInput" class="btn secondary-btn" style="
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
            <button type="submit" id="submitTicketInput" class="btn primary-btn" disabled style="
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
        <div id="ticketFormLoading" class="loading-overlay" style="
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
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing ticket...</p>
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
        
        .ticket-form-content {
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
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      /* Parsed Preview Styles */
      #parsedPreview {
        border-left: 4px solid #3b82f6;
      }
      
      #parsedPreview.parsed {
        background: linear-gradient(135deg, #eff6ff, #dbeafe);
      }
      
      #parsedPreview ul {
        margin: 0;
        padding-left: 20px;
      }
      
      #parsedPreview li {
        margin-bottom: 8px;
        color: #0f172a;
        font-weight: 500;
      }
      
      #parsedPreview li strong {
        color: #3b82f6;
      }
      
      /* Button States */
      .btn.primary-btn:not(:disabled) {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
      
      .btn.primary-btn:not(:disabled):hover {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
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
      
      /* Custom Scrollbar */
      .ticket-form-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .ticket-form-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      
      .ticket-form-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      
      .ticket-form-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    </style>
  `;
}

// Show Ticket Input Modal
function showTicketInputModal() {
  const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  const user = JSON.parse(loggedInUser);
  if (!user || !user.username) {
    console.error("No valid user provided for showTicketInputModal.");
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Please log in to submit a ticket.", "warning");
    } else {
      alert("Please log in to submit a ticket.");
    }
    return;
  }

  if (typeof closeAllModals === "function") {
    closeAllModals();
  }

  const existingModal = document.getElementById("ticketInputModal");
  if (existingModal) {
    existingModal.remove();
  }

  const html = renderTicketInputModal(user);
  document.body.insertAdjacentHTML("beforeend", html);

  setTimeout(() => initializeTicketInputForm(user), 100);

  if (!document.querySelector('link[href*="fontawesome"]')) {
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    faLink.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
    faLink.crossOrigin = "anonymous";
    faLink.referrerPolicy = "no-referrer";
    document.head.appendChild(faLink);
  }

  setTimeout(() => {
    const textarea = document.querySelector('#ticketRawInput');
    if (textarea) textarea.focus();
  }, 200);

  console.log("Ticket Input Modal mounted successfully.");
}

// Initialize Ticket Input Form (Event Listeners & Validation)
function initializeTicketInputForm(user) {
  function waitForElements(callback, maxRetries = 10, delay = 50) {
    let retries = 0;
    function attempt() {
      const modal = document.getElementById("ticketInputModal");
      const form = document.getElementById("ticketInputForm");
      const submitBtn = document.getElementById("submitTicketInput");
      const cancelBtn = document.getElementById("cancelTicketInput");
      const closeBtn = document.getElementById("closeTicketModal");
      const loadingOverlay = document.getElementById("ticketFormLoading");
      const rawInput = document.getElementById("ticketRawInput");
      const parsedPreview = document.getElementById("parsedPreview");
      const parseError = document.getElementById("parseError");
      const charCounter = form.querySelector('.char-counter');

      if (modal && form && submitBtn && cancelBtn && closeBtn && loadingOverlay && rawInput && parsedPreview && parseError && charCounter) {
        callback({ modal, form, submitBtn, cancelBtn, closeBtn, loadingOverlay, rawInput, parsedPreview, parseError, charCounter });
      } else if (retries < maxRetries) {
        retries++;
        console.warn(`Ticket form elements not ready (retry ${retries}/${maxRetries})...`);
        setTimeout(attempt, delay);
      } else {
        console.error("Failed to find required ticket form elements after retries.");
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

  waitForElements(({ modal, form, submitBtn, cancelBtn, closeBtn, loadingOverlay, rawInput, parsedPreview, parseError, charCounter }) => {
    console.log("All ticket form elements attached successfully.");

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

    // Enhanced real-time parsing with better structured format detection
    function parseTicketInput(rawText) {
      if (!rawText.trim()) {
        parsedPreview.innerHTML = '<p style="color: #94a3b8; font-style: italic; margin: 0;">Paste ticket details above to see parsed data here...</p>';
        parsedPreview.classList.remove('parsed');
        parseError.style.display = 'none';
        return { data: {}, valid: false };
      }

      const lines = rawText.split(/\r?\n/).map(line => line.trim()).filter(line => line);
      const ticketData = {};

      // Detect structured format (label on one line, value on next)
      let isStructured = false;
      for (let i = 0; i < lines.length - 1; i++) {
        const current = lines[i];
        const next = lines[i + 1];
        if (/^[A-Za-z\s\(\)]+$/.test(current) && current.length < 50 && (next.includes('-') || next.length > 5 || /\d/.test(next))) {
          isStructured = true;
          break;
        }
      }

      if (isStructured) {
        // Parse structured format: label\nvalue\nlabel\nvalue...
        for (let i = 0; i < lines.length; i += 2) {
          const label = lines[i];
          const value = lines[i + 1] || '';
          if (label && value) {
            let key = label.toLowerCase()
              .replace(/\s*\(.*?\)\s*/g, '') // Remove parentheses content
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '');
            
            // Clean up value - remove trailing (Value) or similar
            let cleanValue = value.replace(/\s*\(.*?\)\s*$/g, '').trim();
            
            if (key && cleanValue) {
              ticketData[key] = cleanValue;
            }
          }
        }
      } else {
        // Original parsing: Handle "Key: Value" or "Key - Value" formats
        lines.forEach((line) => {
          const colonMatch = line.match(/^([^:]+?)\s*:\s*(.*)$/i);
          const dashMatch = line.match(/^([^:-]+?)\s*-\s*(.*)$/i);

          let key, value;
          if (colonMatch) {
            key = colonMatch[1].trim();
            value = colonMatch[2].trim();
          } else if (dashMatch) {
            key = dashMatch[1].trim();
            value = dashMatch[2].trim();
          } else {
            if (!ticketData.description) ticketData.description = '';
            ticketData.description += (ticketData.description ? '\n' : '') + line;
            return;
          }

          key = key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
          if (key) {
            ticketData[key] = value || 'N/A';
          }
        });
      }

      // Validate parsed data
      const hasEssentialData = ticketData.ticket_code || ticketData.reference_code || ticketData.transaction_id || ticketData.type || ticketData.description || Object.keys(ticketData).length > 0;
      if (!hasEssentialData) {
        parseError.textContent = 'No valid data found. Use structured format (label\\nvalue) or key-value pairs.';
        parseError.style.display = 'block';
        parsedPreview.classList.remove('parsed');
        return { data: {}, valid: false };
      } else {
        parseError.style.display = 'none';
      }

      // Generate preview HTML
      let previewHTML = '<ul>';
      Object.entries(ticketData).forEach(([key, value]) => {
        if (value && value !== 'N/A') {
          const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          previewHTML += `<li><strong>${displayKey}:</strong> ${value}</li>`;
        }
      });
      previewHTML += '</ul>';

      if (Object.keys(ticketData).length === 0) {
        previewHTML = '<p style="color: #94a3b8; font-style: italic; margin: 0;">No data parsed yet.</p>';
      }

      parsedPreview.innerHTML = previewHTML;
      parsedPreview.classList.add('parsed');

      console.log("Parsed Ticket Data:", ticketData);
      return { data: ticketData, valid: true };
    }

    function updateCharCounter() {
      const maxLength = 5000;
      const length = rawInput.value.length;
      charCounter.textContent = `${length}/${maxLength}`;
      
      if (length > maxLength * 0.9) charCounter.classList.add('warning');
      else if (length > maxLength * 0.95) charCounter.classList.add('danger');
      else charCounter.classList.remove('warning', 'danger');
    }

    rawInput.addEventListener('input', debounce((e) => {
      updateCharCounter();
      const { data, valid } = parseTicketInput(e.target.value);
      
      // Store parsed data with valid flag
      let hiddenData = form.querySelector('[name="parsedTicketData"]');
      if (!hiddenData) {
        hiddenData = document.createElement('input');
        hiddenData.type = 'hidden';
        hiddenData.name = 'parsedTicketData';
        form.appendChild(hiddenData);
      }
      hiddenData.value = JSON.stringify({ data, valid });
      
      validateForm();
    }, 200));

    rawInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        console.log('Enter pressed without Shift');
        e.preventDefault();
        const isFormValid = validateForm();
        const hasValue = rawInput.value.trim();
        console.log('Form valid:', isFormValid, 'Has value:', hasValue);
        if (isFormValid && hasValue) {
          console.log('Dispatching submit event');
          form.dispatchEvent(new Event('submit'));
        } else {
          console.log('Not submitting: form invalid or no value');
        }
      }
    });

    function validateForm() {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[data-required="true"]');
      
      form.querySelectorAll('.field-error').forEach(el => {
        el.classList.remove('show');
        el.style.display = 'none';
      });
      form.querySelectorAll('input, textarea').forEach(field => {
        if (!field.readOnly) {
          field.style.borderColor = '#e2e8f0';
          field.style.boxShadow = 'none';
        }
      });

      requiredFields.forEach(field => {
        const fieldContainer = field.closest('.form-group');
        const errorEl = fieldContainer ? fieldContainer.querySelector('.field-error') : null;
        
        if (!field.value.trim()) {
          isValid = false;
          if (!field.readOnly) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
          }
          if (errorEl) {
            errorEl.textContent = 'This field is required.';
            errorEl.classList.add('show');
            errorEl.style.display = 'block';
          }
        } else {
          if (!field.readOnly) {
            field.style.borderColor = '#3b82f6';
            field.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }
          if (errorEl) {
            errorEl.classList.remove('show');
            errorEl.style.display = 'none';
          }
        }
      });

      const parsedDataInput = form.querySelector('[name="parsedTicketData"]');
      let hasValidParsedData = false;
      
      if (parsedDataInput && parsedDataInput.value) {
        try {
          const parsed = JSON.parse(parsedDataInput.value);
          hasValidParsedData = parsed.valid === true;
          console.log('Parsed data validation:', { parsed, hasValidParsedData });
        } catch (e) {
          console.error('Error parsing ticket data:', e);
        }
      }

      if (isValid && rawInput.value.trim() && hasValidParsedData) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Ticket';
        submitBtn.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.title = 'Click to submit ticket';
        console.log('Form is valid and ready to submit');
      } else {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Complete Form First';
        submitBtn.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.title = 'Paste valid ticket details to enable submission.';
        console.log('Form validation failed:', { isValid, hasText: rawInput.value.trim(), hasValidParsedData });
      }

      return isValid && hasValidParsedData;
    }

    form.addEventListener('input', debounce(validateForm, 300));
    form.addEventListener('change', validateForm);

    updateCharCounter();
    validateForm();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showError('Please complete the form and paste valid ticket details.', 'warning');
        return;
      }

      const formData = new FormData(form);
      const rawText = formData.get('ticketRaw').trim();
      const parsedDataInput = form.querySelector('[name="parsedTicketData"]');
      
      if (!parsedDataInput || !parsedDataInput.value) {
        showError('No parsed data found. Please paste ticket details.', 'error');
        return;
      }
      
      let parsedTicketData;
      try {
        parsedTicketData = JSON.parse(parsedDataInput.value);
      } catch (e) {
        console.error('Error parsing ticket data:', e);
        showError('Unable to parse ticket details. Please try again.', 'error');
        return;
      }

      if (!parsedTicketData.valid) {
        showError('Unable to parse ticket details. Please check the format.', 'error');
        return;
      }

      const ticketData = {
        username: user.username || '',
        employeeName: formData.get('employeeName'),
        department: formData.get('department'),
        rawInput: rawText,
        parsedData: parsedTicketData.data,
        type: parsedTicketData.data.ticket_code ? 'Human Error' : (parsedTicketData.data.type || 'General'),
        description: parsedTicketData.data.description || parsedTicketData.data.remarks || 'N/A',
        submittedAt: new Date().toISOString(),
        submittedBy: window.currentUser?.uid || ''
      };

      const processingMessage = document.getElementById('processingMessage');
      if (processingMessage) processingMessage.style.display = 'block';
      loadingOverlay.style.display = 'flex';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      try {
        if (!window.db) {
          throw new Error('Database not initialized');
        }

        // Check for duplicates based on reference_code and teller
        const referenceCode = parsedTicketData.data.reference_code;
        const teller = parsedTicketData.data.teller;
        
        if (referenceCode && teller) {
          const duplicateSnapshot = await window.db.collection('ticket_humanErr_report')
            .where('parsedData.reference_code', '==', referenceCode)
            .where('parsedData.teller', '==', teller)
            .get();
          
          if (!duplicateSnapshot.empty) {
            throw new Error(`A ticket with Reference Code "${referenceCode}" and Teller "${teller}" already exists. Please check your submission.`);
          }
        } else {
          console.warn('Missing reference_code or teller for duplicate check:', { referenceCode, teller });
        }

        // Save to Firestore in ticket_humanErr_report collection
        const docRef = await window.db.collection('ticket_humanErr_report').add(ticketData);
        console.log('Ticket saved with ID:', docRef.id);

        const successMsg = document.createElement('div');
        successMsg.className = 'form-message success show';
        successMsg.innerHTML = `
          <i class="fas fa-check-circle" style="margin-right: 8px; color: #16a34a;"></i>
          Ticket submitted successfully! It will be reviewed by IT support.
        `;
        form.insertBefore(successMsg, form.firstElementChild);

        setTimeout(() => {
          form.reset();
          parsedPreview.innerHTML = '<p style="color: #94a3b8; font-style: italic; margin: 0;">Paste ticket details above to see parsed data here...</p>';
          parsedPreview.classList.remove('parsed');
          charCounter.textContent = '0/5000';
          if (typeof loadITRequests === 'function') loadITRequests();
          if (typeof addITRequest === 'function') addITRequest({...ticketData, id: docRef.id});
          // ✅ Remove the success message completely after delay
          successMsg.remove();
        }, 2000);

      } catch (error) {
        console.error('Error submitting ticket:', error);

        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-message error show';
        errorMsg.innerHTML = `
          <i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #dc2626;"></i>
          ${error.message || 'Error submitting ticket. Please try again.'}
        `;
        form.insertBefore(errorMsg, form.firstElementChild);

        setTimeout(() => errorMsg.remove(), 5000);
      } finally {
        loadingOverlay.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Ticket';
        if (processingMessage) processingMessage.style.display = 'none';
      }
    });
  });
}

function addITRequest(ticketData) {
  const tbody = document.getElementById("ticketsTable");
  if (!tbody) {
    console.warn("ticketsTable not found. Cannot update table.");
    return;
  }

  // Remove "No Data" row if present
  const noDataRow = tbody.querySelector(".no-data-row");
  if (noDataRow) noDataRow.remove();

  // Extract data from the correct structure
  const ticket_code = ticketData.parsedData?.ticket_code || ticketData.ticket_code || 'N/A';
  const teller = ticketData.parsedData?.teller || ticketData.teller || 'N/A';
  const type = ticketData.type || 'N/A';
  const employeeName = ticketData.employeeName || ticketData.username || 'Unknown';
  const submittedAt = ticketData.submittedAt;

  // Format the date
  let formattedDate = 'N/A';
  if (submittedAt) {
    try {
      if (submittedAt.toDate && typeof submittedAt.toDate === 'function') {
        formattedDate = new Date(submittedAt.toDate()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (submittedAt instanceof Date) {
        formattedDate = submittedAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (typeof submittedAt === 'number') {
        formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (typeof submittedAt === 'string') {
        formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.warn('Error formatting date:', error);
    }
  }

  // Create the new row
  const row = document.createElement("tr");
  row.style.cssText = "border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;";
  row.setAttribute("onmouseover", "this.style.backgroundColor='#f8fafc'");
  row.setAttribute("onmouseout", "this.style.backgroundColor='white'");
  
  row.innerHTML = `
    <td style="padding: 16px;">
      <span style="
        color: #0f172a; 
        font-weight: 600;
        font-family: 'Monaco', 'Courier New', monospace;
        background: #f1f5f9;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 13px;
      ">
        ${ticket_code}
      </span>
    </td>
    <td style="padding: 16px;">
      <span style="
        color: #dc2626;
        font-weight: 700;
        font-family: 'Monaco', 'Courier New', monospace;
        background: #fee2e2;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 13px;
      ">
        ${teller}
      </span>
    </td>
    <td style="padding: 16px;">
      <span style="
        color: #7c3aed;
        background: #ede9fe;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
      ">
        ${type}
      </span>
    </td>
    <td style="padding: 16px; color: #475569; font-weight: 500;">
      ${employeeName}
    </td>
    <td style="padding: 16px; color: #64748b; font-size: 14px;">
      <i class="fas fa-calendar-alt" style="margin-right: 6px; color: #94a3b8;"></i>
      ${formattedDate}
    </td>
  `;

  // Insert at the top
  tbody.insertBefore(row, tbody.firstChild);

  console.log("Ticket added to table:", ticketData);
}

// View IT Request Details
function viewITRequestDetails(id) {
  console.log('Viewing details for ticket ID:', id);

  if (!window.db) {
    console.error('Database not initialized');
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Database not available.', 'error');
    } else {
      alert('Database not available.');
    }
    return;
  }

  window.db.collection('ticket_humanErr_report').doc(id).get().then((doc) => {
    if (doc.exists) {
      const ticketData = { ...doc.data(), id: doc.id };
      showTicketDetailsModal(ticketData);
    } else {
      console.error('No such ticket!');
      if (window.Modal && window.Modal.show) {
        window.Modal.show('Ticket not found.', 'error');
      } else {
        alert('Ticket not found.');
      }
    }
  }).catch((error) => {
    console.error('Error getting ticket:', error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error loading ticket details.', 'error');
    } else {
      alert('Error loading ticket details.');
    }
  });
}

// Show Ticket Details Modal
function showTicketDetailsModal(ticketData) {
  if (typeof closeAllModals === "function") {
    closeAllModals();
  }

  const existingModal = document.getElementById("ticketDetailsModal");
  if (existingModal) {
    existingModal.remove();
  }

  const html = renderTicketDetailsModal(ticketData);
  document.body.insertAdjacentHTML("beforeend", html);

  setTimeout(() => initializeTicketDetailsModal(), 100);

  console.log("Ticket Details Modal mounted successfully.");
}

// Render Ticket Details Modal
function renderTicketDetailsModal(ticketData) {
  const submittedAt = new Date(ticketData.submittedAt).toLocaleString();
  const status = ticketData.status || 'pending';
  const type = ticketData.parsedData?.type || ticketData.type || 'General';
  const description = ticketData.description || ticketData.parsedData?.description || 'N/A';
  const employeeName = ticketData.employeeName || ticketData.username || 'Unknown';
  const department = ticketData.department || 'N/A';

  let parsedDetails = '';
  if (ticketData.parsedData) {
    parsedDetails = '<ul>';
    Object.entries(ticketData.parsedData).forEach(([key, value]) => {
      if (value && value !== 'N/A') {
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        parsedDetails += `<li><strong>${displayKey}:</strong> ${value}</li>`;
      }
    });
    parsedDetails += '</ul>';
  }

  return `
    <div id="ticketDetailsModal" class="modal-overlay ticket-details-modal" style="
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

      <div class="modal-content ticket-details-content" style="
        background: linear-gradient(145deg, #ffffff, #eff6ff);
        border-radius: 20px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 40px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.3);
        border: 1px solid rgba(59, 130, 246, 0.2);
        transform: translateY(20px);
        animation: slideIn 0.4s ease forwards;
      ">

        <button id="closeDetailsModal" class="close-btn" style="
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
        " aria-label="Close Ticket Details Modal">
          <i class="fas fa-times"></i>
        </button>

        <div class="details-header" style="
          text-align: center;
          margin-bottom: 32px;
          animation: logoFloat 0.6s ease forwards;
        ">
          <div style="
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
          ">
            <i class="fas fa-eye" style="font-size: 36px; color: white;"></i>
          </div>
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
            Ticket Details
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Submitted on ${submittedAt}
          </p>
        </div>

        <div class="details-content" style="
          display: flex;
          flex-direction: column;
          gap: 24px;
        ">

          <div class="details-row" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          ">
            <div>
              <h3 style="margin: 0 0 4px 0; color: #0f172a; font-weight: 600;">${type}</h3>
            </div>
            <span class="status-badge" style="
              background: ${status === 'pending' ? 'rgba(251, 191, 36, 0.15)' : status === 'resolved' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
              color: ${status === 'pending' ? '#d97706' : status === 'resolved' ? '#16a34a' : '#dc2626'};
              border: 1px solid ${status === 'pending' ? 'rgba(251, 191, 36, 0.3)' : status === 'resolved' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
            ">${status}</span>
          </div>

          <div class="details-section">
            <h4 style="
              font-size: 18px;
              margin-bottom: 16px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-user" style="color: #3b82f6; margin-right: 8px;"></i>
              Employee Information
            </h4>
            <div class="info-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 16px;
            ">
              <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <strong style="color: #3b82f6;">Name:</strong> ${employeeName}
              </div>
              <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <strong style="color: #3b82f6;">Department:</strong> ${department}
              </div>
            </div>
          </div>

          <div class="details-section">
            <h4 style="
              font-size: 18px;
              margin-bottom: 16px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-list" style="color: #3b82f6; margin-right: 8px;"></i>
              Parsed Details
            </h4>
            <div style="
              padding: 16px;
              background: #f8fafc;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              min-height: 100px;
            ">
              ${parsedDetails || '<p style="color: #94a3b8; font-style: italic; margin: 0;">No additional details parsed.</p>'}
            </div>
          </div>

          <div class="details-section">
            <h4 style="
              font-size: 18px;
              margin-bottom: 16px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-file-alt" style="color: #3b82f6; margin-right: 8px;"></i>
              Raw Input
            </h4>
            <div style="
              padding: 16px;
              background: #f8fafc;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              font-family: 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.5;
              white-space: pre-wrap;
              max-height: 200px;
              overflow-y: auto;
            ">
              ${ticketData.rawInput || 'N/A'}
            </div>
          </div>

        </div>

        <div class="details-actions" style="
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        ">
          <button id="closeDetailsBtn" class="btn secondary-btn" style="
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
            Close
          </button>
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

      .ticket-details-content::-webkit-scrollbar {
        width: 8px;
      }

      .ticket-details-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }

      .ticket-details-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }

      .ticket-details-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      @media (max-width: 768px) {
        .ticket-details-content {
          padding: 24px 20px;
          margin: 16px;
        }

        .details-header h2 {
          font-size: 24px;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .details-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    </style>
  `;
}

// Initialize Ticket Details Modal
function initializeTicketDetailsModal() {
  const modal = document.getElementById("ticketDetailsModal");
  const closeBtn = document.getElementById("closeDetailsBtn");
  const closeModalBtn = document.getElementById("closeDetailsModal");

  if (!modal || !closeBtn || !closeModalBtn) {
    console.error("Ticket details modal elements not found.");
    return;
  }

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

  closeBtn.addEventListener('click', closeModal);
  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  console.log("Ticket details modal initialized.");
}

// Expose functions globally
window.showTicketInputModal = showTicketInputModal;
window.viewITRequestDetails = viewITRequestDetails;
window.addITRequest = addITRequest;

// Render individual teller ranking item
function renderTellerRankingItem(rank, teller, count, isTopError = false) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = rank <= 3 ? medals[rank - 1] : `${rank}.`;
  
  const bgColor = isTopError 
    ? 'linear-gradient(135deg, #fee2e2, #fecaca)' 
    : rank <= 3 
      ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
      : '#ffffff';
  
  const borderColor = isTopError ? '#ef4444' : rank <= 3 ? '#fbbf24' : '#e5e7eb';
  
  return `
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: ${bgColor};
      border: 1px solid ${borderColor};
      border-radius: 8px;
      transition: all 0.2s ease;
    " onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="
          font-size: 20px;
          font-weight: 700;
          min-width: 32px;
          text-align: center;
        ">${medal}</span>
        <span style="
          font-family: 'Monaco', 'Courier New', monospace;
          font-weight: 700;
          color: #0f172a;
          font-size: 15px;
        ">${teller}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="
          background: ${isTopError ? '#dc2626' : '#f59e0b'};
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
        ">${count} ${count === 1 ? 'error' : 'errors'}</span>
        ${isTopError ? '<i class="fas fa-exclamation-triangle" style="color: #dc2626; font-size: 18px;"></i>' : ''}
      </div>
    </div>
  `;
}

// Update teller rankings display
function updateTellerRankings(tickets) {
  const rankingsList = document.getElementById('tellerRankingsList');
  if (!rankingsList) return;

  // Count tickets per teller - extract from parsedData
  const tellerCounts = {};
  tickets.forEach(ticket => {
    const teller = ticket.parsedData?.teller || ticket.teller || 'Unknown';
    tellerCounts[teller] = (tellerCounts[teller] || 0) + 1;
  });

  // Convert to array and sort by count (descending)
  const sortedTellers = Object.entries(tellerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 tellers

  if (sortedTellers.length === 0) {
    rankingsList.innerHTML = `
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        No data available yet
      </p>
    `;
    return;
  }

  const topCount = sortedTellers[0][1];
  
  let html = '';
  sortedTellers.forEach(([teller, count], index) => {
    const rank = index + 1;
    const isTopError = count === topCount && topCount >= 5; // Flag if top error and has 5+ reports
    html += renderTellerRankingItem(rank, teller, count, isTopError);
  });

  rankingsList.innerHTML = html;
}

// Render ticket row
function renderTicketRow(ticketData) {
  // Extract data from the correct structure
  const ticket_code = ticketData.parsedData?.ticket_code || ticketData.ticket_code;
  const teller = ticketData.parsedData?.teller || ticketData.teller;
  const type = ticketData.type;
  const employeeName = ticketData.employeeName;
  const submittedAt = ticketData.submittedAt;
  const id = ticketData.id;
  
  // Format the date
  let formattedDate = 'N/A';
  
  if (submittedAt) {
    try {
      if (submittedAt.toDate && typeof submittedAt.toDate === 'function') {
        formattedDate = new Date(submittedAt.toDate()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (submittedAt instanceof Date) {
        formattedDate = submittedAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (typeof submittedAt === 'number') {
        formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (typeof submittedAt === 'string') {
        formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.warn('Error formatting date:', error);
    }
  }
  
  return `
    <tr style="
      border-bottom: 1px solid #e2e8f0; 
      transition: background-color 0.2s;
    " 
    onmouseover="this.style.backgroundColor='#f8fafc'" 
    onmouseout="this.style.backgroundColor='white'">
      <td style="padding: 16px;" onclick="viewITRequestDetails('${id}')">
        <span style="
          color: #0f172a; 
          font-weight: 600;
          font-family: 'Monaco', 'Courier New', monospace;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 13px;
        ">
          ${ticket_code || 'N/A'}
        </span>
      </td>
      <td style="padding: 16px;">
        <span style="
          color: #dc2626;
          font-weight: 700;
          font-family: 'Monaco', 'Courier New', monospace;
          background: #fee2e2;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 13px;
        ">
          ${teller || 'N/A'}
        </span>
      </td>
      <td style="padding: 16px;">
        <span style="
          color: #7c3aed;
          background: #ede9fe;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
        ">
          ${type || 'N/A'}
        </span>
      </td>
      <td style="padding: 16px; color: #475569; font-weight: 500;">
        ${employeeName || 'N/A'}
      </td>
      <td style="padding: 16px; color: #64748b; font-size: 14px;">
        <i class="fas fa-calendar-alt" style="margin-right: 6px; color: #94a3b8;"></i>
        ${formattedDate}
      </td>
    </tr>
  `;
}

// Store loaded ticket IDs to track what's already in the table
const loadedTicketIds = new Set();
// Load tickets from Firestore with real-time updates
function loadTickets() {
  const tbody = document.getElementById("ticketsTable");
  if (!tbody) {
    console.warn("ticketsTable not found.");
    return;
  }
  
  // Show loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="5" style="padding: 40px; text-align: center;">
        <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #10b981;"></i>
        <p style="margin-top: 16px; color: #64748b;">Loading tickets...</p>
      </td>
    </tr>
  `;

  setTimeout(() => {
    if (!window.db) {
      console.error('Database not initialized');
      tbody.innerHTML = `
        <tr class="no-data-row">
          <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
              <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #fee2e2, #fecaca);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <i class="fas fa-exclamation-triangle" style="font-size: 36px; color: #ef4444;"></i>
              </div>
              <div>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                  Database not initialized
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                  Please refresh the page or contact support
                </p>
              </div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    // Use real-time listener with docChanges for efficient updates
    window.db.collection('ticket_humanErr_report')
      .orderBy('submittedAt', 'desc')
      .limit(100)
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                  <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <i class="fas fa-clipboard-list" style="font-size: 36px; color: #10b981;"></i>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                      No tickets yet
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                      Click "New Ticket" to paste and analyze a ticket
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          `;
          loadedTicketIds.clear();
          updateTellerRankings([]);
          return;
        }

        // Remove no-data row if exists
        const noDataRow = tbody.querySelector('.no-data-row');
        if (noDataRow) noDataRow.remove();

        // Track all tickets for rankings
        const allTickets = [];
        
        // Check if this is initial load
        const isInitialLoad = loadedTicketIds.size === 0;
        
        if (isInitialLoad) {
          // Initial load: build entire table in correct order
          let html = '';
          snapshot.forEach((doc) => {
            const ticketData = { ...doc.data(), id: doc.id };
            allTickets.push(ticketData);
            loadedTicketIds.add(doc.id);
            
            const rowHtml = renderTicketRow(ticketData);
            html += rowHtml.replace(/id="ticket-row-[^"]*"/, `id="ticket-row-${doc.id}"`);
          });
          tbody.innerHTML = html;
          console.log('Initial load: added', snapshot.size, 'tickets');
        } else {
          // Real-time updates: process only changes
          snapshot.docChanges().forEach((change) => {
            const doc = change.doc;
            const ticketData = { ...doc.data(), id: doc.id };
            
            if (change.type === 'added') {
              // Only add if not already loaded
              if (!loadedTicketIds.has(doc.id)) {
                const newRow = document.createElement('tr');
                newRow.id = `ticket-row-${doc.id}`;
                newRow.innerHTML = renderTicketRow(ticketData).replace(/<\/?tr[^>]*>/g, '');
                newRow.style.animation = 'slideInFromTop 0.4s ease-out';
                // Insert at the beginning (since orderBy desc)
                tbody.insertBefore(newRow, tbody.firstChild);
                loadedTicketIds.add(doc.id);
                
                console.log('New ticket added:', doc.id);
              }
            } else if (change.type === 'modified') {
              // Update existing row
              const existingRow = document.getElementById(`ticket-row-${doc.id}`);
              if (existingRow) {
                existingRow.innerHTML = renderTicketRow(ticketData).replace(/<\/?tr[^>]*>/g, '');
                existingRow.style.animation = 'pulse 0.3s ease';
                console.log('Ticket updated:', doc.id);
              }
            } else if (change.type === 'removed') {
              // Remove row
              const existingRow = document.getElementById(`ticket-row-${doc.id}`);
              if (existingRow) {
                existingRow.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => existingRow.remove(), 300);
                loadedTicketIds.delete(doc.id);
                console.log('Ticket removed:', doc.id);
              }
            }
          });
        }
        
        // Collect all current tickets for rankings
        snapshot.forEach((doc) => {
          allTickets.push({ ...doc.data(), id: doc.id });
        });
        
        // Update teller rankings
        updateTellerRankings(allTickets);
        
        console.log(`Total tickets: ${snapshot.size}`);
      }, (error) => {
        console.error('Error loading tickets:', error);
        tbody.innerHTML = `
          <tr class="no-data-row">
            <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div style="
                  width: 80px;
                  height: 80px;
                  background: linear-gradient(135deg, #fee2e2, #fecaca);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <i class="fas fa-exclamation-triangle" style="font-size: 36px; color: #ef4444;"></i>
                </div>
                <div>
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                    Error loading tickets
                  </p>
                  <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                    ${error.message || 'Please try again later'}
                  </p>
                </div>
              </div>
            </td>
          </tr>
        `;
      });
  }, 500);
}

// Call loadTickets when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTickets);
} else {
  loadTickets();
}

// Expose loadTickets globally
window.loadTickets = loadTickets;

// Add CSS animations for smooth row additions
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      background-color: white;
    }
    50% {
      background-color: #dbeafe;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translateX(20px);
    }
  }
`;
document.head.appendChild(styleSheet);

// Combined Firestore listener + rankings with smooth updates
function listenAndShowTellerRankings() {
  const rankingsList = document.getElementById('tellerRankingsList');
  if (!rankingsList || !window.db) return;

  window.db.collection('ticket_humanErr_report')
    .orderBy('submittedAt', 'desc')
    .limit(100)
    .onSnapshot((snapshot) => {
      if (snapshot.empty) {
        rankingsList.innerHTML = `
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            No teller data available yet
          </p>
        `;
        return;
      }

      const tellerCounts = {};
      snapshot.forEach((doc) => {
        const ticket = doc.data();
        const teller = ticket.parsedData?.teller || ticket.teller || 'Unknown';
        tellerCounts[teller] = (tellerCounts[teller] || 0) + 1;
      });

      // Sort by count (desc) & keep Top 10
      const sortedTellers = Object.entries(tellerCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      if (sortedTellers.length === 0) {
        rankingsList.innerHTML = `
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            No teller data available yet
          </p>
        `;
        return;
      }

      const topCount = sortedTellers[0][1];
      
      // Get existing rankings for comparison
      const existingRankings = Array.from(rankingsList.children)
        .map(el => el.getAttribute('data-teller'));
      
      const newRankings = sortedTellers.map(([teller]) => teller);
      
      // Check if rankings changed
      const rankingsChanged = JSON.stringify(existingRankings) !== JSON.stringify(newRankings);
      
      if (rankingsChanged) {
        // Fade out old rankings
        rankingsList.style.animation = 'fadeOutScale 0.3s ease';
        
        setTimeout(() => {
          let html = '';
          sortedTellers.forEach(([teller, count], index) => {
            const rank = index + 1;
            const isTopError = count === topCount && topCount >= 5;
            html += renderTellerRankingItem(rank, teller, count, isTopError);
          });
          
          rankingsList.innerHTML = html;
          rankingsList.style.animation = 'fadeInScale 0.3s ease';
          
          // Add data-teller attribute for tracking
          Array.from(rankingsList.children).forEach((el, index) => {
            if (sortedTellers[index]) {
              el.setAttribute('data-teller', sortedTellers[index][0]);
            }
          });
        }, 300);
      } else {
        // Just update counts without animation
        sortedTellers.forEach(([teller, count], index) => {
          const existingItem = rankingsList.children[index];
          if (existingItem && existingItem.getAttribute('data-teller') === teller) {
            // Update count only
            const countBadge = existingItem.querySelector('span:last-child span');
            if (countBadge) {
              const newText = `${count} ${count === 1 ? 'error' : 'errors'}`;
              if (countBadge.textContent !== newText) {
                countBadge.textContent = newText;
                countBadge.style.animation = 'pulse 0.3s ease';
              }
            }
          }
        });
      }
    });
}

window.listenAndShowTellerRankings = listenAndShowTellerRankings;