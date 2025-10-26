// ============================================
// REAL-TIME ANALYTICS CLIENT
// ============================================
// Extends your existing widget with real-time updates

(function() {
    'use strict';
    
    const CONFIG = {
        API_URL: 'https://raspberrypi.tail2aed63.ts.net',
        API_KEY: '200206',
        USE_SSE: true,  // Use Server-Sent Events for real-time
        FALLBACK_TO_POLLING: true,  // Fallback to polling if SSE fails
        POLLING_INTERVAL: 5000,  // 5 seconds for polling
        RECONNECT_DELAY: 3000,  // Reconnect delay for SSE
        MAX_RECONNECT_ATTEMPTS: 5
    };
    
    // ============================================
    // INTEGRATE WITH YOUR EXISTING WIDGET
    // ============================================
    
    // Extend the existing AnalyticsWidget with real-time capabilities
    const originalInit = window.AnalyticsWidget?.init;
    const originalDestroy = window.AnalyticsWidget?.destroy;
    const originalRefresh = window.AnalyticsWidget?.refresh;
    
    let realtimeManager = null;
    
    // Override init to start real-time monitoring
    if (window.AnalyticsWidget) {
        window.AnalyticsWidget.init = function() {
            console.log('[REALTIME] Initializing with real-time support...');
            
            // Call original init
            if (originalInit) {
                const result = originalInit.apply(this, arguments);
                
                // Start real-time monitoring after widget is initialized
                if (!realtimeManager) {
                    realtimeManager = new RealTimeManager((data) => {
                        console.log('[REALTIME] Data change detected, auto-refreshing...');
                        // Auto-refresh is now handled by notification button
                        // User can choose to refresh manually
                    });
                    realtimeManager.start();
                }
                
                return result;
            }
        };
        
        // Override destroy to stop real-time monitoring
        window.AnalyticsWidget.destroy = function() {
            console.log('[REALTIME] Destroying with real-time cleanup...');
            
            if (realtimeManager) {
                realtimeManager.stop();
                realtimeManager = null;
            }
            
            if (originalDestroy) {
                return originalDestroy.apply(this, arguments);
            }
        };
        
        // Add manual trigger function
        window.AnalyticsWidget.toggleRealtime = function(enable) {
            if (enable && !realtimeManager) {
                realtimeManager = new RealTimeManager((data) => {
                    console.log('[REALTIME] Data change detected');
                });
                realtimeManager.start();
                console.log('[REALTIME] Real-time monitoring enabled');
            } else if (!enable && realtimeManager) {
                realtimeManager.stop();
                realtimeManager = null;
                console.log('[REALTIME] Real-time monitoring disabled');
            }
        };
        
        window.AnalyticsWidget.getRealTimeStatus = function() {
            if (!realtimeManager) {
                return {
                    enabled: false,
                    connected: false,
                    mode: null
                };
            }
            
            return {
                enabled: true,
                connected: realtimeManager.connected,
                mode: realtimeManager.mode,
                reconnectAttempts: realtimeManager.reconnectAttempts
            };
        };
    }
    
    // ============================================
    // AUTO-START ON PAGE LOAD
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📡 [REALTIME] Real-time analytics client ready');
        });
    } else {
        console.log('📡 [REALTIME] Real-time analytics client ready');
    }
    
})();

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// EXAMPLE 1: Check real-time status
console.log(window.AnalyticsWidget.getRealTimeStatus());

// EXAMPLE 2: Toggle real-time monitoring
window.AnalyticsWidget.toggleRealtime(true);  // Enable
window.AnalyticsWidget.toggleRealtime(false); // Disable

// EXAMPLE 3: Manual refresh when notified
// The notification bar will appear automatically when data changes
// User clicks "Refresh Now" button to update

// EXAMPLE 4: Custom event listener
window.addEventListener('analytics-data-changed', (event) => {
    console.log('Data changed:', event.detail);
    // Your custom handling here
});

