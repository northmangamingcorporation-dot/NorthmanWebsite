// Enhanced assets/js/request_modal.js

// Utility to close all modals (if not already defined)
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
}

function renderRequestModal(user = { username: "Employee" }) {
  return `
    <div id="requestModal" class="modal-overlay request-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    ">
      
      <div class="modal-card request-card" style="
        background: linear-gradient(145deg, #ffffff, #f0fdfa);
        width: 100%;
        max-width: 520px;
        padding: 40px 32px;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        
        <!-- Enhanced Close Button -->
        <button id="closeRequestModal" style="
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(100, 116, 139, 0.1);
          border-radius: 50%;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          color: #64748b;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        " onmouseover="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.color='#ef4444';"
           onmouseout="this.style.background='rgba(100, 116, 139, 0.1)'; this.style.color='#64748b';">
          <i class="fas fa-times"></i>
        </button>
        
        <!-- Enhanced Title Section -->
        <div class="title-section" style="
          margin-bottom: 32px;
          animation: logoFloat 0.6s ease forwards;
        ">
          <h3 style="
            margin: 0 0 8px 0;
            color: #0f172a;
            font-weight: 700;
            font-size: 28px;
            background: linear-gradient(135deg, #0f172a, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            New Request
          </h3>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Select the type of request you want to create
          </p>
        </div>

        <!-- Enhanced Request Cards Grid -->
        <div class="request-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        ">
          
          <!-- Travel Order Card -->
          <div class="req-card" data-type="Travel Order" style="
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 28px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          " onmouseover="
            this.style.borderColor = '#3b82f6';
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.1)';
            this.querySelector('.card-icon').style.color = '#3b82f6';
            this.querySelector('.card-title').style.color = '#1d4ed8';
          " onmouseout="
            this.style.borderColor = '#e2e8f0';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            this.querySelector('.card-icon').style.color = '#94a3b8';
            this.querySelector('.card-title').style.color = '#0f172a';
          ">
            <div class="card-icon" style="
              font-size: 40px;
              margin-bottom: 16px;
              color: #94a3b8;
              transition: color 0.3s ease;
            ">
              <i class="fas fa-plane"></i>
            </div>
            <div class="card-title" style="
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 8px;
              transition: color 0.3s ease;
            ">
              Travel Order
            </div>
            <p style="
              margin: 0;
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
            ">
              Request official travel authorization
            </p>
          </div>

          <!-- Driver Trip Ticket Card -->
          <div class="req-card" data-type="Driver Trip Ticket" style="
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 28px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          " onmouseover="
            this.style.borderColor = '#3b82f6';
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.1)';
            this.querySelector('.card-icon').style.color = '#3b82f6';
            this.querySelector('.card-title').style.color = '#1d4ed8';
          " onmouseout="
            this.style.borderColor = '#e2e8f0';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            this.querySelector('.card-icon').style.color = '#94a3b8';
            this.querySelector('.card-title').style.color = '#0f172a';
          ">
            <div class="card-icon" style="
              font-size: 40px;
              margin-bottom: 16px;
              color: #94a3b8;
              transition: color 0.3s ease;
            ">
              <i class="fas fa-car"></i>
            </div>
            <div class="card-title" style="
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 8px;
              transition: color 0.3s ease;
            ">
              Driver Trip Ticket
            </div>
            <p style="
              margin: 0;
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
            ">
              Log vehicle usage and trips
            </p>
          </div>

          <!-- IT Service Order Card (Full Width) -->
          <div class="req-card" data-type="IT Service Order" style="
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 28px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            grid-column: span 2;
          " onmouseover="
            this.style.borderColor = '#3b82f6';
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.1)';
            this.querySelector('.card-icon').style.color = '#3b82f6';
            this.querySelector('.card-title').style.color = '#1d4ed8';
          " onmouseout="
            this.style.borderColor = '#e2e8f0';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            this.querySelector('.card-icon').style.color = '#94a3b8';
            this.querySelector('.card-title').style.color = '#0f172a';
          ">
            <div class="card-icon" style="
              font-size: 40px;
              margin-bottom: 16px;
              color: #94a3b8;
              transition: color 0.3s ease;
            ">
              <i class="fas fa-laptop-code"></i>
            </div>
            <div class="card-title" style="
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 8px;
              transition: color 0.3s ease;
            ">
              IT Service Order
            </div>
            <p style="
              margin: 0;
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
            ">
              Request IT support and services
            </p>
          </div>
        </div>

        <!-- Enhanced Footer -->
        <div class="footer-section" style="
          text-align: center;
          font-size: 14px;
          color: #64748b;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        ">
          <p style="margin: 0;">
            Need help? 
            <a href="#" style="
              color: #3b82f6;
              text-decoration: none;
              font-weight: 500;
              transition: color 0.3s ease;
            " onmouseover="this.style.color='#1d4ed8';"
               onmouseout="this.style.color='#3b82f6';">
              Contact Support
            </a>
          </p>
        </div>
        
      </div>
    </div>

    <style>
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
      
      @keyframes logoFloat {
        from { 
          opacity: 0;
          transform: translateY(-10px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Responsive Design */
      @media (max-width: 480px) {
        .modal-card.request-card {
          margin: 20px;
          padding: 32px 24px;
          max-width: none;
        }
        
        .request-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .req-card[data-type="IT Service Order"] {
          grid-column: span 1;
        }
        
        .title-section h3 {
          font-size: 24px;
        }
      }
      
      /* Enhanced focus states for accessibility */
      .modal-card *:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      /* Selection animation */
      .req-card.selected {
        border-color: #10b981;
        background: linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(34, 197, 94, 0.05));
        transform: scale(1.05);
      }
    </style>
  `;
}

