// --- Render Admin IT Service Modal (enhanced design with modern styling) ---
function renderAdminITServiceModal() {
  return `
    <div id="adminITServiceModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); 
                display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1100;
                backdrop-filter: blur(8px); animation: fadeInModal 0.3s ease;">
      
      <div style="background:#ffffff; border-radius:16px; max-width:900px; width:100%; max-height:90vh; overflow-y:auto;
                  padding:32px; position:relative; box-shadow:0 20px 40px rgba(0,0,0,0.15); 
                  border:1px solid rgba(59,130,246,0.1); animation: slideUp 0.3s ease;">
        
        <!-- Close button -->
        <button id="closeAdminITServiceModal" 
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
            <i class="fas fa-clipboard-check"></i>
          </div>
          <h2 style="font-size:24px; color:#1e293b; margin:0 0 24px 0; font-weight:700; 
                     background:linear-gradient(135deg, #3b82f6, #1d4ed8); -webkit-background-clip:text; 
                     -webkit-text-fill-color:transparent; background-clip:text;">
            Review & Assign IT Service Request
          </h2>
        </div>

        <form id="adminITServiceForm" style="display:flex; flex-direction:column; gap:28px;">
          
          <!-- Section: Employee Info -->
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
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Position</label>
                <input name="position" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column; grid-column:1/-1;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Contact</label>
                <input name="contact" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
            </div>
          </div>

          <!-- Section: Service Info -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-cogs"></i> Service Request Details
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Request Type</label>
                <input name="type" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Priority</label>
                <input name="priority" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Asset/Equipment</label>
                <input name="asset" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Location</label>
                <input name="location" disabled 
                       style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                              background:#f9fafb; color:#374151; font-size:14px; transition:all 0.2s ease;">
              </div>
              <div style="display:flex; flex-direction:column; grid-column:1/-1;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Description</label>
                <textarea name="description" rows="4" disabled 
                          style="padding:12px 16px; border-radius:8px; border:1px solid #d1d5db; 
                                 background:#f9fafb; color:#374151; font-size:14px; resize:vertical; 
                                 min-height:100px; transition:all 0.2s ease; font-family:inherit;"></textarea>
              </div>
            </div>
          </div>

          <!-- Section: Assignment -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; 
                      box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; 
                       margin:0 0 16px 0; color:#1e293b;">
              <i class="fas fa-user-plus"></i> Assignment
            </h3>
            <div style="display:flex; flex-direction:column; gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Assign To Staff</label>
                <select id="staffDropdown" required 
                        style="padding:12px 16px; border-radius:8px; border:2px solid #e2e8f0; 
                               background:#ffffff; color:#374151; font-size:14px; transition:all 0.2s ease; 
                               cursor:pointer; font-weight:500;">
                  <option value="">-- Select Staff Member --</option>
                </select>
              </div>
              <div style="display:flex; flex-direction:column;">
                <label style="font-weight:600; color:#64748b; margin-bottom:4px; font-size:14px;">Additional Remarks</label>
                <textarea id="adminRemarks" placeholder="Enter any special instructions or notes for the assigned staff..." 
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
            <button type="button" id="cancelAdminITService" 
                    style="padding:12px 24px; border-radius:8px; background:#f1f5f9; color:#64748b; 
                           border:none; font-weight:500; cursor:pointer; transition:all 0.2s ease; 
                           display:flex; align-items:center; gap:8px;">
              <i class="fas fa-times"></i> Cancel
            </button>
            <button type="submit" 
                    style="padding:12px 24px; border-radius:8px; background:linear-gradient(135deg, #3b82f6, #1d4ed8); 
                           color:white; font-weight:500; border:none; cursor:pointer; transition:all 0.2s ease; 
                           display:flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(59,130,246,0.3);">
              <i class="fas fa-user-plus"></i> Assign Task
            </button>
          </div>

        </form>
      </div>
    </div>

    <!-- Injected animations (one-time) -->
    <style id="admin-modal-animations">
      @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      #adminITServiceModal input:focus, #adminITServiceModal select:focus, #adminITServiceModal textarea:focus {
        outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
      }
      #adminITServiceModal button:hover { transform: translateY(-1px); }
      #closeAdminITServiceModal:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
      #cancelAdminITService:hover { background: #e2e8f0; }
      #adminITServiceForm button[type=submit]:hover { box-shadow: 0 6px 16px rgba(59,130,246,0.4); }
      @media (max-width: 768px) {
        #adminITServiceModal div[style*="grid"] { grid-template-columns: 1fr !important; }
        #adminITServiceModal { padding: 8px; }
        #adminITServiceModal > div { padding: 20px; margin: 8px; }
      }
    </style>
  `;
}

