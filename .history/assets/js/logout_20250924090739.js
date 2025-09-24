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
