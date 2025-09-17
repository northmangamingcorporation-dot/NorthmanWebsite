function renderSignIn() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Sign Up</h2>
        
        <input id="newUsername" type="text" placeholder="Username" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="newEmail" type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;" />
        <input id="newPassword" type="password" placeholder="Password" style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="signUpBtn">Sign Up</button>
        <p id="signUpMsg" style="color:green; margin-top:12px; display:none;">Account created! Redirecting to login...</p>
        <a href="#" id="backToLogin" style="color:var(--accent); text-decoration:underline; display:block; margin-top:14px;">Back to Login</a>
      </div>
    </div>
  `;
}

function attachSignIn() {
  document.getElementById("signUpBtn").addEventListener("click", () => {
    // Simple dummy sign up
    document.getElementById("signUpMsg").style.display = "block";
    setTimeout(() => {
      window.mountLogin();
    }, 1500);
  });

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    window.mountLogin();
  });
}

function mountSignIn() {
  mount(renderSignIn());
  attachSignIn();
}

window.mountSignIn = mountSignIn;
