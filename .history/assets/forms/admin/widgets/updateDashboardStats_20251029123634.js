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
    apiUrl: 'https://api.northman-gaming-corporation.site',
    authToken: '200206',
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
      // Get combined_report first
      const report = response?.latest_update?.combined_report;
      console.log("Combined Report:", report);
      if (!report) return stats;

      // Determine next draw (must match keys in by_draw, e.g., "10:30")
      const nextDraw = getNextDraw();
      console.log("Next Draw:", nextDraw);

      // Prefer comprehensive_stats if present
      const compStats = report?.comprehensive_stats;
      if (compStats) {
        console.log("Comprehensive Stats:", compStats);

        // Pending for next draw
        stats.pending = compStats?.cancellations?.by_draw?.[nextDraw]?.pending ?? 0;
        console.log(`Pending for ${nextDraw}:`, stats.pending);

        // Daily totals
        stats.approved = compStats?.cancellations?.daily?.approved ?? 0;
        stats.denied = compStats?.cancellations?.daily?.denied ?? 0;
        console.log("Daily Approved:", stats.approved, "Daily Denied:", stats.denied);

        // Daily payout
        stats.payout = compStats?.payouts?.daily_total ?? 0;
        console.log("Daily Payout:", stats.payout);
      } 
      // Fallback to daily_report if comprehensive_stats missing
      else if (report?.daily_report) {
        console.log("Daily Report:", report.daily_report);

        stats.pending = report.daily_report?.daily_cancellations?.pending ?? 0;
        stats.approved = report.daily_report?.daily_cancellations?.approved ?? 0;
        stats.denied = report.daily_report?.daily_cancellations?.denied ?? 0;
        stats.payout = report.daily_report?.daily_payout_total ?? 0;

        console.log("Fallback Pending:", stats.pending);
        console.log("Fallback Approved:", stats.approved);
        console.log("Fallback Denied:", stats.denied);
        console.log("Fallback Payout:", stats.payout);
      }

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
      // Request with format=by_draw to get the new summary format
      const url = `${config.apiUrl}?auth_token=${config.authToken}&format=by_draw`;
      const response = await fetch(url, { 
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        // Check if data is stale (webhook received data but it's old)
        if (response.status === 503 || response.status === 404) {
          console.warn(`Webhook data unavailable (${response.status}), database fallback active`);
          isUsingFallback = true;
          updateConnectionStatus('fallback');
          consecutiveErrors = 0; // Reset error count, fallback is working
          return await response.json(); // May still contain fallback data
        }
        
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check data age
      const dataAge = data?.data_age_ms;
      if (dataAge && dataAge > 3600000) { // > 1 hour
        console.warn(`Data is stale (${Math.round(dataAge / 60000)} minutes old), using database fallback`);
        isUsingFallback = true;
        updateConnectionStatus('fallback');
      } else {
        isUsingFallback = false;
        updateConnectionStatus('connected');
      }
      
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