// Enhanced pages/forgetpassword.js

function renderForgetPassword() {
  return `
    <div id="forgetPasswordModal" class="modal-overlay forget-modal" style="
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
      
      <div class="modal-content forget-content" style="
        background: linear-gradient(145deg, #ffffff, #f8fafc);
        width: 100%;
        max-width: 420px;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        text-align: center;
        position: relative;
        border: 1px solid rgba(226, 232, 240, 0.8);
        transform: translateY(20px);
        animation: slideIn 0.3s ease forwards;
      ">
        
        <!-- Enhanced Close Button -->
        <button id="closeForgetModal" style="
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
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
        
        <!-- Enhanced Logo Section -->
        <div class="logo-section" style="
          text-align: center;
          margin-bottom: 32px;
          animation: logoFloat 0.6s ease forwards;
        ">
          <div class="logo-container" style="
            width: 90px;
            height: 90px;
            margin: 0 auto 16px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
            position: relative;
            overflow: hidden;
          ">
            <img src="assets/images/main_logo.jpg" alt="Logo" style="
              width: 70px;
              height: 70px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid white;
            " />
            <div style="
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
              animation: shimmer 2s infinite;
            "></div>
          </div>
        </div>

        <!-- Enhanced Title -->
        <div class="title-section" style="margin-bottom: 32px;">
          <h2 style="
            margin: 0 0 8px 0;
            color: #0f172a;
            font-weight: 700;
            font-size: 28px;
            background: linear-gradient(135deg, #0f172a, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            Forgot Password
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Enter your username to reset your password
          </p>
        </div>
        
        <!-- Enhanced Form Container -->
        <div class="form-container" style="margin-bottom: 24px;">
          <!-- Enhanced Username Field -->
          <div class="input-group" style="
            margin-bottom: 20px;
            position: relative;
          ">
            <div class="input-wrapper" style="
              position: relative;
              transition: all 0.3s ease;
            ">
              <i class="fas fa-user input-icon" style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 16px;
                z-index: 2;
                transition: color 0.3s ease;
              "></i>
              <input id="usernameReset" type="text" placeholder="Enter your username" style="
                width: 100%;
                padding: 16px 16px 16px 48px;
                border-radius: 12px;
                border: 2px solid #e2e8f0;
                font-size: 16px;
                background: white;
                transition: all 0.3s ease;
                outline: none;
                box-sizing: border-box;
              " onfocus="
                this.style.borderColor = '#3b82f6';
                this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                this.previousElementSibling.style.color = '#3b82f6';
              " onblur="
                this.style.borderColor = '#e2e8f0';
                this.style.boxShadow = 'none';
                this.previousElementSibling.style.color = '#94a3b8';
              " />
            </div>
            <div class="field-error" id="usernameResetError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>
        </div>
        
        <!-- Enhanced Reset Button -->
        <button class="btn reset-btn" id="resetBtn" style="
          width: 100%;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        " onmouseover="
          this.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.4)';
        " onmouseout="
          this.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';
        ">
          <span class="btn-text">Reset Password</span>
          <div class="btn-loader" style="
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: none;
          "></div>
        </button>

        <!-- Enhanced Success/Error Message -->
        <div class="message-container" style="margin-bottom: 24px;">
          <div id="resetMsg" class="success-msg" style="
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            display: none;
            border-left: 4px solid #10b981;
            align-items: center;
          ">
            <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
            <span>Reset link sent! Check your username account.</span>
          </div>
          <div id="resetError" class="error-msg" style="
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            display: none;
            border-left: 4px solid #ef4444;
            align-items: center;
          ">
            <i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>
            <span>Username not found.</span>
          </div>
        </div>

        <!-- Enhanced Back Link -->
        <div class="links-section" style="
          text-align: center;
          font-size: 15px;
          color: #64748b;
        ">
          <a href="#" id="backToLogin2" style="
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
            display: inline-block;
            padding: 8px 16px;
            border-radius: 8px;
            background: rgba(59, 130, 246, 0.05);
          " onmouseover="
            this.style.color = '#1d4ed8';
            this.style.background = 'rgba(59, 130, 246, 0.1)';
          " onmouseout="
            this.style.color = '#3b82f6';
            this.style.background = 'rgba(59, 130, 246, 0.05)';
          ">
            <i class="fas fa-arrow-left" style="margin-right: 6px;"></i>
            Back to Login
          </a>
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
      
      @keyframes shimmer {
        0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
        100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      .error-shake {
        animation: shake 0.5s ease-in-out;
      }
      
      /* Enhanced responsive design */
      @media (max-width: 480px) {
        .modal-content.forget-content {
          margin: 20px;
          padding: 32px 24px;
          max-width: none;
        }
        
        .title-section h2 {
          font-size: 24px;
        }
        
        .input-wrapper input {
          font-size: 16px; /* Prevent zoom on iOS */
        }
      }
      
      /* Enhanced focus states for accessibility */
      .modal-content *:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      /* Custom scrollbar for modal content */
      .modal-content::-webkit-scrollbar {
        width: 6px;
      }
      
      .modal-content::-webkit-scrollbar-track {
        background: #f1f5f9;
      }
      
      .modal-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }

      .success-msg, .error-msg {
        display: flex;
      }
    </style>
  `;
}

