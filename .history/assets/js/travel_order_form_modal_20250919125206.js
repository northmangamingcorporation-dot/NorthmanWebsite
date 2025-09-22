// assets/js/travel_order_form_modal.js

function renderTravelOrderForm() {
  return `
    <div id="travelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      
      <div style="background:white; border-radius:12px; max-width:850px; width:100%; padding:24px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        
        <!-- Close button -->
        <span id="closeTravelOrderModal" 
              style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px;">&times;</span>

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px;">✈️ Travel Order Form</h2>

        <form id="travelOrderForm" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
          
          <!-- Employee Info -->
          <div class="form-group">
            <label>Employee Name <span style="color:red">*</span></label>
            <input type="text" name="employeeName" required>
          </div>
          <div class="form-group">
            <label>Department <span style="color:red">*</span></label>
            <input type="text" name="department" required>
          </div>
          <div class="form-group">
            <label>Date Filed <span style="color:red">*</span></label>
            <input type="date" name="dateFiled" required>
          </div>
          <div class="form-group">
            <label>Travel Date <span style="color:red">*</span></label>
            <input type="date" name="travelDate" required>
          </div>

          <!-- Trip Details -->
          <div class="form-group">
            <label>Travel From</label>
            <input type="text" name="travelFrom">
          </div>
          <div class="form-group">
            <label>Travel To</label>
            <input type="text" name="travelTo">
          </div>
          <div class="form-group">
            <label>Time Out</label>
            <input type="time" name="timeOut">
          </div>
          <div class="form-group">
            <label>Time In</label>
            <input type="time" name="timeIn">
          </div>

          <!-- People -->
          <div class="form-group">
            <label>Driver’s Name</label>
            <input type="text" name="driversName">
          </div>
          <div class="form-group">
            <label>Reliever’s Name</label>
            <input type="text" name="relieversName">
          </div>

          <!-- Passengers (Full width) -->
          <div class="form-group" style="grid-column:1/-1;">
            <label>Other Passengers</label>
            <div id="passengersWrapper" style="display:grid; gap:8px; margin-bottom:8px;">
              <div style="display:flex; gap:8px; align-items:center;">
                <input name="passenger[]" placeholder="Passenger 1" style="flex:1;">
                <button type="button" class="removePassengerBtn">✖</button>
              </div>
            </div>
            <button type="button" id="addPassengerBtn">+ Add Passenger</button>
          </div>

          <!-- Car Info -->
          <div class="form-group" style="grid-column:1/-1;">
            <label>Car Unit / Plate #</label>
            <input type="text" name="carUnit">
          </div>

          <!-- Purpose -->
          <div class="form-group" style="grid-column:1/-1;">
            <label>Purpose <span style="color:red">*</span></label>
            <textarea name="purpose" rows="3" required></textarea>
          </div>

          <!-- Buttons -->
          <div style="grid-column:1/-1; display:flex; justify-content:flex-end; gap:12px; margin-top:12px;">
            <button type="button" id="cancelTravelOrder">Cancel</button>
            <button type="submit">Submit</button>
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
