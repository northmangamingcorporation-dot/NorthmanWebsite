// pages/login.js

function renderLogin() {
  return `
    <div class="container" style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f7f7f7; font-family:Arial, sans-serif;">
      <div class="card" style="width:100%; max-width:420px; padding:32px; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.1); background:#fff; text-align:center;">
        
        <!-- Logo -->
        <div style="text-align:center; margin-bottom:18px;">
          <img src="assets/images/main_logo.jpg" alt="Logo" 
            style="width:80px; margin-bottom:10px;" />
        </div>

        <!-- Title -->
        <h2 style="margin-bottom:20px; color:var(--accent); font-weight:600; font-size:22px;">
          Client Login
        </h2>
        
        <!-- Username -->
        <div style="margin-bottom:14px;">
          <input id="username" type="text" placeholder="Username" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <!-- Password -->
        <div style="margin-bottom:18px;">
          <input id="password" type="password" placeholder="Password" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>
        
        <!-- Login Button -->
        <button class="btn" id="loginBtn" 
          style="width:100%; padding:14px; font-size:16px; font-weight:bold; border:none; border-radius:8px; background:var(--accent); color:#fff; cursor:pointer; transition:0.3s;">
          Login
        </button>

        <!-- Error Message -->
        <p id="errorMsg" style="color:red; margin-top:14px; display:none; font-size:14px;">
          Invalid credentials
        </p>

        <!-- Links -->
        <div style="margin-top:18px; text-align:center; font-size:14px;">
          <a href="#" id="signupLink" style="color:var(--accent); text-decoration:none; font-weight:500; display:block; margin-bottom:8px;">
            Sign Up
          </a>
          <a href="#" id="forgotLink" style="color:var(--accent); text-decoration:none; font-weight:500;">
            Forgot Password?
          </a>
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
      Modal.hide();  
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
