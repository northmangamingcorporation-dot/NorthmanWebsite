// assets/js/request_modal.js

function renderRequestModal() {
  return `
    <div id="requestModal" class="modal-overlay">
      <div class="modal-card">
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

function attachRequestModal(user) {
  const modal = document.getElementById("requestModal");

  // Close button
  document.getElementById("closeRequestModal").addEventListener("click", () => {
    modal.remove();
  });

  // Close when clicking outside card
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Attach click to all request cards
    modal.querySelectorAll(".req-card").forEach(card => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;

      switch(type) {
        case "Travel Order":
          if (typeof mountTravelOrderForm === "function") {
            mountTravelOrderForm(user);
            consol
          } else {
            console.error("mountTravelOrderForm() not found!");
          }
          break;

        case "Driver Trip Ticket":
          if (typeof mountDriversTripTicketForm === "function") {
            mountDriversTripTicketForm(user);
          } else {
            console.error("mountDriversTripTicketForm() not found!");
          }
          break;

        case "IT Service Order":
          console.log("IT Service Order clicked");
          if (typeof mountITServiceForm === "function") {
            mountITServiceForm(user);
          } else {
            console.error("mountITServiceForm() not found!");
          }
          break;

        default:
          console.warn("Unknown type:", type);
      }

      // Close request modal
      modal.remove();
    });
  });

}


function mountRequestModal() {
  closeAllModals?.(); // optional if you use this
  // Check if the user is already logged in
  const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  document.body.insertAdjacentHTML("beforeend", renderRequestModal(loggedInUser));
  attachRequestModal(loggedInUser);
}

window.mountRequestModal = mountRequestModal;

// --- styles ---
const rqStyle = document.createElement("style");
rqStyle.innerHTML = `
  .modal-overlay {
    position: fixed;
    top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.5);
    display:flex; justify-content:center; align-items:center;
    z-index: 9999;
  }
  .modal-card {
    background:#fff;
    padding:24px;
    border-radius:12px;
    width:100%;
    max-width:500px;
    box-shadow:0 4px 12px rgba(0,0,0,0.15);
    text-align:center;
    position:relative;
  }
  .req-card {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .req-card:hover {
    background: #f1f5f9;
    border-color: var(--accent, #4f46e5);
    transform: translateY(-2px);
  }
  .req-card .emoji {
    font-size: 28px;
    margin-bottom: 8px;
  }
  .req-card .title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }
`;
document.head.appendChild(rqStyle);
