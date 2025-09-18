// assets/js/itServiceOrderForm.js

// Firestore import (make sure Firebase is initialized in firebase.js before this)
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

// 🔹 Render the modal form
function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" class="modal-overlay" style="display:none;
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:9999;">
      
      <div class="modal" style="background:#fff; padding:20px; border-radius:10px; width:420px; max-width:95%;">
        <h2 style="margin:0 0 16px 0; text-align:center;">IT Service Order Form</h2>
        <form id="itServiceForm">
          
          <!-- Requester Info -->
          <label>Full Name</label>
          <input type="text" name="name" required>

          <label>Department</label>
          <input type="text" name="department" required>

          <label>Position</label>
          <input type="text" name="position">

          <label>Contact (Email/Phone)</label>
          <input type="text" name="contact" required>

          <hr style="margin:16px 0">

          <!-- Request Details -->
          <label>Type of Request</label>
          <select name="type" required>
            <option value="Hardware Issue">Hardware Issue</option>
            <option value="Software Installation">Software Installation</option>
            <option value="Network Problem">Network Problem</option>
            <option value="Account Access">Account Access</option>
            <option value="Peripheral Setup">Peripheral Setup</option>
            <option value="Other">Other</option>
          </select>

          <label>Priority Level</label>
          <select name="priority" required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <label>Asset/Device Involved</label>
          <input type="text" name="asset">

          <label>Location</label>
          <input type="text" name="location">

          <label>Problem / Request Description</label>
          <textarea name="description" rows="4" required></textarea>

          <div style="margin-top:18px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" id="cancelITForm">Cancel</button>
            <button type="submit" class="btn-accent">Submit</button>
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

  // Cancel Button
  document.getElementById("cancelITForm").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    // Generate unique ID (Primary Key)
    const id = "IT-" + Date.now();

    const data = {
      id,
      ...formData,
      status: "Pending",
      dateSubmitted: serverTimestamp()
    };

    try {
      // Save to Firestore with custom ID
      await setDoc(doc(collection(db, "it_service_orders"), id), data);

      alert("✅ IT Service Order Submitted!\nReference ID: " + id);
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
}

// Expose Globally
window.mountITServiceForm = mountITServiceForm;
