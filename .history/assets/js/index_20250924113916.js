// Enhanced Helper: mount HTML with unique styling
function mount(html) {
  document.getElementById("root").innerHTML = html;
  injectMainPageStyles(); // Inject unique styles for main page
  attachActions(); // wire up buttons/links after mounting
}

/* --- Enhanced HTML templates with unique classes --- */
function renderNav() {
  return `
    <nav class="ngc-nav ngc-container" role="navigation">
      <div class="ngc-brand">
        <div class="ngc-logo-container">
          <img src="assets/images/main_logo.jpg" alt="NGC Logo" class="ngc-logo-img" />
        </div>
        <div class="ngc-brand-text">
          <span class="ngc-brand-name">Northman Gaming Corporation</span>
          <span class="ngc-brand-tagline">Gaming Excellence Since 2024</span>
        </div>
      </div>
      <ul class="ngc-nav-menu">
        <li class="ngc-nav-item">
          <a href="#home" data-route="home" class="ngc-nav-link active">
            <i class="fas fa-home ngc-nav-icon"></i>
            <span>Home</span>
          </a>
        </li>
        <li class="ngc-nav-item">
          <a href="#services" data-route="services" class="ngc-nav-link">
            <i class="fas fa-cogs ngc-nav-icon"></i>
            <span>Services</span>
          </a>
        </li>
        <li class="ngc-nav-item">
          <a href="#about" data-route="about" class="ngc-nav-link">
            <i class="fas fa-info-circle ngc-nav-icon"></i>
            <span>About</span>
          </a>
        </li>
        <li class="ngc-nav-item">
          <a href="#contact" data-route="contact" class="ngc-nav-link">
            <i class="fas fa-envelope ngc-nav-icon"></i>
            <span>Contact</span>
          </a>
        </li>
      </ul>
      <div class="ngc-nav-mobile-toggle" id="mobileMenuToggle">
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
    <div class="ngc-main-container">
      <!-- Enhanced Hero Section -->
      <section class="ngc-hero">
        <div class="ngc-hero-background">
          <div class="ngc-hero-overlay"></div>
          <div class="ngc-hero-pattern"></div>
        </div>
        
        <div class="ngc-hero-content">
          <div class="ngc-hero-badge">
            <i class="fas fa-certificate"></i>
            <span>PCSO Authorized Agent</span>
          </div>
          
          <h1 class="ngc-hero-title">
            Welcome to 
            <span class="ngc-hero-highlight">Northman Gaming Corporation</span>
          </h1>
          
          <p class="ngc-hero-subtitle">
            Providing premier gaming services under the Philippine Charity Sweepstakes Office (PCSO) in Davao del Norte, 
            committed to quality, innovation, and community growth.
          </p>
          
          <div class="ngc-hero-stats">
            <div class="ngc-stat-item">
              <div class="ngc-stat-number">2024</div>
              <div class="ngc-stat-label">Established</div>
            </div>
            <div class="ngc-stat-item">
              <div class="ngc-stat-number">100%</div>
              <div class="ngc-stat-label">PCSO Compliant</div>
            </div>
            <div class="ngc-stat-item">
              <div class="ngc-stat-number">24/7</div>
              <div class="ngc-stat-label">Support</div>
            </div>
          </div>
          
          <div class="ngc-hero-actions">
            <button class="ngc-btn ngc-btn-primary" id="getStartedBtn">
              <i class="fas fa-sign-in-alt"></i>
              <span>Access Portal</span>
            </button>
            <button class="ngc-btn ngc-btn-secondary" id="learnMoreBtn">
              <i class="fas fa-info-circle"></i>
              <span>Learn More</span>
            </button>
          </div>
          
          <div class="ngc-hero-scroll-indicator">
            <i class="fas fa-chevron-down"></i>
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      <!-- Enhanced Services Section -->
      <section class="ngc-section ngc-services-section" id="services">
        <div class="ngc-section-header">
          <div class="ngc-section-badge">
            <i class="fas fa-star"></i>
            <span>Our Services</span>
          </div>
          <h2 class="ngc-section-title">Comprehensive Gaming Solutions</h2>
          <p class="ngc-section-description">
            We provide end-to-end gaming solutions designed to deliver exceptional experiences 
            while maintaining the highest standards of compliance and community responsibility.
          </p>
        </div>
        
        <div class="ngc-services-grid">
          <div class="ngc-service-card">
            <div class="ngc-service-icon">
              <i class="fas fa-store"></i>
            </div>
            <div class="ngc-service-content">
              <h3 class="ngc-service-title">STL Retail Solutions</h3>
              <p class="ngc-service-description">
                Providing fully managed Small Town Lottery outlets and point-of-sale systems 
                for seamless lottery operations with real-time reporting and analytics.
              </p>
              <ul class="ngc-service-features">
                <li><i class="fas fa-check"></i> Modern POS Systems</li>
                <li><i class="fas fa-check"></i> Real-time Reporting</li>
                <li><i class="fas fa-check"></i> Compliance Management</li>
              </ul>
            </div>
            <div class="ngc-service-overlay"></div>
          </div>
          
          <div class="ngc-service-card">
            <div class="ngc-service-icon">
              <i class="fas fa-truck"></i>
            </div>
            <div class="ngc-service-content">
              <h3 class="ngc-service-title">Ticket Distribution & Logistics</h3>
              <p class="ngc-service-description">
                Efficient delivery, inventory management, and secure handling of STL tickets 
                to ensure continuous availability across all retail locations.
              </p>
              <ul class="ngc-service-features">
                <li><i class="fas fa-check"></i> Secure Transportation</li>
                <li><i class="fas fa-check"></i> Inventory Tracking</li>
                <li><i class="fas fa-check"></i> Automated Restocking</li>
              </ul>
            </div>
            <div class="ngc-service-overlay"></div>
          </div>
          
          <div class="ngc-service-card">
            <div class="ngc-service-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="ngc-service-content">
              <h3 class="ngc-service-title">Community & Player Support</h3>
              <p class="ngc-service-description">
                Dedicated support for players and retailers to ensure fair play, 
                quick issue resolution, and responsible gaming awareness programs.
              </p>
              <ul class="ngc-service-features">
                <li><i class="fas fa-check"></i> 24/7 Customer Support</li>
                <li><i class="fas fa-check"></i> Responsible Gaming Programs</li>
                <li><i class="fas fa-check"></i> Community Outreach</li>
              </ul>
            </div>
            <div class="ngc-service-overlay"></div>
          </div>
        </div>
      </section>

      <!-- Enhanced About Us Section -->
      <section class="ngc-section ngc-about-section" id="about">
        <div class="ngc-about-grid">
          <div class="ngc-about-content">
            <div class="ngc-section-badge">
              <i class="fas fa-building"></i>
              <span>About NGC</span>
            </div>
            <h2 class="ngc-section-title">Building Trust Through Excellence</h2>
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
            
            <div class="ngc-about-highlights">
              <div class="ngc-highlight-item">
                <div class="ngc-highlight-icon">
                  <i class="fas fa-certificate"></i>
                </div>
                <div class="ngc-highlight-content">
                  <h4>PCSO Authorized</h4>
                  <p>Fully licensed and compliant with all regulatory requirements</p>
                </div>
              </div>
              
              <div class="ngc-highlight-item">
                <div class="ngc-highlight-icon">
                  <i class="fas fa-map-marker-alt"></i>
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
                <i class="fas fa-building"></i>
                <p>NGC Headquarters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Mission, Vision, Values Section -->
      <section class="ngc-section ngc-values-section">
        <div class="ngc-section-header">
          <div class="ngc-section-badge">
            <i class="fas fa-compass"></i>
            <span>Our Foundation</span>
          </div>
          <h2 class="ngc-section-title">Mission, Vision & Core Values</h2>
          <p class="ngc-section-description">
            These guiding principles shape our decisions, drive our innovations, 
            and define our commitment to excellence in everything we do.
          </p>
        </div>
        
        <div class="ngc-values-grid">
          <div class="ngc-value-card ngc-mission-card">
            <div class="ngc-value-header">
              <div class="ngc-value-icon">
                <i class="fas fa-bullseye"></i>
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
          </div>
          
          <div class="ngc-value-card ngc-vision-card">
            <div class="ngc-value-header">
              <div class="ngc-value-icon">
                <i class="fas fa-eye"></i>
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
          </div>
          
          <div class="ngc-value-card ngc-values-card">
            <div class="ngc-value-header">
              <div class="ngc-value-icon">
                <i class="fas fa-heart"></i>
              </div>
              <h3 class="ngc-value-title">Core Values</h3>
            </div>
            <div class="ngc-value-content">
              <div class="ngc-core-values-list">
                <div class="ngc-core-value-item">
                  <i class="fas fa-shield-alt"></i>
                  <span>Transparency</span>
                </div>
                <div class="ngc-core-value-item">
                  <i class="fas fa-balance-scale"></i>
                  <span>Responsibility</span>
                </div>
                <div class="ngc-core-value-item">
                  <i class="fas fa-handshake"></i>
                  <span>Unity</span>
                </div>
                <div class="ngc-core-value-item">
                  <i class="fas fa-star"></i>
                  <span>Service Excellence</span>
                </div>
                <div class="ngc-core-value-item">
                  <i class="fas fa-award"></i>
                  <span>Trustworthiness</span>
                </div>
              </div>
            </div>
            <div class="ngc-value-footer">
              <span class="ngc-value-tag">Values Driven</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="ngc-section ngc-contact-section" id="contact">
        <div class="ngc-contact-container">
          <div class="ngc-contact-info">
            <div class="ngc-section-badge">
              <i class="fas fa-phone"></i>
              <span>Get In Touch</span>
            </div>
            <h2 class="ngc-section-title">Contact Us</h2>
            <p class="ngc-contact-description">
              Ready to get started? Have questions about our services? 
              We're here to help you every step of the way.
            </p>
            
            <div class="ngc-contact-methods">
              <div class="ngc-contact-method">
                <div class="ngc-contact-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="ngc-contact-details">
                  <h4>Our Location</h4>
                  <p>Davao del Norte, Philippines</p>
                </div>
              </div>
              
              <div class="ngc-contact-method">
                <div class="ngc-contact-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="ngc-contact-details">
                  <h4>Business Hours</h4>
                  <p>Monday - Sunday<br>24/7 Support Available</p>
                </div>
              </div>
              
              <div class="ngc-contact-method">
                <div class="ngc-contact-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="ngc-contact-details">
                  <h4>PCSO Compliance</h4>
                  <p>Fully licensed and regulated</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ngc-contact-cta">
            <div class="ngc-cta-card">
              <h3>Ready to Get Started?</h3>
              <p>Access our secure portal to manage your gaming operations</p>
              <button class="ngc-btn ngc-btn-primary" id="contactPortalBtn">
                <i class="fas fa-rocket"></i>
                <span>Access Portal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Footer -->
      <footer class="ngc-footer">
        <div class="ngc-footer-content">
          <div class="ngc-footer-brand">
            <div class="ngc-footer-logo">
              <img src="assets/images/main_logo.jpg" alt="NGC Logo" />
            </div>
            <div class="ngc-footer-info">
              <h4>Northman Gaming Corporation</h4>
              <p>PCSO Authorized Agent Corporation</p>
              <div class="ngc-footer-badges">
                <span class="ngc-footer-badge">
                  <i class="fas fa-certificate"></i>
                  PCSO Licensed
                </span>
                <span class="ngc-footer-badge">
                  <i class="fas fa-shield-alt"></i>
                  Secure & Compliant
                </span>
              </div>
            </div>
          </div>
          
          <div class="ngc-footer-links">
            <div class="ngc-footer-section">
              <h5>Quick Links</h5>
              <ul>
                <li><a href="#home" data-route="home">Home</a></li>
                <li><a href="#services" data-route="services">Services</a></li>
                <li><a href="#about" data-route="about">About</a></li>
                <li><a href="#contact" data-route="contact">Contact</a></li>
              </ul>
            </div>
            
            <div class="ngc-footer-section">
              <h5>Services</h5>
              <ul>
                <li>STL Retail Solutions</li>
                <li>Distribution & Logistics</li>
                <li>Community Support</li>
                <li>Compliance Management</li>
              </ul>
            </div>
            
            <div class="ngc-footer-section">
              <h5>Company</h5>
              <ul>
                <li>About NGC</li>
                <li>Our Mission</li>
                <li>Core Values</li>
                <li>Career Opportunities</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="ngc-footer-bottom">
          <div class="ngc-footer-copyright">
            <p>© ${new Date().getFullYear()} Northman Gaming Corporation. All rights reserved.</p>
            <p class="ngc-footer-disclaimer">
              Licensed by PCSO. Gamble responsibly. Must be 18 years or older.
            </p>
          </div>
          
          <div class="ngc-footer-social">
            <span>Follow us:</span>
            <div class="ngc-social-links">
              <a href="#" class="ngc-social-link">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="#" class="ngc-social-link">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="ngc-social-link">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="ngc-social-link">
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}

/* --- Enhanced event wiring with unique identifiers --- */
function attachActions() {
  // Enhanced Get Started Button
  const getStartedBtn = document.getElementById("getStartedBtn");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      // Add loading state
      getStartedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
      getStartedBtn.disabled = true;
      
      setTimeout(() => {
        window.mountLogin();
        getStartedBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Access Portal</span>';
        getStartedBtn.disabled = false;
      }, 500);
    });
  }

  // Enhanced Learn More Button with smooth scroll
  const learnMoreBtn = document.getElementById("learnMoreBtn");
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", () => {
      const servicesSection = document.querySelector("#services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest" 
        });
        
        // Add visual feedback
        learnMoreBtn.style.transform = "scale(0.95)";
        setTimeout(() => {
          learnMoreBtn.style.transform = "scale(1)";
        }, 150);
      }
    });
  }

  // Contact Portal Button
  const contactPortalBtn = document.getElementById("contactPortalBtn");
  if (contactPortalBtn) {
    contactPortalBtn.addEventListener("click", () => {
      contactPortalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
      contactPortalBtn.disabled = true;
      
      setTimeout(() => {
        window.mountLogin();
        contactPortalBtn.innerHTML = '<i class="fas fa-rocket"></i><span>Access Portal</span>';
        contactPortalBtn.disabled = false;
      }, 500);
    });
  }

  // Back Button (if exists)
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => mount(renderHome()));
  }

  // Enhanced Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navMenu = document.querySelector(".ngc-nav-menu");
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("ngc-active");
      navMenu.classList.toggle("ngc-mobile-active");
    });
  }

  // Enhanced Navigation with smooth scrolling and active states
  document.querySelectorAll('[data-route]').forEach(navLink => {
    navLink.addEventListener('click', handleNavClick);
  });

  function handleNavClick(e) {
    e.preventDefault();
    const route = e.currentTarget.getAttribute('data-route');
    
    // Update active state
    document.querySelectorAll('.ngc-nav-link').forEach(link => {
      link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Handle navigation
    if (route === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Mount home first, then scroll to section
      mount(renderHome());
      
      setTimeout(() => {
        const targetSection = document.querySelector(`#${route}`);
        if (targetSection) {
          targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
          });
        }
      }, 100);
    }
    
    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('ngc-mobile-active')) {
      mobileMenuToggle.classList.remove('ngc-active');
      navMenu.classList.remove('ngc-mobile-active');
    }
  }

  // Enhanced scroll animations and effects
  initializeScrollAnimations();
  initializeParallaxEffects();
}

