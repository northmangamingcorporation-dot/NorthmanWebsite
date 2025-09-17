// pages/signin.js

function renderSignIn() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Sign Up</h2>
        
        <input id="newUsername" type="text" placeholder="Username" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="newEmail" type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="newPassword" type="password" placeholder="Create Password" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="repeatPassword" type="password" placeholder="Repeat Password" style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="signUpBtn">Sign Up</button>
        <p id="signUpMsg" style="color:green; margin-top:12px; display:none;"></p>
        <p id="signUpError" style="color:red; margin-top:12px; display:none;"></p>
        
        <a href="#" id="backToLogin" style="color:var(--accent); text-decoration:underline; display:block; margin-top:14px;">Back to Login</a>
      </div>
    </div>
  `;
}

// pages/signin.js

function renderSignIn() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Sign Up</h2>
        
        <input id="newUsername" type="text" placeholder="Username" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="newEmail" type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="newPassword" type="password" placeholder="Create Password" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="repeatPassword" type="password" placeholder="Repeat Password" style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="signUpBtn">Sign Up</button>
        <p id="signUpMsg" style="color:green; margin-top:12px; display:none;"></p>
        <p id="signUpError" style="color:red; margin-top:12px; display:none;"></p>
        
        <a href="#" id="backToLogin" style="color:var(--accent); text-decoration:underline; display:block; margin-top:14px;">Back to Login</a>
      </div>
    </div>
  `;
}

function attachSignIn() {
  document.getElementById("signUpBtn").addEventListener("click", async () => {
    const username = document.getElementById("newUsername").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const password = document.getElementById("newPassword").value;
    const repeat = document.getElementById("repeatPassword").value;
    const msg = document.getElementById("signUpMsg");
    const err = document.getElementById("signUpError");
    msg.style.display = "none";
    err.style.display = "none";

    if (!username || !email || !password || !repeat) return showError("All fields are required");
    if (password !== repeat) return showError("Passwords do not match");

    try {
      const clientsCol = window.db.collection("clients");

      // Check for existing username or email
      const usernameSnapshot = await clientsCol.where("username", "==", username).get();
      const emailSnapshot = await clientsCol.where("email", "==", email).get();

      if (!usernameSnapshot.empty || !emailSnapshot.empty) {
        // Pass existing username/email to forget password
        const goToReset = await Modal.confirm("User already exists. Go to reset password?");
        if (goToReset && window.mountForgetPassword) {
          window.mountForgetPassword(username); // <-- pass username/email
        }
        return;
      }

      // Show loading modal
      Modal.show("Creating account...");

      // Store user in Firestore
      await clientsCol.add({
        username,
        email,
        password,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "active"
      });

      Modal.hide();
      msg.textContent = "Account created! Redirecting to login...";
      msg.style.display = "block";

      // Pass username and password to login page
      setTimeout(() => {
        if (window.mountLogin) window.mountLogin(username, password);
      }, 1500);

    } catch (error) {
      Modal.hide();
      console.error(error);
      showError("Error creating account. Try again.");
    }

    function showError(text) {
      err.textContent = text;
      err.style.display = "block";
    }
  });

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    if (window.mountLogin) window.mountLogin();
  });
}

function mountSignIn() {
  mount(renderSignIn());
  attachSignIn();
}

window.mountSignIn = mountSignIn;