// Simple login renderer with Sign In and Forgot Password
function renderLogin() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Client Login</h2>
        
        <input id="username" type="text" placeholder="Username or Email" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="password" type="password" placeholder="Password" style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="loginBtn">Sign In</button>
        
        <p style="margin-top:12px;">
          <a href="#" id="forgotPassword" style="color:var(--accent); text-decoration:underline; cursor:pointer;">Forgot Password?</a>
        </p>

        <p id="errorMsg" style="color:red; margin-top:12px; display:none;">Invalid credentials</p>
      </div>
    </div>
  `;
}

// Attach login button and forgot password events
function attachLogin() {
  const loginBtn = document.getElementById("loginBtn");
  const forgot = document.getElementById("forgotPassword");

  // Sign In button
  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Replace with your authentication logic (or Firebase Auth)
    if (username === "client" && password === "1234") {
      mount(renderDashboard()); // successful login
    } else {
      document.getElementById("errorMsg").style.display = "block";
    }
  });

  // Forgot Password
  forgot.addEventListener("click", () => {
    const email = prompt("Enter your email to reset password:");
    if (email) {
      // Here you could call Firebase Auth sendPasswordResetEmail
      alert(`Password reset link would be sent to ${email} (demo)`);
    }
  });
}

// Mount login page
function mountLogin() {
  mount(renderLogin());
  attachLogin();
}

// Export globally so index.js can call it
window.mountLogin = mountLogin;
