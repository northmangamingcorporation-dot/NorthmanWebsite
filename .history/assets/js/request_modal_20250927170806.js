// Fixed Request Modal - Resolves display issues

// Utility to close all modals (if not already defined)
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
}

function renderRequestModal(user = { username: "Employee" }) {
  return `
    <div id="requestModal" class="modal-overlay request-modal">
      <div class="modal-card request-card">
        
        <!-- Enhanced Close Button -->
        <button id="closeRequestModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
        
        <!-- Enhanced Title Section -->
        <div class="title-section">
          <h3>New Request</h3>
          <p>Select the type of request you want to create</p>
        </div>

        <!-- Enhanced Request Cards Grid -->
        <div class="request-grid">
          
          <!-- Travel Order Card -->
          <div class="req-card" data-type="Travel Order" tabindex="0" role="button">
            <div class="card-icon">
              <i class="fas fa-bus"></i>
            </div>
            <div class="card-title">Travel Order</div>
            <p>Request official travel authorization</p>
          </div>

          <!-- Driver Trip Ticket Card -->
          <div class="req-card" data-type="Driver Trip Ticket" tabindex="0" role="button">
            <div class="card-icon">
              <i class="fas fa-car"></i>
            </div>
            <div class="card-title">Driver Trip Ticket</div>
            <p>Log vehicle usage and trips</p>
          </div>

          <!-- IT Service Order Card (Full Width) -->
          <div class="req-card it-service-card" data-type="IT Service Order" tabindex="0" role="button">
            <div class="card-icon">
              <i class="fas fa-laptop-code"></i>
            </div>
            <div class="card-title">IT Service Order</div>
            <p>Request IT support and services</p>
          </div>
        </div>

        <!-- Enhanced Footer -->
        <div class="footer-section">
          <p>
            Need help? 
            <a href="#" class="support-link">Contact Support</a>
          </p>
        </div>
        
      </div>
    </div>
  `;
}

function attachRequestModal(user) {
  const modal = document.getElementById("requestModal");
  if (!modal) {
    console.error("Request modal not found in DOM");
    return;
  }

  const closeBtn = document.getElementById("closeRequestModal");
  const requestCards = modal.querySelectorAll(".req-card");

  console.log(`Request modal attached with ${requestCards.length} cards`);

  // Enhanced keyboard navigation
  const keydownHandler = (e) => {
    if (e.key === "Escape" && modal.parentNode) {
      closeModal();
    }
    if (e.key === "Enter" && modal.contains(document.activeElement)) {
      const activeCard = document.activeElement.closest(".req-card");
      if (activeCard) {
        e.preventDefault();
        activeCard.click();
      }
    }
  };

  document.addEventListener("keydown", keydownHandler);

  // Close button functionality
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  // Close when clicking outside card
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Enhanced card click handlers with loading and animations
  requestCards.forEach((card, index) => {
    console.log(`Setting up card ${index}: ${card.dataset.type}`);
    
    // Keyboard accessibility
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });

    card.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const type = card.dataset.type;
      console.log(`Request type selected: ${type}`);

      // Prevent multiple clicks
      if (card.classList.contains('processing')) {
        return;
      }

      // Add selection animation
      card.classList.add("selected", "processing");
      
      // Create loading indicator
      const loadingIndicator = document.createElement("div");
      loadingIndicator.className = "loading-spinner";
      card.appendChild(loadingIndicator);

      try {
        // Simulate brief loading for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Handle different request types
        let handled = false;
        
        switch (type) {
          case "Travel Order":
            if (typeof window.mountTravelOrderForm === "function") {
              await window.mountTravelOrderForm(user);
              handled = true;
            }
            break;

          case "Driver Trip Ticket":
            if (typeof window.mountDriversTripTicketForm === "function") {
              await window.mountDriversTripTicketForm(user);
              handled = true;
            }
            break;

          case "IT Service Order":
            if (typeof window.mountITServiceOrderForm === "function") {
              await window.mountITServiceOrderForm(user);
              handled = true;
            }
            break;
        }

        if (handled) {
          // Close modal after successful handling
          closeModal();
        } else {
          throw new Error(`Handler for ${type} not found or not implemented`);
        }

      } catch (error) {
        console.error(`Error handling ${type}:`, error);
        
        // Remove loading and selection state
        card.classList.remove("selected", "processing");
        if (loadingIndicator.parentNode) {
          loadingIndicator.remove();
        }
        
        // Show error message
        showMessage(`Feature for ${type} is coming soon!`, "info");
      }
    });
  });

  // Helper function to show messages
  function showMessage(message, type = "info") {
    if (window.Modal && window.Modal.show) {
      window.Modal.show(message, type);
    } else if (window.ngcEvents && window.ngcEvents.emit) {
      window.ngcEvents.emit('notification', { message, type });
    } else {
      alert(message);
    }
  }

  // Helper function to close modal
  function closeModal() {
    // Remove event listener to prevent memory leaks
    document.removeEventListener("keydown", keydownHandler);
    
    modal.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300);
  }
}

