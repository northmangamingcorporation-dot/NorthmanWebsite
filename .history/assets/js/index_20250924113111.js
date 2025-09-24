// Enhanced NGC Main Page - index.js (Complete Updated File with All Fixes)
// (Fixed logo paths, navigation bug, CSS issues, localStorage, and enhanced error handling)

const LOGO_PATH = 'assets/images/main_logo.jpg'; // Centralized path config

// Enhanced Helper: mount HTML with unique styling and error handling
function mount(html) {
  try {
    let root = document.getElementById("root");

    // Create root if missing
    if (!root) {
      console.warn("Root element (#root) not found. Creating fallback.");
      root = document.createElement("div");
      root.id = "root";
      document.body.appendChild(root);
    }

    // Inject HTML
    root.innerHTML = html;

    // Wire up page
    if (typeof injectMainPageStyles === "function") injectMainPageStyles();
    if (typeof attachActions === "function") attachActions();

    // Preload images
    if (typeof preloadNGCImages === "function") preloadNGCImages();

    console.log("NGC page mounted successfully.");
  } catch (error) {
    console.error("Error mounting NGC page:", error);

    // Show modal or fallback alert
    if (window.Modal && typeof window.Modal.show === "function") {
      window.Modal.show("Failed to load page. Please refresh.", false);
    } else {
      alert("Failed to load page. Please refresh.");
    }
  }
}

/* --- Enhanced HTML templates with unique classes and ARIA --- */
function renderNav() {
  return `
    <nav class="ngc-nav ngc-container" role="navigation" aria-label="Main navigation">
      <div class="ngc-brand">
        <div class="ngc-logo-container">
          <img src="${LOGO_PATH}" alt="Northman Gaming Corporation Logo" class="ngc-logo-img" loading="lazy" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; console.warn('Nav logo failed to load. Check if file exists at ${LOGO_PATH}');" />
          <div class="ngc-logo-fallback" style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, var(--ngc-primary), var(--ngc-primary-dark)); color: white; border-radius: 50%;">
            <i class="fas fa-gamepad" style="font-size: 1.5rem;"></i>
          </div>
        </div>
        <div class="ngc-brand-text">
          <span class="ngc-brand-name">Northman Gaming Corporation</span>
          <span class="ngc-brand-tagline">Gaming Excellence Since 2024</span>
        </div>
      </div>
      <ul class="ngc-nav-menu" role="menubar">
        <li class="ngc-nav-item" role="none">
          <a href="#home" data-route="home" class="ngc-nav-link active" role="menuitem" aria-current="page">
            <i class="fas fa-home ngc-nav-icon" aria-hidden="true"></i>
            <span>Home</span>
          </a>
        </li>
        <li class="ngc-nav-item" role="none">
          <a href="#services" data-route="services" class="ngc-nav-link" role="menuitem">
            <i class="fas fa-cogs ngc-nav-icon" aria-hidden="true"></i>
            <span>Services</span>
          </a>
        </li>
        <li class="ngc-nav-item" role="none">
          <a href="#about" data-route="about" class="ngc-nav-link" role="menuitem">  <!-- FIXED: data-route="about" -->
            <i class="fas fa-info-circle ngc-nav-icon" aria-hidden="true"></i>
            <span>About</span>
          </a>
        </li>
        <li class="ngc-nav-item" role="none">
          <a href="#contact" data-route="contact" class="ngc-nav-link" role="menuitem">
            <i class="fas fa-envelope ngc-nav-icon" aria-hidden="true"></i>
            <span>Contact</span>
          </a>
        </li>
      </ul>
      <div class="ngc-nav-mobile-toggle" id="mobileMenuToggle" aria-label="Toggle mobile menu" role="button" tabindex="0">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  `;
}

