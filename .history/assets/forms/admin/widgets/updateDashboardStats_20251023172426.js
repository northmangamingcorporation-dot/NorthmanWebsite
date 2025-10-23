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
    apiUrl: '/api/webhook',
    authToken: '200206',
    pollInterval: 5000, // 5 seconds
    autoStart: true
  };

  let pollTimer = null;

  // ===============================
  // Update a single stat card
  // ===============================
  function updateStatCard(status, newValue) {
    const container = document.getElementById(`admin-${status}`);
    if (!container) return;

    // Find the span.number inside the container
    const numberEl = container.querySelector('.number');
    if (!numberEl) return;

    // Update value
    if (status === 'payout') {
      numberEl.textContent = `₱${newValue.toLocaleString()}`;
    } else {
      numberEl.textContent = newValue.toLocaleString();
    }

    // Store value
    statsHistory[status] = newValue;
  }

  // ===============================
  // Update all stats
  // ===============================
  function updateDashboard(stats) {
    Object.entries(stats).forEach(([status, value]) => {
      if (['pending', 'approved', 'denied', 'payout'].includes(status)) {
        updateStatCard(status, value);
      }
    });
  }

  // ===============================
  // Get next draw time
  // ===============================
  function getNextDraw() {
    const now = new Date();
    const drawTimes = ['10:30', '14:00', '17:00', '20:00', '21:00'];
    
    const nextDraw = drawTimes.find(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const drawDate = new Date();
      drawDate.setHours(hours, minutes, 0, 0);
      return drawDate > now;
    });

    // If no more draws today, return first draw tomorrow
    return nextDraw || drawTimes[0];
  }

  // ===============================
  // Parse API response - NEW FORMAT
  // ===============================
  function parseApiResponse(response) {
  const stats = {
    pending: 0,
    approved: 0,
    denied: 0,
    payout: 0
  };

  try {
    const nextDraw = getNextDraw(); // e.g., "10:30", "14:00", etc.
    const report = response.latest_update?.combined_report;

    if (report?.comprehensive_stats) {
      const compStats = report.comprehensive_stats;

      // Pending: use next draw if available
      const pendingByDraw = compStats.cancellations?.by_draw?.[nextDraw];
      stats.pending = pendingByDraw?.pending ?? 0;

      // Approved / Denied: daily totals
      stats.approved = compStats.cancellations?.daily?.approved ?? 0;
      stats.denied = compStats.cancellations?.daily?.denied ?? 0;

      // Payout: daily total only
      stats.payout = compStats.payouts?.daily_total ?? 0;
    } 
    // Fallback to daily_report if comprehensive_stats not present
    else if (report?.daily_report) {
      stats.pending = report.daily_report.daily_cancellations?.pending ?? 0;
      stats.approved = report.daily_report.daily_cancellations?.approved ?? 0;
      stats.denied = report.daily_report.daily_cancellations?.denied ?? 0;
      stats.payout = report.daily_report.daily_payout_total ?? 0;
    }
  } catch (error) {
    console.error('Error parsing API response:', error);
  }

  return stats;
}


  // ===============================
  // Fetch API data
  // ===============================
  async function fetchStats() {
    try {
      // Request with format=by_draw to get the new summary format
      const url = `${config.apiUrl}?auth_token=${config.authToken}&format=by_draw`;
      const response = await fetch(url, { 
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' } 
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error.message);
      return null;
    }
  }

  // ===============================
  // Sync dashboard
  // ===============================
  async function syncDashboard() {
    const data = await fetchStats();
    if (!data) {
      console.warn('No data received from API');
      return;
    }
    
    const stats = parseApiResponse(data);
    updateDashboard(stats);

    // Update last sync time
    const lastSyncEl = document.getElementById('last-sync-time');
    if (lastSyncEl) {
      const now = new Date();
      lastSyncEl.textContent = `Last synced: ${now.toLocaleTimeString()}`;
    }

    // Update next draw indicator if element exists
    const nextDrawEl = document.getElementById('next-draw-time');
    if (nextDrawEl) {
      nextDrawEl.textContent = `Next Draw: ${getNextDraw()}`;
    }
  }

  // ===============================
  // Polling
  // ===============================
  function startPolling(interval = config.pollInterval) {
    stopPolling();
    console.log('Starting dashboard sync polling...');
    syncDashboard(); // Initial sync
    pollTimer = setInterval(syncDashboard, interval);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
      console.log('Dashboard sync polling stopped');
    }
  }

  // ===============================
  // Manual refresh
  // ===============================
  function manualRefresh() {
    console.log('Manual refresh triggered');
    syncDashboard();
  }

  // ===============================
  // Get current stats
  // ===============================
  function getCurrentStats() {
    return { ...statsHistory };
  }

  // ===============================
  // Expose to window
  // ===============================
  window.dashboardSync = {
    updateDashboard,
    updateStatCard,
    syncDashboard,
    startPolling,
    stopPolling,
    manualRefresh,
    getCurrentStats,
    getNextDraw,
    statsHistory,
    config
  };

  // ===============================
  // Auto-start on page load
  // ===============================
  if (config.autoStart) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('Dashboard sync initialized');
        startPolling();
      });
    } else {
      console.log('Dashboard sync initialized (immediate)');
      startPolling();
    }
  }
})();

// // Get current stats
// window.dashboardSync.getCurrentStats();

// // Get next draw
// window.dashboardSync.getNextDraw(); // Returns "14:00"

// // Change polling interval
// window.dashboardSync.stopPolling();
// window.dashboardSync.startPolling(10000); // 10 seconds