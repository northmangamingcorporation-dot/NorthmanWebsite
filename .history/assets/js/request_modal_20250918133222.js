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
requestModalContent.style.width = "420px";
requestModalContent.style.maxWidth = "90%";
requestModalContent.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
requestModalContent.style.textAlign = "center";

requestModalContent.innerHTML = `
  <h3 style="margin-bottom:16px;">Choose Request Type</h3>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
    <button class="req-btn" data-type="Travel Order">🛄 Travel Order</button>
    <button class="req-btn" data-type="Driver Trip Ticket">🚗 Driver Trip Ticket</button>
    <button class="req-btn" data-type="IT Service Order" style="grid-column: span 2;">💻 IT Service Order</button>
  </div>
  <button id="closeRequestModal" style="margin-top:16px;">Close</button>
`;

requestModalContainer.appendChild(requestModalContent);
document.body.appendChild(requestModalContainer);

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

requestModalContent.querySelectorAll(".req-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    alert(`Selected: ${type}`); // replace this with opening the actual form
    RequestModal.hide();
  });
});
