// pages/login.js

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

function attachLogin(preFillUsername = "", preFillPassword = "") {
  const loginBtn = document.getElementById("loginBtn");
  const signupLink = document.getElementById("signupLink");
  const forgotLink = document.getElementById("forgotLink");

  // Pre-fill if provided
  document.getElementById("username").value = preFillUsername;
  document.getElementById("password").value = preFillPassword;

  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.style.display = "none";

    if (!username || !password) {
      errorMsg.textContent = "Please enter both username and password.";
      errorMsg.style.display = "block";
      return;
    }

    try {

      // Show loading
      Modal.show("Checking credentials...");

      const clientsCol = window.db.collection("clients");
      const snapshot = await clientsCol
        .where("username", "==", username)
        .where("password", "==", password)
        .get();

      if (!snapshot.empty) {
        const user = snapshot.docs[0].data();
        mount(window.renderDashboard(user));
      } else {
        errorMsg.textContent = "Invalid username or password.";
        errorMsg.style.display = "block";
      }

      // Hide loading
      Modal.hide();

    } catch (err) {
        
      console.error(err);
      errorMsg.textContent = "Error logging in. Try again.";
      errorMsg.style.display = "block";
    }
  });

  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.mountSignIn) window.mountSignIn();
  });

  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.mountForgetPassword) window.mountForgetPassword();
  });
}

function mountLogin(preFillUsername = "", preFillPassword = "") {
  mount(renderLogin());
  attachLogin(preFillUsername, preFillPassword);
}

window.mountLogin = mountLogin;
