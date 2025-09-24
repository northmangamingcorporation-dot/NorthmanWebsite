// Enhanced pages\login.js

function renderLoginModal() {
  return `
    <div id="loginModal" class="modal-overlay login-modal" style="
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
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    ">
      
      <div class="modal-content login-content" style="
        background: linear-gradient(145deg, #ffffff, #f0fdfa);
        width: 100%;
        max-width: 420px;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        text-align: center;
        position: relative;
        border: 1px solid rgba(226, 232, 240, 0.8);
        transform: translateY(20px);
        
        <!-- Enhanced Close Button -->
        <button id="closeLoginModal" style="
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
            Welcome Back
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Sign in to your Northman account
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
              <input id="username" type="text" placeholder="Username" style="
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
            <div class="field-error" id="usernameError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Enhanced Password Field -->
          <div class="input-group" style="
            margin-bottom: 20px;
            position: relative;
          ">
            <div class="input-wrapper" style="
              position: relative;
              transition: all 0.3s ease;
            ">
              <i class="fas fa-lock input-icon" style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 16px;
                z-index: 2;
                transition: color 0.3s ease;
              "></i>
              <input id="password" type="password" placeholder="Password" style="
                width: 100%;
                padding: 16px 48px 16px 48px;
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
              <button type="button" id="togglePassword" style="
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                border: none;
                background: transparent;
                cursor: pointer;
                color: #94a3b8;
                font-size: 16px;
                transition: color 0.3s ease;
                z-index: 2;
              " onmouseover="this.style.color='#3b82f6';"
                 onmouseout="this.style.color='#94a3b8';">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div class="field-error" id="passwordError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            font-size: 14px;
          ">
            <label class="checkbox-container" style="
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              color: #64748b;
              font-weight: 500;
            ">
              <input type="checkbox" id="rememberMe" style="
                width: 16px;
                height: 16px;
                accent-color: #3b82f6;
                cursor: pointer;
              ">
              <span>Remember me</span>
            </label>
            <a href="#" id="forgotLink" style="
              color: #3b82f6;
              text-decoration: none;
              font-weight: 600;
              transition: color 0.3s ease;
            " onmouseover="this.style.color='#1d4ed8';"
               onmouseout="this.style.color='#3b82f6';">
              Forgot Password?
            </a>
          </div>
        </div>
        
        <!-- Enhanced Login Button -->
        <button class="btn login-btn" id="loginBtn" style="
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
          <span class="btn-text">Sign In</span>
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

        <!-- Enhanced Error Message -->
        <div class="error-container" style="margin-bottom: 24px;">
          <div id="errorMsg" style="
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            display: none;
            border-left: 4px solid #ef4444;
          ">
            <i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>
            <span>Invalid credentials</span>
          </div>
        </div>

        <!-- Enhanced Links Section -->
        <div class="links-section" style="
          text-align: center;
          font-size: 15px;
          color: #64748b;
        ">
          <p style="margin: 0 0 16px 0;">
            Don't have an account?
            <a href="#" id="signupLink" style="
              color: #3b82f6;
              text-decoration: none;
              font-weight: 600;
              margin-left: 4px;
              transition: color 0.3s ease;
            " onmouseover="this.style.color='#1d4ed8';"
               onmouseout="this.style.color='#3b82f6';">
              Create Account
            </a>
          </p>
          
          <div class="divider" style="
            display: flex;
            align-items: center;
            margin: 20px 0;
            color: #94a3b8;
            font-size: 14px;
          ">
            <div style="flex: 1; height: 1px; background: #e2e8f0;"></div>
            <span style="padding: 0 16px;">or</span>
            <div style="flex: 1; height: 1px; background: #e2e8f0;"></div>
          </div>
          
          <p style="margin: 0; font-size: 14px;">
            Need help? 
            <a href="#" style="
              color: #3b82f6;
              text-decoration: none;
              font-weight: 500;
            ">Contact Support</a>
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
        .modal-content.login-content {
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
    </style>
  `;
}

