New

Share




New Chat
474 lines

// Utility to close all modals
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
}
// Enhanced pages/signin.js
function renderSignInModal() {
  return `
    <div id="signInModal" class="modal-overlay signin-modal" style="
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
      
      <div class="modal-content signin-content" style="
        background: linear-gradient(145deg, #ffffff, #f8fafc);
        width: 100%;
        max-width: 500px;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        text-align: center;
        position: relative;
        border: 1px solid rgba(226, 232, 240, 0.8);
        transform: translateY(20px);
        animation: slideIn 0.3s ease forwards;
        max-height: 90vh;
        overflow-y: auto;
      ">
        
        <!-- Enhanced Close Button -->
