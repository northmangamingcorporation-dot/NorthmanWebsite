// assets/js/travel_order_form_modal.js

// ✅ Renders the Travel Order Form
function renderTravelOrderForm() {
  return `
    <div id="travelOrderModal" 
         style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); 
                display:flex; align-items:center; justify-content:center; padding:16px; 
                overflow:auto; z-index:1000;">
      <div style="background:white; border-radius:12px; max-width:800px; width:100%; padding:24px; position:relative;">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2 style="margin:0; font-size:20px; font-weight:bold; color:#333;">✈️ Travel Order Form</h2>
          <button id="closeTravelOrderModal" 
                  style="border:none; background:transparent; font-size:20px; cursor:pointer;">✖</button>
        </div>
        
        <!-- Form -->
        <form id="travelOrderForm" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          
          <div style="display:flex; flex-direction:column;">
            <label>Employee Name:</label>
            <input type="text" name="employeeName" required>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Department:</label>
            <input type="text" name="department" required>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Date Filed:</label>
            <input type="date" name="dateFiled" required>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Travel Date:</label>
            <input type="date" name="travelDate" required>
          </div>

          <div style="grid-column: span 2; display:flex; flex-direction:column;">
            <label>Other Passengers (max 4):</label>
            <textarea name="otherPassengers" rows="2" placeholder="Enter names separated by commas"></textarea>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Driver's Name:</label>
            <input type="text" name="driverName">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Reliever's Name:</label>
            <input type="text" name="relieverName">
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Time In:</label>
            <input type="time" name="timeIn" required>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Time Out:</label>
            <input type="time" name="timeOut" required>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Travel From:</label>
            <input type="text" name="travelFrom" required>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Travel To:</label>
            <input type="text" name="travelTo" required>
          </div>

          <div style="display:flex; flex-direction:column;">
            <label>Car Unit/Plate #:</label>
            <input type="text" name="carUnit" required>
          </div>

          <div style="grid-column: span 2; display:flex; flex-direction:column;">
            <label>Purpose:</label>
            <textarea name="purpose" rows="3" required></textarea>
          </div>

          <!-- Buttons -->
          <div style="grid-column: span 2; display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
            <button type="button" id="cancelTravelForm" 
                    style="padding:10px 16px; border:none; background:#ccc; border-radius:8px; cursor:pointer;">Cancel</button>
            <button type="submit" 
                    style="padding:10px 16px; border:none; background:#007bff; color:white; border-radius:8px; cursor:pointer;">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>

    <!-- 🔹 Loading Modal -->
    <div id="loadingModal" 
         style="display:none; position:fixed; inset:0; background:rgba(255,255,255,0.8); 
                display:flex; align-items:center; justify-content:center; z-index:2000; font-size:18px; font-weight:bold;">
      Saving, please wait...
    </div>
  `;
}

// ✅ Attaches functionality
function attachTravelOrderForm() {
  const modal = document.getElementById("travelOrderModal");
  const form = document.getElementById("travelOrderForm");
  const loadingModal = document.getElementById("loadingModal");

  // Close buttons
  document.getElementById("closeTravelOrderModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelTravelForm").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loadingModal.style.display = "flex";

    const formDataObj = {};
    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
      formDataObj[key] = typeof value === "string" ? value.toUpperCase() : value;
    }

    const id = "TO-" + Date.now();
    const data = {
      id,
      ...formDataObj,
      status: "Pending",
      dateSubmitted: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await db.collection("travel_orders").doc(id).set(data);

      loadingModal.style.display = "none";
      alert(`✅ Travel Order Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";
      form.reset();

      // 🔄 Refresh dashboard if available
      if (typeof window.mountDashboard === "function" && window.currentUser) {
        window.mountDashboard(window.currentUser);
      }
    } catch (err) {
      console.error("❌ Error saving Travel Order:", err);
      alert("Error submitting request. Please try again.");
      loadingModal.style.display = "none";
    }
  });
}

// ✅ Expose globally
window.renderTravelOrderForm = renderTravelOrderForm;
window.attachTravelOrderForm = attachTravelOrderForm;
