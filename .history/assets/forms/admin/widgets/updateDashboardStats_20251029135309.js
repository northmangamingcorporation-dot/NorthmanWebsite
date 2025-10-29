(function() {
  'use strict';

  console.log('=== Dashboard Sync Script v4.0 (Event-Driven) Loaded ===');

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
    eventsUrl: 'https://api.northman-gaming-corporation.site/api/events/subscribe',
    apiKey: '200206',
    pollInterval: 60000, // 60 seconds (fallback only)
    autoStart: true,
    maxRetries: 3,
    retryDelay: 2000,
    drawTimes: ['10:30', '14:00', '17:00', '20:00', '21:00'],
    useEventStream: true // Use Server-Sent Events instead of polling
  };

  let pollTimer = null;
  let eventSource = null;
  let consecutiveErrors = 0;
  let lastUpdateTime = null;

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
  function updateConnectionStatus(status, mode = 'events') {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;

    const statusMap = {
      connected: { 
        text: mode === 'events' ? '🟢 Live (Events)' : '🟡 Polling', 
        class: 'status-connected' 
      },
      reconnecting: { 
        text: '🟡 Reconnecting...', 
        class: 'status-reconnecting' 
      },
      error: { 
        text: '🔴 Connection Error', 
        class: 'status-error' 
      }
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
    lastUpdateTime = new Date();
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

    return nextDraw || config.drawTimes[0];
  }

  // ===============================
  // Get today's date range
  // ===============================
  function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
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

    // Query 1: Pending cancellations (status = 'requested', today only)
    const pendingQuery = `
      SELECT COUNT(DISTINCT ticket_id) as count
      FROM cancellations
      WHERE status = 'requested' NOT status = 'approved' NOT status = 'denied'
      AND DATE(timestamp) = CURRENT_DATE
    `;

    // Query 2: Approved cancellations (status = 'approved', today)
    const approvedQuery = `
      SELECT COUNT(DISTINCT ticket_id) as count
      FROM cancellations
      WHERE status = 'approved' NOT status = 'requested' NOT status = 'denied'
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
      SELECT COALESCE(SUM(payout_amount), 0) as total
      FROM payouts
      WHERE timestamp >= %s
      AND timestamp <= %s
    `;

    // Execute all queries in parallel
    const [pendingResult, approvedResult, deniedResult, payoutResult] = await Promise.all([
      executeQuery(pendingQuery, []),
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

    if (successCount === 4) {
      consecutiveErrors = 0;
    } else {
      consecutiveErrors++;
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

    const lastSyncEl = document.getElementById('last-sync-time');
    if (lastSyncEl) {
      const now = new Date();
      lastSyncEl.textContent = `Last synced: ${now.toLocaleTimeString()}`;
    }

    const nextDrawEl = document.getElementById('next-draw-time');
    if (nextDrawEl) {
      nextDrawEl.textContent = `Next Draw: ${getNextDraw()}`;
    }
  }

  // ===============================
  // Event Stream (Server-Sent Events)
  // ===============================
  function startEventStream() {
    if (!config.useEventStream) {
      console.log('Event stream disabled, using polling');
      startPolling();
      return;
    }

    stopEventStream();
    console.log('Starting event stream connection...');

    try {
      eventSource = new EventSource(
        `${config.eventsUrl}?api_key=${config.apiKey}`
      );

      eventSource.onopen = () => {
        console.log('✅ Event stream connected');
        updateConnectionStatus('connected', 'events');
        consecutiveErrors = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received event:', data);

          // Handle different event types
          if (data.type === 'update' || data.type === 'change') {
            console.log('🔄 Database change detected, refreshing...');
            syncDashboard();
          } else if (data.type === 'heartbeat') {
            console.log('💓 Heartbeat received');
          }
        } catch (error) {
          console.error('Error parsing event:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ Event stream error:', error);
        consecutiveErrors++;

        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('🔌 Event stream closed, attempting reconnect...');
          updateConnectionStatus('reconnecting');
          
          setTimeout(() => {
            if (consecutiveErrors < 5) {
              startEventStream();
            } else {
              console.log('⚠️  Too many errors, falling back to polling');
              stopEventStream();
              startPolling();
            }
          }, 5000);
        }
      };

      // Initial sync
      syncDashboard();

    } catch (error) {
      console.error('Failed to start event stream:', error);
      console.log('Falling back to polling mode');
      startPolling();
    }
  }

  function stopEventStream() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      console.log('🛑 Event stream stopped');
    }
  }

  // ===============================
  // Polling (Fallback)
  // ===============================
  function startPolling(interval = config.pollInterval) {
    stopPolling();
    console.log(`Starting polling mode (${interval}ms)...`);
    updateConnectionStatus('connected', 'polling');
    
    syncDashboard(); // Initial sync
    pollTimer = setInterval(syncDashboard, interval);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
      console.log('🛑 Polling stopped');
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
      mode: eventSource ? 'events' : (pollTimer ? 'polling' : 'stopped'),
      eventStreamActive: eventSource !== null && eventSource.readyState === EventSource.OPEN,
      pollingActive: pollTimer !== null,
      consecutiveErrors,
      lastUpdateTime: lastUpdateTime ? lastUpdateTime.toISOString() : null,
      pollInterval: config.pollInterval,
      apiUrl: config.apiUrl,
      eventsUrl: config.eventsUrl,
      nextDraw: getNextDraw(),
      todayRange: getTodayRange()
    };
  }

  // ===============================
  // Switch modes
  // ===============================
  function switchToPolling() {
    console.log('Switching to polling mode');
    stopEventStream();
    config.useEventStream = false;
    startPolling();
  }

  function switchToEvents() {
    console.log('Switching to event stream mode');
    stopPolling();
    config.useEventStream = true;
    startEventStream();
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
    startEventStream,
    stopEventStream,
    switchToPolling,
    switchToEvents,
    manualRefresh,
    getCurrentStats,
    getNextDraw,
    getTodayRange,
    getConnectionInfo,
    statsHistory,
    config,
    version: '4.0.1' // Fixed column names
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
        if (config.useEventStream) {
          startEventStream();
        } else {
          startPolling();
        }
      });
    } else {
      console.log('Dashboard sync initialized (immediate)');
      if (config.useEventStream) {
        startEventStream();
      } else {
        startPolling();
      }
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    stopEventStream();
    stopPolling();
  });
})();

