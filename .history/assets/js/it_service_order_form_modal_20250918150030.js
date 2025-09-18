// assets/js/it_service_order_form_modal.js

// 🔹 Render the modal form
function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" class="modal-overlay" style="display:none;">
      <div class="modal-card">
        <span id="closeITServiceModal" class="close-btn">&times;</span>
        <h2 class="modal-title">IT Service Order Form</h2>

        <form id="itServiceForm" class="modal-form">

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

          <hr class="divider">

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

          <div class="form-group">
            <label>Problem / Request Description</label>
            <textarea name="description" rows="4" placeholder="Describe the problem..." required></textarea>
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

// 🔹 Attach Events
function attachITServiceForm() {
  const modal = document.getElementById("itServiceModal");
  const form = document.getElementById("itServiceForm");
  const closeBtn = document.getElementById("closeITServiceModal");

  // Close modal
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelITForm").addEventListener("click", () => modal.style.display = "none");

  // Close when clicking outside card
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });

  // Submit Handler
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

// 🔹 Mount Function
function mountITServiceForm() {
  if (!document.getElementById("itServiceModal")) {
    document.body.insertAdjacentHTML("beforeend", renderITServiceOrderForm());
    attachITServiceForm();
  }

  const modal = document.getElementById("itServiceModal");
  if (modal) modal.style.display = "flex";
}

// Expose Globally
window.mountITServiceForm = mountITServiceForm;

// --- Styles ---
const itStyle = document.createElement("style");
itStyle.innerHTML = `
.modal-overlay {
  position: fixed;
  top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.6);
  display:flex; justify-content:center; align-items:center;
  z-index: 9999;
}

.modal-card {
  background:#fff;
  padding:28px;
  border-radius:14px;
  width:100%;
  max-width:480px;
  box-shadow:0 8px 20px rgba(0,0,0,0.25);
  position:relative;
  animation: modalFade 0.2s ease;
}

@keyframes modalFade {
  from { opacity:0; transform: translateY(-20px); }
  to { opacity:1; transform: translateY(0); }
}

.close-btn {
  position:absolute; top:12px; right:16px;
  font-size:24px; cursor:pointer; color:#555;
  transition: color 0.2s;
}
.close-btn:hover { color:#000; }

.modal-title {
  text-align:center;
  font-size:22px;
  margin-bottom:24px;
  font-weight:600;
  color:#111827;
}

.modal-form .form-group {
  display:flex; flex-direction:column;
  margin-bottom:16px;
}

.modal-form label {
  font-weight:500; margin-bottom:6px; color:#374151;
}

.modal-form input, .modal-form select, .modal-form textarea {
  padding:10px 12px;
  border:1px solid #d1d5db;
  border-radius:8px;
  font-size:14px;
  outline:none;
  transition:border-color 0.2s;
}
.modal-form input:focus, .modal-form select:focus, .modal-form textarea:focus {
  border-color: #4f46e5;
}

.divider { margin:16px 0; border:none; border-top:1px solid #e5e7eb; }

.form-actions {
  display:flex; justify-content:flex-end; gap:12px; margin-top:10px;
}

.btn-cancel {
  background:#f3f4f6;
  color:#374151;
  padding:10px 16px;
  border:none;
  border-radius:8px;
  cursor:pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { background:#e5e7eb; }

.btn-submit {
  background:#4f46e5;
  color:#fff;
  padding:10px 16px;
  border:none;
  border-radius:8px;
  cursor:pointer;
  transition: all 0.2s;
}
.btn-submit:hover { background:#4338ca; }
`;
document.head.appendChild(itStyle);
