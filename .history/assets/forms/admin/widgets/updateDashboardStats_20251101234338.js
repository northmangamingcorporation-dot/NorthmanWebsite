(function() {
  'use strict';

  console.log('=== Dashboard Sync Script v4.2 (Auto Real-Time) Loaded ===');

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
    metricsUrl: 'https://api.northman-gaming-corporation.site/api/dashboard/metrics/current',
    apiKey: '200206',
    pollInterval: 60000, // 60 seconds (fallback only)
    autoStart: true,
    maxRetries: 3,
    retryDelay: 2000,
    drawTimes: ['10:30', '14:00', '17:00', '20:00', '21:00'],
    useEventStream: true,
    instantUpdate: true // NEW: Update stats immediately without waiting
  };

  let pollTimer = null;
  let eventSource = null;
  let consecutiveErrors = 0;
  let lastUpdateTime = null;

  // ===============================
  // Update a single stat card (INSTANT)
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

    const oldValue = statsHistory[status];

    // INSTANT UPDATE - No delay, no animation blocking
    if (status === 'payout') {
      numberEl.textContent = `₱${newValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    } else {
      numberEl.textContent = newValue.toLocaleString();
    }

    // Add subtle animation AFTER update (non-blocking)
    if (oldValue !== newValue) {
      numberEl.classList.add('value-changed');
      setTimeout(() => numberEl.classList.remove('value-changed'), 600);
      
      // Log the change
      const changeAmount = newValue - oldValue;
      const changeSign = changeAmount > 0 ? '+' : '';
      
      if (status === 'payout') {
        console.log(`💰 ${status}: ₱${newValue.toFixed(2)} (${changeSign}₱${changeAmount.toFixed(2)})`);
      } else {
        console.log(`📊 ${status}: ${newValue} (${changeSign}${changeAmount})`);
      }
    }

    // Store value
    statsHistory[status] = newValue;
  }

  // ===============================
  // Update connection status indicator
  // ===============================
  function updateConnectionStatus(status, mode = 'events') {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;

    const statusMap = {
      connected: { 
        text: mode === 'events' ? '🟢 Live (Real-Time)' : '🟡 Polling', 
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
  // Update all stats (INSTANT)
  // ===============================
  function updateDashboard(stats) {
    console.log('⚡ Instant update:', stats);
    
    // Update all stats immediately
    Object.entries(stats).forEach(([status, value]) => {
      if (['pending', 'approved', 'denied', 'payout'].includes(status)) {
        updateStatCard(status, value);
      }
    });
    
    lastUpdateTime = new Date();
    
    // Update timestamp
    const lastSyncEl = document.getElementById('last-sync-time');
    if (lastSyncEl) {
      lastSyncEl.textContent = `Last synced: ${lastUpdateTime.toLocaleTimeString()}`;
    }
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
  // Fetch metrics from API
  // ===============================
  async function fetchMetricsFromAPI(retryCount = 0) {
    try {
      const response = await fetch(config.metricsUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.metrics) {
        return { success: true, data: data.metrics };
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error(`API error (attempt ${retryCount + 1}/${config.maxRetries}):`, error.message);

      if (retryCount < config.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return fetchMetricsFromAPI(retryCount + 1);
      }

      return { success: false, error: error.message };
    }
  }

  // ===============================
  // Sync dashboard
  // ===============================
  async function syncDashboard() {
    const result = await fetchMetricsFromAPI();
    
    if (result.success) {
      consecutiveErrors = 0;
      updateDashboard(result.data);
    } else {
      consecutiveErrors++;
      console.error('Failed to sync dashboard:', result.error);
    }

    const nextDrawEl = document.getElementById('next-draw-time');
    if (nextDrawEl) {
      nextDrawEl.textContent = `Next Draw: ${getNextDraw()}`;
    }
  }

  // ===============================
  // Event Stream (REAL-TIME)
  // ===============================
  function startEventStream() {
    if (!config.useEventStream) {
      console.log('Event stream disabled, using polling');
      startPolling();
      return;
    }

    stopEventStream();
    console.log('🚀 Starting real-time event stream...');

    try {
      eventSource = new EventSource(
        `${config.eventsUrl}?api_key=${config.apiKey}`
      );

      eventSource.onopen = () => {
        console.log('✅ Real-time connection established!');
        updateConnectionStatus('connected', 'events');
        consecutiveErrors = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle real-time updates
          if (data.type === 'dashboard_update') {
            console.log('🔔 REAL-TIME UPDATE RECEIVED!');
            
            if (data.metrics) {
              // INSTANT UPDATE - No delay
              console.log('⚡ Instant metrics update:', data.metrics);
              updateDashboard(data.metrics);
              
              // Log changes if available
              if (data.changes) {
                Object.entries(data.changes).forEach(([key, change]) => {
                  console.log(`   ${key}: ${change.previous} → ${change.current} (${change.change > 0 ? '+' : ''}${change.change})`);
                });
              }
            }
            
          } else if (data.type === 'update' || data.type === 'change') {
            console.log('🔄 Database change detected');
            
            // Parse embedded metrics if available
            let updateData = data.payload;
            if (typeof updateData === 'string') {
              try {
                updateData = JSON.parse(updateData);
              } catch (e) {
                // Not JSON
              }
            }
            
            if (updateData && updateData.metrics) {
              console.log('⚡ Embedded metrics found, instant update');
              updateDashboard(updateData.metrics);
            } else {
              // Fetch fresh data
              console.log('🔄 Fetching fresh data...');
              syncDashboard();
            }
            
          } else if (data.type === 'heartbeat') {
            // Silent heartbeat
          } else if (data.type === 'connected') {
            console.log('🔗 Client ID:', data.client_id);
          }
        } catch (error) {
          console.error('Error parsing event:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ Event stream error');
        consecutiveErrors++;

        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('🔌 Connection closed, reconnecting...');
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
    
    syncDashboard();
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
    console.log('🔄 Manual refresh');
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
      mode: eventSource ? 'real-time' : (pollTimer ? 'polling' : 'stopped'),
      eventStreamActive: eventSource !== null && eventSource.readyState === EventSource.OPEN,
      pollingActive: pollTimer !== null,
      consecutiveErrors,
      lastUpdateTime: lastUpdateTime ? lastUpdateTime.toISOString() : null,
      apiUrl: config.apiUrl,
      eventsUrl: config.eventsUrl,
      metricsUrl: config.metricsUrl,
      instantUpdate: config.instantUpdate
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
    startEventStream,
    stopEventStream,
    manualRefresh,
    getCurrentStats,
    getConnectionInfo,
    statsHistory,
    config,
    version: '4.2.0' // Auto real-time with instant updates
  };

  // ===============================
  // Auto-start
  // ===============================
  if (config.autoStart) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('📊 Dashboard initialized (DOMContentLoaded)');
        startEventStream();
      });
    } else {
      console.log('📊 Dashboard initialized (immediate)');
      startEventStream();
    }
  }

  // Cleanup
  window.addEventListener('beforeunload', () => {
    stopEventStream();
    stopPolling();
  });
})();