function attachRequestModal(user) {
  const modal = document.getElementById("requestModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeRequestModal");
  const requestCards = modal.querySelectorAll(".req-card");

  // Enhanced keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display !== "none") {
      closeModal();
    }
    if (e.key === "Enter" && modal.contains(document.activeElement)) {
      const activeCard = document.activeElement.closest(".req-card");
      if (activeCard) {
        activeCard.click();
      }
    }
  });

  // Close button functionality
  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  // Close when clicking outside card
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Enhanced card click handlers with loading and animations
  requestCards.forEach(card => {
    // Keyboard accessibility
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });

    card.addEventListener("click", async () => {
      const type = card.dataset.type;
      console.log(`Request type selected: ${type}`);

      // Add selection animation
      card.classList.add("selected");
      card.style.pointerEvents = "none"; // Prevent multiple clicks

      try {
        // Show loading state briefly
        const loadingIndicator = document.createElement("div");
        loadingIndicator.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          z-index: 10;
        `;
        card.appendChild(loadingIndicator);

        // Handle different request types
        switch (type) {
          case "Travel Order":
            if (typeof mountTravelOrderForm === "function") {
              await mountTravelOrderForm(user);
            } else {
              throw new Error("Travel Order form not implemented");
            }
            break;

          case "Driver Trip Ticket":
            if (typeof mountDriversTripTicketForm === "function") {
              await mountDriversTripTicketForm(user);
            } else {
              throw new Error("Driver Trip Ticket form not implemented");
            }
            break;

          case "IT Service Order":
            if (typeof mountITServiceForm === "function") {
              await mountITServiceForm(user);
            } else {
              throw new Error("IT Service Order form not implemented");
            }
            break;

          default:
            throw new Error(`Unknown request type: ${type}`);
        }

        // Close modal after successful handling
        closeModal();

      } catch (error) {
        console.error(`Error handling ${type}:`, error);
        
        // Remove loading and selection state
        card.classList.remove("selected");
        card.style.pointerEvents = "auto";
        if (loadingIndicator) loadingIndicator.remove();
        
        // Show error message
        if (window.Modal && window.Modal.show) {
          window.Modal.show(`Feature for ${type} is coming soon!`, "info");
        } else {
          alert(`Feature for ${type} is coming soon!`);
        }
      }
    });
  });

  // Helper functions
  function closeModal() {
    modal.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

function mountRequestModal() {
  try {
    // Close any existing modals
    closeAllModals();

    // Check if user is logged in
    const loggedInUserStr = sessionStorage.getItem("loggedInUser ") || localStorage.getItem("loggedInUser ");
    if (!loggedInUserStr) {
      console.warn("No user session found. Redirecting to login.");
      if (window.mountLogin) {
        window.mountLogin();
      }
      return;
    }

    const user = JSON.parse(loggedInUserStr);
    if (!user || !user.username) {
      console.error("Invalid user session.");
      if (window.mountLogin) {
        window.mountLogin();
      }
      return;
    }

    // Remove existing request modal if present
    const existingModal = document.getElementById("requestModal");
    if (existingModal) {
      existingModal.remove();
    }

    document.body.insertAdjacentHTML("beforeend", renderRequestModal(user));
    attachRequestModal(user);

    // Add fadeOut animation style if not present
    if (!document.querySelector('style[data-request-fadeout]')) {
      const style = document.createElement("style");
      style.setAttribute('data-request-fadeout', 'true');
      style.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

  } catch (error) {
        console.error("Error mounting request modal:", error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Unable to load request form. Please try again.", "error");
    } else {
      alert("Unable to load request form. Please refresh the page and try again.");
    }
  }
}

// Expose globally
window.mountRequestModal = mountRequestModal;

// --- Enhanced Styles ---
const rqStyle = document.createElement("style");
rqStyle.setAttribute('data-request-styles', 'true');
rqStyle.innerHTML = `
  /* Base modal overlay styles (if not overridden by inline) */
  .modal-overlay.request-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-card.request-card {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    width: 100%;
    max-width: 520px;
    padding: 40px 32px;
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    text-align: center;
    position: relative;
    border: 1px solid rgba(226, 232, 240, 0.8);
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .req-card {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .req-card:hover {
    border-color: #3b82f6;
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1);
  }
  
  .req-card .card-icon {
    font-size: 40px;
    margin-bottom: 16px;
    color: #94a3b8;
    transition: color 0.3s ease;
  }
  
  .req-card .card-icon i {
    font-size: 40px;
  }
  
  .req-card .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 8px;
    transition: color 0.3s ease;
  }
  
  .req-card p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  }
  
  /* Selection state */
  .req-card.selected {
    border-color: #10b981;
    background: linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(34, 197, 94, 0.05));
    transform: scale(1.05);
  }
  
  /* Loading spinner */
  .req-card .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: 10;
  }
  
  /* Animations */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  /* Responsive enhancements */
  @media (max-width: 480px) {
    .modal-card.request-card {
      margin: 20px;
      padding: 32px 24px;
      max-width: none;
    }
    
    .request-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .req-card[data-type="IT Service Order"] {
      grid-column: span 1;
    }
    
    .title-section h3 {
      font-size: 24px;
    }
    
    .req-card {
      padding: 24px 16px;
    }
    
    .req-card .card-icon {
      font-size: 32px;
    }
    
    .req-card .card-title {
      font-size: 16px;
    }
  }
  
  /* Accessibility improvements */
  .req-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* Custom scrollbar for modal */
  .modal-card::-webkit-scrollbar {
    width: 6px;
  }
  
  .modal-card::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .modal-card::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  /* Ensure Font Awesome icons are styled properly */
  .fas {
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
  }
`;
document.head.appendChild(rqStyle);

// Ensure Font Awesome is loaded if not already present
if (!document.querySelector('link[href*="fontawesome"]')) {
  const faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  faLink.integrity = "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
  faLink.crossOrigin = "anonymous";
  faLink.referrerPolicy = "no-referrer";
  document.head.appendChild(faLink);
}