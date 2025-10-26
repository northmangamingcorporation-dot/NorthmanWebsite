// ============================================
// ANALYTICS MODULE - HTTPS COMPATIBLE
// ============================================
// assets\forms\widgets\analytics.js
// Add at the very top of analytics.js, before ANALYTICS_CONFIG
const logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`)
};

const ANALYTICS_CONFIG = {
    // Change to HTTPS - You MUST configure your server for HTTPS first
    API_URL: 'https://raspberrypi.tail2aed63.ts.net/analytics/dashboard',
    API_KEY: '200206',
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
        // Wait for analytics section to be visible AND containers to exist
        const maxAttempts = 10;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            const analyticsSection = document.getElementById('analyticsSection');
            const cancellationContainer = document.getElementById('cancellationAnalytics');
            
            if (analyticsSection && 
                analyticsSection.style.display !== 'none' && 
                cancellationContainer) {
                console.log(`✅ Analytics section ready after ${attempts} attempts`);
                break;
            }
            
            console.log(`⏳ Waiting for analytics section... (attempt ${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (attempts >= maxAttempts) {
            throw new Error('Analytics section failed to load after 1 second');
        }
        
        // Verify all containers exist
        const containers = [
            'cancellationAnalytics',
            'payoutAnalytics',
            'deviceChangeAnalytics',
            'serverErrorAnalytics',
            'ticketVerificationAnalytics',
            'boothActivityAnalytics'
        ];
        
        const missingContainers = containers.filter(id => !document.getElementById(id));
        if (missingContainers.length > 0) {
            throw new Error(`Missing containers: ${missingContainers.join(', ')}`);
        }
        
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
        
        console.log('✅ Analytics loaded successfully');
        
    } catch (error) {
        console.error('Analytics error:', error);
        showAnalyticsError('Failed to load analytics: ' + error.message);
        if (typeof showNotification === 'function') {
            showNotification('Failed to load analytics', 'error');
        }
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
        console.warn('Server error analytics container not found');
        return;
    }
    
    container.innerHTML = `
        <div class="analytics-section">
            <div class="section-header">
                <h4>
                    <i class="fas fa-exclamation-triangle"></i>
                    Server Errors & Issues
                </h4>
                <span class="section-badge">${data.last_24h} in last 24h</span>
            </div>
            
            <div class="analytics-summary">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-server"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Errors</h4>
                        <div class="metric-value error">${data.total.toLocaleString()}</div>
                        <div class="metric-subtext">All recorded</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-list"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Error Types</h4>
                        <div class="metric-value warning">${data.by_type.length}</div>
                        <div class="metric-subtext">Unique categories</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Errors by Type</h5>
                    <canvas id="serverErrorChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h5>30-Day Error Trend</h5>
                    <canvas id="serverErrorTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Render charts
    if (data.by_type && data.by_type.length > 0) {
        renderBarChart('serverErrorChart', data.by_type, 'type', 'count', ANALYTICS_CONFIG.CHART_COLORS.error);
    }
    
    if (data.trend && data.trend.length > 0) {
        renderLineChart('serverErrorTrendChart', data.trend, 'date', 'count', ANALYTICS_CONFIG.CHART_COLORS.warning);
    }
}

// ============================================
// TICKET VERIFICATION ANALYTICS
// ============================================

function renderTicketVerificationAnalytics(data) {
    const container = document.getElementById('ticketVerificationAnalytics');
    
    if (!container) {
        console.warn('Ticket verification analytics container not found');
        return;
    }
    
    container.innerHTML = `
        <div class="analytics-section">
            <div class="section-header">
                <h4>
                    <i class="fas fa-search"></i>
                    Ticket Verifications
                </h4>
                <span class="section-badge">${data.last_24h} in last 24h</span>
            </div>
            
            <div class="analytics-summary">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Verifications</h4>
                        <div class="metric-value info">${data.total.toLocaleString()}</div>
                        <div class="metric-subtext">All requests</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Top 10 Booths by Verification Requests</h5>
                    <canvas id="verificationChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h5>30-Day Verification Trend</h5>
                    <canvas id="verificationTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Render charts
    if (data.top_booths && data.top_booths.length > 0) {
        renderBarChart('verificationChart', data.top_booths, 'booth', 'count', ANALYTICS_CONFIG.CHART_COLORS.info);
    }
    
    if (data.trend && data.trend.length > 0) {
        renderLineChart('verificationTrendChart', data.trend, 'date', 'count', ANALYTICS_CONFIG.CHART_COLORS.primary);
    }
}

// ============================================
// BOOTH ACTIVITY ANALYTICS
// ============================================

