// ============================================
// SIMPLIFIED ANALYTICS WIDGET
// ============================================
// assets\forms\widgets\analytics.js
(function() {
    'use strict';
    
    const CONFIG = {
        API_URL: 'https://api.northman-gaming-corporation.site',
        API_KEY: '200206',
        REFRESH_INTERVAL: 300000,
        REQUEST_TIMEOUT: 30000,
        CONTAINER_ID: 'analyticsWidget',
        CHART_COLORS: {
            primary: 'rgb(59, 130, 246)',
            success: 'rgb(16, 185, 129)',
            warning: 'rgb(245, 158, 11)',
            error: 'rgb(239, 68, 68)',
            purple: 'rgb(139, 92, 246)'
        }
    };
    
    const state = {
        charts: {},
        refreshTimer: null,
        lastSuccessfulData: null,
        lastFetchTime: 0,
        activeTab: 'cancellations',
        timeRange: 'day', // 'day', 'week', 'month', 'custom'
        startDate: '',
        endDate: ''
    };
    
    const logger = {
        info: (msg) => console.log(`[ANALYTICS] ${msg}`),
        error: (msg) => console.error(`[ANALYTICS ERROR] ${msg}`)
    };
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
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
    
    function getDateRange() {
        const today = new Date();
        let days;
        
        switch(state.timeRange) {
            case 'day':
                days = 1;
                break;
            case 'week':
                days = 7;
                break;
            case 'month':
                days = 30;
                break;
            case 'custom':
                return { start_date: state.startDate, end_date: state.endDate };
            default:
                days = 1;
        }
        
        return { days: days };
    }
    
    // ============================================
    // API FUNCTIONS
    // ============================================
    
    async function fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'X-API-Key': CONFIG.API_KEY,
                    ...options.headers
                }
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return response;
        } catch (error) {
            clearTimeout(timeout);
            throw error;
        }
    }
    
    async function fetchAnalyticsData() {
    try {
        logger.info('Fetching analytics data...');
        
        // ✅ Build proper filter parameters
        let filterMode = state.timeRange; // 'day', 'week', 'month', 'custom'
        
        const queryParams = new URLSearchParams({
            filter_mode: filterMode
        });
        
        // Add custom dates if needed
        if (filterMode === 'custom' && state.startDate && state.endDate) {
            queryParams.append('from_date', state.startDate);
            queryParams.append('to_date', state.endDate);
        }
        
        const paramStr = queryParams.toString();
        
        // ✅ SINGLE API CALL instead of 4
        const comprehensive = await fetchWithTimeout(
            `${CONFIG.API_URL}/analytics/v2/comprehensive?${paramStr}`
        ).then(r => r.json());
        
        // ✅ Transform the data
        const metrics = comprehensive?.metrics || {};
        const cMetrics = metrics.cancellations || {};
        const pMetrics = metrics.payouts || {};
        const oMetrics = metrics.other || {};
        
        const totalCancellations = (cMetrics.total_approved || 0) +
                                   (cMetrics.total_denied || 0) +
                                   (cMetrics.total_pending || 0);
        
        const approvalRate = totalCancellations > 0 
            ? Math.round((cMetrics.total_approved / totalCancellations) * 100 * 10) / 10
            : 0;
        
        const data = {
            cancellations: {
                total: totalCancellations,
                total_approved: cMetrics.total_approved || 0,
                total_denied: cMetrics.total_denied || 0,
                total_pending: cMetrics.total_pending || 0,
                approval_rate: approvalRate,
                top_operators: [], // Add if needed
                trend: []
            },
            payouts: {
                total: pMetrics.total_count || 0,
                total_amount: pMetrics.total_amount || 0,
                average_amount: pMetrics.total_count > 0 
                    ? pMetrics.total_amount / pMetrics.total_count 
                    : 0,
                top_outlets: [],
                trend: []
            },
            device_changes: {
                total: oMetrics.total_device_changes || 0,
                by_type: { phone: 0, pos: 0 },
                top_operators: [],
                trend: []
            },
            summary: {
                overview: {
                    total_cancellations: totalCancellations,
                    total_payouts: pMetrics.total_count || 0,
                    total_device_changes: oMetrics.total_device_changes || 0
                }
            },
            timestamp: new Date().toISOString()
        };
        
        state.lastSuccessfulData = data;
        state.lastFetchTime = Date.now();
        
        logger.info('✅ Data fetched (1 API call)');
        return data;
        
    } catch (error) {
        logger.error(`Fetch failed: ${error.message}`);
        if (state.lastSuccessfulData) {
            logger.info('Using cached data');
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
                logger.error(`Failed to destroy chart ${canvasId}`);
            }
        }
    }
    
    function renderBarChart(canvasId, data, labelKey, valueKey, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !Array.isArray(data) || data.length === 0) return;
        
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
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
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
    }
    
    function renderLineChart(canvasId, data, labelKey, valueKey, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !Array.isArray(data) || data.length === 0) return;
        
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
    }
    
    // ============================================
    // UI RENDERING
    // ============================================
    
    function renderHeader() {
        const lastUpdate = state.lastFetchTime > 0 
            ? new Date(state.lastFetchTime).toLocaleTimeString()
            : 'Never';
        
        const timeRangeLabel = {
            'day': 'Today',
            'week': 'Last 7 Days',
            'month': 'Last 30 Days',
            'custom': 'Custom Range'
        }[state.timeRange] || 'Today';
        
        return `
            <div class="analytics-header">
                <div class="header-left">
                    <h1><i class="fas fa-chart-line"></i> Analytics Dashboard</h1>
                    <p class="header-subtitle">
                        <i class="fas fa-clock"></i> Last updated: ${lastUpdate}
                        <span class="separator">•</span>
                        <i class="fas fa-calendar"></i> ${timeRangeLabel}
                    </p>
                </div>
                <div class="header-actions">
                    <button class="btn-header" onclick="window.AnalyticsWidget.refresh()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>
            ${renderTimeFilter()}
        `;
    }
    
    function renderTimeFilter() {
    return `
        <div class="time-filter">
            <div class="time-filter-buttons">
                <button class="time-btn ${state.timeRange === 'day' ? 'active' : ''}" 
                        data-range="day">
                    <i class="fas fa-calendar-day"></i> Today
                </button>
                <button class="time-btn ${state.timeRange === 'week' ? 'active' : ''}" 
                        data-range="week">
                    <i class="fas fa-calendar-week"></i> Week
                </button>
                <button class="time-btn ${state.timeRange === 'month' ? 'active' : ''}" 
                        data-range="month">
                    <i class="fas fa-calendar"></i> Month
                </button>
                <button class="time-btn ${state.timeRange === 'custom' ? 'active' : ''}" 
                        data-range="custom">
                    <i class="fas fa-calendar-alt"></i> Custom
                </button>
            </div>
            ${state.timeRange === 'custom' ? `
                <div class="custom-date-filter">
                    <input type="date" 
                           id="startDateInput" 
                           class="date-input" 
                           value="${state.startDate}"
                           max="${new Date().toISOString().split('T')[0]}">
                    <span class="date-separator">to</span>
                    <input type="date" 
                           id="endDateInput" 
                           class="date-input" 
                           value="${state.endDate}"
                           max="${new Date().toISOString().split('T')[0]}">
                    <button class="btn-apply" id="applyRangeBtn">
                        <i class="fas fa-check"></i> Apply
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}
    
    function renderSummaryCards(data) {
        const summary = data?.summary?.overview || {};
        
        return `
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="summary-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="summary-content">
                        <h4>Total Cancellations</h4>
                        <div class="summary-value">${formatNumber(summary.total_cancellations || 0)}</div>
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="summary-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="summary-content">
                        <h4>Total Payouts</h4>
                        <div class="summary-value">${formatNumber(summary.total_payouts || 0)}</div>
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="summary-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="summary-content">
                        <h4>Device Changes</h4>
                        <div class="summary-value">${formatNumber(summary.total_device_changes || 0)}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderTabs() {
    return `
        <div class="analytics-tabs">
            <button class="tab-button ${state.activeTab === 'cancellations' ? 'active' : ''}" 
                    data-tab="cancellations">
                <i class="fas fa-times-circle"></i> Cancellations
            </button>
            <button class="tab-button ${state.activeTab === 'payouts' ? 'active' : ''}" 
                    data-tab="payouts">
                <i class="fas fa-money-bill-wave"></i> Payouts
            </button>
            <button class="tab-button ${state.activeTab === 'device-changes' ? 'active' : ''}" 
                    data-tab="device-changes">
                <i class="fas fa-mobile-alt"></i> Device Changes
            </button>
        </div>
    `;
}
    
    function renderCancellations(data, container) {
        const total = data?.total || 0;
        const approved = data?.total_approved || 0;
        const denied = data?.total_denied || 0;
        const pending = data?.total_pending || 0;
        const approvalRate = data?.approval_rate || 0;
        
        container.innerHTML = `
            <div class="analytics-metrics">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Cancellations</h4>
                        <div class="metric-value">${formatNumber(total)}</div>
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
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Pending</h4>
                        <div class="metric-value warning">${formatNumber(pending)}</div>
                    </div>
                </div>
            </div>
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Top 10 Operators</h5>
                    <canvas id="cancellationChart" height="300"></canvas>
                </div>
                <div class="chart-container">
                    <h5>Daily Trend</h5>
                    <canvas id="cancellationTrendChart" height="300"></canvas>
                </div>
            </div>
        `;
        
        const topOperators = data?.top_operators || [];
        const trend = data?.trend || [];
        
        if (topOperators.length > 0) {
            setTimeout(() => renderBarChart('cancellationChart', topOperators, 'booth', 'count', CONFIG.CHART_COLORS.primary), 100);
        }
        if (trend.length > 0) {
            setTimeout(() => renderLineChart('cancellationTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.success), 100);
        }
    }
    
    function renderPayouts(data, container) {
        const total = data?.total || 0;
        const totalAmount = data?.total_amount || 0;
        const avgAmount = data?.average_amount || 0;
        
        container.innerHTML = `
            <div class="analytics-metrics">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Payouts</h4>
                        <div class="metric-value">${formatNumber(total)}</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Amount</h4>
                        <div class="metric-value warning">${formatCurrency(totalAmount)}</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Average Payout</h4>
                        <div class="metric-value info">${formatCurrency(avgAmount)}</div>
                    </div>
                </div>
            </div>
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Top 10 Outlets</h5>
                    <canvas id="payoutChart" height="300"></canvas>
                </div>
                <div class="chart-container">
                    <h5>Daily Trend</h5>
                    <canvas id="payoutTrendChart" height="300"></canvas>
                </div>
            </div>
        `;
        
        const topOutlets = data?.top_outlets || [];
        const trend = data?.trend || [];
        
        if (topOutlets.length > 0) {
            setTimeout(() => renderBarChart('payoutChart', topOutlets, 'outlet', 'amount', CONFIG.CHART_COLORS.warning), 100);
        }
        if (trend.length > 0) {
            setTimeout(() => renderLineChart('payoutTrendChart', trend, 'date', 'amount', CONFIG.CHART_COLORS.success), 100);
        }
    }
    
    function renderDeviceChanges(data, container) {
        const total = data?.total || 0;
        const phoneCount = data?.by_type?.phone || 0;
        const posCount = data?.by_type?.pos || 0;
        
        container.innerHTML = `
            <div class="analytics-metrics">
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Total Requests</h4>
                        <div class="metric-value">${formatNumber(total)}</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="metric-content">
                        <h4>Phone Users</h4>
                        <div class="metric-value" style="color: #ec4899;">${formatNumber(phoneCount)}</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-desktop"></i>
                    </div>
                    <div class="metric-content">
                        <h4>POS Users</h4>
                        <div class="metric-value purple">${formatNumber(posCount)}</div>
                    </div>
                </div>
            </div>
            <div class="charts-grid">
                <div class="chart-container">
                    <h5>Top 10 Operators</h5>
                    <canvas id="deviceChangeChart" height="300"></canvas>
                </div>
                <div class="chart-container">
                    <h5>Daily Trend</h5>
                    <canvas id="deviceChangeTrendChart" height="300"></canvas>
                </div>
            </div>
        `;
        
        const topOperators = data?.top_operators || [];
        const trend = data?.trend || [];
        
        if (topOperators.length > 0) {
            setTimeout(() => renderBarChart('deviceChangeChart', topOperators, 'operator', 'count', CONFIG.CHART_COLORS.purple), 100);
        }
        if (trend.length > 0) {
            setTimeout(() => renderLineChart('deviceChangeTrendChart', trend, 'date', 'count', CONFIG.CHART_COLORS.primary), 100);
        }
    }
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="analytics-loading">
                <div class="loading-spinner"></div>
                <span>Loading analytics...</span>
            </div>
        `;
    }
    
    function showError(container, message) {
        container.innerHTML = `
            <div class="analytics-error">
                <i class="fas fa-exclamation-triangle"></i>
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
    
    function setTimeRange(range) {
        state.timeRange = range;
        if (range !== 'custom') {
            refresh();
        } else {
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            const headerDiv = container.querySelector('.analytics-header');
            if (headerDiv) {
                headerDiv.outerHTML = renderHeader();
            }
        }
    }
    
    function setStartDate(date) {
        state.startDate = date;
    }
    
    function setEndDate(date) {
        state.endDate = date;
    }
    
    function applyCustomRange() {
        if (!state.startDate || !state.endDate) {
            alert('Please select both start and end dates');
            return;
        }
        refresh();
    }
    
    function switchTab(tab) {
        state.activeTab = tab;
        refresh();
    }
    
    // ============================================
    // STYLES
    // ============================================
    
    function injectStyles() {
        if (document.getElementById('analytics-widget-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'analytics-widget-styles';
        style.textContent = `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            .analytics-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 20px; }
            .loading-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .analytics-error { text-align: center; padding: 60px 20px; }
            .analytics-error i { font-size: 48px; color: #ef4444; margin-bottom: 20px; }
            .analytics-error h3 { margin: 0 0 10px; color: #1f2937; }
            .analytics-error p { color: #6b7280; margin-bottom: 20px; }
            .btn-retry { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; }
            .btn-retry:hover { background: #2563eb; }
            
            .analytics-header { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
            .header-left h1 { font-size: 24px; font-weight: 700; margin: 0 0 8px; display: flex; align-items: center; gap: 10px; }
            .header-subtitle { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 8px; }
            .separator { color: #d1d5db; }
            .btn-header { background: #f3f4f6; color: #374151; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
            .btn-header:hover { background: #e5e7eb; }
            
            .time-filter { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .time-filter-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
            .time-btn { flex: 1; min-width: 120px; padding: 12px 20px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
            .time-btn:hover { border-color: #3b82f6; color: #3b82f6; }
            .time-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
            
            .custom-date-filter { display: flex; align-items: center; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
            .date-input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
            .date-separator { color: #6b7280; font-size: 14px; }
            .btn-apply { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; }
            .btn-apply:hover { background: #2563eb; }
            
            .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px; }
            .summary-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 16px; }
            .summary-icon { width: 64px; height: 64px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; flex-shrink: 0; }
            .summary-content h4 { margin: 0 0 8px; font-size: 13px; color: #6b7280; font-weight: 500; }
            .summary-value { font-size: 32px; font-weight: 700; color: #1f2937; }
            
            .analytics-tabs { display: flex; gap: 4px; background: white; padding: 4px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .tab-button { flex: 1; padding: 12px 20px; border: none; background: transparent; color: #6b7280; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
            .tab-button:hover { background: #f3f4f6; color: #374151; }
            .tab-button.active { background: #3b82f6; color: white; }
            
            .analytics-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .metric-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .metric-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; flex-shrink: 0; }
            .metric-content { flex: 1; }
            .metric-content h4 { margin: 0 0 8px; font-size: 13px; color: #6b7280; font-weight: 500; }
            .metric-value { font-size: 28px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
            .metric-value.success { color: #10b981; }
            .metric-value.error { color: #ef4444; }
            .metric-value.warning { color: #f59e0b; }
            .metric-value.info { color: #06b6d4; }
            .metric-value.purple { color: #8b5cf6; }
            .metric-subtext { font-size: 12px; color: #9ca3af; }
            
            .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 24px; }
            .chart-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .chart-container h5 { margin: 0 0 16px; font-size: 14px; color: #4b5563; font-weight: 600; }
            .chart-container canvas { max-height: 300px; }
            
            @media (max-width: 768px) {
                .analytics-header { flex-direction: column; align-items: flex-start; }
                .time-filter-buttons { flex-direction: column; }
                .time-btn { width: 100%; }
                .custom-date-filter { flex-direction: column; align-items: stretch; }
                .summary-cards { grid-template-columns: 1fr; }
                .analytics-tabs { flex-direction: column; }
                .analytics-metrics { grid-template-columns: 1fr; }
                .charts-grid { grid-template-columns: 1fr; }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    async function initialize() {
        try {
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            
            if (!container) {
                logger.error(`Container #${CONFIG.CONTAINER_ID} not found`);
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
                    renderCancellations(data.cancellations, contentDiv);
                    break;
                case 'payouts':
                    renderPayouts(data.payouts, contentDiv);
                    break;
                case 'device-changes':
                    renderDeviceChanges(data.device_changes, contentDiv);
                    break;
            }
            
            logger.info('✅ Widget initialized');
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
            logger.info('🔄 Auto-refresh');
            refresh();
        }, CONFIG.REFRESH_INTERVAL);
    }
    
    function refresh() {
        return initialize();
    }
    
    function destroy() {
        if (state.refreshTimer) {
            clearTimeout(state.refreshTimer);
            state.refreshTimer = null;
        }
        
        Object.keys(state.charts).forEach(chartId => {
            destroyChart(chartId);
        });
        
        logger.info('Widget destroyed');
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    window.AnalyticsWidget = {
        init: initialize,
        refresh: refresh,
        destroy: destroy,
        setTimeRange: setTimeRange,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
        applyCustomRange: applyCustomRange,
        switchTab: switchTab,
        state: () => ({ 
            activeTab: state.activeTab,
            timeRange: state.timeRange,
            lastFetchTime: state.lastFetchTime
        })
    };
    
    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                initialize();
            }
        });
    } else {
        if (document.getElementById(CONFIG.CONTAINER_ID)) {
            initialize();
        }
    }
    
})();