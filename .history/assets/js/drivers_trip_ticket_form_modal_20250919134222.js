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
  `;
}

function attachDriversTripTicketForm(preFillUsername = "") {
  const modal = document.getElementById("driversTripTicketModal");
  const form = document.getElementById("driversTripTicketForm");

  document.getElementById("closeDriversTripTicketModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelDriversTripTicket").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Handle previews
  ["departureProof", "arrivalProof"].forEach((inputName) => {
    const input = form.querySelector(`input[name="${inputName}"]`);
    const previewDiv = form.querySelector(`.${inputName.includes("departure") ? "departurePreview" : "arrivalPreview"}`);
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewDiv.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
          previewDiv.onclick = () => openImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  });

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

  // Fullscreen preview modal
const imageModal = document.getElementById("imagePreviewModal");
const previewImage = document.getElementById("previewImage");
const closeImagePreview = document.getElementById("closeImagePreview");
let zoomLevel = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

// Open modal
window.openImagePreview = (src) => {
  previewImage.src = src;
  zoomLevel = 1;
  translateX = translateY = 0;
  previewImage.style.transform = "translate(0px, 0px) scale(1)";
  imageModal.style.display = "flex";
};

// Close button
closeImagePreview.addEventListener("click", () => imageModal.style.display = "none");

// Close when clicking outside image
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    imageModal.style.display = "none";
  }
});

// Mouse scroll zoom
imageModal.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomFactor = 0.1;
  if (e.deltaY < 0) {
    zoomLevel += zoomFactor; // zoom in
  } else if (zoomLevel > 0.2) {
    zoomLevel -= zoomFactor; // zoom out
  }
  previewImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
});

// Mouse drag for panning
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

window.addEventListener("mouseup", () => {
  isDragging = false;
  previewImage.style.cursor = "grab";
});

// Attach Cancel button logic
document.querySelectorAll(".cancelBtn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal-overlay");
    const form = modal.querySelector("form");

    if (form) form.reset(); // ✅ Reset all input fields
    modal.style.display = "none"; // ✅ Hide modal
  });
});

}

function mountDriversTripTicketForm(p) {
  if (!document.getElementById("driversTripTicketModal")) {
    document.body.insertAdjacentHTML("beforeend", renderDriversTripTicketForm());
    attachDriversTripTicketForm(preFillUsername);
  }
  const modal = document.getElementById("driversTripTicketModal");
  if (modal) modal.style.display = "flex";
}

window.mountDriversTripTicketForm = mountDriversTripTicketForm;
