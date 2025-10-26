// ============================================
// STANDALONE ANALYTICS MODULE - ADVANCED ERROR-PROOF VERSION
// ============================================
// Just insert this entire module into any container element
// Usage: <div id="analyticsWidget"></div>

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        API_URL: 'https://raspberrypi.tail2aed63.ts.net/analytics/dashboard',
        API_KEY: '200206',
        REFRESH_INTERVAL: 300000, // 5 minutes
        MAX_RETRIES: 3,
        RETRY_DELAY: 2000,
        REQUEST_TIMEOUT: 30000,
        CACHE_DURATION: 60000, // 1 minute cache
        CONTAINER_ID: 'analyticsWidget', // Change this to match your container ID
        CHART_COLORS: {
            primary: 'rgb(59, 130, 246)',
            success: 'rgb(16, 185, 129)',
            warning: 'rgb(245, 158, 11)',
            error: 'rgb(239, 68, 68)',
            info: 'rgb(6, 182, 212)',
            purple: 'rgb(139, 92, 246)'
        }
    };
    
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    const state = {
        charts: {},
        refreshTimer: null,
        loaded: false,
        loading: false,
        lastSuccessfulData: null,
        lastFetchTime: 0,
        retryCount: 0,
        abortController: null
    };
    
    // ============================================
    // LOGGER
    // ============================================
    
    const logger = {
        info: (msg) => console.log(`[ANALYTICS INFO] ${new Date().toISOString()} ${msg}`),
        error: (msg) => console.error(`[ANALYTICS ERROR] ${new Date().toISOString()} ${msg}`),
        warn: (msg) => console.warn(`[ANALYTICS WARN] ${new Date().toISOString()} ${msg}`)
    };
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function safeGet(obj, path, defaultValue = null) {
        try {
            return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
        } catch {
            return defaultValue;
        }
    }
    
    function formatNumber(num, decimals = 0) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        return Number(num).toLocaleString('en-US', { 
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals 
        });
    }
    
    function formatCurrency(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) return '₱0';
        return '₱' + formatNumber(amount, 2);
    }
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function sanitizeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // ============================================
    // NETWORK FUNCTIONS
    // ============================================
    
    async function fetchWithTimeout(url, options = {}, timeout = CONFIG.REQUEST_TIMEOUT) {
        const controller = new AbortController();
        state.abortController = controller;
        
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }
    
    async function fetchAnalyticsData(retryCount = 0) {
        try {
            logger.info(`Fetching analytics data (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
            
            const response = await fetchWithTimeout(
                CONFIG.API_URL,
                {
                    method: 'GET',
                    headers: {
                        'X-API-Key': CONFIG.API_KEY,
                        'Accept': 'application/json'
                    },
                    cache: 'no-cache'
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!validateData(data)) {
                throw new Error('Invalid data structure');
            }
            
            state.lastSuccessfulData = data;
            state.lastFetchTime = Date.now();
            state.retryCount = 0;
            
            logger.info('Analytics data fetched successfully');
            return data;
            
        } catch (error) {
            logger.error(`Fetch failed: ${error.message}`);
            
            if (retryCount < CONFIG.MAX_RETRIES - 1) {
                const delay = CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
                logger.warn(`Retrying in ${delay}ms...`);
                await sleep(delay);
                return fetchAnalyticsData(retryCount + 1);
            }
            
            if (state.lastSuccessfulData) {
                logger.warn('Using cached data due to fetch failure');
                return state.lastSuccessfulData;
            }
            
            throw error;
        }
    }
    
    function validateData(data) {
        if (!data || typeof data !== 'object') return false;
        
        const requiredSections = [
            'cancellations', 'payouts', 'device_changes',
            'server_errors', 'ticket_verifications', 'booth_activity'
        ];
        
        return requiredSections.every(section => data.hasOwnProperty(section));
    }
    
    // ============================================
    // CHART RENDERING
    // ============================================
    
    function destroyChart(canvasId) {
        if (state.charts[canvasId]) {
            try {
                state.charts[canvasId].destroy();
                delete state.charts[canvasId];
            } catch (e) {
                logger.warn(`Failed to destroy chart ${canvasId}: ${e.message}`);
            }
        }
    }
    
    function renderBarChart(canvasId, data, labelKey, valueKey, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !Array.isArray(data) || data.length === 0) return;
        
        try {
            destroyChart(canvasId);
            const ctx = canvas.getContext('2d');
            
            state.charts[canvasId] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(d => sanitizeHTML(d[labelKey]) || 'N/A'),
                    datasets: [{
                        label: 'Count',
                        data: data.map(d => Number(d[valueKey]) || 0),
                        backgroundColor: color + '99',
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
                        legend: { display: false },
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
                                        ? formatCurrency(context.parsed.y)
                                        : formatNumber(context.parsed.y) + ' ' + valueKey;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                font: { size: 11 },
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: {
                                font: { size: 11 },
                                callback: function(value) {
                                    return valueKey === 'amount' 
                                        ? formatCurrency(value)
                                        : formatNumber(value);
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            logger.error(`Failed to render bar chart ${canvasId}: ${error.message}`);
        }
    }
    
    function renderLineChart(canvasId, data, labelKey, valueKey, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !Array.isArray(data) || data.length === 0) return;
        
        try {
            destroyChart(canvasId);
            const ctx = canvas.getContext('2d');
            
            state.charts[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => {
                        try {
                            const date = new Date(d[labelKey]);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        } catch {
                            return 'N/A';
                        }
                    }),
                    datasets: [{
                        label: valueKey.charAt(0).toUpperCase() + valueKey.slice(1),
                        data: data.map(d => Number(d[valueKey]) || 0),
                        borderColor: color,
                        backgroundColor: color + '33',
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
                        legend: { display: false },
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
                                        ? formatCurrency(context.parsed.y)
                                        : formatNumber(context.parsed.y) + ' ' + valueKey;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11 } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: {
                                font: { size: 11 },
                                callback: function(value) {
                                    return valueKey === 'amount' 
                                        ? formatCurrency(value)
                                        : formatNumber(value);
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            logger.error(`Failed to render line chart ${canvasId}: ${error.message}`);
        }
    }
    
    // ============================================
    // RENDER SECTIONS
    // ============================================
    
    function renderCancellationAnalytics(data, container) {
        try {
            const total = safeGet(data, 'total', 0);
            const last24h = safeGet(data, 'last_24h', 0);
            const approved = safeGet(data, 'by_status.approved', 0);
            const denied = safeGet(data, 'by_status.rejected', safeGet(data, 'by_status.denied', 0));
            const pending = safeGet(data, 'by_status.requested', 0);
            const approvalRate = safeGet(data, 'approval_rate', 0);
            
            container.innerHTML = `
                <div class="analytics-section">
                    <div class="section-header">
                        <h4><i class="fas fa-times-circle"></i> Ticket Cancellations</h4>
                        <span class="section-badge">${formatNumber(last24h)} in last 24h</span>
                    </div>
                    <div class="analytics-summary">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                                <i class="fas fa-clipboard-list"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Cancellations</h4>
                                <div class="metric-value">${formatNumber(total)}</div>
                                <div class="metric-subtext">All time</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Approved</h4>
                                <div class="metric-value success">${formatNumber(approved)}</div>
                                <div class="metric-subtext">${formatNumber(approvalRate, 1)}% approval rate</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                <i class="fas fa-times-circle"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Denied</h4>
                                <div class="metric-value error">${formatNumber(denied)}</div>
                                <div class="metric-subtext">Rejected requests</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Pending</h4>
                                <div class="metric-value warning">${formatNumber(pending)}</div>
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
            
            const topOperators = safeGet(data, 'top_operators', []);
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(topOperators) && topOperators.length > 0) {
                renderBarChart('cancellationChart', topOperators, 'booth', 'count', CONFIG.CHART_COLORS.primary);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                renderLineChart('cancellationTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.success);
            }
        } catch (error) {
            logger.error(`Cancellation render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render cancellation analytics</div>';
        }
    }
    
    function renderPayoutAnalytics(data, container) {
        try {
            const total = safeGet(data, 'total', 0);
            const totalAmount = safeGet(data, 'total_amount', 0);
            const averageAmount = safeGet(data, 'average_amount', 0);
            const last24hCount = safeGet(data, 'last_24h.count', 0);
            const last24hAmount = safeGet(data, 'last_24h.amount', 0);
            
            container.innerHTML = `
                <div class="analytics-section">
                    <div class="section-header">
                        <h4><i class="fas fa-money-bill-wave"></i> Ticket Payouts</h4>
                        <span class="section-badge">${formatCurrency(last24hAmount)} today</span>
                    </div>
                    <div class="analytics-summary">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Payouts</h4>
                                <div class="metric-value">${formatNumber(total)}</div>
                                <div class="metric-subtext">All time</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <i class="fas fa-coins"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Amount</h4>
                                <div class="metric-value warning">${formatCurrency(totalAmount)}</div>
                                <div class="metric-subtext">All payouts</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Average Payout</h4>
                                <div class="metric-value info">${formatCurrency(averageAmount)}</div>
                                <div class="metric-subtext">Per ticket</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Last 24h</h4>
                                <div class="metric-value purple">${formatNumber(last24hCount)}</div>
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
            
            const topOutlets = safeGet(data, 'top_outlets', []);
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(topOutlets) && topOutlets.length > 0) {
                renderBarChart('payoutChart', topOutlets, 'outlet', 'amount', CONFIG.CHART_COLORS.warning);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                renderLineChart('payoutTrendChart', trend, 'date', 'amount', CONFIG.CHART_COLORS.success);
            }
        } catch (error) {
            logger.error(`Payout render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render payout analytics</div>';
        }
    }
    
    function renderDeviceChangeAnalytics(data, container) {
        try {
            const total = safeGet(data, 'total', 0);
            const last24h = safeGet(data, 'last_24h', 0);
            const phoneCount = safeGet(data, 'by_type.phone', 0);
            const posCount = safeGet(data, 'by_type.pos', 0);
            const phonePercentage = total > 0 ? ((phoneCount / total) * 100).toFixed(1) : 0;
            const posPercentage = total > 0 ? ((posCount / total) * 100).toFixed(1) : 0;
            
            container.innerHTML = `
                <div class="analytics-section">
                    <div class="section-header">
                        <h4><i class="fas fa-mobile-alt"></i> Device ID Changes</h4>
                        <span class="section-badge">${formatNumber(last24h)} in last 24h</span>
                    </div>
                    <div class="analytics-summary">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Requests</h4>
                                <div class="metric-value">${formatNumber(total)}</div>
                                <div class="metric-subtext">All time</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Phone Users</h4>
                                <div class="metric-value" style="color: #ec4899;">${formatNumber(phoneCount)}</div>
                                <div class="metric-subtext">${phonePercentage}% of total</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                <i class="fas fa-desktop"></i>
                            </div>
                            <div class="metric-content">
                                <h4>POS Users</h4>
                                <div class="metric-value purple">${formatNumber(posCount)}</div>
                                <div class="metric-subtext">${posPercentage}% of total</div>
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
            
            const topOperators = safeGet(data, 'top_operators', []);
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(topOperators) && topOperators.length > 0) {
                renderBarChart('deviceChangeChart', topOperators, 'operator', 'count', CONFIG.CHART_COLORS.purple);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                renderLineChart('deviceChangeTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.info);
            }
        } catch (error) {
            logger.error(`Device change render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render device change analytics</div>';
        }
    }
    
    function renderServerErrorAnalytics(data, container) {
        try {
            const total = safeGet(data, 'total', 0);
            const last24h = safeGet(data, 'last_24h', 0);
            const byType = safeGet(data, 'by_type', []);
            const typeCount = Array.isArray(byType) ? byType.length : 0;
            
            container.innerHTML = `
                <div class="analytics-section">
                    <div class="section-header">
                        <h4><i class="fas fa-exclamation-triangle"></i> Server Errors & Issues</h4>
                        <span class="section-badge">${formatNumber(last24h)} in last 24h</span>
                    </div>
                    <div class="analytics-summary">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                <i class="fas fa-server"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Errors</h4>
                                <div class="metric-value error">${formatNumber(total)}</div>
                                <div class="metric-subtext">All recorded</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <i class="fas fa-list"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Error Types</h4>
                                <div class="metric-value warning">${formatNumber(typeCount)}</div>
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
            
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(byType) && byType.length > 0) {
                renderBarChart('serverErrorChart', byType, 'type', 'count', CONFIG.CHART_COLORS.error);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                renderLineChart('serverErrorTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.warning);
            }
        } catch (error) {
            logger.error(`Server error render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render server error analytics</div>';
        }
    }
    
    function renderTicketVerificationAnalytics(data, container) {
        try {
            const total = safeGet(data, 'total', 0);
            const last24h = safeGet(data, 'last_24h', 0);
            
            container.innerHTML = `
                <div class="analytics-section">
                    <div class="section-header">
                        <h4><i class="fas fa-search"></i> Ticket Verifications</h4>
                        <span class="section-badge">${formatNumber(last24h)} in last 24h</span>
                    </div>
                    <div class="analytics-summary">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                                <i class="fas fa-clipboard-check"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Verifications</h4>
                                <div class="metric-value info">${formatNumber(total)}</div>
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
            
            const topBooths = safeGet(data, 'top_booths', []);
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(topBooths) && topBooths.length > 0) {
                renderBarChart('verificationChart', topBooths, 'booth', 'count', CONFIG.CHART_COLORS.info);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                renderLineChart('verificationTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.primary);
            }
        } catch (error) {
            logger.error(`Verification render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render verification analytics</div>';
        }
    }
    
    function renderBoothActivityAnalytics(data, container) {
        try {
            const latest = safeGet(data, 'latest', {});
            const active = safeGet(latest, 'active', 0);
            const inactive = safeGet(latest, 'inactive', 0);
            const affectedOperators = safeGet(latest, 'affected_operators', 0);
            const periodHours = safeGet(latest, 'period_hours', 0);
            const filesProcessed = safeGet(data, 'files_processed', 0);
            const inactivePercentage = active > 0 ? ((inactive / active) * 100).toFixed(1) : 0;
            
            container.innerHTML = `
                <div class="analytics-section">
                    <div class="section-header">
                        <h4><i class="fas fa-store"></i> Booth Activity Analysis</h4>
                        <span class="section-badge">${formatNumber(filesProcessed)} analyses run</span>
                    </div>
                    <div class="analytics-summary">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Active Booths</h4>
                                <div class="metric-value success">${formatNumber(active)}</div>
                                <div class="metric-subtext">Latest analysis</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                <i class="fas fa-times-circle"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Inactive Booths</h4>
                                <div class="metric-value error">${formatNumber(inactive)}</div>
                                <div class="metric-subtext">${inactivePercentage}% of total</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Affected Operators</h4>
                                <div class="metric-value warning">${formatNumber(affectedOperators)}</div>
                                <div class="metric-subtext">With inactive booths</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Analysis Period</h4>
                                <div class="metric-value purple">${formatNumber(periodHours)}h</div>
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
            
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(trend) && trend.length > 0) {
                renderLineChart('boothActivityTrendChart', trend, 'date', 'inactive', CONFIG.CHART_COLORS.error);
            }
        } catch (error) {
            logger.error(`Booth activity render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render booth activity analytics</div>';
        }
    }
    
    // ============================================
    // UI FUNCTIONS
    // ============================================
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="analytics-loading">
                <div class="loading-spinner"></div>
                <span>Loading analytics data...</span>
            </div>
        `;
    }
    
    function showError(container, message) {
        container.innerHTML = `
            <div class="analytics-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Failed to Load Analytics</h3>
                <p>${sanitizeHTML(message)}</p>
                <button class="btn-retry" onclick="window.AnalyticsWidget.refresh()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
    
    function createTimestamp(container, timestamp) {
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'analytics-timestamp';
        timestampDiv.id = 'analyticsTimestamp';
        
        try {
            const date = new Date(timestamp);
            timestampDiv.textContent = `Last updated: ${date.toLocaleTimeString()}`;
        } catch {
            timestampDiv.textContent = 'Last updated: Just now';
        }
        
        container.prepend(timestampDiv);
    }
    
    function injectStyles() {
        if (document.getElementById('analytics-widget-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'analytics-widget-styles';
        style.textContent = `
            .analytics-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                gap: 20px;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .analytics-error {
                text-align: center;
                padding: 60px 20px;
            }
            
            .error-icon {
                font-size: 48px;
                color: #ef4444;
                margin-bottom: 20px;
            }
            
            .analytics-error h3 {
                margin: 0 0 10px;
                color: #1f2937;
            }
            
            .analytics-error p {
                color: #6b7280;
                margin-bottom: 20px;
            }
            
            .btn-retry {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s;
            }
            
            .btn-retry:hover {
                background: #2563eb;
            }
            
            .analytics-timestamp {
                text-align: right;
                color: #6b7280;
                font-size: 12px;
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
                margin-bottom: 20px;
            }
            
            .analytics-section {
                background: white;
                border-radius: 8px;
                padding: 24px;
                margin-bottom: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .section-header h4 {
                margin: 0;
                font-size: 18px;
                color: #1f2937;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .section-badge {
                background: #eff6ff;
                color: #3b82f6;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .analytics-summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .metric-card {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            
            .metric-icon {
                width: 56px;
                height: 56px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .metric-content {
                flex: 1;
                min-width: 0;
            }
            
            .metric-content h4 {
                margin: 0 0 8px;
                font-size: 13px;
                color: #6b7280;
                font-weight: 500;
            }
            
            .metric-value {
                font-size: 28px;
                font-weight: 700;
                color: #1f2937;
                line-height: 1;
                margin-bottom: 4px;
            }
            
            .metric-value.success { color: #10b981; }
            .metric-value.error { color: #ef4444; }
            .metric-value.warning { color: #f59e0b; }
            .metric-value.info { color: #06b6d4; }
            .metric-value.purple { color: #8b5cf6; }
            
            .metric-subtext {
                font-size: 12px;
                color: #9ca3af;
            }
            
            .charts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 24px;
            }
            
            .charts-grid.full-width {
                grid-template-columns: 1fr;
            }
            
            .chart-container {
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            
            .chart-container h5 {
                margin: 0 0 16px;
                font-size: 14px;
                color: #4b5563;
                font-weight: 600;
            }
            
            .chart-container canvas {
                max-height: 300px;
            }
            
            .section-error {
                padding: 20px;
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 6px;
                color: #dc2626;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .analytics-summary {
                    grid-template-columns: 1fr;
                }
                
                .charts-grid {
                    grid-template-columns: 1fr;
                }
                
                .metric-card {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // ============================================
    // MAIN INITIALIZATION
    // ============================================
    
    async function initialize() {
        if (state.loading) return;
        
        try {
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            
            if (!container) {
                logger.error(`Container #${CONFIG.CONTAINER_ID} not found`);
                return;
            }
            
            // Inject styles
            injectStyles();
            
            // Show loading
            showLoading(container);
            
            // Fetch and render data
            const data = await fetchAnalyticsData();
            
            // Clear container
            container.innerHTML = '';
            
            // Create timestamp
            createTimestamp(container, data.timestamp || new Date().toISOString());
            
            // Create section containers
            const sections = [
                { id: 'cancellation', fn: renderCancellationAnalytics, data: data.cancellations },
                { id: 'payout', fn: renderPayoutAnalytics, data: data.payouts },
                { id: 'deviceChange', fn: renderDeviceChangeAnalytics, data: data.device_changes },
                { id: 'serverError', fn: renderServerErrorAnalytics, data: data.server_errors },
                { id: 'verification', fn: renderTicketVerificationAnalytics, data: data.ticket_verifications },
                { id: 'boothActivity', fn: renderBoothActivityAnalytics, data: data.booth_activity }
            ];
            
            sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.id = `${section.id}Analytics`;
                container.appendChild(sectionDiv);
                
                if (section.data) {
                    section.fn(section.data, sectionDiv);
                }
            });
            
            state.loaded = true;
            logger.info('✅ Analytics widget initialized successfully');
            
            // Schedule refresh
            scheduleRefresh();
            
        } catch (error) {
            logger.error(`Initialization failed: ${error.message}`);
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (container) {
                showError(container, error.message);
            }
        }
    }
    
    function scheduleRefresh() {
        if (state.refreshTimer) {
            clearTimeout(state.refreshTimer);
        }
        
        state.refreshTimer = setTimeout(() => {
            logger.info('🔄 Auto-refreshing analytics...');
            refresh();
        }, CONFIG.REFRESH_INTERVAL);
    }
    
    function refresh() {
        state.loaded = false;
        return initialize();
    }
    
    function destroy() {
        if (state.refreshTimer) {
            clearTimeout(state.refreshTimer);
            state.refreshTimer = null;
        }
        
        if (state.abortController) {
            state.abortController.abort();
            state.abortController = null;
        }
        
        Object.keys(state.charts).forEach(chartId => {
            destroyChart(chartId);
        });
        
        state.loaded = false;
        state.loading = false;
        
        logger.info('Analytics widget destroyed');
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    window.AnalyticsWidget = {
        init: initialize,
        refresh: refresh,
        destroy: destroy,
        state: () => ({ ...state, charts: Object.keys(state.charts) })
    };
    
    // ============================================
    // AUTO-INITIALIZE
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            logger.info('📊 Analytics widget ready');
            // Auto-initialize if container exists
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                initialize();
            }
        });
    } else {
        logger.info('📊 Analytics widget ready');
        // Auto-initialize if container exists
        if (document.getElementById(CONFIG.CONTAINER_ID)) {
            initialize();
        }
    }
    
})();