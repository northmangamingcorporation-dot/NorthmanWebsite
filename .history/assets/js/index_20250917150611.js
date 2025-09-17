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
      ...
    </div>
  `;
}

/* --- event wiring --- */
function attachActions() {
  const gs = document.getElementById("getStartedBtn");
  if (gs) gs.addEventListener("click", () => mount(window.renderDashboard()));

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
