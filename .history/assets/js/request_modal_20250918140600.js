// assets/js/request_modal.js

function renderRequestModal() {
  return `
    <div id="requestModal" 
      style="position:fixed; top:0; left:0; width:100%; height:100%;
             background:rgba(0,0,0,0.5); display:flex; justify-content:center;
             align-items:center; z-index:10000;">
      
      <div style="background:#fff; padding:24px; border-radius:12px; width:500px;
                  max-width:95%; box-shadow:0 4px 12px rgba(0,0,0,0.2);
                  text-align:center; position:relative;">
        
        <span id="closeRequestModal" 
          style="position:absolute; top:10px; right:14px; font-size:22px; cursor:pointer; color:#888;">&times;</span>

        <h3 style="margin:10px 0 20px 0; font-size:20px; font-weight:600;">
          Choose Request Type
        </h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">

          <div class="req-card" data-type="Travel Order">
            <div class="emoji">🛄</div>
            <div class="title">Travel Order</div>
          </div>

          <div class="req-card" data-type="Driver Trip Ticket">
            <div class="emoji">🚗</div>
            <div class="title">Driver Trip Ticket</div>
          </div>

          <div class="req-card" data-type="IT Service Order" style="grid-column: span 2;">
            <div class="emoji">💻</div>
            <div class="title">IT Service Order</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachRequestModal() {
  const modal = document.getElementById("requestModal");

  // Close button
  modal.querySelector("#closeRequestModal").addEventListener("click", () => {
    modal.remove();
  });

  // Close when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Card clicks
  modal.querySelectorAll(".req-card").forEach(card => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;
      alert(`Selected: ${type}`);
      modal.remove();
    });
  });
}

function mountRequestModal() {
  closeAllModals?.(); // optional: if you have that helper
  document.body.insertAdjacentHTML("beforeend", renderRequestModal());
  attachRequestModal();
}

window.mountRequestModal = mountRequestModal;
