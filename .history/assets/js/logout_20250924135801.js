// Enhanced Centralized Logout Utility with NGC Integration
// Provides consistent logout functionality across all pages with improved error handling

class LogoutManager {
  constructor() {
    this.logoutCallbacks = [];
    this.isLoggingOut = false;
    this.config = {
      confirmationMessages: {
        default: 'Are you sure you want to logout?',
        dashboard: 'This will end your current session and return you to the home page. Continue?',
        admin: 'You are about to logout from the admin panel. Any unsaved work will be lost. Continue?',
        timeout: 'Your session has expired. You will be redirected to the home page.'
      },
      redirectDelay: 1500, // Increased for better UX
      clearCacheOnLogout: true
    };
  }

  // Register a callback to be called before logout
  registerCallback(callback) {
    if (typeof callback === 'function') {
      this.logoutCallbacks.push(callback);
      console.log('Logout callback registered');
    } else {
      console.warn('Invalid callback provided to registerCallback');
    }
  }

  // Remove a specific callback
  unregisterCallback(callback) {
    const index = this.logoutCallbacks.indexOf(callback);
    if (index > -1) {
      this.logoutCallbacks.splice(index, 1);
      console.log('Logout callback unregistered');
    }
  }

  // Enhanced centralized logout function
  async logout(options = {}) {
    // Prevent multiple simultaneous logout attempts
    if (this.isLoggingOut) {
      console.warn('Logout already in progress');
      return false;
    }

    const {
      showConfirmation = true,
      redirectTo = 'home', // 'home', 'login', or custom URL
      customMessage = null,
      messageType = 'default', // 'default', 'dashboard', 'admin', 'timeout'
      reason = 'manual', // 'manual', 'timeout', 'forced', 'error'
      skipCallbacks = false,
      analytics = true
    } = options;

    this.isLoggingOut = true;

    try {
      // Show confirmation if requested
      if (showConfirmation && reason === 'manual') {
        const message = customMessage || this.config.confirmationMessages[messageType];
        if (!this.showConfirmationDialog(message)) {
          this.isLoggingOut = false;
          return false; // User cancelled logout
        }
      }

      // Show loading state
      this.showLogoutProgress('Logging out...');

      // Execute pre-logout callbacks
      if (!skipCallbacks) {
        await this.executeLogoutCallbacks();
      }

      // Clear all session data
      this.clearSessionData();

      // Track logout analytics
      if (analytics) {
        this.trackLogoutEvent(reason);
      }

      // Emit logout event for other components
      this.emitLogoutEvent(reason);

      // Show logout success message
      this.showLogoutSuccess(reason);

      // Redirect after delay
      setTimeout(() => {
        this.redirectAfterLogout(redirectTo);
        this.isLoggingOut = false;
      }, this.config.redirectDelay);

      console.log(`Logout successful - Reason: ${reason}`);
      return true;

    } catch (error) {
      console.error('Logout error:', error);
      this.showLogoutError(error);
      this.isLoggingOut = false;
      return false;
    }
  }

  // Execute all registered callbacks with better error handling
  async executeLogoutCallbacks() {
    if (this.logoutCallbacks.length === 0) return;

    console.log(`Executing ${this.logoutCallbacks.length} logout callbacks`);
    
    for (let i = 0; i < this.logoutCallbacks.length; i++) {
      try {
        const callback = this.logoutCallbacks[i];
        if (typeof callback === 'function') {
          await callback();
        }
      } catch (error) {
        console.error(`Error in logout callback ${i + 1}:`, error);
        // Continue with other callbacks even if one fails
      }
    }
    
    // Clean up any remaining DOM event handlers that might cause issues
    this.cleanupDOMHandlers();
  }

