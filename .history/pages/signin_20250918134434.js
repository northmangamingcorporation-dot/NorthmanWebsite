// Utility to close all modals
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
}

// pages/signin.js
function renderSignInModal() {
  return `
    <div id="signInModal" class="modal-overlay" style="
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center;
      z-index:1000;">
      
      <div class="modal-content" style="
        background:#fff; width:100%; max-width:500px; padding:32px; border-radius:12px;
        box-shadow:0 4px 16px rgba(0,0,0,0.1); position:relative;">
        
        <!-- Close Button (X) -->
        <span id="closeSignInModal" style="
          position:absolute; top:12px; right:16px; font-size:20px; font-weight:bold; cursor:pointer; color:#888;">
          &times;
        </span>
        
        <!-- Logo -->
        <div style="text-align:center;">
          <img src="assets/images/main_logo.jpg" alt="Logo" 
            style="width:90px; margin-bottom:20px;" />
        </div>

        <!-- Title -->
        <h2 style="margin-bottom:24px; color:var(--accent); font-weight:600; text-align:center; font-size:22px;">
          Create Your Account
        </h2>

        <!-- Personal Info -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <input id="firstName" type="text" placeholder="First Name" 
            style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
          <input id="lastName" type="text" placeholder="Last Name" 
            style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <div style="margin-bottom:16px;">
          <input id="phone" type="tel" placeholder="Phone Number (optional)" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <div style="margin-bottom:16px;">
          <input id="birthdate" type="text" placeholder="Birthdate (MM/DD/YYYY)" 
              style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />

        </div>

        <!-- Account Info -->
        <div style="margin-bottom:16px;">
          <input id="newUsername" type="text" placeholder="Username" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <div style="margin-bottom:16px;">
          <input id="newEmail" type="email" placeholder="Email Address" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <div style="margin-bottom:16px;">
          <input id="newPassword" type="password" placeholder="Password" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <div style="margin-bottom:16px;">
          <input id="repeatPassword" type="password" placeholder="Confirm Password" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <!-- Department -->
        <div style="margin-bottom:24px;">
          <select id="department" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px; background:#fff;">
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Operation">Operation</option>
            <option value="Admin">Admin</option>
            <option value="Accountancy">Accountancy</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <!-- Submit -->
        <button class="btn" id="signUpBtn" 
          style="width:100%; padding:14px; font-size:16px; font-weight:bold; border:none; border-radius:8px; background:var(--accent); color:#fff; cursor:pointer; transition:0.3s;">
          Sign Up
        </button>

        <!-- Messages -->
        <p id="signUpMsg" style="color:green; margin-top:14px; display:none; text-align:center; font-size:14px;"></p>
        <p id="signUpError" style="color:red; margin-top:14px; display:none; text-align:center; font-size:14px;"></p>

        <!-- Footer -->
        <div style="margin-top:18px; text-align:center; font-size:14px;">
          Already have an account? 
          <a href="#" id="backToLogin" style="color:var(--accent); font-weight:500; text-decoration:none;">Login</a>
        </div>
      </div>
    </div>
  `;
}

function attachSignIn() {
  // ... (same logic as before for sign-up handling)

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals(); // ✅ hide all modals first
    if (window.mountLogin) window.mountLogin();
  });

  // Close modal
  document.getElementById("closeSignInModal").addEventListener("click", () => {
    closeAllModals();
  });
  document.getElementById("signInModal").addEventListener("click", (e) => {
    if (e.target.id === "signInModal") {
      closeAllModals();
    }
  });
}

function mountSignIn() {
  closeAllModals(); // ✅ hide other modals
  document.body.insertAdjacentHTML("beforeend", renderSignInModal());
  attachSignIn();
}

window.mountSignIn = mountSignIn;
