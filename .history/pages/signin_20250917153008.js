// pages/signin.js

function renderSignIn() {
  return `
    <div class="container" style="max-width:400px; margin-top:80px;">
      <div class="card" style="padding:24px; text-align:center;">
        <h2 style="margin-bottom:16px; color:var(--accent)">Sign Up</h2>
        
        <div style="position:relative; margin-bottom:12px;">
          <input id="newEmail" type="email" placeholder="Email" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc;" />
        </div>

        <div style="position:relative; margin-bottom:12px;">
          <input id="newPassword" type="password" placeholder="Create Password" style="width:100%; padding:10px 40px 10px 10px; border-radius:8px; border:1px solid #ccc;" />
        </div>

        <div style="position:relative; margin-bottom:16px;">
          <input id="repeatPassword" type="password" placeholder="Repeat Password" style="width:100%; padding:10px 40px 10px 10px; border-radius:8px; border:1px solid #ccc;" />
        </div>

        <button class="btn" id="signUpBtn">Sign Up</button>
        <p id="signUpMsg" style="color:green; margin-top:12px; display:none;"></p>
        <p id="signUpError" style="color:red; margin-top:12px; display:none;"></p>
        
        <a href="#" id="backToLogin" style="color:var(--accent); text-decoration:underline; display:block; margin-top:14px;">Back to Login</a>
      </div>
    </div>
  `;
}

function attachSignIn() {
  const newPassword = document.getElementById("newPassword");
  const repeatPassword = document.getElementById("repeatPassword");
  const togglePassword = document.getElementById("togglePassword");
  const toggleRepeat = document.getElementById("toggleRepeat");

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    newPassword.type = newPassword.type === "password" ? "text" : "password";
  });

  toggleRepeat.addEventListener("click", () => {
    repeatPassword.type = repeatPassword.type === "password" ? "text" : "password";
  });

  document.getElementById("signUpBtn").addEventListener("click", async () => {
    const email = document.getElementById("newEmail").value.trim();
    const password = newPassword.value;
    const repeat = repeatPassword.value;
    const msg = document.getElementById("signUpMsg");
    const err = document.getElementById("signUpError");
    msg.style.display = "none";
    err.style.display = "none";

    if (!email || !password || !repeat) return showError("All fields are required");
    if (password !== repeat) return showError("Passwords do not match");

    try {
      const { collection, addDoc } = await import("firebase/firestore");
      const clientsCol = collection(window.db, "clients");
      await addDoc(clientsCol, { email, password, createdAt: new Date(), status: "active" });

      msg.textContent = "Account created! Redirecting to login...";
      msg.style.display = "block";

      setTimeout(() => {
        window.mountLogin(email, password);
      }, 1500);

    } catch (error) {
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
    window.mountLogin();
  });
}

function mountSignIn() {
  mount(renderSignIn());
  attachSignIn();
}

window.mountSignIn = mountSignIn;
