// ============================================
// Vercel Dashboard Integration
// Receives webhook data and updates UI
// ============================================

// Helper function for status icons
function getStatusIcon(status) {
  const icons = {
    'pending': 'clock',
    'approved': 'check-circle',
    'denied': 'times-circle',
    'total payout': 'money-bill-wave'
  };
  return icons[status] || 'circle';
}

// Store latest data
let latestStats = {
  pending: 0,
  approved: 0,
  denied: 0,
  totalPayout: 0,
  dailyPayout: 0,
  allTimePayout: 0,
  byDraw: {},
  lastUpdate: null
};

// ============================================
// UPDATE DASHBOARD UI
// ============================================

function updateDashboardStats(data) {
  try {
    // Extract data based on action type
    let stats = {};
    
    if (data.action === 'comprehensive_stats') {
      stats = {
        pending: data.data.cancellations.daily.pending,
        approved: data.data.cancellations.daily.approved,
        denied: data.data.cancellations.daily.denied,
        totalPayout: data.data.payouts.daily_total,
        dailyPayout: data.data.payouts.daily_total,
        allTimePayout: data.data.payouts.all_time_total,
        byDraw: data.data.payouts.by_draw,
        cancellationsByDraw: data.data.cancellations.by_draw
      };
    } else if (data.action === 'daily_report') {
      stats = {
        pending: data.data.daily_cancellations.pending,
        approved: data.data.daily_cancellations.approved,
        denied: data.data.daily_cancellations.denied,
        totalPayout: data.data.daily_payout_total,
        dailyPayout: data.data.daily_payout_total
      };
    }
    
    // Update each stat card with animation
    updateStatCard('pending', stats.pending, latestStats.pending);
    updateStatCard('approved', stats.approved, latestStats.approved);
    updateStatCard('denied', stats.denied, latestStats.denied);
    updateStatCard('total payout', stats.totalPayout, latestStats.totalPayout);
    
    // Store latest stats
    latestStats = { ...stats, lastUpdate: new Date() };
    
    // Update last updated timestamp
    updateLastUpdateTime();
    
    console.log('✅ Dashboard updated:', stats);
    
  } catch (error) {
    console.error('❌ Error updating dashboard:', error);
  }
}

