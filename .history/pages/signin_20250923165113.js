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
              color: #ef4444