// Enhanced scroll animations for better UX
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('ngc-animate-in');
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document.querySelectorAll('.ngc-service-card, .ngc-value-card, .ngc-section-header').forEach(el => {
    observer.observe(el);
  });
}

// Parallax effects for hero section
function initializeParallaxEffects() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.ngc-hero-background');
    const heroContent = document.querySelector('.ngc-hero-content');
    
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  });
}

// Enhanced styles injection with unique class names
function injectMainPageStyles() {
  // Remove existing styles to prevent conflicts
  const existingStyles = document.querySelector('#ngc-main-styles');
  if (existingStyles) {
    existingStyles.remove();
  }

  const style = document.createElement("style");
  style.id = "ngc-main-styles";
  style.textContent = `
    /* NGC Main Page Unique Variables */
    :root {
      --ngc-primary: #3b82f6;
      --ngc-primary-dark: #1d4ed8;
      --ngc-primary-light: #60a5fa;
      --ngc-secondary: #64748b;
      --ngc-accent: #f59e0b;
      --ngc-success: #10b981;
      --ngc-warning: #f59e0b;
      --ngc-error: #ef4444;
      --ngc-background: #ffffff;
      --ngc-surface: #f8fafc;
      --ngc-surface-2: #f1f5f9;
      --ngc-text-primary: #0f172a;
      --ngc-text-secondary: #64748b;
      --ngc-text-muted: #94a3b8;
      --ngc-border: #e2e8f0;
      --ngc-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --ngc-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --ngc-shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      --ngc-radius: 12px;
      --ngc-radius-lg: 16px;
      --ngc-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Base Styles */
    .ngc-main-container {
      min-height: 100vh;
      background: var(--ngc-background);
    }

    /* Enhanced Navigation */
    .ngc-nav {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--ngc-border);
      padding: 16px 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: var(--ngc-transition);
    }

    .ngc-nav.ngc-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ngc-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .ngc-logo-container {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--ngc-primary);
    }

    .ngc-logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ngc-brand-text {
      display: flex;
      flex-direction: column;
    }

    .ngc-brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--ngc-text-primary);
    }

    .ngc-brand-tagline {
      font-size: 0.75rem;
      color: var(--ngc-text-secondary);
      font-weight: 500;
    }

    .ngc-nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 8px;
    }

    .ngc-nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      text-decoration: none;
      color: var(--ngc-text-secondary);
      font-weight: 500;
      border-radius: 8px;
      transition: var(--ngc-transition);
      position: relative;
    }

    .ngc-nav-link:hover,
    .ngc-nav-link.active {
      color: var(--ngc-primary);
      background: rgba(59, 130, 246, 0.1);
    }

    .ngc-nav-icon {
      font-size: 0.9rem;
    }

    .ngc-nav-mobile-toggle {
      display: none;
      flex-direction: column;
      cursor: pointer;
      gap: 4px;
    }

    .ngc-nav-mobile-toggle span {
      width: 24px;
      height: 2px;
      background: var(--ngc-text-primary);
      transition: var(--ngc-transition);
    }

    /* Enhanced Hero Section */
    .ngc-hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 120px 24px 80px;
    }

    .ngc-hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient