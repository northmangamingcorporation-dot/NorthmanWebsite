// Simple renderer that returns HTML strings and injects into #root
import { renderDashboard } from "../pages/dashboard.js";  // note export in dashboard.js

// Helper: mount HTML
function mount(html) {
  document.getElementById("root").innerHTML = html;
  attachActions(); // wire up buttons/links after mounting
}

/* --- HTML templates --- */
function renderNav() {
  return `
    <div class="nav container" role="navigation">
      <div class="brand">Northman Gaming</div>
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
      <section class="hero">
        <h1>Welcome to Northman Gaming Corporation</h1>
        <p class="lead">Empowering clients with modern gaming platforms, esports partnerships, and tailored digital entertainment solutions.</p>
        <div style="margin-top:14px;">
          <button class="btn" id="getStartedBtn">Get Started</button>
          <button class="btn secondary" id="learnMoreBtn" style="margin-left:10px;">Learn More</button>
        </div>
      </section>

      <section class="section">
        <h3 style="margin:0; font-size:20px; margin-top:6px;">Our Services</h3>
        <div class="grid-3" style="margin-top:12px;">
          <div class="card"><h4>Gaming Solutions</h4><p>Custom platforms, APIs and tools for game publishers and operators.</p></div>
          <div class="card"><h4>Esports Partnerships</h4><p>Event & team collaborations, sponsorship activations and tournament ops.</p></div>
          <div class="card"><h4>Client Support</h4><p>Dedicated account & technical support to keep your service running smoothly.</p></div>
        </div>
      </section>

      <section class="section">
        <h3 style="margin:0; font-size:20px;">About Us</h3>
        <div class="card" style="margin-top:12px;">
          <p style="margin:0; color:var(--muted)">Northman Gaming Corporation focuses on innovation, community growth, and scalable entertainment solutions for our clients worldwide.</p>
        </div>
      </section>

      <div class="footer">© ${new Date().getFullYear()} Northman Gaming Corporation — All rights reserved.</div>
    </div>
  `;
}

/* --- event wiring --- */
function attachActions() {
  // Get Started -> show dashboard
  const gs = document.getElementById("getStartedBtn");
  if (gs) gs.addEventListener("click", () => mount(renderDashboard()));

  // Learn More anchors -> smooth scroll to sections on the same page
  const learn = document.getElementById("learnMoreBtn");
  if (learn) learn.addEventListener("click", () => {
    // In single-page simple setup we just scroll to services section
    const services = document.querySelector(".section");
    if (services) services.scrollIntoView({ behavior: "smooth" });
  });

  // Back to Site (from dashboard)
  const back = document.getElementById("backBtn");
  if (back) back.addEventListener("click", () => mount(renderHome()));

  // Nav links: route to home or scroll to anchors (simple)
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.getAttribute('data-route');
      if (route === 'home') mount(renderHome());
      else if (route === 'services') {
        // ensure home is mounted then scroll to services
        mount(renderHome());
        setTimeout(()=> {
          const node = document.querySelector('.section');
          if (node) node.scrollIntoView({behavior:'smooth'});
        }, 50);
      } else if (route === 'about') {
        mount(renderHome());
        setTimeout(()=> {
          const node = document.querySelector('#about');
          if (node) node.scrollIntoView({behavior:'smooth'});
        }, 50);
      } else if (route === 'contact') {
        mount(renderHome());
        setTimeout(()=> {
          const node = document.querySelector('#contact');
          if (node) node.scrollIntoView({behavior:'smooth'});
        }, 50);
      } else {
        // other dashboard routes could be processed here
      }
    });
  });
}

/* --- initial mount --- */
document.addEventListener("DOMContentLoaded", () => {
  mount(renderHome());
});

