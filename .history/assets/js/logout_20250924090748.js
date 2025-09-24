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

