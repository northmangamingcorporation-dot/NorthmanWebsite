// pages/forgetpassword.js

function renderForgetPassword() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Forgot Password</h2>
        
        <input id="usernameReset" type="text" placeholder="Enter your username" style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="resetBtn">Reset Password</button>
        <p id="resetMsg" style="color:green; margin-top:12px; display:none;">Reset link sent! Check your username account.</p>
        <a href="#" id="backToLogin2" style="color:var(--accent); text-decoration:underline; display:block; margin-top:14px;">Back to Login</a>
      </div>
    </div>
  `;
}

function attachForgetPassword() {
  document.getElementById("resetBtn").addEventListener("click", async () => {
    const username = document.getElementById("usernameReset").value.trim();
    const resetMsg = document.getElementById("resetMsg");
    resetMsg.style.display = "none";

    if (!username) {
      alert("Please enter your username.");
      return;
    }

    try {
      // Access Firestore clients collection
      const clientsCol = window.db.collection("clients");
      const snapshot = await clientsCol.where("username", "==", username).get();

      if (!snapshot.empty) {
        // Simulate sending reset link
        resetMsg.textContent = "Reset link sent! Check your username account.";
        resetMsg.style.display = "block";
      } else {
        alert("Username not found.");
      }

    } catch (err) {
      console.error(err);
      alert("Error. Try again.");
    }
  });

  document.getElementById("backToLogin2").addEventListener("click", (e) => {
    e.preventDefault();
    window.mountLogin();
  });
}

function mountForgetPassword() {
  mount(renderForgetPassword());
  attachForgetPassword();
}

window.mountForgetPassword = mountForgetPassword;
