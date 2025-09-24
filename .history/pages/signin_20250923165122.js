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
        <button id="closeSignInModal" style="
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
            Create Account
          </h2>
          <p style="
            margin: 0;
            color: #64748b;
            font-size: 16px;
            font-weight: 500;
          ">
            Join Northman today
          </p>
        </div>
        
        <!-- Enhanced Form Container -->
        <div class="form-container" style="margin-bottom: 24px;">
          <!-- Personal Info: First and Last Name -->
          <div class="row-group" style="
            display: flex;
            gap: 16px;
            margin-bottom: 20px;
          ">
            <div class="input-group" style="flex: 1; position: relative;">
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
                <input id="firstName" type="text" placeholder="First Name" style="
                  width: 100%;
                  padding: 16px 16px 16px 48px;
                  border-radius: 12px;
                  border: 2px solid #e2e8f0;
                  font-size: 16px;
                  background: white;
                  transition: all 0.3s ease;
                  outline: none;
                  box-sizing: border-box;
                  text-transform: capitalize;
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
              <div class="field-error" id="firstNameError" style="
                color: #ef4444;
                font-size: 14px;
                margin-top: 4px;
                display: none;
                text-align: left;
              "></div>
            </div>

            <div class="input-group" style="flex: 1; position: relative;">
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
                <input id="lastName" type="text" placeholder="Last Name" style="
                  width: 100%;
                  padding: 16px 16px 16px 48px;
                  border-radius: 12px;
                  border: 2px solid #e2e8f0;
                  font-size: 16px;
                  background: white;
                  transition: all 0.3s ease;
                  outline: none;
                  box-sizing: border-box;
                  text-transform: capitalize;
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
              <div class="field-error" id="lastNameError" style="
                color: #ef4444;
                font-size: 14px;
                margin-top: 4px;
                display: none;
                text-align: left;
              "></div>
            </div>
          </div>

          <!-- Phone -->
          <div class="input-group" style="
            margin-bottom: 20px;
            position: relative;
          ">
            <div class="input-wrapper" style="
              position: relative;
              transition: all 0.3s ease;
            ">
              <i class="fas fa-phone input-icon" style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 16px;
                z-index: 2;
                transition: color 0.3s ease;
              "></i>
              <input id="phone" type="tel" placeholder="Phone Number (optional)" style="
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
            <div class="field-error" id="phoneError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Birthdate -->
          <div class="input-group" style="
            margin-bottom: 20px;
            position: relative;
          ">
            <div class="input-wrapper" style="
              position: relative;
              transition: all 0.3s ease;
            ">
              <i class="fas fa-calendar input-icon" style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 16px;
                z-index: 2;
                transition: color 0.3s ease;
              "></i>
              <input id="birthdate" type="text" placeholder="Birthdate (MM/DD/YYYY)" style="
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
            <div class="field-error" id="birthdateError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Account Info: Username -->
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
              <input id="newUsername" type="text" placeholder="Username" style="
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
            <div class="field-error" id="newUsernameError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Email -->
          <div class="input-group" style="
            margin-bottom: 20px;
            position: relative;
          ">
            <div class="input-wrapper" style="
              position: relative;
              transition: all 0.3s ease;
            ">
              <i class="fas fa-envelope input-icon" style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 16px;
                z-index: 2;
                transition: color 0.3s ease;
              "></i>
              <input id="newEmail" type="email" placeholder="Email Address" style="
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
            <div class="field-error" id="newEmailError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Password -->
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
              <input id="newPassword" type="password" placeholder="Password" style="
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
              <button type="button" id="toggleNewPassword" style="
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
            <div class="field-error" id="newPasswordError" style="
              color: #ef4444;
                            font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Confirm Password -->
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
              <input id="repeatPassword" type="password" placeholder="Confirm Password" style="
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
              <button type="button" id="toggleRepeatPassword" style="
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
            <div class="field-error" id="repeatPasswordError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Department Select -->
          <div class="input-group" style="
            margin-bottom: 20px;
            position: relative;
          ">
            <div class="input-wrapper" style="
              position: relative;
              transition: all 0.3s ease;
            ">
              <i class="fas fa-building input-icon" style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 16px;
                z-index: 2;
                transition: color 0.3s ease;
              "></i>
              <select id="department" style="
                width: 100%;
                padding: 16px 16px 16px 48px;
                border-radius: 12px;
                border: 2px solid #e2e8f0;
                font-size: 16px;
                background: white;
                transition: all 0.3s ease;
                outline: none;
                box-sizing: border-box;
                appearance: none;
                background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2394a3b8\" stroke-width=\"2\"><polyline points=\"6,9 12,15 18,9\"></polyline></svg>');
                background-repeat: no-repeat;
                background-position: right 16px center;
                background-size: 16px;
              " onfocus="
                this.style.borderColor = '#3b82f6';
                this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                this.previousElementSibling.style.color = '#3b82f6';
              " onblur="
                this.style.borderColor = '#e2e8f0';
                this.style.boxShadow = 'none';
                this.previousElementSibling.style.color = '#94a3b8';
              ">
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Operation">Operation</option>
                <option value="Admin">Admin</option>
                <option value="Accountancy">Accountancy</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div class="field-error" id="departmentError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>

          <!-- Position -->
          <div class="input-group" style="
            margin-bottom: 20px;
            position: relative;
          ">
            <div class="input-wrapper" style="
              position: relative;
              transition: all 0.3s ease;
            ">
              <i class="fas fa-briefcase input-icon" style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 16px;
                z-index: 2;
                transition: color 0.3s ease;
              "></i>
              <input id="position" type="text" placeholder="Position (e.g., IT Manager)" style="
                width: 100%;
                padding: 16px 16px 16px 48px;
                border-radius: 12px;
                border: 2px solid #e2e8f0;
                font-size: 16px;
                background: white;
                transition: all 0.3s ease;
                outline: none;
                box-sizing: border-box;
                text-transform: capitalize;
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
            <div class="field-error" id="positionError" style="
              color: #ef4444;
              font-size: 14px;
              margin-top: 4px;
              display: none;
              text-align: left;
            "></div>
          </div>
        </div>
        
        <!-- Enhanced Sign Up Button -->
        <button class="btn signup-btn" id="signUpBtn" style="
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
          <span class="btn-text">Sign Up</span>
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

        <!-- Enhanced Messages -->
        <div class="message-container" style="margin-bottom: 24px;">
          <div id="signUpMsg" class="success-msg" style="
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
            <span>Account created successfully!</span>
          </div>
          <div id="signUpError" class="error-msg" style="
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
            <span>Please fill all required fields.</span>
          </div>
        </div>

        <!-- Enhanced Links Section -->
        <div class="links-section" style="
          text-align: center;
          font-size: 15px;
          color: #64748b;
        ">
          <p style="margin: 0 0 16px 0;">
            Already have an account?
            <a href="#" id="backToLogin" style="
              color: #3b82f6;
              text-decoration: none;
              font-weight: 600;
              margin-left: 4px;
              transition: color 0.3s ease;
            " onmouseover="this.style.color='#1d4ed8';"
               onmouseout="this.style.color='#3b82f6';">
              Sign In
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
        .modal-content.signin-content {
          margin: 20px;
          padding: 32px 24px;
          max-width: none;
        }
        
        .row-group {
          flex-direction: column;
          gap: 0;
        }
        
        .title-section h2 {
          font-size: 24px;
        }
        
        .input-wrapper input, .input-wrapper select {
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

function attachSignIn() {
  const modal = document.getElementById("signInModal");
  const closeBtn = document.getElementById("closeSignInModal");
  const signUpBtn = document.getElementById("signUpBtn");
  const backToLogin = document.getElementById("backToLogin");
  const toggleNewPassword = document.getElementById("toggleNewPassword");
  const toggleRepeatPassword = document.getElementById("toggleRepeatPassword");
  const newPasswordField = document.getElementById("newPassword");
  const repeatPasswordField = document.getElementById("repeatPassword");
  const signUpMsg = document.getElementById("signUpMsg");
  const signUpError = document.getElementById("signUpError");

  // Initialize flatpickr AFTER modal exists
  if (typeof flatpickr !== 'undefined') {
    flatpickr("#birthdate", {
      dateFormat: "m/d/Y",
      allowInput: true,
      maxDate: "today"
    });
  }

  // Enhanced password toggle functionality
  toggleNewPassword.addEventListener("click", () => {
    const type = newPasswordField.getAttribute("type") === "password" ? "text" : "password";
    newPasswordField.setAttribute("type", type);
    const icon = toggleNewPassword.querySelector("i");
    icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
    toggleNewPassword.style.transform = "scale(0.95)";
    setTimeout(() => {
      toggleNewPassword.style.transform = "scale(1)";
    }, 150);
  });

  toggleRepeatPassword.addEventListener("click", () => {
    const type = repeatPasswordField.getAttribute("type") === "password" ? "text" : "password";
    repeatPasswordField.setAttribute("type", type);
    const icon = toggleRepeatPassword.querySelector("i");
    icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
    toggleRepeatPassword.style.transform = "scale(0.95)";
    setTimeout(() => {
      toggleRepeatPassword.style.transform = "scale(1)";
    }, 150);
  });

  // Enhanced keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && modal.style.display !== "none") {
      e.preventDefault();
      signUpBtn.click();
    }
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Tooltip element (enhanced)
  const tooltip = document.createElement("div");
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(15, 23, 42, 0.95);
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    display: none;
    z-index: 1100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
  `;
  document.body.appendChild(tooltip);

  const inputs = modal.querySelectorAll("input, select");
  inputs.forEach(input => {
    input.addEventListener("focus", (e) => {
      let msg = "";
      switch (input.id) {
        case "firstName": msg = "Enter your given name."; break;
        case "lastName": msg = "Enter your family name."; break;
        case "phone": msg = "Optional: for account recovery."; break;
        case "birthdate": msg = "Birthdate Format: MM/DD/YYYY."; break;
        case "newUsername": msg = "Choose a unique username (min 3 chars)."; break;
        case "newEmail": msg = "Enter a valid email address."; break;
        case "newPassword": msg = "Password must be at least 6 characters."; break;
        case "repeatPassword": msg = "Re-enter the same password."; break;
        case "department": msg = "Select your department."; break;
        case "position": msg = "Example: IT Manager, HR Officer."; break;
      }

      if (msg) {
        tooltip.textContent = msg;
        tooltip.style.display = "block";
        const rect =