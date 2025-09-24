// --- Render Admin IT Service Modal (read-only fields + assign controls) ---
function renderAdminITServiceModal() {
  return `
    <div id="adminITServiceModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); 
                display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1100;">
      
      <div style="background:white; border-radius:12px; max-width:800px; width:100%; padding:28px; position:relative; 
                  box-shadow:0 10px 25px rgba(0,0,0,0.2); animation:fadeIn 0.3s ease;">

        <!-- Close button -->
        <span id="closeAdminITServiceModal" 
              style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px; color:#666;">&times;</span>

        <h2 style="text-align:center; font-size:22px; color:#0ea5a4; margin-bottom:20px; font-weight:600;">
          Review IT Service Request
        </h2>

        <form id="adminITServiceForm" style="display:flex; flex-direction:column; gap:24px;">
          
          <!-- Section: Employee Info -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Employee Information</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <input name="employeeName" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="department" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="position" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="contact" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb; grid-column:1/-1;">
            </div>
          </div>

          <!-- Section: Service Info -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Service Request</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <input name="type" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="priority" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="asset" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="location" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <textarea name="description" rows="3" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb; grid-column:1/-1;"></textarea>
            </div>
          </div>

          <!-- Section: Assignment -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Assignment</h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <select id="staffDropdown" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
                <option value="">-- Select Staff --</option>
              </select>
              <textarea id="adminRemarks" placeholder="Remarks (optional)" rows="3" 
                        style="padding:10px; border-radius:6px; border:1px solid #ccc;"></textarea>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancelAdminITService" 
                    style="padding:8px 16px; border-radius:6px; background:#e5e7eb; color:#374151;">Cancel</button>
            <button type="submit" 
                    style="padding:8px 16px; border-radius:6px; background:#0ea5a4; color:white; font-weight:500;">Assign</button>
          </div>

        </form>
      </div>
    </div>
  `;
}

// --- Attach Admin Modal Logic ---
function attachAdminITServiceModal() {
  const modal = document.getElementById("adminITServiceModal");
  const form = document.getElementById("adminITServiceForm");

  document.getElementById("closeAdminITServiceModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelAdminITService").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const staffVal = document.getElementById("staffDropdown").value;
    const remarks = document.getElementById("adminRemarks").value.trim();
    if (!staffVal) return alert("Please select staff to assign.");

    Modal.show("Assigning IT Service Request...");

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
        assignedAt: firebase.firestore.FieldValue.serverTimestamp() // ⏰ new field
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
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        details: orderData
      });
modal.style.display = "none";
      alert(`✅ Request assigned to ${staffName} - ${staffPos}`);
      
      Modal.hide();

    } catch (err) {
      Modal.hide();
      console.error("Error assigning IT service:", err);
      alert("Failed to assign request.");
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

  // Populate staff dropdown (same dept as admin)
  const staffDropdown = document.getElementById("staffDropdown");
  staffDropdown.innerHTML = `<option value="">-- Select Staff --</option>`;

  const staffSnap = await db.collection("clients")
    .where("department", "==", admin.department)
    .get();

  staffSnap.forEach(doc => {
    const u = doc.data();
    if (u.position && u.username) {
      staffDropdown.innerHTML += `<option value="${u.username}|${u.position}">${u.username} - ${u.position}</option>`;
    }
  });

  modal.currentContext = { admin, orderData };
  modal.style.display = "flex";
}

window.mountAdminITServiceModal = mountAdminITServiceModal;
