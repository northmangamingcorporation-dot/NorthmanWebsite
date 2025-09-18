// assets/js/request_modal.js

// Create modal container
const requestModalContainer = document.createElement("div");
requestModalContainer.id = "requestModal";
requestModalContainer.style.position = "fixed";
requestModalContainer.style.top = "0";
requestModalContainer.style.left = "0";
requestModalContainer.style.width = "100%";
requestModalContainer.style.height = "100%";
requestModalContainer.style.backgroundColor = "rgba(0,0,0,0.5)";
requestModalContainer.style.display = "none";
requestModalContainer.style.justifyContent = "center";
requestModalContainer.style.alignItems = "center";
requestModalContainer.style.zIndex = "10000";

// Inner content
const requestModalContent = document.createElement("div");
requestModalContent.style.background = "#fff";
requestModalContent.style.padding = "24px";
requestModalContent.style.borderRadius = "12px";
requestModalContent.style.width = "500px";
requestModalContent.style.maxWidth = "95%";
requestModalContent.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
requestModalContent.style.textAlign = "center";
requestModalContent.style.position = "relative";

requestModalContent.innerHTML = `
  <span id="closeRequestModal" 
    style="position:absolute; top:10px; right:14px; font-size:22px; cursor:pointer; color:#888;">&times;</span>

  <h3 style="margin:10px 0 20px 0; font-size:20px; font-weight:600;">Choose Request Type</h3>
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
`;

// Append to body
requestModalContainer.appendChild(requestModalContent);
document.body.appendChild(requestModalContainer);

// Styles for cards
const style = document.createElement("style");
style.innerHTML = `
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
document.head.appendChild(style);

// Functions
window.RequestModal = {
  show: () => {
    requestModalContainer.style.display = "flex";
  },
  hide: () => {
    requestModalContainer.style.display = "none";
  }
};

// Event listeners
document.getElementById("closeRequestModal").addEventListener("click", () => {
  RequestModal.hide();
});

// Close when clicking outside the modal content
requestModalContainer.addEventListener("click", (e) => {
  if (e.target === requestModalContainer) {
    RequestModal.hide();
  }
});

// Handle card selection
requestModalContent.querySelectorAll(".req-card").forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    alert(`Selected: ${type}`); // Later replace with opening actual form modal
    RequestModal.hide();
  });
});

