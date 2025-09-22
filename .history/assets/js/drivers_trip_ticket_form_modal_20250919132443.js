// assets/js/drivers_trip_ticket_form_modal.js

function renderDriversTripTicketForm() {
  return `
    <div id="driversTripTicketModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      <div style="background:white; border-radius:12px; max-width:850px; width:100%; padding:24px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">

        <!-- Close Button -->
        <span id="closeDriversTripTicketModal" style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px;">&times;</span>

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px;">🚐 Driver's Trip Ticket</h2>

        <form id="driversTripTicketForm" style="display:flex; flex-direction:column; gap:24px;">

          <!-- Driver & Vehicle Info -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Name of Driver <span style="color:red;">*</span></label>
              <input type="text" name="driverName" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Vehicle Type & Plate No. <span style="color:red;">*</span></label>
              <input type="text" name="vehicleInfo" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
          </div>

          <!-- Passenger & Purpose -->
          <div style="display:flex; flex-direction:column;">
            <label style="margin-bottom:4px;">Names of Authorized Passenger/s</label>
            <textarea name="authorizedPassengers" rows="2" placeholder="Enter names separated by commas" style="padding:10px; border-radius:6px; border:1px solid #ccc;"></textarea>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Place/s to be visited</label>
              <input type="text" name="placesVisited" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Purpose</label>
              <input type="text" name="purpose" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
          </div>

          <!-- Departure -->
          <h3 style="margin:0; font-size:18px; border-bottom:1px solid #e5e7eb; padding-bottom:8px;">📤 Departure from Office</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Time of Departure</label>
              <input type="time" name="departureTime" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Odometer Reading</label>
              <input type="number" name="departureOdometer" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Mileage In</label>
              <input type="number" name="mileageIn" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Proof (Upload Photo)</label>
              <input type="file" name="departureProof" accept="image/*" style="padding:6px; border-radius:6px; border:1px solid #ccc;">
            </div>
          </div>

          <!-- Arrival -->
          <h3 style="margin:0; font-size:18px; border-bottom:1px solid #e5e7eb; padding-bottom:8px;">📥 Arrival</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Time of Arrival</label>
              <input type="time" name="arrivalTime" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Odometer Reading</label>
              <input type="number" name="arrivalOdometer" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Mileage Out</label>
              <input type="number" name="mileageOut" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Proof (Upload Photo)</label>
              <input type="file" name="arrivalProof" accept="image/*" style="padding:6px; border-radius:6px; border:1px solid #ccc;">
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
            <button type="button" id="cancelDriversTripTicket" style="padding:10px 16px; border-radius:6px; background:#e5e7eb;">Cancel</button>
            <button type="submit" style="padding:10px 16px; border-radius:6px; background:#0ea5a4; color:white;">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function attachDriversTripTicketForm() {
  const modal = document.getElementById("driversTripTicketModal");
  const form = document.getElementById("driversTripTicketForm");

  // Close modal
  document.getElementById("closeDriversTripTicketModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelDriversTripTicket").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = "DTT-" + Date.now();
    const formData = new FormData(form);
    const data = { id };

    for (let [key, value] of formData.entries()) {
      data[key] = typeof value === "string" ? value.toUpperCase() : value;
    }

    data.dateSubmitted = firebase.firestore.FieldValue.serverTimestamp();
    data.status = "Pending";

    try {
      await db.collection("drivers_trip_tickets").doc(id).set(data);
      alert(`✅ Driver's Trip Ticket Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";
      form.reset();

      if (window.mountDashboard) {
        window.mountDashboard(window.currentUser);
      }
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
