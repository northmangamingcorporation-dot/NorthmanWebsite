// Enhanced NGC Main Page - assets/js/main.js (or similar)

// Enhanced Helper: mount HTML with unique styling and error handling
function mount(html) {
  try {
    const root = document.getElementById("root");
    if (!root) {
      console.error("Root element (#root) not found. Creating fallback.");
      const fallbackRoot = document.createElement("div");
      fallbackRoot.id = "root";
      document.body.appendChild(fallbackRoot);
    }
    
    document.getElementById("root").innerHTML = html;
    injectMainPageStyles(); // Inject unique styles for main page
    attachActions(); // Wire up buttons/links after mounting
    
    // Preload images after mount for better performance
    preloadNGCImages();
    
    console.log("NGC page mounted successfully.");
  } catch (error) {
    console.error("Error mounting NGC page:", error);
    if (window.Modal && window.Modal.show) {
      window.Modal.show("Failed to load page. Please refresh.", "error");
    } else {
      alert("Failed to load page. Please refresh.");
    }
    // Fallback to basic home
    document.getElementById("root").innerHTML = "<h1>Welcome to NGC</h1><p>Loading...</p>";
  }
}

/* --- Enhanced HTML templates with unique classes and ARIA --- */
function renderNav() {
  return `
    <nav class="ngc-nav ngc-container" role="navigation" aria-label="Main navigation">
      <div class="ngc-brand">
        <div class="ngc-logo-container">
          <img src="assets/images/main_logo.jpg" alt="Northman Gaming Corporation Logo" class="ngc-logo-img" loading="lazy" />
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
          <a href="#about" data-route="about" class="ngc-nav-link" role="menuitem">
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

      <!-- Enhanced Mission, Vision, Values Section -->
      <section class="ngc-section ngc-values-section" aria-labelledby="values-title">
        <div class="ngc-section-header">
          <div class="ngc-section-badge">
            <i class="fas fa-compass" aria-hidden="true"></i>
            <span>Our Foundation</span>
          </div>
          <h2 id="values-title" class="ngc-section-title">Mission, Vision & Core Values</h2>
          <p class="ngc-section-description">
            These guiding principles shape our decisions, drive our innovations, 
            and define our commitment to excellence in everything we do.
          </p>
        </div>
        
        <div class="ngc-values-grid">
          <article class="ngc-value-card ngc-mission-card" role="article">
            <div class="ngc-value-header">
              <div class="ngc-value-icon">
                <i class="fas fa-bullseye" aria-hidden="true"></i>
              </div>
              <h3 class="ngc-value-title">Our Mission</h3>
            </div>
            <div class="ngc-value-content">
              <p>
                To provide exceptional gaming experiences while fostering community growth 
                and responsible gaming practices in Davao del Norte, ensuring sustainable 
                benefits for all stakeholders.
              </p>
            </div>
            <div class="ngc-value-footer">
              <span class="ngc-value-tag">Purpose Driven</span>
            </div>
          </article>
          
          <article class="ngc-value-card ngc-vision-card" role="article">
            <div class="ngc-value-header">
              <div class="ngc-value-icon">
                <i class="fas fa-eye" aria-hidden="true"></i>
              </div>
              <h3 class="ngc-value-title">Our Vision</h3>
            </div>
            <div class="ngc-value-content">
              <p>
                To become the leading gaming corporation in Davao del Norte, recognized 
                for quality service, innovation, and community engagement while setting 
                industry standards for responsible gaming.
              </p>
            </div>
            <div class="ngc-value-footer">
              <span class="ngc-value-tag">Future Focused</span>
            </div>
          </article>
          
          <article class="ngc-value-card ngc-values-card" role="article">
            <div class="ngc-value-header">
              <div class="ngc-value-icon">
                <i class="fas fa-heart" aria-hidden="true"></i>
              </div>
              <h3 class="ngc-value-title">Core Values</h3>
            </div>
            <div class="ngc-value-content">
              <div class="ngc-core-values-list" role="list">
                <div class="ngc-core-value-item" role="listitem">
                  <i class="fas fa-shield-alt" aria-hidden="true"></i>
                  <span>Transparency</span>
                </div>
                <div class="ngc-core-value-item" role="listitem">
                  <i class="fas fa-balance-scale" aria-hidden="true"></i>
                  <span>Responsibility</span>
                </div>
                <div class="ngc-core-value-item" role="listitem">
                  <i class="fas fa-handshake" aria-hidden="true"></i>
                  <span>Unity</span>
                </div>
                <div class="ngc-core-value-item" role="listitem">
                  <i class="fas fa-star" aria-hidden="true"></i>
                  <span>Service Excellence</span>
                </div>
                <div class="ngc-core-value-item" role="listitem">
                  <i class="fas fa-award" aria-hidden="true"></i>
                  <span>Trustworthiness</span>
                </div>
              </div>
            </div>
            <div class="ngc-value-footer">
              <span class="ngc-value-tag">Values Driven</span>
            </div>
          </article>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="ngc-section ngc-contact-section" id="contact" aria-labelledby="contact-title">
        <div class="ngc-contact-container">
          <div class="ngc-contact-info">
            <div class="ngc-section-badge">
              <i class="fas fa-phone" aria-hidden="true"></i>
              <span>Get In Touch</span>
            </div>
            <h2 id="contact-title" class="ngc-section-title">Contact Us</h2>
            <p class="ngc-contact-description">
              Ready to get started? Have questions about our services? 
              We're here to help you every step of the way.
            </p>
            
            <div class="ngc-contact-methods" role="list">
              <div class="ngc-contact-method" role="listitem">
                <div class="ngc-contact-icon">
                  <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                </div>
                <div class="ngc-contact-details">
                  <h4>Our Location</h4>
                  <p>Davao del Norte, Philippines</p>
                </div>
              </div>
              
              <div class="ngc-contact-method" role="listitem">
                <div class="ngc-contact-icon">
                  <i class="fas fa-clock" aria-hidden="true"></i>
                </div>
                <div class="ngc-contact-details">
                  <h4>Business Hours</h4>
                  <p>Monday - Sunday<br>24/7 Support Available</p>
                </div>
              </div>
              
              <div class="ngc-contact-method" role="listitem">
                <div class="ngc-contact-icon">
                  <i class="fas fa-shield-alt" aria-hidden="true"></i>
                </div>
                <div class="ngc-contact-details">
                  <h4>PCSO Compliance</h4>
                  <p>Fully licensed and regulated</