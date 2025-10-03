// Determine priority
function determinePriority(status) {
  const highPriority = ['requires_action', 'needs_revision', 'for_pickup', 'for_approval'];
  const mediumPriority = ['in_progress', 'under_review'];
  
  if (highPriority.indexOf(status) !== -1) return 'high';
  if (mediumPriority.indexOf(status) !== -1) return 'medium';
  return 'low';
}

/**
 * Advanced Department-Based Announcement Modal System
 * Features: Department filtering, Quick Actions, Advanced animations
 * No localStorage - Pure JavaScript with inline styles
 */

// Auto-inject styles on load
(function() {
  if (document.getElementById('announcement-modal-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'announcement-modal-styles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes logoFloat {
      0% { transform: translateY(30px) scale(0.8); opacity: 0; }
      50% { transform: translateY(-5px) scale(1.05); }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes successPulse {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }

    .announcement-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1001;
      opacity: 0;
      animation: fadeIn 0.4s ease forwards;
      overflow: auto;
    }

    .announcement-modal-content {
      background: linear-gradient(145deg, #ffffff, #f8fafc);
      border-radius: 24px;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 48px;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.4), 
                  0 0 0 1px rgba(59, 130, 246, 0.1);
      transform: translateY(30px) scale(0.95);
      animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .announcement-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border: none;
      background: rgba(100, 116, 139, 0.08);
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      color: #64748b;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .announcement-close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      transform: rotate(90deg) scale(1.1);
    }

    .announcement-header {
      text-align: center;
      margin-bottom: 36px;
      animation: logoFloat 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .announcement-icon {
      width: 90px;
      height: 90px;
      background: linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
      position: relative;
      overflow: hidden;
    }

    .announcement-icon::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: rotate(45deg);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }

    .announcement-title {
      margin: 0 0 8px 0;
      color: #0f172a;
      font-weight: 800;
      font-size: 32px;
      background: linear-gradient(135deg, #0f172a, #3b82f6, #2563eb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    .announcement-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 16px;
      font-weight: 500;
    }

    .announcement-dept-badge {
      display: inline-block;
      margin-top: 12px;
      padding: 6px 16px;
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #1e40af;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .announcement-body {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .announcement-item {
      padding: 24px;
      background: linear-gradient(135deg, #ffffff, #f8fafc);
      border-radius: 16px;
      border-left: 5px solid #3b82f6;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      position: relative;
      overflow: hidden;
    }

    .announcement-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.03), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .announcement-item:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
      border-left-width: 6px;
    }

    .announcement-item:hover::before {
      opacity: 1;
    }

    .announcement-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .announcement-source {
      font-size: 12px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .announcement-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .announcement-badge {
      padding: 5px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      animation: slideInRight 0.3s ease forwards;
    }

    .badge-status-pending { background: #fef3c7; color: #92400e; }
    .badge-status-approved { background: #d1fae5; color: #065f46; }
    .badge-status-for-approval { background: #dbeafe; color: #1e40af; }
    .badge-status-in-progress { background: #e9d5ff; color: #6b21a8; }
    .badge-status-under-review { background: #fef3c7; color: #92400e; }
    .badge-status-needs-revision { background: #fee2e2; color: #991b1b; }
    .badge-status-for-pickup { background: #d1fae5; color: #065f46; }
    .badge-status-waiting-parts { background: #fef3c7; color: #92400e; }
    .badge-status-requires-action { background: #fee2e2; color: #991b1b; }

    .badge-priority-high { 
      background: linear-gradient(135deg, #fee2e2, #fecaca); 
      color: #991b1b; 
      animation: pulse 2s infinite;
    }
    .badge-priority-medium { background: #fef3c7; color: #92400e; }
    .badge-priority-low { background: #d1fae5; color: #065f46; }

    .announcement-item-body {
      display: flex;
      gap: 20px;
    }

    .announcement-item-icon {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .announcement-item:hover .announcement-item-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .announcement-item-content {
      flex: 1;
    }

    .announcement-item-content h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }

    .announcement-item-content p {
      margin: 0 0 12px 0;
      color: #475569;
      line-height: 1.6;
      font-size: 14px;
    }

    .announcement-details-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .announcement-detail-row {
      display: flex;
      padding: 8px 0;
      gap: 12px;
      animation: slideInRight 0.3s ease forwards;
    }

    .announcement-detail-row:nth-child(even) {
      background: rgba(248, 250, 252, 0.5);
      padding: 8px 12px;
      border-radius: 6px;
    }

    .announcement-detail-label {
      font-weight: 600;
      color: #64748b;
      min-width: 140px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .announcement-detail-value {
      color: #0f172a;
      font-size: 14px;
      flex: 1;
      word-break: break-word;
    }

    .detail-highlight {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      color: #1e40af;
    }

    .detail-emphasis {
      font-weight: 600;
      color: #0f172a;
    }

    .announcement-item-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }

    .announcement-item-date {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #6b7280;
      font-weight: 500;
    }

    .announcement-quick-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      animation: slideInRight 0.4s ease forwards;
      justify-content: flex-end;
    }

    .quick-action-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
    }

    .quick-action-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .quick-action-btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .btn-approve {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    .btn-approve:hover {
      background: linear-gradient(135deg, #059669, #047857);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }

    .btn-deny {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }

    .btn-deny:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .btn-view-details {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    }

    .btn-view-details:hover {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    .quick-action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .announcement-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 28px 0 16px 0;
    }

    .progress-dot {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: #cbd5e1;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .progress-dot:hover {
      background: #94a3b8;
      transform: scale(1.2);
    }

    .progress-dot.active {
      width: 32px;
      border-radius: 5px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .announcement-counter {
      text-align: center;
      font-size: 15px;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: 0.3px;
    }

    .announcement-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 28px;
      padding-top: 24px;
      border-top: 2px solid #e2e8f0;
      gap: 12px;
    }

    .announcement-btn {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
    }

    .announcement-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .announcement-btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .btn-skip {
      border: 2px solid #6b7280;
      background: transparent;
      color: #6b7280;
    }

    .btn-skip:hover {
      background: rgba(107, 114, 128, 0.08);
      border-color: #374151;
      color: #374151;
      transform: translateY(-2px);
    }

    .btn-nav {
      padding: 10px;
      background: rgba(148, 163, 184, 0.1);
      border: none;
      border-radius: 10px;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      width: 44px;
      height: 44px;
    }

    .btn-nav:hover:not(:disabled) {
      background: #e5e7eb;
      color: #374151;
      transform: scale(1.1);
    }

    .btn-nav:disabled {
      color: #d1d5db;
      cursor: not-allowed;
      opacity: 0.4;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
    }

    .announcement-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    .loading-content {
      background: linear-gradient(145deg, #ffffff, #f8fafc);
      padding: 40px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.4);
      animation: slideIn 0.4s ease forwards;
    }

    .loading-spinner {
      width: 56px;
      height: 56px;
      border: 5px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-text {
      color: #374151;
      font-weight: 600;
      font-size: 16px;
    }

    .success-toast {
      position: fixed;
      top: 24px;
      right: 24px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1002;
      animation: slideInRight 0.4s ease forwards;
      font-weight: 600;
    }

    .error-toast {
      position: fixed;
      top: 24px;
      right: 24px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1002;
      animation: shake 0.5s ease forwards;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .announcement-modal-content {
        padding: 28px 20px;
        margin: 12px;
        border-radius: 20px;
      }
      
      .announcement-title {
        font-size: 26px;
      }

      .announcement-icon {
        width: 75px;
        height: 75px;
      }
      
      .announcement-footer {
        flex-direction: column;
        gap: 12px;
      }
      
      .announcement-btn {
        width: 100%;
        justify-content: center;
      }

      .announcement-item-body {
        flex-direction: column;
        gap: 12px;
      }

      .quick-action-btn {
        padding: 10px 14px;
        font-size: 12px;
        gap: 4px;
      }

      .announcement-quick-actions {
        flex-wrap: wrap;
      }
    }
  `;
  
  document.head.appendChild(style);
})();

// Icons map
const ICONS = {
  accomplishments: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  early_rest_requests: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
  it_service_orders: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  travel_orders: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>',
  leave: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  rest_day: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
};

// Department-based collection configurations
const DEPARTMENT_COLLECTIONS = {
  HR: {
    collections: ['early_rest_requests'],
    name: 'Human Resources'
  },
  IT: {
    collections: ['accomplishments', 'early_rest_requests', 'it_service_orders', 'travel_orders'],
    name: 'Information Technology'
  },
  Admin: {
    collections: ['accomplishments', 'early_rest_requests', 'it_service_orders', 'travel_orders'],
    name: 'Administration'
  },
  Finance: {
    collections: ['accomplishments', 'travel_orders'],
    name: 'Finance'
  },
  Operations: {
    collections: ['accomplishments', 'it_service_orders', 'travel_orders'],
    name: 'Operations'
  }
};

// Collection configurations
const COLLECTIONS = {
  accomplishments: {
    statusField: 'status',
    showStatuses: ['pending', 'under_review', 'needs_revision'],
    name: 'ACCOMPLISHMENTS',
    icon: 'accomplishments',
    allowQuickActions: true
  },
  early_rest_requests: {
    statusField: 'status',
    showStatuses: ['pending', 'for_approval'],
    name: 'EARLY REST / LEAVE',
    icon: 'early_rest_requests',
    allowQuickActions: true
  },
  it_service_orders: {
    statusField: 'status',
    showStatuses: ['pending', 'in_progress', 'for_pickup', 'waiting_parts'],
    name: 'IT SERVICE ORDERS',
    icon: 'it_service_orders',
    allowQuickActions: false
  },
  travel_orders: {
    statusField: 'status',
    showStatuses: ['pending', 'for_approval', 'requires_action'],
    name: 'TRAVEL ORDERS',
    icon: 'travel_orders',
    allowQuickActions: true
  }
};

// Show toast notification
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = type === 'success' ? 'success-toast' : 'error-toast';
  
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>' 
    : '<i class="fas fa-exclamation-circle"></i>';
  
  toast.innerHTML = `${icon}<span>${message}</span>`;
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}

// Quick action handlers
async function handleQuickApprove(announcement) {
  try {
    const updates = {
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: announcement.currentUserId,
      approvedByName: announcement.currentUserName,
      approvedByEmail: announcement.currentUserEmail
    };
    
    await window.db.collection(announcement.collectionName)
      .doc(announcement.id)
      .update(updates);
    
    showToast('✓ Request approved successfully!', 'success');
    return true;
  } catch (error) {
    console.error('Error approving:', error);
    showToast('✗ Failed to approve request', 'error');
    return false;
  }
}

async function handleQuickDeny(announcement) {
  try {
    const updates = {
      status: 'denied',
      deniedAt: new Date(),
      deniedBy: announcement.currentUserId,
      deniedByName: announcement.currentUserName,
      deniedByEmail: announcement.currentUserEmail
    };
    
    await window.db.collection(announcement.collectionName)
      .doc(announcement.id)
      .update(updates);
    
    showToast('✓ Request denied', 'success');
    return true;
  } catch (error) {
    console.error('Error denying:', error);
    showToast('✗ Failed to deny request', 'error');
    return false;
  }
}

// Check Firebase databases based on user department
async function checkAnnouncementDatabases(user) {
  if (!window.db) {
    throw new Error('Firebase not initialized');
  }

  if (!user || !user.department) {
    throw new Error('User or department not specified');
  }

  const userDept = user.department;
  const deptConfig = DEPARTMENT_COLLECTIONS[userDept];
  
  if (!deptConfig) {
    console.warn(`No configuration found for department: ${userDept}`);
    return {
      announcements: [],
      department: userDept,
      userDepartment: userDept
    };
  }

  const announcements = [];
  const userName = user.firstName + ' ' + user.lastName;
  
  const promises = deptConfig.collections.map(async function(collectionName) {
    const config = COLLECTIONS[collectionName];
    
    if (!config) return;
    
    try {
      const snapshot = await window.db.collection(collectionName)
        .where(config.statusField, 'in', config.showStatuses)
        .get();
      
      snapshot.forEach(function(doc) {
        const data = doc.data();
        announcements.push({
          id: doc.id,
          collectionName: collectionName,
          source: config.name,
          sourceKey: config.icon,
          status: data[config.statusField],
          title: data.title || generateTitle(collectionName, data),
          description: data.description || generateDescription(collectionName, data),
          priority: determinePriority(data[config.statusField]),
          date: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
          allowQuickActions: config.allowQuickActions,
          currentUserId: user.username || user.email,
          currentUserName: userName,
          currentUserEmail: user.email,
          rawData: data
        });
      });
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
    }
  });
  
  await Promise.all(promises);
  
  // Sort by priority and date
  announcements.sort(function(a, b) {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.date) - new Date(a.date);
  });
  
  return {
    announcements: announcements,
    department: deptConfig.name,
    userDepartment: userDept
  };
}

// Generate title
function generateTitle(collectionName, data) {
  const titles = {
    accomplishments: function(d) {
      return (d.accomplishmentType || 'Accomplishment') + ' Report';
    },
    early_rest_requests: function(d) {
      const type = d.requestType || 'rest';
      return type === 'leave' ? 'Leave Request' : 'Early Rest Request';
    },
    it_service_orders: function(d) {
      return 'IT Service Order #' + (d.orderNumber || 'N/A');
    },
    travel_orders: function(d) {
      return 'Travel Order to ' + (d.destination || 'N/A');
    }
  };
  
  return titles[collectionName] ? titles[collectionName](data) : 'Notification';
}

// Generate description
function generateDescription(collectionName, data) {
  const descriptions = {
    accomplishments: function(d) {
      if (d.status === 'pending') return 'Accomplishment report awaiting your review';
      if (d.status === 'under_review') return 'Accomplishment currently being reviewed';
      if (d.status === 'needs_revision') return 'Accomplishment requires revisions';
      return 'Status: ' + (d.status || 'Unknown');
    },
    early_rest_requests: function(d) {
      const requester = d.requesterName || 'Employee';
      if (d.status === 'pending') return requester + ' is requesting early rest/leave - pending approval';
      if (d.status === 'for_approval') return requester + ' - request ready for final approval';
      return 'Status: ' + (d.status || 'Unknown');
    },
    it_service_orders: function(d) {
      if (d.status === 'pending') return 'IT service request pending assignment';
      if (d.status === 'in_progress') return 'Service currently in progress';
      if (d.status === 'for_pickup') return 'Device/item ready for pickup';
      if (d.status === 'waiting_parts') return 'Waiting for parts to arrive';
      return 'Status: ' + (d.status || 'Unknown');
    },
    travel_orders: function(d) {
      const traveler = d.travelerName || 'Employee';
      if (d.status === 'pending') return traveler + ' - travel authorization pending approval';
      if (d.status === 'for_approval') return traveler + ' - travel order requires final approval';
      if (d.status === 'requires_action') return 'Action required on travel order';
      return 'Status: ' + (d.status || 'Unknown');
    }
  };
  
  return descriptions[collectionName] ? descriptions[collectionName](data) : 'Please review this item';
}

// Format date (simple version for header)
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return diffDays + ' days ago';
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Generate detailed information HTML based on collection type
function generateDetailedInfo(announcement) {
  const data = announcement.rawData;
  const details = [];
  
  // Common details for all types
  details.push({
    icon: 'fa-hashtag',
    label: 'Document ID',
    value: announcement.id
  });
  
  // Generate details from all available fields in the object
  const excludeFields = ['createdAt', 'updatedAt', 'id', 'password', 'status'];
  
  Object.keys(data).forEach(function(key) {
    // Skip excluded fields and null/undefined values
    if (excludeFields.indexOf(key) !== -1 || data[key] == null) {
      return;
    }
    
    const value = data[key];
    
    // Handle different data types
    let displayValue = value;
    let icon = 'fa-info-circle';
    let label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    let highlight = false;
    let emphasis = false;
    
    // Determine icon and formatting based on field name
    if (key.toLowerCase().includes('name')) {
      icon = 'fa-user';
      emphasis = true;
    } else if (key.toLowerCase().includes('email')) {
      icon = 'fa-envelope';
    } else if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('contact')) {
      icon = 'fa-phone';
    } else if (key.toLowerCase().includes('date')) {
      icon = 'fa-calendar';
      displayValue = formatDetailDate(value);
      highlight = true;
    } else if (key.toLowerCase().includes('time')) {
      icon = 'fa-clock';
      displayValue = formatDetailDate(value);
    } else if (key.toLowerCase().includes('type')) {
      icon = 'fa-tag';
    } else if (key.toLowerCase().includes('department')) {
      icon = 'fa-building';
    } else if (key.toLowerCase().includes('position') || key.toLowerCase().includes('role')) {
      icon = 'fa-briefcase';
    } else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('details')) {
      icon = 'fa-align-left';
    } else if (key.toLowerCase().includes('reason')) {
      icon = 'fa-comment-alt';
    } else if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('budget') || key.toLowerCase().includes('cost')) {
      icon = 'fa-dollar-sign';
      if (typeof value === 'number') {
        displayValue = '₱' + value.toLocaleString();
      }
    } else if (key.toLowerCase().includes('priority')) {
      icon = 'fa-flag';
      highlight = true;
    } else if (key.toLowerCase().includes('destination') || key.toLowerCase().includes('location')) {
      icon = 'fa-map-marker-alt';
      highlight = true;
    } else if (key.toLowerCase().includes('order') || key.toLowerCase().includes('number')) {
      icon = 'fa-barcode';
      highlight = true;
    } else if (key.toLowerCase().includes('device') || key.toLowerCase().includes('equipment')) {
      icon = 'fa-laptop';
    } else if (key.toLowerCase().includes('assign')) {
      icon = 'fa-user-cog';
    } else if (key.toLowerCase().includes('duration')) {
      icon = 'fa-hourglass-half';
    } else if (key.toLowerCase().includes('attachment') || key.toLowerCase().includes('file')) {
      icon = 'fa-paperclip';
    } else if (key.toLowerCase().includes('note') || key.toLowerCase().includes('remark') || key.toLowerCase().includes('comment')) {
      icon = 'fa-sticky-note';
    } else if (key.toLowerCase().includes('purpose')) {
      icon = 'fa-bullseye';
    } else if (key.toLowerCase().includes('accommod')) {
      icon = 'fa-hotel';
    } else if (key.toLowerCase().includes('transport')) {
      icon = 'fa-car';
    } else if (key.toLowerCase().includes('request')) {
      icon = 'fa-paper-plane';
    } else if (key.toLowerCase().includes('approv')) {
      icon = 'fa-check-circle';
    } else if (key.toLowerCase().includes('den')) {
      icon = 'fa-times-circle';
    } else if (key.toLowerCase().includes('submit')) {
      icon = 'fa-upload';
    }
    
    // Handle different value types
    if (typeof value === 'object' && value !== null) {
      // Handle Firestore Timestamp
      if (value.seconds !== undefined) {
        displayValue = formatDetailDate(value);
        icon = 'fa-calendar-alt';
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        if (value.length === 0) {
          displayValue = 'None';
        } else {
          displayValue = value.join(', ');
          if (value.length > 1) {
            displayValue += ' (' + value.length + ' items)';
          }
        }
      }
      // Handle objects
      else {
        displayValue = JSON.stringify(value, null, 2);
      }
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
      icon = value ? 'fa-check' : 'fa-times';
    } else if (typeof value === 'number') {
      displayValue = value.toLocaleString();
    } else if (typeof value === 'string') {
      // Check if it's a date string
      if (value.match(/^\d{4}-\d{2}-\d{2}/) || value.match(/^\d{2}\/\d{2}\/\d{4}/)) {
        displayValue = formatDetailDate(value);
        if (icon === 'fa-info-circle') icon = 'fa-calendar';
      }
    }
    
    details.push({
      icon: icon,
      label: label,
      value: displayValue,
      highlight: highlight,
      emphasis: emphasis
    });
  });
  
  // Add submission timestamp if available
  if (data.createdAt) {
    details.unshift({
      icon: 'fa-clock',
      label: 'Submitted',
      value: formatDetailDate(data.createdAt),
      highlight: true
    });
  }
  
  // Add last update timestamp if available
  if (data.updatedAt) {
    details.push({
      icon: 'fa-sync-alt',
      label: 'Last Updated',
      value: formatDetailDate(data.updatedAt)
    });
  }
  
  // Generate HTML
  let html = '<div class="announcement-details-section">';
  
  details.forEach(function(detail, index) {
    const valueClass = detail.highlight ? 'detail-highlight' : (detail.emphasis ? 'detail-emphasis' : '');
    html += `
      <div class="announcement-detail-row" style="animation-delay: ${index * 0.05}s">
        <div class="announcement-detail-label">
          <i class="fas ${detail.icon}"></i>
          ${detail.label}:
        </div>
        <div class="announcement-detail-value ${valueClass}">
          ${detail.value || 'N/A'}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

// Robust formatDetailDate — handles Firestore Timestamps, strings, Date objects,
// and future dates (no more "-4 days ago").
function formatDetailDate(dateInput) {
  if (!dateInput) return 'N/A';

  // Normalize input to a JS Date
  let date = null;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (dateInput?.toDate) {
    date = dateInput.toDate();
  } else if (typeof dateInput?.seconds === 'number') {
    date = new Date(dateInput.seconds * 1000);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffMs = now - date;            // >0 = past, <0 = future
  const absMs = Math.abs(diffMs);

  const MS_MIN = 60 * 1000;
  const MS_HOUR = 60 * MS_MIN;
  const MS_DAY = 24 * MS_HOUR;

  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // Past
  if (diffMs > 0) {
    if (absMs < MS_MIN) return 'Just now';
    if (absMs < MS_HOUR) {
      const mins = Math.floor(absMs / MS_MIN);
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (absMs < MS_DAY) {
      const hrs = Math.floor(absMs / MS_HOUR);
      return `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`;
    }
    const days = Math.floor(absMs / MS_DAY);
    if (days === 1) return `Yesterday at ${timeStr}`;
    if (days < 7) return `${days} days ago (${dateStr})`;
    return `${dateStr} at ${timeStr}`;
  }

  // Future
  if (diffMs < 0) {
    if (absMs < MS_MIN) return 'In a few seconds';
    if (absMs < MS_HOUR) {
      const mins = Math.ceil(absMs / MS_MIN);
      return `In ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }
    if (absMs < MS_DAY) {
      const hrs = Math.ceil(absMs / MS_HOUR);
      return `In ${hrs} ${hrs === 1 ? 'hour' : 'hours'}`;
    }
    const days = Math.ceil(absMs / MS_DAY);
    if (days === 1) return `In 1 day (${dateStr})`;
    if (days < 7) return `In ${days} days (${dateStr})`;
    return `${dateStr} at ${timeStr}`;
  }

  // Exact same millisecond (rare)
  return `Today at ${timeStr}`;
}


// Render advanced loading screen with animation + accessibility
function renderLoadingScreen(message = "Checking for updates...") {
  return `
    <div class="announcement-loading" 
         style="display:flex; align-items:center; justify-content:center; 
                height:100vh; background:#f8fafc; color:#334155; 
                font-family:system-ui, sans-serif; animation:fadeIn 0.4s ease;">
      <div class="loading-content" 
           style="text-align:center; padding:24px; border-radius:12px; 
                  background:white; box-shadow:0 4px 16px rgba(0,0,0,0.08); 
                  max-width:320px; width:100%;">
        
        <div class="loading-spinner" role="status" aria-label="Loading"
             style="margin:0 auto 16px; width:48px; height:48px; 
                    border:4px solid #e2e8f0; border-top-color:#3b82f6; 
                    border-radius:50%; animation:spin 1s linear infinite;">
        </div>

        <span class="loading-text" 
              style="display:block; font-size:15px; font-weight:500; color:#475569;">
          ${message}
        </span>

        <small style="display:block; margin-top:8px; color:#94a3b8; font-size:12px;">
          Please wait...
        </small>
      </div>
    </div>

    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes fadeIn {
        from { opacity:0; transform: scale(0.95); }
        to { opacity:1; transform: scale(1); }
      }
    </style>
  `;
}


// Render single announcement
function renderAnnouncement(announcement, currentIndex, totalCount, department) {
  const isLast = currentIndex === totalCount - 1;
  const progressDots = [];
  
  for (let i = 0; i < totalCount; i++) {
    progressDots.push(`<div class="progress-dot${i === currentIndex ? ' active' : ''}"></div>`);
  }

  const statusDisplay = announcement.status.replace(/_/g, ' ').toUpperCase();
  
  // Generate detailed information
  const detailedInfoHtml = generateDetailedInfo(announcement);

  return `
    <div class="announcement-modal-overlay" id="announcementModalOverlay">
      <div class="announcement-modal-content">
        <button class="announcement-close-btn" id="closeAnnouncementBtn" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>

        <div class="announcement-header">
          <div class="announcement-icon">
            <i class="fas fa-bell" style="font-size: 40px; color: white; position: relative; z-index: 1;"></i>
          </div>
          <h2 class="announcement-title">Important Updates</h2>
          <p class="announcement-subtitle">You have ${totalCount} notification${totalCount > 1 ? 's' : ''} requiring attention</p>
          <div class="announcement-dept-badge">
            <i class="fas fa-building"></i> ${department}
          </div>
        </div>

        <div class="announcement-body">
          <div class="announcement-item">
            <div class="announcement-item-header">
              <span class="announcement-source">
                <i class="fas fa-folder"></i>
                ${announcement.source}
              </span>
              <div class="announcement-badges">
                <span class="announcement-badge badge-status-${announcement.status.replace(/_/g, '-')}">${statusDisplay}</span>
                <span class="announcement-badge badge-priority-${announcement.priority}">${announcement.priority.toUpperCase()}</span>
              </div>
            </div>
            <div class="announcement-item-body">
              <div class="announcement-item-icon">
                ${ICONS[announcement.sourceKey]}
              </div>
              <div class="announcement-item-content">
                <h3>${announcement.title}</h3>
                <p>${announcement.description}</p>
                <div class="announcement-item-meta">
                  <div class="announcement-item-date">
                    <i class="fas fa-clock"></i>
                    <span>${formatDate(announcement.date)}</span>
                  </div>
                </div>
                ${detailedInfoHtml}
              </div>
            </div>
          </div>
        </div>

        <div class="announcement-progress">
          ${progressDots.join('')}
        </div>
        <div class="announcement-counter">
          <strong>${currentIndex + 1}</strong> of <strong>${totalCount}</strong>
        </div>

        <div class="announcement-footer">
          <button class="announcement-btn btn-skip" id="skipAllBtn">
            <i class="fas fa-forward"></i>
            Skip All
          </button>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn-nav" id="prevBtn" ${currentIndex === 0 ? 'disabled' : ''}>
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="announcement-btn btn-primary" id="nextBtn">
              <span>${isLast ? 'Got it!' : 'Next'}</span>
              ${isLast ? '<i class="fas fa-check"></i>' : '<i class="fas fa-chevron-right"></i>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Main function to show announcements
async function showAnnouncementModal(user) {
  // Validate user parameter
  if (!user || !user.department) {
    console.error('User object with department is required');
    if (window.Modal && window.Modal.show) {
      window.Modal.show('User information is required to display announcements', 'error');
    }
    return;
  }

  // Remove existing modal if any
  const existing = document.getElementById('announcementModalOverlay');
  if (existing) existing.remove();

  // Show loading
  document.body.insertAdjacentHTML('beforeend', renderLoadingScreen());
  const loading = document.querySelector('.announcement-loading');

  try {
    // Check databases
    const result = await checkAnnouncementDatabases(user);
    const announcements = result.announcements;
    const department = result.department;

    // Remove loading
    if (loading) loading.remove();

    // If no announcements, exit
    if (!announcements || announcements.length === 0) {
      console.log('No announcements to display for ' + user.department);
      return;
    }

    let currentIndex = 0;
    let isProcessing = false;

    function render() {
      const html = renderAnnouncement(
        announcements[currentIndex], 
        currentIndex, 
        announcements.length,
        department
      );
      
      // Remove previous modal
      const prev = document.getElementById('announcementModalOverlay');
      if (prev) prev.remove();
      
      // Insert new modal
      document.body.insertAdjacentHTML('beforeend', html);
      
      // Attach event listeners
      const overlay = document.getElementById('announcementModalOverlay');
      const closeBtn = document.getElementById('closeAnnouncementBtn');
      const skipBtn = document.getElementById('skipAllBtn');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');

      function close() {
        if (overlay) overlay.remove();
        document.removeEventListener('keydown', handleKeyboard);
      }

      function handleKeyboard(e) {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          currentIndex--;
          render();
        }
        if (e.key === 'ArrowRight' && currentIndex < announcements.length - 1) {
          currentIndex++;
          render();
        }
      }

      closeBtn.addEventListener('click', close);
      skipBtn.addEventListener('click', close);
      
      prevBtn.addEventListener('click', function() {
        if (currentIndex > 0 && !isProcessing) {
          currentIndex--;
          render();
        }
      });

      nextBtn.addEventListener('click', function() {
        if (!isProcessing) {
          if (currentIndex < announcements.length - 1) {
            currentIndex++;
            render();
          } else {
            close();
          }
        }
      });

      // Progress dots navigation
      const progressDots = overlay.querySelectorAll('.progress-dot');
      progressDots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
          if (!isProcessing && index !== currentIndex) {
            currentIndex = index;
            render();
          }
        });
      });

      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) close();
      });

      document.addEventListener('keydown', handleKeyboard);
    }

    render();

  } catch (error) {
    console.error('Error showing announcements:', error);
    if (loading) loading.remove();
    
    if (window.Modal && window.Modal.show) {
      window.Modal.show('Error loading announcements: ' + error.message, 'error');
    }
  }
}

// Expose globally
window.showAnnouncementModal = showAnnouncementModal;
window.checkAnnouncementDatabases = checkAnnouncementDatabases;

console.log('Advanced Department-Based Announcement Modal System loaded.');
console.log('Usage: showAnnouncementModal(userObject)');
console.log('Example: showAnnouncementModal({ firstName: "John", lastName: "Doe", department: "IT", username: "jdoe", email: "john@example.com" })');

// Example auto-load on page ready (if user is already logged in)
// Uncomment this if you want to auto-show on page load
/*
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in (adjust this based on your auth system)
  if (window.currentUser && window.currentUser.department) {
    showAnnouncementModal(window.currentUser);
  }
});
*/