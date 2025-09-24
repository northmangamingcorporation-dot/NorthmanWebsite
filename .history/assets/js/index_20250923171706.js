// Enhanced NGC Main Page - index.js (Complete Updated File)
// (Incorporates all previous enhancements with simplified global exports at the end)


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
                  <h4>PCSO                   Compliance</h4>
                  <p>Fully licensed and regulated</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ngc-contact-cta">
            <div class="ngc-cta-card">
              <h3>Ready to Get Started?</h3>
              <p>Access our secure portal to manage your gaming operations</p>
              <button class="ngc-btn ngc-btn-primary" id="contactPortalBtn" aria-label="Access the employee portal">
                <i class="fas fa-rocket" aria-hidden="true"></i>
                <span>Access Portal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Footer -->
      <footer class="ngc-footer" role="contentinfo">
        <div class="ngc-footer-content">
          <div class="ngc-footer-brand">
            <div class="ngc-footer-logo">
              <img src="assets/images/main_logo.jpg" alt="Northman Gaming Corporation Logo" loading="lazy" />
            </div>
            <div class="ngc-footer-info">
              <h4>Northman Gaming Corporation</h4>
              <p>PCSO Authorized Agent Corporation</p>
              <div class="ngc-footer-badges" role="list">
                <span class="ngc-footer-badge" role="listitem">
                  <i class="fas fa-certificate" aria-hidden="true"></i>
                  PCSO Licensed
                </span>
                <span class="ngc-footer-badge" role="listitem">
                  <i class="fas fa-shield-alt" aria-hidden="true"></i>
                  Secure & Compliant
                </span>
              </div>
            </div>
          </div>
          
          <div class="ngc-footer-links">
            <div class="ngc-footer-section">
              <h5>Quick Links</h5>
              <ul role="list">
                <li role="listitem"><a href="#home" data-route="home">Home</a></li>
                <li role="listitem"><a href="#services" data-route="services">Services</a></li>
                <li role="listitem"><a href="#about" data-route="about">About</a></li>
                <li role="listitem"><a href="#contact" data-route="contact">Contact</a></li>
              </ul>
            </div>
            
            <div class="ngc-footer-section">
              <h5>Services</h5>
              <ul role="list">
                <li role="listitem">STL Retail Solutions</li>
                <li role="listitem">Distribution & Logistics</li>
                <li role="listitem">Community Support</li>
                <li role="listitem">Compliance Management</li>
              </ul>
            </div>
            
            <div class="ngc-footer-section">
              <h5>Company</h5>
              <ul role="list">
                <li role="listitem">About NGC</li>
                <li role="listitem">Our Mission</li>
                <li role="listitem">Core Values</li>
                <li role="listitem">Career Opportunities</li>
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
              <a href="#" class="ngc-social-link" aria-label="Facebook" rel="noopener noreferrer">
                <i class="fab fa-facebook" aria-hidden="true"></i>
              </a>
              <a href="#" class="ngc-social-link" aria-label="Twitter" rel="noopener noreferrer">
                <i class="fab fa-twitter" aria-hidden="true"></i>
              </a>
              <a href="#" class="ngc-social-link" aria-label="Instagram" rel="noopener noreferrer">
                <i class="fab fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="#" class="ngc-social-link" aria-label="LinkedIn" rel="noopener noreferrer">
                <i class="fab fa-linkedin" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  `;
}

/* --- Enhanced event wiring with unique identifiers, accessibility, and error handling --- */
function attachActions() {
  try {
    // Enhanced Get Started Button with loading state and analytics
    const getStartedBtn = document.getElementById("getStartedBtn");
    if (getStartedBtn) {
      getStartedBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Add loading state
        const originalHTML = getStartedBtn.innerHTML;
        getStartedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
        getStartedBtn.disabled = true;
        getStartedBtn.setAttribute("aria-busy", "true");
        
        // Track analytics if available
        if (window.gtag) {
          gtag('event', 'portal_access', {
            'event_category': 'engagement',
            'event_label': 'get_started_button'
          });
        }
        
        setTimeout(() => {
          if (window.mountLogin) {
            window.mountLogin();
          } else {
            window.Modal?.show("Login system not available. Please contact support.", "error");
          }
          getStartedBtn.innerHTML = originalHTML;
          getStartedBtn.disabled = false;
          getStartedBtn.removeAttribute("aria-busy");
        }, 500);
      });
    }

    // Enhanced Learn More Button with smooth scroll and feedback
    const learnMoreBtn = document.getElementById("learnMoreBtn");
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener("click", (e) => {
        e.preventDefault();
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
          
          // Track scroll event
          if (window.gtag) {
            gtag('event', 'scroll_to_section', {
              'event_category': 'engagement',
              'event_label': 'learn_more_services'
            });
          }
        }
      });
    }

    // Contact Portal Button
    const contactPortalBtn = document.getElementById("contactPortalBtn");
    if (contactPortalBtn) {
      contactPortalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const originalHTML = contactPortalBtn.innerHTML;
        contactPortalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
        contactPortalBtn.disabled = true;
        contactPortalBtn.setAttribute("aria-busy", "true");
        
        setTimeout(() => {
          if (window.mountLogin) {
            window.mountLogin();
          } else {
            window.Modal?.show("Login system not available. Please contact support.", "error");
          }
          contactPortalBtn.innerHTML = originalHTML;
          contactPortalBtn.disabled = false;
          contactPortalBtn.removeAttribute("aria-busy");
        }, 500);
      });
    }

    // Enhanced Mobile Menu Toggle with keyboard support
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navMenu = document.querySelector(".ngc-nav-menu");
    
    if (mobileMenuToggle && navMenu) {
      const toggleMenu = (e) => {
        if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        mobileMenuToggle.classList.toggle("ngc-active");
        navMenu.classList.toggle("ngc-mobile-active");
        mobileMenuToggle.setAttribute("aria-expanded", navMenu.classList.contains("ngc-mobile-active"));
      };
      
      mobileMenuToggle.addEventListener("click", toggleMenu);
      mobileMenuToggle.addEventListener("keydown", toggleMenu);
    }

    // Enhanced Navigation with smooth scrolling, active states, and keyboard support
    document.querySelectorAll('[data-route]').forEach(navLink => {
      navLink.addEventListener('click', handleNavClick);
      navLink.addEventListener('keydown', (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNavClick(e);
        }
      });
    });

    function handleNavClick(e) {
      e.preventDefault();
      const route = e.currentTarget.getAttribute('data-route');
      
      // Update active state
      document.querySelectorAll('.ngc-nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
      e.currentTarget.classList.add('active');
      e.currentTarget.setAttribute('aria-current', 'page');
      
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
            // Update aria-current for section if needed
            targetSection.setAttribute('aria-current', 'location');
          }
        }, 100);
      }
      
      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('ngc-mobile-active')) {
        mobileMenuToggle.classList.remove('ngc-active');
        navMenu.classList.remove('ngc-mobile-active');
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      }
      
      // Track navigation
      if (window.gtag) {
        gtag('event', 'navigation', {
          'event_category': 'engagement',
          'event_label': route
        });
      }
    }

    // Social links (placeholder functionality)
    document.querySelectorAll('.ngc-social-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.Modal) {
          window.Modal.show("Social media integration coming soon!", "info");
        }
      });
    });

    console.log("NGC actions attached successfully.");
  } catch (error) {
    console.error("Error attaching NGC actions:", error);
  }
}

// Enhanced scroll animations for better UX with Intersection Observer
function initializeScrollAnimations() {
  if (!('IntersectionObserver' in window)) return; // Fallback for older browsers
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('ngc-animate-in');
        observer.unobserve(entry.target); // Observe once for performance
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document.querySelectorAll('.ngc-service-card, .ngc-value-card, .ngc-section-header, .ngc-highlight-item').forEach(el => {
    observer.observe(el);
  });
}

// Parallax effects for hero section with performance optimization
function initializeParallaxEffects() {
  // Only add scroll listener if not on mobile to preserve performance
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  }
  
  // Handle window resize
  window.addEventListener('resize', debounceNGC(() => {
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    } else {
      window.removeEventListener('scroll', optimizedScrollHandler);
    }
  }, 250));
}

// Enhanced styles injection with unique class names and performance optimizations
function injectMainPageStyles() {
  // Remove existing styles to prevent conflicts
  const existingStyles = document.querySelector('#ngc-main-styles');
  if (existingStyles) {
    existingStyles.remove();
  }

  const style = document.createElement("style");
  style.id = "ngc-main-styles";
  style.textContent = `
    /* NGC Main Page Unique Variables - Enhanced with more colors and spacing */
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
      --ngc-spacing-xs: 4px;
      --ngc-spacing-sm: 8px;
      --ngc-spacing-md: 16px;
      --ngc-spacing-lg: 24px;
      --ngc-spacing-xl: 32px;
      --ngc-spacing-2xl: 48px;
      --ngc-spacing-3xl: 64px;
    }

    /* Base Styles - Enhanced with better typography and layout */
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: var(--ngc-text-primary);
      background: var(--ngc-background);
      overflow-x: hidden;
    }

    .ngc-main-container {
      min-height: 100vh;
      background: var(--ngc-background);
    }

    /* Enhanced Navigation - Sticky with blur effect */
    .ngc-nav {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--ngc-border);
      padding: var(--ngc-spacing-md) 0;
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
      padding: 0 var(--ngc-spacing-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ngc-brand {
      display: flex;
      align-items: center;
      gap: var(--ngc-spacing-md);
    }

    .ngc-logo-container {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--ngc-primary);
      transition: var(--ngc-transition);
    }

    .ngc-logo-container:hover {
      transform: scale(1.05);
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
      gap: var(--ngc-spacing-sm);
    }

    .ngc-nav-link {
      display: flex;
      align-items: center;
      gap: var(--ngc-spacing-sm);
      padding: var(--ngc-spacing-sm) var(--ngc-spacing-md);
      text-decoration: none;
      color: var(--ngc-text-secondary);
      font-weight: 500;
      border-radius: 8px;
      transition: var(--ngc-transition);
      position: relative;
      white-space: nowrap;
    }

    .ngc-nav-link:hover,
    .ngc-nav-link.active {
      color: var(--ngc-primary);
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .ngc-nav-link[aria-current="page"] {
      border-bottom: 2px solid var(--ngc-primary);
    }

    .ngc-nav-icon {
      font-size: 0.9rem;
    }

    .ngc-nav-mobile-toggle {
      display: none;
      flex-direction: column;
      cursor: pointer;
      gap: 4px;
      padding: 4px;
    }

    .ngc-nav-mobile-toggle span {
      width: 24px;
      height: 2px;
      background: var(--ngc-text-primary);
      transition: var(--ngc-transition);
      border-radius: 1px;
    }

    /* Enhanced Hero Section - Full viewport with improved gradients */
    .ngc-hero {
      position: relative;
      min-height: 100vh;
      display:     flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 120px var(--ngc-spacing-lg) 80px;
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
      gap: var(--ngc-spacing-sm);
      background: rgba(59, 130, 246, 0.1);
      color: var(--ngc-primary);
      padding: var(--ngc-spacing-sm) var(--ngc-spacing-md);
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: var(--ngc-spacing-2xl);
      border: 1px solid rgba(59, 130, 246, 0.2);
      animation: ngc-fadeInUp 0.8s ease 0.2s both;
    }

    .ngc-hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--ngc-text-primary);
      margin: 0 0 var(--ngc-spacing-2xl) 0;
      line-height: 1.1;
      animation: ngc-fadeInUp 0.8s ease 0.4s both;
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
      margin: 0 0 var(--ngc-spacing-3xl) 0;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      animation: ngc-fadeInUp 0.8s ease 0.6s both;
    }

    .ngc-hero-stats {
      display: flex;
      justify-content: center;
      gap: var(--ngc-spacing-2xl);
      margin: var(--ngc-spacing-3xl) 0;
      flex-wrap: wrap;
      animation: ngc-fadeInUp 0.8s ease 0.8s both;
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
      gap: var(--ngc-spacing-md);
      margin: var(--ngc-spacing-3xl) 0;
      flex-wrap: wrap;
      animation: ngc-fadeInUp 0.8s ease 1s both;
    }

    .ngc-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--ngc-spacing-sm);
      padding: var(--ngc-spacing-md) var(--ngc-spacing-2xl);
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

    .ngc-btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--ngc-primary-dark), #1e40af);
      transform: translateY(-2px);
      box-shadow: var(--ngc-shadow-lg);
    }

    .ngc-btn-secondary {
      background: rgba(100, 116, 139, 0.1);
      color: var(--ngc-text-primary);
      border: 1px solid var(--ngc-border);
    }

    .ngc-btn-secondary:hover:not(:disabled) {
      background: rgba(100, 116, 139, 0.2);
      transform: translateY(-2px);
    }

    .ngc-hero-scroll-indicator {
      position: absolute;
      bottom: var(--ngc-spacing-2xl);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ngc-spacing-sm);
      color: var(--ngc-text-muted);
      font-size: 0.875rem;
      animation: ngc-bounce 2s infinite, ngc-fadeInUp 0.8s ease 1.2s both;
    }

    @keyframes ngc-bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
    }

    @keyframes ngc-fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Enhanced Sections - Consistent spacing and typography */
    .ngc-section {
      padding: var(--ngc-spacing-3xl) var(--ngc-spacing-lg);
      position: relative;
    }

    .ngc-section-header {
      text-align: center;
      margin-bottom: var(--ngc-spacing-2xl);
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0;
      transform: translateY(20px);
      transition: var(--ngc-transition);
    }

    .ngc-section-header.ngc-animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    .ngc-section-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--ngc-spacing-sm);
      background: rgba(59, 130, 246, 0.1);
      color: var(--ngc-primary);
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: var(--ngc-spacing-md);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ngc-section-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--ngc-text-primary);
      margin: 0 0 var(--ngc-spacing-md) 0;
      line-height: 1.2;
    }

    .ngc-section-description {
      font-size: 1.125rem;
      color: var(--ngc-text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    /* Services Section - Card hover effects */
    .ngc-services-section {
      background: var(--ngc-surface);
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--ngc-spacing-2xl);
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-service-card {
      background: var(--ngc-background);
      border-radius: var(--ngc-radius-lg);
      padding: var(--ngc-spacing-2xl);
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
      animation: ngc-slideInUp 0.6s ease forwards;
    }

    .ngc-service-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--ngc-shadow-xl);
      border-color: rgba(59, 130, 246, 0.2);
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
      margin-bottom: var(--ngc-spacing-2xl);
      box-shadow: var(--ngc-shadow);
      transition: var(--ngc-transition);
    }

    .ngc-service-card:hover .ngc-service-icon {
      transform: rotate(5deg) scale(1.05);
    }

    .ngc-service-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--ngc-text-primary);
      margin: 0 0 var(--ngc-spacing-md) 0;
    }

    .ngc-service-description {
      color: var(--ngc-text-secondary);
      line-height: 1.6;
      margin: 0 0 var(--ngc-spacing-2xl) 0;
    }

    .ngc-service-features {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ngc-service-features li {
      display: flex;
      align-items: center;
      gap: var(--ngc-spacing-sm);
      color: var(--ngc-text-secondary);
      margin-bottom: var(--ngc-spacing-sm);
      font-size: 0.875rem;
    }

    .ngc-service-features i {
      color: var(--ngc-success);
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    /* About Section - Improved grid and highlights */
    .ngc-about-section {
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ngc-spacing-3xl);
      align-items: center;
    }

    .ngc-about-content {
      max-width: 600px;
    }

    .ngc-about-text p {
      color: var(--ngc-text-secondary);
      line-height: 1.7;
      margin-bottom: var(--ngc-spacing-md);
      font-size: 1.125rem;
    }

    .ngc-about-highlights {
      margin-top: var(--ngc-spacing-2xl);
    }

    .ngc-highlight-item {
      display: flex;
      gap: var(--ngc-spacing-md);
      margin-bottom: var(--ngc-spacing-2xl);
      opacity: 0;
      transform: translateY(20px);
      transition: var(--ngc-transition);
    }

    .ngc-highlight-item.ngc-animate-in {
      opacity: 1;
      transform: translateY(0);
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
      transition: var(--ngc-transition);
    }

    .ngc-about-image-container:hover {
      border-color: var(--ngc-primary);
      transform: scale(1.02);
    }

    .ngc-about-image-placeholder {
      text-align: center;
      color: var(--ngc-text-muted);
    }

    .ngc-about-image-placeholder i {
      font-size: 4rem;
      margin-bottom: var(--ngc-spacing-md);
      display: block;
      color: var(--ngc-border);
    }

    .ngc-about-image-placeholder p {
      margin: 0;
      font-size: 0.875rem;
    }

    /* Values Section - Card variants and core values grid */
    .ngc-values-section {
      background: var(--ngc-surface);
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--ngc-spacing-2xl);
      max-width: 1200px;
      margin: 0 auto;
    }

    .ngc-value-card {
      background: var(--ngc-background);
      border-radius: var(--ngc-radius-lg);
      padding: var(--ngc-spacing-2xl);
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
      animation: ngc-slideInUp 0.6s ease forwards;
    }

    .ngc-value-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--ngc-shadow-lg);
    }

    .ngc-value-header {
      display: flex;
      align-items: center;
      gap: var(--ngc-spacing-md);
      margin-bottom: var(--ngc-spacing-lg);
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
      flex-shrink: 0;
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
      margin-bottom: var(--ngc-spacing-lg);
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
      gap: var(--ngc-spacing-sm);
    }

    .ngc-core-value-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--ngc-spacing-sm);
      padding: var(--ngc-spacing-md) var(--ngc-spacing-sm);
      background: rgba(245, 158, 11, 0.05);
      border-radius: 8px;
      color: var(--ngc-accent);
      font-size: 0.875rem;
            font-weight: 600;
      transition: var(--ngc-transition);
    }

    .ngc-core-value-item:hover {
      background: rgba(245, 158, 11, 0.1);
      transform: translateY(-2px);
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

    /* Contact Section - Gradient background with glassmorphism */
    .ngc-contact-section {
      background: linear-gradient(135deg, var(--ngc-primary), var(--ngc-primary-dark));
      color: white;
    }

    .ngc-contact-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--ngc-spacing-3xl);
      align-items: center;
    }

    .ngc-contact-section .ngc-section-badge {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .ngc-contact-section .ngc-section-title {
      color: white;
    }

    .ngc-contact-description {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: var(--ngc-spacing-2xl);
    }

    .ngc-contact-methods {
      display: flex;
      flex-direction: column;
      gap: var(--ngc-spacing-2xl);
    }

    .ngc-contact-method {
      display: flex;
      gap: var(--ngc-spacing-md);
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
      transition: var(--ngc-transition);
    }

    .ngc-contact-method:hover .ngc-contact-icon {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
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
      padding: var(--ngc-spacing-2xl);
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: var(--ngc-transition);
    }

    .ngc-cta-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .ngc-cta-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 var(--ngc-spacing-sm) 0;
    }

    .ngc-cta-card p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 var(--ngc-spacing-2xl) 0;
    }

    .ngc-cta-card .ngc-btn-primary {
      background: white;
      color: var(--ngc-primary);
    }

    .ngc-cta-card .ngc-btn-primary:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }

    /* Enhanced Footer - Dark theme with improved grid */
    .ngc-footer {
      background: var(--ngc-text-primary);
      color: white;
      padding: var(--ngc-spacing-3xl) var(--ngc-spacing-lg) var(--ngc-spacing-2xl);
    }

    .ngc-footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--ngc-spacing-3xl);
      margin-bottom: var(--ngc-spacing-2xl);
    }

    .ngc-footer-brand {
      display: flex;
      gap: var(--ngc-spacing-lg);
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
      margin: 0 0 var(--ngc-spacing-sm) 0;
    }

    .ngc-footer-info p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 var(--ngc-spacing-md) 0;
    }

    .ngc-footer-badges {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngc-spacing-sm);
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
      gap: var(--ngc-spacing-2xl);
    }

    .ngc-footer-section h5 {
      font-size: 1rem;
      font-weight: 700;
      color: white;
      margin: 0 0 var(--ngc-spacing-md) 0;
    }

    .ngc-footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ngc-footer-section li {
      margin-bottom: var(--ngc-spacing-sm);
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
      padding-top: var(--ngc-spacing-2xl);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      flex-wrap: wrap;
      gap: var(--ngc-spacing-md);
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
      gap: var(--ngc-spacing-md);
    }

    .ngc-footer-social span {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
    }

    .ngc-social-links {
      display: flex;
      gap: var(--ngc-spacing-sm);
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

    /* Responsive Design - Enhanced breakpoints */
    @media (max-width: 1024px) {
      .ngc-hero-title {
        font-size: 2.5rem;
      }
      
      .ngc-hero-stats {
        gap: var(--ngc-spacing-2xl);
      }
      
      .ngc-services-grid,
      .ngc-values-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--ngc-spacing-lg);
      }
      
      .ngc-about-grid {
        grid-template-columns: 1fr;
        gap: var(--ngc-spacing-2xl);
      }
      
      .ngc-contact-container {
        grid-template-columns: 1fr;
        gap: var(--ngc-spacing-2xl);
        text-align: center;
      }
      
      .ngc-footer-content {
        grid-template-columns: 1fr;
        gap: var(--ngc-spacing-2xl);
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
        padding: var(--ngc-spacing-md);
        box-shadow: var(--ngc-shadow-lg);
        z-index: 999;
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
        padding: 100px var(--ngc-spacing-md) 60px;
      }
      
      .ngc-hero-title {
        font-size: 2rem;
      }
      
      .ngc-hero-subtitle {
        font-size: 1.125rem;
      }
      
      .ngc-hero-stats {
        gap: var(--ngc-spacing-lg);
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
        padding: var(--ngc-spacing-2xl) var(--ngc-spacing-md);
      }
      
      .ngc-section-title {
        font-size: 2rem;
      }
      
      .ngc-services-grid,
      .ngc-values-grid {
        grid-template-columns: 1fr;
        gap: var(--ngc-spacing-lg);
      }
      
      .ngc-service-card,
      .ngc-value-card {
        padding: var(--ngc-spacing-lg);
      }
      
      .ngc-footer-links {
        grid-template-columns: 1fr;
        gap: var(--ngc-spacing-lg);
      }
      
      .ngc-footer-bottom {
        flex-direction: column;
        text-align: center;
      }
      
      .ngc-contact-methods {
        gap: var(--ngc-spacing-lg);
      }
    }

    @media (max-width: 480px) {
      .ngc-hero-title {
        font-size: 1.75rem;
      }
      
      .ngc-hero-stats {
        flex-direction: column;
        gap: var(--ngc-spacing-md);
      }
      
      .ngc-stat-number {
        font-size: 2rem;
      }
      
      .ngc-hero-actions {
        gap: var(--ngc-spacing-sm);
      }
      
      .ngc-section-header {
        margin-bottom: var(--ngc-spacing-lg);
      }
    }

    /* Animation Classes - Enhanced with stagger effects */
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

    /* Loading States - Consistent with other components */
    .ngc-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }

    .ngc-btn[aria-busy="true"] {
      position: relative;
      color: transparent;
    }

    .ngc-btn[aria-busy="true"]:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Focus States for Accessibility - Enhanced visibility */
    .ngc-nav-link:focus,
    .ngc-btn:focus,
    .ngc-social-link:focus {
      outline: 2px solid var(--ngc-primary);
      outline-offset: 2px;
    }

    /* Smooth Scroll - Global */
    html {
      scroll-behavior: smooth;
    }

    /* Custom Scrollbar - Subtle enhancement */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: var(--ngc-surface-2);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--ngc-border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--ngc-secondary);
    }

    /* Print Styles - Basic optimization */
    @media print {
      .ngc-nav,
      .ngc-hero-scroll-indicator,
      .ngc-btn {
        display: none;
      }
      
      .ngc-section {
        break-inside: avoid;
      }
    }
  `;
  
  document.head.appendChild(style);
  console.log("NGC styles injected successfully.");
}

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
  };
}

// Enhanced scroll performance handler
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

// Enhanced preloader for images with progress tracking
function preloadNGCImages() {
  const imageUrls = [
    'assets/images/main_logo.jpg'
    // Add more image URLs as needed
  ];
  
  let loadedCount = 0;
  const totalImages = imageUrls.length;
  
  if (totalImages === 0) return;
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        console.log("All NGC images preloaded successfully.");
      }
    };
    img.onerror = (e) => {
     