// --- Attach Admin Modal Logic ---
function attachAdminITServiceModal() {
  const modal = document.getElementById("adminITServiceModal");
  const form = document.getElementById("adminITServiceForm");

  // Enhanced close button with icon support
  const closeBtn = document.getElementById("closeAdminITServiceModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      // Remove animations style if needed
      const animStyle = document.getElementById("admin-modal-animations");
      if (animStyle) animStyle.remove();
    });
  }

  document.getElementById("cancelAdminITService").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const staffVal = document.getElementById("staffDropdown").value;
    const remarks = document.getElementById("adminRemarks").value.trim();
    if (!staffVal) return showNotification("Please select staff to assign.", "warning");

    showNotification("Assigning IT Service Request...", "info");

    const { orderData, admin } = modal.currentContext;
    const [staffName, staffPos] = staffVal.split("|");

    try {
      // 1️⃣ Update original IT Service Order
      await db.collection("it_service_orders").doc(orderData.id).update({
        status: `Assigned to ${staffName} - ${staffPos}`,
        assignedStaff: staffName,
        assignedPosition: staffPos,
        reviewedBy: admin.username || admin.firstName,
        remarks,
        assignedAt: db.FieldValue.serverTimestamp() // ⏰ new field (using db instead of firebase)
      });

      // 2️⃣ Add to department_tasks (for staff)
      await db.collection("ITdepartment_tasks").add({
        relatedId: orderData.id,
        type: "IT Service Order",
        staff: staffName,
        position: staffPos,
        department: admin.department || "Unknown",
        status: "Pending",
        remarks,
        createdAt: db.FieldValue.serverTimestamp(),
        details: orderData
      });
      
      modal.style.display = "none";
      showNotification(`✅ Request assigned to ${staffName} - ${staffPos}`, "success");
      
      // Refresh dashboard data if available
      if (typeof loadOrders === 'function') {
        loadOrders();
      }

    } catch (err) {
      console.error("Error assigning IT service:", err);
      showNotification("Failed to assign request.", "error");
    }
  });
}

// --- Mount Admin IT Service Modal ---
async function mountAdminITServiceModal(admin, orderData) {
  if (!document.getElementById("adminITServiceModal")) {
    document.body.insertAdjacentHTML("beforeend", renderAdminITServiceModal());
    attachAdminITServiceModal();
  }

  const modal = document.getElementById("adminITServiceModal");
  const form = document.getElementById("adminITServiceForm");

  // Fill read-only fields with order data
  for (let [key, value] of Object.entries(orderData)) {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) field.value = value || "";
  }

  // Populate staff dropdown (same dept as admin, only active staff)
  const staffDropdown = document.getElementById("staffDropdown");
  staffDropdown.innerHTML = `<option value="">-- Loading staff... --</option>`;

  try {
    const staffSnap = await db.collection("clients")
      .where("department", "==", admin.department)
      .where("status", "==", "active")
      .get();

    staffDropdown.innerHTML = `<option value="">-- Select Staff Member --</option>`;

    if (staffSnap.empty) {
      staffDropdown.innerHTML += `<option value="" disabled>No active staff found in ${admin.department}</option>`;
      return;
    }

    staffSnap.forEach(doc => {
      const u = doc.data();
      if (u.position && u.username) {
        staffDropdown.innerHTML += `<option value="${u.username}|${u.position}">${u.username} - ${u.position}</option>`;
      }
    });

    // Auto-focus on staff dropdown
    setTimeout(() => staffDropdown.focus(), 100);

  } catch (err) {
    console.error("Error loading staff:", err);
    staffDropdown.innerHTML = `<option value="" disabled>Error loading staff</option>`;
    showNotification("Error loading staff list.", "error");
  }

  modal.currentContext = { admin, orderData };
  modal.style.display = "flex";
}

window.mountAdminITServiceModal = mountAdminITService