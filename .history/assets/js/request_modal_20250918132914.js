// assets/js/request_modal.js

// Insert modal into DOM (only once)
(function initRequestModal() {
  if (document.getElementById("requestTypeModal")) return;

  const modal = document.createElement("div");
  modal.id = "requestTypeModal";
  modal.className = "hidden";
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.5);
    display:flex; align-items:center; justify-content:center; z-index:9999;
  `;

  modal.innerHTML = `
    <div class="modal-content" 
      style="background:#fff; padding:20px; border-radius:12px; max-width:400px; width:100%;">
      <h3 style="margin-bottom:16px;">Select Request Type</h3>
      <div class="grid" style="display:grid; gap:10px;">
        <button class="request-type-btn btn" data-type="Travel Order">Travel Order</button>
        <button class="request-type-btn btn" data-type="Driver Trip Ticket">Driver Trip Ticket</button>
        <button class="request-type-btn btn" data-type="IT Service Order">IT Service Order</button>
      </div>
      <div style="text-align:right; margin-top:16px;">
        <button id="closeRequestModalBtn" class="btn">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close button
  document.getElementById("closeRequestModalBtn").addEventListener("click", () => {
    RequestTypeModal.hide();
  });

  // Hook up request type buttons
  modal.querySelectorAll(".request-type-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!window.db || !window.currentUser) {
        alert("Database not ready or user not logged in.");
        return;
      }

      const reqType = btn.dataset.type;
      const details = prompt(`Enter details for ${reqType}:`);
      if (details) {
        await window.db.collection("requests").add({
          username: window.currentUser.username,
          type: reqType,
          details,
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      RequestTypeModal.hide();
    });
  });
})();

// Global control
window.RequestTypeModal = {
  show() {
    document.getElementById("requestTypeModal").classList.remove("hidden");
  },
  hide() {
    document.getElementById("requestTypeModal").classList.add("hidden");
  }
};
