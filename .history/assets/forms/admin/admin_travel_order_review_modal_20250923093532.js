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

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px; font-weight:600;">
          Review Travel Order
        </h2>

        <form id="adminTravelOrderForm" style="display:flex; flex-direction:column; gap:24px;">

          <!-- Details (same sections as normal form, but disabled) -->
          <div id="travelOrderDetails" style="display:flex; flex-direction:column; gap:16px;"></div>

          <!-- Assignment Section -->
          <div style="border-top:1px solid #e5e7eb; padding-top:16px;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Assignment</h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <select id="travelStaffDropdown" required 
                      style="padding:10px; border-radius:6px; border:1px solid #ccc;">
                <option value="">-- Select Staff --</option>
              </select>
              <textarea id="adminTravelRemarks" placeholder="Remarks (optional)" rows="3" 
                        style="padding:10px; border-radius:6px; border:1px solid #ccc;"></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:12px;">
            <button type="button" id="cancelAdminTravelOrder" 
                    style="background:#e5e7eb; color:#374151; padding:8px 18px; border:none; border-radius:8px; cursor:pointer;">Cancel</button>
            <button type="submit" 
                    style="background:#0ea5a4; color:white; padding:8px 18px; border:none; border-radius:8px; cursor:pointer; font-weight:500;">Assign</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// --- Attach Admin Travel Order Modal Logic ---
function attachAdminTravelOrderModal() {
  const modal = document.getElementById("adminTravelOrderModal");
  const form = document.getElementById("adminTravelOrderForm");

  document.getElementById("closeAdminTravelOrderModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelAdminTravelOrder").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const staffVal = document.getElementById("travelStaffDropdown").value;
    const remarks = document.getElementById("adminTravelRemarks").value.trim();
    if (!staffVal) return alert("⚠ Please select staff.");

    Modal.show("Assigning Travel Order...");

    const { orderData, admin } = modal.currentContext;
    const [staffName, staffPos] = staffVal.split("|");

    try {
      // 1️⃣ Update original Travel Order
      await db.collection("travel_orders").doc(orderData.id).update({
        status: `Assigned to ${staffName}`,
        assignedStaff: staffName,
        assignedPosition: staffPos,
        reviewedBy: admin.username || admin.firstName,
        remarks
      });

      // 2️⃣ Add to department_tasks
      await db.collection("department_tasks").add({
        relatedId: orderData.id,
        type: "Travel Order",
        staff: staffName,
        position: staffPos,
        department: admin.department || "Unknown",
        status: "Pending",
        remarks,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        details: orderData
      });

      alert(`✅ Travel Order assigned to ${staffName}`);
      modal.style.display = "none";
      Modal.hide();

    } catch (err) {
      Modal.hide();
      console.error("❌ Error assigning Travel Order:", err);
      alert("Error assigning Travel Order.");
    }
  });
}

// --- Mount Admin Travel Order Modal ---
async function mountAdminTravelOrderModal(admin, orderData) {
  if (!document.getElementById("adminTravelOrderModal")) {
    document.body.insertAdjacentHTML("beforeend", renderAdminTravelOrderModal());
    attachAdminTravelOrderModal();
  }

  const modal = document.getElementById("adminTravelOrderModal");
  const detailsWrapper = document.getElementById("travelOrderDetails");

  // Clear and re-render details (read-only)
  detailsWrapper.innerHTML = "";
  for (let [key, value] of Object.entries(orderData)) {
    if (["id", "status", "username", "dateSubmitted"].includes(key)) continue; // skip meta
    const div = document.createElement("div");
    div.style.cssText = "display:flex; flex-direction:column; margin-bottom:8px;";
    div.innerHTML = `
      <label style="font-weight:500; color:#374151; margin-bottom:4px;">${key}</label>
      <input type="text" value="${Array.isArray(value) ? value.join(", ") : value || ""}" 
             disabled style="padding:8px 10px; border:1px solid #ccc; border-radius:6px; background:#f9fafb;">
    `;
    detailsWrapper.appendChild(div);
  }

  // Populate staff dropdown (same dept as admin)
  const staffDropdown = document.getElementById("travelStaffDropdown");
  staffDropdown.innerHTML = `<option value="">-- Select Staff --</option>`;

  const staffSnap = await db.collection("users")
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
