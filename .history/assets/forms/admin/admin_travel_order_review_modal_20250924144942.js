// --- Render Admin Travel Order Modal (enhanced design with modern styling) ---
function renderAdminTravelOrderModal() {
  return `
    <div id="adminTravelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);
                display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1100;
                backdrop-filter: blur(8px); animation: fadeInModal 0.3s ease;">
      
      <div style="background:#ffffff; border-radius:16px; max-width:950px; width:100%; max-height:90vh; overflow-y:auto;
                  padding:32px; position:relative; box-shadow:0 20px 40px rgba(0,0,0,0.15); 
                  border:1px solid rgba(59,130,246,0.1); animation: slideUp 0.3s ease;">
        
        <!-- Close -->
        <button id="closeAdminTravelOrderModal"
                style="position:absolute; top:16px; right:16px; width:40px; height:40px; border:none; 
                       background:rgba(59,130,246,0.1); border-radius:50%; cursor:pointer; font-size:18px; 
                       color:#64748b; display:flex; align-items:center; justify-content:center; 
                       transition: all 0.2s ease; z-index:10;">
          <i class="fas fa-times"></i>
        </button>
        
        <div style="text-align:center; margin-bottom:8px;">
          <div style="width:60px; height:60px; background:linear-gradient(135deg, #3b82f6, #60a5fa); 
                      border-radius:50%; display:flex; align-items:center; justify-content:center; 
                      margin:0 auto 16px; color:white; font-size:24px;">
            <i class="fas fa-plane"></i>
          </div>
          <h2 style="font-size:24px; color:#1e293b; margin:0 0 24px 0; font-weight:700; 
                     background:linear-gradient(135deg, #3b82f6, #1d4ed8); -webkit-background-clip:text; 
                     -webkit-text-fill-color:transparent; background-clip:text;">
            Review & Update Travel Order
          </h2>
        </div>

        <form id="adminTravelOrderForm" style="display:flex; flex-direction:column; gap:28px;">
          
          <!-- Employee Info -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-user-tie"></i> Employee Information
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Employee Name</label>
                <input name="employeeName" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Department</label>
                <input name="department" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Date Filed</label>
                <input name="dateFiled" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
            </div>
          </div>

          <!-- Travel Details -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-route"></i> Travel Details
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Travel Date</label>
                <input name="travelDate" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">From</label>
                <input name="travelFrom" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">To</label>
                <input name="travelTo" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-clock"></i> Schedule
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Time Out</label>
                <input name="timeOut" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Time In</label>
                <input name="timeIn" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
            </div>
          </div>

          <!-- Passengers -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-users"></i> Passengers
            </h3>
            <div style="display:flex; flex-direction:column;">
              <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Passenger List</label>
              <textarea name="passengers" rows="4" disabled
                        style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                               background:#f9fafb; color:#374151; font-size:14px; resize:vertical; 
                               min-height:100px; transition:all 0.2s ease; font-family:inherit;"></textarea>
            </div>
          </div>

          <!-- Vehicle & Purpose -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-car"></i> Vehicle & Purpose
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Car Unit</label>
                <input name="carUnit" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column; grid-column:1/-1;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Purpose</label>
                <textarea name="purpose" rows="4" disabled
                          style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                                 background:#f9fafb; color:#374151; font-size:14px; resize:vertical; 
                                 min-height:100px; transition:all 0.2s ease; font-family:inherit;"></textarea>
              </div>
            </div>
          </div>

          <!-- Admin Controls -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-cog"></i> Admin Action
            </h3>
            <div style="display:flex; flex-direction:column; gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Assign Staff</label>
                <select id="assignStaff" 
                        style="padding:12px 16px; border-radius:8px; border:2px solid #e2e8f0; 
                               background:#ffffff; color:#374151; font-size:14px; transition:all 0.2s ease; 
                               cursor:pointer; font-weight:500;">
                  <option value="">-- Select Staff Member --</option>
                </select>
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Update Status</label>
                <select id="updateStatus" 
                        style="padding:12px 16px; border-radius:8px; border:2px solid #e2e8f0; 
                               background:#ffffff; color:#374151; font-size:14px; transition:all 0.2s ease; 
                               cursor:pointer; font-weight:500;">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Additional Remarks</label>
                <textarea id="adminRemarks" placeholder="Enter any special instructions or notes..." 
                          rows="4" 
                          style="padding:12px 16px; border-radius:8px; border:2px solid #e2e8f0; 
                                 background:#ffffff; color:#374151; font-size:14px; resize:vertical; 
                                 min-height:100px; transition:all 0.2s ease; font-family:inherit;"></textarea>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex; justify-content:flex-end; gap:16px; padding-top:20px; 
                      border-top:1px solid #e2e8f0; margin-top:8px;">
            <button type="button" id="cancelAdminTravelOrder"
                    style="padding:12px 24px; border-radius:8px; background:#f1f5f9; color:#64748b; 
                           border:none; font-weight:500; cursor:pointer; transition:all 0.2s ease; 
                           display:flex; align-items:center; gap:8px;">
              <i class="fas fa-times"></i> Cancel
            </button>
            <button type="submit"
                    style="padding:12px 24px; border-radius:8px; background:linear-gradient(135deg, #3b82f6, #1d4ed8); 
                           color:white; font-weight:500; border:none; cursor:pointer; transition:all 0.2s ease; 
                           display:flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(59,130,246,0.3);">
              <i class="fas fa-save"></i> Update Order
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Injected animations (one-time) -->
    <style id="admin-travel-modal-animations">
      @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      #adminTravelOrderModal input:focus, #adminTravelOrderModal select:focus, #adminTravelOrderModal textarea:focus {
        outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
      }
      #adminTravelOrderModal button:hover { transform: translateY(-1px); }
      #closeAdminTravelOrderModal:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
      #cancelAdminTravelOrder:hover { background: #e2e8f0; }
      #adminTravelOrderForm button[type=submit]:hover { box-shadow: 0 6px 16px rgba(59,130,246,0.4); }
      @media (max-width: 768px) {
        #adminTravelOrderModal div[style*="grid"] { grid-template-columns: 1fr !important; }
        #adminTravelOrderModal { padding: 8px; }
        #adminTravelOrderModal > div { padding: 20px; margin: 8px; }
      }
    </style>
  `;
}

