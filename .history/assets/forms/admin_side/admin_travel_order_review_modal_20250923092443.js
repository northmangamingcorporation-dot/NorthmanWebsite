// assets/js/admin_travel_order_review_modal.js

function renderAdminTravelOrderModal() {
  return `
    <div id="adminTravelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); 
                display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1100;">

      <div style="background:white; border-radius:12px; max-width:900px; width:100%; padding:28px; position:relative; 
                  box-shadow:0 10px 25px rgba(0,0,0,0.25); animation:fadeIn 0.3s ease;">
        
        <!-- Close button -->
        <span id="closeAdminTravelOrderModal" 
              style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px; color:#666;">&times;</span>

        <h2 style="text-align:center; font-size:22px; color:#0ea5a4; margin-bottom:24px; font-weight:600;">Review Travel Order</h2>

        <form id="adminTravelOrderForm" style="display:flex; flex-direction:column; gap:24px;">

          <!-- Travel Order Details -->
          <div id="travelOrderDetails" 
               style="border:1px solid #e5e7eb; border-radius:8px; padding:16px; background:#f9fafb;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Travel Order Details</h3>
            <div id="detailsContent" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <!-- Populated dynamically -->
            </div>
          </div>

          <!-- Assign Task -->
          <div>
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Assign Task</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label>Assign To Staff <span style="color:red">*</span></label>
                <select name="assignedStaff" required 
                        style="padding:8px; border:1px solid #ccc; border-radius:6px;">
                  <option value="">Loading staff...</option>
                </select>
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Department <span style="color:red">*</span></label>
                <input type="text" name="assignedDepartment" required 
                       style="padding:8px; border:1px solid #ccc; border-radius:6px;" readonly>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancelAdminTravelOrder" 
                    style="background:#e5e7eb; color:#374151; padding:8px 18px; border:none; border-radius:8px; cursor:pointer;">Cancel</button>
            <button type="submit" 
                    style="background:#0ea5a4; color:white; padding:8px 18px; border:none; border-radius:8px; cursor:pointer; font-weight:500;">Assign Task</button>
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

  // Close modal
  document.getElementById("closeAdminTravelOrderModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelAdminTravelOrder").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    Modal.show("Assigning Task...");

    const formData = new FormData(form);
    const staff = formData.get("assignedStaff");
    const dept = formData.get("assignedDepartment");

    if (!staff || !dept) {
      alert("⚠ Please select a staff.");
      Modal.hide();
      return;
    }

    try {
      const orderData = modal.currentOrder;
      const taskId = "TASK-" + Date.now();

      const task = {
        taskId,
        referenceId: orderData.id,
        travelOrder: orderData,
        assignedStaff: staff+ " - " + dept,
        assignedDepartment: dept,
        status: "Pending",
        dateAssigned: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Save task to department_tasks
      await db.collection("department_tasks").doc(taskId).set(task);

      // ✅ Update travel order status
      await db.collection("travel_orders").doc(orderData.id).update({
        status: `Assigned to ${staff}`
      });

      alert(`✅ Task Assigned!\nTask ID: ${taskId}`);
      Modal.hide();
      modal.style.display = "none";

      // Refresh dashboard if available
      if (window.mountAdminDashboard && window.currentUser) {
        window.mountAdminDashboard(window.currentUser);
      }

    } catch (err) {
      Modal.hide();
      console.error("❌ Error assigning task:", err);
      alert("Error assigning task.");
    }
  });
}

// --- Load staff from admin’s department ---
async function loadDepartmentStaff(admin) {
  try {
    const dept = admin.department;
    if (!dept) {
      console.warn("⚠ Admin has no department set.");
      return;
    }

    // 🔍 Get all users in the same department
    const staffSnapshot = await db.collection("clients")
      .where("department", "==", dept)
      .get();

    const select = document.querySelector("#adminTravelOrderForm select[name='assignedStaff']");
    select.innerHTML = `<option value="">-- Select Staff --</option>`;

    staffSnapshot.forEach(doc => {
      const user = doc.data();

      // Build label as username-position
      const label = `${user.username || doc.id} - ${user.position || "Unknown"}`;

      const option = document.createElement("option");
      option.value = user.username || doc.id;  // value = username (or id if missing)
      option.textContent = label;
      select.appendChild(option);
    });

    // Auto-fill department field
    document.querySelector("#adminTravelOrderForm input[name='assignedDepartment']").value = dept.toUpperCase();

  } catch (err) {
    console.error("❌ Error loading department staff:", err);
  }
}


// --- Mount function ---
async function mountAdminTravelOrderModal(admin, orderData) {
  if (!document.getElementById("adminTravelOrderModal")) {
    document.body.insertAdjacentHTML("beforeend", renderAdminTravelOrderModal());
    attachAdminTravelOrderModal();
  }

  const modal = document.getElementById("adminTravelOrderModal");
  const detailsContent = document.getElementById("detailsContent");

  // Populate travel order details
  detailsContent.innerHTML = "";
  for (let [key, value] of Object.entries(orderData)) {
    if (typeof value === "string" || typeof value === "number") {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${key}:</strong> ${value}`;
      detailsContent.appendChild(div);
    } else if (Array.isArray(value)) {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${key}:</strong> ${value.join(", ")}`;
      detailsContent.appendChild(div);
    }
  }

  // ✅ Load staff using admin’s department
  await loadDepartmentStaff(admin);

  modal.currentOrder = orderData;
  modal.style.display = "flex";
}


window.mountAdminTravelOrderModal = mountAdminTravelOrderModal;
