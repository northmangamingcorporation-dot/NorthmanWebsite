// Helper: mount HTML
function mount(html) {
  document.getElementById("root").innerHTML = html;
  attachActions(); // wire up buttons/links after mounting
}

/* --- HTML templates --- */
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
      <section class="hero">
        <h1>Welcome to Northman Gaming Corporation (NGC)</h1>
        <p class="lead">Providing premier gaming services under the Philippine Charity Sweepstakes Office (PCSO) in Davao del Norte, committed to quality, innovation, and community growth.</p>
        <div style="margin-top:14px;">
          <button class="btn" id="getStartedBtn">Portal</button>
          <button class="btn secondary" id="learnMoreBtn" style="margin-left:10px;">Learn More</button>
        </div>
      </section>

      <!-- Services Section: Small Town Lottery -->
      <section class="section">
        <h3 style="margin:0; font-size:20px; margin-top:6px;">Our Services</h3>
        <div class="grid-3" style="margin-top:12px;">
          <div class="card">
            <h4>STL Retail Solutions</h4>
            <p>Providing fully managed Small Town Lottery outlets and point-of-sale systems for seamless lottery operations.</p>
          </div>
          <div class="card">
            <h4>Ticket Distribution & Logistics</h4>
            <p>Efficient delivery, inventory management, and secure handling of STL tickets to ensure continuous availability.</p>
          </div>
          <div class="card">
            <h4>Community & Player Support</h4>
            <p>Dedicated support for players and retailers to ensure fair play, quick issue resolution, and responsible gaming awareness.</p>
          </div>
        </div>
      </section>

      <!-- About Us Section -->
      <section class="section">
        <h3 style="margin:0; font-size:20px;">About Us</h3>
        <div class="card" style="margin-top:12px;">
          <p style="margin:0; color:var(--muted)">
            Northman Gaming Corporation (NGC) was established in September 2024 as an Authorized Agent Corporation under the Philippine Charity Sweepstakes Office (PCSO). 
            Our mission is to provide safe, responsible, and innovative gaming experiences while positively impacting the local community in Davao del Norte.
          </p>
        </div>
      </section>

      <!-- Mission, Vision, Values Section -->
      <section class="section alt">
        <h3 style="margin:0; font-size:20px;">Mission, Vision & Core Values</h3>
        <div class="grid-3" style="margin-top:12px;">
          <div class="card">
            <h4>Mission</h4>
            <p>To provide exceptional gaming experiences while fostering community growth and responsible gaming practices in Davao del Norte.</p>
          </div>
          <div class="card">
            <h4>Vision</h4>
            <p>To become the leading gaming corporation in Davao del Norte, recognized for quality service, innovation, and community engagement.</p>
          </div>
          <div class="card">
            <h4>Core Values</h4>
            <p>Transparency, Responsibility, Unity, Service Excellence, and Trustworthiness guide everything we do at NGC.</p>
          </div>
        </div>
      </section>

      <div class="footer">© ${new Date().getFullYear()} Northman Gaming Corporation — All rights reserved.</div>
    </div>
  `;
}

/* --- event wiring --- */
function attachActions() {
  // const gs = document.getElementById("getStartedBtn");
  // if (gs) gs.addEventListener("click", () => window.mountLogin());

  const learn = document.getElementById("learnMoreBtn");
  if (learn) learn.addEventListener("click", () => {
    const services = document.querySelector(".section");
    if (services) services.scrollIntoView({ behavior: "smooth" });
  });

  const back = document.getElementById("backBtn");
  if (back) back.addEventListener("click", () => mount(renderHome()));

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

/* --- initial mount --- */
document.addEventListener("DOMContentLoaded", () => {
  mount(renderHome()); // initial page
});
