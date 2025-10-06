// Enhanced assets/js/modal.js

// Utility to close all modals (if not already defined)
if (typeof closeAllModals === "undefined") {
  window.closeAllModals = function() {
    document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
  };
}

// Create enhanced global modal container
const modalContainer = document.createElement("div");
modalContainer.id = "globalModal";
modalContainer.className = "modal-overlay global-modal";
modalContainer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

// Inner modal content
const modalContent = document.createElement("div");
modalContent.id = "globalModalContent";
modalContent.className = "global-modal-content";
modalContent.style.cssText = `
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  min-width: 300px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  transform: translateY(20px);
  transition: transform 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// Close button for modal
const closeBtn = document.createElement("button");
closeBtn.id = "globalModalClose";
closeBtn.className = "close-btn";
closeBtn.innerHTML = '<i class="fas fa-times"></i>';
closeBtn.style.cssText = `
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(100, 116, 139, 0.1);
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
`;
closeBtn.setAttribute("aria-label", "Close modal");

closeBtn.addEventListener("mouseover", () => {
  closeBtn.style.background = "rgba(239, 68, 68, 0.1)";
  closeBtn.style.color = "#ef4444";
});
closeBtn.addEventListener("mouseout", () => {
  closeBtn.style.background = "rgba(100, 116, 139, 0.1)";
  closeBtn.style.color = "#64748b";
});

modalContent.appendChild(closeBtn);
modalContainer.appendChild(modalContent);
document.body.appendChild(modalContainer);

// Enhanced styles
const modalStyle = document.createElement("style");
modalStyle.setAttribute("data-global-modal-styles", "true");
modalStyle.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .global-modal.show {
    opacity: 1;
  }
  
  .global-modal-content.show {
    transform: translateY(0);
  }
  
  .spinner {
    border: 4px solid #e2e8f0;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 0 auto 16px;
    animation: spin 1s linear infinite;
  }
  
  .modal-message {
    font-size: 16px;
    line-height: 1.5;
    color: #374151;
    margin: 0 0 20px 0;
    font-weight: 500;
  }
  
  .modal-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 100px;
    justify-content: center;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }
  
  .btn-secondary {
    background: transparent;
    color: #6b7280;
    border: 2px solid #e2e8f0;
  }
  
  .btn-secondary:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-2px);
  }
  
  .btn-danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
  }
  
  .btn-danger:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
  }
  
  /* Message types */
  .modal-type-success .modal-icon { color: #10b981; }
  .modal-type-error .modal-icon { color: #ef4444; }
  .modal-type-warning .modal-icon { color: #f59e0b; }
  .modal-type-info .modal-icon { color: #3b82f6; }
  
  .modal-type-success .modal-message { color: #065f46; }
  .modal-type-error .modal-message { color: #991b1b; }
  .modal-type-warning .modal-message { color: #92400e; }
  .modal-type-info .modal-message { color: #1e40af; }
  
  /* Responsive */
  @media (max-width: 480px) {
    .global-modal-content {
      padding: 24px 20px;
      margin: 16px;
      min-width: auto;
    }
    
    .modal-buttons {
      flex-direction: column;
      width: 100%;
    }
    
    .btn {
      width: 100%;
    }
  }
  
  /* Accessibility */
  .global-modal:focus-within .close-btn {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* Custom scrollbar */
  .global-modal-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .global-modal-content::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .global-modal-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;
document.head.appendChild(modalStyle);

// Ensure Font Awesome is loaded
if (!document.querySelector('link[href*="fontawesome"]')) {
  const faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  faLink.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
  faLink.crossOrigin = "anonymous";
  faLink.referrerPolicy = "no-referrer";
  document.head.appendChild(faLink);
}

// Enhanced Modal API
window.Modal = {
  show: (message = "Loading...", type = "info", duration = 0, isLoading = false) => {
    // Close button functionality
    closeBtn.onclick = () => Modal.hide();

    // Keyboard support
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        Modal.hide();
        document.removeEventListener("keydown", handleKeydown);
      }
    };
    document.addEventListener("keydown", handleKeydown);

    // Determine icon and class based on type
    let icon = "";
    let typeClass = "modal-type-info";
    switch (type.toLowerCase()) {
      case "success":
        icon = '<i class="fas fa-check-circle"></i>';
        typeClass = "modal-type-success";
        break;
      case "error":
      case "danger":
        icon = '<i class="fas fa-exclamation-circle"></i>';
        typeClass = "modal-type-error";
        break;
      case "warning":
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        typeClass = "modal-type-warning";
        break;
      case "loading":
        isLoading = true;
        typeClass = "modal-type-info";
        break;
      default:
        icon = '<i class="fas fa-info-circle"></i>';
        typeClass = "modal-type-info";
    }

    if (isLoading) {
      modalContent.innerHTML = `
        <div class="spinner"></div>
        <p class="modal-message">${message}</p>
      `;
    } else {
      modalContent.innerHTML = `
        <div class="modal-icon">${icon}</div>
        <p class="modal-message">${message}</p>
        <div class="modal-buttons"></div>
      `;
      modalContent.classList.add(typeClass);
    }

    // Show modal with animation
    modalContainer.classList.add("show");
    modalContent.classList.add("show");
    modalContainer.style.display = "flex";

    // Auto-hide if duration specified
    if (duration > 0) {
      setTimeout(() => {
        Modal.hide();
      }, duration);
    }

    // Focus management
    closeBtn.focus();
  },

  hide: () => {
    modalContainer.classList.remove("show");
    modalContent.classList.remove("show", "modal-type-success", "modal-type-error", "modal-type-warning", "modal-type-info");
    modalContainer.style.display = "none";

    // Remove any lingering event listeners if needed
    document.querySelectorAll("#globalModalClose").forEach(btn => {
      btn.onclick = null;
    });
  },

  confirm: (message, options = {}) => {
    return new Promise((resolve) => {
      const { confirmText = "OK", cancelText = "Cancel", type = "info" } = options;

      // Close button
      closeBtn.onclick = () => {
        Modal.hide();
        resolve(false);
      };

      // Keyboard support
      const handleKeydown = (e) => {
        if (e.key === "Escape") {
          Modal.hide();
          resolve(false);
          document.removeEventListener("keydown", handleKeydown);
        } else if (e.key === "Enter") {
          // Default to confirm on Enter
          document.getElementById("modalConfirmBtn")?.click();
        }
      };
      document.addEventListener("keydown", handleKeydown);

      let icon = '<i class="fas fa-question-circle"></i>';
      let typeClass = "modal-type-info";
      if (type === "warning" || type === "danger") {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        typeClass = "modal-type-warning";
      }

      modalContent.innerHTML = `
        <div class="modal-icon">${icon}</div>
        <p class="modal-message">${message}</p>
        <div class="modal-buttons">
          <button id="modalCancelBtn" class="btn btn-secondary">${cancelText}</button>
          <button id="modalConfirmBtn" class="btn btn-primary">${confirmText}</button>
        </div>
      `;
      modalContent.classList.add(typeClass);

      modalContainer.classList.add("show");
      modalContent.classList.add("show");
      modalContainer.style.display = "flex";

      // Event listeners
      document.getElementById("modalConfirmBtn").onclick = () => {
        Modal.hide();
        resolve(true);
      };
      document.getElementById("modalCancelBtn").onclick = () => {
        Modal.hide();
        resolve(false);
      };

      // Focus first button
      setTimeout(() => {
        document.getElementById("modalConfirmBtn")?.focus();
      }, 100);
    });
  },

  alert: (message, type = "info", duration = 5000) => {
    Modal.show(message, type, duration);
  },

  // Legacy support for old API
  success: (message, duration = 3000) => Modal.show(message, "success", duration),
  error: (message, duration = 5000) => Modal.show(message, "error", duration),
  warning: (message, duration = 4000) => Modal.show(message, "warning", duration),
  loading: (message = "Loading...") => Modal.show(message, "loading", 0, true)
};

// Initialize close button globally
closeBtn.addEventListener("click", () => window.Modal.hide());

if (window._modalKeydownHandler) {
  document.removeEventListener("keydown", window._modalKeydownHandler);
  window._modalKeydownHandler = null;
}

