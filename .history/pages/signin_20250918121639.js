// pages/signin.js

function renderSignIn() {
  return `
    <div class="container" style="max-width:480px; margin:80px auto; font-family:Arial, sans-serif;">
      <div class="card" style="padding:32px; border-radius:12px; box-shadow:0 4px 14px rgba(0,0,0,0.08); background:#fff;">
        
        <!-- Logo -->
        <img src="assets/images/main_logo.jpg" alt="Logo" 
          style="width:90px; margin:0 auto 20px; display:block;" />
        
        <!-- Title -->
        <h2 style="margin-bottom:24px; color:var(--accent); font-weight:600; text-align:center; font-size:22px;">
          Create Your Account
        </h2>

        <!-- Personal Info -->
        <div style="display:flex; gap:12px; margin-bottom:16px; ">
          <input id="firstName" type="text" placeholder="First Name" 
            style="flex:1; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
          <input id="lastName" type="text" placeholder="Last Name" 
            style="flex:1; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <div style="margin-bottom:16px;">
          <input id="phone" type="tel" placeholder="Phone Number (optional)" 
            style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; font-size:15px;" />
        </div>

        <div style="margin-bottom:16px;">
          <input id="birthdate" type="date" 
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
  document.getElementById("signUpBtn").addEventListener("click", async () => {
    // Collect form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const birthdate = document.getElementById("birthdate").value;
    const username = document.getElementById("newUsername").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const password = document.getElementById("newPassword").value;
    const repeat = document.getElementById("repeatPassword").value;
    const department = document.getElementById("department").value;

    const msg = document.getElementById("signUpMsg");
    const err = document.getElementById("signUpError");
    msg.style.display = "none";
    err.style.display = "none";

    // Validation
    if (!firstName || !lastName || !birthdate || !username || !email || !password || !repeat || !department) {
      return showError("All required fields must be filled.");
    }
    if (password !== repeat) {
      return showError("Passwords do not match.");
    }

    try {
      const clientsCol = window.db.collection("clients");

      // Check if username or email already exists
      const usernameSnapshot = await clientsCol.where("username", "==", username).get();
      const emailSnapshot = await clientsCol.where("email", "==", email).get();

      if (!usernameSnapshot.empty || !emailSnapshot.empty) {
        const goToReset = await Modal.confirm("User already exists. Go to reset password?");
        if (goToReset && window.mountForgetPassword) {
          window.mountForgetPassword(username || email); // prefill
        }
        return;
      }

      // Show loading
      Modal.show("Creating account...");

      // Save to Firestore
      await clientsCol.add({
        firstName,
        lastName,
        phone: phone || null,
        birthdate,
        username,
        email,
        password,
        department,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "active"
      });

      Modal.hide();
      msg.textContent = "Account created! Redirecting to login...";
      msg.style.display = "block";

      // Redirect to login prefilled
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
