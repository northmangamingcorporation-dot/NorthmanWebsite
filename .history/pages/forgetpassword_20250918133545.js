// pages/forgetpassword.js

function renderForgetPassword() {
  return `
    <div id="forgetPasswordModal" class="modal-overlay">
      <div class="modal-card">
        <h2 style="margin-bottom:16px; color:var(--accent)">Forgot Password</h2>
        
        <input id="usernameReset" type="text" placeholder="Enter your username" 
          style="width:100%; padding:10px; margin-bottom:16px; border-radius:8px; border:1px solid #ccc;" />
        
        <button class="btn" id="resetBtn">Reset Password</button>
        <p id="resetMsg" style="color:green; margin-top:12px; display:none;">
          Reset link sent! Check your username account.
        </p>

        <a href="#" id="backToLogin2" 
          style="color:var(--accent); text-decoration:underline; display:block; margin-top:14px;">
          Back to Login
        </a>
      </div>
    </div>
  `;
}

function attachForgetPassword(prefill = "") {
  const modal = document.getElementById("forgetPasswordModal");
  const usernameInput = document.getElementById("usernameReset");
  const resetMsg = document.getElementById("resetMsg");

  usernameInput.value = prefill;

  // reset password
  document.getElementById("resetBtn").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    resetMsg.style.display = "none";

    if (!username) {
      alert("Please enter your username.");
      return;
    }

    try {
      Modal.show("Checking username...");

      const clientsCol = window.db.collection("clients");
      const snapshot = await clientsCol.where("username", "==", username).get();

      Modal.hide();

      if (!snapshot.empty) {
        resetMsg.textContent = "Reset link sent! Check your username account.";
        resetMsg.style.display = "block";
      } else {
        alert("Username not found.");
      }
    } catch (err) {
      Modal.hide();
      console.error(err);
      alert("Error. Try again.");
    }
  });

  // back to login
  document.getElementById("backToLogin2").addEventListener("click", (e) => {
    e.preventDefault();
    modal.remove();
    window.mountLogin();
  });

  // close when clicking outside modal-card
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
      window.mountLogin();
    }
  });
}

function mountForgetPassword(prefill = "") {
  document.body.insertAdjacentHTML("beforeend", renderForgetPassword());
  attachForgetPassword(prefill);
}

window.mountForgetPassword = mountForgetPassword;

// --- styles ---
const fpStyle = document.createElement("style");
fpStyle.innerHTML = `
  .modal-overlay {
    position: fixed;
    top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.5);
    display:flex; justify-content:center; align-items:center;
    z-index: 9999;
  }
  .modal-card {
    background:#fff;
    padding:24px;
    border-radius:12px;
    width:100%;
    max-width:400px;
    box-shadow:0 4px 12px rgba(0,0,0,0.15);
    text-align:center;
  }
`;
document.head.appendChild(fpStyle);
