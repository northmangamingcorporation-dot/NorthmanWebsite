function renderForgetPassword() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Forgot Password</h2>
        
        <input id="emailReset" type="email" placeholder="Enter your email" style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="resetBtn">Reset Password</button>
        <p id="resetMsg" style="color:green; margin-top:12px; display:none;">Reset link sent! Check your email.</p>
        <a href="#" id="backToLogin2" style="color:var(--accent); text-decoration:underline; display:block; margin-top:14px;">Back to Login</a>
      </div>
    </div>
  `;
}

function attachForgetPassword() {
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("resetMsg").style.display = "block";
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