function renderBoothActivityAnalytics(data) {
    const container = document.getElementById('boothActivityAnalytics');
    
    if (!container) {
        console.warn('Booth activity analytics container not found');
        return;
    }
    
    const latest = data.latest || { active: 0, inactive: 0, affected_operators: 0, period_hours: 0 };
    const inactivePercentage = latest.active > 0 ? ((latest.inactive / latest.active) * 100).toFixed(1) : 0;
    
    container.innerHTML = `
        <div class="analytics-section">
            <div class="section-header">
                <h4>
                    <i class="fas fa-store"></i>
                    Booth Activity Analysis
                </h4>
                <span class="section-badge">${data.files_processed} analyses run</span>
            </div>
            
            <div class="analytics-summary">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Active Booths</h4>
                        <div class="metric-value success">${latest.active.toLocaleString()}</div>
                        <div class="metric-subtext">Latest analysis</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Inactive Booths</h4>
                        <div class="metric-value error">${latest.inactive.toLocaleString()}</div>
                        <div class="metric-subtext">${inactivePercentage}% of total</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Affected Operators</h4>
                        <div class="metric-value warning">${latest.affected_operators}</div>
                        <div class="metric-subtext">With inactive booths</div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Analysis Period</h4>
                        <div class="metric-value purple">${latest.period_hours}h</div>
                        <div class="metric-subtext">Last check</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid full-width">
                <div class="chart-container">
                    <h5>30-Day Inactive Booth Trend</h5>
                    <canvas id="boothActivityTrendChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Render chart
    if (data.trend && data.trend.length > 0) {
        renderLineChart('boothActivityTrendChart', data.trend, 'date', 'inactive', ANALYTICS_CONFIG.CHART_COLORS.error);
    }
}

// ============================================
// CHART RENDERING FUNCTIONS
// ============================================

function renderBarChart(canvasId, data, labelKey, valueKey, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (analyticsCharts[canvasId]) {
        analyticsCharts[canvasId].destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    analyticsCharts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d[labelKey] || 'N/A'),
            datasets: [{
                label: 'Count',
                data: data.map(d => d[valueKey] || 0),
                backgroundColor: color + '99', // Add transparency
                borderColor: color,
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: color,
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return valueKey === 'amount' 
                                ? '₱' + context.parsed.y.toLocaleString()
                                : context.parsed.y.toLocaleString() + ' ' + valueKey;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return valueKey === 'amount' 
                                ? '₱' + value.toLocaleString()
                                : value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function renderLineChart(canvasId, data, labelKey, valueKey, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (analyticsCharts[canvasId]) {
        analyticsCharts[canvasId].destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    analyticsCharts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => {
                const date = new Date(d[labelKey]);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: valueKey.charAt(0).toUpperCase() + valueKey.slice(1),
                data: data.map(d => d[valueKey] || 0),
                borderColor: color,
                backgroundColor: color + '33', // Add transparency
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: color,
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: color,
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return valueKey === 'amount' 
                                ? '₱' + context.parsed.y.toLocaleString()
                                : context.parsed.y.toLocaleString() + ' ' + valueKey;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return valueKey === 'amount' 
                                ? '₱' + value.toLocaleString()
                                : value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoadingState(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="analytics-loading">
            <div class="loading-spinner"></div>
            <span>Loading analytics data...</span>
        </div>
    `;
}

function showAnalyticsError(message) {
    const section = document.getElementById('analyticsSection');
    if (!section) return;
    
    section.innerHTML = `
        <div class="analytics-error">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Failed to Load Analytics</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="loadAdvancedAnalytics()">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

function updateAnalyticsTimestamp(timestamp) {
    const container = document.getElementById('analyticsTimestamp');
    if (!container) return;
    
    const date = new Date(timestamp);
    container.textContent = `Last updated: ${date.toLocaleTimeString()}`;
}

function scheduleAnalyticsRefresh() {
    // Clear existing timer
    if (analyticsRefreshTimer) {
        clearTimeout(analyticsRefreshTimer);
    }
    
    // Schedule next refresh
    analyticsRefreshTimer = setTimeout(() => {
        console.log('🔄 Auto-refreshing analytics...');
        loadAdvancedAnalytics();
    }, ANALYTICS_CONFIG.REFRESH_INTERVAL);
}

// ============================================
// INITIALIZATION
// ============================================

// Track if analytics have been loaded
let analyticsLoaded = false;
let analyticsLoadingPromise = null;

// Auto-load analytics when analytics section is shown
function initializeAnalytics() {
    const analyticsBtn = document.querySelector('.sidebar-btn[data-section="analytics"]');
    
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', () => {
            // Prevent multiple simultaneous loads
            if (analyticsLoadingPromise) {
                console.log('⏳ Analytics already loading, skipping...');
                return;
            }
            
            // Use setTimeout to ensure section is visible
            setTimeout(() => {
                const analyticsSection = document.getElementById('analyticsSection');
                if (analyticsSection && analyticsSection.style.display !== 'none' && !analyticsLoaded) {
                    analyticsLoadingPromise = loadAdvancedAnalytics()
                        .then(() => {
                            analyticsLoaded = true;
                            analyticsLoadingPromise = null;
                        })
                        .catch(error => {
                            console.error('Failed to load analytics:', error);
                            analyticsLoadingPromise = null;
                        });
                }
            }, 400); // Increased delay to ensure DOM is ready
        });
    }
}

// Call this when dashboard loads
document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
});

// Export for global access
window.loadAdvancedAnalytics = loadAdvancedAnalytics;