*/
    // REAL-TIME CONNECTION MANAGER
    // ============================================
    
    class RealTimeManager {
        constructor(onDataChange) {
            this.onDataChange = onDataChange;
            this.eventSource = null;
            this.pollingTimer = null;
            this.lastChecksum = null;
            this.reconnectAttempts = 0;
            this.connected = false;
            this.mode = null;  // 'sse' or 'polling'
        }
        
        start() {
            console.log('[REALTIME] Starting real-time connection...');
            
            if (CONFIG.USE_SSE) {
                this.startSSE();
            } else {
                this.startPolling();
            }
        }
        
        stop() {
            console.log('[REALTIME] Stopping real-time connection...');
            this.stopSSE();
            this.stopPolling();
        }
        
        // ============================================
        // SERVER-SENT EVENTS (SSE) - RECOMMENDED
        // ============================================
        
        startSSE() {
            try {
                const url = `${CONFIG.API_URL}/analytics/realtime/stream?api_key=${CONFIG.API_KEY}`;
                
                console.log('[REALTIME] Connecting via SSE...');
                this.eventSource = new EventSource(url);
                this.mode = 'sse';
                
                this.eventSource.onopen = () => {
                    console.log('✅ [REALTIME] SSE connected');
                    this.connected = true;
                    this.reconnectAttempts = 0;
                    this.updateConnectionStatus('connected', 'sse');
                };
                
                this.eventSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.handleMessage(data);
                    } catch (e) {
                        console.error('[REALTIME] Error parsing SSE message:', e);
                    }
                };
                
                this.eventSource.onerror = (error) => {
                    console.error('❌ [REALTIME] SSE error:', error);
                    this.connected = false;
                    this.updateConnectionStatus('disconnected', 'sse');
                    
                    // Attempt reconnection
                    this.stopSSE();
                    
                    if (this.reconnectAttempts < CONFIG.MAX_RECONNECT_ATTEMPTS) {
                        this.reconnectAttempts++;
                        console.log(`[REALTIME] Reconnecting SSE (attempt ${this.reconnectAttempts})...`);
                        setTimeout(() => this.startSSE(), CONFIG.RECONNECT_DELAY);
                    } else if (CONFIG.FALLBACK_TO_POLLING) {
                        console.log('[REALTIME] SSE failed, falling back to polling...');
                        this.startPolling();
                    }
                };
                
            } catch (error) {
                console.error('[REALTIME] Failed to start SSE:', error);
                
                if (CONFIG.FALLBACK_TO_POLLING) {
                    console.log('[REALTIME] Falling back to polling...');
                    this.startPolling();
                }
            }
        }
        
        stopSSE() {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = null;
                console.log('[REALTIME] SSE connection closed');
            }
        }
        
        // ============================================
        // POLLING (FALLBACK)
        // ============================================
        
        startPolling() {
            console.log('[REALTIME] Starting polling mode...');
            this.mode = 'polling';
            this.connected = true;
            this.updateConnectionStatus('connected', 'polling');
            this.poll();
        }
        
        async poll() {
            try {
                const url = `${CONFIG.API_URL}/analytics/realtime/poll?api_key=${CONFIG.API_KEY}&last_checksum=${this.lastChecksum || ''}`;
                
                const response = await fetch(url);
                if (!response.ok) throw new Error('Polling failed');
                
                const data = await response.json();
                
                if (data.changed) {
                    console.log('📊 [REALTIME] Data changed detected via polling');
                    this.lastChecksum = data.checksum;
                    this.handleMessage({
                        type: 'database_change',
                        changes: data.state,
                        timestamp: data.timestamp
                    });
                }
                
                // Schedule next poll
                this.pollingTimer = setTimeout(() => this.poll(), CONFIG.POLLING_INTERVAL);
                
            } catch (error) {
                console.error('[REALTIME] Polling error:', error);
                this.connected = false;
                this.updateConnectionStatus('error', 'polling');
                
                // Retry polling
                this.pollingTimer = setTimeout(() => this.poll(), CONFIG.POLLING_INTERVAL * 2);
            }
        }
        
        stopPolling() {
            if (this.pollingTimer) {
                clearTimeout(this.pollingTimer);
                this.pollingTimer = null;
                console.log('[REALTIME] Polling stopped');
            }
        }
        
        // ============================================
        // MESSAGE HANDLING
        // ============================================
        
        handleMessage(data) {
            console.log('[REALTIME] Message received:', data.type);
            
            switch (data.type) {
                case 'connected':
                    console.log('✅ [REALTIME] Connected to server');
                    break;
                    
                case 'heartbeat':
                    // Keep-alive message, do nothing
                    break;
                    
                case 'database_change':
                    console.log('📊 [REALTIME] Database changed:', Object.keys(data.changes || {}));
                    this.notifyDataChange(data);
                    break;
                    
                case 'manual_trigger':
                    console.log('🔄 [REALTIME] Manual refresh triggered');
                    this.notifyDataChange(data);
                    break;
                    
                case 'webhook_notification':
                    console.log('🔔 [REALTIME] Webhook notification:', data.data);
                    this.notifyDataChange(data);
                    break;
                    
                default:
                    console.log('[REALTIME] Unknown message type:', data.type);
            }
        }
        
        notifyDataChange(data) {
            // Show notification
            this.showNotification(data);
            
            // Call the callback to refresh data
            if (this.onDataChange) {
                this.onDataChange(data);
            }
        }
        
        showNotification(data) {
            const notificationBar = document.getElementById('realtimeNotification');
            if (!notificationBar) {
                this.createNotificationBar();
                return this.showNotification(data);
            }
            
            const changes = data.changes || {};
            const changeCount = Object.keys(changes).length;
            
            notificationBar.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-sync-alt fa-spin"></i>
                    <span>New data available! ${changeCount} database(s) updated.</span>
                    <button onclick="window.AnalyticsWidget.refresh()" class="btn-refresh-now">
                        <i class="fas fa-redo"></i> Refresh Now
                    </button>
                    <button onclick="this.parentElement.parentElement.style.display='none'" class="btn-dismiss">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            notificationBar.style.display = 'block';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                notificationBar.style.display = 'none';
            }, 10000);
        }
        
        createNotificationBar() {
            const container = document.getElementById('analyticsWidget');
            if (!container) return;
            
            const notificationBar = document.createElement('div');
            notificationBar.id = 'realtimeNotification';
            notificationBar.className = 'realtime-notification';
            notificationBar.style.display = 'none';
            
            container.insertBefore(notificationBar, container.firstChild);
            
            // Inject notification styles
            if (!document.getElementById('realtime-notification-styles')) {
                const style = document.createElement('style');
                style.id = 'realtime-notification-styles';
                style.textContent = `
                    .realtime-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 16px 20px;
                        border-radius: 12px;
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                        z-index: 10000;
                        animation: slideIn 0.3s ease-out;
                        max-width: 400px;
                    }
                    
                    @keyframes slideIn {
                        from {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        flex-wrap: wrap;
                    }
                    
                    .notification-content i.fa-spin {
                        font-size: 20px;
                    }
                    
                    .notification-content span {
                        flex: 1;
                        min-width: 150px;
                    }
                    
                    .btn-refresh-now {
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        padding: 6px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.2s;
                    }
                    
                    .btn-refresh-now:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: scale(1.05);
                    }
                    
                    .btn-dismiss {
                        background: transparent;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 4px;
                        opacity: 0.7;
                        transition: opacity 0.2s;
                    }
                    
                    .btn-dismiss:hover {
                        opacity: 1;
                    }
                    
                    .connection-status {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        z-index: 9999;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    }
                    
                    .connection-status.connected {
                        background: #10b981;
                        color: white;
                    }
                    
                    .connection-status.disconnected {
                        background: #ef4444;
                        color: white;
                    }
                    
                    .connection-status.error {
                        background: #f59e0b;
                        color: white;
                    }
                    
                    .connection-status .status-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: currentColor;
                        animation: pulse 2s infinite;
                    }
                    
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        updateConnectionStatus(status, mode) {
            let statusBar = document.getElementById('connectionStatus');
            
            if (!statusBar) {
                statusBar = document.createElement('div');
                statusBar.id = 'connectionStatus';
                statusBar.className = 'connection-status';
                document.body.appendChild(statusBar);
            }
            
            const icons = {
                connected: 'fa-check-circle',
                disconnected: 'fa-times-circle',
                error: 'fa-exclamation-circle'
            };
            
            const labels = {
                connected: `Live (${mode.toUpperCase()})`,
                disconnected: 'Disconnected',
                error: 'Connection Error'
            };
            
            statusBar.className = `connection-status ${status}`;
            statusBar.innerHTML = `
                <div class="status-dot"></div>
                <i class="fas ${icons[status]}"></i>
                <span>${labels[status]}</span>
            `;
        }
    }
    
    // ============================================