// ============================================
// ADVANCED DATA TABLES MODULE
// ============================================
// assets\forms\widgets\data_record_table.js
(function() {
    'use strict';
    
    const CONFIG = {
        API_URL: 'https://api.northman-gaming-corporation.site',
        API_KEY: '200206',
        CONTAINER_ID: 'dataTablesWidget',
        PAGE_SIZE: 100,
        MAX_RETRIES: 3,
        REQUEST_TIMEOUT: 30000
    };
    
    const state = {
        activeTable: 'cancellations',
        currentPage: 1,
        totalRecords: 0,
        totalPages: 0,
        sortColumn: 'timestamp',
        sortDirection: 'desc',
        filters: {},
        data: [],
        columns: {},
        loading: false,
        abortController: null,
        columnFilters: {},
        searchQuery: ''
    };
    
    const TABLE_CONFIGS = {
    cancellations: {
        name: 'Ticket Cancellations',
        icon: 'fa-times-circle',
        endpoint: '/data/v1/cancellations',
        columns: [
            { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
            { key: 'ticket_id', label: 'Ticket ID', type: 'text', sortable: true, filterable: true },
            { key: 'booth_code', label: 'Booth Code', type: 'text', sortable: true, filterable: true },
            { key: 'status', label: 'Status', type: 'select', sortable: true, filterable: true, 
              options: ['request', 'approved', 'rejected', 'denied', 'pending'] },
            { key: 'operator', label: 'Operator', type: 'text', sortable: true, filterable: true },
            { key: 'reason', label: 'Reason', type: 'text', sortable: false, filterable: false },
            { key: 'timestamp', label: 'Timestamp', type: 'datetime', sortable: true, filterable: false }
        ]
    },
    payouts: {
        name: 'Ticket Payouts',
        icon: 'fa-money-bill-wave',
        endpoint: '/data/v1/payouts',
        columns: [
            { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
            { key: 'ticket_id', label: 'Ticket ID', type: 'text', sortable: true, filterable: true },
            { key: 'outlet', label: 'Outlet', type: 'text', sortable: true, filterable: true },
            { key: 'payout_amount', label: 'Amount', type: 'currency', sortable: true, filterable: true },
            { key: 'operator', label: 'Operator', type: 'text', sortable: true, filterable: true },
            { key: 'notes', label: 'Notes', type: 'text', sortable: false, filterable: false },
            { key: 'timestamp', label: 'Timestamp', type: 'datetime', sortable: true, filterable: false }
        ]
    },
    device_changes: {
        name: 'Device Changes',
        icon: 'fa-mobile-alt',
        endpoint: '/data/v1/device-changes',
        columns: [
            { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
            { key: 'sender_username', label: 'Username', type: 'text', sortable: true, filterable: true },
            { key: 'user_type', label: 'User Type', type: 'select', sortable: true, filterable: true,
              options: ['phone', 'pos'] },
            { key: 'booth_code', label: 'Booth', type: 'text', sortable: true, filterable: true },
            { key: 'old_booth_code', label: 'Old Booth', type: 'text', sortable: false, filterable: false },
            { key: 'new_booth_code', label: 'New Booth', type: 'text', sortable: false, filterable: false },
            { key: 'pos_serial_number', label: 'POS Serial', type: 'text', sortable: false, filterable: false },
            { key: 'operator', label: 'Operator', type: 'text', sortable: true, filterable: true },
            { key: 'reason', label: 'Reason', type: 'text', sortable: false, filterable: false },
            { key: 'timestamp', label: 'Timestamp', type: 'datetime', sortable: true, filterable: false }
        ]
    },
    force_cancellations: {
    name: 'Force Cancellations',
    icon: 'fa-ban',
    endpoint: '/data/v1/force-cancellations',
    columns: [
        { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
        { key: 'message_id', label: 'Msg ID', type: 'number', sortable: true, filterable: false },
        { key: 'sender_username', label: 'Username', type: 'text', sortable: true, filterable: true },
        { key: 'sender_first_name', label: 'First Name', type: 'text', sortable: true, filterable: false },
        { key: 'sender_last_name', label: 'Last Name', type: 'text', sortable: true, filterable: false },
        { key: 'ticket_number', label: 'Ticket #', type: 'text', sortable: true, filterable: true },
        { key: 'booth_code', label: 'Booth Code', type: 'text', sortable: true, filterable: true },
        { key: 'reason', label: 'Reason', type: 'text', sortable: false, filterable: false },
        { key: 'timestamp', label: 'Timestamp', type: 'datetime', sortable: true, filterable: false }
    ]
},
server_reports: {
    name: 'Server Reports',
    icon: 'fa-server',
    endpoint: '/data/v1/server-reports',
    columns: [
        { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
        { key: 'message_id', label: 'Msg ID', type: 'number', sortable: true, filterable: false },
        { key: 'sender_username', label: 'Username', type: 'text', sortable: true, filterable: true },
        { key: 'date_time_reported', label: 'Reported', type: 'datetime', sortable: true, filterable: false },
        { key: 'error_type', label: 'Error Type', type: 'text', sortable: true, filterable: true },
        { key: 'error_start_time', label: 'Start Time', type: 'text', sortable: true, filterable: false },
        { key: 'error_resolved_time', label: 'Resolved Time', type: 'text', sortable: true, filterable: false },
        { key: 'error_duration', label: 'Duration', type: 'text', sortable: true, filterable: false },
        { key: 'timestamp', label: 'Timestamp', type: 'datetime', sortable: true, filterable: false }
    ]
},
ticket_verifications: {
    name: 'Ticket Verifications',
    icon: 'fa-check-circle',
    endpoint: '/data/v1/ticket-verifications',
    columns: [
        { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
        { key: 'message_id', label: 'Msg ID', type: 'number', sortable: true, filterable: false },
        { key: 'sender_username', label: 'Username', type: 'text', sortable: true, filterable: true },
        { key: 'date_requested', label: 'Date Requested', type: 'date', sortable: true, filterable: false },
        { key: 'ticket_booth_code', label: 'Ticket Booth', type: 'text', sortable: true, filterable: true },
        { key: 'ticket_number', label: 'Ticket #', type: 'text', sortable: true, filterable: true },
        { key: 'bet_date', label: 'Bet Date', type: 'date', sortable: true, filterable: false },
        { key: 'bet_time', label: 'Bet Time', type: 'text', sortable: false, filterable: false },
        { key: 'reason', label: 'Reason', type: 'text', sortable: false, filterable: false },
        { key: 'timestamp', label: 'Timestamp', type: 'datetime', sortable: true, filterable: false }
    ]
},
booth_analytics: {
    name: 'Booth Analytics',
    icon: 'fa-store',
    endpoint: '/data/v1/booth-analytics',
    columns: [
        { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
        { key: 'booth_code', label: 'Booth Code', type: 'text', sortable: true, filterable: true },
        { key: 'transaction_count', label: 'Transactions', type: 'number', sortable: true, filterable: true },
        { key: 'total_amount', label: 'Total Amount', type: 'currency', sortable: true, filterable: true },
        { key: 'last_activity', label: 'Last Activity', type: 'datetime', sortable: true, filterable: false },
        { key: 'status', label: 'Status', type: 'select', sortable: true, filterable: true,
          options: ['active', 'inactive', 'suspended'] }
    ]
}
};
    
    const logger = {
        info: (msg) => console.log(`[DATA TABLES] ${new Date().toISOString()} ${msg}`),
        error: (msg) => console.error(`[DATA TABLES] ${new Date().toISOString()} ${msg}`)
    };
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function formatValue(value, type) {
        if (value === null || value === undefined) return '-';
        
        switch(type) {
            case 'currency':
                return '₱' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            case 'number':
                return Number(value).toLocaleString('en-US');
            case 'datetime':
                try {
                    return new Date(value).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch {
                    return value;
                }
            case 'date':
                try {
                    return new Date(value).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                } catch {
                    return value;
                }
            default:
                return String(value);
        }
    }
    
    function sanitizeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
    
    function downloadCSV(data, filename) {
        if (!Array.isArray(data) || data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => {
                const val = row[h] ?? '';
                return JSON.stringify(String(val));
            }).join(','))
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
    
    // ============================================
    // API FUNCTIONS
    // ============================================
    
    function buildQueryParams() {
        const params = new URLSearchParams();
        
        params.append('page', state.currentPage);
        params.append('page_size', CONFIG.PAGE_SIZE);
        params.append('sort_by', state.sortColumn);
        params.append('sort_direction', state.sortDirection);
        
        if (state.searchQuery) {
            params.append('search', state.searchQuery);
        }
        
        Object.keys(state.columnFilters).forEach(key => {
            const value = state.columnFilters[key];
            if (value && value.trim()) {
                params.append(`filter_${key}`, value.trim());
            }
        });
        
        return params.toString();
    }
    
    async function fetchWithTimeout(url, options = {}, timeout = CONFIG.REQUEST_TIMEOUT) {
        const controller = new AbortController();
        state.abortController = controller;
        
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
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
    
    async function fetchTableData() {
        try {
            state.loading = true;
            logger.info(`Fetching ${state.activeTable} data...`);
            
            const config = TABLE_CONFIGS[state.activeTable];
            const params = buildQueryParams();
            const url = `${CONFIG.API_URL}${config.endpoint}?${params}`;
            
            const response = await fetchWithTimeout(url);
            const result = await response.json();
            
            state.data = result.data || [];
            state.totalRecords = result.total || 0;
            state.totalPages = Math.ceil(state.totalRecords / CONFIG.PAGE_SIZE);
            state.columns = config.columns;
            
            logger.info(`✅ Fetched ${state.data.length} records`);
            return result;
            
        } catch (error) {
            logger.error(`Fetch failed: ${error.message}`);
            throw error;
        } finally {
            state.loading = false;
        }
    }
    
    // ============================================
    // UI RENDERING
    // ============================================
    
    function renderHeader() {
        const config = TABLE_CONFIGS[state.activeTable];
        
        return `
            <div class="tables-header">
                <div class="header-left">
                    <h1><i class="fas ${config.icon}"></i> ${config.name}</h1>
                    <p class="header-subtitle">
                        <i class="fas fa-database"></i> ${state.totalRecords.toLocaleString()} total records
                        <span class="separator">•</span>
                        <i class="fas fa-file-alt"></i> Page ${state.currentPage} of ${state.totalPages}
                    </p>
                </div>
                <div class="header-actions">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="globalSearch" placeholder="Search all columns..." 
                               value="${sanitizeHTML(state.searchQuery)}"
                               oninput="window.DataTablesWidget.handleSearch(this.value)">
                        ${state.searchQuery ? `
                            <button class="btn-clear-search" onclick="window.DataTablesWidget.clearSearch()">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                    <button class="btn-header" onclick="window.DataTablesWidget.exportCurrentView()" 
                            ${state.data.length === 0 ? 'disabled' : ''}>
                        <i class="fas fa-file-csv"></i> Export
                    </button>
                    <button class="btn-header" onclick="window.DataTablesWidget.clearAllFilters()"
                            ${Object.keys(state.columnFilters).length === 0 && !state.searchQuery ? 'disabled' : ''}>
                        <i class="fas fa-filter-circle-xmark"></i> Clear Filters
                    </button>
                    <button class="btn-header" onclick="window.DataTablesWidget.refresh()" 
                            ${state.loading ? 'disabled' : ''}>
                        <i class="fas fa-sync-alt ${state.loading ? 'fa-spin' : ''}"></i> Refresh
                    </button>
                </div>
            </div>
        `;
    }
    
    function renderTableSelector() {
        return `
            <div class="table-selector">
                ${Object.keys(TABLE_CONFIGS).map(key => {
                    const config = TABLE_CONFIGS[key];
                    return `
                        <button class="table-tab ${state.activeTable === key ? 'active' : ''}"
                                onclick="window.DataTablesWidget.switchTable('${key}')">
                            <i class="fas ${config.icon}"></i>
                            <span>${config.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    function renderTable() {
        if (state.data.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No Records Found</h3>
                    <p>Try adjusting your filters or search query</p>
                </div>
            `;
        }
        
        return `
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${state.columns.map(col => `
                                <th class="${col.sortable ? 'sortable' : ''} ${state.sortColumn === col.key ? 'sorted sorted-' + state.sortDirection : ''}"
                                    ${col.sortable ? `onclick="window.DataTablesWidget.handleSort('${col.key}')"` : ''}>
                                    <div class="th-content">
                                        <span>${col.label}</span>
                                        ${col.sortable ? `
                                            <i class="fas fa-sort${state.sortColumn === col.key ? (state.sortDirection === 'asc' ? '-up' : '-down') : ''}"></i>
                                        ` : ''}
                                    </div>
                                    ${col.filterable ? renderColumnFilter(col) : ''}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${state.data.map((row, idx) => `
                            <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
                                ${state.columns.map(col => `
                                    <td data-label="${col.label}" class="cell-${col.type}">
                                        ${formatValue(row[col.key], col.type)}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    function renderColumnFilter(column) {
        const currentValue = state.columnFilters[column.key] || '';
        
        if (column.type === 'select' && column.options) {
            return `
                <div class="column-filter" onclick="event.stopPropagation()">
                    <select class="filter-select" 
                            onchange="window.DataTablesWidget.handleColumnFilter('${column.key}', this.value)">
                        <option value="">All</option>
                        ${column.options.map(opt => `
                            <option value="${opt}" ${currentValue === opt ? 'selected' : ''}>${opt}</option>
                        `).join('')}
                    </select>
                </div>
            `;
        }
        
        if (column.type === 'number' || column.type === 'currency') {
            return `
                <div class="column-filter" onclick="event.stopPropagation()">
                    <input type="number" 
                           class="filter-input" 
                           placeholder="Filter..."
                           value="${sanitizeHTML(currentValue)}"
                           oninput="window.DataTablesWidget.handleColumnFilterDebounced('${column.key}', this.value)">
                </div>
            `;
        }
        
        return `
            <div class="column-filter" onclick="event.stopPropagation()">
                <input type="text" 
                       class="filter-input" 
                       placeholder="Filter..."
                       value="${sanitizeHTML(currentValue)}"
                       oninput="window.DataTablesWidget.handleColumnFilterDebounced('${column.key}', this.value)">
            </div>
        `;
    }
    
    function renderPagination() {
        if (state.totalPages <= 1) return '';
        
        const maxButtons = 7;
        let startPage = Math.max(1, state.currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(state.totalPages, startPage + maxButtons - 1);
        
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return `
            <div class="pagination">
                <div class="pagination-info">
                    Showing ${((state.currentPage - 1) * CONFIG.PAGE_SIZE) + 1} - ${Math.min(state.currentPage * CONFIG.PAGE_SIZE, state.totalRecords)} of ${state.totalRecords.toLocaleString()}
                </div>
                <div class="pagination-controls">
                    <button class="btn-page" 
                            onclick="window.DataTablesWidget.goToPage(1)"
                            ${state.currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-angle-double-left"></i>
                    </button>
                    <button class="btn-page" 
                            onclick="window.DataTablesWidget.goToPage(${state.currentPage - 1})"
                            ${state.currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-angle-left"></i>
                    </button>
                    
                    ${startPage > 1 ? '<span class="page-ellipsis">...</span>' : ''}
                    
                    ${pages.map(page => `
                        <button class="btn-page ${page === state.currentPage ? 'active' : ''}"
                                onclick="window.DataTablesWidget.goToPage(${page})">
                            ${page}
                        </button>
                    `).join('')}
                    
                    ${endPage < state.totalPages ? '<span class="page-ellipsis">...</span>' : ''}
                    
                    <button class="btn-page" 
                            onclick="window.DataTablesWidget.goToPage(${state.currentPage + 1})"
                            ${state.currentPage === state.totalPages ? 'disabled' : ''}>
                        <i class="fas fa-angle-right"></i>
                    </button>
                    <button class="btn-page" 
                            onclick="window.DataTablesWidget.goToPage(${state.totalPages})"
                            ${state.currentPage === state.totalPages ? 'disabled' : ''}>
                        <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>
                <div class="page-size-selector">
                    <label>Rows per page:</label>
                    <select onchange="window.DataTablesWidget.changePageSize(this.value)">
                        <option value="50" ${CONFIG.PAGE_SIZE === 50 ? 'selected' : ''}>50</option>
                        <option value="100" ${CONFIG.PAGE_SIZE === 100 ? 'selected' : ''}>100</option>
                        <option value="250" ${CONFIG.PAGE_SIZE === 250 ? 'selected' : ''}>250</option>
                        <option value="500" ${CONFIG.PAGE_SIZE === 500 ? 'selected' : ''}>500</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-spinner"></div>
                <span>Loading data...</span>
            </div>
        `;
    }
    
    function showError(container, message) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Data</h3>
                <p>${sanitizeHTML(message)}</p>
                <button class="btn-retry" onclick="window.DataTablesWidget.refresh()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
    
    // ============================================
    // INTERACTION HANDLERS
    // ============================================
    
    function handleSort(column) {
        if (state.sortColumn === column) {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortColumn = column;
            state.sortDirection = 'asc';
        }
        state.currentPage = 1;
        refresh();
    }
    
    const handleColumnFilterDebounced = debounce((column, value) => {
        handleColumnFilter(column, value);
    }, 500);
    
    function handleColumnFilter(column, value) {
        if (value && value.trim()) {
            state.columnFilters[column] = value.trim();
        } else {
            delete state.columnFilters[column];
        }
        state.currentPage = 1;
        refresh();
    }
    
    const handleSearchDebounced = debounce((query) => {
        state.searchQuery = query.trim();
        state.currentPage = 1;
        refresh();
    }, 500);
    
    function handleSearch(query) {
        handleSearchDebounced(query);
    }
    
    function clearSearch() {
        state.searchQuery = '';
        const input = document.getElementById('globalSearch');
        if (input) input.value = '';
        refresh();
    }
    
    function clearAllFilters() {
        state.columnFilters = {};
        state.searchQuery = '';
        state.currentPage = 1;
        refresh();
    }
    
    function goToPage(page) {
        if (page < 1 || page > state.totalPages) return;
        state.currentPage = page;
        refresh();
    }
    
    function changePageSize(size) {
        CONFIG.PAGE_SIZE = parseInt(size);
        state.currentPage = 1;
        refresh();
    }
    
    function switchTable(tableName) {
        if (state.activeTable === tableName) return;
        
        state.activeTable = tableName;
        state.currentPage = 1;
        state.sortColumn = 'timestamp';
        state.sortDirection = 'desc';
        state.columnFilters = {};
        state.searchQuery = '';
        
        refresh();
    }
    
    function exportCurrentView() {
        if (state.data.length === 0) return;
        
        const config = TABLE_CONFIGS[state.activeTable];
        const filename = `${state.activeTable}_${new Date().toISOString().split('T')[0]}.csv`;
        
        downloadCSV(state.data, filename);
    }
    
    // ============================================
    // STYLES
    // ============================================
    
    function injectStyles() {
        if (document.getElementById('data-tables-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'data-tables-styles';
        style.textContent = `
            .tables-header { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .tables-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
            .header-left h1 { font-size: 24px; font-weight: 700; margin: 0 0 8px; display: flex; align-items: center; gap: 10px; }
            .header-subtitle { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 8px; }
            .separator { color: #d1d5db; }
            
            .header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
            .search-box { position: relative; display: flex; align-items: center; }
            .search-box i { position: absolute; left: 12px; color: #6b7280; }
            .search-box input { padding: 10px 40px 10px 36px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; width: 300px; }
            .search-box input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
            .btn-clear-search { position: absolute; right: 8px; background: #f3f4f6; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7280; }
            .btn-clear-search:hover { background: #e5e7eb; color: #374151; }
            
            .btn-header { background: #f3f4f6; color: #374151; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
            .btn-header:hover { background: #e5e7eb; transform: translateY(-1px); }
            .btn-header:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            
            .table-selector { display: flex; gap: 8px; background: white; padding: 8px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; overflow-x: auto; }
            .table-tab { flex: 1; min-width: 150px; padding: 12px 20px; border: none; background: transparent; color: #6b7280; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; white-space: nowrap; }
            .table-tab:hover { background: #f3f4f6; color: #374151; }
            .table-tab.active { background: #3b82f6; color: white; }
            
            .table-wrapper { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table thead { background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
            .data-table th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #374151; white-space: nowrap; }
            .data-table th.sortable { cursor: pointer; user-select: none; }
            .data-table th.sortable:hover { background: #f3f4f6; }
            .data-table th.sorted { background: #eff6ff; }
            
            .th-content { display: flex; align-items: center; gap: 8px; }
            .th-content i { color: #9ca3af; font-size: 12px; }
            .sorted .th-content i { color: #3b82f6; }
            
            .column-filter { margin-top: 8px; }
            .filter-input, .filter-select { width: 100%; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; }
            .filter-input:focus, .filter-select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
            
            .data-table tbody tr { border-bottom: 1px solid #f3f4f6; }
            .data-table tbody tr:hover { background: #f9fafb; }
            .data-table tbody tr.even { background: #fafafa; }
            .data-table td { padding: 12px 16px; font-size: 14px; color: #1f2937; }
            .cell-currency { font-weight: 600; color: #059669; }
            .cell-number { font-family: monospace; }
            
            .pagination { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 20px; flex-wrap: wrap; gap: 16px; }
            .pagination-info { font-size: 14px; color: #6b7280; }
            .pagination-controls { display: flex; gap: 4px; }
            .btn-page { background: #f3f4f6; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; color: #374151; transition: all 0.2s; min-width: 40px; }
            .btn-page:hover:not(:disabled) { background: #e5e7eb; }
            .btn-page.active { background: #3b82f6; color: white; }
            .btn-page:disabled { opacity: 0.4; cursor: not-allowed; }
            .page-ellipsis { padding: 8px; color: #9ca3af; }
            
            .page-size-selector { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6b7280; }
            .page-size-selector select { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; cursor: pointer; }
            
            .loading-overlay, .error-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 16px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .loading-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .empty-state i { font-size: 48px; color: #d1d5db; }
            .empty-state h3 { margin: 0; color: #1f2937; }
            .empty-state p { margin: 0; color: #6b7280; }
            
            .error-state i { font-size: 48px; color: #ef4444; }
            .error-state h3 { margin: 0; color: #1f2937; }
            .error-state p { margin: 0; color: #6b7280; }
            .btn-retry { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; }
            .btn-retry:hover { background: #2563eb; }
            
            @media (max-width: 768px) {
                .tables-header { flex-direction: column; align-items: stretch; }
                .header-actions { flex-direction: column; }
                .search-box input { width: 100%; }
                .btn-header { justify-content: center; }
                .table-selector { flex-direction: column; }
                .table-tab { width: 100%; }
                .table-wrapper { overflow-x: auto; }
                .data-table { min-width: 800px; }
                .pagination { flex-direction: column; }
                .pagination-controls { order: -1; }
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
            
            await fetchTableData();
            
            container.innerHTML = '';
            container.innerHTML = renderHeader();
            
            const selectorDiv = document.createElement('div');
            selectorDiv.innerHTML = renderTableSelector();
            container.appendChild(selectorDiv);
            
            const tableDiv = document.createElement('div');
            tableDiv.innerHTML = renderTable();
            container.appendChild(tableDiv);
            
            const paginationDiv = document.createElement('div');
            paginationDiv.innerHTML = renderPagination();
            container.appendChild(paginationDiv);
            
            logger.info('✅ Widget initialized');
            
        } catch (error) {
            logger.error(`Initialization failed: ${error.message}`);
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (container) {
                showError(container, error.message);
            }
        }
    }
    
    function refresh() {
        return initialize();
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    window.DataTablesWidget = {
        init: initialize,
        refresh: refresh,
        handleSort: handleSort,
        handleColumnFilter: handleColumnFilter,
        handleColumnFilterDebounced: handleColumnFilterDebounced,
        handleSearch: handleSearch,
        clearSearch: clearSearch,
        clearAllFilters: clearAllFilters,
        goToPage: goToPage,
        changePageSize: changePageSize,
        switchTable: switchTable,
        exportCurrentView: exportCurrentView,
        getState: () => ({
            activeTable: state.activeTable,
            currentPage: state.currentPage,
            totalRecords: state.totalRecords,
            totalPages: state.totalPages,
            sortColumn: state.sortColumn,
            sortDirection: state.sortDirection,
            filters: state.columnFilters,
            searchQuery: state.searchQuery
        })
    };
    
    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            logger.info('📊 Data Tables widget ready');
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                initialize();
            }
        });
    } else {
        logger.info('📊 Data Tables widget ready');
        if (document.getElementById(CONFIG.CONTAINER_ID)) {
            initialize();
        }
    }
    
})();