// assets/js/it_service_order_form_modal.js

function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" class="modal-overlay" style="display:none; position:fixed; inset:0; z-index:50; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center;">
      <div class="modal-card" style="background:white; border-radius:1rem; box-shadow:0 10px 25px rgba(0,0,0,0.2); width:100%; max-width:768px; padding:24px; position:relative;">
        
        <span id="closeITServiceModal" class="close-btn" style="position:absolute; top:16px; right:16px; cursor:pointer; font-size:24px;">&times;</span>
        
        <h2 class="modal-title" style="font-size:24px; font-weight:600; color:#0ea5a4; margin-bottom:16px;">IT Service Order Form</h2>

        <form id="itServiceForm">

          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px;">
            <div>
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            </div>

            <div>
              <label>Department</label>
              <input type="text" name="department" placeholder="IT" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            </div>

            <div>
              <label>Position</label>
              <input type="text" name="position" placeholder="System Administrator" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            </div>

            <div>
              <label>Contact (Email/Phone)</label>
              <input type="text" name="contact" placeholder="john@example.com" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            </div>

            <div>
              <label>Type of Request</label>
              <select name="type" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
                <option value="Hardware Issue">Hardware Issue</option>
                <option value="Software Installation">Software Installation</option>
                <option value="Network Problem">Network Problem</option>
                <option value="Account Access">Account Access</option>
                <option value="Peripheral Setup">Peripheral Setup</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Priority Level</label>
              <select name="priority" required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label>Asset/Device Involved</label>
              <input type="text" name="asset" placeholder="Laptop, Printer, etc." style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            </div>

            <div>
              <label>Location</label>
              <input type="text" name="location" placeholder="Office / Building" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
            </div>

            <div style="grid-column:1/-1;">
              <label>Problem / Request Description</label>
              <textarea name="description" rows="4" placeholder="Describe the problem..." required style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;"></textarea>
            </div>
          </div>

          <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:12px;">
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
