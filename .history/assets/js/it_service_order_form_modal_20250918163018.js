// assets/js/it_service_order_form_modal.js

function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:16px; overflow:auto; z-index:1000;">
      <div style="background:white; border-radius:12px; max-width:800px; width:100%; padding:24px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">

        <!-- Close button -->
        <span id="closeITServiceModal" style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px;">&times;</span>

        <h2 style="text-align:center; font-size:24px; color:#0ea5a4; margin-bottom:24px;">IT Service Order Form</h2>

        <form id="itServiceForm">

          <!-- Employee Info -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Username <span style="color:red;">*</span></label>
              <input type="text" name="username" placeholder="JohnDoe" required style="padding:10px; border-radius:6px; border:1px solid #ccc;" disabled>
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Department <span style="color:red;">*</span></label>
              <input type="text" name="department" placeholder="IT" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Position</label>
              <input type="text" name="position" placeholder="System Administrator" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="grid-column:1/-1; display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Contact (Email/Phone) <span style="color:red;">*</span></label>
              <input type="text" name="contact" placeholder="john@example.com" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
          </div>

          <!-- Service Info -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Type of Request <span style="color:red;">*</span></label>
              <select name="type" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
                <option value="">Select Type</option>
                <option value="Hardware Issue">Hardware Issue</option>
                <option value="Software Installation">Software Installation</option>
                <option value="Network Problem">Network Problem</option>
                <option value="Account Access">Account Access</option>
                <option value="Peripheral Setup">Peripheral Setup</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Priority Level <span style="color:red;">*</span></label>
              <select name="priority" required style="padding:10px; border-radius:6px; border:1px solid #ccc;">
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Asset/Device Involved</label>
              <input type="text" name="asset" placeholder="Laptop, Printer, etc." style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Location</label>
              <input type="text" name="location" placeholder="Office / Building" style="padding:10px; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div style="grid-column:1/-1; display:flex; flex-direction:column;">
              <label style="margin-bottom:4px;">Problem / Request Description <span style="color:red;">*</span></label>
              <textarea name="description" rows="4" placeholder="Describe the problem..." required style="padding:10px; border-radius:6px; border:1px solid #ccc;"></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancelITForm" style="padding:10px 16px; border-radius:6px; background:#e5e7eb;">Cancel</button>
            <button type="submit" style="padding:10px 16px; border-radius:6px; background:#0ea5a4; color:white;">Submit</button>
          </div>

        </form>
      </div>
    </div>
  `;
}

function attachITServiceForm(preFillUsername = "") {
  const modal = document.getElementById("itServiceModal");
  const form = document.getElementById("itServiceForm");
  form.querySelector('input[name="username"]').value = preFillUsername;
  // Close modal handlers
  document.getElementById("closeITServiceModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelITForm").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    Modal.show("Saving request...");
    // Convert all string inputs to uppercase before sending
    const formDataObj = {};
    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
      formDataObj[key] = typeof value === "string" ? value.toUpperCase() : value;
    }

    const id = "IT-" + Date.now();
    const data = { 
      id, username: preFillUsername,
      ...formDataObj, 
      status: "Pending", 
      dateSubmitted: firebase.firestore.FieldValue.serverTimestamp() // compat API
    };

    try {
      // Save to Firestore using compat API
      await db.collection("it_service_orders").doc(id).set(data);

      alert(`✅ IT Service Order Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";
      form.reset();
      
      // Reload the dashboard after successful submission
      if (window.mountDashboard) {
        window.mountDashboard({ username: preFillUsername });
      }
    } catch (err) {
      console.error("❌ Error saving IT Service Order:", err);
      alert("Error submitting request. Please try again.");
    }
  });
}


function mountITServiceForm(preFillUsername = "") {
  if (!document.getElementById("itServiceModal")) {
    document.body.insertAdjacentHTML("beforeend", renderITServiceOrderForm());
    attachITServiceForm(preFillUsername);
  }
  const modal = document.getElementById("itServiceModal");
  if (modal) modal.style.display = "flex";
}

window.mountITServiceForm = mountITServiceForm;
