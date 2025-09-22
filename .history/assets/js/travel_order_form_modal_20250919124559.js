// assets/js/travel_order_form_modal.js

// ✅ Renders the Travel Order Form with IT Service Order Theme
function renderTravelOrderForm() {
  return `
    <div id="travelOrderModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      <div style="background:white; border-radius:12px; max-width:850px; width:100%; padding:24px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        
        <!-- Close button -->
        <span id="closeTravelOrderModal" style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px;">&times;</span>

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px;">Travel Order Form</h2>

        <form id="travelOrderForm">

          <!-- Employee Info -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Employee Name <span style="color:red;">*</span></label>
              <input type="text" name="employeeName" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Department <span style="color:red;">*</span></label>
              <input type="text" name="department" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Date Filed <span style="color:red;">*</span></label>
              <input type="date" name="dateFiled" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Travel Date <span style="color:red;">*</span></label>
              <input type="date" name="travelDate" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
          </div>

          <!-- Passengers -->
          <div style="margin-bottom:24px;">
            <label style="margin-bottom:8px; display:block;">Other Passengers</label>
            <div id="passengersWrapper" style="display:grid; gap:8px;">
              <input name="passenger[]" placeholder="Passenger 1" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <button type="button" id="addPassengerBtn" style="margin-top:8px; padding:8px 12px; border-radius:6px; background:#e5e7eb;">+ Add Passenger</button>
          </div>

          <!-- Travel Info -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Driver’s Name</label>
              <input type="text" name="driversName" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Reliever’s Name</label>
              <input type="text" name="relieversName" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Time In</label>
              <input type="time" name="timeIn" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Time Out</label>
              <input type="time" name="timeOut" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Travel From</label>
              <input type="text" name="travelFrom" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Travel To</label>
              <input type="text" name="travelTo" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="grid-column:1/-1; display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Car Unit / Plate #</label>
              <input type="text" name="carUnit" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="grid-column:1/-1; display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Purpose <span style="color:red;">*</span></label>
              <textarea name="purpose" rows="3" required style="padding:10px; border-radius:6px; border:1px solid #ccc;"></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancelTravelOrder" style="padding:10px 16px; border-radius:6px; background:#e5e7eb;">Cancel</button>
            <button type="submit" style="padding:10px 16px; border-radius:6px; background:#0ea5a4; color:white;">Submit</button>
          </div>

        </form>
      </div>
    </div>
  `;
}

// --- Attach Logic ---
function attachTravelOrderForm(preFillUsername = "") {
  const modal = document.getElementById("travelOrderModal");
  const form = document.getElementById("travelOrderForm");

  // Close modal
  document.getElementById("closeTravelOrderModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelTravelOrder").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Add passenger input with X button
document.getElementById("addPassengerBtn").addEventListener("click", () => {
  const wrapper = document.getElementById("passengersWrapper");
  const index = wrapper.children.length + 1;

  const row = document.createElement("div");
  row.style.cssText = "display:flex; gap:8px; align-items:center;";

  const input = document.createElement("input");
  input.name = "passenger[]";
  input.placeholder = `Passenger ${index}`;
  input.style.cssText = "flex:1; padding:10px; border-radius:6px; border:1px solid #ccc;";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✖";
  removeBtn.style.cssText = "padding:6px 10px; border-radius:6px; background:#f87171; color:white;";
  removeBtn.addEventListener("click", () => row.remove());

  row.appendChild(input);
  row.appendChild(removeBtn);
  wrapper.appendChild(row);
});

// Enable removing the very first passenger row too
document.querySelectorAll(".removePassengerBtn").forEach(btn => {
  btn.addEventListener("click", (e) => e.target.closest("div").remove());
});


  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    Modal.show("Saving Travel Order...");

    const id = "TO-" + Date.now();
    const formData = new FormData(form);
    const data = { id };

    // Collect passengers into array
    const passengers = [];
    for (let [key, value] of formData.entries()) {
      if (key === "passenger[]") {
        if (value.trim()) passengers.push(value.trim().toUpperCase());
      } else {
        data[key] = typeof value === "string" ? value.toUpperCase() : value;
      }
    }
    data.passengers = passengers;
    data.dateSubmitted = firebase.firestore.FieldValue.serverTimestamp();
    data.status = "Pending";

    try {
      await db.collection("travel_orders").doc(id).set(data);
      alert(`✅ Travel Order Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";
      form.reset();
      Modal.hide();
      // Reload dashboard if available
      if (window.mountDashboard && window.currentUser) {
        window.mountDashboard(window.currentUser);
      }
    } catch (err) {
      Modal.hide();
      console.error("❌ Error saving Travel Order:", err);
      alert("Error submitting Travel Order.");
    }
  });
}

// --- Mount function ---
function mountTravelOrderForm(preFillUsername = "") {
  if (!document.getElementById("travelOrderModal")) {
    document.body.insertAdjacentHTML("beforeend", renderTravelOrderForm());
    attachTravelOrderForm(preFillUsername);
  }
  const modal = document.getElementById("travelOrderModal");
  if (modal) modal.style.display = "flex";
}

window.mountTravelOrderForm = mountTravelOrderForm;
