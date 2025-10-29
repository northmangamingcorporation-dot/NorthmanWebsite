(function() {
  'use strict';

  console.log('=== NEW Dashboard Sync Script Loaded ===');

  // Store for tracking previous values
  const statsHistory = {
    pending: 0,
    approved: 0,
    denied: 0,
    payout: 0
  };

  // Configuration
  const config = {
    cancellationsUrl: 'https://api.northman-gaming-corporation.site/api/analytics/cancellations',
    payoutsUrl: 'https://api.northman-gaming-corporation.site/api/analytics/payouts',
    apiKey: '200206',
    pollInterval: 5000, // 5 seconds
    autoStart: true,
    maxRetries: 3,
    retryDelay: 2000
  };

  let pollTimer = null;
  let consecutiveErrors = 0;

  // ===============================
  // Update a single stat card
  // ===============================
  function updateStatCard(status, newValue) {
    const container = document.getElementById(`admin-${status}`);
    if (!container) {
      console.warn(`Container not found: admin-${status}`);
      return;
    }

    const numberEl = container.querySelector('.number');
    if (!numberEl) {
      console.warn(`Number element not found in: admin-${status}`);
      return;
    }

    // Update value
    if (status === 'payout') {
      numberEl.textContent = `₱${newValue.toLocaleString()}`;
    } else {
      numberEl.textContent = newValue.toLocaleString();
    }

    // Store value
    statsHistory[status] = newValue;
    console.log(`Updated ${status}: ${newValue}`);
  }

  // ===============================
  // Update connection status indicator
  // ===============================
  function updateConnectionStatus(status) {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;

    const statusMap = {
      connected: { text: '🟢 Connected', class: 'status-connected' },
      partial: { text: '🟡 Partial Connection', class: 'status-partial' },
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
    console.log('Updating dashboard with stats:', stats);
    Object.entries(stats).forEach(([status, value]) => {
      if (['pending', 'approved', 'denied', 'payout'].includes(status)) {
        updateStatCard(status, value);
      }
    });
  }

  // ===============================
  // Parse Cancellations API response
  // ===============================
  function parseCancellationsResponse(response) {
    console.log('Parsing cancellations response:', response);

    const stats = {
      pending: 0,
      approved: 0,
      denied: 0
    };

    try {
      if (response && response.by_status) {
        const byStatus = response.by_status;
        
        // Calculate pending: requested minus (approved + denied)
        const requested = byStatus.requested || 0;
        const approved = byStatus.approved || 0;
        const denied = byStatus.denied || 0;
        
        stats.pending = Math.max(0, requested - (approved + denied));
        stats.approved = approved;
        stats.denied = denied;
        
        console.log('Cancellation stats extracted:', {
          requested,
          approved,
          denied,
          pending: stats.pending
        });
      } else {
        console.warn('Invalid cancellations response format - missing by_status');
      }
    } catch (error) {
      console.error('Error parsing cancellations response:', error);
    }

    return stats;
  }

  // ===============================
  // Parse Payouts API response
  // ===============================
  function parsePayoutsResponse(response) {
    console.log('Parsing payouts response:', response);

    let payout = 0;

    try {
      if (response && response.total_amount !== undefined) {
        // Response format: { "total_amount": 3089300.0, "total": 788, ... }
        payout = response.total_amount;
        console.log('Payout extracted:', payout, `(from ${response.total} transactions)`);
      } else {
        console.warn('Invalid payouts response format - missing total_amount');
      }
    } catch (error) {
      console.error('Error parsing payouts response:', error);
    }

    return payout;
  }

  // ===============================
  // Fetch API data with retry logic
  // ===============================
  async function fetchApi(url, retryCount = 0) {
    console.log(`Fetching from: ${url} (attempt ${retryCount + 1})`);
    
    try {
      const response = await fetch(url, { 
        method: 'GET', 
        headers: { 
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      console.log(`Response status: ${response.status} for ${url}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Data received successfully from', url);
      
      return { success: true, data };
      
    } catch (error) {
      console.error(`Fetch error from ${url} (attempt ${retryCount + 1}/${config.maxRetries}):`, error.message);
      
      // Retry logic
      if (retryCount < config.maxRetries) {
        console.log(`Retrying in ${config.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return fetchApi(url, retryCount + 1);
      }
      
      return { success: false, error: error.message };
    }
  }

  // ===============================
  // Fetch all stats
  // ===============================
  async function fetchAllStats() {
    console.log('--- Fetching all stats ---');
    
    // Fetch both endpoints in parallel
    const [cancellationsResult, payoutsResult] = await Promise.all([
      fetchApi(config.cancellationsUrl),
      fetchApi(config.payoutsUrl)
    ]);

    const stats = {
      pending: 0,
      approved: 0,
      denied: 0,
      payout: 0
    };

    let successCount = 0;

    // Process cancellations data
    if (cancellationsResult.success) {
      const cancellationStats = parseCancellationsResponse(cancellationsResult.data);
      stats.pending = cancellationStats.pending;
      stats.approved = cancellationStats.approved;
      stats.denied = cancellationStats.denied;
      successCount++;
    } else {
      console.error('Failed to fetch cancellations:', cancellationsResult.error);
    }

    // Process payouts data
    if (payoutsResult.success) {
      stats.payout = parsePayoutsResponse(payoutsResult.data);
      successCount++;
    } else {
      console.error('Failed to fetch payouts:', payoutsResult.error);
    }

    // Update connection status based on results
    if (successCount === 2) {
      updateConnectionStatus('connected');
      consecutiveErrors = 0;
    } else if (successCount === 1) {
      updateConnectionStatus('partial');
      consecutiveErrors++;
    } else {
      updateConnectionStatus('error');
      consecutiveErrors++;
    }

    // Handle consecutive errors
    if (consecutiveErrors >= 3) {
      console.warn('Multiple consecutive errors, reducing poll frequency');
      stopPolling();
      startPolling(config.pollInterval * 2);
    }

    return stats;
  }

  // ===============================
  // Sync dashboard
  // ===============================
  async function syncDashboard() {
    console.log('--- Syncing dashboard ---');
    
    const stats = await fetchAllStats();
    updateDashboard(stats);

    // Update last sync time
    const lastSyncEl = document.getElementById('last-sync-time');
    if (lastSyncEl) {
      const now = new Date();
      lastSyncEl.textContent = `Last synced: ${now.toLocaleTimeString()}`;
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
    console.log(`Starting dashboard sync polling every ${interval}ms`);
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
    consecutiveErrors = 0;
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
      consecutiveErrors,
      pollInterval: pollTimer ? (pollTimer._idleTimeout || config.pollInterval) : null,
      isPolling: pollTimer !== null,
      cancellationsUrl: config.cancellationsUrl,
      payoutsUrl: config.payoutsUrl
    };
  }

  // ===============================
  // Expose to window (overwrite old version)
  // ===============================
  window.dashboardSync = {
    updateDashboard,
    updateStatCard,
    syncDashboard,
    startPolling,
    stopPolling,
    manualRefresh,
    getCurrentStats,
    getConnectionInfo,
    statsHistory,
    config,
    version: '2.1.1' // Version identifier with payout support
  };

  console.log('Dashboard sync object exposed to window.dashboardSync');
  console.log('Version:', window.dashboardSync.version);

  // ===============================
  // Auto-start on page load
  // ===============================
  if (config.autoStart) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('Dashboard sync initialized (DOMContentLoaded)');
        startPolling();
      });
    } else {
      console.log('Dashboard sync initialized (immediate)');
      startPolling();
    }
  }
})();

// ==============================================
// USAGE NOTES:
// ==============================================
// This script now fetches from TWO endpoints:
// 1. /api/analytics/cancellations - for pending, approved, denied
// 2. /api/analytics/payouts - for payout total
//
// The script assumes the payouts endpoint exists and returns data in one of these formats:
// - { "total": 12345 }
// - { "daily_total": 12345 }
// - { "total_payout": 12345 }
// - { "data": { "total": 12345 } }
// - { "payouts": [{ "amount": 100 }, { "amount": 200 }] }
//
// If your payouts endpoint uses a different format, let me know and I'll adjust the parser.
//
// To test in console:
// - window.dashboardSync.version (should show "2.1")
// - window.dashboardSync.getConnectionInfo() (shows both URLs)
// - window.dashboardSync.manualRefresh() (force refresh both endpoints)