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