// ==============================================
// USAGE NOTES - VERSION 4.0.1 (EVENT-DRIVEN)
// ==============================================
// This version uses Server-Sent Events (SSE) to listen for database changes
// instead of polling every 5 seconds. This dramatically reduces API calls.
//
// Database Schema:
// - Pending: COUNT(DISTINCT ticket_id) WHERE status='requested' (today)
// - Approved: COUNT(DISTINCT ticket_id) WHERE status='approved' (today)
// - Denied: COUNT(DISTINCT ticket_id) WHERE status='denied' (today)
// - Payout: SUM(payout_amount) from payouts table (today)
//
// Note: Since cancellations table doesn't have draw_time column,
// pending shows ALL requested cancellations for today, not per-draw.
//
// Features:
// - Uses /api/events/subscribe endpoint for real-time updates
// - Automatically falls back to polling if events fail
// - Polls at 60-second intervals (fallback mode only)
// - Reconnects automatically on connection loss
// - Shows connection mode in status indicator
//
// Console commands:
// - window.dashboardSync.version (should show "4.0.1")
// - window.dashboardSync.getConnectionInfo() (shows mode: events/polling)
// - window.dashboardSync.switchToPolling() (force polling mode)
// - window.dashboardSync.switchToEvents() (force event stream mode)
// - window.dashboardSync.manualRefresh() (force immediate update)