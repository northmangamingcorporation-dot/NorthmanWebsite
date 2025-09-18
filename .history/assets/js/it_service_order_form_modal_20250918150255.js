// assets/js/it_service_order_form_modal.js

function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" class="modal-overlay" style="display:none;">
      <div class="modal-card">
        <span id="closeITServiceModal" class="close-btn">&times;</span>
        <h2 class="modal-title">IT Service Order Form</h2>

        <form id="itServiceForm" class="modal-form">

          <div class="form-grid">
            <!-- Requester Info -->
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" required>
            </div>

            <div class="form-group">
              <label>Department</label>
              <input type="text" name="department" placeholder="IT" required>
            </div>

            <div class="form-group">
              <label>Position</label>
              <input type="text" name="position" placeholder="System Administrator">
            </div>

            <div class="form-group">
              <label>Contact (Email/Phone)</label>
              <input type="text" name="contact" placeholder="john@example.com" required>
            </div>

            <!-- Request Details -->
            <div class="form-group">
              <label>Type of Request</label>
              <select name="type" required>
                <option value="Hardware Issue">Hardware Issue</option>
                <option value="Software Installation">Software Installation</option>
                <option value="Network Problem">Network Problem</option>
                <option value="Account Access">Account Access</option>
                <option value="Peripheral Setup">Peripheral Setup</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>Priority Level</label>
              <select name="priority" required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div class="form-group">
              <label>Asset/Device Involved</label>
              <input type="text" name="asset" placeholder="Laptop, Printer, etc.">
            </div>

            <div class="form-group">
              <label>Location</label>
              <input type="text" name="location" placeholder="Office / Building">
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Problem / Request Description</label>
              <textarea name="description" rows="4" placeholder="Describe the problem..." required></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" id="cancelITForm" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit">Submit</button>
          </div>

        </form>
      </div>
    </div>
  `;
}

// Attach events remain same
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
      modal.style.display = "flex"; // keep visible for demo if needed
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


document.head.appendChild(itStyle);
