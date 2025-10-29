// ============================================
// REAL-TIME ANALYTICS MODULE WITH CUSTOM QUERIES
// ============================================
(function() {
    'use strict';
    
    const CONFIG = {
        API_URL: 'https://api.northman-gaming-corporation.site',
        API_KEY: '200206',
        QUERY_ENDPOINT: '/api/query',
        EVENTS_ENDPOINT: '/api/events/subscribe',
        REFRESH_INTERVAL: 300000, // 5 minutes (fallback only)
        MAX_RETRIES: 3,
        RETRY_DELAY: 2000,
        REQUEST_TIMEOUT: 30000,
        CONTAINER_ID: 'analyticsWidget',
        USE_REALTIME: true, // Use Server-Sent Events
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
        eventSource: null,
        loaded: false,
        loading: false,
        lastSuccessfulData: null,
        lastFetchTime: 0,
        retryCount: 0,
        abortController: null,
        filters: {
            dateRange: 'last_30_days',
            days: 30,
            startDate: '',
            endDate: '',
            status: '',
            boothCodes: [],
            outlets: []
        },
        showFilters: false,
        activeTab: 'cancellations',
        connectionMode: 'disconnected', // disconnected, events, polling
        consecutiveErrors: 0
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
    
    function formatDateForSQL(dateStr) {
        if (!dateStr) return null;
        try {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        } catch {
            return null;
        }
    }
    
    function getDateRangeSQL() {
        if (state.filters.dateRange === 'custom') {
            const start = formatDateForSQL(state.filters.startDate);
            const end = formatDateForSQL(state.filters.endDate);
            
            if (start && end) {
                return {
                    condition: `timestamp BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`,
                    label: `${start} to ${end}`
                };
            }
        }
        
        // Use preset ranges
        const days = state.filters.days || 30;
        return {
            condition: `timestamp >= NOW() - INTERVAL '${days} days'`,
            label: `Last ${days} days`
        };
    }
    
    // ============================================
    // CUSTOM QUERY API
    // ============================================
    
    async function executeQuery(query, params = []) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.QUERY_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'X-API-Key': CONFIG.API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query, params }),
                signal: AbortSignal.timeout(CONFIG.REQUEST_TIMEOUT)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
            }
            
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            logger.error(`Query execution error: ${error.message}`);
            throw error;
        }
    }
    
    async function fetchAnalyticsData() {
        try {
            logger.info('Fetching analytics data with custom queries...');
            
            const dateRange = getDateRangeSQL();
            const whereClause = dateRange.condition;
            
            // Query 1: Cancellations Summary
            const cancellationsQuery = `
                SELECT 
                    COUNT(DISTINCT ticket_id) as total,
                    COUNT(DISTINCT CASE WHEN status = 'approved' THEN ticket_id END) as approved,
                    COUNT(DISTINCT CASE WHEN status = 'denied' THEN ticket_id END) as denied,
                    COUNT(DISTINCT CASE WHEN status = 'requested' THEN ticket_id END) as pending
                FROM cancellations
                WHERE ${whereClause}
            `;
            
            // Query 2: Last 24h Cancellations
            const last24hQuery = `
                SELECT COUNT(DISTINCT ticket_id) as count
                FROM cancellations
                WHERE timestamp >= NOW() - INTERVAL '24 hours'
            `;
            
            // Query 3: Top Operators
            const topOperatorsQuery = `
                SELECT 
                    booth_code as booth,
                    COUNT(DISTINCT ticket_id) as count
                FROM cancellations
                WHERE ${whereClause}
                AND booth_code IS NOT NULL AND booth_code != ''
                GROUP BY booth_code
                ORDER BY count DESC
                LIMIT 10
            `;
            
            // Query 4: Daily Trend
            const trendQuery = `
                SELECT 
                    DATE(timestamp) as date,
                    COUNT(DISTINCT ticket_id) as count
                FROM cancellations
                WHERE ${whereClause}
                GROUP BY DATE(timestamp)
                ORDER BY date
            `;
            
            // Query 5: Payouts Summary
            const payoutsQuery = `
                SELECT 
                    COUNT(*) as total,
                    COALESCE(SUM(payout_amount), 0) as total_amount,
                    COALESCE(AVG(payout_amount), 0) as average_amount,
                    COALESCE(MIN(payout_amount), 0) as min_amount,
                    COALESCE(MAX(payout_amount), 0) as max_amount
                FROM payouts
                WHERE ${whereClause}
            `;
            
            // Query 6: Last 24h Payouts
            const payouts24hQuery = `
                SELECT 
                    COUNT(*) as count,
                    COALESCE(SUM(payout_amount), 0) as amount
                FROM payouts
                WHERE timestamp >= NOW() - INTERVAL '24 hours'
            `;
            
            // Query 7: Top Outlets
            const topOutletsQuery = `
                SELECT 
                    outlet,
                    COUNT(*) as count,
                    SUM(payout_amount) as amount
                FROM payouts
                WHERE ${whereClause}
                AND outlet IS NOT NULL AND outlet != ''
                GROUP BY outlet
                ORDER BY amount DESC
                LIMIT 10
            `;
            
            // Query 8: Payout Trend
            const payoutTrendQuery = `
                SELECT 
                    DATE(timestamp) as date,
                    SUM(payout_amount) as amount
                FROM payouts
                WHERE ${whereClause}
                GROUP BY DATE(timestamp)
                ORDER BY date
            `;
            
            // Execute all queries in parallel
            const [
                cancellationsSummary,
                last24h,
                topOperators,
                trend,
                payoutsSummary,
                payouts24h,
                topOutlets,
                payoutTrend
            ] = await Promise.all([
                executeQuery(cancellationsQuery),
                executeQuery(last24hQuery),
                executeQuery(topOperatorsQuery),
                executeQuery(trendQuery),
                executeQuery(payoutsQuery),
                executeQuery(payouts24hQuery),
                executeQuery(topOutletsQuery),
                executeQuery(payoutTrendQuery)
            ]);
            
            const cSum = cancellationsSummary[0] || {};
            const totalRequested = (cSum.approved || 0) + (cSum.denied || 0) + (cSum.pending || 0);
            const approvalRate = totalRequested > 0 ? ((cSum.approved || 0) / totalRequested * 100) : 0;
            
            const data = {
                cancellations: {
                    total: cSum.total || 0,
                    last_24h: last24h[0]?.count || 0,
                    by_status: {
                        approved: cSum.approved || 0,
                        denied: cSum.denied || 0,
                        pending: cSum.pending || 0
                    },
                    approval_rate: approvalRate,
                    top_operators: topOperators,
                    trend: trend
                },
                payouts: {
                    total: payoutsSummary[0]?.total || 0,
                    total_amount: parseFloat(payoutsSummary[0]?.total_amount || 0),
                    average_amount: parseFloat(payoutsSummary[0]?.average_amount || 0),
                    min_amount: parseFloat(payoutsSummary[0]?.min_amount || 0),
                    max_amount: parseFloat(payoutsSummary[0]?.max_amount || 0),
                    last_24h: {
                        count: payouts24h[0]?.count || 0,
                        amount: parseFloat(payouts24h[0]?.amount || 0)
                    },
                    top_outlets: topOutlets.map(o => ({
                        ...o,
                        amount: parseFloat(o.amount || 0)
                    })),
                    trend: payoutTrend.map(t => ({
                        ...t,
                        amount: parseFloat(t.amount || 0)
                    }))
                },
                summary: {
                    overview: {
                        total_cancellations: cSum.total || 0,
                        total_payouts: payoutsSummary[0]?.total || 0,
                        total_device_changes: 0
                    }
                },
                dateRange: dateRange.label,
                timestamp: new Date().toISOString()
            };
            
            state.lastSuccessfulData = data;
            state.lastFetchTime = Date.now();
            state.consecutiveErrors = 0;
            
            logger.info('✅ Analytics data fetched');
            return data;
            
        } catch (error) {
            logger.error(`Fetch failed: ${error.message}`);
            state.consecutiveErrors++;
            
            if (state.lastSuccessfulData) {
                logger.warn('Using cached data');
                return state.lastSuccessfulData;
            }
            throw error;
        }
    }
    
    // ============================================
    // REAL-TIME EVENT STREAM
    // ============================================
    
    function startEventStream() {
        if (!CONFIG.USE_REALTIME) {
            logger.info('Real-time disabled, using polling');
            startPolling();
            return;
        }
        
        stopEventStream();
        logger.info('Starting event stream connection...');
        
        try {
            state.eventSource = new EventSource(
                `${CONFIG.API_URL}${CONFIG.EVENTS_ENDPOINT}?api_key=${CONFIG.API_KEY}`
            );
            
            state.eventSource.onopen = () => {
                logger.info('✅ Event stream connected');
                state.connectionMode = 'events';
                state.consecutiveErrors = 0;
                updateConnectionStatus();
            };
            
            state.eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    logger.info('📨 Received event:', data.type);
                    
                    if (data.type === 'update' || data.type === 'change') {
                        logger.info('🔄 Database change detected, refreshing...');
                        refresh();
                    } else if (data.type === 'heartbeat') {
                        logger.info('💓 Heartbeat');
                    }
                } catch (error) {
                    logger.error('Error parsing event:', error);
                }
            };
            
            state.eventSource.onerror = (error) => {
                logger.error('❌ Event stream error');
                state.consecutiveErrors++;
                
                if (state.eventSource.readyState === EventSource.CLOSED) {
                    logger.info('🔌 Event stream closed');
                    state.connectionMode = 'disconnected';
                    updateConnectionStatus();
                    
                    setTimeout(() => {
                        if (state.consecutiveErrors < 5) {
                            startEventStream();
                        } else {
                            logger.warn('⚠️ Too many errors, falling back to polling');
                            stopEventStream();
                            startPolling();
                        }
                    }, 5000);
                }
            };
            
        } catch (error) {
            logger.error('Failed to start event stream:', error);
            logger.info('Falling back to polling mode');
            startPolling();
        }
    }
    
    function stopEventStream() {
        if (state.eventSource) {
            state.eventSource.close();
            state.eventSource = null;
            logger.info('🛑 Event stream stopped');
        }
    }
    
    function startPolling() {
        stopPolling();
        logger.info(`Starting polling mode (${CONFIG.REFRESH_INTERVAL}ms)...`);
        state.connectionMode = 'polling';
        updateConnectionStatus();
        
        state.refreshTimer = setInterval(() => {
            logger.info('🔄 Auto-refresh (polling)');
            refresh();
        }, CONFIG.REFRESH_INTERVAL);
    }
    
    function stopPolling() {
        if (state.refreshTimer) {
            clearInterval(state.refreshTimer);
            state.refreshTimer = null;
            logger.info('🛑 Polling stopped');
        }
    }
    
    function updateConnectionStatus() {
        const statusEl = document.querySelector('.connection-status');
        if (!statusEl) return;
        
        const statusMap = {
            events: { text: '🟢 Live', class: 'status-connected', icon: 'fa-bolt' },
            polling: { text: '🟡 Polling', class: 'status-polling', icon: 'fa-sync' },
            disconnected: { text: '🔴 Disconnected', class: 'status-error', icon: 'fa-exclamation-circle' }
        };
        
        const status = statusMap[state.connectionMode] || statusMap.disconnected;
        statusEl.innerHTML = `<i class="fas ${status.icon}"></i> ${status.text}`;
        statusEl.className = `connection-status ${status.class}`;
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
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    // UI RENDERING
    // ============================================
    
    function renderHeader() {
        const lastUpdate = state.lastFetchTime > 0 
            ? new Date(state.lastFetchTime).toLocaleTimeString()
            : 'Never';
        
        const activeFiltersCount = state.filters.dateRange !== 'last_30_days' ? 1 : 0;
        
        return `
            <div class="analytics-header">
                <div class="header-left">
                    <h1><i class="fas fa-chart-line"></i> Real-Time Analytics Dashboard</h1>
                    <p class="header-subtitle">
                        <i class="fas fa-clock"></i> Last updated: ${lastUpdate}
                        <span class="separator">•</span>
                        <span class="connection-status"></span>
                        ${state.lastSuccessfulData ? `<span class="separator">•</span><i class="fas fa-calendar"></i> ${state.lastSuccessfulData.dateRange}` : ''}
                    </p>
                </div>
                <div class="header-actions">
                    <button class="btn-header ${state.showFilters ? 'active' : ''}" onclick="window.AnalyticsWidget.toggleFilters()">
                        <i class="fas fa-filter"></i> Filters
                        ${activeFiltersCount > 0 ? `<span class="badge-count">${activeFiltersCount}</span>` : ''}
                    </button>
                    <button class="btn-header" onclick="window.AnalyticsWidget.switchMode()" title="Toggle real-time/polling">
                        <i class="fas fa-${CONFIG.USE_REALTIME ? 'bolt' : 'sync'}"></i> 
                        ${CONFIG.USE_REALTIME ? 'Real-time' : 'Polling'}
                    </button>
                    <button class="btn-header" onclick="window.AnalyticsWidget.refresh()" ${state.loading ? 'disabled' : ''}>
                        <i class="fas fa-sync-alt ${state.loading ? 'fa-spin' : ''}"></i> Refresh
                    </button>
                </div>
            </div>
            ${state.showFilters ? renderFilterPanel() : ''}
        `;
    }
    
    function renderFilterPanel() {
        return `
            <div class="filter-panel">
                <div class="filter-section">
                    <h4><i class="fas fa-calendar-alt"></i> Date Range Filter</h4>
                    <div class="filter-group">
                        <label>Preset Ranges</label>
                        <select id="dateRangeSelect" class="filter-input" onchange="window.AnalyticsWidget.updateDateRange(this.value)">
                            <option value="today" ${state.filters.dateRange === 'today' ? 'selected' : ''}>Today</option>
                            <option value="last_7_days" ${state.filters.dateRange === 'last_7_days' ? 'selected' : ''}>Last 7 Days</option>
                            <option value="last_30_days" ${state.filters.dateRange === 'last_30_days' ? 'selected' : ''}>Last 30 Days</option>
                            <option value="last_90_days" ${state.filters.dateRange === 'last_90_days' ? 'selected' : ''}>Last 90 Days</option>
                            <option value="last_180_days" ${state.filters.dateRange === 'last_180_days' ? 'selected' : ''}>Last 180 Days</option>
                            <option value="last_365_days" ${state.filters.dateRange === 'last_365_days' ? 'selected' : ''}>Last 365 Days</option>
                            <option value="custom" ${state.filters.dateRange === 'custom' ? 'selected' : ''}>Custom Range</option>
                        </select>
                    </div>
                    ${state.filters.dateRange === 'custom' ? `
                        <div class="filter-group custom-date-range">
                            <div class="date-input-wrapper">
                                <label>Start Date</label>
                                <input type="date" id="startDate" class="filter-input" value="${state.filters.startDate}" 
                                       onchange="window.AnalyticsWidget.updateCustomDate('startDate', this.value)">
                            </div>
                            <span class="date-separator"><i class="fas fa-arrow-right"></i></span>
                            <div class="date-input-wrapper">
                                <label>End Date</label>
                                <input type="date" id="endDate" class="filter-input" value="${state.filters.endDate}" 
                                       onchange="window.AnalyticsWidget.updateCustomDate('endDate', this.value)">
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="filter-actions">
                    <button class="btn-filter btn-apply" onclick="window.AnalyticsWidget.applyFilters()">
                        <i class="fas fa-check"></i> Apply Filters
                    </button>
                    <button class="btn-filter btn-clear" onclick="window.AnalyticsWidget.clearFilters()">
                        <i class="fas fa-times"></i> Reset to Default
                    </button>
                </div>
            </div>
        `;
    }
    
    function renderSummaryCards(data) {
        const summary = safeGet(data, 'summary.overview', {});
        
        return `
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="summary-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="summary-content">
                        <h4>Total Cancellations</h4>
                        <div class="summary-value">${formatNumber(summary.total_cancellations || 0)}</div>
                        <div class="summary-change">${data.dateRange || 'Last 30 days'}</div>
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="summary-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="summary-content">
                        <h4>Total Payouts</h4>
                        <div class="summary-value">${formatNumber(summary.total_payouts || 0)}</div>
                        <div class="summary-change success">${data.dateRange || 'Last 30 days'}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderTabs() {
        return `
            <div class="analytics-tabs">
                <button class="tab-button ${state.activeTab === 'cancellations' ? 'active' : ''}" 
                        onclick="window.AnalyticsWidget.switchTab('cancellations')">
                    <i class="fas fa-times-circle"></i> Cancellations
                </button>
                <button class="tab-button ${state.activeTab === 'payouts' ? 'active' : ''}" 
                        onclick="window.AnalyticsWidget.switchTab('payouts')">
                    <i class="fas fa-money-bill-wave"></i> Payouts
                </button>
            </div>
        `;
    }
    
    function renderCancellationAnalytics(data, container) {
        try {
            const total = safeGet(data, 'total', 0);
            const last24h = safeGet(data, 'last_24h', 0);
            const approved = safeGet(data, 'by_status.approved', 0);
            const denied = safeGet(data, 'by_status.denied', 0);
            const pending = safeGet(data, 'by_status.pending', 0);
            const approvalRate = safeGet(data, 'approval_rate', 0);
            
            container.innerHTML = `
                <div class="analytics-metrics">
                    <div class="metric-card">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="metric-content">
                            <h4>Total Cancellations</h4>
                            <div class="metric-value">${formatNumber(total)}</div>
                            <div class="metric-subtext">${formatNumber(last24h)} in last 24h</div>
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
                        <div class="chart-header">
                            <h5>Top 10 Operators by Cancellations</h5>
                        </div>
                        <canvas id="cancellationChart" height="300"></canvas>
                    </div>
                    <div class="chart-container">
                        <div class="chart-header">
                            <h5>Cancellation Trend</h5>
                        </div>
                        <canvas id="cancellationTrendChart" height="300"></canvas>
                    </div>
                </div>
            `;
            
            const topOperators = safeGet(data, 'top_operators', []);
            const trend = safeGet(data, 'trend', []);
            
            if (topOperators.length > 0) {
                setTimeout(() => renderBarChart('cancellationChart', topOperators, 'booth', 'count', CONFIG.CHART_COLORS.primary), 100);
            }
            if (trend.length > 0) {
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
            const minAmount = safeGet(data, 'min_amount', 0);
            const maxAmount = safeGet(data, 'max_amount', 0);
            
            container.innerHTML = `
                <div class="analytics-metrics">
                    <div class="metric-card">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <div class="metric-content">
                            <h4>Total Payouts</h4>
                            <div class="metric-value">${formatNumber(total)}</div>
                            <div class="metric-subtext">${formatNumber(last24hCount)} in last 24h</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="metric-content">
                            <h4>Total Amount</h4>
                            <div class="metric-value warning">${formatCurrency(totalAmount)}</div>
                            <div class="metric-subtext">${formatCurrency(last24hAmount)} today</div>
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
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <div class="metric-content">
                            <h4>Range</h4>
                            <div class="metric-value purple" style="font-size: 18px;">${formatCurrency(minAmount)} - ${formatCurrency(maxAmount)}</div>
                            <div class="metric-subtext">Min - Max</div>
                        </div>
                    </div>
                </div>
                <div class="charts-grid">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h5>Top 10 Outlets by Amount</h5>
                        </div>
                        <canvas id="payoutChart" height="300"></canvas>
                    </div>
                    <div class="chart-container">
                        <div class="chart-header">
                            <h5>Payout Amount Trend</h5>
                        </div>
                        <canvas id="payoutTrendChart" height="300"></canvas>
                    </div>
                </div>
            `;
            
            const topOutlets = safeGet(data, 'top_outlets', []);
            const trend = safeGet(data, 'trend', []);
            
            if (topOutlets.length > 0) {
                setTimeout(() => renderBarChart('payoutChart', topOutlets, 'outlet', 'amount', CONFIG.CHART_COLORS.warning), 100);
            }
            if (trend.length > 0) {
                setTimeout(() => renderLineChart('payoutTrendChart', trend, 'date', 'amount', CONFIG.CHART_COLORS.success), 100);
            }
        } catch (error) {
            logger.error(`Payout render error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to render payout analytics</div>';
        }
    }
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="analytics-loading">
                <div class="loading-spinner"></div>
                <span>Loading real-time analytics...</span>
                <p class="loading-status">Connecting to database...</p>
            </div>
        `;
    }
    
    function showError(container, message) {
        container.innerHTML = `
            <div class="analytics-error">
                <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <h3>Failed to Load Analytics</h3>
                <p>${sanitizeHTML(message)}</p>
                <button class="btn-retry" onclick="window.AnalyticsWidget.refresh()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
    
    // ============================================
    // INTERACTIVE FUNCTIONS
    // ============================================
    
    function updateDateRange(value) {
        state.filters.dateRange = value;
        
        // Update days based on preset
        const daysMap = {
            'today': 1,
            'last_7_days': 7,
            'last_30_days': 30,
            'last_90_days': 90,
            'last_180_days': 180,
            'last_365_days': 365
        };
        
        if (daysMap[value]) {
            state.filters.days = daysMap[value];
        }
        
        // Re-render filter panel to show/hide custom date inputs
        const header = document.querySelector('.analytics-header');
        if (header) {
            header.outerHTML = renderHeader();
        }
    }
    
    function updateCustomDate(field, value) {
        state.filters[field] = value;
    }
    
    function toggleFilters() {
        state.showFilters = !state.showFilters;
        const header = document.querySelector('.analytics-header');
        if (header) {
            header.outerHTML = renderHeader();
        }
    }
    
    function applyFilters() {
        // Validate custom date range
        if (state.filters.dateRange === 'custom') {
            if (!state.filters.startDate || !state.filters.endDate) {
                alert('Please select both start and end dates for custom range');
                return;
            }
            
            const start = new Date(state.filters.startDate);
            const end = new Date(state.filters.endDate);
            
            if (start > end) {
                alert('Start date must be before end date');
                return;
            }
        }
        
        state.showFilters = false;
        refresh();
    }
    
    function clearFilters() {
        state.filters = {
            dateRange: 'last_30_days',
            days: 30,
            startDate: '',
            endDate: '',
            status: '',
            boothCodes: [],
            outlets: []
        };
        
        const header = document.querySelector('.analytics-header');
        if (header) {
            header.outerHTML = renderHeader();
        }
    }
    
    function switchTab(tab) {
        state.activeTab = tab;
        refresh();
    }
    
    function switchMode() {
        CONFIG.USE_REALTIME = !CONFIG.USE_REALTIME;
        
        if (CONFIG.USE_REALTIME) {
            stopPolling();
            startEventStream();
        } else {
            stopEventStream();
            startPolling();
        }
        
        const header = document.querySelector('.analytics-header');
        if (header) {
            header.outerHTML = renderHeader();
            updateConnectionStatus();
        }
    }
    
    // ============================================
    // STYLES
    // ============================================
    
    function injectStyles() {
        if (document.getElementById('analytics-widget-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'analytics-widget-styles';
        style.textContent = `
            * { box-sizing: border-box; }
            
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
            .loading-status { font-size: 13px; color: #6b7280; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .analytics-error { text-align: center; padding: 60px 20px; }
            .error-icon { font-size: 48px; color: #ef4444; margin-bottom: 20px; }
            .analytics-error h3 { margin: 0 0 10px; color: #1f2937; }
            .analytics-error p { color: #6b7280; margin-bottom: 20px; }
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
            }
            .btn-retry:hover { background: #2563eb; }
            
            .analytics-header { 
                background: white; 
                padding: 24px; 
                border-radius: 12px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
                margin-bottom: 20px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                flex-wrap: wrap; 
                gap: 16px; 
            }
            .header-left h1 { 
                font-size: 24px; 
                font-weight: 700; 
                margin: 0 0 8px; 
                display: flex; 
                align-items: center; 
                gap: 10px; 
            }
            .header-subtitle { 
                font-size: 13px; 
                color: #6b7280; 
                display: flex; 
                align-items: center; 
                gap: 8px; 
                flex-wrap: wrap;
            }
            .separator { color: #d1d5db; }
            .connection-status { 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 600; 
                display: inline-flex; 
                align-items: center; 
                gap: 4px; 
            }
            .status-connected { background: #d1fae5; color: #065f46; }
            .status-polling { background: #fef3c7; color: #92400e; }
            .status-error { background: #fee2e2; color: #991b1b; }
            
            .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
            .btn-header { 
                background: #f3f4f6; 
                color: #374151; 
                border: none; 
                padding: 10px 16px; 
                border-radius: 8px; 
                cursor: pointer; 
                font-size: 14px; 
                font-weight: 500; 
                display: inline-flex; 
                align-items: center; 
                gap: 8px; 
                transition: all 0.2s; 
                position: relative;
            }
            .btn-header:hover { background: #e5e7eb; transform: translateY(-1px); }
            .btn-header:disabled { opacity: 0.5; cursor: not-allowed; }
            .btn-header.active { background: #3b82f6; color: white; }
            .badge-count { 
                background: #ef4444; 
                color: white; 
                padding: 2px 6px; 
                border-radius: 10px; 
                font-size: 11px; 
                font-weight: 600; 
                position: absolute; 
                top: -4px; 
                right: -4px; 
            }
            
            .filter-panel { 
                background: #f9fafb; 
                border: 1px solid #e5e7eb; 
                border-radius: 8px; 
                padding: 24px; 
                margin-top: 16px; 
                animation: slideDown 0.3s ease; 
            }
            @keyframes slideDown { 
                from { opacity: 0; transform: translateY(-10px); } 
                to { opacity: 1; transform: translateY(0); } 
            }
            .filter-section { margin-bottom: 20px; }
            .filter-section h4 { 
                margin: 0 0 16px; 
                font-size: 14px; 
                color: #1f2937; 
                font-weight: 600; 
                display: flex; 
                align-items: center; 
                gap: 8px; 
            }
            .filter-group { margin-bottom: 16px; }
            .filter-group label { 
                display: block; 
                font-size: 13px; 
                color: #4b5563; 
                margin-bottom: 6px; 
                font-weight: 500; 
            }
            .filter-input { 
                width: 100%; 
                padding: 10px 12px; 
                border: 1px solid #d1d5db; 
                border-radius: 6px; 
                font-size: 14px; 
                transition: border 0.2s; 
            }
            .filter-input:focus { 
                outline: none; 
                border-color: #3b82f6; 
                box-shadow: 0 0 0 3px rgba(59,130,246,0.1); 
            }
            
            .custom-date-range { 
                display: grid; 
                grid-template-columns: 1fr auto 1fr; 
                align-items: end; 
                gap: 12px; 
                margin-top: 16px; 
            }
            .date-input-wrapper label {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 4px;
            }
            .date-separator { 
                color: #6b7280; 
                font-size: 16px; 
                padding-bottom: 10px;
            }
            
            .filter-actions { 
                display: flex; 
                gap: 12px; 
                justify-content: flex-end; 
                padding-top: 16px; 
                border-top: 1px solid #e5e7eb; 
            }
            .btn-filter { 
                padding: 10px 20px; 
                border: none; 
                border-radius: 6px; 
                cursor: pointer; 
                font-size: 14px; 
                font-weight: 500; 
                display: inline-flex; 
                align-items: center; 
                gap: 8px; 
                transition: all 0.2s; 
            }
            .btn-apply { background: #3b82f6; color: white; }
            .btn-apply:hover { background: #2563eb; }
            .btn-clear { background: #f3f4f6; color: #374151; }
            .btn-clear:hover { background: #e5e7eb; }
            
            .summary-cards { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                gap: 20px; 
                margin-bottom: 24px; 
            }
            .summary-card { 
                background: white; 
                border-radius: 12px; 
                padding: 24px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
                display: flex; 
                align-items: center; 
                gap: 16px; 
            }
            .summary-icon { 
                width: 64px; 
                height: 64px; 
                border-radius: 12px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-size: 28px; 
                flex-shrink: 0; 
            }
            .summary-content h4 { 
                margin: 0 0 8px; 
                font-size: 13px; 
                color: #6b7280; 
                font-weight: 500; 
            }
            .summary-value { 
                font-size: 32px; 
                font-weight: 700; 
                color: #1f2937; 
                margin-bottom: 6px; 
            }
            .summary-change { 
                font-size: 13px; 
                color: #6b7280; 
            }
            .summary-change.success { color: #10b981; }
            
            .analytics-tabs { 
                display: flex; 
                gap: 4px; 
                background: white; 
                padding: 4px; 
                border-radius: 8px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
                margin-bottom: 20px; 
            }
            .tab-button { 
                flex: 1; 
                padding: 12px 20px; 
                border: none; 
                background: transparent; 
                color: #6b7280; 
                border-radius: 6px; 
                cursor: pointer; 
                font-size: 14px; 
                font-weight: 500; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                gap: 8px; 
                transition: all 0.2s; 
            }
            .tab-button:hover { background: #f3f4f6; color: #374151; }
            .tab-button.active { background: #3b82f6; color: white; }
            
            .analytics-metrics { 
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
                background: white; 
                border-radius: 8px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
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
            .metric-content { flex: 1; }
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
                margin-bottom: 4px; 
            }
            .metric-value.success { color: #10b981; }
            .metric-value.error { color: #ef4444; }
            .metric-value.warning { color: #f59e0b; }
            .metric-value.info { color: #06b6d4; }
            .metric-value.purple { color: #8b5cf6; }
            .metric-subtext { font-size: 12px; color: #9ca3af; }
            
            .charts-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); 
                gap: 24px; 
            }
            .chart-container { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            }
            .chart-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 16px; 
            }
            .chart-header h5 { 
                margin: 0; 
                font-size: 14px; 
                color: #4b5563; 
                font-weight: 600; 
            }
            .chart-container canvas { max-height: 300px; }
            
            .section-error { 
                padding: 20px; 
                background: #fef2f2; 
                border: 1px solid #fecaca; 
                border-radius: 6px; 
                color: #dc2626; 
                text-align: center; 
            }
            
            @media (max-width: 768px) {
                .analytics-header { flex-direction: column; align-items: flex-start; }
                .header-actions { width: 100%; }
                .btn-header { flex: 1; justify-content: center; }
                .summary-cards { grid-template-columns: 1fr; }
                .analytics-tabs { flex-direction: column; }
                .analytics-metrics { grid-template-columns: 1fr; }
                .charts-grid { grid-template-columns: 1fr; }
                .custom-date-range { 
                    grid-template-columns: 1fr; 
                }
                .date-separator { display: none; }
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
            
            const data = await fetchAnalyticsData();
            
            container.innerHTML = '';
            container.innerHTML = renderHeader();
            
            const summaryDiv = document.createElement('div');
            summaryDiv.innerHTML = renderSummaryCards(data);
            container.appendChild(summaryDiv);
            
            const tabsDiv = document.createElement('div');
            tabsDiv.innerHTML = renderTabs();
            container.appendChild(tabsDiv);
            
            const contentDiv = document.createElement('div');
            contentDiv.id = 'tabContent';
            container.appendChild(contentDiv);
            
            switch(state.activeTab) {
                case 'cancellations':
                    renderCancellationAnalytics(data.cancellations, contentDiv);
                    break;
                case 'payouts':
                    renderPayoutAnalytics(data.payouts, contentDiv);
                    break;
            }
            
            state.loaded = true;
            state.loading = false;
            logger.info('✅ Widget initialized');
            
            updateConnectionStatus();
            
            // Start real-time updates
            if (CONFIG.USE_REALTIME) {
                startEventStream();
            } else {
                startPolling();
            }
            
        } catch (error) {
            logger.error(`Initialization failed: ${error.message}`);
            state.loading = false;
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (container) {
                showError(container, error.message);
            }
        }
    }
    
    function refresh() {
        state.loaded = false;
        state.loading = false;
        return initialize();
    }
    
    function destroy() {
        stopEventStream();
        stopPolling();
        
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
        switchTab: switchTab,
        switchMode: switchMode,
        toggleFilters: toggleFilters,
        updateDateRange: updateDateRange,
        updateCustomDate: updateCustomDate,
        applyFilters: applyFilters,
        clearFilters: clearFilters,
        state: () => ({ 
            loaded: state.loaded,
            loading: state.loading,
            lastFetchTime: state.lastFetchTime,
            activeTab: state.activeTab,
            connectionMode: state.connectionMode,
            charts: Object.keys(state.charts),
            useRealtime: CONFIG.USE_REALTIME,
            filters: state.filters
        })
    };
    
    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            logger.info('📊 Real-time Analytics widget ready');
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                initialize();
            }
        });
    } else {
        logger.info('📊 Real-time Analytics widget ready');
        if (document.getElementById(CONFIG.CONTAINER_ID)) {
            initialize();
        }
    }
    
})();