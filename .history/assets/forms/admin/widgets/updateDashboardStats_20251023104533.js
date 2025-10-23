// ============================================
// GLOBAL DASHBOARD UPDATER WITH API SYNC
// Syncs with /api/webhook endpoint data
// ============================================

(function() {
  'use strict';

  // Store for tracking previous values
  const statsHistory = {
    pending: 0,
    approved: 0,
    denied: 0,
    cancelled: 0
  };

  // Configuration
  const config = {
    : '/api',
    authToken: '200206',
    pollInterval: 30000, // 30 seconds
    autoStart: true
  };

  let pollTimer = null;

  /**
   * Update a single stat card with animation
   * @param {string} status - Status type: 'pending', 'approved', 'denied', 'cancelled'
   * @param {number} newValue - New value to display
   */
  function updateStatCard(status, newValue) {
    const element = document.getElementById(`admin-${status}`);
    
    if (!element) {
      console.warn(`⚠️ Element #admin-${status} not found`);
      return;
    }

    const oldValue = statsHistory[status] || 0;
    
    // Animate the value change
    animateValue(element, oldValue, newValue, 800);
    
    // Store new value
    statsHistory[status] = newValue;
    
    // Add pulse animation
    element.style.animation = 'none';
    setTimeout(() => {
      element.style.animation = 'statPulse 0.5s ease-out';
    }, 10);
  }

  /**
   * Update multiple stat cards at once
   * @param {Object} stats - Object with status keys and number values
   * Example: { pending: 5, approved: 10, denied: 2, cancelled: 3 }
   */
  function updateDashboard(stats) {
    console.log('📊 Updating dashboard with:', stats);
    
    Object.entries(stats).forEach(([status, value]) => {
      if (['pending', 'approved', 'denied', 'cancelled'].includes(status)) {
        updateStatCard(status, value);
      }
    });
  }

  /**
   * Animate number change with easing
   */
  function animateValue(element, start, end, duration) {
    const startTime = Date.now();
    const range = end - start;
    
    function update() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out quad easing
      const easeOutQuad = t => t * (2 - t);
      const currentValue = start + (range * easeOutQuad(progress));
      
      element.textContent = Math.round(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    update();
  }

  /**
   * Parse API response and extract stats
   */
  function parseApiResponse(response) {
    const stats = {};
    
    if (response.action === 'comprehensive_stats' && response.data) {
      stats.pending = response.data.cancellations?.daily?.pending || 0;
      stats.approved = response.data.cancellations?.daily?.approved || 0;
      stats.denied = response.data.cancellations?.daily?.denied || 0;
      stats.cancelled = stats.denied; // Map denied to cancelled if needed
      
      console.log('📈 Parsed comprehensive_stats:', stats);
    } 
    else if (response.action === 'daily_report' && response.data) {
      stats.pending = response.data.daily_cancellations?.pending || 0;
      stats.approved = response.data.daily_cancellations?.approved || 0;
      stats.denied = response.data.daily_cancellations?.denied || 0;
      stats.cancelled = stats.denied;
      
      console.log('📈 Parsed daily_report:', stats);
    }
    
    return stats;
  }

  /**
   * Fetch latest data from API
   */
  async function fetchStats() {
    try {
      const response = await fetch(config.apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': config.authToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⏳ Waiting for data from webhook...');
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Fetched data:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching stats:', error.message);
      return null;
    }
  }

  /**
   * Sync dashboard with API data
   */
  async function syncDashboard() {
    const data = await fetchStats();
    
    if (data && data.data) {
      const stats = parseApiResponse(data);
      
      if (Object.keys(stats).length > 0) {
        updateDashboard(stats);
        
        // Update last sync time if element exists
        const lastSyncEl = document.getElementById('last-sync-time');
        if (lastSyncEl) {
          const timeStr = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          lastSyncEl.textContent = `Last synced: ${timeStr}`;
        }
      }
    }
  }

  /**
   * Start auto-polling
   */
  function startPolling(interval = config.pollInterval) {
    console.log(`🔄 Starting auto-sync every ${interval / 1000}s`);
    
    // Clear existing timer
    stopPolling();
    
    // Initial sync
    syncDashboard();
    
    // Set up polling
    pollTimer = setInterval(syncDashboard, interval);
  }

  /**
   * Stop auto-polling
   */
  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
      console.log('⏹️ Auto-sync stopped');
    }
  }

  /**
   * Configure the updater
   */
  function configure(options) {
    Object.assign(config, options);
    console.log('⚙️ Configuration updated:', config);
  }

  /**
   * Reset all stats to zero
   */
  function resetDashboard() {
    updateDashboard({
      pending: 0,
      approved: 0,
      denied: 0,
      cancelled: 0
    });
  }

  /**
   * Increment a specific stat
   */
  function incrementStat(status, amount = 1) {
    const currentValue = statsHistory[status] || 0;
    updateStatCard(status, currentValue + amount);
  }

  /**
   * Get current stat values
   */
  function getCurrentStats() {
    return { ...statsHistory };
  }

  // ============================================
  // EXPOSE TO WINDOW OBJECT
  // ============================================
  
  window.dashboardSync = {
    // Manual updates
    updateDashboard,
    updateStatCard,
    incrementStat,
    resetDashboard,
    getCurrentStats,
    
    // API sync functions
    syncDashboard,
    fetchStats,
    startPolling,
    stopPolling,
    configure,
    
    // Getters
    get isPolling() { return pollTimer !== null; },
    get config() { return { ...config }; }
  };

  // Add CSS animation if not already present
  if (!document.getElementById('dashboard-animations')) {
    const style = document.createElement('style');
    style.id = 'dashboard-animations';
    style.textContent = `
      @keyframes statPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      
      .sync-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        margin-right: 8px;
        animation: syncBlink 2s ease-in-out infinite;
      }
      
      @keyframes syncBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-start polling if enabled
  if (config.autoStart) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        startPolling();
      });
    } else {
      startPolling();
    }
  }

  console.log('✅ Dashboard sync initialized');
  console.log('Available via window.dashboardSync:');
  console.log('  Manual: updateDashboard(), updateStatCard(), incrementStat()');
  console.log('  Sync: syncDashboard(), startPolling(), stopPolling()');
  console.log('  Config: configure({ apiUrl, authToken, pollInterval })');

})();

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// === AUTOMATIC SYNC (Default) ===
// Dashboard automatically syncs every 30 seconds
// No action needed - it starts automatically!


// === MANUAL UPDATES ===
// Update all stats at once
window.dashboardSync.updateDashboard({
  pending: 12,
  approved: 25,
  denied: 3,
  cancelled: 5
});

// Update single stat
window.dashboardSync.updateStatCard('pending', 15);

// Increment a stat
window.dashboardSync.incrementStat('approved', 2);


// === SYNC CONTROL ===
// Manually trigger sync
await window.dashboardSync.syncDashboard();

// Start auto-polling (custom interval)
window.dashboardSync.startPolling(60000); // Every 60 seconds

// Stop auto-polling
window.dashboardSync.stopPolling();

// Check if polling is active
console.log(window.dashboardSync.isPolling); // true/false


// === CONFIGURATION ===
// Change API settings
window.dashboardSync.configure({
  apiUrl: 'https://your-domain.com/api/webhook',
  authToken: '200206',
  pollInterval: 15000, // 15 seconds
  autoStart: true
});

// View current config
console.log(window.dashboardSync.config);


// === UTILITIES ===
// Get current values
const stats = window.dashboardSync.getCurrentStats();
console.log(stats); // { pending: 15, approved: 27, denied: 3, cancelled: 5 }

// Reset everything
window.dashboardSync.resetDashboard();

// Fetch latest data without updating UI
const data = await window.dashboardSync.fetchStats();
console.log(data);

*/