function attachForgetPassword(prefill = "") {
  const modal = document.getElementById("forgetPasswordModal");
  const usernameInput = document.getElementById("usernameReset");
  const resetBtn = document.getElementById("resetBtn");
  const resetMsg = document.getElementById("resetMsg");
  const resetError = document.getElementById("resetError");
  const closeBtn = document.getElementById("closeForgetModal");
  const backToLogin = document.getElementById("backToLogin2");

  // Pre-fill username if provided
  if (prefill) {
    usernameInput.value = prefill;
    animateField(usernameInput);
  }

  // Enhanced keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && modal.style.display !== "none") {
      e.preventDefault();
      resetBtn.click();
    }
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Reset password functionality
  resetBtn.addEventListener("click", async () => {
    await handleResetPassword();
  });

  async function handleResetPassword() {
    const username = usernameInput.value.trim();
    
    // Clear previous messages and errors
    clearFieldErrors();
    hideMessages();

    // Validation
    if (!username) {
      showFieldError("usernameReset", "Username is required");
      return;
    }

    try {
      // Loading state
      setLoadingState(true);
      
      const clientsCol = window.db.collection("clients");
      const snapshot = await clientsCol.where("username", "==", username).get();

      setLoadingState(false);

      if (!snapshot.empty) {
        // Success state
        showSuccessMessage();
        // Optionally, clear the input after success
        usernameInput.value = "";
      } else {
        // Error state
        showResetError("Username not found. Please check and try again.");
        shakeModal();
      }
    } catch (err) {
      setLoadingState(false);
      console.error(err);
      showResetError("Error connecting to server. Please try again.");
    }
  }

  // Enhanced navigation
  backToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    closeModalWithAnimation(() => {
      if (window.mountLogin) window.mountLogin();
    });
  });

  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Helper functions
  function setLoadingState(isLoading) {
    const btnText = resetBtn.querySelector(".btn-text");
    const btnLoader = resetBtn.querySelector(".btn-loader");
    
    if (isLoading) {
      resetBtn.disabled = true;
      resetBtn.style.background = "linear-gradient(135deg, #94a3b8, #64748b)";
      btnText.textContent = "Checking...";
      btnLoader.style.display = "block";
    } else {
      resetBtn.disabled = false;
      resetBtn.style.background = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
      btnText.textContent = "Reset Password";
      btnLoader.style.display = "none";
    }
  }

  function showSuccessMessage() {
    const btnText = resetBtn.querySelector(".btn-text");
    const btnLoader = resetBtn.querySelector(".btn-loader");
    
    resetBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    btnText.textContent = "Sent!";
    btnLoader.style.display = "none";
    
    // Update success message
    const successSpan = resetMsg.querySelector("span");
    successSpan.textContent = "Reset link sent! Check your username account.";
    resetMsg.style.display = "flex";
    
    // Auto-hide success after 5 seconds
    setTimeout(() => {
      hideMessages();
      setLoadingState(false);
    }, 5000);
  }

  function showResetError(message) {
    const errorSpan = resetError.querySelector("span");
    errorSpan.textContent = message;
    resetError.style.display = "flex";
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideMessages();
    }, 5000);
  }

  function hideMessages() {
    resetMsg.style.display = "none";
    resetError.style.display = "none";
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`${fieldId}Error`);
    
    field.style.borderColor = "#ef4444";
    field.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)";
    
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
    }
    
    // Animate the field
    field.classList.add("error-shake");
    setTimeout(() => {
      field.classList.remove("error-shake");
    }, 500);
  }

  function clearFieldErrors() {
    const fieldIds = ["usernameReset"];
    fieldIds.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      const errorDiv = document.getElementById(`${fieldId}Error`);
      
      if (field) {
        field.style.borderColor = "#e2e8f0";
        field.style.boxShadow = "none";
      }
      
      if (errorDiv) {
        errorDiv.style.display = "none";
      }
    });
   }
  function shakeModal() {
    const modalContent = document.querySelector(".modal-content.forget-content");
    modalContent.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      modalContent.style.animation = "slideIn 0.3s ease forwards";
    }, 500);
  }
  function animateField(field) {
    field.style.transform = "scale(1.02)";
    field.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.2)";
    setTimeout(() => {
      field.style.transform = "scale(1)";
      field.style.boxShadow = "none";
    }, 300);
  }
  function closeModal() {
    modal.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
  function closeModalWithAnimation(callback) {
    modal.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modal.remove();
      if (callback) callback();
    }, 300);
  }
}
// Enhanced mount function with better error handling
function mountForgetPassword(prefill = "") {
