// ============================================
// ADVANCED ANALYTICS MODULE WITH DYNAMIC FILTERING
// ============================================
// Usage: <div id="analyticsWidget"></div>

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        API_URL: 'https://raspberrypi.tail2aed63.ts.net',
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
    
    async function fetchFilterOptions() {
        try {
            logger.info('Fetching filter options...');
            const response = await fetchWithTimeout(
                `${CONFIG.API_URL}/analytics/v2/filters/options?api_key=${CONFIG.API_KEY}`,
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-cache'
                }
            );
            
            if (!response.ok) throw new Error('Failed to fetch filter options');
            
            const options = await response.json();
            state.filterOptions = options;
            logger.info('Filter options loaded successfully');
            return options;
        } catch (error) {
            logger.error(`Failed to fetch filter options: ${error.message}`);
            return null;
        }
    }
    
    async function fetchAnalyticsData(retryCount = 0) {
        try {
            logger.info(`Fetching analytics data (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
            
            const params = buildQueryParams();
            
            // Fetch all endpoints in parallel
            const endpoints = {
                cancellations: `${CONFIG.API_URL}/analytics/v2/cancellations?${params}&api_key=${CONFIG.API_KEY}`,
                payouts: `${CONFIG.API_URL}/analytics/v2/payouts?${params}&api_key=${CONFIG.API_KEY}`,
                deviceChanges: `${CONFIG.API_URL}/analytics/v2/device-changes?${params}&api_key=${CONFIG.API_KEY}`,
                summary: `${CONFIG.API_URL}/analytics/v2/summary?${params}&api_key=${CONFIG.API_KEY}`,
                insights: `${CONFIG.API_URL}/analytics/v2/insights?${params}&api_key=${CONFIG.API_KEY}`
            };
            
            const [cancellations, payouts, deviceChanges, summary, insights] = await Promise.all([
                fetchWithTimeout(endpoints.cancellations, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-cache'
                }).then(r => r.json()),
                fetchWithTimeout(endpoints.payouts, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-cache'
                }).then(r => r.json()),
                fetchWithTimeout(endpoints.deviceChanges, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-cache'
                }).then(r => r.json()),
                fetchWithTimeout(endpoints.summary, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-cache'
                }).then(r => r.json()),
                fetchWithTimeout(endpoints.insights, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-cache'
                }).then(r => r.json())
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
    // UI RENDERING
    // ============================================
    
    function renderFilterPanel(container) {
        if (!state.showFilters) return '';
        
        const options = state.filterOptions || {};
        const boothCodes = options.booth_codes || [];
        const outlets = options.outlets || [];
        const operators = options.operators || [];
        const statuses = options.statuses || [];
        const userTypes = ['phone', 'pos'];
        
        const filterHTML = `
            <div class="filter-panel" id="filterPanel">
                <div class="filter-header">
                    <h3>Filters</h3>
                    <div class="filter-actions">
                        <button class="btn-filter-action" onclick="window.AnalyticsWidget.resetFilters()">
                            <i class="fas fa-redo"></i> Reset
                        </button>
                        <button class="btn-filter-action" onclick="window.AnalyticsWidget.applyFilters()">
                            <i class="fas fa-check"></i> Apply
                        </button>
                    </div>
                </div>
                
                <div class="filter-grid">
                    <div class="filter-group">
                        <label>Date Range</label>
                        <select id="dateRangeSelect" class="filter-select">
                            <option value="today" ${state.filters.dateRange === 'today' ? 'selected' : ''}>Today</option>
                            <option value="last_7_days" ${state.filters.dateRange === 'last_7_days' ? 'selected' : ''}>Last 7 Days</option>
                            <option value="last_30_days" ${state.filters.dateRange === 'last_30_days' ? 'selected' : ''}>Last 30 Days</option>
                            <option value="last_90_days" ${state.filters.dateRange === 'last_90_days' ? 'selected' : ''}>Last 90 Days</option>
                            <option value="last_180_days" ${state.filters.dateRange === 'last_180_days' ? 'selected' : ''}>Last 180 Days</option>
                            <option value="last_365_days" ${state.filters.dateRange === 'last_365_days' ? 'selected' : ''}>Last 365 Days</option>
                            <option value="custom" ${state.filters.dateRange === 'custom' ? 'selected' : ''}>Custom Range</option>
                        </select>
                    </div>
                    
                    <div class="filter-group" id="customDateGroup" style="display: ${state.filters.dateRange === 'custom' ? 'block' : 'none'}">
                        <label>Start Date</label>
                        <input type="date" id="startDateInput" class="filter-input" value="${state.filters.startDate}">
                    </div>
                    
                    <div class="filter-group" id="customDateGroup2" style="display: ${state.filters.dateRange === 'custom' ? 'block' : 'none'}">
                        <label>End Date</label>
                        <input type="date" id="endDateInput" class="filter-input" value="${state.filters.endDate}">
                    </div>
                    
                    <div class="filter-group">
                        <label>Status</label>
                        <select id="statusSelect" class="filter-select">
                            <option value="">All Statuses</option>
                            ${statuses.map(s => `<option value="${s}" ${state.filters.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Booth Codes</label>
                        <div class="filter-multiselect" id="boothCodesSelect">
                            <div class="filter-multiselect-trigger" onclick="window.AnalyticsWidget.toggleMultiSelect('boothCodes')">
                                <span>${state.filters.boothCodes.length > 0 ? `${state.filters.boothCodes.length} selected` : 'Select booth codes'}</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="filter-multiselect-dropdown" id="boothCodesDropdown" style="display: none">
                                ${boothCodes.slice(0, 50).map(code => `
                                    <label class="filter-checkbox">
                                        <input type="checkbox" value="${code}" ${state.filters.boothCodes.includes(code) ? 'checked' : ''} 
                                            onchange="window.AnalyticsWidget.toggleFilter('boothCodes', '${code}')">
                                        <span>${code}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label>Outlets</label>
                        <div class="filter-multiselect" id="outletsSelect">
                            <div class="filter-multiselect-trigger" onclick="window.AnalyticsWidget.toggleMultiSelect('outlets')">
                                <span>${state.filters.outlets.length > 0 ? `${state.filters.outlets.length} selected` : 'Select outlets'}</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="filter-multiselect-dropdown" id="outletsDropdown" style="display: none">
                                ${outlets.slice(0, 50).map(outlet => `
                                    <label class="filter-checkbox">
                                        <input type="checkbox" value="${outlet}" ${state.filters.outlets.includes(outlet) ? 'checked' : ''} 
                                            onchange="window.AnalyticsWidget.toggleFilter('outlets', '${outlet}')">
                                        <span>${outlet}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label>Operators</label>
                        <div class="filter-multiselect" id="operatorsSelect">
                            <div class="filter-multiselect-trigger" onclick="window.AnalyticsWidget.toggleMultiSelect('operators')">
                                <span>${state.filters.operators.length > 0 ? `${state.filters.operators.length} selected` : 'Select operators'}</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="filter-multiselect-dropdown" id="operatorsDropdown" style="display: none">
                                ${operators.slice(0, 50).map(op => `
                                    <label class="filter-checkbox">
                                        <input type="checkbox" value="${op}" ${state.filters.operators.includes(op) ? 'checked' : ''} 
                                            onchange="window.AnalyticsWidget.toggleFilter('operators', '${op}')">
                                        <span>${op}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label>User Types</label>
                        <div class="filter-multiselect" id="userTypesSelect">
                            <div class="filter-multiselect-trigger" onclick="window.AnalyticsWidget.toggleMultiSelect('userTypes')">
                                <span>${state.filters.userTypes.length > 0 ? `${state.filters.userTypes.length} selected` : 'Select user types'}</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="filter-multiselect-dropdown" id="userTypesDropdown" style="display: none">
                                ${userTypes.map(type => `
                                    <label class="filter-checkbox">
                                        <input type="checkbox" value="${type}" ${state.filters.userTypes.includes(type) ? 'checked' : ''} 
                                            onchange="window.AnalyticsWidget.toggleFilter('userTypes', '${type}')">
                                        <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return filterHTML;
    }
    
    function renderInsights() {
        if (!state.insights || state.insights.length === 0) return '';
        
        const severityColors = {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#3b82f6'
        };
        
        const severityIcons = {
            high: 'fa-exclamation-triangle',
            medium: 'fa-exclamation-circle',
            low: 'fa-info-circle'
        };
        
        return `
            <div class="insights-section">
                <h3><i class="fas fa-lightbulb"></i> Insights & Alerts</h3>
                <div class="insights-grid">
                    ${state.insights.map(insight => `
                        <div class="insight-card insight-${insight.severity}">
                            <div class="insight-icon" style="color: ${severityColors[insight.severity]}">
                                <i class="fas ${severityIcons[insight.severity]}"></i>
                            </div>
                            <div class="insight-content">
                                <h4>${insight.title}</h4>
                                <p>${insight.message}</p>
                                <span class="insight-category">${insight.category}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    function renderHeader() {
        const activeFiltersCount = [
            state.filters.status,
            ...state.filters.boothCodes,
            ...state.filters.outlets,
            ...state.filters.operators,
            ...state.filters.userTypes
        ].filter(f => f).length + (state.filters.dateRange !== 'last_30_days' ? 1 : 0);
        
        return `
            <div class="analytics-header">
                <div class="header-left">
                    <h1>Advanced Analytics Dashboard</h1>
                    <p class="header-subtitle">Last updated: ${new Date(state.lastFetchTime).toLocaleTimeString()}</p>
                </div>
                <div class="header-actions">
                    <button class="btn-header" onclick="window.AnalyticsWidget.toggleFilters()">
                        <i class="fas fa-filter"></i> Filters
                        ${activeFiltersCount > 0 ? `<span class="badge-count">${activeFiltersCount}</span>` : ''}
                    </button>
                    <button class="btn-header" onclick="window.AnalyticsWidget.exportData()">
                        <i class="fas fa-download"></i> Export
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
            const pending = safeGet(data, 'by_status.requested', safeGet(data, 'by_status.pending', 0));
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
                            <canvas id="cancellationChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h5>Cancellation Trend</h5>
                            <canvas id="cancellationTrendChart"></canvas>
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
                            <canvas id="payoutChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h5>Payout Trend</h5>
                            <canvas id="payoutTrendChart"></canvas>
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
                            <canvas id="deviceChangeChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h5>Device Change Trend</h5>
                            <canvas id="deviceChangeTrendChart"></canvas>
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
    
    function injectStyles() {
        if (document.getElementById('analytics-widget-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'analytics-widget-styles';
        style.textContent = `
            .analytics-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 20px; }
            .loading-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .analytics-error { text-align: center; padding: 60px 20px; }
            .error-icon { font-size: 48px; color: #ef4444; margin-bottom: 20px; }
            .analytics-error h3 { margin: 0 0 10px; color: #1f2937; }
            .analytics-error p { color: #6b7280; margin-bottom: 20px; }
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
            
            .filter-panel { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); margin-bottom: 20px; }
            .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb; }
            .filter-header h3 { margin: 0; font-size: 18px; }
            .filter-actions { display: flex; gap: 8px; }
            .btn-filter-action { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s; }
            .btn-filter-action:hover { background: #2563eb; }
            .btn-filter-action:first-child { background: #f3f4f6; color: #374151; }
            .btn-filter-action:first-child:hover { background: #e5e7eb; }
            
            .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
            .filter-group { display: flex; flex-direction: column; gap: 8px; }
            .filter-group label { font-size: 13px; font-weight: 500; color: #374151; }
            .filter-select, .filter-input { padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; background: white; width: 100%; }
            .filter-select:focus, .filter-input:focus { outline: none; border-color: #3b82f6; }
            
            .filter-multiselect { position: relative; }
            .filter-multiselect-trigger { padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
            .filter-multiselect-trigger:hover { border-color: #9ca3af; }
            .filter-multiselect-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #d1d5db; border-radius: 6px; margin-top: 4px; max-height: 200px; overflow-y: auto; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .filter-checkbox { display: flex; align-items: center; padding: 8px 12px; cursor: pointer; font-size: 13px; }
            .filter-checkbox:hover { background: #f3f4f6; }
            .filter-checkbox input { margin-right: 8px; }
            
            .insights-section { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); margin-bottom: 20px; }
            .insights-section h3 { margin: 0 0 16px; font-size: 18px; display: flex; align-items: center; gap: 10px; }
            .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
            .insight-card { display: flex; gap: 16px; padding: 16px; border-radius: 8px; border-left: 4px solid; }
            .insight-card.insight-high { background: #fef2f2; border-color: #ef4444; }
            .insight-card.insight-medium { background: #fffbeb; border-color: #f59e0b; }
            .insight-card.insight-low { background: #eff6ff; border-color: #3b82f6; }
            .insight-icon { font-size: 24px; flex-shrink: 0; }
            .insight-content h4 { margin: 0 0 4px; font-size: 14px; font-weight: 600; }
            .insight-content p { margin: 0 0 8px; font-size: 13px; color: #6b7280; }
            .insight-category { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; background: rgba(0, 0, 0, 0.05); }
            
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
                .filter-grid { grid-template-columns: 1fr; }
                .analytics-summary { grid-template-columns: 1fr; }
                .charts-grid { grid-template-columns: 1fr; }
                .metric-card { flex-direction: column; text-align: center; }
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
            
            injectStyles();
            showLoading(container);
            
            // Fetch filter options first
            await fetchFilterOptions();
            
            // Fetch and render data
            const data = await fetchAnalyticsData();
            
            // Clear container
            container.innerHTML = '';
            
            // Render header
            container.innerHTML = renderHeader();
            
            // Render filter panel
            if (state.showFilters) {
                container.innerHTML += renderFilterPanel();
            }
            
            // Render insights
            container.innerHTML += renderInsights();
            
            // Create section containers
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
            
            // Setup event listeners
            setupEventListeners();
            
            state.loaded = true;
            logger.info('✅ Advanced Analytics widget initialized successfully');
            
            scheduleRefresh();
            
        } catch (error) {
            logger.error(`Initialization failed: ${error.message}`);
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (container) {
                showError(container, error.message);
            }
        }
    }
    
    function setupEventListeners() {
        // Date range selector
        const dateRangeSelect = document.getElementById('dateRangeSelect');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                state.filters.dateRange = e.target.value;
                const customGroups = document.querySelectorAll('#customDateGroup, #customDateGroup2');
                customGroups.forEach(group => {
                    group.style.display = e.target.value === 'custom' ? 'block' : 'none';
                });
            });
        }
        
        // Start/End date inputs
        const startDateInput = document.getElementById('startDateInput');
        const endDateInput = document.getElementById('endDateInput');
        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                state.filters.startDate = e.target.value;
            });
        }
        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                state.filters.endDate = e.target.value;
            });
        }
        
        // Status selector
        const statusSelect = document.getElementById('statusSelect');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                state.filters.status = e.target.value;
            });
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
        state.loading = true;
        return initialize();
    }
    
    function toggleFilters() {
        state.showFilters = !state.showFilters;
        refresh();
    }
    
    function toggleMultiSelect(filterName) {
        const dropdown = document.getElementById(`${filterName}Dropdown`);
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    function toggleFilter(filterName, value) {
        const currentValues = state.filters[filterName];
        const index = currentValues.indexOf(value);
        
        if (index > -1) {
            currentValues.splice(index, 1);
        } else {
            currentValues.push(value);
        }
    }
    
    function resetFilters() {
        state.filters = {
            dateRange: 'last_30_days',
            startDate: '',
            endDate: '',
            status: '',
            boothCodes: [],
            outlets: [],
            operators: [],
            userTypes: []
        };
        refresh();
    }
    
    function applyFilters() {
        refresh();
    }
    
    function exportData() {
        const params = buildQueryParams();
        const sections = ['cancellations', 'payouts', 'device_changes'];
        
        sections.forEach(section => {
            const url = `${CONFIG.API_URL}/analytics/v2/export/${section}?${params}&api_key=${CONFIG.API_KEY}`;
            window.open(url, '_blank');
        });
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
        toggleFilters: toggleFilters,
        toggleMultiSelect: toggleMultiSelect,
        toggleFilter: toggleFilter,
        resetFilters: resetFilters,
        applyFilters: applyFilters,
        exportData: exportData,
        state: () => ({ ...state, charts: Object.keys(state.charts) })
    };
    
    // ============================================
    // AUTO-INITIALIZE
    // ============================================
    
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