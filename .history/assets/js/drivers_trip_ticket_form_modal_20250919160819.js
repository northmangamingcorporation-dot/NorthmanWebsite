// assets/js/drivers_trip_ticket_form_modal.js

function renderDriversTripTicketForm() {
  return `
    <div id="driversTripTicketModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      <div style="background:white; border-radius:12px; max-width:850px; width:100%; padding:24px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">

        <!-- Close -->
        <span id="closeDriversTripTicketModal" style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:22px;">✖</span>

        <h2 style="text-align:center; font-size:22px; margin-bottom:20px; color:#0ea5a4;">Driver's Trip Ticket</h2>

        <form id="driversTripTicketForm" style="display:flex; flex-direction:column; gap:20px;">

          <!-- Driver and Vehicle -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label>Name of Driver</label>
              <input type="text" name="driverName" required style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Vehicle Type & Plate No.</label>
              <input type="text" name="vehicleInfo" required style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
          </div>

          <!-- Passenger & Purpose -->
          <div style="display:flex; flex-direction:column;">
            <label>Names of Authorized Passenger/s</label>
            <textarea name="authorizedPassengers" rows="2" style="padding:10px; border:1px solid #ccc; border-radius:6px;"></textarea>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label>Place/s to be visited</label>
              <input type="text" name="placesVisited" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Purpose</label>
              <input type="text" name="purpose" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
          </div>

          <!-- Departure -->
          <h3 style="margin:0; font-size:18px; border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Departure</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label>Time of Departure</label>
              <input type="time" name="departureTime" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Odometer Reading</label>
              <input type="number" name="departureOdometer" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Mileage In</label>
              <input type="number" name="mileageIn" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Proof (Upload Photo)</label>
              <input type="file" name="departureProof" accept="image/*" style="padding:6px; border:1px solid #ccc; border-radius:6px;">
              <div class="preview departurePreview" style="margin-top:8px; width:100px; height:100px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; overflow:hidden; cursor:pointer;">
                <span style="font-size:12px; color:#888;">No Image</span>
              </div>
            </div>
          </div>

          <!-- Arrival -->
          <h3 style="margin:0; font-size:18px; border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Arrival</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:16px;">
            <div style="display:flex; flex-direction:column;">
              <label>Time of Arrival</label>
              <input type="time" name="arrivalTime" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Odometer Reading</label>
              <input type="number" name="arrivalOdometer" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Mileage Out</label>
              <input type="number" name="mileageOut" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label>Proof (Upload Photo)</label>
              <input type="file" name="arrivalProof" accept="image/*" style="padding:6px; border:1px solid #ccc; border-radius:6px;">
              <div class="preview arrivalPreview" style="margin-top:8px; width:100px; height:100px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; overflow:hidden; cursor:pointer;">
                <span style="font-size:12px; color:#888;">No Image</span>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancelDriversTripTicket" style="padding:10px 16px; border-radius:6px; background:#e5e7eb;">Cancel</button>
            <button type="submit" style="padding:10px 16px; border-radius:6px; background:#0ea5a4; color:white;">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Fullscreen Image Preview -->
    <div id="imagePreviewModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:2000; justify-content:center; align-items:center;">
      <span id="closeImagePreview" style="position:absolute; top:20px; right:30px; font-size:30px; color:white; cursor:pointer;">✖</span>
      <img id="previewImage" src="" style="max-width:90%; max-height:90%; transform:scale(1); transition:transform 0.2s;">
      <div style="position:absolute; bottom:30px; display:flex; gap:20px;">
        <button id="zoomIn" style="padding:10px 14px; font-size:16px; border:none; border-radius:6px; background:white; cursor:pointer;">➕ Zoom In</button>
        <button id="zoomOut" style="padding:10px 14px; font-size:16px; border:none; border-radius:6px; background:white; cursor:pointer;">➖ Zoom Out</button>
      </div>
    </div>

    <!-- Confirmation Modal with Image Preview -->
    <div id="uploadConfirmModal" class="modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:2000;">
    <div style="background:white; padding:24px; border-radius:8px; max-width:400px; width:100%; text-align:center;">
        <h3>Confirm Upload</h3>
        <div style="margin:16px 0;">
        <img id="confirmPreviewImage" src="" alt="Preview" style="width:150px; height:150px; object-fit:cover; border-radius:8px; border:1px solid #ccc;">
        </div>
        <p>Are you sure you want to upload this photo?</p>
        <div style="margin-top:16px; display:flex; justify-content:space-around;">
        <button id="confirmUploadBtn" style="padding:8px 16px; background:green; color:white; border:none; border-radius:4px;">Yes</button>
        <button id="cancelUploadBtn" style="padding:8px 16px; background:red; color:white; border:none; border-radius:4px;">No</button>
        </div>
    </div>
    </div>
  `;
}

function attachDriversTripTicketForm(preFillUsername = "") {
  const modal = document.getElementById("driversTripTicketModal");
  const form = document.getElementById("driversTripTicketForm");

  // Close modal handlers
  document.getElementById("closeDriversTripTicketModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelDriversTripTicket").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Submit handling
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
    data.username = preFillUsername;

    try {
      await db.collection("drivers_trip_tickets").doc(id).set(data);
      alert(`✅ Driver's Trip Ticket Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";

      if (window.TelegramConnect) {
        const photos = [];
        ["departureProof", "arrivalProof"].forEach((field) => {
          const fileInput = form.querySelector(`input[name="${field}"]`);
          if (fileInput && fileInput.files.length > 0) {
            photos.push({ key: field, file: fileInput.files[0] });
          }
        });

        // Remove raw file objects from caption
        const captionData = { ...data };
        delete captionData.departureProof;
        delete captionData.arrivalProof;

        if (photos.length === 0) {
          // Send text only
          window.TelegramConnect.sendRequest(captionData, "Driver's Trip Ticket");
        } else {
          // Send each photo with ticket info as caption
          for (const p of photos) {
            const photoCaption = { ...captionData };
            photoCaption[p.key] = p.file.name;
            window.TelegramConnect.sendRequest(photoCaption, "Driver's Trip Ticket", p.file);
          }
        }
      }

      form.reset();
    } catch (err) {
      console.error("❌ Error saving Driver's Trip Ticket:", err);
      alert("Error submitting Trip Ticket.");
    }
  });
}


function mountDriversTripTicketForm(preFillUsername = "") {
  if (!document.getElementById("driversTripTicketModal")) {
    document.body.insertAdjacentHTML("beforeend", renderDriversTripTicketForm());
    attachDriversTripTicketForm(preFillUsername);
  }
  const modal = document.getElementById("driversTripTicketModal");
  if (modal) modal.style.display = "flex";
}

window.mountDriversTripTicketForm = mountDriversTripTicketForm;
