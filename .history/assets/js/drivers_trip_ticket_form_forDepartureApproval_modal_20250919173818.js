// assets/js/drivers_trip_ticket_form_modal.js

// assets/js/drivers_trip_ticket_form_modal.js

function renderDriversTripTicketForm() {
  return `
    <div id="driversTripTicketModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      <div style="background:white; border-radius:12px; max-width:650px; width:100%; padding:24px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">

        <!-- Close -->
        <span id="closeDriversTripTicketModal" style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:22px;">✖</span>

        <h2 style="text-align:center; font-size:22px; margin-bottom:20px; color:#0ea5a4;">Departure Approval</h2>

        <form id="driversTripTicketForm" style="display:flex; flex-direction:column; gap:20px;">

          <!-- Driver & Vehicle -->
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

          <!-- Passenger & Places -->
          <div style="display:flex; flex-direction:column;">
            <label>Names of Authorized Passenger/s</label>
            <textarea name="authorizedPassengers" rows="2" style="padding:10px; border:1px solid #ccc; border-radius:6px;"></textarea>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Place/s to be visited</label>
            <input type="text" name="placesVisited" style="padding:10px; border:1px solid #ccc; border-radius:6px;">
          </div>

          <!-- Departure Section -->
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

          <!-- Purpose (Rich Text) -->
          <div style="display:flex; flex-direction:column;">
            <label>Purpose</label>
            <div id="purposeEditor" contenteditable="true" style="min-height:100px; padding:10px; border:1px solid #ccc; border-radius:6px; overflow:auto;"></div>
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
    </div>
  `;
}


function attachDriversTripTicketForm(preFillUsername = "") {
  const modal = document.getElementById("driversTripTicketModal");
  const form = document.getElementById("driversTripTicketForm");

  document.getElementById("closeDriversTripTicketModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelDriversTripTicket").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Handle file inputs & preview (only departure)
  const input = form.querySelector(`input[name="departureProof"]`);
  const previewDiv = form.querySelector(`.departurePreview`);
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewDiv.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
      previewDiv.onclick = () => openImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  });

  // Form submit handling
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = "DTT-" + Date.now();
    const formData = new FormData(form);
    const data = { 
      id, 
      status: "Pending", 
      dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(), 
      username: preFillUsername 
    };

    // Collect only departure-related fields
    for (let [key, value] of formData.entries()) {
      if (key !== "departureProof") data[key] = value;
    }

    try {
      // Save non-file data to Firestore
      await db.collection("drivers_trip_tickets").doc(id).set(data);
      alert(`✅ Driver's Trip Ticket Departure Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";

      // Prepare file for Telegram
      const file = input.files[0];
      const filesToSend = file ? [{ key: "departureProof", file }] : [];

      if (window.TelegramConnect) {
        window.TelegramConnect.sendRequest(data, "Driver's Trip Ticket", filesToSend);
      }

      form.reset();
      previewDiv.innerHTML = '<span style="font-size:12px; color:#888;">No Image</span>';
    } catch (err) {
      console.error("❌ Error saving Driver's Trip Ticket:", err);
      alert("Error submitting Trip Ticket.");
    }
  });

  // Fullscreen image preview & zoom/pan (same as before)
  const imageModal = document.getElementById("imagePreviewModal");
  const previewImage = document.getElementById("previewImage");
  const closeImagePreview = document.getElementById("closeImagePreview");
  let zoomLevel = 1, isDragging = false, startX, startY, translateX = 0, translateY = 0;

  window.openImagePreview = (src) => {
    previewImage.src = src;
    zoomLevel = 1; translateX = 0; translateY = 0;
    previewImage.style.transform = "translate(0px, 0px) scale(1)";
    imageModal.style.display = "flex";
  };

  closeImagePreview.addEventListener("click", () => imageModal.style.display = "none");
  imageModal.addEventListener("click", (e) => { if (e.target === imageModal) imageModal.style.display = "none"; });

  imageModal.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY < 0 ? 0.1 : -0.1;
    if (zoomLevel < 0.2) zoomLevel = 0.2;
    previewImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
  });

  previewImage.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    previewImage.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    previewImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
  });

  window.addEventListener("mouseup", () => { isDragging = false; previewImage.style.cursor = "grab"; });
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
