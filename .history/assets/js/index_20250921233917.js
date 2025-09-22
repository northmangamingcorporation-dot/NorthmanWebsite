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
        <p class="lead">An Authorized Agent Corporation under the Philippine Charity Sweepstakes Office (PCSO), delivering premier gaming services in Davao del Norte since September 2024.</p>
        <div style="margin-top:14px;">
          <button class="btn" id="getStartedBtn">Portal</button>
          <button class="btn secondary" id="learnMoreBtn" style="margin-left:10px;">Learn More</button>
        </div>
      </section>

      <section class="section">
        <h3 style="margin:0; font-size:20px;">Pangkalahatang-ideya</h3>
        <div class="card" style="margin-top:12px;">
          <p>Northman Gaming Corporation (NGC) was established in September 2024 under the auspices of the Philippine Charity Sweepstakes Office (PCSO). 
          As an authorized Agent Corporation (AAC), NGC is committed to providing premier gaming services in Davao del Norte, 
          delivering exceptional quality to its customers and contributing positively to the local community.</p>
        </div>
      </section>

      <section class="section">
        <h3 style="margin:0; font-size:20px;">Our Mission</h3>
        <div class="card" style="margin-top:12px;">
          <p>NGC is dedicated to providing exceptional gaming experiences while fostering a sense of community through responsible gaming practices and community service. 
          Our mission is to ensure a safe and enjoyable gaming environment that supports both the entertainment and philanthropic goals of our patrons.</p>
        </div>
      </section>

      <section class="section">
        <h3 style="margin:0; font-size:20px;">Our Vision</h3>
        <div class="card" style="margin-top:12px;">
          <p>Our vision is to become the leading gaming corporation in Davao del Norte, renowned for our commitment to quality service and community engagement. 
          We aim to set the standard in the gaming industry for innovation, integrity, and community involvement.</p>
        </div>
      </section>

      <section class="section">
        <h3 style="margin:0; font-size:20px;">Our Core Values: 𝐓.𝐑.𝐔.𝐒.𝐓.</h3>
        <div class="grid-2" style="margin-top:12px; gap:16px;">
          <div class="card"><strong>Transparency</strong><p>We operate with openness and honesty in all our business dealings.</p></div>
          <div class="card"><strong>Responsibility</strong><p>We are committed to responsible gaming practices, ensuring the well-being of our customers and community.</p></div>
          <div class="card"><strong>Unity</strong><p>We foster strong relationships within our team and communities we serve.</p></div>
          <div class="card"><strong>Service Excellence</strong><p>We are dedicated to providing the highest level of service to our customers.</p></div>
          <div class="card"><strong>Trustworthiness</strong><p>We strive to earn and maintain the trust of colleagues, customers, and partners.</p></div>
        </div>
      </section>

      <div class="footer">© ${new Date().getFullYear()} Northman Gaming Corporation — All rights reserved.</div>
    </div>
  `;
}

/* --- event wiring --- */
function attachActions() {
  const gs = document.getElementById("getStartedBtn");
  if (gs) gs.addEventListener("click", () => window.mountLogin());

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