  // Clean up DOM event handlers that might cause null pointer errors
  cleanupDOMHandlers() {
    try {
      // Hide any open modals to prevent them from staying visible after redirection
      if (window.Modal && window.Modal.hide) {
        window.Modal.hide();
      }

      // Remove any onclick handlers that might reference removed elements, but exclude home buttons
      const elementsWithOnClick = document.querySelectorAll('[onclick]');
      elementsWithOnClick.forEach(el => {
        if (el) {
          // Check if the element is a home button (e.g., has class 'home', 'btn-home', or onclick contains 'home')
          const isHomeButton = el.classList.contains('home') || 
                               el.classList.contains('btn-home') || 
                               (el.onclick && el.onclick.toString().includes('home'));
          if (!isHomeButton) {
            el.onclick = null;
            el.removeAttribute('onclick');
          }
        }
      });

      // Clear any global intervals or timeouts
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
        clearInterval(i);
      }

      // Remove any event listeners from common elements
      const elementsToClean = ['body', 'document', 'window'];

  // Enhanced session data clearing
  clearSessionData() {
    // Clear session storage
    const sessionKeys = [
      'loggedInUser',
      'loggedInUser ', // Legacy with space
      'userToken',
      'authToken',
      'sessionId',
      'userSession',
      'dashboardState',
      'lastActivity'
    ];

    sessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Clear local storage (selective)
    const localKeys = [
      'loggedInUser',
      'loggedInUser ', // Legacy with space
      'userToken',
      'authToken'
    ];

    localKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Optionally clear cache data
    if (this.config.clearCacheOnLogout) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_') || key.startsWith('temp_')) {
          localStorage.removeItem(key);
        }
      });
    }

    // Clear any cookies if needed
    this.clearAuthCookies();

    console.log('Session data cleared successfully');
  }

  // Clear authentication-related cookies
  clearAuthCookies() {
    const cookiesToClear = ['authToken', 'sessionId', 'userSession'];
    
    cookiesToClear.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  // Show confirmation dialog with better UX
  showConfirmationDialog(message) {
    // Try to use a custom modal if available
    if (window.Modal && window.Modal.confirm) {
      return window.Modal.confirm(message);
    }
    
    // Fallback to native confirm
    return confirm(message);
  }

  // Show logout progress indicator
  showLogoutProgress(message) {
    if (window.Modal && window.Modal.show) {
      window.Modal.show(message, 'info', false); // Non-dismissible
    }
  }

  // Enhanced success message with different types
  showLogoutSuccess(reason = 'manual') {
    const messages = {
      manual: 'You have been logged out successfully.',
      timeout: 'Session expired. You have been logged out.',
      forced: 'You have been logged out for security reasons.',
      error: 'Logged out due to an error. Please log in again if needed.'
    };

    const message = messages[reason] || messages.manual;
    const type = reason === 'error' ? 'warning' : 'success';

    if (window.Modal && window.Modal.show) {
      window.Modal.show(message, type);
    } else if (window.ngcEvents && window.ngcEvents.emit) {
      // Use NGC event system if available
      window.ngcEvents.emit('notification', { message, type });
    } else {
      // Fallback to alert
      alert(message);
    }
  }

  // Enhanced error handling
  showLogoutError(error) {
    const message = 'An error occurred during logout. You will be redirected shortly.';
    
    if (window.Modal && window.Modal.show) {
      window.Modal.show(message, 'error');
    } else {
      alert(message);
    }

    // Force redirect after error
    setTimeout(() => {
      this.forceRedirectToHome();
    }, 2000);
  }

  // Enhanced redirect handling with NGC integration
  redirectAfterLogout(redirectTo) {
    console.log(`Redirecting after logout to: ${redirectTo}`);

    // Handle different redirect options
    switch (redirectTo) {
      case 'login':
        this.redirectToLogin();
        break;
        
      case 'home':
      default:
        this.redirectToHome();
        break;
    }

    // Handle custom URLs
    if (typeof redirectTo === 'string' && redirectTo.startsWith('http')) {
      window.location.href = redirectTo;
    }
  }

  // Redirect to login modal
  redirectToLogin() {
    if (window.mountLogin) {
      try {
        window.mountLogin();
        return;
      } catch (error) {
        console.warn('Error mounting login modal:', error);
      }
    }
    
    // Fallback to home page
    console.warn('mountLogin not available, redirecting to home');
    this.redirectToHome();
  }

  // Enhanced home page redirect with NGC integration
  redirectToHome() {
    // Ensure root element exists before mounting
    this.ensureRootElement();
    
    // Method 1: Use NGC global functions (preferred)
    if (window.mount && window.renderHome) {
      try {
        window.mount(window.renderHome());
        console.log('Redirected to NGC home page');
        return;
      } catch (error) {
        console.warn('Error using NGC mount function:', error);
      }
    }

    // Method 2: Use NGC navigation helper
    if (window.navigateToHome) {
      try {
        window.navigateToHome();
        console.log('Redirected using NGC navigation helper');
        return;
      } catch (error) {
        console.warn('Error using NGC navigation helper:', error);
      }
    }

    // Method 3: Use NGC cleanup and reinitialize
    if (window.cleanupNGC && window.initializeNGC) {
      try {
        window.cleanupNGC();
        this.ensureRootElement(); // Ensure root exists after cleanup
        window.initializeNGC();
        if (window.mount && window.renderHome) {
          window.mount(window.renderHome());
          console.log('Redirected after NGC cleanup and reinitialize');
          return;
        }
      } catch (error) {
        console.warn('Error with NGC cleanup/reinitialize:', error);
      }
    }

    // Fallback methods
    this.forceRedirectToHome();
  }

  // Ensure root element exists
  ensureRootElement() {
    let root = document.getElementById('root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'root';
      root.style.minHeight = '100vh';
      
      // Clear body and append root
      document.body.innerHTML = '';
      document.body.appendChild(root);
      
      console.log('Root element recreated after logout');
    }
    return root;
  }

  // Force redirect with multiple fallback options
  forceRedirectToHome() {
    console.log('Using fallback redirect methods');

    // Fallback 1: Reload the page
    try {
      window.location.reload();
      return;
    } catch (error) {
      console.warn('Error reloading page:', error);
    }

    // Fallback 2: Navigate to root
    try {
      window.location.href = window.location.origin;
      return;
    } catch (error) {
      console.warn('Error navigating to origin:', error);
    }

    // Fallback 3: Navigate to index.html
    try {
      const currentPath = window.location.pathname;
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      window.location.href = window.location.origin + basePath + 'index.html';
      return;
    } catch (error) {
      console.error('All redirect methods failed:', error);
    }

    // Last resort: Show message to user
    alert('Logout successful. Please refresh the page manually to return to home.');
  }

  // Track logout events for analytics
  trackLogoutEvent(reason) {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'logout', {
        'event_category': 'authentication',
        'event_label': reason,
        'custom_map': {
          'dimension1': reason
        }
      });
    }

    // Custom analytics
    if (window.analytics && window.analytics.track) {
      window.analytics.track('User Logout', {
        reason: reason,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        page: window.location.pathname
      });
    }

    console.log(`Logout event tracked: ${reason}`);
  }

  // Emit logout event for other components
  emitLogoutEvent(reason) {
    // Use NGC event system if available
    if (window.ngcEvents && window.ngcEvents.emit) {
      window.ngcEvents.emit('userLogout', {
        reason: reason,
        timestamp: new Date().toISOString(),
        clearedData: true
      });
    }

    // Custom event for other listeners
    if (window.dispatchEvent) {
      const event = new CustomEvent('ngcLogout', {
        detail: { reason, timestamp: new Date().toISOString() }
      });
      window.dispatchEvent(event);
    }
  }

  // Session timeout handler
  handleSessionTimeout() {
    console.log('Session timeout detected');
    this.logout({
      showConfirmation: false,
      messageType: 'timeout',
      reason: 'timeout',
      analytics: true
    });
  }

  // Quick logout methods for different scenarios
  async quickLogout() {
    return this.logout({ showConfirmation: false, reason: 'manual' });
  }

  async adminLogout() {
    return this.logout({ 
      messageType: 'admin', 
      reason: 'manual',
      analytics: true 
    });
  }

  async dashboardLogout() {
    return this.logout({ 
      messageType: 'dashboard', 
      reason: 'manual',
      analytics: true 
    });
  }

  async forceLogout(reason = 'forced') {
    return this.logout({ 
      showConfirmation: false, 
      reason: reason,
      skipCallbacks: false,
      analytics: true 
    });
  }

  async logoutWithRedirect(redirectTo) {
    return this.logout({ 
      showConfirmation: true, 
      redirectTo: redirectTo,
      reason: 'manual' 
    });
  }

  // Get current logout state
  getState() {
    return {
      isLoggingOut: this.isLoggingOut,
      callbackCount: this.logoutCallbacks.length,
      config: { ...this.config }
    };
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('Logout manager configuration updated');
  }
}

