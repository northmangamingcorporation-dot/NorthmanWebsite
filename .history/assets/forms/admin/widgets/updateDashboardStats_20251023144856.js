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
    pollInterval: 5000, // 1 second
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
  // Parse API response
  // ===============================
  function parseApiResponse(response) {
    const stats = {
      pending: 0,
      approved: 0,
      denied: 0,
      payout: 0
    };

    const now = new Date();
    const drawTimes = ['10:30', '14:00', '17:00', '20:00', '21:00'];
    const nextDraw = drawTimes.find(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const drawDate = new Date();
      drawDate.setHours(hours, minutes, 0, 0);
      return drawDate > now;
    });

    if (!nextDraw) return stats;

    let pendingCount = 0;

    if (response.latest_update?.combined_report) {
      const report = response.latest_update.combined_report;
      if (report.comprehensive_stats?.cancellations?.daily) {
        const byDraw = report.comprehensive_stats.cancellations.by_draw || {};
        pendingCount = byDraw[nextDraw]?.pending || 0;
      } else if (report.daily_report) {
        stats.approved = report.daily_report.daily_cancellations?.approved || 0;
        stats.denied = report.daily_report.daily_cancellations?.denied || 0;
        stats.payout = report.daily_report.daily_payout_total || 0;
      }
    } else if (response.data?.cancellations?.daily) {
      pendingCount = response.data.cancellations.daily.pending || 0;
      stats.approved = response.data.cancellations.daily.approved || 0;
      stats.denied = response.data.cancellations.daily.denied || 0;
      stats.payout = response.data.daily_payout_total || 0;
    }

    stats.pending = pendingCount;
    return stats;
  }

  // ===============================
  // Fetch API data
  // ===============================
  async function fetchStats() {
    try {
      const url = `${config.apiUrl}?auth_token=${config.authToken}`;
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error('Error fetching stats:', e.message);
      return null;
    }
  }

  // ===============================
  // Sync dashboard
  // ===============================
  async function syncDashboard() {
    const data = await fetchStats();
    if (!data) return;
    const stats = parseApiResponse(data);
    updateDashboard(stats);

    const lastSyncEl = document.getElementById('last-sync-time');
    if (lastSyncEl) {
      lastSyncEl.textContent = `Last synced: ${new Date().toLocaleTimeString()}`;
    }
  }

  // ===============================
  // Polling
  // ===============================
  function startPolling(interval = config.pollInterval) {
    stopPolling();
    syncDashboard();
    pollTimer = setInterval(syncDashboard, interval);
  }

  function stopPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
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
    statsHistory,
    config
  };

  if (config.autoStart) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startPolling);
    } else {
      startPolling();
    }
  }
})();