function renderHome() {
  return `
    ${renderNav()}
    <main class="ngc-main-container" role="main">
      <!-- Enhanced Hero Section with ARIA -->
      <section class="ngc-hero" aria-labelledby="hero-title">
        <div class="ngc-hero-background">
          <div class="ngc-hero-overlay"></div>
          <div class="ngc-hero-pattern"></div>
        </div>
        
        <div class="ngc-hero-content">
          <div class="ngc-hero-badge">
            <i class="fas fa-certificate" aria-hidden="true"></i>
            <span>PCSO Authorized Agent</span>
          </div>
          
          <h1 id="hero-title" class="ngc-hero-title">
            Welcome to 
            <span class="ngc-hero-highlight">Northman Gaming Corporation</span>
          </h1>
          
          <p class="ngc-hero-subtitle">
            Providing premier gaming services under the Philippine Charity Sweepstakes Office (PCSO) in Davao del Norte, 
            committed to quality, innovation, and community growth.
          </p>
          
          <div class="ngc-hero-stats" role="list">
            <div class="ngc-stat-item" role="listitem">
              <div class="ngc-stat-number" aria-label="Established in 2024">2024</div>
              <div class="ngc-stat-label">Established</div>
            </div>
            <div class="ngc-stat-item" role="listitem">
              <div class="ngc-stat-number" aria-label="100% PCSO Compliant">100%</div>
              <div class="ngc-stat-label">PCSO Compliant</div>
            </div>
            <div class="ngc-stat-item" role="listitem">
              <div class="ngc-stat-number" aria-label="24/7 Support">24/7</div>
              <div class="ngc-stat-label">Support</div>
            </div>
          </div>
          
          <div class="ngc-hero-actions">
            <button class="ngc-btn ngc-btn-primary" id="getStartedBtn" aria-label="Access the employee portal">
              <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
              <span>Access Portal</span>
            </button>
            <button class="ngc-btn ngc-btn-secondary" id="learnMoreBtn" aria-label="Learn more about our services">
              <i class="fas fa-info-circle" aria-hidden="true"></i>
              <span>Learn More</span>
            </button>
          </div>
          
          <div class="ngc-hero-scroll-indicator" role="img" aria-label="Scroll down to explore">
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      <!-- Enhanced Services Section -->
      <section class="ngc-section ngc-services-section" id="services" aria-labelledby="services-title">
        <div class="ngc-section-header">
          <div class="ngc-section-badge">
            <i class="fas fa-star" aria-hidden="true"></i>
            <span>Our Services</span>
          </div>
          <h2 id="services-title" class="ngc-section-title">Comprehensive Gaming Solutions</h2>
          <p class="ngc-section-description">
            We provide end-to-end gaming solutions designed to deliver exceptional experiences 
            while maintaining the highest standards of compliance and community responsibility.
          </p>
        </div>
        
        <div class="ngc-services-grid">
          <article class="ngc-service-card" role="article">
            <div class="ngc-service-icon">
              <i class="fas fa-store" aria-hidden="true"></i>
            </div>
            <div class="ngc-service-content">
              <h3 class="ngc-service-title">STL Retail Solutions</h3>
              <p class="ngc-service-description">
                Providing fully managed Small Town Lottery outlets and point-of-sale systems 
                for seamless lottery operations with real-time reporting and analytics.
              </p>
              <ul class="ngc-service-features" role="list">
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Modern POS Systems</li>
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Real-time Reporting</li>
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Compliance Management</li>
              </ul>
            </div>
            <div class="ngc-service-overlay"></div>
          </article>
          
          <article class="ngc-service-card" role="article">
            <div class="ngc-service-icon">
              <i class="fas fa-truck" aria-hidden="true"></i>
            </div>
            <div class="ngc-service-content">
              <h3 class="ngc-service-title">Ticket Distribution & Logistics</h3>
              <p class="ngc-service-description">
                Efficient delivery, inventory management, and secure handling of STL tickets 
                to ensure continuous availability across all retail locations.
              </p>
              <ul class="ngc-service-features" role="list">
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Secure Transportation</li>
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Inventory Tracking</li>
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Automated Restocking</li>
              </ul>
            </div>
            <div class="ngc-service-overlay"></div>
          </article>
          
          <article class="ngc-service-card" role="article">
            <div class="ngc-service-icon">
              <i class="fas fa-users" aria-hidden="true"></i>
            </div>
            <div class="ngc-service-content">
              <h3 class="ngc-service-title">Community & Player Support</h3>
              <p class="ngc-service-description">
                Dedicated support for players and retailers to ensure fair play, 
                quick issue resolution, and responsible gaming awareness programs.
              </p>
              <ul class="ngc-service-features" role="list">
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> 24/7 Customer Support</li>
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Responsible Gaming Programs</li>
                <li role="listitem"><i class="fas fa-check" aria-hidden="true"></i> Community Outreach</li>
              </ul>
            </div>
            <div class="ngc-service-overlay"></div>
          </article>
        </div>
      </section>

      <!-- Enhanced About Us Section -->
      <section class="ngc-section ngc-about-section" id="about" aria-labelledby="about-title">
        <div class="ngc-about-grid">
          <div class="ngc-about-content">
            <div class="ngc-section-badge">
              <i class="fas fa-building" aria-hidden="true"></i>
              <span>About NGC</span>
            </div>
            <h2 id="about-title" class="ngc-section-title">Building Trust Through Excellence</h2>
            <div class="ngc-about-text">
              <p>
                Northman Gaming Corporation (NGC) was established in September 2024 as an 
                Authorized Agent Corporation under the Philippine Charity Sweepstakes Office (PCSO). 
              </p>
              <p>
                Our mission is to provide safe, responsible, and innovative gaming experiences 
                while positively impacting the local community in Davao del Norte through 
                sustainable business practices and community engagement initiatives.
              </p>
            </div>
            
            <div class="ngc-about-highlights" role="list">
              <div class="ngc-highlight-item" role="listitem">
                <div class="ngc-highlight-icon">
                  <i class="fas fa-certificate" aria-hidden="true"></i>
                </div>
                <div class="ngc-highlight-content">
                  <h4>PCSO Authorized</h4>
                  <p>Fully licensed and compliant with all regulatory requirements</p>
                </div>
              </div>
              
              <div class="ngc-highlight-item" role="listitem">
                <div class="ngc-highlight-icon">
                  <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                </div>
                <div class="ngc-highlight-content">
                  <h4>Davao del Norte</h4>
                  <p>Proudly serving the local community with dedication</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ngc-about-visual">
            <div class="ngc-about-image-container">
              <div class="ngc-about-image-placeholder">
                <i class="fas fa-building" aria-hidden="true"></i>
                <p>NGC Headquarters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Mission