// Create global logout manager instance
if (!window.logoutManager) {
  window.logoutManager = new LogoutManager();
}

// Enhanced convenience functions for global use
window.logout = async (options) => {
  return window.logoutManager.logout(options);
};

window.quickLogout = async () => {
  return window.logoutManager.quickLogout();
};

window.adminLogout = async () => {
  return window.logoutManager.adminLogout();
};

window.dashboardLogout = async () => {
  return window.logoutManager.dashboardLogout();
};

window.forceLogout = async (reason) => {
  return window.logoutManager.forceLogout(reason);
};

window.logoutWithRedirect = async (redirectTo) => {
  return window.logoutManager.logoutWithRedirect(redirectTo);
};

// Session timeout utilities
window.handleSessionTimeout = () => {
  window.logoutManager.handleSessionTimeout();
};

// Register logout callback utility
window.registerLogoutCallback = (callback) => {
  window.logoutManager.registerCallback(callback);
};

// Auto-initialize and integrate with NGC
document.addEventListener('DOMContentLoaded', () => {
  console.log('Enhanced logout manager initialized with NGC integration');
  
  // Register with NGC events if available
  if (window.ngcEvents) {
    window.ngcEvents.on('sessionExpired', () => {
      window.logoutManager.handleSessionTimeout();
    });
    
    window.ngcEvents.on('forceLogout', (data) => {
      window.logoutManager.forceLogout(data?.reason || 'forced');
    });
  }
  
  //Listen for browser events
  window.addEventListener('beforeunload', () => {
    // Clear any logout progress indicators
    if (window.Modal && window.Modal.hide) {
      window.Modal.hide();
    }
  });
});

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LogoutManager;
}

console.log('Enhanced logout manager with NGC integration loaded successfully');