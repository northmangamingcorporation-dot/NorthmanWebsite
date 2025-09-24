```javascript
// Enhanced assets/js/drivers_trip_ticket_form_modal.js

// Utility function to format date for input (if needed in future)
function formatDateForInput(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Enhanced rendering with modern UI (based on travel_order_form_modal.js design)
function renderDriversTripTicketForm(user = { username: "Driver", firstName: "", lastName: "", department: "" }) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const today = formatDateForInput(new Date());

  return `
    <div id="driversTripTicketModal" class="modal-overlay drivers-trip-ticket-modal" style="
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
      
      <div class="modal-content drivers-trip-content" style="
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
        <button id="closeDriversTripTicketModal" class="close-btn" style="
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
        " aria-label="Close Driver's Trip Ticket Form">
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
            Driver's Trip Ticket - Departure Approval
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Submit your departure details for official vehicle authorization
          </p>
        </div>

        <!-- Form -->
        <form id="driversTripTicketForm" style="
          display: flex;
          flex-direction: column;
          gap: 32px;
        ">
          
          <!-- SECTION 1: Driver & Vehicle Information -->
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
              <i class="fas fa-user-tie" style="color: #3b82f6; margin-right: 8px;"></i>
              Driver & Vehicle Information
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
                ">Name of Driver <span style="color: #ef4444;">*</span></label>
                <input type="text" name="driverName" value="${fullName}" required 
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
                ">Vehicle Type & Plate No. <span style="color: #ef4444;">*</span></label>
                <input type="text" name="vehicleInfo" required 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Sedan - ABC-123" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- SECTION 2: Passengers & Places -->
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
              <i class="fas fa-route" style="color: #3b82f6; margin-right: 8px;"></i>
              Passengers & Places
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
                ">Names of Authorized Passenger/s</label>
                <textarea name="authorizedPassengers" rows="3" 
                          style="
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 16px;
                            transition: all 0.3s ease;
                            background: white;
                            resize: vertical;
                            min-height: 80px;
                          " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                          onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                          placeholder="List authorized passengers (one per line, optional)"></textarea>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Place/s to be Visited</label>
                <input type="text" name="placesVisited" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Client Office, Conference Venue" />
              </div>
            </div>
          </section>

          <!-- SECTION 3: Departure Details -->
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
              <i class="fas fa-sign-out-alt" style="color: #3b82f6; margin-right: 8px;"></i>
              Departure Details
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
                ">Time of Departure</label>
                <input type="time" name="departureTime" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., 09:00" />
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Odometer Reading <span style="color: #ef4444;">*</span></label>
                <input type="number" name="departureOdometer" min="0" step="0.1" required 
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
                ">Mileage In</label>
                <input type="number" name="mileageIn" min="0" step="0.1" 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., 12.5 km/L" />
              </div>
              <div class="form-group" style="display: flex; flex-direction: column;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Proof (Upload Photo) <span style="color: #ef4444;">*</span></label>
                <input type="file" name="departureProof" accept="image/*" required 
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
                <div class="preview departurePreview" style="
                  margin-top: 8px;
                  width: 100px;
                  height: 100px;
                  border: 2px solid #e2e8f0;
                  border-radius: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  cursor: pointer;
                  background: #f8fafc;
                  transition: all 0.3s ease;
                " onclick="openImagePreview('');">
                  <i class="fas fa-camera" style="font-size: 24px; color: #94a3b8;"></i>
                  <span style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Upload Photo</span>
                </div>
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- SECTION 4: Purpose -->
          <section class="form-section">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-clipboard-list" style="color: #3b82f6; margin-right: 8px;"></i>
              Purpose
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
                ">Purpose of Trip <span style="color: #ef4444;">*</span></label>
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
                          placeholder="Describe the purpose of your trip (e.g., Delivery to client site, Official meeting)..."
                          maxlength="1000" aria-required="true"></textarea>
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
            </div>
          </section>

          <!-- Form Actions -->
          <div class="form-actions" style="             display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          ">
            <button type="button" id="cancelDriversTripTicket" class="btn secondary-btn" style="
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
            <button type="submit" id="submitDriversTripTicket" class="btn primary-btn" style="
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
              Submit Departure
            </button>
          </div>
        </form>

        <!-- Loading Overlay -->
        <div id="driversTripLoading" class="loading-overlay" style="
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
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing your departure request...</p>
          </div>
        </div>

        <!-- Fullscreen Image Preview Modal -->
        <div id="imagePreviewModal" class="image-preview-modal" style="
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 2000;
          justify-content: center;
          align-items: center;
          padding: 16px;
        ">
          <button id="closeImagePreview" class="close-image-btn" style="
            position: absolute;
            top: 20px;
            right: 30px;
            width: 40px;
            height: 40px;
            border: none;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            color: white;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          " onmouseover="
            this.style.background = 'rgba(255, 255, 255, 0.3)';
          " onmouseout="
            this.style.background = 'rgba(255, 255, 255, 0.2)';
          " aria-label="Close Image Preview">
            <i class="fas fa-times"></i>
          </button>
          <img id="previewImage" src="" style="
            max-width: 90%;
            max-height: 90%;
            transform: scale(1);
            transition: transform 0.2s ease;
            border-radius: 8px;
            cursor: grab;
          " alt="Preview Image" />
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
        .drivers-trip-content {
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
        
        #imagePreviewModal {
          padding: 8px;
        }
        
        #previewImage {
          max-width: 100%;
          max-height: 80%;
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
      
      /* Preview styles */
      .departurePreview:hover {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.05);
      }
      
      .departurePreview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      /* Button disabled state */
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
      
      /* Image preview interactions */
      #previewImage:hover {
        cursor: grab;
      }
      
      #previewImage:active {
        cursor: grabbing;
      }
      
      /* Custom scrollbar */
      .drivers-trip-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .drivers-trip-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      
      .drivers-trip-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      
      .drivers-trip-content::-webkit-scrollbar-thumb:hover {
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
function attachDriversTripTicketForm(user) {
  if (!user || !user.username) {
    console.error("No valid user provided for driver's trip ticket form.");
    return;
  }

  const modal = document.getElementById("driversTripTicketModal");
  const form = document.getElementById("driversTripTicketForm");
  const loadingOverlay = document.getElementById("driversTripLoading");
  const submitBtn = document.getElementById("submitDriversTripTicket");
  const closeBtn = document.getElementById("closeDriversTripTicketModal");
  const cancelBtn = document.getElementById("cancelDriversTripTicket");
  const fileInput = form.querySelector('input[name="departureProof"]');
  const previewDiv = form.querySelector('.departurePreview');
  const imageModal = document.getElementById("imagePreviewModal");
  const previewImage = document.getElementById("previewImage");
  const closeImagePreview = document.getElementById("closeImagePreview");

  if (!form || !modal) return;

  // Image preview variables
  let zoomLevel = 1;
  let isDragging = false;
  let startX, startY, translateX = 0, translateY = 0;

  // Close modal functions
  function closeModal() {
    modal.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modal.remove();
      imageModal.style.display = "none";  // Close preview if open
    }, 300);
  }

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (imageModal.style.display === "flex") {
        imageModal.style.display = "none";
      } else if (modal.contains(document.activeElement)) {
        closeModal();
      }
    }
  });

  // File upload preview
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Validate file type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      if (window.Modal && window.Modal.show) {
        window.Modal.show("Please upload an image file only.", "warning");
      } else {
        alert("Please upload an image file only.");
      }
      fileInput.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (window.Modal && window.Modal.show) {
        window.Modal.show("File size must be less than 5MB.", "warning");
      } else {
        alert("File size must be less than 5MB.");
      }
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewDiv.innerHTML = `
        <img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;" alt="Departure Proof Preview">
`;
      previewDiv.onclick = () => openImagePreview(e.target.result);
      previewDiv.style.cursor = "pointer";
      previewDiv.style.background = "white";
    };
    reader.readAsDataURL(file);
  });

  // Fullscreen image preview
  window.openImagePreview = (src) => {
    if (!src) return;
    previewImage.src = src;
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    previewImage.style.transform = `translate(0px, 0px) scale(1)`;
    imageModal.style.display = "flex";
    previewImage.focus();  // Accessibility
  };

  closeImagePreview.addEventListener("click", () => {
    imageModal.style.display = "none";
  });
  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) {
      imageModal.style.display = "none";
    }
  });

  // Zoom and pan for image preview
  imageModal.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY < 0 ? 0.1 : -0.1;
    if (zoomLevel < 0.5) zoomLevel = 0.5;
    if (zoomLevel > 3) zoomLevel = 3;
    previewImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
  }, { passive: false });

  previewImage.addEventListener("mousedown", (e) => {
    if (zoomLevel <= 1) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    previewImage.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    previewImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    previewImage.style.cursor = zoomLevel > 1 ? "grab" : "default";
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

    // File validation
    if (!fileInput.files || fileInput.files.length === 0) {
      isValid = false;
      const errorEl = fileInput.parentElement.querySelector('.field-error');
      if (errorEl) {
        errorEl.textContent = 'Please upload a proof photo';
        errorEl.classList.add('show');
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
  fileInput.addEventListener('change', validateForm);

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
        id: `DTT-${Date.now()}`,
        driverName: formData.get("driverName")?.toUpperCase().trim() || "",
        vehicleInfo: formData.get("vehicleInfo")?.toUpperCase().trim() || "",
        authorizedPassengers: formData.get("authorizedPassengers")?.trim() || "",
        placesVisited: formData.get("placesVisited")?.trim() || "",
        departureTime: formData.get("departureTime") || "",
        departureOdometer: parseFloat(formData.get("departureOdometer")) || 0,
        mileageIn: parseFloat(formData.get("mileageIn")) || 0,
        purpose: formData.get("purpose")?.trim() || "",
        username: user.username,
        status: "Pending",
        dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Handle file upload (store as base64 or send via Telegram; here we log for now)
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          data.departureProof = e.target.result;  // Base64 for Firestore (consider storage for large files)
          
          // Save to Firestore
          if (!window.db) {
            throw new Error("Database not initialized.");
          }
          await window.db.collection("drivers_trip_tickets").doc(data.id).set(data);

          // Success handling
          loadingOverlay.style.display = "none";
          closeModal();

          if (window.Modal && window.Modal.show) {
            window.Modal.show(`Driver's Trip Ticket submitted successfully!\nReference ID: ${data.id}`, "success");
          } else {
            alert(`✅
          