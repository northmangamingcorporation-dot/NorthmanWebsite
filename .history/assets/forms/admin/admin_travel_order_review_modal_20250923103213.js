// --- Render Admin Travel Order Modal ---
function renderAdminTravelOrderModal() {
  return `
    <div id="adminTravelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);
                display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1100;">
      
      <div style="background:white; border-radius:12px; max-width:850px; width:100%; padding:28px; position:relative;
                  box-shadow:0 10px 25px rgba(0,0,0,0.2); animation:fadeIn 0.3s ease;">
        
        <!-- Close -->
        <span id="closeAdminTravelOrderModal"
              style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px; color:#666;">&times;</span>
        
        <h2 style="text-align:center; font-size:22px; color:#0ea5a4; margin-bottom:20px; font-weight:600;">
          Review Travel Order
        </h2>

        <form id="adminTravelOrderForm" style="display:flex; flex-direction:column; gap:24px;">
          
          <!-- Employee Info -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Employee Information</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <input name="employeeName" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="department" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="dateFiled" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
            </div>
          </div>

          <!-- Travel Details -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Travel Details</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <input name="travelDate" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="travelFrom" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="travelTo" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
            </div>
          </div>

          <!-- Schedule -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Schedule</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <input name="timeOut" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
              <input name="timeIn" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;">
            </div>
          </div>

          <!-- Passengers -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Passengers</h3>
            <textarea name="passengers" rows="3" disabled
                      style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;"></textarea>
          </div>

          <!-- Vehicle & Purpose -->
          <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Vehicle & Purpose</h3>
            <input name="carUnit" disabled style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb; margin-bottom:8px;">
            <textarea name="purpose" rows="3" disabled
                      style="padding:8px; border-radius:6px; border:1px solid #ccc; background:#f9fafb;"></textarea>
          </div>

          <!-- Admin Controls -->
<div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px;">
  <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; color:#374151;">Admin Action</h3>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <select id="assignStaff" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
      <option value="">-- Assign Staff --</option>
    </select>
    <select id="updateStatus" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
      <option value="Completed">Completed</option>
    </select>
    <textarea id="adminRemarks" placeholder="Remarks (optional)" rows="3"
              style="padding:10px; border-radius:6px; border:1px solid #ccc;"></textarea>
  </div>
</div>


          <!-- Actions -->
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancelAdminTravelOrder"
                    style="padding:8px 16px; border-radius:6px; background:#e5e7eb; color:#374151;">Cancel</button>
            <button type="submit"
                    style="padding:8px 16px; border-radius:6px; background:#0ea5a4; color:white; font-weight:500;">Update</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// --- Attach Logic ---
function attachAdminTravelOrderModal() {
  const modal = document.getElementById("adminTravelOrderModal");
  const form = document.getElementById("adminTravelOrderForm");

  document.getElementById("closeAdminTravelOrderModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelAdminTravelOrder").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    Modal.show("Updating Travel Order...");

    const { orderData, admin } = modal.currentContext;
    const driver = document.getElementById("assignDriver").value;
    const status = document.getElementById("updateStatus").value;
    const remarks = document.getElementById("adminRemarks").value.trim();

    try {
      await db.collection("travel_orders").doc(orderData.id).update({
        status,
        assignedDriver: driver || null,
        reviewedBy: admin.username || admin.firstName,
        remarks,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert(`✅ Travel Order updated (Status: ${status})`);
      modal.style.display = "none";
      Modal.hide();
    } catch (err) {
      Modal.hide();
      console.error("Error updating Travel Order:", err);
      alert("Failed to update Travel Order.");
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

  // Fill fields
  for (let [key, value] of Object.entries(orderData)) {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      if (Array.isArray(value)) field.value = value.join(", ");
      else field.value = value || "";
    }
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

window.mountAdminTravelOrderModal = mountAdminTravelOrderModal;
