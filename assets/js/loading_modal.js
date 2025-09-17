// assets/js/modal.js

// Create modal container
const modalContainer = document.createElement("div");
modalContainer.id = "globalModal";
modalContainer.style.position = "fixed";
modalContainer.style.top = "0";
modalContainer.style.left = "0";
modalContainer.style.width = "100%";
modalContainer.style.height = "100%";
modalContainer.style.backgroundColor = "rgba(0,0,0,0.5)";
modalContainer.style.display = "none";
modalContainer.style.justifyContent = "center";
modalContainer.style.alignItems = "center";
modalContainer.style.zIndex = "9999";

// Inner modal content
const modalContent = document.createElement("div");
modalContent.id = "globalModalContent";
modalContent.style.background = "#fff";
modalContent.style.padding = "20px";
modalContent.style.borderRadius = "8px";
modalContent.style.textAlign = "center";
modalContent.style.minWidth = "250px";
modalContent.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

modalContainer.appendChild(modalContent);
document.body.appendChild(modalContainer);

// Functions to control modal
window.Modal = {
  show: (message = "Loading...", isLoading = true) => {
    modalContent.innerHTML = isLoading 
      ? `<div class="spinner" style="margin-bottom:10px;">⏳</div>${message}`
      : message;
    modalContainer.style.display = "flex";
  },
  hide: () => {
    modalContainer.style.display = "none";
  },
  confirm: (message) => {
    return new Promise((resolve) => {
      modalContent.innerHTML = `
        <p style="margin-bottom:12px;">${message}</p>
        <button id="modalOkBtn" class="btn" style="margin-right:6px;">OK</button>
        <button id="modalCancelBtn" class="btn">Cancel</button>
      `;
      modalContainer.style.display = "flex";

      document.getElementById("modalOkBtn").onclick = () => {
        Modal.hide();
        resolve(true);
      };
      document.getElementById("modalCancelBtn").onclick = () => {
        Modal.hide();
        resolve(false);
      };
    });
  }
};
