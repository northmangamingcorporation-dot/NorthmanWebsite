// assets/js/it_service_order_form_modal.js

function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" style="display:none; position:fixed; inset:0; z-index:50; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; overflow:auto; padding:16px;">
      <div style="background:white; border-radius:1rem; max-width:768px; width:100%; padding:24px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        
        <span id="closeITServiceModal" style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px;">&times;</span>
        
        <h2 style="font-size:24px; font-weight:600; color:#0ea5a4; margin-bottom:16px; text-align:center;">IT Service Order Form</h2>

        <form id="itServiceForm">

          <!-- Employee Info (Row 1) -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; margin-bottom:16px;">
            <input type="text" name="name" placeholder="Full Name" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            <input type="text" name="department" placeholder="Department" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            <input type="text" name="position" placeholder="Position" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            <input type="text" name="contact" placeholder="Email/Phone" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
          </div>

          <!-- Service Info (Row 2) -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; margin-bottom:16px;">
            <select name="type" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
              <option value="">Select Type</option>
              <option value="Hardware Issue">Hardware Issue</option>
              <option value="Software Installation">Software Installation</option>
              <option value="Network Problem">Network Problem</option>
              <option value="Account Access">Account Access</option>
              <option value="Peripheral Setup">Peripheral Setup</option>
              <option value="Other">Other</option>
            </select>

            <select name="priority" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            <input type="text" name="asset" placeholder="Asset/Device Involved" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            <input type="text" name="location" placeholder="Location" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            <textarea name="description" rows="4" placeholder="Problem / Request Description" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancelITForm" style="padding:8px 16px; border-radius:6px; background:#e5e7eb;">Cancel</button>
            <button type="submit" style="padding:8px 16px; border-radius:6px; background:#0ea5a4; color:white;">Submit</button>
          </div>

        </form>
      </div>
    </div>
  `;
}


function attachITServiceForm() {
  const modal = document.getElementById("itServiceModal");
  const form = document.getElementById("itServiceForm");

  document.getElementById("closeITServiceModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelITForm").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    const id = "IT-" + Date.now();
    const data = { id, ...formData, status: "Pending", dateSubmitted: serverTimestamp() };

    try {
      await setDoc(doc(collection(db, "it_service_orders"), id), data);
      alert(`✅ IT Service Order Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";
      form.reset();
    } catch (err) {
      console.error("❌ Error saving IT Service Order:", err);
      alert("Error submitting request. Please try again.");
    }
  });
}

function mountITServiceForm() {
  if (!document.getElementById("itServiceModal")) {
    document.body.insertAdjacentHTML("beforeend", renderITServiceOrderForm());
    attachITServiceForm();
  }
  const modal = document.getElementById("itServiceModal");
  if (modal) modal.style.display = "flex";
}

window.mountITServiceForm = mountITServiceForm;
