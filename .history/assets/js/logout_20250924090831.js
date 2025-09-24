// Centralized Logout Utility
// This file provides consistent logout functionality across all pages

class LogoutManager {
  constructor() {
    this.logoutCallbacks = [];
  }

  // Register a callback to be called before logout
  registerCallback(callback) {
    if (typeof callback === 'function') {
      this.logoutCallbacks.push(callback);
    }
  }

  // Centralized logout function
  async logout(options = {}) {
    const {
      showConfirmation = true,
      redirectTo = 'home', // 'home' or 'login'
      customMessage = 'Are you sure you want to logout?'
    } = options;

    try {
      // Show confirmation if requested
      if (showConfirmation) {
        if (!confirm(customMessage)) {
          return false; // User cancelled logout
        }
      }

      // Execute pre-logout callbacks
      for (const callback of this.logoutCallbacks) {
        try {
          await callback();
        } catch (error) {
          console.error('Error in logout callback:', error);
        }
      }

      // Clear all session data
      this.clearSessionData();

      // Show logout success message
      this.showLogoutSuccess();

      // Redirect based on option
      setTimeout(() => {
        this.redirectAfterLogout(redirectTo);
      }, 1000);

      return true; // Logout successful
    } catch (error) {
      console.error('Logout error:', error);
      this.showLogoutError();
      return false;
    }
  }

  // Clear all session and local storage data
  clearSessionData() {
    // Clear session storage
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser "); // Also clear with extra space (legacy)

    // Clear local storage
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUser "); // Also clear with extra space (legacy)
    localStorage.removeItem("rememberedUsername");

    // Clear any other auth-related data
    const keysToRemove = [
      'userToken',
      'authToken',
      'sessionId',
      'userSession'
    ];

    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });

    console.log('All session data cleared');
  }

  // Show logout success message
  showLogoutSuccess() {
    // Try to use the modal system if available
    if (window.Modal && window.Modal.show) {
      window.Modal.show('You have been logged out successfully.', 'success');
    } else {
      // Fallback to alert
      alert('You have been logged out successfully.');
    }
  }

  // Show logout error message
  showLogoutError() {
    if (window.Modal && window.Modal.show) {
      window.Modal.show('An error occurred during logout. Please try again.', 'error');
    } else {
      alert('An error occurred during logout. Please try again.');
    }
  }

  // Handle redirect after logout
  redirectAfterLogout(redirectTo) {
    if (redirectTo === 'login') {
      // Redirect to login modal
      if (window.mountLogin) {
        window.mountLogin();
      } else {
        console.warn('mountLogin not available, redirecting to home');
        this.redirectToHome();
      }
    } else {
      // Default to home page
      this.redirectToHome();
    }
  }

  // Redirect to home page
  redirectToHome() {
    if (window.renderHome && window.mount) {
      window.mount(window.renderHome());
    } else {
      // Fallback: reload the page
      window.location.reload();
    }
  }

  // Quick logout without confirmation (for programmatic use)
  async quickLogout() {
    return this.logout({ showConfirmation: false });
  }

