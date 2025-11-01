// ============================================
// ENHANCED ADVANCED ANALYTICS MODULE (SIMPLIFIED UI)
// ============================================
// assets\forms\widgets\analytics.js
(function() {
    'use strict';
    
    const CONFIG = {
        API_URL: 'https://api.northman-gaming-corporation.site',
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
            userTypes: [],
            minAmount: '',
            maxAmount: ''
        },
        insights: [],
        showFilters: false,
        activeTab: 'overview'
    };
    
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
    
    function sanitizeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // ============================================
    // INSIGHTS GENERATOR
    // ============================================
    
    function generateInsights(data) {
        const insights = [];
        
        if (!data) return insights;
        
        const cancellations = data.cancellations || {};
        const payouts = data.payouts || {};
        const devices = data.device_changes || {};
        
        // Cancellation insights
        if (cancellations.approval_rate > 80) {
            insights.push({
                icon: '✅',
                type: 'success',
                title: 'High Approval Rate',
                text: `${cancellations.approval_rate}% of cancellations are approved - excellent processing efficiency!`
            });
        } else if (cancellations.approval_rate < 50) {
            insights.push({
                icon: '⚠️',
                type: 'warning',
                title: 'Low Approval Rate',
                text: `Only ${cancellations.approval_rate}% approval rate. Review cancellation criteria.`
            });
        }
        
        // Volume insights
        if (cancellations.last_24h > (cancellations.total / 30)) {
            insights.push({
                icon: '📈',
                type: 'info',
                title: 'High Activity Today',
                text: `${cancellations.last_24h} cancellations in last 24h - above daily average.`
            });
        }
        
        // Payout insights
        if (payouts.average_amount > 10000) {
            insights.push({
                icon: '💰',
                type: 'success',
                title: 'High Value Payouts',
                text: `Average payout of ${formatCurrency(payouts.average_amount)} indicates quality wins.`
            });
        }
        
        // Top performer insight
        if (cancellations.top_operators && cancellations.top_operators.length > 0) {
            const top = cancellations.top_operators[0];
            insights.push({
                icon: '🏆',
                type: 'info',
                title: 'Top Booth',
                text: `${top.booth} leads with ${top.count} cancellations.`
            });
        }
        
        // Device changes insight
        if (devices.total > 0) {
            const phonePercent = devices.by_type?.phone ? ((devices.by_type.phone / devices.total) * 100).toFixed(0) : 0;
            insights.push({
                icon: '📱',
                type: 'info',
                title: 'Device Distribution',
                text: `${phonePercent}% of device changes are from phone users.`
            });
        }
        
        return insights.slice(0, 4); // Return top 4 insights
    }
    
    // ============================================
    // API FUNCTIONS
    // ============================================
    
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
        if (state.filters.minAmount) params.append('min_amount', state.filters.minAmount);
        if (state.filters.maxAmount) params.append('max_amount', state.filters.maxAmount);
        
        params.append('include_details', 'false');
        
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
    
    async function fetchFilterOptions() {
        try {
            logger.info('Fetching filter options...');
            const response = await fetchWithTimeout(
                `${CONFIG.API_URL}/analytics/v2/filters/options`,
                { method: 'GET' }
            );
            
            const options = await response.json();
            state.filterOptions = options;
            logger.info('✅ Filter options loaded');
            return options;
        } catch (error) {
            logger.error(`Failed to fetch filter options: ${error.message}`);
            return {
                booth_codes: [],
                outlets: [],
                operators: [],
                user_types: ['phone', 'pos'],
                statuses: ['request', 'approved', 'rejected', 'denied', 'pending']
            };
        }
    }
    
    async function fetchAnalyticsData() {
        try {
            logger.info('Fetching analytics data...');
            
            const params = buildQueryParams();
            const endpoints = {
                cancellations: `${CONFIG.API_URL}/analytics/v2/cancellations?${params}`,
                payouts: `${CONFIG.API_URL}/analytics/v2/payouts?${params}`,
                deviceChanges: `${CONFIG.API_URL}/analytics/v2/device-changes?${params}`,
                summary: `${CONFIG.API_URL}/analytics/v2/summary?${params}`
            };
            
            const [cancellations, payouts, deviceChanges, summary] = await Promise.all([
                fetchWithTimeout(endpoints.cancellations).then(r => r.json()).catch(() => getEmptyData('cancellations')),
                fetchWithTimeout(endpoints.payouts).then(r => r.json()).catch(() => getEmptyData('payouts')),
                fetchWithTimeout(endpoints.deviceChanges).then(r => r.json()).catch(() => getEmptyData('deviceChanges')),
                fetchWithTimeout(endpoints.summary).then(r => r.json()).catch(() => getEmptyData('summary'))
            ]);
            
            const data = {
                cancellations,
                payouts,
                device_changes: deviceChanges,
                summary,
                timestamp: new Date().toISOString()
            };
            
            state.lastSuccessfulData = data;
            state.lastFetchTime = Date.now();
            state.insights = generateInsights(data);
            
            logger.info('✅ Analytics data fetched');
            return data;
            
        } catch (error) {
            logger.error(`Fetch failed: ${error.message}`);
            if (state.lastSuccessfulData) {
                logger.warn('Using cached data');
                return state.lastSuccessfulData;
            }
            throw error;
        }
    }
    
    function getEmptyData(type) {
        const structures = {
            cancellations: { total: 0, last_24h: 0, by_status: {}, top_operators: [], trend: [], approval_rate: 0 },
            payouts: { total: 0, total_amount: 0, average_amount: 0, top_outlets: [], trend: [], last_24h: { count: 0, amount: 0 } },
            deviceChanges: { total: 0, last_24h: 0, by_type: {}, top_operators: [], trend: [] },
            summary: { overview: { total_cancellations: 0, total_payouts: 0, total_device_changes: 0 } }
        };
        return structures[type] || {};
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
                logger.warn(`Failed to destroy chart ${canvasId}`);
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
                        label: valueKey,
                        data: data.map(d => Number(d[valueKey]) || 0),
                        backgroundColor: color + '99',
                        borderColor: color,
                        borderWidth: 2,
                        borderRadius: 8,
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
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: (ctx) => valueKey === 'amount' 
                                    ? formatCurrency(ctx.parsed.y)
                                    : formatNumber(ctx.parsed.y)
                            }
                        }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (val) => valueKey === 'amount' 
                                    ? formatCurrency(val)
                                    : formatNumber(val)
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
                            return new Date(d[labelKey]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        } catch {
                            return 'N/A';
                        }
                    }),
                    datasets: [{
                        label: valueKey,
                        data: data.map(d => Number(d[valueKey]) || 0),
                        borderColor: color,
                        backgroundColor: color + '33',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: color,
                        pointBorderColor: '#fff',
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
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: (ctx) => valueKey === 'amount' 
                                    ? formatCurrency(ctx.parsed.y)
                                    : formatNumber(ctx.parsed.y)
                            }
                        }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (val) => valueKey === 'amount' 
                                    ? formatCurrency(val)
                                    : formatNumber(val)
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
    // UI RENDERING (SIMPLIFIED)
    // ============================================
    
    function renderHeader() {
        const lastUpdate = state.lastFetchTime > 0 
            ? new Date(state.lastFetchTime).toLocaleTimeString()
            : 'Never';
        
        return `
            <div class="simple-header">
                <div class="header-main">
                    <h1>📊 Analytics Dashboard</h1>
                    <p class="update-time">Last updated: ${lastUpdate}</p>
                </div>
                <div class="header-controls">
                    <select id="dateRangeSelect" class="simple-select" onchange="window.AnalyticsWidget.quickFilterChange(this.value)">
                        <option value="last_7_days" ${state.filters.dateRange === 'last_7_days' ? 'selected' : ''}>Last 7 Days</option>
                        <option value="last_30_days" ${state.filters.dateRange === 'last_30_days' ? 'selected' : ''}>Last 30 Days</option>
                        <option value="last_90_days" ${state.filters.dateRange === 'last_90_days' ? 'selected' : ''}>Last 90 Days</option>
                        <option value="last_365_days" ${state.filters.dateRange === 'last_365_days' ? 'selected' : ''}>Last Year</option>
                    </select>
                    <button class="refresh-btn" onclick="window.AnalyticsWidget.refresh()" ${state.loading ? 'disabled' : ''}>
                        <i class="fas fa-sync-alt ${state.loading ? 'fa-spin' : ''}"></i> Refresh
                    </button>
                    <button class="export-btn" onclick="window.AnalyticsWidget.exportData()" ${!state.lastSuccessfulData ? 'disabled' : ''}>
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
        `;
    }
    
    function renderOverview(data) {
        const summary = safeGet(data, 'summary.overview', {});
        const cancellations = data.cancellations || {};
        const payouts = data.payouts || {};
        const devices = data.device_changes || {};
        
        return `
            <div class="overview-grid">
                <div class="big-stat-card primary">
                    <div class="stat-icon">🎫</div>
                    <div class="stat-info">
                        <div class="stat-label">Total Cancellations</div>
                        <div class="stat-number">${formatNumber(summary.total_cancellations || 0)}</div>
                        <div class="stat-subtext">${formatNumber(cancellations.last_24h || 0)} in last 24h</div>
                    </div>
                </div>
                
                <div class="big-stat-card success">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <div class="stat-label">Total Payouts</div>
                        <div class="stat-number">${formatNumber(summary.total_payouts || 0)}</div>
                        <div class="stat-subtext">${formatCurrency(payouts.total_amount || 0)} total</div>
                    </div>
                </div>
                
                <div class="big-stat-card purple">
                    <div class="stat-icon">📱</div>
                    <div class="stat-info">
                        <div class="stat-label">Device Changes</div>
                        <div class="stat-number">${formatNumber(summary.total_device_changes || 0)}</div>
                        <div class="stat-subtext">${formatNumber(devices.last_24h || 0)} in last 24h</div>
                    </div>
                </div>
                
                <div class="big-stat-card info">
                    <div class="stat-icon">✅</div>
                    <div class="stat-info">
                        <div class="stat-label">Approval Rate</div>
                        <div class="stat-number">${formatNumber(cancellations.approval_rate || 0, 1)}%</div>
                        <div class="stat-subtext">${formatNumber(cancellations.total_approved || 0)} approved</div>
                    </div>
                </div>
            </div>
            
            ${state.insights.length > 0 ? renderInsights() : ''}
            
            <div class="charts-section">
                <div class="chart-box">
                    <h3>Cancellation Trend</h3>
                    <div class="chart-wrapper">
                        <canvas id="overviewCancellationTrend"></canvas>
                    </div>
                </div>
                <div class="chart-box">
                    <h3>Payout Trend</h3>
                    <div class="chart-wrapper">
                        <canvas id="overviewPayoutTrend"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderInsights() {
        if (!state.insights || state.insights.length === 0) return '';
        
        return `
            <div class="insights-container">
                <h3 class="insights-title"><i class="fas fa-lightbulb"></i> Key Insights</h3>
                <div class="insights-grid">
                    ${state.insights.map(insight => `
                        <div class="insight-card ${insight.type}">
                            <div class="insight-icon">${insight.icon}</div>
                            <div class="insight-content">
                                <div class="insight-title">${insight.title}</div>
                                <div class="insight-text">${insight.text}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    function renderTabs() {
        return `
            <div class="simple-tabs">
                <button class="tab ${state.activeTab === 'overview' ? 'active' : ''}" onclick="window.AnalyticsWidget.switchTab('overview')">
                    <i class="fas fa-home"></i> Overview
                </button>
                <button class="tab ${state.activeTab === 'cancellations' ? 'active' : ''}" onclick="window.AnalyticsWidget.switchTab('cancellations')">
                    <i class="fas fa-times-circle"></i> Cancellations
                </button>
                <button class="tab ${state.activeTab === 'payouts' ? 'active' : ''}" onclick="window.AnalyticsWidget.switchTab('payouts')">
                    <i class="fas fa-money-bill-wave"></i> Payouts
                </button>
                <button class="tab ${state.activeTab === 'devices' ? 'active' : ''}" onclick="window.AnalyticsWidget.switchTab('devices')">
                    <i class="fas fa-mobile-alt"></i> Devices
                </button>
            </div>
        `;
    }
    
    function renderCancellationDetails(data) {
        const total = safeGet(data, 'total', 0);
        const last24h = safeGet(data, 'last_24h', 0);
        const approved = safeGet(data, 'total_approved', 0);
        const denied = safeGet(data, 'total_denied', 0);
        const pending = safeGet(data, 'total_pending', 0);
        const approvalRate = safeGet(data, 'approval_rate', 0);
        
        return `
            <div class="detail-stats">
                <div class="detail-card">
                    <div class="detail-icon" style="background: #f59e0b;">⏰</div>
                    <div class="detail-number">${formatNumber(last24h)}</div>
                    <div class="detail-label">Last 24 Hours</div>
                </div>
            </div>
            
            <div class="charts-section">
                <div class="chart-box">
                    <h3>Top 10 Operators</h3>
                    <div class="chart-wrapper">
                        <canvas id="deviceTopOperators"></canvas>
                    </div>
                </div>
                <div class="chart-box">
                    <h3>Change Trend</h3>
                    <div class="chart-wrapper">
                        <canvas id="deviceTrend"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading analytics...</p>
            </div>
        `;
    }
    
    function showError(container, message) {
        container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>${sanitizeHTML(message)}</p>
                <button class="retry-btn" onclick="window.AnalyticsWidget.refresh()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
    
    // ============================================
    // INTERACTIVE FUNCTIONS
    // ============================================
    
    function quickFilterChange(dateRange) {
        state.filters.dateRange = dateRange;
        refresh();
    }
    
    function switchTab(tab) {
        state.activeTab = tab;
        const container = document.getElementById(CONFIG.CONTAINER_ID);
        if (!container || !state.lastSuccessfulData) return;
        
        // Re-render tabs and content
        const tabsContainer = container.querySelector('.simple-tabs');
        if (tabsContainer) {
            tabsContainer.outerHTML = renderTabs();
        }
        
        const contentDiv = document.getElementById('tabContent');
        if (!contentDiv) return;
        
        const data = state.lastSuccessfulData;
        
        switch(tab) {
            case 'overview':
                contentDiv.innerHTML = renderOverview(data);
                setTimeout(() => {
                    if (data.cancellations?.trend?.length > 0) {
                        renderLineChart('overviewCancellationTrend', data.cancellations.trend, 'date', 'count', CONFIG.CHART_COLORS.primary);
                    }
                    if (data.payouts?.trend?.length > 0) {
                        renderLineChart('overviewPayoutTrend', data.payouts.trend, 'date', 'amount', CONFIG.CHART_COLORS.success);
                    }
                }, 100);
                break;
                
            case 'cancellations':
                contentDiv.innerHTML = renderCancellationDetails(data.cancellations);
                setTimeout(() => {
                    if (data.cancellations?.top_operators?.length > 0) {
                        renderBarChart('cancellationTopBooths', data.cancellations.top_operators, 'booth', 'count', CONFIG.CHART_COLORS.primary);
                    }
                    if (data.cancellations?.trend?.length > 0) {
                        renderLineChart('cancellationTrend', data.cancellations.trend, 'date', 'count', CONFIG.CHART_COLORS.success);
                    }
                }, 100);
                break;
                
            case 'payouts':
                contentDiv.innerHTML = renderPayoutDetails(data.payouts);
                setTimeout(() => {
                    if (data.payouts?.top_outlets?.length > 0) {
                        renderBarChart('payoutTopOutlets', data.payouts.top_outlets, 'outlet', 'amount', CONFIG.CHART_COLORS.warning);
                    }
                    if (data.payouts?.trend?.length > 0) {
                        renderLineChart('payoutTrend', data.payouts.trend, 'date', 'amount', CONFIG.CHART_COLORS.success);
                    }
                }, 100);
                break;
                
            case 'devices':
                contentDiv.innerHTML = renderDeviceDetails(data.device_changes);
                setTimeout(() => {
                    if (data.device_changes?.top_operators?.length > 0) {
                        renderBarChart('deviceTopOperators', data.device_changes.top_operators, 'operator', 'count', CONFIG.CHART_COLORS.purple);
                    }
                    if (data.device_changes?.trend?.length > 0) {
                        renderLineChart('deviceTrend', data.device_changes.trend, 'date', 'count', CONFIG.CHART_COLORS.info);
                    }
                }, 100);
                break;
        }
    }
    
    function exportData() {
        if (!state.lastSuccessfulData) return;
        
        const timestamp = new Date().toISOString().split('T')[0];
        downloadJSON(state.lastSuccessfulData, `analytics_${timestamp}.json`);
    }
    
    // ============================================
    // STYLES (SIMPLIFIED & MODERN)
    // ============================================
    
    function injectStyles() {
        if (document.getElementById('analytics-widget-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'analytics-widget-styles';
        style.textContent = `
            * { box-sizing: border-box; }
            
            #${CONFIG.CONTAINER_ID} {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .simple-header {
                background: white;
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 20px;
            }
            
            .header-main h1 {
                font-size: 32px;
                color: #1a202c;
                margin: 0 0 8px 0;
                font-weight: 700;
            }
            
            .update-time {
                font-size: 14px;
                color: #718096;
                margin: 0;
            }
            
            .header-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .simple-select {
                padding: 12px 20px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 14px;
                cursor: pointer;
                background: white;
                transition: all 0.2s;
                font-weight: 500;
            }
            
            .simple-select:hover {
                border-color: #667eea;
            }
            
            .refresh-btn, .export-btn {
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .refresh-btn:hover, .export-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            }
            
            .refresh-btn:disabled, .export-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .simple-tabs {
                display: flex;
                gap: 10px;
                background: white;
                padding: 10px;
                border-radius: 15px;
                margin-bottom: 20px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            }
            
            .simple-tabs .tab {
                flex: 1;
                padding: 15px 20px;
                border: none;
                background: transparent;
                color: #718096;
                border-radius: 10px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .simple-tabs .tab:hover {
                background: #f7fafc;
                color: #4a5568;
            }
            
            .simple-tabs .tab.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .overview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .big-stat-card {
                background: white;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }
            
            .big-stat-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 5px;
            }
            
            .big-stat-card.primary::before { background: #3b82f6; }
            .big-stat-card.success::before { background: #10b981; }
            .big-stat-card.purple::before { background: #8b5cf6; }
            .big-stat-card.info::before { background: #06b6d4; }
            
            .big-stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 50px rgba(0,0,0,0.15);
            }
            
            .big-stat-card .stat-icon {
                font-size: 40px;
                margin-bottom: 15px;
            }
            
            .big-stat-card .stat-label {
                font-size: 13px;
                color: #718096;
                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            
            .big-stat-card .stat-number {
                font-size: 48px;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 8px;
            }
            
            .big-stat-card .stat-subtext {
                font-size: 14px;
                color: #a0aec0;
            }
            
            .insights-container {
                background: white;
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            
            .insights-title {
                font-size: 24px;
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
            }
            
            .insight-card {
                padding: 20px;
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border-radius: 15px;
                display: flex;
                gap: 15px;
                align-items: flex-start;
                transition: all 0.2s;
                border-left: 5px solid #667eea;
            }
            
            .insight-card.success {
                border-left-color: #10b981;
            }
            
            .insight-card.warning {
                border-left-color: #f59e0b;
            }
            
            .insight-card.info {
                border-left-color: #06b6d4;
            }
            
            .insight-card:hover {
                transform: translateX(5px);
            }
            
            .insight-icon {
                font-size: 32px;
                flex-shrink: 0;
            }
            
            .insight-title {
                font-size: 16px;
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 5px;
            }
            
            .insight-text {
                font-size: 14px;
                color: #4a5568;
                line-height: 1.5;
            }
            
            .detail-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .detail-card {
                background: white;
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                transition: all 0.2s;
            }
            
            .detail-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            }
            
            .detail-icon {
                width: 60px;
                height: 60px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                margin: 0 auto 15px;
            }
            
            .detail-number {
                font-size: 36px;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 8px;
            }
            
            .detail-label {
                font-size: 13px;
                color: #718096;
                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            
            .charts-section {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .chart-box {
                background: white;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            
            .chart-box h3 {
                font-size: 20px;
                font-weight: 600;
                color: #1a202c;
                margin: 0 0 20px 0;
            }
            
            .chart-wrapper {
                position: relative;
                height: 300px;
            }
            
            .loading-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                color: white;
            }
            
            .spinner {
                width: 60px;
                height: 60px;
                border: 5px solid rgba(255,255,255,0.3);
                border-top: 5px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-state p {
                font-size: 18px;
                font-weight: 500;
            }
            
            .error-state {
                background: white;
                border-radius: 20px;
                padding: 60px 40px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            
            .error-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            
            .error-state h3 {
                font-size: 24px;
                color: #1a202c;
                margin: 0 0 10px 0;
            }
            
            .error-state p {
                font-size: 16px;
                color: #718096;
                margin: 0 0 30px 0;
            }
            
            .retry-btn {
                padding: 15px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                transition: all 0.2s;
            }
            
            .retry-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            }
            
            @media (max-width: 768px) {
                .simple-header {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .header-controls {
                    width: 100%;
                    flex-direction: column;
                }
                
                .simple-select, .refresh-btn, .export-btn {
                    width: 100%;
                    justify-content: center;
                }
                
                .simple-tabs {
                    flex-direction: column;
                }
                
                .overview-grid {
                    grid-template-columns: 1fr;
                }
                
                .charts-section {
                    grid-template-columns: 1fr;
                }
                
                .insights-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    async function initialize() {
        if (state.loading) {
            logger.warn('Already loading');
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
            
            await fetchFilterOptions();
            const data = await fetchAnalyticsData();
            
            container.innerHTML = '';
            container.innerHTML = renderHeader();
            
            const tabsDiv = document.createElement('div');
            tabsDiv.innerHTML = renderTabs();
            container.appendChild(tabsDiv);
            
            const contentDiv = document.createElement('div');
            contentDiv.id = 'tabContent';
            container.appendChild(contentDiv);
            
            // Render based on active tab
            switchTab(state.activeTab);
            
            state.loaded = true;
            state.loading = false;
            logger.info('✅ Widget initialized');
            
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
            logger.info('🔄 Auto-refresh');
            refresh();
        }, CONFIG.REFRESH_INTERVAL);
    }
    
    function refresh() {
        state.loaded = false;
        state.loading = false;
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
        
        logger.info('Widget destroyed');
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    window.AnalyticsWidget = {
        init: initialize,
        refresh: refresh,
        destroy: destroy,
        quickFilterChange: quickFilterChange,
        switchTab: switchTab,
        exportData: exportData,
        state: () => ({ 
            loaded: state.loaded,
            loading: state.loading,
            lastFetchTime: state.lastFetchTime,
            activeTab: state.activeTab,
            filters: state.filters,
            charts: Object.keys(state.charts)
        })
    };
    
    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            logger.info('📊 Analytics widget ready');
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                initialize();
            }
        });
    } else {
        logger.info('📊 Analytics widget ready');
        if (document.getElementById(CONFIG.CONTAINER_ID)) {
            initialize();
        }
    }
    
})();detail-icon" style="background: #3b82f6;">📋</div>
                    <div class="detail-number">${formatNumber(total)}</div>
                    <div class="detail-label">Total Cancellations</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #10b981;">✅</div>
                    <div class="detail-number">${formatNumber(approved)}</div>
                    <div class="detail-label">Approved</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #ef4444;">❌</div>
                    <div class="detail-number">${formatNumber(denied)}</div>
                    <div class="detail-label">Denied</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #f59e0b;">⏳</div>
                    <div class="detail-number">${formatNumber(pending)}</div>
                    <div class="detail-label">Pending</div>
                </div>
            </div>
            
            <div class="charts-section">
                <div class="chart-box">
                    <h3>Top 10 Booths</h3>
                    <div class="chart-wrapper">
                        <canvas id="cancellationTopBooths"></canvas>
                    </div>
                </div>
                <div class="chart-box">
                    <h3>Daily Trend</h3>
                    <div class="chart-wrapper">
                        <canvas id="cancellationTrend"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderPayoutDetails(data) {
        const total = safeGet(data, 'total', 0);
        const totalAmount = safeGet(data, 'total_amount', 0);
        const averageAmount = safeGet(data, 'average_amount', 0);
        const last24hCount = safeGet(data, 'last_24h.count', 0);
        
        return `
            <div class="detail-stats">
                <div class="detail-card">
                    <div class="detail-icon" style="background: #10b981;">💵</div>
                    <div class="detail-number">${formatNumber(total)}</div>
                    <div class="detail-label">Total Payouts</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #f59e0b;">💰</div>
                    <div class="detail-number" style="font-size: 24px;">${formatCurrency(totalAmount)}</div>
                    <div class="detail-label">Total Amount</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #06b6d4;">📊</div>
                    <div class="detail-number" style="font-size: 24px;">${formatCurrency(averageAmount)}</div>
                    <div class="detail-label">Average Payout</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #8b5cf6;">⏰</div>
                    <div class="detail-number">${formatNumber(last24hCount)}</div>
                    <div class="detail-label">Last 24 Hours</div>
                </div>
            </div>
            
            <div class="charts-section">
                <div class="chart-box">
                    <h3>Top 10 Outlets</h3>
                    <div class="chart-wrapper">
                        <canvas id="payoutTopOutlets"></canvas>
                    </div>
                </div>
                <div class="chart-box">
                    <h3>Amount Trend</h3>
                    <div class="chart-wrapper">
                        <canvas id="payoutTrend"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderDeviceDetails(data) {
        const total = safeGet(data, 'total', 0);
        const last24h = safeGet(data, 'last_24h', 0);
        const phoneCount = safeGet(data, 'by_type.phone', 0);
        const posCount = safeGet(data, 'by_type.pos', 0);
        
        return `
            <div class="detail-stats">
                <div class="detail-card">
                    <div class="detail-icon" style="background: #3b82f6;">🔄</div>
                    <div class="detail-number">${formatNumber(total)}</div>
                    <div class="detail-label">Total Changes</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #ec4899;">📱</div>
                    <div class="detail-number">${formatNumber(phoneCount)}</div>
                    <div class="detail-label">Phone Users</div>
                </div>
                <div class="detail-card">
                    <div class="detail-icon" style="background: #8b5cf6;">🖥️</div>
                    <div class="detail-number">${formatNumber(posCount)}</div>
                    <div class="detail-label">POS Users</div>
                </div>
                <div class="detail-card">
                    <div class="