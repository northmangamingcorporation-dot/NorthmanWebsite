(function() {
  'use strict';

  console.log('=== Dashboard Sync Script v3.0 Loaded ===');

  // Store for tracking previous values
  const statsHistory = {
    pending: 0,
    approved: 0,
    denied: 0,
    payout: 0
  };

  // Configuration
  const config = {
    apiUrl: 'https://api.northman-gaming-corporation.site/api/query',
    apiKey: '200206',
    pollInterval: 5000, // 5 seconds
    autoStart: true,
    maxRetries: 3,
    retryDelay: 2000,
    drawTimes: ['10:30', '14:00', '17:00', '20:00', '21:00']
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
  // Get next draw time
  // ===============================
  function getNextDraw() {
    const now = new Date();
    
    const nextDraw = config.drawTimes.find(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const drawDate = new Date();
      drawDate.setHours(hours, minutes, 0, 0);
      return drawDate > now;
    });

    // If no more draws today, return first draw tomorrow
    return nextDraw || config.drawTimes[0];
  }

  // ===============================
  // Get today's date range
  // ===============================
  function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    // Format: YYYY-MM-DD HH:MM:SS
    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return {
      start: formatDateTime(startOfDay),
      end: formatDateTime(endOfDay)
    };
  }

  // ===============================
  // Execute SQL query
  // ===============================
  async function executeQuery(query, params = [], retryCount = 0) {
    console.log(`Executing query (attempt ${retryCount + 1}):`, query);
    
    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, params }),
        signal: AbortSignal.timeout(10000)
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Query result:', data);

      return { success: true, data: data.results };

    } catch (error) {
      console.error(`Query error (attempt ${retryCount + 1}/${config.maxRetries}):`, error.message);

      // Retry logic
      if (retryCount < config.maxRetries) {
        console.log(`Retrying in ${config.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return executeQuery(query, params, retryCount + 1);
      }

      return { success: false, error: error.message };
    }
  }

  // ===============================
  // Fetch all stats
  // ===============================
  async function fetchAllStats() {
    console.log('--- Fetching all stats ---');

    const today = getTodayRange();
    const nextDraw = getNextDraw();
    console.log('Date range:', today);
    console.log('Next draw:', nextDraw);

    // Query 1: Pending cancellations (status = 'requested', before upcoming draw)
    const pendingQuery = `
      SELECT COUNT(DISTINCT ticket_id) as count
      FROM cancellations
      WHERE status = 'requested'
      AND draw_time = %s
      AND DATE(timestamp) = CURRENT_DATE
    `;

    // Query 2: Approved cancellations (status = 'approved', today)
    const approvedQuery = `
      SELECT COUNT(DISTINCT ticket_id) as count
      FROM cancellations
      WHERE status = 'approved'
      AND timestamp >= %s
      AND timestamp <= %s
    `;

    // Query 3: Denied cancellations (status = 'denied', today)
    const deniedQuery = `
      SELECT COUNT(DISTINCT ticket_id) as count
      FROM cancellations
      WHERE status = 'denied'
      AND timestamp >= %s
      AND timestamp <= %s
    `;

    // Query 4: Total payout (today)
    const payoutQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payouts
      WHERE timestamp >= %s
      AND timestamp <= %s
    `;

    // Execute all queries in parallel
    const [pendingResult, approvedResult, deniedResult, payoutResult] = await Promise.all([
      executeQuery(pendingQuery, [nextDraw]),
      executeQuery(approvedQuery, [today.start, today.end]),
      executeQuery(deniedQuery, [today.start, today.end]),
      executeQuery(payoutQuery, [today.start, today.end])
    ]);

    const stats = {
      pending: 0,
      approved: 0,
      denied: 0,
      payout: 0
    };

    let successCount = 0;

    // Process results
    if (pendingResult.success && pendingResult.data.length > 0) {
      stats.pending = parseInt(pendingResult.data[0].count) || 0;
      successCount++;
    } else {
      console.error('Failed to fetch pending:', pendingResult.error);
    }

    if (approvedResult.success && approvedResult.data.length > 0) {
      stats.approved = parseInt(approvedResult.data[0].count) || 0;
      successCount++;
    } else {
      console.error('Failed to fetch approved:', approvedResult.error);
    }

    if (deniedResult.success && deniedResult.data.length > 0) {
      stats.denied = parseInt(deniedResult.data[0].count) || 0;
      successCount++;
    } else {
      console.error('Failed to fetch denied:', deniedResult.error);
    }

    if (payoutResult.success && payoutResult.data.length > 0) {
      stats.payout = parseFloat(payoutResult.data[0].total) || 0;
      successCount++;
    } else {
      console.error('Failed to fetch payout:', payoutResult.error);
    }

    // Update connection status
    if (successCount === 4) {
      updateConnectionStatus('connected');
      consecutiveErrors = 0;
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

    console.log('Final stats:', stats);
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

    // Update next draw indicator
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
      apiUrl: config.apiUrl,
      nextDraw: getNextDraw(),
      todayRange: getTodayRange()
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
    getTodayRange,
    getConnectionInfo,
    statsHistory,
    config,
    version: '3.2.1' // Fixed parameter syntax for psycopg2
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
// This script uses the /api/query endpoint with custom SQL queries:
//
// 1. Pending: COUNT(DISTINCT ticket_id) WHERE status='requested'
//    - Filters by next draw time and today's date
//
// 2. Approved: COUNT(DISTINCT ticket_id) WHERE status='approved'
//    - Filters by today's date range
//
// 3. Denied: COUNT(DISTINCT ticket_id) WHERE status='denied'
//    - Filters by today's date range
//
// 4. Payout: SUM(amount) from payouts table
//    - Filters by today's date range
//
// All queries use DISTINCT ticket_id to avoid duplicates
// Date range: today 00:00:00 to 23:59:59
// Timestamp format: YYYY-MM-DD HH:MM:SS (e.g., 2025-10-29 09:43:24)
//
// To test in console:
// - window.dashboardSync.version (should show "3.2.1")
// - window.dashboardSync.getTodayRange() (shows date range being used)
// - window.dashboardSync.getNextDraw() (shows next draw time)
// - window.dashboardSync.getConnectionInfo() (shows all connection details)
// - window.dashboardSync.manualRefresh() (force immediate update)