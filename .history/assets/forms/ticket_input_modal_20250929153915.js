// Enhanced assets/js/ticket_input_modal.js - Modern Ticket Input Form

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
                        placeholder="Paste your ticket details here...&#10;Example:&#10;Ticket ID: ABC123&#10;Type: Hardware Issue&#10;Description: Laptop not turning on&#10;Priority: High"
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
function showTicketInputModal(user = window.currentUser  ) {
  if (!user || !user.username) 