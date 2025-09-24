// pages\login.js

function renderLoginModal() {
  return `
    <div id="loginModal" class="modal-overlay" style="
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center;
      z-index:1000;">
      
      <div class="modal-content" style="
        background:#fff; width:100%; max-width:420px; padding:32px; border-radius:12px;
        box-shadow:0 4px 16px rgba(0,0,0,0.1); text-align:center; position:relative;">
        
        <!-- Close Button (X) -->
        <span id="closeLoginModal" style="
          position:absolute; top:12px; right:16px; font-size:20px; font-weight:bold; cursor:pointer; color:#888;">
          &times;
        </span>
        
        <!-- Logo -->
        <div style="text-align:center; margin-bottom:18px;">
          <img src="assets/images/main_logo.jpg" alt="Logo" 
            style="width:80px; margin-bottom:10px;" />
        </div>

        <!-- Title -->
        <h2 style="margin-bottom:20px; color:var(--accent); font-weight:600; font-size:22px;">
          Northman Login
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
  const closeBtn = document.getElementById("closeLoginModal");
  const modalOverlay = document.getElementById("loginModal");

  // Pre-fill if provided
  document.getElementById("username").value = preFillUsername;
  document.getElementById("password").value = preFillPassword;

  // Check if the user is already logged in
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (loggedInUser) {
    // If logged in, skip the login modal
    const user = JSON.parse(loggedInUser);
    console.log(user)
    loginModal.remove();
    // Normalize position text to avoid case sensitivity issues
        const role = (user.position || "").toLowerCase();

        if (role === "it manager") {
          window.mountITAdminDashboard(user);   // IT-only dashboard
        } else if (role === "admin head") {
          window.mountAdminDashboard(user);     // Admin head dashboard
        } else {
          window.mountDashboard(user);          // Normal employee dashboard
        }
    return;
  }

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
      Modal.show("Checking credentials...");

      const clientsCol = window.db.collection("clients");
      const snapshot = await clientsCol
        .where("username", "==", username)
        .where("password", "==", password)
        .get();
      if (!snapshot.empty) {
        const user = snapshot.docs[0].data();
        // Save user data to sessionStorage
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        loca.setItem("loggedInUser", JSON.stringify(user));
        document.getElementById("loginModal").remove(); // close modal

        // Normalize position text to avoid case sensitivity issues
        const role = (user.position || "").toLowerCase();

        if (role === "it manager") {
          window.mountITAdminDashboard(user);   // IT-only dashboard
        } else if (role === "admin head") {
          window.mountAdminDashboard(user);     // Admin head dashboard
        } else {
          window.mountDashboard(user);          // Normal employee dashboard
        }

      }else {
        errorMsg.textContent = "Invalid username or password.";
        errorMsg.style.display = "block";
      }

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
    document.getElementById("loginModal").remove(); // close modal first
    if (window.mountSignIn) window.mountSignIn();
  });

  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("loginModal").remove();
    if (window.mountForgetPassword) window.mountForgetPassword();
  });

  // Close when clicking X
  closeBtn.addEventListener("click", () => {
    modalOverlay.remove();
  });

  // Close when clicking outside
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
    }
  });
}

function mountLogin(preFillUsername = "", preFillPassword = "") {
  document.body.insertAdjacentHTML("beforeend", renderLoginModal());
  attachLogin(preFillUsername, preFillPassword);
}

window.mountLogin = mountLogin;
