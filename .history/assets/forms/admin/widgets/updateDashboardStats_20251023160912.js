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
      // Check if we have the new by_draw_summary format
      if (response.by_draw_summary && Array.isArray(response.by_draw_summary)) {
        const nextDraw = getNextDraw();
        const nextDrawData = response.by_draw_summary.find(d => d.draw_time === nextDraw);
        
        if (nextDrawData) {
          stats.pending = nextDrawData.pending_today || 0;
          stats.approved = nextDrawData.approved_today || 0;
          stats.denied = nextDrawData.denied_today || 0;
          stats.payout = nextDrawData.payout || 0;
          return stats;
        }
      }

      // Fallback: Check latest_update.combined_report format
      if (response.latest_update?.combined_report) {
        const report = response.latest_update.combined_report;
        
        // Try comprehensive_stats with by_draw
        if (report.comprehensive_stats) {
          const nextDraw = getNextDraw();
          
          // Get cancellation data by draw
          const cancelByDraw = report.comprehensive_stats.cancellations?.by_draw?.[nextDraw];
          if (cancelByDraw) {
            stats.pending = cancelByDraw.pending || 0;
            stats.approved = cancelByDraw.approved || 0;
            stats.denied = cancelByDraw.denied || 0;
          } else if (report.comprehensive_stats.cancellations?.daily) {
            // Fallback to daily totals
            stats.pending = report.comprehensive_stats.cancellations.daily.pending || 0;
            stats.approved = report.comprehensive_stats.cancellations.daily.approved || 0;
            stats.denied = report.comprehensive_stats.cancellations.daily.denied || 0;
          }
          
          // Get payout data by draw
          const payoutByDraw = report.comprehensive_stats.payouts?.by_draw?.[nextDraw];
          if (payoutByDraw) {
            stats.payout = payoutByDraw.total_amount || 0;
          } else {
            stats.payout = report.comprehensive_stats.payouts?.daily_total || 0;
          }
        }
        // Fallback to daily_report
        else if (report.daily_report) {
          stats.pending = report.daily_report.daily_cancellations?.pending || 0;
          stats.approved = report.daily_report.daily_cancellations?.approved || 0;
          stats.denied = report.daily_report.daily_cancellations?.denied || 0;
          stats.payout = report.daily_report.daily_payout_total || 0;
        }
      }
      // Legacy format fallback
      else if (response.data?.cancellations?.daily) {
        stats.pending = response.data.cancellations.daily.pending || 0;
        stats.approved = response.data.cancellations.daily.approved || 0;
        stats.denied = response.data.cancellations.daily.denied || 0;
        stats.payout = response.data.daily_payout_total || 0;
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

