// --- Inject Styles ---
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --primary: #2d3e50;
      --secondary: #0078d7;
      --muted: #6c757d;
      --light-bg: #f9f9f9;
    }

    body {
      font-family: "Segoe UI", sans-serif;
      margin: 0;
      color: var(--primary);
      background: #fff;
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background: var(--primary);
      color: #fff;
    }

    .nav .brand {
      font-weight: bold;
      font-size: 18px;
    }

    .nav ul {
      list-style: none;
      display: flex;
      gap: 20px;
      margin: 0;
      padding: 0;
    }

    .nav ul li a {
      color: #fff;
      text-decoration: none;
      position: relative;
    }

    .nav ul li a::after {
      content: "";
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0%;
      height: 2px;
      background: var(--secondary);
      transition: 0.3s;
    }

    .nav ul li a:hover::after {
      width: 100%;
    }

    .hero {
      text-align: center;
      padding: 80px 20px;
      color: #fff;
    }

    .gradient-bg {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 0 0 24px 24px;
    }

    .cta-buttons {
      margin-top: 20px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 15px;
      transition: 0.3s;
    }

    .btn.primary {
      background: var(--secondary);
      color: #fff;
    }

    .btn.secondary {
      background: #fff;
      color: var(--secondary);
      border: 1px solid var(--secondary);
      margin-left: 10px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .section {
      padding: 50px 20px;
    }

    .section.alt {
      background: var(--light-bg);
    }

    .section h3 {
      margin-bottom: 20px;
      font-size: 22px;
    }

    .card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: var(--muted);
      border-top: 1px solid #eaeaea;
      margin-top: 40px;
    }
  `;
  document.head.appendChild(style);
}

// --- Helper: mount HTML ---
function mount(html) {
  document.getElementById("root").innerHTML = html;
  attachActions(); // wire up buttons/links after mounting
}

// --- HTML templates ---
function renderNav() {
  return `
    <div class="nav container" role="navigation">
      <div class="brand">Northman Gaming Corporation</div>
      <ul>
        <li><a href="#home" data-route="home">Home</a></li>
        <li><a href="#services" data-route="services">Services</a></li>
        <li><a href="#about" data-route="about">About</a></li>
        <li><a href="#contact" data-route="contact">Contact</a></li>
      </ul>
    </div>
  `;
}

function renderHome() {
  return `
    ${renderNav()}
    <div class="container">
      <!-- Hero Section -->
      <section class="hero gradient-bg">
        <h1>Welcome to Northman Gaming Corporation (NGC)</h1>
        <p class="lead">
          An Authorized Agent Corporation under the Philippine Charity Sweepstakes Office (PCSO), 
          delivering premier gaming services in Davao del Norte since September 2024.
        </p>
        <div class="cta-buttons">
          <button class="btn primary" id="getStartedBtn">Portal</button>
          <button class="btn secondary" id="learnMoreBtn">Learn More</button>
        </div>
      </section>

      <!-- Overview -->
      <section class="section">
        <h3>Pangkalahatang-ideya</h3>
        <div class="card">
          <p>Northman Gaming Corporation (NGC) was established in September 2024 under the auspices of the Philippine Charity Sweepstakes Office (PCSO). 
          As an authorized Agent Corporation (AAC), NGC is committed to providing premier gaming services in Davao del Norte, 
          delivering exceptional quality to its customers and contributing positively to the local community.</p>
        </div>
      </section>

      <!-- Mission -->
      <section class="section alt">
        <h3>Our Mission</h3>
        <div class="card">
          <p>NGC is dedicated to providing exceptional gaming experiences while fostering a sense of community through responsible gaming practices and community service. 
          Our mission is to ensure a safe and enjoyable gaming environment that supports both the entertainment and philanthropic goals of our patrons.</p>
        </div>
      </section>

      <!-- Vision -->
      <section class="section">
        <h3>Our Vision</h3>
        <div class="card">
          <p>Our vision is to become the leading gaming corporation in Davao del Norte, renowned for our commitment to quality service and community engagement. 
          We aim to set the standard in the gaming industry for innovation, integrity, and community involvement.</p>
        </div>
      </section>

      <!-- Core Values -->
      <section class="section alt">
        <h3>Our Core Values: 𝐓.𝐑.𝐔.𝐒.𝐓.</h3>
        <div class="grid-2">
          <div class="card"><strong>Transparency</strong><p>We operate with openness and honesty in all our business dealings.</p></div>
          <div class="card"><strong>Responsibility</strong><p>We are committed to responsible gaming practices, ensuring the well-being of our customers and community.</p></div>
          <div class="card"><strong>Unity</strong><p>We foster strong relationships within our team and communities we serve.</p></div>
          <div class="card"><strong>Service Excellence</strong><p>We are dedicated to providing the highest level of service to our customers.</p></div>
          <div class="card"><strong>Trustworthiness</strong><p>We strive to earn and maintain the trust of colleagues, customers, and partners.</p></div>
        </div>
      </section>

      <!-- Footer -->
      <div class="footer">
        © ${new Date().getFullYear()} Northman Gaming Corporation — All rights reserved.
      </div>
    </div>
  `;
}

// --- Event wiring ---
function attachActions() {
  const gs = document.getElementById("getStartedBtn");
  if (gs) gs.addEventListener("click", () => window.mountLogin?.());

  const learn = document.getElementById("learnMoreBtn");
  if (learn) learn.addEventListener("click", () => {
    const services = document.querySelector(".section");
    if (services) services.scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const route = el.getAttribute('data-route');
      mount(renderHome());
      if (route === 'services') setTimeout(()=>document.querySelector('.section')?.scrollIntoView({behavior:'smooth'}), 50);
      if (route === 'about') setTimeout(()=>document.querySelector('#about')?.scrollIntoView({behavior:'smooth'}), 50);
      if (route === 'contact') setTimeout(()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}), 50);
    });
  });
}

// --- Initial Mount ---
document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  mount(renderHome()); 
});
