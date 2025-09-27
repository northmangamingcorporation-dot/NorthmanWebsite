// Enhanced assets/js/accomplishment_form_modal.js

// Utility function to format date for input (if needed in future)
function formatDateForInput(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Utility function to format time for input
function formatTimeForInput(date) {
  const d = new Date(date);
  return d.toTimeString().slice(0, 5); // HH:MM
}

// Enhanced rendering with modern UI (matching IT service design, teal theme for Accomplishments)
function renderAccomplishmentForm(user = { username: "User    ", firstName: "", lastName: "", department: "", position: "" }) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const today = formatDateForInput(new Date());
  const currentTime = formatTimeForInput(new Date());

  return `
    <div id="accomplishmentModal" class="modal-overlay accomplishment-modal" style="
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
      
      <div class="modal-content accomplishment-content" style="
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
        <button id="closeAccomplishmentModal" class="close-btn" style="
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
        " aria-label="Close Accomplishment Form">
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
            Accomplishment Report
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Log your service accomplishments with proof for records
          </p>
        </div>

        <!-- Form -->
        <form id="accomplishmentForm" enctype="multipart/form-data" style="
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
                ">Full Name <span style="color: #ef4444;">*</span></label>
                <input type="text" name="fullname" value="${fullName}" required 
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
                ">Position <span style="color: #ef4444;">*</span></label>
                <input type="text" name="position" value="${user.position || ''}" required 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., System Administrator" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <!-- Hidden uniquekey field -->
              <input type="hidden" name="uniquekey" value="${user.username || 'unknown'}" />
            </div>
          </section>

          <!-- SECTION 2: Accomplishment Details -->
          <section class="form-section">
            <h3 style="
              font-size: 20px;
              margin-bottom: 20px;
              color: #0f172a;
              font-weight: 600;
            ">
              <i class="fas fa-trophy" style="color: #0ea5a4; margin-right: 8px;"></i>
              Accomplishment Details
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
                ">Date of Service <span style="color: #ef4444;">*</span></label>
                <input type="date" name="dateOfService" value="${today}" required 
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
                ">Time of Service <span style="color: #ef4444;">*</span></label>
                <input type="time" name="timeOfService" value="${currentTime}" required 
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
                ">Service Type <span style="color: #ef4444;">*</span></label>
                <select name="serviceType" required 
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
                  <option value="Maintenance">Maintenance</option>
                  <option value="Repair">Repair</option>
                  <option value="Installation">Installation</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Training">Training</option>
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
                ">Location <span style="color: #ef4444;">*</span></label>
                <input type="text" name="location" required 
                       style="
                         padding: 12px 16px;
                         border: 2px solid #e2e8f0;
                         border-radius: 12px;
                         font-size: 16px;
                         transition: all 0.3s ease;
                         background: white;
                       " onfocus="this.style.borderColor='#0ea5a4'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 164, 0.1)';"
                       onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
                       placeholder="e.g., Main Office / Building A, Room 101" aria-required="true" />
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <div class="form-group" style="display: flex; flex-direction: column; grid-column: 1 / -1;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">Description of Service <span style="color: #ef4444;">*</span></label>
                <textarea name="descriptionOfService" rows="4" required 
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
                          placeholder="Provide a detailed description of the accomplishment (e.g., 'Completed network repair for 5 workstations...')..."
                          maxlength="2000" aria-required="true"></textarea>
                <div class="field-error" style="color: #ef4444; font-size: 14px; margin-top: 4px; display: none;"></div>
              </div>
              <!-- NEW: Enhanced Upload Proof Section with Drop Zone and Previews -->
              <div class="form-group" style="display: flex; flex-direction: column; grid-column: 1 / -1;">
                <label style="
                  font-weight: 600;
                  color: #374151;
                  margin-bottom: 8px;
                  font-size: 14px;
                                ">Upload Proof (Images) <span style="color: #ef4444;">*</span> (Multiple files allowed, max 5, images only)</label>
                
                <!-- Hidden file input (triggered by drop zone) -->
                <input type="file" id="fileInputHidden" name="uploadProof" multiple accept="image/*" required 
                       style="display: none;" />
                
                <!-- Drop Zone -->
                <div id="dropZone" class="drop-zone" style="
                  border: 2px dashed #cbd5e1;
                  border-radius: 12px;
                  padding: 40px 20px;
                  text-align: center;
                  background: #f8fafc;
                  transition: all 0.3s ease;
                  cursor: pointer;
                  position: relative;
                  min-height: 120px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  gap: 12px;
                ">
                  <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #94a3b8; transition: color 0.3s ease;"></i>
                  <p style="margin: 0; color: #64748b; font-weight: 500; font-size: 16px;">Drop images here or <span style="color: #0ea5a4; text-decoration: underline; cursor: pointer;">click to browse</span></p>
                  <small style="color: #9ca3af; font-size: 12px;">Upload up to 5 image files (max 5MB each) as proof of accomplishment. Supported: JPG, PNG, GIF.</small>
                  <div id="dropZoneError" style="color: #ef4444; font-size: 14px; margin-top: 8px; display: none;"></div>
                </div>
                
                <!-- Image Previews Container -->
                <div id="imagePreviews" class="image-previews" style="
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                  gap: 16px;
                  margin-top: 20px;
                  padding-top: 16px;
                  border-top: 1px solid #e2e8f0;
                "></div>
                
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
            <button type="button" id="cancelAccomplishmentForm" class="btn secondary-btn" style="
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
            <button type="submit" id="submitAccomplishment" class="btn primary-btn" style="
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
              box-shadow: 0 4px 6px -1px rgba(14, 165, 164, 0.2);
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
              Submit Accomplishment
            </button>
          </div>
        </form>

        <!-- Loading Overlay -->
        <div id="accomplishmentLoading" class="loading-overlay" style="
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
            <p style="margin: 0; color: #64748b; font-weight: 500;">Processing your accomplishment report...</p>
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
      
      /* Drop Zone Styles */
      .drop-zone.drag-over {
        border-color: #0ea5a4;
        background: rgba(14, 165, 164, 0.05);
      }
      .drop-zone.drag-over i {
        color: #0ea5a4;
      }
      
      /* Image Preview Styles */
      .image-preview {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background: white;
        transition: transform 0.2s ease;
      }
      .image-preview:hover {
        transform: scale(1.02);
      }
      .image-preview img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }
      .image-preview img:hover {
        opacity: 0.8;
      }
      .preview-remove {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 24px;
        height: 24px;
        border: none;
        background: rgba(239, 68, 68, 0.8);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.2s ease;
        z-index: 2;
      }
      .preview-remove:hover {
        background: #ef4444;
        transform: scale(1.1);
      }
      .preview-info {
        padding: 8px;
        background: #f8fafc;
        font-size: 12px;
        color: #64748b;
        text-align: center;
        word-break: break-word;
      }
      
      /* Full Image View Modal */
      #imageViewModal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1002;
        padding: 20px;
      }
      #imageViewContainer {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        overflow: hidden;
        border-radius: 8px;
      }
      #imageView {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        transform-origin: center center;
        transition: transform 0.1s ease;
        cursor: grab;
      }
      #imageView:active {
        cursor: grabbing;
      }
      .image-view-close {
        position: absolute;
        top: -50px;
        right: 0;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s ease;
        z-index: 3;
      }
      .image-view-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      .zoom-info {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
        border-radius: 4px;
        z-index: 3;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .accomplishment-content {
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
        
        .drop-zone {
          padding: 30px 16px;
          min-height: 100px;
        }
        
        .image-previews {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }
        
        #imageViewModal {
          padding: 10px;
        }
      }
      
      /* Form validation styles */
      .form-group input:invalid,
      .form-group textarea:invalid,
      .form-group select:invalid {
        border-color: #ef4444;
      }
      
      .field-error.show,
      #dropZoneError.show {
        display: block;
      }
      
      /* Button disabled state */
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
      
      /* Custom scrollbar */
      .accomplishment-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .accomplishment-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      
      .accomplishment-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      
      .accomplishment-content::-webkit-scrollbar-thumb:hover {
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

// Enhanced attach logic with validation, Firebase integration (details only), drag-and-drop, and image preview/zoom
function attachAccomplishmentForm(user) {
  if (!user || !user.username) {
    console.error("No valid user provided for accomplishment form.");
    return;
  }

  const modal = document.getElementById("accomplishmentModal");
  const form = document.getElementById("accomplishmentForm");
  const loadingOverlay = document.getElementById("accomplishmentLoading");
  const submitBtn = document.getElementById("submitAccomplishment");
  const closeBtn = document.getElementById("closeAccomplishmentModal");
  const cancelBtn = document.getElementById("cancelAccomplishmentForm");

  if (!form || !modal) return;

  // Selected files array (to handle removes, since input.files is read-only)
  let selectedFiles = [];
  const maxFiles = 5;
  const maxSize = 5 * 1024 * 1024; // 5MB

  // DOM elements for drop zone and previews
  const dropZone = document.getElementById("dropZone");
  const fileInputHidden = document.getElementById("fileInputHidden");
  const imagePreviews = document.getElementById("imagePreviews");
  const dropZoneError = document.getElementById("dropZoneError");
  const uploadError = form.querySelector('.field-error'); // General upload error

  // Close modal functions
  function closeModal() {
    modal.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modal.remove();
      // Clean up full image view if open
      const imageViewModal = document.getElementById("imageViewModal");
      if (imageViewModal) imageViewModal.remove();
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

  // Drag-and-Drop Functionality
  function setupDragAndDrop() {
    const dragEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];

    dragEvents.forEach(event => {
      dropZone.addEventListener(event, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(event => {
      dropZone.addEventListener(event, highlight, false);
    });

    ['dragleave', 'drop'].forEach(event => {
      dropZone.addEventListener(event, unhighlight, false);
    });

    function highlight(e) {
      dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
      dropZone.classList.remove('drag-over');
    }

    // Handle drop
    dropZone.addEventListener('drop', handleDrop, false);

    // Handle file selection via click
    dropZone.addEventListener('click', () => {
      fileInputHidden.click();
    });

    fileInputHidden.addEventListener('change', handleFiles);

    function handleDrop(e) {
      const files = e.dataTransfer.files;
      processFiles(files);
    }

    function handleFiles(e) {
      const files = e.target.files;
      processFiles(files);
    }

    function processFiles(files) {
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          showDropError('Only image files are allowed (JPG, PNG, GIF, etc.).');
          return false;
        }
        if (file.size > maxSize) {
          showDropError(`File "${file.name}" is too large. Max 5MB per file.`);
          return false;
        }
        return true;
      });

      if (selectedFiles.length + validFiles.length > maxFiles) {
        showDropError(`Maximum ${maxFiles} files allowed. You have ${selectedFiles.length} already.`);
        return;
      }

      selectedFiles = [...selectedFiles, ...validFiles];
      fileInputHidden.files = new DataTransfer().files; // Clear hidden input, we'll use selectedFiles for Telegram
      renderPreviews();
      validateForm(); // Re-validate
      clearDropError();
    }

    function showDropError(message) {
      if (dropZoneError) {
        dropZoneError.textContent = message;
        dropZoneError.classList.add('show');
      }
      setTimeout(clearDropError, 5000);
    }

    function clearDropError() {
      if (dropZoneError) {
        dropZoneError.classList.remove('show');
        dropZoneError.textContent = '';
      }
    }
  }

  // Render Image Previews