// assets/js/travel_order_form_modal.js

// assets/js/travel_order_form_modal.js

function renderTravelOrderForm(user) {
  return `
    <div id="travelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); 
                display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      
      <div style="background:white; border-radius:12px; max-width:850px; width:100%; padding:28px; position:relative; 
                  box-shadow:0 10px 25px rgba(0,0,0,0.2); animation:fadeIn 0.3s ease;">
        
        <!-- Close button -->
        <span id="closeTravelOrderModal" 
              style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px; color:#666;">&times;</span>

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px; font-weight:600;">Travel Order Form</h2>

        <form id="travelOrderForm" 
              style="display:flex; flex-direction:column; gap:24px;">
          
          <!-- SECTION 1: Employee Info -->
          <div style="border-bottom:1px solid #e5e7eb; padding-bottom:16px;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Employee Information</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label>Employee Name <span style="color:red">*</span></label>
                <input type="text" name="employeeName" value="${user.firstName} ${user.lastName}" required 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Department <span style="color:red">*</span></label>
                <input type="text" name="department" va required 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Date Filed <span style="color:red">*</span></label>
                <input type="date" name="dateFiled" required 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
            </div>
          </div>

          <!-- SECTION 2: Travel Details -->
          <div style="border-bottom:1px solid #e5e7eb; padding-bottom:16px;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Travel Details</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label>Travel Date <span style="color:red">*</span></label>
                <input type="date" name="travelDate" required 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Travel From</label>
                <input type="text" name="travelFrom" 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Travel To</label>
                <input type="text" name="travelTo" 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
            </div>
          </div>

          <!-- SECTION 3: Schedule -->
          <div style="border-bottom:1px solid #e5e7eb; padding-bottom:16px;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Schedule</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label>Time Out</label>
                <input type="time" name="timeOut" 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Time In</label>
                <input type="time" name="timeIn" 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
            </div>
          </div>

          <!-- SECTION 4: Driver & Reliever -->
          <div style="border-bottom:1px solid #e5e7eb; padding-bottom:16px;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Driver & Reliever</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label>Driver’s Name</label>
                <input type="text" name="driversName" 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Reliever’s Name</label>
                <input type="text" name="relieversName" 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
            </div>
          </div>

          <!-- SECTION 5: Passengers -->
          <div style="border-bottom:1px solid #e5e7eb; padding-bottom:16px;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Passengers</h3>
            <div id="passengersWrapper" style="display:grid; gap:8px; margin-bottom:8px;">
              <div style="display:flex; gap:8px; align-items:center;">
                <input name="passenger[]" placeholder="Passenger 1" 
                       style="flex:1; padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
            </div>
            <button type="button" id="addPassengerBtn" 
                    style="background:#0ea5a4; color:white; padding:6px 14px; border:none; border-radius:6px; cursor:pointer;">+ Add Passenger</button>
          </div>

          <!-- SECTION 6: Vehicle & Purpose -->
          <div>
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Vehicle & Purpose</h3>
            <div style="display:flex; flex-direction:column; margin-bottom:16px;">
              <label>Car Unit / Plate #</label>
              <input type="text" name="carUnit" 
                     style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Purpose <span style="color:red">*</span></label>
              <textarea name="purpose" rows="3" required 
                        style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;"></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:12px;">
            <button type="button" id="cancelTravelOrder" 
                    style="background:#e5e7eb; color:#374151; padding:8px 18px; border:none; border-radius:8px; cursor:pointer;">Cancel</button>
            <button type="submit" 
                    style="background:#0ea5a4; color:white; padding:8px 18px; border:none; border-radius:8px; cursor:pointer; font-weight:500;">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// --- Attach Logic ---
function attachTravelOrderForm(user) {
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

    // Row container
    const row = document.createElement("div");
    row.style.cssText = "display:flex; gap:8px; align-items:center;";

    // Passenger input
    const input = document.createElement("input");
    input.name = "passenger[]";
    input.placeholder = `Passenger ${index}`;
    input.style.cssText = "flex:1; padding:10px; border-radius:6px; border:1px solid #ccc; font-size:14px;";

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✖";
    removeBtn.style.cssText = "padding:6px 12px; border-radius:6px; background:#f87171; color:white; border:none; cursor:pointer; font-size:14px;";
    removeBtn.addEventListener("click", () => row.remove());

    // Append to row
    row.appendChild(input);
    row.appendChild(removeBtn);

    // Add to wrapper
    wrapper.appendChild(row);
  });

  // Enable removing the very first passenger row on load
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
  data.username = preFillUsername;

  try {
    // Save to Firestore
    await db.collection("travel_orders").doc(id).set(data);
    alert(`✅ Travel Order Submitted!\nReference ID: ${id}`);

    // Open Telegram modal for sending
    if (window.TelegramConnect) {
      window.TelegramConnect.sendRequest(data, "Travel Order");
    }

    form.reset();
    Modal.hide();

    // Reload dashboard if available
    if (window.mountDashboard && window.currentUser) {
      window.mountDashboard(window.currentUser);
    }
  } catch (err) {
    Modal.hide();
    console.error("❌ Error submitting Travel Order:", err);
    alert("Error submitting Travel Order.");
  }
});
}

// --- Mount function ---
function mountTravelOrderForm(user) {
  if (!document.getElementById("travelOrderModal")) {
    document.body.insertAdjacentHTML("beforeend", renderTravelOrderForm());
    attachTravelOrderForm(user);
  }
  const modal = document.getElementById("travelOrderModal");
  if (modal) modal.style.display = "flex";
}

window.mountTravelOrderForm = mountTravelOrderForm;
