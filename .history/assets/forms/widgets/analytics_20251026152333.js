// ============================================
// ANALYTICS MODULE
// ============================================

const ANALYTICS_CONFIG = {
    API_URL: 'http://raspberrypi.tail2aed63.ts.net:5000/analytics/dashboard',
    API_KEY: 'YOUR_API_KEY_HERE', // Replace with your actual API key
    REFRESH_INTERVAL: 300000, // 5 minutes
    CHART_COLORS: {
        primary: 'rgb(59, 130, 246)',
        success: 'rgb(16, 185, 129)',
        warning: 'rgb(245, 158, 11)',
        error: 'rgb(239, 68, 68)',
        info: 'rgb(6, 182, 212)',
        purple: 'rgb(139, 92, 246)'
    }
};

let analyticsCharts = {};
let analyticsRefreshTimer = null;

// ============================================
// MAIN ANALYTICS LOADER
// ============================================

async function loadAdvancedAnalytics() {
    try {
        showLoadingState('analyticsSection');
        
        const response = await fetch(ANALYTICS_CONFIG.API_URL, {
            headers: {
                'X-API-Key': ANALYTICS_CONFIG.API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Render all analytics sections
        renderCancellationAnalytics(data.cancellations);
        renderPayoutAnalytics(data.payouts);
        renderDeviceChangeAnalytics(data.device_changes);
        renderServerErrorAnalytics(data.server_errors);
        renderTicketVerificationAnalytics(data.ticket_verifications);
        renderBoothActivityAnalytics(data.booth_activity);
        
        // Update timestamp
        updateAnalyticsTimestamp(data.timestamp);
        
        // Schedule next refresh
        scheduleAnalyticsRefresh();
        
        logger.info('✅ Analytics loaded successfully');
        
    } catch (error) {
        console.error('Analytics error:', error);
        showAnalyticsError('Failed to load analytics: ' + error.message);
        showNotification('Failed to load analytics', 'error');
    }
}

// ============================================
// CANCELLATION ANALYTICS
// ============================================

function renderCancellationAnalytics(data) {
    const container = document.getElementById('cancellationAnalytics');
    
    if (!container) {
        console.warn('Cancellation analytics container not found');
        return;
    }
    
    container.innerHTML = `
        <div class="analytics-section">
            <div class="section-header">
                <h4>
                    <i class="fas fa-times-circle"></i>
                    Ticket Cancellations
                </h4>
                <span class="section-badge">${data.last_24h} in last 24h</span>
            </div>
            
            <div class="analytics-summary">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Cancellations</h4>
                        <div class="metric-value">${data.total.toLocaleString()}</div>
                        <div class="metric-subtext">All time</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Approved</h4>
                        <div class="metric-value success">${data.by_status.approved || 0}</div>
                        <div class="metric-subtext">${data.approval_rate}% approval rate</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Denied</h4>
                        <div class="metric-value error">${data.by_status.rejected || data.by_status.denied || 0}</div>
                        <div class="metric-subtext">Rejected requests</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Pending</h4>
                        <div class="metric-value warning">${data.by_status.requested || 0}</div>
                        <div class="metric-subtext">Awaiting review</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Top 10 Operators by Cancellations</h5>
                    <canvas id="cancellationChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h5>30-Day Cancellation Trend</h5>
                    <canvas id="cancellationTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Render charts
    if (data.top_operators && data.top_operators.length > 0) {
        renderBarChart('cancellationChart', data.top_operators, 'booth', 'count', ANALYTICS_CONFIG.CHART_COLORS.primary);
    }
    
    if (data.trend && data.trend.length > 0) {
        renderLineChart('cancellationTrendChart', data.trend, 'date', 'count', ANALYTICS_CONFIG.CHART_COLORS.success);
    }
}

// ============================================
// PAYOUT ANALYTICS
// ============================================

function renderPayoutAnalytics(data) {
    const container = document.getElementById('payoutAnalytics');
    
    if (!container) {
        console.warn('Payout analytics container not found');
        return;
    }
    
    container.innerHTML = `
        <div class="analytics-section">
            <div class="section-header">
                <h4>
                    <i class="fas fa-money-bill-wave"></i>
                    Ticket Payouts
                </h4>
                <span class="section-badge">₱${data.last_24h.amount.toLocaleString()} today</span>
            </div>
            
            <div class="analytics-summary">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Payouts</h4>
                        <div class="metric-value">${data.total.toLocaleString()}</div>
                        <div class="metric-subtext">All time</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Amount</h4>
                        <div class="metric-value warning">₱${data.total_amount.toLocaleString()}</div>
                        <div class="metric-subtext">All payouts</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Average Payout</h4>
                        <div class="metric-value info">₱${data.average_amount.toLocaleString()}</div>
                        <div class="metric-subtext">Per ticket</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Last 24h</h4>
                        <div class="metric-value purple">${data.last_24h.count}</div>
                        <div class="metric-subtext">Recent payouts</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Top 10 Outlets by Payout Amount</h5>
                    <canvas id="payoutChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h5>30-Day Payout Trend</h5>
                    <canvas id="payoutTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Render charts
    if (data.top_outlets && data.top_outlets.length > 0) {
        renderBarChart('payoutChart', data.top_outlets, 'outlet', 'amount', ANALYTICS_CONFIG.CHART_COLORS.warning);
    }
    
    if (data.trend && data.trend.length > 0) {
        renderLineChart('payoutTrendChart', data.trend, 'date', 'amount', ANALYTICS_CONFIG.CHART_COLORS.success);
    }
}

// ============================================
// DEVICE CHANGE ANALYTICS
// ============================================

function renderDeviceChangeAnalytics(data) {
    const container = document.getElementById('deviceChangeAnalytics');
    
    if (!container) {
        console.warn('Device change analytics container not found');
        return;
    }
    
    const phoneCount = data.by_type.phone || 0;
    const posCount = data.by_type.pos || 0;
    
    container.innerHTML = `
        <div class="analytics-section">
            <div class="section-header">
                <h4>
                    <i class="fas fa-mobile-alt"></i>
                    Device ID Changes
                </h4>
                <span class="section-badge">${data.last_24h} in last 24h</span>
            </div>
            
            <div class="analytics-summary">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Requests</h4>
                        <div class="metric-value">${data.total.toLocaleString()}</div>
                        <div class="metric-subtext">All time</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Phone Users</h4>
                        <div class="metric-value" style="color: #ec4899;">${phoneCount}</div>
                        <div class="metric-subtext">${((phoneCount/data.total)*100).toFixed(1)}% of total</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-desktop"></i>
                    </div>
                    <div class="metric-content">
                        <h4>POS Users</h4>
                        <div class="metric-value purple">${posCount}</div>
                        <div class="metric-subtext">${((posCount/data.total)*100).toFixed(1)}% of total</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Top 10 Operators by Device Changes</h5>
                    <canvas id="deviceChangeChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h5>30-Day Device Change Trend</h5>
                    <canvas id="deviceChangeTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Render charts
    if (data.top_operators && data.top_operators.length > 0) {
        renderBarChart('deviceChangeChart', data.top_operators, 'operator', 'count', ANALYTICS_CONFIG.CHART_COLORS.purple);
    }
    
    if (data.trend && data.trend.length > 0) {
        renderLineChart('deviceChangeTrendChart', data.trend, 'date', 'count', ANALYTICS_CONFIG.CHART_COLORS.info);
    }
}

// ============================================
// SERVER ERROR ANALYTICS
// ============================================

function renderServerErrorAnalytics(data) {
    const container = document.getElementById('serverErrorAnalytics');
    
    if (!container) {
        console