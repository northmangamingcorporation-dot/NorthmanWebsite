/

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
      </div>
    </div>
  `;
}

// Attach login button event
function attachLogin() {
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Simple validation
    if (username === "client" && password === "1234") {
      // successful login -> render dashboard
      mount(renderDashboard());
    } else {
      document.getElementById("errorMsg").style.display = "block";
    }
  });
}

// Override previous mount helper to attach login
function mountLogin() {
  mount(renderLogin());
  attachLogin();
}

// Export for index.js to use
window.mountLogin = mountLogin;
