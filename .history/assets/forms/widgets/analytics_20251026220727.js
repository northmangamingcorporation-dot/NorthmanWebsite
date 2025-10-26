// ============================================
// ADVANCED ANALYTICS MODULE - COMPLETE FIXED VERSION
// ============================================

(function() {
    'use strict';
    
    const CONFIG = {
        API_URL: 'https://raspberrypi.tail2aed63.ts.net:5000',
        API_KEY: '200206',
        REFRESH_INTERVAL: 300000,
        MAX_RETRIES: 3,
        RETRY_DELAY: 2000,
        REQUEST_TIMEOUT: 30000,
        CONTAINER_ID: 'analyticsWidget',
        CHART_COLORS: {
            primary: 'rgb(59, 130, 246)',
            success: 'rgb(16, 185, 129)',
            warning: 'rgb(245, 158, 11)',
            error: 'rgb(239, 68, 68)',
            info: 'rgb(6, 182, 212)',
            purple: 'rgb(139, 92, 246)'
        }
    };
    
    const state = {
        charts: {},
        refreshTimer: null,
        loaded: false,
        loading: false,
        lastSuccessfulData: null,
        lastFetchTime: 0,
        retryCount: 0,
        abortController: null,
        filterOptions: null,
        filters: {
            dateRange: 'last_30_days',
            startDate: '',
            endDate: '',
            status: '',
            boothCodes: [],
            outlets: [],
            operators: [],
            userTypes: []
        },
        insights: [],
        showFilters: false
    };
    
    const logger = {
        info: (msg) => console.log(`[ANALYTICS INFO] ${new Date().toISOString()} ${msg}`),
        error: (msg) => console.error(`[ANALYTICS ERROR] ${new Date().toISOString()} ${msg}`),
        warn: (msg) => console.warn(`[ANALYTICS WARN] ${new Date().toISOString()} ${msg}`)
    };
    
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
    
    function buildQueryParams() {
        const params = new URLSearchParams();
        
        if (state.filters.dateRange !== 'custom') {
            const daysMap = {
                'today': 1,
                'last_7_days': 7,
                'last_30_days': 30,
                'last_90_days': 90,
                'last_180_days': 180,
                'last_365_days': 365
            };
            const days = daysMap[state.filters.dateRange] || 30;
            params.append('days', days);
        } else {
            if (state.filters.startDate) params.append('start_date', state.filters.startDate);
            if (state.filters.endDate) params.append('end_date', state.filters.endDate);
        }
        
        if (state.filters.status) params.append('status', state.filters.status);
        if (state.filters.boothCodes.length) params.append('booth_codes', state.filters.boothCodes.join(','));
        if (state.filters.outlets.length) params.append('outlets', state.filters.outlets.join(','));
        if (state.filters.operators.length) params.append('operators', state.filters.operators.join(','));
        if (state.filters.userTypes.length) params.append('user_types', state.filters.userTypes.join(','));
        
        return params.toString();
    }
    
    async function fetchWithTimeout(url, options = {}, timeout = CONFIG.REQUEST_TIMEOUT) {
        const controller = new AbortController();
        state.abortController = controller;
        
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const fetchOptions = {
                ...options,
                signal: controller.signal,
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Accept': 'application/json',
                    'X-API-Key': CONFIG.API_KEY,
                    ...options.headers
                }
            };
            
            logger.info(`Fetching: ${url}`);
            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }
    
    async function testConnection() {
        try {
            logger.info('Testing API connection...');
            const response = await fetchWithTimeout(
                `${CONFIG.API_URL}/health`,
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                },
                5000
            );
            
            const data = await response.json();
            logger.info(`✅ API connection successful: ${data.status}`);
            return true;
        } catch (error) {
            logger.error(`❌ API connection failed: ${error.message}`);
            return false;
        }
    }
    
    async function fetchFilterOptions() {
        try {
            logger.info('Fetching filter options...');
            const response = await fetchWithTimeout(
                `${CONFIG.API_URL}/analytics/v2/filters/options`,
                {
                    method: 'GET',
                    headers: { 
                        'Accept': 'application/json',
                        'X-API-Key': CONFIG.API_KEY
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch filter options: ${response.status}`);
            }
            
            const options = await response.json();
            state.filterOptions = options;
            logger.info('✅ Filter options loaded successfully');
            return options;
        } catch (error) {
            logger.error(`Failed to fetch filter options: ${error.message}`);
            return {
                booth_codes: [],
                outlets: [],
                operators: [],
                user_types: ['phone', 'pos'],
                statuses: ['request', 'approved', 'rejected', 'denied', 'pending'],
                date_ranges: {
                    'today': 1,
                    'last_7_days': 7,
                    'last_30_days': 30,
                    'last_90_days': 90,
                    'last_180_days': 180,
                    'last_365_days': 365
                }
            };
        }
    }
    
    async function fetchAnalyticsData(retryCount = 0) {
        try {
            logger.info(`Fetching analytics data (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
            
            const params = buildQueryParams();
            
            const endpoints = {
                cancellations: `${CONFIG.API_URL}/analytics/v2/cancellations?${params}`,
                payouts: `${CONFIG.API_URL}/analytics/v2/payouts?${params}`,
                deviceChanges: `${CONFIG.API_URL}/analytics/v2/device-changes?${params}`,
                summary: `${CONFIG.API_URL}/analytics/v2/summary?${params}`,
                insights: `${CONFIG.API_URL}/analytics/v2/insights?${params}`
            };
            
            const fetchEndpoint = async (name, url) => {
                try {
                    const response = await fetchWithTimeout(url, {
                        method: 'GET',
                        headers: { 
                            'Accept': 'application/json',
                            'X-API-Key': CONFIG.API_KEY
                        }
                    });
                    const data = await response.json();
                    logger.info(`✅ ${name} fetched successfully`);
                    return data;
                } catch (error) {
                    logger.error(`Failed to fetch ${name}: ${error.message}`);
                    return getEmptyDataStructure(name);
                }
            };
            
            const [cancellations, payouts, deviceChanges, summary, insights] = await Promise.all([
                fetchEndpoint('cancellations', endpoints.cancellations),
                fetchEndpoint('payouts', endpoints.payouts),
                fetchEndpoint('deviceChanges', endpoints.deviceChanges),
                fetchEndpoint('summary', endpoints.summary),
                fetchEndpoint('insights', endpoints.insights)
            ]);
            
            const data = {
                cancellations,
                payouts,
                device_changes: deviceChanges,
                summary,
                insights: insights.insights || [],
                timestamp: new Date().toISOString()
            };
            
            state.lastSuccessfulData = data;
            state.insights = data.insights;
            state.lastFetchTime = Date.now();
            state.retryCount = 0;
            
            logger.info('✅ Analytics data fetched successfully');
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
    
    function getEmptyDataStructure(name) {
        switch(name) {
            case 'cancellations':
                return {
                    total: 0,
                    last_24h: 0,
                    by_status: {},
                    top_operators: [],
                    trend: [],
                    approval_rate: 0
                };
            case 'payouts':
                return {
                    total: 0,
                    total_amount: 0,
                    average_amount: 0,
                    top_outlets: [],
                    trend: [],
                    last_24h: { count: 0, amount: 0 }
                };
            case 'deviceChanges':
                return {
                    total: 0,
                    last_24h: 0,
                    by_type: {},
                    top_operators: [],
                    trend: []
                };
            case 'summary':
                return {
                    overview: {
                        total_cancellations: 0,
                        total_payouts: 0,
                        total_device_changes: 0
                    }
                };
            case 'insights':
                return { insights: [] };
            default:
                return {};
        }
    }
    
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
        if (!canvas || !Array.isArray(data) || data.length === 0) {
            logger.warn(`Cannot render bar chart ${canvasId}: canvas not found or no data`);
            return;
        }
        
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
            logger.info(`✅ Bar chart ${canvasId} rendered`);
        } catch (error) {
            logger.error(`Failed to render bar chart ${canvasId}: ${error.message}`);
        }
    }
    
    function renderLineChart(canvasId, data, labelKey, valueKey, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !Array.isArray(data) || data.length === 0) {
            logger.warn(`Cannot render line chart ${canvasId}: canvas not found or no data`);
            return;
        }
        
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
            logger.info(`✅ Line chart ${canvasId} rendered`);
        } catch (error) {
            logger.error(`Failed to render line chart ${canvasId}: ${error.message}`);
        }
    }
    
    function renderHeader() {
        const activeFiltersCount = [
            state.filters.status,
            ...state.filters.boothCodes,
            ...state.filters.outlets,
            ...state.filters.operators,
            ...state.filters.userTypes
        ].filter(f => f).length + (state.filters.dateRange !== 'last_30_days' ? 1 : 0);
        
        const lastUpdate = state.lastFetchTime > 0 
            ? new Date(state.lastFetchTime).toLocaleTimeString()
            : 'Never';
        
        return `
            <div class="analytics-header">
                <div class="header-left">
                    <h1>Advanced Analytics Dashboard</h1>
                    <p class="header-subtitle">Last updated: ${lastUpdate}</p>
                </div>
                <div class="header-actions">
                    <button class="btn-header" onclick="window.AnalyticsWidget.toggleFilters()">
                        <i class="fas fa-filter"></i> Filters
                        ${activeFiltersCount > 0 ? `<span class="badge-count">${activeFiltersCount}</span>` : ''}
                    </button>
                    <button class="btn-header" onclick="window.AnalyticsWidget.refresh()" ${state.loading ? 'disabled' : ''}>
                        <i class="fas fa-sync-alt ${state.loading ? 'fa-spin' : ''}"></i> Refresh
                    </button>
                </div>
            </div>
        `;
    }
    
    function renderCancellationAnalytics(data, container) {
        try {
            const total = safeGet(data, 'total', 0);
            const last24h = safeGet(data, 'last_24h', 0);
            const approved = safeGet(data, 'by_status.approved', 0);
            const denied = safeGet(data, 'by_status.rejected', safeGet(data, 'by_status.denied', 0));
            const pending = safeGet(data, 'by_status.request', safeGet(data, 'by_status.pending', 0));
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
                                <div class="metric-subtext">Filtered period</div>
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
                            <canvas id="cancellationChart" height="300"></canvas>
                        </div>
                        <div class="chart-container">
                            <h5>Cancellation Trend</h5>
                            <canvas id="cancellationTrendChart" height="300"></canvas>
                        </div>
                    </div>
                </div>
            `;
            
            const topOperators = safeGet(data, 'top_operators', []);
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(topOperators) && topOperators.length > 0) {
                setTimeout(() => renderBarChart('cancellationChart', topOperators, 'booth', 'count', CONFIG.CHART_COLORS.primary), 100);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                setTimeout(() => renderLineChart('cancellationTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.success), 100);
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
                                <div class="metric-subtext">Filtered period</div>
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
                            <canvas id="payoutChart" height="300"></canvas>
                        </div>
                        <div class="chart-container">
                            <h5>Payout Trend</h5>
                            <canvas id="payoutTrendChart" height="300"></canvas>
                        </div>
                    </div>
                </div>
            `;
            
            const topOutlets = safeGet(data, 'top_outlets', []);
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(topOutlets) && topOutlets.length > 0) {
                setTimeout(() => renderBarChart('payoutChart', topOutlets, 'outlet', 'amount', CONFIG.CHART_COLORS.warning), 100);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                setTimeout(() => renderLineChart('payoutTrendChart', trend, 'date', 'amount', CONFIG.CHART_COLORS.success), 100);
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
                                <div class="metric-subtext">Filtered period</div>
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
                            <canvas id="deviceChangeChart" height="300"></canvas>
                        </div>
                        <div class="chart-container">
                            <h5>Device Change Trend</h5>
                            <canvas id="deviceChangeTrendChart" height="300"></canvas>
                        </div>
                    </div>
                </div>
            `;
            
            const topOperators = safeGet(data, 'top_operators', []);
            const trend = safeGet(data, 'trend', []);
            
            if (Array.isArray(topOperators) && topOperators.length > 0) {
                setTimeout(() => renderBarChart('deviceChangeChart', topOperators, 'operator', 'count', CONFIG.CHART_COLORS.purple), 100);
            }
            if (Array.isArray(trend) && trend.length > 0) {
                setTimeout(() => renderLineChart('deviceChangeTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.info), 100);
            }
        } catch (error) {
            logger.error(`Device change render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render device change analytics</div>';
        }
    }
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="analytics-loading">
                <div class="loading-spinner"></div>
                <span>Loading analytics data...</span>
                <p class="loading-status">Connecting to API...</p>
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
                <div class="error-details">
                    <p><strong>Troubleshooting:</strong></p>
                    <ul>
                        <li>Check if the API server is running</li>
                        <li>Verify network connectivity</li>
                        <li>Check browser console for details</li>
                    </ul>
                </div>
                <button class="btn-retry" onclick="window.AnalyticsWidget.refresh()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
    
    function injectStyles() {
        if (document.getElementById('analytics-widget-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'analytics-widget-styles';
        style.textContent = `
            .analytics-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 20px; }
            .loading-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
            .loading-status { font-size: 13px; color: #6b7280; margin-top: 10px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .analytics-error { text-align: center; padding: 60px 20px; }
            .error-icon { font-size: 48px; color: #ef4444; margin-bottom: 20px; }
            .analytics-error h3 { margin: 0 0 10px; color: #1f2937; }
            .analytics-error p { color: #6b7280; margin-bottom: 20px; }
            .error-details { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px auto; max-width: 500px; text-align: left; }
            .error-details ul { margin: 10px 0 0 20px; }
            .error-details li { margin: 5px 0; color: #4b5563; font-size: 14px; }
            .btn-retry { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s; }
            .btn-retry:hover { background: #2563eb; }
            
            .analytics-header { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
            .header-left h1 { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
            .header-subtitle { font-size: 13px; color: #6b7280; }
            .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
            .btn-header { background: #f3f4f6; color: #374151; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; position: relative; }
            .btn-header:hover { background: #e5e7eb; }
            .btn-header:disabled { opacity: 0.5; cursor: not-allowed; }
            .badge-count { background: #ef4444; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600; position: absolute; top: -4px; right: -4px; }
            
            .analytics-section { background: white; border-radius: 8px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
            .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb; }
            .section-header h4 { margin: 0; font-size: 18px; color: #1f2937; display: flex; align-items: center; gap: 10px; }
            .section-badge { background: #eff6ff; color: #3b82f6; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .analytics-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .metric-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; }
            .metric-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; flex-shrink: 0; }
            .metric-content { flex: 1; min-width: 0; }
            .metric-content h4 { margin: 0 0 8px; font-size: 13px; color: #6b7280; font-weight: 500; }
            .metric-value { font-size: 28px; font-weight: 700; color: #1f2937; line-height: 1; margin-bottom: 4px; }
            .metric-value.success { color: #10b981; }
            .metric-value.error { color: #ef4444; }
            .metric-value.warning { color: #f59e0b; }
            .metric-value.info { color: #06b6d4; }
            .metric-value.purple { color: #8b5cf6; }
            .metric-subtext { font-size: 12px; color: #9ca3af; }
            .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px; }
            .chart-container { background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .chart-container h5 { margin: 0 0 16px; font-size: 14px; color: #4b5563; font-weight: 600; }
            .chart-container canvas { max-height: 300px; }
            .section-error { padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #dc2626; text-align: center; }
            
            @media (max-width: 768px) {
                .analytics-header { flex-direction: column; align-items: flex-start; }
                .header-actions { width: 100%; }
                .btn-header { flex: 1; justify-content: center; }
                .analytics-summary { grid-template-columns: 1fr; }
                .charts-grid { grid-template-columns: 1fr; }
                .metric-card { flex-direction: column; text-align: center; }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    async function initialize() {
        if (state.loading) {
            logger.warn('Already loading, skipping duplicate initialization');
            return;
        }
        
        state.loading = true;
        
        try {
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            
            if (!container) {
                logger.error(`Container #${CONFIG.CONTAINER_ID} not found`);
                state.loading = false;
                return;
            }
            
            injectStyles();
            showLoading(container);
            
            const isConnected = await testConnection();
            if (!isConnected) {
                throw new Error('Unable to connect to API server. Please check if the server is running.');
            }
            
            await fetchFilterOptions();
            
            const loadingStatus = container.querySelector('.loading-status');
            if (loadingStatus) {
                loadingStatus.textContent = 'Fetching analytics data...';
            }
            
            const data = await fetchAnalyticsData();
            
            container.innerHTML = '';
            container.innerHTML = renderHeader();
            
            const sections = [
                { id: 'cancellation', fn: renderCancellationAnalytics, data: data.cancellations },
                { id: 'payout', fn: renderPayoutAnalytics, data: data.payouts },
                { id: 'deviceChange', fn: renderDeviceChangeAnalytics, data: data.device_changes }
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
            state.loading = false;
            logger.info('✅ Advanced Analytics widget initialized successfully');
            
            scheduleRefresh();
            
        } catch (error) {
            logger.error(`Initialization failed: ${error.message}`);
            state.loading = false;
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
        state.loading = false;
        return initialize();
    }
    
    function toggleFilters() {
        state.showFilters = !state.showFilters;
        refresh();
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
    
    window.AnalyticsWidget = {
        init: initialize,
        refresh: refresh,
        destroy: destroy,
        toggleFilters: toggleFilters,
        testConnection: testConnection,
        state: () => ({ 
            loaded: state.loaded,
            loading: state.loading,
            lastFetchTime: state.lastFetchTime,
            charts: Object.keys(state.charts),
            filterOptions: state.filterOptions
        })
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            logger.info('📊 Advanced Analytics widget ready');
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                initialize();
            }
        });
    } else {
        logger.info('📊 Advanced Analytics widget ready');
        if (document.getElementById(CONFIG.CONTAINER_ID)) {
            initialize();
        }
    }
    
})();