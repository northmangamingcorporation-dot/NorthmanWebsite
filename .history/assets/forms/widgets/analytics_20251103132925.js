// ============================================
// ENHANCED ADVANCED ANALYTICS MODULE (UNIFIED FILTERS)
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
        // UNIFIED FILTER STATE
        filters: {
            filterMode: 'day', // day, week, month, custom
            customStartDate: '',
            customEndDate: ''
        },
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
    
    function downloadCSV(data, filename) {
        if (!Array.isArray(data) || data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function getFilterModeLabel() {
        const labels = {
            'day': 'Today',
            'week': 'This Week',
            'month': 'This Month',
            'custom': 'Custom Range'
        };
        return labels[state.filters.filterMode] || 'Unknown';
    }
    
    function getFilterModePeriod() {
        if (state.filters.filterMode === 'custom') {
            return `${state.filters.customStartDate} to ${state.filters.customEndDate}`;
        }
        return getFilterModeLabel();
    }
    
    // ============================================
    // API FUNCTIONS
    // ============================================
    
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
    
    async function fetchComprehensiveData(filterMode = 'day') {
        try {
            let url = `${CONFIG.API_URL}/analytics/v2/comprehensive?filter_mode=${filterMode}`;
            
            if (filterMode === 'custom') {
                if (state.filters.customStartDate && state.filters.customEndDate) {
                    url += `&from_date=${state.filters.customStartDate}&to_date=${state.filters.customEndDate}`;
                } else {
                    throw new Error('Start date and end date required for custom filter');
                }
            }
            
            const response = await fetchWithTimeout(url);
            const data = await response.json();
            
            logger.info('✅ Comprehensive data fetched');
            return data;
            
        } catch (error) {
            logger.error(`Comprehensive fetch failed: ${error.message}`);
            throw error;
        }
    }
    
    async function fetchRankingsData(rankingType, filterMode = 'day') {
        try {
            let url = `${CONFIG.API_URL}/analytics/v2/rankings/${rankingType}?filter_mode=${filterMode}&limit=10`;
            
            if (filterMode === 'custom' && state.filters.customStartDate && state.filters.customEndDate) {
                url += `&from_date=${state.filters.customStartDate}&to_date=${state.filters.customEndDate}`;
            }
            
            const response = await fetchWithTimeout(url);
            const data = await response.json();
            
            logger.info(`✅ ${rankingType} rankings fetched`);
            return data;
            
        } catch (error) {
            logger.error(`Rankings fetch failed: ${error.message}`);
            throw error;
        }
    }
    
    async function fetchDataGatheringRate(filterMode = 'day') {
        try {
            let url = `${CONFIG.API_URL}/analytics/v2/data-gathering-rate?filter_mode=${filterMode}`;
            
            if (filterMode === 'custom' && state.filters.customStartDate && state.filters.customEndDate) {
                url += `&from_date=${state.filters.customStartDate}&to_date=${state.filters.customEndDate}`;
            }
            
            const response = await fetchWithTimeout(url);
            const data = await response.json();
            
            logger.info('✅ Data gathering rate fetched');
            return data;
            
        } catch (error) {
            logger.error(`Data gathering rate fetch failed: ${error.message}`);
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
                                label: (ctx) => valueKey === 'amount' || valueKey.includes('amount')
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
                                callback: (val) => valueKey === 'amount' || valueKey.includes('amount')
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
    
    // ============================================
    // UI RENDERING
    // ============================================
    
    function renderHeader() {
        const lastUpdate = state.lastFetchTime > 0 
            ? new Date(state.lastFetchTime).toLocaleTimeString()
            : 'Never';
        
        return `
            <div class="analytics-header">
                <div class="header-left">
                    <h1><i class="fas fa-chart-line"></i> Advanced Analytics Dashboard</h1>
                    <p class="header-subtitle">
                        <i class="fas fa-clock"></i> Last updated: ${lastUpdate}
                        ${state.lastSuccessfulData ? `<span class="separator">•</span><i class="fas fa-check-circle"></i> Connected` : ''}
                    </p>
                </div>
                <div class="header-actions">
                    <button class="btn-header" onclick="window.AnalyticsWidget.exportData()" ${!state.lastSuccessfulData ? 'disabled' : ''}>
                        <i class="fas fa-download"></i> Export
                    </button>
                    <button class="btn-header" onclick="window.AnalyticsWidget.refresh()" ${state.loading ? 'disabled' : ''}>
                        <i class="fas fa-sync-alt ${state.loading ? 'fa-spin' : ''}"></i> Refresh
                    </button>
                </div>
            </div>
        `;
    }
    
    function renderFilterSelector() {
        return `
            <div class="unified-filter-panel">
                <div class="filter-mode-selector">
                    <button class="filter-mode-btn ${state.filters.filterMode === 'day' ? 'active' : ''}" 
                            onclick="window.AnalyticsWidget.changeFilterMode('day')">
                        <i class="fas fa-calendar-day"></i> Today
                    </button>
                    <button class="filter-mode-btn ${state.filters.filterMode === 'week' ? 'active' : ''}" 
                            onclick="window.AnalyticsWidget.changeFilterMode('week')">
                        <i class="fas fa-calendar-week"></i> This Week
                    </button>
                    <button class="filter-mode-btn ${state.filters.filterMode === 'month' ? 'active' : ''}" 
                            onclick="window.AnalyticsWidget.changeFilterMode('month')">
                        <i class="fas fa-calendar-alt"></i> This Month
                    </button>
                    <button class="filter-mode-btn ${state.filters.filterMode === 'custom' ? 'active' : ''}" 
                            onclick="window.AnalyticsWidget.toggleCustomDatePicker()">
                        <i class="fas fa-calendar"></i> Custom Range
                    </button>
                </div>
                ${state.filters.filterMode === 'custom' ? `
                    <div class="custom-date-picker">
                        <div class="date-input-group">
                            <label>From:</label>
                            <input type="date" 
                                   id="customStartDate" 
                                   class="filter-input" 
                                   value="${state.filters.customStartDate}" 
                                   onchange="window.AnalyticsWidget.updateCustomDate('start', this.value)">
                        </div>
                        <div class="date-input-group">
                            <label>To:</label>
                            <input type="date" 
                                   id="customEndDate" 
                                   class="filter-input" 
                                   value="${state.filters.customEndDate}"
                                   onchange="window.AnalyticsWidget.updateCustomDate('end', this.value)">
                        </div>
                        <button class="btn-apply-custom" onclick="window.AnalyticsWidget.applyCustomDateRange()">
                            <i class="fas fa-check"></i> Apply
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    function renderTabs() {
        return `
            <div class="analytics-tabs">
                <button class="tab-button ${state.activeTab === 'overview' ? 'active' : ''}" 
                        onclick="window.AnalyticsWidget.switchTab('overview')">
                    <i class="fas fa-tachometer-alt"></i> Overview
                </button>
                <button class="tab-button ${state.activeTab === 'rankings' ? 'active' : ''}" 
                        onclick="window.AnalyticsWidget.switchTab('rankings')">
                    <i class="fas fa-trophy"></i> Rankings
                </button>
                <button class="tab-button ${state.activeTab === 'data-rate' ? 'active' : ''}" 
                        onclick="window.AnalyticsWidget.switchTab('data-rate')">
                    <i class="fas fa-database"></i> Data Rate
                </button>
            </div>
        `;
    }
    
    function renderOverviewAnalytics(data, container) {
        try {
            const metrics = data.metrics || {};
            const period = data.period || {};
            
            const cancellations = metrics.cancellations || {};
            const payouts = metrics.payouts || {};
            const other = metrics.other || {};
            
            let periodText = '';
            if (period.report_date) {
                periodText = `Report Date: ${period.report_date}`;
            } else if (period.period_start && period.period_end) {
                periodText = `Period: ${period.period_start} to ${period.period_end}`;
            }
            
            container.innerHTML = `
                <div class="overview-header">
                    <h3><i class="fas fa-tachometer-alt"></i> Comprehensive Overview</h3>
                    <p class="period-text">${periodText}</p>
                </div>
                
                <div class="overview-section">
                    <h4><i class="fas fa-times-circle"></i> Cancellations</h4>
                    <div class="analytics-metrics">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Pending</h4>
                                <div class="metric-value warning">${formatNumber(cancellations.total_pending || 0)}</div>
                                <div class="metric-subtext">Awaiting review</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Approved</h4>
                                <div class="metric-value success">${formatNumber(cancellations.total_approved || 0)}</div>
                                <div class="metric-subtext">Successfully processed</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                <i class="fas fa-times-circle"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Denied</h4>
                                <div class="metric-value error">${formatNumber(cancellations.total_denied || 0)}</div>
                                <div class="metric-subtext">Rejected requests</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                <i class="fas fa-ban"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Forced</h4>
                                <div class="metric-value purple">${formatNumber(cancellations.total_forced || 0)}</div>
                                <div class="metric-subtext">Force cancelled</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="overview-section">
                    <h4><i class="fas fa-money-bill-wave"></i> Payouts</h4>
                    <div class="analytics-metrics">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Count</h4>
                                <div class="metric-value">${formatNumber(payouts.total_count || 0)}</div>
                                <div class="metric-subtext">Payout transactions</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <i class="fas fa-coins"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Total Amount</h4>
                                <div class="metric-value warning">${formatCurrency(payouts.total_amount || 0)}</div>
                                <div class="metric-subtext">Total disbursed</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="overview-section">
                    <h4><i class="fas fa-chart-line"></i> Other Metrics</h4>
                    <div class="analytics-metrics">
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Device Changes</h4>
                                <div class="metric-value info">${formatNumber(other.total_device_changes || 0)}</div>
                                <div class="metric-subtext">Device requests</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                <i class="fas fa-server"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Server Reports</h4>
                                <div class="metric-value error">${formatNumber(other.total_server_reports || 0)}</div>
                                <div class="metric-subtext">System issues</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                                <i class="fas fa-ticket-alt"></i>
                            </div>
                            <div class="metric-content">
                                <h4>Verifications</h4>
                                <div class="metric-value">${formatNumber(other.total_verifications || 0)}</div>
                                <div class="metric-subtext">Ticket verifications</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            logger.error(`Overview render error: ${error.message}`);
            container.innerHTML = `
                <div class="section-error">
                    Failed to render overview analytics
                    <br><small>${error.message}</small>
                </div>
            `;
        }
    }
    
    function mapRankingData(type, data) {
        switch (type) {
            case 'requesters':
                return data.map((item) => ({
                    name: item.requester_booth,
                    total: item.total_requests,
                    pending: item.pending_count,
                    approved: item.approved_count,
                    denied: item.denied_count
                }));
            
            case 'cancellers':
                return data.map((item) => ({
                    name: item.canceller_name,
                    total: item.total_actions,
                    approved: item.total_approved,
                    denied: item.total_denied,
                    requested: item.total_requested,
                    percentage: item.action_percentage
                }));
            
            case 'force-cancellers':
                return data.map((item) => ({
                    username: item.sender_username,
                    total: item.total_forced_cancellations,
                    affected_booths: item.affected_booths
                }));
            
            case 'payout-tellers':
                return data.map((item) => ({
                    teller: item.teller_name,
                    count: item.total_payouts,
                    total_amount: item.total_payout_amount,
                    avg_amount: item.avg_payout_amount
                }));
            
            case 'payout-stations':
                return data.map((item) => ({
                    outlet: item.teller_name,
                    count: item.total_payouts,
                    total_amount: item.total_payout_amount,
                    avg_amount: item.avg_payout_amount
                }));
        }
    }
    
    function renderRankingsAnalytics(container) {
        container.innerHTML = `
            <div class="overview-header">
                <h3><i class="fas fa-trophy"></i> Rankings & Leaderboards</h3>
            </div>
            
            <div class="rankings-loading">
                <div class="loading-spinner"></div>
                <span>Loading rankings...</span>
            </div>
        `;
        
        Promise.all([
            fetchRankingsData('requesters', state.filters.filterMode),
            fetchRankingsData('cancellers', state.filters.filterMode),
            fetchRankingsData('force-cancellers', state.filters.filterMode),
            fetchRankingsData('payout-tellers', state.filters.filterMode),
            fetchRankingsData('payout-stations', state.filters.filterMode)
        ]).then(([requesters, cancellers, forceCancellers, payoutTellers, payoutStations]) => {
            container.innerHTML = `
                <div class="overview-header">
                    <h3><i class="fas fa-trophy"></i> Rankings & Leaderboards</h3>
                </div>
                
                <div class="rankings-grid">
                    ${renderRankingTable('Top Requesters', mapRankingData('requesters', requesters.data), ['Rank', 'Name', 'Total', 'Pending', 'Approved', 'Denied'])}
                    ${renderRankingTable('Top Cancellers', mapRankingData('cancellers', cancellers.data), ['Rank', 'Name', 'Total', 'Approved', 'Denied', 'Requested', '%'])}
                    ${renderRankingTable('Top Force Cancellers', mapRankingData('force-cancellers', forceCancellers.data), ['Rank', 'Username', 'Total Forced', 'Affected Booths'])}
                    ${renderRankingTable('Top Payout Tellers', mapRankingData('payout-tellers', payoutTellers.data), ['Rank', 'Teller', 'Count', 'Total Amount', 'Avg Amount'])}
                    ${renderRankingTable('Top Payout Stations', mapRankingData('payout-stations', payoutStations.data), ['Rank', 'Outlet', 'Count', 'Total Amount', 'Avg Amount'])}
                </div>
            `;
        }).catch(error => {
            logger.error(`Rankings load error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to load rankings</div>';
        });
    }
    
    function renderRankingTable(title, data, headers) {
        if (!data || data.length === 0) {
            return `
                <div class="ranking-card">
                    <h4>${title}</h4>
                    <p class="no-data">No data available</p>
                </div>
            `;
        }
        
        const rows = data.map((item, index) => {
            const rank = index + 1;
            const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
            
            let cells = `<td class="rank-cell ${rankClass}">${rank}</td>`;
            
            Object.entries(item).forEach(([key, value]) => {
                const numeric = parseFloat(value);
                const isNumeric = !isNaN(numeric);
                const keyLower = key.toLowerCase();
                
                if (isNumeric && keyLower.includes('amount')) {
                    cells += `<td class="text-right">${formatCurrency(numeric)}</td>`;
                } else if (isNumeric) {
                    cells += `<td class="text-right">${formatNumber(numeric)}</td>`;
                } else {
                    cells += `<td>${sanitizeHTML(value)}</td>`;
                }
            });
            
            return `<tr>${cells}</tr>`;
        }).join('');
        
        return `
            <div class="ranking-card">
                <h4><i class="fas fa-trophy"></i> ${title}</h4>
                <div class="ranking-table-wrapper">
                    <table class="ranking-table">
                        <thead>
                            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    function renderDataGatheringRate(container) {
        container.innerHTML = `
            <div class="overview-header">
                <h3><i class="fas fa-database"></i> Data Gathering Rate</h3>
            </div>
            
            <div class="rankings-loading">
                <div class="loading-spinner"></div>
                <span>Loading data rate...</span>
            </div>
        `;
        
        fetchDataGatheringRate(state.filters.filterMode).then(data => {
            const tableData = data.data || [];
            
            const rows = tableData.map((row, index) => {
                const rankClass = index < 3 ? ['gold', 'silver', 'bronze'][index] : '';
                return `
                    <tr>
                        <td class="rank-cell ${rankClass}">${index + 1}</td>
                        <td>${sanitizeHTML(row.table_name)}</td>
                        <td class="text-right">${formatNumber(row.record_count)}</td>
                    </tr>
                `;
            }).join('');
            
            container.innerHTML = `
                <div class="overview-header">
                    <h3><i class="fas fa-database"></i> Data Gathering Rate</h3>
                    <p class="period-text">${getFilterModePeriod()}</p>
                </div>
                
                <div class="ranking-card full-width">
                    <h4><i class="fas fa-chart-bar"></i> Records by Table</h4>
                    <div class="ranking-table-wrapper">
                        <table class="ranking-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Table Name</th>
                                    <th>Record Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }).catch(error => {
            logger.error(`Data rate load error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to load data gathering rate</div>';
        });
    }
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="analytics-loading">
                <div class="loading-spinner"></div>
                <span>Loading analytics data...</span>
                <p class="loading-status">Please wait...</p>
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
    
    function changeFilterMode(mode) {
        if (mode === 'custom') {
            state.filters.filterMode = 'custom';
            // Just show the date picker, don't refresh yet
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (container) {
                const filterPanel = container.querySelector('.unified-filter-panel');
                if (filterPanel) {
                    filterPanel.outerHTML = renderFilterSelector();
                }
            }
        } else {
            state.filters.filterMode = mode;
            refresh();
        }
    }
    
    function toggleCustomDatePicker() {
        changeFilterMode('custom');
    }
    
    function updateCustomDate(type, value) {
        if (type === 'start') {
            state.filters.customStartDate = value;
        } else {
            state.filters.customEndDate = value;
        }
    }
    
    function applyCustomDateRange() {
        if (!state.filters.customStartDate || !state.filters.customEndDate) {
            alert('Please select both start and end dates');
            return;
        }
        
        const start = new Date(state.filters.customStartDate);
        const end = new Date(state.filters.customEndDate);
        
        if (start > end) {
            alert('Start date must be before end date');
            return;
        }
        
        refresh();
    }
    
    function switchTab(tab) {
        state.activeTab = tab;
        refresh();
    }
    
    function exportData() {
        if (!state.lastSuccessfulData) return;
        
        const exportMenu = document.createElement('div');
        exportMenu.className = 'export-menu';
        exportMenu.innerHTML = `
            <div class="export-menu-content">
                <h4><i class="fas fa-download"></i> Export Data</h4>
                <button onclick="window.AnalyticsWidget.doExport('json')">
                    <i class="fas fa-file-code"></i> Export as JSON
                </button>
                <button onclick="window.AnalyticsWidget.closeExportMenu()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;
        
        document.body.appendChild(exportMenu);
        
        setTimeout(() => {
            exportMenu.classList.add('active');
        }, 10);
    }
    
    function doExport(type) {
        const data = state.lastSuccessfulData;
        const timestamp = new Date().toISOString().split('T')[0];
        const filterLabel = state.filters.filterMode;
        
        if (type === 'json') {
            downloadJSON(data, `analytics_${filterLabel}_${timestamp}.json`);
        }
        
        closeExportMenu();
    }
    
    function closeExportMenu() {
        const menu = document.querySelector('.export-menu');
        if (menu) {
            menu.classList.remove('active');
            setTimeout(() => menu.remove(), 300);
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
            
            .analytics-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 20px; }
            .loading-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
            .loading-status { font-size: 13px; color: #6b7280; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .analytics-error { text-align: center; padding: 60px 20px; }
            .error-icon { font-size: 48px; color: #ef4444; margin-bottom: 20px; }
            .analytics-error h3 { margin: 0 0 10px; color: #1f2937; }
            .analytics-error p { color: #6b7280; margin-bottom: 20px; }
            .btn-retry { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; }
            .btn-retry:hover { background: #2563eb; }
            
            .analytics-header { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
            .header-left h1 { font-size: 24px; font-weight: 700; margin: 0 0 8px; display: flex; align-items: center; gap: 10px; }
            .header-subtitle { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 8px; }
            .separator { color: #d1d5db; }
            .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
            .btn-header { background: #f3f4f6; color: #374151; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
            .btn-header:hover { background: #e5e7eb; transform: translateY(-1px); }
            .btn-header:disabled { opacity: 0.5; cursor: not-allowed; }
            
            .unified-filter-panel { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .filter-mode-selector { display: flex; gap: 8px; flex-wrap: wrap; }
            .filter-mode-btn { flex: 1; min-width: 140px; padding: 12px 20px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
            .filter-mode-btn:hover { border-color: #3b82f6; color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .filter-mode-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; box-shadow: 0 4px 6px rgba(59,130,246,0.3); }
            
            .custom-date-picker { margin-top: 16px; padding-top: 16px; border-top: 2px solid #f3f4f6; display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
            .date-input-group { flex: 1; min-width: 180px; }
            .date-input-group label { display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px; font-weight: 500; }
            .filter-input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; transition: border 0.2s; }
            .filter-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
            .btn-apply-custom { padding: 10px 24px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
            .btn-apply-custom:hover { background: #059669; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(16,185,129,0.3); }
            
            .analytics-tabs { display: flex; gap: 4px; background: white; padding: 4px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .tab-button { flex: 1; padding: 12px 20px; border: none; background: transparent; color: #6b7280; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
            .tab-button:hover { background: #f3f4f6; color: #374151; }
            .tab-button.active { background: #3b82f6; color: white; }
            
            .overview-header { margin-bottom: 24px; }
            .overview-header h3 { font-size: 20px; font-weight: 700; margin: 0 0 8px; display: flex; align-items: center; gap: 10px; }
            .period-text { font-size: 13px; color: #6b7280; margin: 8px 0 0; }
            
            .overview-section { margin-bottom: 32px; }
            .overview-section h4 { font-size: 16px; font-weight: 600; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; color: #1f2937; }
            
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
            
            .rankings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 20px; }
            .ranking-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .ranking-card.full-width { grid-column: 1 / -1; }
            .ranking-card h4 { font-size: 15px; font-weight: 600; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; color: #1f2937; }
            
            .ranking-table-wrapper { overflow-x: auto; }
            .ranking-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .ranking-table th { background: #f9fafb; padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
            .ranking-table td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
            .ranking-table tbody tr:hover { background: #f9fafb; }
            .rank-cell { font-weight: 700; font-size: 16px; }
            .rank-cell.gold { color: #f59e0b; }
            .rank-cell.silver { color: #9ca3af; }
            .rank-cell.bronze { color: #d97706; }
            .text-right { text-align: right; }
            .no-data { text-align: center; padding: 40px 20px; color: #9ca3af; font-style: italic; }
            
            .rankings-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; gap: 20px; }
            
            .export-menu { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; transition: opacity 0.3s; }
            .export-menu.active { opacity: 1; }
            .export-menu-content { background: white; border-radius: 12px; padding: 24px; min-width: 320px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); transform: scale(0.9); transition: transform 0.3s; }
            .export-menu.active .export-menu-content { transform: scale(1); }
            .export-menu-content h4 { margin: 0 0 20px; font-size: 18px; color: #1f2937; display: flex; align-items: center; gap: 10px; }
            .export-menu-content button { width: 100%; padding: 12px 16px; margin-bottom: 10px; border: 1px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
            .export-menu-content button:hover { background: #f9fafb; border-color: #3b82f6; color: #3b82f6; }
            .export-menu-content button:last-child { background: #f3f4f6; border-color: #d1d5db; margin-bottom: 0; }
            .export-menu-content button:last-child:hover { background: #e5e7eb; }
            
            .section-error { padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #dc2626; text-align: center; }
            
            @media (max-width: 768px) {
                .rankings-grid { grid-template-columns: 1fr; }
                .filter-mode-btn { min-width: 120px; font-size: 13px; padding: 10px 16px; }
                .analytics-header { flex-direction: column; align-items: flex-start; }
                .header-actions { width: 100%; }
                .btn-header { flex: 1; justify-content: center; }
                .analytics-metrics { grid-template-columns: 1fr; }
                .analytics-tabs { flex-direction: column; }
                .custom-date-picker { flex-direction: column; }
                .date-input-group { width: 100%; }
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
            
            container.innerHTML = '';
            container.innerHTML = renderHeader();
            
            // Add unified filter selector
            const filterDiv = document.createElement('div');
            filterDiv.innerHTML = renderFilterSelector();
            container.appendChild(filterDiv);
            
            const tabsDiv = document.createElement('div');
            tabsDiv.innerHTML = renderTabs();
            container.appendChild(tabsDiv);
            
            const contentDiv = document.createElement('div');
            contentDiv.id = 'tabContent';
            container.appendChild(contentDiv);
            
            // Load data based on active tab
            await loadTabContent(contentDiv);
            
            state.loaded = true;
            state.loading = false;
            state.lastFetchTime = Date.now();
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
    
    async function loadTabContent(container) {
        try {
            switch(state.activeTab) {
                case 'overview':
                    const overviewData = await fetchComprehensiveData(state.filters.filterMode);
                    state.lastSuccessfulData = overviewData;
                    renderOverviewAnalytics(overviewData, container);
                    break;
                    
                case 'rankings':
                    renderRankingsAnalytics(container);
                    break;
                    
                case 'data-rate':
                    renderDataGatheringRate(container);
                    break;
            }
        } catch (error) {
            logger.error(`Tab content load error: ${error.message}`);
            container.innerHTML = '<div class="section-error">Failed to load content</div>';
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
        changeFilterMode: changeFilterMode,
        toggleCustomDatePicker: toggleCustomDatePicker,
        updateCustomDate: updateCustomDate,
        applyCustomDateRange: applyCustomDateRange,
        switchTab: switchTab,
        exportData: exportData,
        doExport: doExport,
        closeExportMenu: closeExportMenu,
        state: () => ({ 
            loaded: state.loaded,
            loading: state.loading,
            lastFetchTime: state.lastFetchTime,
            activeTab: state.activeTab,
            filterMode: state.filters.filterMode,
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
    
})();