// assets/js/drivers_trip_ticket_form_modal.js

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

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px; font-weight:600;">Travel Order Form</h2>

        <form id="travelOrderForm" 
              style="display:flex; flex-direction:column; gap:24px;">
          
          <!-- SECTION 1: Employee Info -->
          <div style="border-bottom:1px solid #e5e7eb; padding-bottom:16px;">
            <h3 style="font-size:18px; margin-bottom:12px; color:#374151;">Employee Information</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
              <div style="display:flex; flex-direction:column;">
                <label>Employee Name <span style="color:red">*</span></label>
                <input type="text" name="employeeName" required 
                       style="padding:8px 10px; border:1px solid #ccc; border-radius:6px;">
              </div>
              <div style="display:flex; flex-direction:column;">
                <label>Department <span style="color:red">*</span></label>
                <input type="text" name="department" required 
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

function attachDriversTripTicketForm() {
  const modal = document.getElementById("driversTripTicketModal");
  const form = document.getElementById("driversTripTicketForm");

  document.getElementById("closeDriversTripTicketModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelDriversTripTicket").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = "DTT-" + Date.now();
    const formData = new FormData(form);
    const data = { id };

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    data.status = "Pending";
    data.dateSubmitted = firebase.firestore.FieldValue.serverTimestamp();

    try {
      await db.collection("drivers_trip_tickets").doc(id).set(data);
      alert(`✅ Driver's Trip Ticket Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";
      form.reset();
    } catch (err) {
      console.error("❌ Error saving Driver's Trip Ticket:", err);
      alert("Error submitting Trip Ticket.");
    }
  });
}

function mountDriversTripTicketForm() {
  if (!document.getElementById("driversTripTicketModal")) {
    document.body.insertAdjacentHTML("beforeend", renderDriversTripTicketForm());
    attachDriversTripTicketForm();
  }
  const modal = document.getElementById("driversTripTicketModal");
  if (modal) modal.style.display = "flex";
}

window.mountDriversTripTicketForm = mountDriversTripTicketForm;
