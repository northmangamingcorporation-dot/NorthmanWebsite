// assets/js/travel_order_form_modal.js

// assets/js/travel_order_form_modal.js

// ✅ Renders the Travel Order Form (Improved Design)
function renderTravelOrderForm() {
  return `
    <div id="travelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);
                display:flex; align-items:center; justify-content:center; padding:16px; 
                overflow:auto; z-index:1000;">
      
      <div style="background:white; border-radius:16px; max-width:750px; width:100%; 
                  padding:32px; position:relative; box-shadow:0 8px 24px rgba(0,0,0,0.15);">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <h2 style="margin:0; font-size:22px; font-weight:bold; color:#222;">✈️ Travel Order</h2>
          <button id="closeTravelOrderModal" 
                  style="border:none; background:transparent; font-size:22px; cursor:pointer; color:#666;">✖</button>
        </div>
        
        <!-- Form -->
        <form id="travelOrderForm" 
              style="display:grid; grid-template-columns:repeat(2, 1fr); gap:20px;">
          
          <div class="form-group">
            <label>Employee Name</label>
            <input type="text" name="employeeName" required>
          </div>

          <div class="form-group">
            <label>Department</label>
            <input type="text" name="department" required>
          </div>

          <div class="form-group">
            <label>Date Filed</label>
            <input type="date" name="dateFiled" required>
          </div>

          <div class="form-group">
            <label>Travel Date</label>
            <input type="date" name="travelDate" required>
          </div>

          <!-- Passengers -->
          <div class="form-group" style="grid-column:span 2;">
            <label>Other Passengers</label>
            <div id="passengersWrapper" style="display:grid; gap:8px;">
              <input name="passenger[]" placeholder="Passenger 1">
            </div>
            <button type="button" id="addPassengerBtn" 
                    style="margin-top:8px; padding:6px 12px; border:1px solid #007bff; background:#f0f8ff; 
                           border-radius:6px; cursor:pointer; font-size:14px; color:#007bff;">
              + Add Passenger
            </button>
          </div>

          <div class="form-group">
            <label>Driver’s Name</label>
            <input type="text" name="driversName">
          </div>

          <div class="form-group">
            <label>Reliever’s Name</label>
            <input type="text" name="relieversName">
          </div>

          <div class="form-group">
            <label>Time In</label>
            <input type="time" name="timeIn">
          </div>

          <div class="form-group">
            <label>Time Out</label>
            <input type="time" name="timeOut">
          </div>

          <div class="form-group">
            <label>Travel From</label>
            <input type="text" name="travelFrom">
          </div>

          <div class="form-group">
            <label>Travel To</label>
            <input type="text" name="travelTo">
          </div>

          <div class="form-group" style="grid-column:span 2;">
            <label>Car Unit / Plate #</label>
            <input type="text" name="carUnit">
          </div>

          <div class="form-group" style="grid-column:span 2;">
            <label>Purpose</label>
            <textarea name="purpose" rows="3" required></textarea>
          </div>

          <!-- Buttons -->
          <div style="grid-column:span 2; display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
            <button type="button" id="cancelTravelOrder" 
                    style="padding:10px 18px; border:none; background:#ccc; color:#333; 
                           border-radius:8px; cursor:pointer; font-weight:500;">
              Cancel
            </button>
            <button type="submit" 
                    style="padding:10px 18px; border:none; background:#007bff; color:white; 
                           border-radius:8px; cursor:pointer; font-weight:500;">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 🔹 Loading Modal -->
    <div id="loadingTravelModal" 
         style="display:none; position:fixed; inset:0; background:rgba(255,255,255,0.85); 
                display:flex; align-items:center; justify-content:center; z-index:2000;">
      <div style="background:white; padding:20px 28px; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.1); font-size:16px; font-weight:500;">
        ⏳ Saving Travel Order...
      </div>
    </div>
  `;
}

// --- Attach Logic ---
function attachTravelOrderForm(preFillUsername = "") {
  const modal = document.getElementById("travelOrderModal");
  const form = document.getElementById("travelOrderForm");

  // Close modal
  document.getElementById("cancelTravelOrder").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Add passenger input
  document.getElementById("addPassengerBtn").addEventListener("click", () => {
    const wrapper = document.getElementById("passengersWrapper");
    const input = document.createElement("input");
    input.name = "passenger[]";
    input.placeholder = `Passenger ${wrapper.children.length + 1}`;
    wrapper.appendChild(input);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("loadingTravelModal").style.display = "flex";

    const id = "TO-" + Date.now();
    const formData = new FormData(form);
    const data = { id };

    // Collect passengers into an array
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

      if (typeof window.mountDashboard === "function" && window.currentUser) {
        window.mountDashboard(window.currentUser);
      }
    } catch (err) {
      console.error("❌ Error saving Travel Order:", err);
      alert("Error submitting Travel Order.");
    } finally {
      document.getElementById("loadingTravelModal").style.display = "none";
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