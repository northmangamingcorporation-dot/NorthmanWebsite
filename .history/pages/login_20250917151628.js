// NorthmanWebsite/pages/login.js

// Simple login renderer
function renderLogin() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Client Login</h2>
        
        <input id="username" type="text" placeholder="Username" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="password" type="password" placeholder="Password" style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="loginBtn">Login</button>
        <p id="errorMsg" style="color:red; margin-top:12px; display:none;">Invalid credentials</p>
        
        <div style="margin-top:14px;">
          <a href="#" id="signupLink" style="color:var(--accent); text-decoration:underline; display:block; margin-bottom:6px;">Sign Up</a>
          <a href="#" id="forgotLink" style="color:var(--accent); text-decoration:underline;">Forgot Password?</a>
        </div>
      </div>
    </div>
  `;
}

// Attach login button and links events
function attachLogin() {
  const loginBtn = document.getElementById("loginBtn");
  const signupLink = document.getElementById("signupLink");
  const forgotLink = document.getElementById("forgotLink");

  // Login
  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "client" && password === "1234") {
      mount(renderDashboard()); // successful login
    } else {
      document.getElementById("errorMsg").style.display = "block";
    }
  });

  // Redirect to Sign Up page
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.mountSignIn(); // mount signin page
  });

  // Redirect to Forgot Password page
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.mountForgetPassword(); // mount forgot password page
  });
}

// Mount login page
function mountLogin() {
  mount(renderLogin());
  attachLogin();
}

// Export globally so index.js can call it
window.mountLogin = mountLogin;