function attachLogin(preFillUsername = "", preFillPassword = "") {
  const loginBtn = document.getElementById("loginBtn");
  const signupLink = document.getElementById("signupLink");
  const forgotLink = document.getElementById("forgotLink");
  const closeBtn = document.getElementById("closeLoginModal");
  const modalOverlay = document.getElementById("loginModal");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");
  const rememberMeCheckbox = document.getElementById("rememberMe");

  // Enhanced pre-fill functionality
  const usernameField = document.getElementById("username");
  const passwordFieldInput = document.getElementById("password");
  
  if (preFillUsername) {
    usernameField.value = preFillUsername;
    animateField(usernameField);
  }
  if (preFillPassword) {
    passwordFieldInput.value = preFillPassword;
    animateField(passwordFieldInput);
  }

  // Load remember me preference
  const rememberedUsername = localStorage.getItem("rememberedUsername");
  if (rememberedUsername && !preFillUsername) {
    usernameField.value = rememberedUsername;
    rememberMeCheckbox.checked = true;
  }

  // Enhanced password toggle functionality
  togglePasswordBtn.addEventListener("click", () => {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    
    const icon = togglePasswordBtn.querySelector("i");
    icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
    
    // Add a subtle animation
    togglePasswordBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      togglePasswordBtn.style.transform = "scale(1)";
    }, 150);
  });

  // Enhanced keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && modalOverlay.style.display !== "none") {
      e.preventDefault();
      loginBtn.click();
    }
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Check if user is already logged in with better UX
  const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    try {
      const user = JSON.parse(loggedInUser);
      console.log("Auto-login for user:", user);
      
      // Show a brief welcome message before redirecting
      showWelcomeMessage(user);
      
      setTimeout(() => {
        modalOverlay.remove();
        redirectToUserDashboard(user);
      }, 1000);
      
      return;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      // Clear corrupted data
      sessionStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUser");
    }
  }

  // Enhanced login functionality
  loginBtn.addEventListener("click", async () => {
    await handleLogin();
  });

  async function handleLogin() {
    const username = usernameField.value.trim();
    const password = passwordFieldInput.value.trim();
    const errorMsg = document.getElementById("errorMsg");
    
    // Clear previous errors
    clearFieldErrors();
    hideError();

    // Enhanced validation with specific field highlighting
    if (!username) {
      showFieldError("username", "Username is required");
      return;
    }
    
    if (!password) {
      showFieldError("password", "Password is required");
      return;
    }
    
    if (password.length < 3) {
      showFieldError("password", "Password must be at least 3 characters");
      return;
    }

    try {
      // Enhanced loading state
      setLoadingState(true);
      
      const clientsCol = window.db.collection("clients");
      const snapshot = await clientsCol
        .where("username", "==", username)
        .where("password", "==", password)
        .get();

      if (!snapshot.empty) {
        const user = snapshot.docs[0].data();
        
        // Handle remember me functionality
        if (rememberMeCheckbox.checked) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }
        
        // Enhanced user data storage
        const userData = {
          ...user,
          lastLogin: new Date().toISOString(),
          loginMethod: "manual"
        };
        
        sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        
        // Success animation and redirect
        showSuccessState();
        
        setTimeout(() => {
          modalOverlay.remove();
          redirectToUserDashboard(userData);
        }, 1500);
        
      } else {
        // Enhanced error handling
        showLoginError("Invalid username or password. Please check your credentials and try again.");
        shakeModal();
      }

    } catch (err) {
      console.error("Login error:", err);
      setLoadingState(false);
      showLoginError("Unable to connect to server. Please check your internet connection and try again.");
    }
  }

  // Enhanced navigation event listeners
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeModalWithAnimation(() => {
      if (window.mountSignIn) window.mountSignIn();
    });
  });

  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeModalWithAnimation(() => {
      if (window.mountForgetPassword) window.mountForgetPassword();
    });
  });

  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Enhanced helper functions
  function redirectToUserDashboard(user) {
    const role = (user.position || "").toLowerCase();
    
    console.log(`Redirecting user ${user.username} with role: ${role}`);
    
    if (role === "it manager") {
      window.mountITAdminDashboard(user);
    } else if (role === "admin head") {
      window.mountAdminDashboard(user);
    } else {
      window.mountDashboard(user);
    }
  }

  function setLoadingState(isLoading) {
    const btnText = loginBtn.querySelector(".btn-text");
    const btnLoader = loginBtn.querySelector(".btn-loader");
    
    if (isLoading) {
      loginBtn.disabled = true;
      loginBtn.style.background = "linear-gradient(135deg, #94a3b8, #64748b)";
      btnText.textContent = "Signing in...";
      btnLoader.style.display = "block";
    } else {
      loginBtn.disabled = false;
      loginBtn.style.background = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
      btnText.textContent = "Sign In";
      btnLoader.style.display = "none";
    }
  }

  function showSuccessState() {
    const btnText = loginBtn.querySelector(".btn-text");
    const btnLoader = loginBtn.querySelector(".btn-loader");
    
    loginBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    btnText.textContent = "Success!";
    btnLoader.style.display = "none";
    
    // Add checkmark icon
    btnText.innerHTML = '<i class="fas fa-check"></i> Welcome back!';
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
    ["username", "password"].forEach(fieldId => {
      const field = document.getElementById(fieldId);
      const errorDiv = document.getElementById(`${fieldId}Error`);
      
      field.style.borderColor = "#e2e8f0";
      field.style.boxShadow = "none";
      
      if (errorDiv) {
        errorDiv.style.display = "none";
      }
    });
  }

  function showLoginError(message) {
    const errorMsg = document.getElementById("errorMsg");
    const errorSpan = errorMsg.querySelector("span");
    
    errorSpan.textContent = message;
    errorMsg.style.display = "flex";
    errorMsg.style.alignItems = "center";
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideError();
    }, 5000);
  }

  function hideError() {
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.style.display = "none";
  }

  function shakeModal() {
    const modalContent = document.querySelector(".modal-content.login-content");
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

  function showWelcomeMessage(user) {
    const modalContent = document.querySelector(".modal-content.login-content");
    modalContent.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: logoFloat 0.6s ease forwards;
        ">
          <i class="fas fa-check" style="color: white; font-size: 28px;"></i>
        </div>
        <h3 style="
          margin: 0 0 8px 0;
          color: #0f172a;
          font-weight: 700;
          font-size: 24px;
        ">Welcome back, ${user.firstName || user.username}!</h3>
        <p style="
          margin: 0;
          color: #64748b;
          font-size: 16px;
        ">Redirecting to your dashboard...</p>
        <div style="
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 24px auto 0;
        "></div>
      </div>
    `;
  }

  function closeModal() {
    modalOverlay.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  }

  function closeModalWithAnimation(callback) {
    modalOverlay.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      modalOverlay.remove();
      if (callback) callback();
    }, 300);
  }
}

// Enhanced mount function with better error handling
function mountLogin(preFillUsername = "", preFillPassword = "") {
  try {
    // Remove any existing login modal
    const existingModal = document.getElementById("loginModal");
    if (existingModal) {
      existingModal.remove();
    }
    
    document.body.insertAdjacentHTML("beforeend", renderLoginModal());
    attachLogin(preFillUsername, preFillPassword);
    
    // Add additional CSS for fadeOut animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
  } catch (error) {
    console.error("Error mounting login modal:", error);
    alert("Unable to load login form. Please refresh the page and try again.");
  }
}

// Export for global access
window.mountLogin = mountLogin;