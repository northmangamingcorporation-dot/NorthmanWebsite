// assets/js/travel_order_form_modal.js

function renderTravelOrderForm() {
  return `
    <div id="travelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); 
                display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      
      <div style="background:white; border-radius:12px; max-width:850px; width:100%; padding:28px; position:relative; 
                  box-shadow:0 10px 25px rgba(0,0,0,0.2); animation:fadeIn 0.3s ease;">
        
        <!-- Close button -->
        <span id="closeTravelOrderModal" 
              style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px; color:#666;">&times;</span>

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px; font-weight:600;">✈️ Travel Order Form</h2>

        <form id="travelOrderForm" 
              style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
          
          <!-- Employee Info -->
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Employee Name <span style="color:red">*</span></label>
            <input type="text" name="employeeName" required 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Department <span style="color:red">*</span></label>
            <input type="text" name="department" required 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Date Filed <span style="color:red">*</span></label>
            <input type="date" name="dateFiled" required 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Travel Date <span style="color:red">*</span></label>
            <input type="date" name="travelDate" required 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <!-- Travel From/To + Time -->
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Travel From</label>
            <input type="text" name="travelFrom" 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Travel To</label>
            <input type="text" name="travelTo" 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Time Out</label>
            <input type="time" name="timeOut" 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Time In</label>
            <input type="time" name="timeIn" 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <!-- Driver / Reliever -->
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Driver’s Name</label>
            <input type="text" name="driversName" 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Reliever’s Name</label>
            <input type="text" name="relieversName" 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <!-- Passengers -->
          <div style="grid-column:1/-1; display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:6px;">Other Passengers</label>
            <div id="passengersWrapper" style="display:grid; gap:8px; margin-bottom:8px;">
              <div style="display:flex; gap:8px; align-items:center;">
                <input name="passenger[]" placeholder="Passenger 1" 
                       style="flex:1; padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
                <button type="button" class="removePassengerBtn" 
                        style="background:#f87171; color:white; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
              </div>
            </div>
            <button type="button" id="addPassengerBtn" 
                    style="background:#0ea5a4; color:white; padding:6px 14px; border:none; border-radius:6px; cursor:pointer; font-size:14px;">+ Add Passenger</button>
          </div>

          <!-- Car Unit -->
          <div style="grid-column:1/-1; display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Car Unit / Plate #</label>
            <input type="text" name="carUnit" 
                   style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;">
          </div>

          <!-- Purpose -->
          <div style="grid-column:1/-1; display:flex; flex-direction:column;">
            <label style="font-size:14px; font-weight:500; margin-bottom:4px;">Purpose <span style="color:red">*</span></label>
            <textarea name="purpose" rows="3" required 
                      style="padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px;"></textarea>
          </div>

          <!-- Buttons -->
          <div style="grid-column:1/-1; display:flex; justify-content:flex-end; gap:12px; margin-top:12px;">
            <button type="button" id="cancelTravelOrder" 
                    style="background:#e5e7eb; color:#374151; padding:8px 18px; border:none; border-radius:8px; cursor:pointer;">Cancel</button>
            <button type="submit" 
                    style="background:#0ea5a4; color:white; padding:8px 18px; border:none; border-radius:8px; cursor:pointer; font-weight:500;">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Loading Modal -->
    <div id="loadingTravelModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); 
                display:flex; align-items:center; justify-content:center; z-index:2000;">
      <div style="background:white; padding:20px 30px; border-radius:10px; 
                  box-shadow:0 8px 20px rgba(0,0,0,0.25); color:#0ea5a4; font-weight:500;">
        Saving Travel Order...
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