function mountRequestModal() {
  try {
    console.log("Mounting request modal...");
    
    // Close any existing modals
    closeAllModals();

    // Check if user is logged in - fix the key issue
    const loggedInUserStr = sessionStorage.getItem("loggedInUser") || 
                           localStorage.getItem("loggedInUser") ||
                           sessionStorage.getItem("loggedInUser ") || // Legacy with space
                           localStorage.getItem("loggedInUser ");    // Legacy with space
    
    if (!loggedInUserStr) {
      console.warn("No user session found. Redirecting to login.");
      if (window.mountLogin) {
        window.mountLogin();
      } else {
        showMessage("Please log in to access this feature.", "warning");
      }
      return false;
    }

    let user;
    try {
      user = JSON.parse(loggedInUserStr);
    } catch (parseError) {
      console.error("Error parsing user data:", parseError);
      if (window.mountLogin) {
        window.mountLogin();
      }
      return false;
    }

    if (!user || !user.username) {
      console.error("Invalid user session data:", user);
      if (window.mountLogin) {
        window.mountLogin();
      }
      return false;
    }

    console.log("User found:", user.username);

    // Remove existing request modal if present
    const existingModal = document.getElementById("requestModal");
    if (existingModal) {
      existingModal.remove();
    }

    // Inject the modal HTML
    const modalHTML = renderRequestModal(user);
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    
    // Verify the modal was added
    const newModal = document.getElementById("requestModal");
    if (!newModal) {
      console.error("Failed to create request modal");
      showMessage("Unable to load request form. Please try again.", "error");
      return false;
    }

    console.log("Modal HTML injected successfully");

    // Attach event handlers
    attachRequestModal(user);

    console.log("Request modal mounted successfully");
    return true;

  } catch (error) {
    console.error("Error mounting request modal:", error);
    showMessage("Unable to load request form. Please refresh and try again.", "error");
    return false;
  }

  // Helper function for consistent messaging
  function showMessage(message, type = "info") {
    if (window.Modal && window.Modal.show) {
      window.Modal.show(message, type);
    } else if (window.ngcEvents && window.ngcEvents.emit) {
      window.ngcEvents.emit('notification', { message, type });
    } else {
      alert(message);
    }
  }
}

// Expose globally
window.mountRequestModal = mountRequestModal;
window.renderRequestModal = renderRequestModal;
window.attachRequestModal = attachRequestModal;

// Enhanced Styles - Moved to separate style injection
function injectRequestModalStyles() {
  // Remove existing styles
  const existingStyle = document.querySelector('style[data-request-styles]');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement("style");
  style.setAttribute('data-request-styles', 'true');
  style.textContent = `
    /* Request Modal Styles */
    .modal-overlay.request-modal {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(15, 23, 42, 0.8) !important;
      backdrop-filter: blur(10px) !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      z-index: 1000 !important;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transform: translateY(20px);
      animation: slideIn 0.4s ease forwards;
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border: none;
      background: rgba(100, 116, 139, 0.1);
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      color: #64748b;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .title-section {
      margin-bottom: 32px;
      animation: logoFloat 0.6s ease forwards;
    }

    .title-section h3 {
      margin: 0 0 8px 0;
      color: #0f172a;
      font-weight: 700;
      font-size: 28px;
      background: linear-gradient(135deg, #0f172a, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .title-section p {
      margin: 0;
      color: #64748b;
      font-size: 16px;
      font-weight: 500;
    }

    .request-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
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

    .req-card:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .req-card.it-service-card {
      grid-column: span 2;
    }
    
    .req-card .card-icon {
      font-size: 40px;
      margin-bottom: 16px;
      color: #94a3b8;
      transition: color 0.3s ease;
    }

    .req-card:hover .card-icon {
      color: #3b82f6;
    }
    
    .req-card .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
      transition: color 0.3s ease;
    }

    .req-card:hover .card-title {
      color: #1d4ed8;
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

    .req-card.processing {
      pointer-events: none;
    }
    
    /* Loading spinner */
    .loading-spinner {
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

    .footer-section {
      text-align: center;
      font-size: 14px;
      color: #64748b;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-section p {
      margin: 0;
    }

    .support-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .support-link:hover {
      color: #1d4ed8;
    }
    
    /* Animations */
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

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
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
      
      .req-card.it-service-card {
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
  `;
  
  document.head.appendChild(style);
}

// Auto-inject styles and ensure Font Awesome
document.addEventListener('DOMContentLoaded', () => {
  injectRequestModalStyles();
  
  // Ensure Font Awesome is loaded
  if (!document.querySelector('link[href*="fontawesome"]')) {
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    faLink.crossOrigin = "anonymous";
    document.head.appendChild(faLink);
  }
});

// Also inject styles immediately if DOM is already ready
if (document.readyState !== 'loading') {
  injectRequestModalStyles();
}

console.log("Request modal system loaded successfully");