// --- Attach Logic ---
function attachAdminTravelOrderModal() {
  const modal = document.getElementById("adminTravelOrderModal");
  const form = document.getElementById("adminTravelOrderForm");

  // Enhanced close button with icon support
  const closeBtn = document.getElementById("closeAdminTravelOrderModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      // Remove animations style if needed
      const animStyle = document.getElementById("admin-travel-modal-animations");
      if (animStyle) animStyle.remove();
        });
  }

  document.getElementById("cancelAdminTravelOrder").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const staffVal = document.getElementById("assignStaff").value;
    const status = document.getElementById("updateStatus").value;
    const remarks = document.getElementById("adminRemarks").value.trim();

    if (!status) {
      showNotification("Please select a status to update.", "warning");
      return;
    }

    showNotification("Updating Travel Order...", "info");

    const { orderData, admin } = modal.currentContext;
    const [staffName, staffPos] = staffVal ? staffVal.split("|") : [null, null];

    try {
      await db.collection("travel_orders").doc(orderData.id).update({
        status,
        assignedStaff: staffName || null,
        assignedPosition: staffPos || null,
        reviewedBy: admin.username || admin.firstName,
        remarks,
        updatedAt: db.FieldValue.serverTimestamp()
      });

      modal.style.display = "none";
      showNotification(`✅ Travel Order updated (Status: ${status})`, "success");
      
      // Refresh dashboard data if available (e.g., travel orders table)
      if (typeof loadTravelOrders === 'function') {
        loadTravelOrders();
      } else if (typeof loadOrders === 'function') {
        loadOrders(); // Fallback to general orders loader
      }

    } catch (err) {
      console.error("Error updating Travel Order:", err);
      showNotification("Failed to update Travel Order.", "error");
    }
  });
}

// --- Mount Admin Modal ---
async function mountAdminTravelOrderModal(admin, orderData) {
  if (!document.getElementById("adminTravelOrderModal")) {
    document.body.insertAdjacentHTML("beforeend", renderAdminTravelOrderModal());
    attachAdminTravelOrderModal();
  }

  const modal = document.getElementById("adminTravelOrderModal");
  const form = document.getElementById("adminTravelOrderForm");

  // Fill fields with order data (handle arrays for passengers)
  for (let [key, value] of Object.entries(orderData)) {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      let displayValue = value || "";
      if (Array.isArray(value)) {
        displayValue = value.join(", ");
      } else if (typeof value === 'object' && value.toDate) {
        // Handle Firestore timestamps
        displayValue = value.toDate().toLocaleDateString();
      }
      field.value = displayValue;
    }
  }

  // Set current status in dropdown
  const statusSelect = document.getElementById("updateStatus");
  if (orderData.status) {
    // Find and select the current status option
    const currentOption = Array.from(statusSelect.options).find(opt => opt.value === orderData.status);
    if (currentOption) {
      currentOption.selected = true;
    }
  }

  // Populate staff dropdown (same dept as admin, only active staff)
  const staffDropdown = document.getElementById("assignStaff");
  staffDropdown.innerHTML = `<option value="">-- Loading staff... --</option>`;

  try {
    const staffSnap = await db.collection("clients")
      .where("department", "==", admin.department)
      .where("status", "==", "active")
      .get();

    staffDropdown.innerHTML = `<option value="">-- Select Staff Member --</option>`;

    if (staffSnap.empty) {
      staffDropdown.innerHTML += `<option value="" disabled>No active staff found in ${admin.department}</option>`;
    } else {
      staffSnap.forEach(doc => {
        const u = doc.data();
        if (u.position && u.username) {
          const selected = (u.username === orderData.assignedStaff) ? 'selected' : '';
          staffDropdown.innerHTML += `<option value="${u.username}|${u.position}" ${selected}>${u.username} - ${u.position}</option>`;
        }
      });
    }

    // Auto-focus on status dropdown (most important action)
    setTimeout(() => {
      const statusSelect = document.getElementById("updateStatus");
      if (statusSelect) statusSelect.focus();
    }, 100);

  } catch (err) {
    console.error("Error loading staff:", err);
    staffDropdown.innerHTML = `<option value="" disabled>Error loading staff</option>`;
    showNotification("Error loading staff list.", "error");
  }

  modal.currentContext = { admin, orderData };
  modal.style.display = "flex";
}

window.mountAdminTravelOrderModal = mountAdminTravelOrderModal;