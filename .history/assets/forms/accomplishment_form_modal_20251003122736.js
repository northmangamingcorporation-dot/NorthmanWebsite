/**
 * Advanced Announcement Modal System for Firebase
 * No RenderJS - Pure JavaScript with inline styles
 * For managerial purposes - checks all pending items across collections
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
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes logoFloat {
      0% { transform: translateY(20px) scale(0.9); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .announcement-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1001;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
      overflow: auto;
    }

    .announcement-modal-content {
      background: linear-gradient(145deg, #ffffff, #eff6ff);
      border-radius: 20px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 40px;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.3);
      border: 1px solid rgba(59, 130, 246, 0.2);
      transform: translateY(20px);
      animation: slideIn 0.4s ease forwards;
    }

    .announcement-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border: none;
      background: rgba(100, 116, 139, 0.1);
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      color: #64748b;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .announcement-close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .announcement-header {
      text-align: center;
      margin-bottom: 32px;
      animation: logoFloat 0.6s ease forwards;
    }

    .announcement-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
    }

    .announcement-title {
      margin: 0 0 8px 0;
      color: #0f172a;
      font-weight: 700;
      font-size: 28px;
      background: linear-gradient(135deg, #0f172a, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .announcement-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 16px;
      font-weight: 500;
    }

    .announcement-body {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .announcement-item {
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
      transition: all 0.2s ease;
    }

    .announcement-item:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .announcement-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .announcement-source {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .announcement-badges {
      display: flex;
      gap: 8px;
    }

    .announcement-badge {
      padding: 4px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge-status-pending { background: #fef3c7; color: #92400e; }
    .badge-status-approved { background: #d1fae5; color: #065f46; }
    .badge-status-for-approval { background: #dbeafe; color: #1e40af; }
    .badge-status-in-progress { background: #e9d5ff; color: #6b21a8; }
    .badge-status-under-review { background: #fef3c7; color: #92400e; }
    .badge-status-needs-revision { background: #fee2e2; color: #991b1b; }

    .badge-priority-high { background: #fee2e2; color: #991b1b; }
    .badge-priority-medium { background: #fef3c7; color: #92400e; }
    .badge-priority-low { background: #d1fae5; color: #065f46; }

    .announcement-item-body {
      display: flex;
      gap: 16px;
    }

    .announcement-item-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      background: #dbeafe;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .announcement-item-content h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .announcement-item-content p {
      margin: 0 0 8px 0;
      color: #475569;
      line-height: 1.5;
      font-size: 14px;
    }

    .announcement-item-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #6b7280;
    }

    .announcement-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 24px 0 16px 0;
    }

    .progress-dot {
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background: #cbd5e1;
      transition: all 0.3s;
    }

    .progress-dot.active {
      width: 24px;
      border-radius: 4px;
      background: #3b82f6;
    }

    .announcement-counter {
      text-align: center;
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .announcement-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .announcement-btn {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-skip {
      border: 2px solid #6b7280;
      background: transparent;
      color: #6b7280;
    }

    .btn-skip:hover {
      background: rgba(107, 114, 128, 0.1);
      transform: translateY(-2px);
    }

    .btn-nav {
      padding: 8px;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #6b7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-nav:hover {
      background: #e5e7eb;
    }

    .btn-nav:disabled {
      color: #d1d5db;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .announcement-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    .loading-content {
      background: white;
      padding: 32px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @media (max-width: 768px) {
      .announcement-modal-content {
        padding: 24px 20px;
        margin: 16px;
      }
      
      .announcement-title {
        font-size: 24px;
      }
      
      .announcement-footer {
        flex-direction: column;
        gap: 12px;
      }
      
      .announcement-btn {
        width: 100%;
        justify-content: center;
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
  travel_orders: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>'
};

// Collection configurations
const COLLECTIONS = {
  accomplishments: {
    statusField: 'status',
    showStatuses: ['pending', 'under_review', 'needs_revision'],
    name: 'ACCOMPLISHMENTS',
    icon: 'accomplishments'
  },
  early_rest_requests: {
    statusField: 'status',
    showStatuses: ['pending', 'approved', 'for_approval'],
    name: 'EARLY REST REQUESTS',
    icon: 'early_rest_requests'
  },
  it_service_orders: {
    statusField: 'status',
    showStatuses: ['pending', 'in_progress', 'for_pickup', 'waiting_parts'],
    name: 'IT SERVICE ORDERS',
    icon: 'it_service_orders'
  },
  travel_orders: {
    statusField: 'status',
    showStatuses: ['pending', 'approved', 'for_approval', 'requires_action'],
    name: 'TRAVEL ORDERS',
    icon: 'travel_orders'
  }
};

// Check Firebase databases
async function checkAnnouncementDatabases() {
  if (!window.db) {
    throw new Error('Firebase not initialized');
  }

  const announcements = [];
  
  const promises = Object.keys(COLLECTIONS).map(async function(collectionName) {
    const config = COLLECTIONS[collectionName];
    
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
  
  return announcements;
}

// Generate title
function generateTitle(collectionName, data) {
  const titles = {
    accomplishments: function(d) {
      return (d.accomplishmentType || 'Accomplishment') + ' Report';
    },
    early_rest_requests: function(d) {
      return 'Early Rest Request';
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
      if (d.status === 'pending') return 'Accomplishment report awaiting review';
      if (d.status === 'under_review') return 'Accomplishment currently being reviewed';
      if (d.status === 'needs_revision') return 'Accomplishment requires revisions';
      return 'Status: ' + (d.status || 'Unknown');
    },
    early_rest_requests: function(d) {
      if (d.status === 'pending') return 'Early rest request pending approval';
      if (d.status === 'approved') return 'Early rest request has been approved';
      if (d.status === 'for_approval') return 'Request ready for final approval';
      return 'Status: ' + (d.status || 'Unknown');
    },
    it_service_orders: function(d) {
      if (d.status === 'pending') return 'IT service request pending assignment';
      if (d.status === 'in_progress') return 'Service currently in progress';
      if (d.status === 'for_pickup') return 'Item ready for pickup';
      if (d.status === 'waiting_parts') return 'Waiting for parts to arrive';
      return 'Status: ' + (d.status || 'Unknown');
    },
    travel_orders: function(d) {
      if (d.status === 'pending') return 'Travel authorization pending approval';
      if (d.status === 'approved') return 'Travel order has been approved';
      if (d.status === 'for_approval') return 'Travel order requires final approval';
      if (d.status === 'requires_action') return 'Action required on travel order';
      return 'Status: ' + (d.status || 'Unknown');
    }
  };
  
  return descriptions[collectionName] ? descriptions[collectionName](data) : 'Please review this item';
}

// Determine priority
function determinePriority(status) {
  const highPriority = ['requires_action', 'needs_revision', 'for_pickup', 'approved'];
  const mediumPriority = ['for_approval', 'in_progress', 'under_review'];
  
  if (highPriority.indexOf(status) !== -1) return 'high';
  if (mediumPriority.indexOf(status) !== -1) return 'medium';
  return 'low';
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Render loading screen
function renderLoadingScreen() {
  return `
    <div class="announcement-loading">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <span style="color: #374151; font-weight: 500;">Checking for updates...</span>
      </div>
    </div>
  `;
}

// Render single announcement
function renderAnnouncement(announcement, currentIndex, totalCount) {
  const isLast = currentIndex === totalCount - 1;
  const progressDots = [];
  
  for (let i = 0; i < totalCount; i++) {
    progressDots.push(`<div class="progress-dot${i === currentIndex ? ' active' : ''}"></div>`);
  }

  const statusDisplay = announcement.status.replace(/_/g, ' ').toUpperCase();

  return `
    <div class="announcement-modal-overlay" id="announcementModalOverlay">
      <div class="announcement-modal-content">
        <button class="announcement-close-btn" id="closeAnnouncementBtn" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>

        <div class="announcement-header">
          <div class="announcement-icon">
            <i class="fas fa-bell" style="font-size: 36px; color: white;"></i>
          </div>
          <h2 class="announcement-title">Important Updates</h2>
          <p class="announcement-subtitle">You have ${totalCount} notification${totalCount > 1 ? 's' : ''} requiring attention</p>
        </div>

        <div class="announcement-body">
          <div class="announcement-item">
            <div class="announcement-item-header">
              <span class="announcement-source">${announcement.source}</span>
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
                <div class="announcement-item-date">
                  <i class="fas fa-calendar-alt"></i>
                  <span>${formatDate(announcement.date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="announcement-progress">
          ${progressDots.join('')}
        </div>
        <div class="announcement-counter">${currentIndex + 1} of ${totalCount}</div>

        <div class="announcement-footer">
          <button class="announcement-btn btn-skip" id="skipAllBtn">
            <i class="fas fa-times"></i>
            Skip All
          </button>
          <div style="display: flex; gap: 8px;">
            <button class="btn-nav" id="prevBtn" ${currentIndex === 0 ? 'disabled' : ''}>
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="announcement-btn btn-primary" id="nextBtn">
              <span>${isLast ? 'Got it!' : 'Next'}</span>
              ${isLast ? '' : '<i class="fas fa-chevron-right"></i>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Main function to show announcements
async function showAnnouncementModal() {
  // Remove existing modal if any
  const existing = document.getElementById('announcementModalOverlay');
  if (existing) existing.remove();

  // Show loading
  document.body.insertAdjacentHTML('beforeend', renderLoadingScreen());
  const loading = document.querySelector('.announcement-loading');

  try {
    // Check databases
    const announcements = await checkAnnouncementDatabases();

    // Remove loading
    if (loading) loading.remove();

    // If no announcements, exit
    if (!announcements || announcements.length === 0) {
      console.log('No announcements to display');
      return;
    }

    let currentIndex = 0;

    function render() {
      const html = renderAnnouncement(announcements[currentIndex], currentIndex, announcements.length);
      
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
        document.removeEventListener('keydown', handleEscape);
      }

      function handleEscape(e) {
        if (e.key === 'Escape') close();
      }

      closeBtn.addEventListener('click', close);
      skipBtn.addEventListener('click', close);
      
      prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
          currentIndex--;
          render();
        }
      });

      nextBtn.addEventListener('click', function() {
        if (currentIndex < announcements.length - 1) {
          currentIndex++;
          render();
        } else {
          close();
        }
      });

      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) close();
      });

      document.addEventListener('keydown', handleEscape);
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

// Auto-show on load if needed (optional - comment out if you want manual trigger)
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', showAnnouncementModal);
// } else {
//   showAnnouncementModal();
// }

console.log('Announcement Modal System loaded. Call showAnnouncementModal() to display.');