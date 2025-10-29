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
    apiUrl: 'https://api.northman-gaming-corporation.site/api/analytics/cancellations',
    apiKey: '200206',
    pollInterval: 5000, // 5 seconds
    autoStart: true,
    maxRetries: 3,
    retryDelay: 2000
  };

  let pollTimer = null;
  let consecutiveErrors = 0;
  let isUsingFallback = false;

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
  // Update connection status indicator
  // ===============================
  function updateConnectionStatus(status) {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;

    const statusMap = {
      connected: { text: '🟢 Connected', class: 'status-connected' },
      fallback: { text: '🟡 Using Database', class: 'status-fallback' },
      error: { text: '🔴 Connection Error', class: 'status-error' }
    };

    const statusInfo = statusMap[status] || statusMap.error;
    statusEl.textContent = statusInfo.text;
    statusEl.className = statusInfo.class;
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
  // Parse API response
  // ===============================
  function parseApiResponse(response) {
    const stats = {
      pending: 0,
      approved: 0,
      denied: 0,
      payout: 0
    };

    try {
      console.log("API Response:", response);

      // Extract data from new API format
      const byStatus = response?.by_status;
      
      if (byStatus) {
        // Get pending from requested minus (approved + denied)
        const requested = byStatus.requested || 0;
        const approved = byStatus.approved || 0;
        const denied = byStatus.denied || 0;
        
        stats.pending = requested - (approved + denied);
        stats.approved = approved;
        stats.denied = denied;
        
        console.log("Requested:", requested);
        console.log("Approved:", approved);
        console.log("Denied:", denied);
        console.log("Calculated Pending:", stats.pending);
      }

      // Payout data is not in the cancellations endpoint
      // You may need a separate endpoint for payout data
      // For now, keeping it at 0 or you can fetch from another endpoint
      stats.payout = 0;

    } catch (error) {
      console.error("Error parsing API response:", error);
    }

    console.log("Final Stats Object:", stats);
    return stats;
  }

  // ===============================
  // Fetch API data with retry logic
  // ===============================
  async function fetchStats(retryCount = 0) {
    try {
      const response = await fetch(config.apiUrl, { 
        method: 'GET', 
        headers: { 
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      isUsingFallback = false;
      updateConnectionStatus('connected');
      consecutiveErrors = 0;
      return data;
      
    } catch (error) {
      console.error(`Error fetching stats (attempt ${retryCount + 1}/${config.maxRetries}):`, error.message);
      
      // Retry logic
      if (retryCount < config.maxRetries) {
        console.log(`Retrying in ${config.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return fetchStats(retryCount + 1);
      }
      
      consecutiveErrors++;
      updateConnectionStatus('error');
      
      // If too many consecutive errors, increase poll interval
      if (consecutiveErrors >= 3) {
        console.warn('Multiple consecutive errors, reducing poll frequency');
        stopPolling();
        startPolling(config.pollInterval * 2); // Double the interval
      }
      
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
      const syncText = isUsingFallback 
        ? `Last synced: ${now.toLocaleTimeString()} (via database)`
        : `Last synced: ${now.toLocaleTimeString()}`;
      lastSyncEl.textContent = syncText;
    }

    // Update next draw indicator if element exists
    const nextDrawEl = document.getElementById('next-draw-time');
    if (nextDrawEl) {
      nextDrawEl.textContent = `Next Draw: ${getNextDraw()}`;
    }
    
    // Reset to normal poll interval if errors cleared
    if (consecutiveErrors === 0 && pollTimer) {
      const currentInterval = pollTimer._idleTimeout || config.pollInterval;
      if (currentInterval !== config.pollInterval) {
        console.log('Connection restored, resuming normal poll interval');
        stopPolling();
        startPolling(config.pollInterval);
      }
    }
  }

  // ===============================
  // Polling
  // ===============================
  function startPolling(interval = config.pollInterval) {
    stopPolling();
    console.log(`Starting dashboard sync polling (${interval}ms)...`);
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
    consecutiveErrors = 0; // Reset error count on manual refresh
    syncDashboard();
  }

  // ===============================
  // Get current stats
  // ===============================
  function getCurrentStats() {
    return { ...statsHistory };
  }

  // ===============================
  // Get connection info
  // ===============================
  function getConnectionInfo() {
    return {
      isUsingFallback,
      consecutiveErrors,
      pollInterval: pollTimer ? (pollTimer._idleTimeout || config.pollInterval) : null,
      isPolling: pollTimer !== null
    };
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
    getConnectionInfo,
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

// Usage Examples:
// ===============================

// Get current stats
// window.dashboardSync.getCurrentStats();

// Get next draw
// window.dashboardSync.getNextDraw(); // Returns "14:00"

// Get connection info
// window.dashboardSync.getConnectionInfo();
// Returns: { isUsingFallback: false, consecutiveErrors: 0, pollInterval: 5000, isPolling: true }

// Change polling interval
// window.dashboardSync.stopPolling();
// window.dashboardSync.startPolling(10000); // 10 seconds

// Manual refresh (resets error count)
// window.dashboardSync.manualRefresh();