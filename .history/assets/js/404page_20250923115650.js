// pages/404.js
function render404Page() {
  return `
    <div style="
      display:flex; justify-content:center; align-items:center; 
      height:100vh; background:#f8f9fa; color:#333; font-family:Arial, sans-serif;
    ">
      <div style="text-align:center; padding:40px;">
        <h1 style="font-size:80px; margin:0; color:#dc3545;">404</h1>
        <h2 style="font-size:22px; margin:10px 0 20px;">Page Not Yet Available</h2>
        <p style="font-size:16px; margin-bottom:30px; color:#555;">
          The page you are trying to access is not ready yet.<br/>
          Please check back later.
        </p>
        <button id="goHomeBtn" style="
          padding:12px 24px; font-size:16px; border:none; border-radius:6px;
          background:#007bff; color:#fff; cursor:pointer; transition:0.3s;
        ">
          Go Back Home
        </button>
      </div>
    </div>
  `;
}

function mount404Page() {
  const app = document.getElementById("app"); // or your main container
  if (app) {
    app.innerHTML = render404Page();
  } else {
    document.body.innerHTML = render404Page();
  }

  // Handle button action
  const goHomeBtn = document.getElementById("goHomeBtn");
  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", () => {
      // Redirect to dashboard or main page
      window.location.href = "/";
    });
  }
}

// Expose globally (just like mountSignIn)
window.mount404Page = mount404Page;