function updateStatCard(status, newValue, oldValue) {
  const elementId = `admin-${status}`;
  const element = document.getElementById(elementId);
  
  if (!element) return;
  
  const numberSpan = element.querySelector('.number');
  const trendSpan = element.querySelector('.trend') || element;
  const progressBar = document.getElementById(`progress-${status}`);
  
  // Format value based on type
  let displayValue = newValue;
  if (status === 'total payout') {
    displayValue = `₱${Number(newValue).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  } else {
    displayValue = Number(newValue).toLocaleString();
  }
  
  // Animate number change
  if (numberSpan) {
    animateValue(numberSpan, oldValue || 0, newValue, 1000, status === 'total payout');
  } else {
    element.textContent = displayValue;
  }
  
  // Show trend indicator
  if (oldValue !== undefined && oldValue !== newValue) {
    const diff = newValue - oldValue;
    const trend = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
    const trendClass = diff > 0 ? 'trend-up' : diff < 0 ? 'trend-down' : 'trend-same';
    
    if (trendSpan && trendSpan !== element) {
      trendSpan.textContent = trend;
      trendSpan.className = `trend ${trendClass}`;
      
      // Animate trend
      trendSpan.style.animation = 'none';
      setTimeout(() => {
        trendSpan.style.animation = 'pulse 0.5s ease-in-out';
      }, 10);
    }
  }
  
  // Update progress bar (if exists)
  if (progressBar && status !== 'total payout') {
    const total = (latestStats.pending || 0) + (latestStats.approved || 0) + (latestStats.denied || 0);
    const percentage = total > 0 ? (newValue / total) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressBar.style.transition = 'width 1s ease-in-out';
  }
}

function animateValue(element, start, end, duration, isCurrency = false) {
  const startTime = Date.now();
  const range = end - start;
  
  function update() {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuad = progress => progress * (2 - progress);
    const currentValue = start + (range * easeOutQuad(progress));
    
    if (isCurrency) {
      element.textContent = `₱${currentValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } else {
      element.textContent = Math.round(currentValue).toLocaleString();
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}

function updateLastUpdateTime() {
  const updateElement = document.getElementById('last-update-time');
  if (updateElement && latestStats.lastUpdate) {
    const timeStr = latestStats.lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    updateElement.textContent = `Last updated: ${timeStr}`;
  }
}

// ============================================
// ENHANCED DASHBOARD HTML
// ============================================

function renderEnhancedDashboard() {
  return `
    <div id="dashboardSection" class="section">
      <div class="dashboard-header">
        <h2>📊 Live Dashboard</h2>
        <div id="last-update-time" class="last-update">Waiting for data...</div>
      </div>
      
      <div class="stats-container">
        ${["pending","approved","denied","total payout"].map(status => `
          <div class="stat-card enhanced ${status.replace(' ', '-')}">
            <div class="stat-icon">
              <i class="fas fa-${getStatusIcon(status)}"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
              <div id="admin-${status}" class="stat-value ${status.replace(' ', '-')}">
                <span class="number">0</span>
                <span class="trend" id="trend-${status}"></span>
              </div>
            </div>
            <div class="stat-progress">
              <div class="progress-bar" id="progress-${status}"></div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Per-Draw Breakdown -->
      <div class="draw-breakdown-section">
        <h3>🕐 Per-Draw Breakdown (Today)</h3>
        <div class="draw-cards" id="draw-breakdown">
          ${['10:30', '14:00', '17:00', '20:00', '21:00'].map(drawTime => `
            <div class="draw-card" data-draw="${drawTime}">
              <div class="draw-time">${drawTime}</div>
              <div class="draw-stats">
                <div class="draw-stat">
                  <span class="draw-label">Payouts:</span>
                  <span class="draw-value payout" id="draw-payout-${drawTime}">₱0</span>
                </div>
                <div class="draw-stat">
                  <span class="draw-label">Pending:</span>
                  <span class="draw-value pending" id="draw-pending-${drawTime}">0</span>
                </div>
                <div class="draw-stat">
                  <span class="draw-label">Approved:</span>
                  <span class="draw-value approved" id="draw-approved-${drawTime}">0</span>
                </div>
                <div class="draw-stat">
                  <span class="draw-label">Denied:</span>
                  <span class="draw-value denied" id="draw-denied-${drawTime}">0</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- All-Time Stats -->
      <div class="all-time-stats">
        <h3>📈 All-Time Statistics</h3>
        <div class="all-time-cards">
          <div class="all-time-card">
            <i class="fas fa-coins"></i>
            <div class="all-time-label">Total Payouts</div>
            <div class="all-time-value" id="all-time-payout">₱0</div>
          </div>
          <div class="all-time-card">
            <i class="fas fa-check"></i>
            <div class="all-time-label">Total Approved</div>
            <div class="all-time-value" id="all-time-approved">0</div>
          </div>
          <div class="all-time-card">
            <i class="fas fa-times"></i>
            <div class="all-time-label">Total Denied</div>
            <div class="all-time-value" id="all-time-denied">0</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// UPDATE PER-DRAW BREAKDOWN
// ============================================

function updateDrawBreakdown(data) {
  if (!data.data.payouts || !data.data.payouts.by_draw) return;
  
  const payoutsByDraw = data.data.payouts.by_draw;
  const cancellationsByDraw = data.data.cancellations?.by_draw || {};
  
  Object.entries(payoutsByDraw).forEach(([drawTime, drawData]) => {
    // Update payout
    const payoutEl = document.getElementById(`draw-payout-${drawTime}`);
    if (payoutEl) {
      payoutEl.textContent = `₱${Number(drawData.total_amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    
    // Update cancellations
    const cancellations = cancellationsByDraw[drawTime] || {};
    
    ['pending', 'approved', 'denied'].forEach(status => {
      const el = document.getElementById(`draw-${status}-${drawTime}`);
      if (el) {
        el.textContent = cancellations[status] || 0;
      }
    });
  });
}

// ============================================
// UPDATE ALL-TIME STATS
// ============================================

function updateAllTimeStats(data) {
  if (!data.data.payouts || !data.data.cancellations) return;
  
  // All-time payout
  const allTimePayoutEl = document.getElementById('all-time-payout');
  if (allTimePayoutEl) {
    allTimePayoutEl.textContent = `₱${Number(data.data.payouts.all_time_total).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }
  
  // All-time approved
  const allTimeApprovedEl = document.getElementById('all-time-approved');
  if (allTimeApprovedEl) {
    allTimeApprovedEl.textContent = (data.data.cancellations.all_time?.approved || 0).toLocaleString();
  }
  
  // All-time denied
  const allTimeDeniedEl = document.getElementById('all-time-denied');
  if (allTimeDeniedEl) {
    allTimeDeniedEl.textContent = (data.data.cancellations.all_time?.denied || 0).toLocaleString();
  }
}

// ============================================
// WEBHOOK DATA RECEIVER
// ============================================

// This function should be called when webhook data is received
function handleWebhookData(webhookPayload) {
  console.log('📥 Received webhook data:', webhookPayload.action);
  
  if (webhookPayload.action === 'comprehensive_stats') {
    updateDashboardStats(webhookPayload);
    updateDrawBreakdown(webhookPayload);
    updateAllTimeStats(webhookPayload);
  } else if (webhookPayload.action === 'daily_report') {
    updateDashboardStats(webhookPayload);
  }
}

// ============================================
// POLLING FOR UPDATES (Optional)
// ============================================

// If you want to poll your API for updates
async function pollForUpdates(apiUrl, interval = 60000) {
  async function poll() {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': '200206'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        handleWebhookData(data);
      }
    } catch (error) {
      console.error('❌ Polling error:', error);
    }
  }
  
  // Initial poll
  poll();
  
  // Set up interval
  setInterval(poll, interval);
}

// ============================================
// INITIALIZE
// ============================================

// Call this when your page loads
function initializeDashboard() {
  console.log('🚀 Initializing dashboard...');
  
  // Render dashboard
  const dashboardContainer = document.getElementById('app');
  if (dashboardContainer) {
    dashboardContainer.innerHTML = renderEnhancedDashboard();
  }
  
  // Optional: Start polling for updates every 1 minute
  // pollForUpdates('https://northman-website.vercel.app/api/stats', 60000);
}

// ============================================
// CSS STYLES
// ============================================

const dashboardStyles = `
<style>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.last-update {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-card.pending {
  border-left: 4px solid #f59e0b;
}

.stat-card.approved {
  border-left: 4px solid #10b981;
}

.stat-card.denied {
  border-left: 4px solid #ef4444;
}

.stat-card.total-payout {
  border-left: 4px solid #3b82f6;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.stat-card.pending .stat-icon { color: #f59e0b; }
.stat-card.approved .stat-icon { color: #10b981; }
.stat-card.denied .stat-icon { color: #ef4444; }
.stat-card.total-payout .stat-icon { color: #3b82f6; }

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.trend {
  font-size: 1.25rem;
  font-weight: normal;
}

.trend-up { color: #10b981; }
.trend-down { color: #ef4444; }
.trend-same { color: #6b7280; }

.stat-progress {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 1s ease-in-out;
}

.draw-breakdown-section {
  margin: 2rem 0;
}

.draw-breakdown-section h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.draw-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.draw-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.draw-time {
  font-size: 1.25rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.75rem;
}

.draw-stat {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.draw-stat:last-child {
  border-bottom: none;
}

.draw-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.draw-value {
  font-weight: 600;
}

.draw-value.payout { color: #3b82f6; }
.draw-value.pending { color: #f59e0b; }
.draw-value.approved { color: #10b981; }
.draw-value.denied { color: #ef4444; }

.all-time-stats {
  margin: 2rem 0;
}

.all-time-stats h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.all-time-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.all-time-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.all-time-card i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.all-time-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.all-time-value {
  font-size: 1.75rem;
  font-weight: bold;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
`;

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeDashboard,
    handleWebhookData,
    updateDashboardStats,
    renderEnhancedDashboard,
    pollForUpdates
  };
}