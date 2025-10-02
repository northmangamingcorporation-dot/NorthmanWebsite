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
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      z-index: -2;
    }

    .ngc-hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
      z-index: -1;
    }

    .ngc-hero-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
      z-index: -1;
    }

    .ngc-hero-content {
      max-width: 800px;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .ngc-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(59, 130, 246, 0.1);
      color: var(--ngc-primary);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 24px;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .ngc-hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--ngc-text-primary);
      margin: 0 0 24px 0;
      line-height: 1.1;
    }

    .ngc-hero-highlight {
      background: linear-gradient(135deg, var(--ngc-primary), var(--ngc-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .ngc-hero-subtitle {
      font-size: 1.25rem;
      color: var(--ngc-text-secondary);
      margin: 0 0 40px 0;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .ngc-hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      margin: 40px 0;
      flex-wrap: wrap;
    }

    .ngc-stat-item {
      text-align: center;
    }

    .ngc-stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--ngc-primary);
      margin-bottom: 4px;
    }

    .ngc-stat-label {
      font-size: 0.875rem;
      color: var(--ngc-text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ngc-hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin: 40px 0;
      flex-wrap: wrap;
    }

    .ngc-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 16px 24px;
      border: none;
      border-radius: var(--ngc-radius);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--ngc-transition);
      text-decoration: none;
      min-width: 160px;
      justify-content: center;
    }

    .ngc-btn-primary {
      background: linear-gradient(135deg, var(--ngc-primary), var(--ngc-primary-dark));
      color: white;
      box-shadow: var(--ngc-shadow);
    }

    .ngc-btn-primary:hover {
      background: linear-gradient(135deg, var(--ngc-primary-dark), #1e40af);
      transform: translateY(-2px);
      box-shadow: var(--ngc-shadow-lg);
    }

    .ngc-btn-secondary {
      background: rgba(100, 116, 139, 0.1);
      color: var(--ngc-text-primary);
      border: 1px solid var(--ngc-border);
    }

    .ngc-btn-secondary:hover {
      background: rgba(100, 116, 139, 0.2);
      transform: translateY(-2px);
    }

    .ngc-hero-scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--ngc-text-muted);
      font-size: 0.875rem;
      animation: ngc-bounce 2s infinite;
    }

    @keyframes ngc-bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
    }

    /* Enhanced Sections */
    .ngc-section {
      padding: 80px 24px;
      position: relative;
    }

    .ngc-section-header {
      text-align: center;
      margin-bottom: 64px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .ngc-section-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(59, 130, 246, 0.1);
      color: var(--ngc-primary);
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ngc-section-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--ngc-text-primary);
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .ngc-section-description {
      font-size: 1.125rem;
      color: var(--ngc-text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    /* Services Section */
    .ngc-services-section {
      background: var(--ngc-surface);
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-service-card {
      background: var(--ngc-background);
      border-radius: var(--ngc-radius-lg);
      padding: 32px;
      box-shadow: var(--ngc-shadow);
      border: 1px solid var(--ngc-border);
      transition: var(--ngc-transition);
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
    }

    .ngc-service-card.ngc-animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    .ngc-service-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--ngc-shadow-xl);
    }

    .ngc-service-overlay {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.03));
      border-radius: 0 0 0 100px;
    }

    .ngc-service-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--ngc-primary), var(--ngc-primary-dark));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      margin-bottom: 24px;
      box-shadow: var(--ngc-shadow);
    }

    .ngc-service-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--ngc-text-primary);
      margin: 0 0 16px 0;
    }

    .ngc-service-description {
      color: var(--ngc-text-secondary);
      line-height: 1.6;
      margin: 0 0 24px 0;
    }

    .ngc-service-features {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ngc-service-features li {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--ngc-text-secondary);
      margin-bottom: 8px;
      font-size: 0.875rem;
    }

    .ngc-service-features i {
      color: var(--ngc-success);
      font-size: 0.75rem;
    }

    /* About Section */
    .ngc-about-section {
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }

    .ngc-about-text p {
      color: var(--ngc-text-secondary);
      line-height: 1.7;
      margin-bottom: 16px;
      font-size: 1.125rem;
    }

    .ngc-about-highlights {
      margin-top: 32px;
    }

    .ngc-highlight-item {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .ngc-highlight-icon {
      width: 48px;
      height: 48px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ngc-primary);
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .ngc-highlight-content h4 {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--ngc-text-primary);
      margin: 0 0 4px 0;
    }

    .ngc-highlight-content p {
      color: var(--ngc-text-secondary);
      margin: 0;
      font-size: 0.875rem;
    }

    .ngc-about-visual {
      display: flex;
      justify-content: center;
    }

    .ngc-about-image-container {
      width: 400px;
      height: 300px;
      background: var(--ngc-surface);
      border-radius: var(--ngc-radius-lg);
      border: 2px dashed var(--ngc-border);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .ngc-about-image-placeholder {
      text-align: center;
      color: var(--ngc-text-muted);
    }

    .ngc-about-image-placeholder i {
      font-size: 4rem;
      margin-bottom: 16px;
      display: block;
    }

    /* Values Section */
    .ngc-values-section {
      background: var(--ngc-surface);
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-value-card {
      background: var(--ngc-background);
      border-radius: var(--ngc-radius-lg);
      padding: 32px;
      box-shadow: var(--ngc-shadow);
      border: 1px solid var(--ngc-border);
      transition: var(--ngc-transition);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(20px);
    }

    .ngc-value-card.ngc-animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    .ngc-value-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--ngc-shadow-lg);
    }

    .ngc-value-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .ngc-value-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .ngc-mission-card .ngc-value-icon {
      background: linear-gradient(135deg, var(--ngc-primary), var(--ngc-primary-dark));
    }

    .ngc-vision-card .ngc-value-icon {
      background: linear-gradient(135deg, var(--ngc-success), #059669);
    }

    .ngc-values-card .ngc-value-icon {
      background: linear-gradient(135deg, var(--ngc-accent), #d97706);
    }

    .ngc-value-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--ngc-text-primary);
      margin: 0;
    }

    .ngc-value-content {
      flex: 1;
      margin-bottom: 20px;
    }

    .ngc-value-content p {
      color: var(--ngc-text-secondary);
      line-height: 1.6;
      margin: 0;
      font-size: 1rem;
    }

    .ngc-core-values-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .ngc-core-value-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      padding: 16px 8px;
      background: rgba(245, 158, 11, 0.05);
      border-radius: 8px;
      color: var(--ngc-accent);
      font-size: 0.875rem;
      font-weight: 600;
    }

    .ngc-core-value-item i {
      font-size: 1.25rem;
    }

    .ngc-value-footer {
      margin-top: auto;
    }

    .ngc-value-tag {
      display: inline-block;
      background: rgba(59, 130, 246, 0.1);
      color: var(--ngc-primary);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Contact Section */
    .ngc-contact-section {
      background: linear-gradient(135deg, var(--ngc-primary), var(--ngc-primary-dark));
      color: white;
    }

    .ngc-contact-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 64px;
      align-items: center;
    }

    .ngc-contact-section .ngc-section-badge {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .ngc-contact-section .ngc-section-title {
      color: white;
    }

    .ngc-contact-description {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .ngc-contact-methods {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .ngc-contact-method {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .ngc-contact-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .ngc-contact-details h4 {
      font-size: 1.125rem;
      font-weight: 700;
      color: white;
      margin: 0 0 4px 0;
    }

    .ngc-contact-details p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      line-height: 1.5;
    }

    .ngc-contact-cta {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .ngc-cta-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--ngc-radius-lg);
      padding: 32px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .ngc-cta-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 12px 0;
    }

    .ngc-cta-card p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 24px 0;
    }

    .ngc-cta-card .ngc-btn-primary {
      background: white;
      color: var(--ngc-primary);
    }

    .ngc-cta-card .ngc-btn-primary:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }

    /* Enhanced Footer */
    .ngc-footer {
      background: var(--ngc-text-primary);
      color: white;
      padding: 64px 24px 24px;
    }

    .ngc-footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 64px;
      margin-bottom: 32px;
    }

    .ngc-footer-brand {
      display: flex;
      gap: 20px;
    }

    .ngc-footer-logo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--ngc-primary);
      flex-shrink: 0;
    }

    .ngc-footer-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ngc-footer-info h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
    }

    .ngc-footer-info p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 16px 0;
    }

    .ngc-footer-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ngc-footer-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(59, 130, 246, 0.2);
      color: var(--ngc-primary-light);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .ngc-footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .ngc-footer-section h5 {
      font-size: 1rem;
      font-weight: 700;
      color: white;
      margin: 0 0 16px 0;
    }

    .ngc-footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ngc-footer-section li {
      margin-bottom: 8px;
    }

    .ngc-footer-section a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.875rem;
    }

    .ngc-footer-section a:hover {
      color: var(--ngc-primary-light);
    }

    .ngc-footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      flex-wrap: wrap;
      gap: 16px;
    }

    .ngc-footer-copyright p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 0.875rem;
    }

    .ngc-footer-disclaimer {
      font-size: 0.75rem !important;
      color: rgba(255, 255, 255, 0.5) !important;
    }

    .ngc-footer-social {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .ngc-footer-social span {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
    }

    .ngc-social-links {
      display: flex;
      gap: 8px;
    }

    .ngc-social-link {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: var(--ngc-transition);
    }

    .ngc-social-link:hover {
      background: var(--ngc-primary);
      color: white;
      transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .ngc-hero-title {
        font-size: 2.5rem;
      }
      
      .ngc-hero-stats {
        gap: 32px;
      }
      
      .ngc-services-grid,
      .ngc-values-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }
      
      .ngc-about-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }
      
      .ngc-contact-container {
        grid-template-columns: 1fr;
        gap: 48px;
        text-align: center;
      }
      
      .ngc-footer-content {
        grid-template-columns: 1fr;
        gap: 48px;
        text-align: center;
      }
      
      .ngc-footer-links {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .ngc-nav-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid var(--ngc-border);
        flex-direction: column;
        padding: 16px;
        box-shadow: var(--ngc-shadow-lg);
      }
      
      .ngc-nav-menu.ngc-mobile-active {
        display: flex;
      }
      
      .ngc-nav-mobile-toggle {
        display: flex;
      }
      
      .ngc-nav-mobile-toggle.ngc-active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .ngc-nav-mobile-toggle.ngc-active span:nth-child(2) {
        opacity: 0;
      }
      
      .ngc-nav-mobile-toggle.ngc-active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
      
      .ngc-brand-name {
        font-size: 1rem;
      }
      
      .ngc-brand-tagline {
        display: none;
      }
      
      .ngc-hero {
        padding: 100px 16px 60px;
      }
      
      .ngc-hero-title {
        font-size: 2rem;
      }
      
      .ngc-hero-subtitle {
        font-size: 1.125rem;
      }
      
      .ngc-hero-stats {
        gap: 24px;
      }
      
      .ngc-hero-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .ngc-btn {
        width: 100%;
        max-width: 300px;
      }
      
      .ngc-section {
        padding: 60px 16px;
      }
      
      .ngc-section-title {
        font-size: 2rem;
      }
      
      .ngc-services-grid,
      .ngc-values-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .ngc-service-card,
      .ngc-value-card {
        padding: 24px;
      }
      
      .ngc-footer-links {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .ngc-footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .ngc-hero-title {
        font-size: 1.75rem;
      }
      
      .ngc-hero-stats {
        flex-direction: column;
        gap: 16px;
      }
      
      .ngc-stat-number {
        font-size: 2rem;
      }
    }

    /* Animation Classes */
    .ngc-animate-in {
      animation: ngc-slideInUp 0.6s ease forwards;
    }

    @keyframes ngc-slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Loading States */
    .ngc-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Focus States for Accessibility */
    .ngc-nav-link:focus,
    .ngc-btn:focus {
      outline: 2px solid var(--ngc-primary);
      outline-offset: 2px;
    }

    /* Smooth Scroll */
    html {
      scroll-behavior: smooth;
    }
  `;
  
  document.head.appendChild(style);
}

/* --- Enhanced initial mount with better error handling --- */
document.addEventListener("DOMContentLoaded", () => {
  try {
  
  // Update user status to offline before clearing session
  const loggedInUser = localStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser ");
  
  if (loggedInUser) {
    try {
      const user = JSON.parse(loggedInUser);
      if (user.username) {
        updateUserStatus(user.username, 'logout').catch(err => {
          console.warn('Failed to update logout status:', err);
        });
      }
    } catch (e) {
      console.error('Error parsing logged in user:', e);
    }
  }
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      const role = (user.position || "").toLowerCase();

      console.log(`Auto-redirecting user: ${user.username} with role: ${role}`);

      if (role === "it manager") {
      window.mountITAdminDashboard(user);
      } else if (role === "admin head") {
        window.mountAdminDashboard(user);
      } else if (role === "human resources officer") {
        window.mountHRDashboard(user);
      } else {
        window.mountDashboard(user);
      }
    } else {
      // No session → guest home
      mount(renderHome());
      console.log("No logged in user found, showing home page");
    }
  } catch (error) {
    console.error("Error during initial page load:", error);
    // Fallback to home page if there's any error
    mount(renderHome());
  }
});

// Enhanced utility functions for better performance
function debounceNGC(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttleNGC(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Enhanced scroll performance
const optimizedScrollHandler = throttleNGC(() => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector('.ngc-hero-background');
  const heroContent = document.querySelector('.ngc-hero-content');
  
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
  
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
  
  // Update navigation state based on scroll
  const nav = document.querySelector('.ngc-nav');
  if (nav) {
    if (scrolled > 50) {
      nav.style.background = 'rgba(255, 255, 255, 0.98)';
      nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = 'none';
    }
  }
}, 16);

// Initialize enhanced scroll effects
function initializeParallaxEffects() {
  // Only add scroll listener if not on mobile to preserve performance
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', optimizedScrollHandler);
  }
  
  // Handle window resize
  window.addEventListener('resize', debounceNGC(() => {
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', optimizedScrollHandler);
    } else {
      window.removeEventListener('scroll', optimizedScrollHandler);
    }
  }, 250));
}

// Enhanced preloader for images
function preloadNGCImages() {
  const imageUrls = [
    'assets/images/main_logo.jpg'
    // Add more image URLs as needed
  ];
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', preloadNGCImages);

// Enhanced error boundary for better debugging
window.addEventListener('error', (event) => {
  console.error('NGC Error:', {
    message: event.message,
    source: event.filename,
    line: event.lineno,
    column: event.colno,
    error: event.error
  });
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('NGC Page Performance:', {
        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
        loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
        totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
      });
    }, 0);
  });
}

// Export enhanced functions for global access
window.mountEnhanced = mount;
window.renderEnhancedHome = renderHome;
window.renderEnhancedNav = renderNav;
window.attachEnhancedActions = attachActions;
window.injectMainPageStyles = injectMainPageStyles;