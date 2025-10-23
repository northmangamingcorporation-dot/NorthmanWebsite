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
    payout: 0
  };

  // Configuration
  const config = {
    apiUrl: '/api/webhook',  // ✅ Fixed: correct path
    authToken: '200206',
    pollInterval: 2, // 30 seconds
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
      if (['pending', 'approved', 'denied', 'payout'].includes(status)) {
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
  const isPayout = element.id === 'admin-payout'; // ✅ Detect payout card

  function update() {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutQuad = t => t * (2 - t);
    const currentValue = start + (range * easeOutQuad(progress));

    // ✅ Format as peso for payout, otherwise plain number
    element.textContent = isPayout
      ? `₱${Math.round(currentValue).toLocaleString()}`
      : Math.round(currentValue).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

  /**
 * Parse API response and extract stats
 * ✅ Fixed: Handle both direct data and summary responses
 */
function parseApiResponse(response) {
  const stats = {};

  // Handle summary response with latest_update
  if (response.latest_update && response.latest_update.data) {
    const data = response.latest_update.data;

    if (data.cancellations?.daily) {
      stats.pending = data.cancellations.daily.pending || 0;
      stats.approved = data.cancellations.daily.approved || 0;
      stats.denied = data.cancellations.daily.denied || 0;
      stats.payout = data.daily_payout_total ; // ✅ fixed
      console.log('📈 Parsed from latest_update:', stats);
    } else if (data.daily_cancellations) {
      stats.pending = data.daily_cancellations.pending || 0;
      stats.approved = data.daily_cancellations.approved || 0;
      stats.denied = data.daily_cancellations.denied || 0;
      stats.payout = data.daily_payout_total  || 0; // ✅ fixed
      console.log('📈 Parsed from daily_report:', stats);
    }
  }
  // Handle direct data response
  else if (response.data) {
    if (response.data.cancellations?.daily) {
      stats.pending = response.data.cancellations.daily.pending || 0;
      stats.approved = response.data.cancellations.daily.approved || 0;
      stats.denied = response.data.cancellations.daily.denied || 0;
      stats.payout = response.data.daily_payout_total  || 0; // ✅ fixed
      console.log('📈 Parsed comprehensive_stats:', stats);
    } else if (response.data.daily_cancellations) {
      stats.pending = response.data.daily_cancellations.pending || 0;
      stats.approved = response.data.daily_cancellations.approved || 0;
      stats.denied = response.data.daily_cancellations.denied || 0;
      stats.payout = response.data.daily_payout_total  || 0; // ✅ fixed
      console.log('📈 Parsed daily_report:', stats);
    }
  }

  return stats;
}

  /**
   * Fetch latest data from API
   * ✅ Fixed: Use query parameter for auth (simpler than Bearer token)
   */
  async function fetchStats() {
    try {
      const url = `${config.apiUrl}?auth_token=${config.authToken}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
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
    
    if (data) {
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
      payout: 0
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
  console.log('Available via window.dashboardSync');

})();