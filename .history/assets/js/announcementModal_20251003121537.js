/**
 * Advanced Announcement Modal System for Firebase
 * Pure RenderJS implementation with Firebase Firestore integration
 */

// Firebase Database checking function
function checkFirebaseDatabases(userId) {
  return new RSVP.Queue()
    .push(function() {
      const db = firebase.firestore();
      const announcements = [];
      
      // Define status conditions for each collection
      const collections = {
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
      
      // Fetch all collections in parallel
      const promises = Object.keys(collections).map(function(collectionName) {
        const config = collections[collectionName];
        
        return db.collection(collectionName)
          .where('userId', '==', userId)
          .where(config.statusField, 'in', config.showStatuses)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
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
                date: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
                rawData: data
              });
            });
          });
      });
      
      return RSVP.all(promises).then(function() {
        // Sort by priority and date
        announcements.sort(function(a, b) {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          
          if (priorityDiff !== 0) return priorityDiff;
          
          // If same priority, sort by date (newest first)
          return new Date(b.date) - new Date(a.date);
        });
        
        return announcements;
      });
    });
}

// Generate title based on collection and data
function generateTitle(collectionName, data) {
  const titles = {
    accomplishments: function(d) {
      return (d.accomplishmentType || 'Accomplishment') + ' - ' + (d.status || 'Pending').toUpperCase();
    },
    early_rest_requests: function(d) {
      return 'Early Rest Request for ' + (d.requestDate ? formatDate(d.requestDate.toDate().toISOString()) : 'N/A');
    },
    it_service_orders: function(d) {
      return 'IT Service Order #' + (d.orderNumber || data.id || 'N/A');
    },
    travel_orders: function(d) {
      return 'Travel Order to ' + (d.destination || 'N/A');
    }
  };
  
  return titles[collectionName] ? titles[collectionName](data) : 'Notification';
}

// Generate description based on collection and data
function generateDescription(collectionName, data) {
  const descriptions = {
    accomplishments: function(d) {
      if (d.status === 'pending') return 'Your accomplishment report is awaiting review';
      if (d.status === 'under_review') return 'Your accomplishment is currently being reviewed';
      if (d.status === 'needs_revision') return 'Your accomplishment requires revisions';
      return 'Status: ' + (d.status || 'Unknown');
    },
    early_rest_requests: function(d) {
      if (d.status === 'pending') return 'Your early rest request is pending approval';
      if (d.status === 'approved') return 'Your early rest request has been approved';
      if (d.status === 'for_approval') return 'Your request is ready for final approval';
      return 'Status: ' + (d.status || 'Unknown');
    },
    it_service_orders: function(d) {
      if (d.status === 'pending') return 'Your IT service request is pending assignment';
      if (d.status === 'in_progress') return 'Your ' + (d.serviceType || 'service') + ' is currently in progress';
      if (d.status === 'for_pickup') return 'Your item is ready for pickup';
      if (d.status === 'waiting_parts') return 'Waiting for parts to arrive';
      return 'Status: ' + (d.status || 'Unknown');
    },
    travel_orders: function(d) {
      if (d.status === 'pending') return 'Your travel authorization is pending approval';
      if (d.status === 'approved') return 'Your travel order has been approved';
      if (d.status === 'for_approval') return 'Your travel order requires final approval';
      if (d.status === 'requires_action') return 'Action required on your travel order';
      return 'Status: ' + (d.status || 'Unknown');
    }
  };
  
  return descriptions[collectionName] ? descriptions[collectionName](data) : 'Please review this item';
}

// Determine priority based on status
function determinePriority(status) {
  const highPriority = ['requires_action', 'needs_revision', 'for_pickup', 'approved'];
  const mediumPriority = ['for_approval', 'in_progress', 'under_review'];
  
  if (highPriority.indexOf(status) !== -1) return 'high';
  if (mediumPriority.indexOf(status) !== -1) return 'medium';
  return 'low';
}

// Icon mapping
function getIcon(sourceKey) {
  const icons = {
    accomplishments: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    clients: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    early_rest_requests: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    it_service_orders: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    travel_orders: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>'
  };
  return icons[sourceKey] || icons.accomplishments;
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

// Render loading HTML
function renderLoading() {
  return '<div class="announcement-loading">' +
    '<div class="loading-spinner"></div>' +
    '<span>Checking for updates...</span>' +
    '</div>';
}

// Render single announcement
function renderAnnouncement(announcement, currentIndex, totalCount) {
  const isLast = currentIndex === totalCount - 1;
  const progressDots = [];
  
  for (let i = 0; i < totalCount; i++) {
    progressDots.push(
      '<div class="progress-dot' + (i === currentIndex ? ' active' : '') + '"></div>'
    );
  }

  // Format status for display
  const statusDisplay = announcement.status.replace(/_/g, ' ').toUpperCase();

  return '<div class="announcement-modal-overlay">' +
    '<div class="announcement-modal">' +
    
    // Header
    '<div class="announcement-header">' +
    '<div class="header-content">' +
    '<div class="header-top">' +
    '<div class="header-title">' +
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>' +
    '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>' +
    '</svg>' +
    '<h2>Important Updates</h2>' +
    '</div>' +
    '<button class="close-btn" data-action="close">' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<line x1="18" y1="6" x2="6" y2="18"></line>' +
    '<line x1="6" y1="6" x2="18" y2="18"></line>' +
    '</svg>' +
    '</button>' +
    '</div>' +
    '<div class="header-subtitle">You have ' + totalCount + ' notification' + (totalCount > 1 ? 's' : '') + ' that require your attention</div>' +
    '</div>' +
    '</div>' +
    
    // Body
    '<div class="announcement-body">' +
    '<div class="announcement-meta">' +
    '<span class="source-label">' + announcement.source + '</span>' +
    '<div class="badge-group">' +
    '<span class="badge badge-status-' + announcement.status.replace(/_/g, '-') + '">' + statusDisplay + '</span>' +
    '<span class="badge badge-priority-' + announcement.priority + '">' + announcement.priority.toUpperCase() + '</span>' +
    '</div>' +
    '</div>' +
    
    '<div class="announcement-content">' +
    '<div class="icon-container">' + getIcon(announcement.sourceKey) + '</div>' +
    '<div class="text-content">' +
    '<h3>' + announcement.title + '</h3>' +
    '<p>' + announcement.description + '</p>' +
    '<div class="date-info">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<circle cx="12" cy="12" r="10"></circle>' +
    '<polyline points="12 6 12 12 16 14"></polyline>' +
    '</svg>' +
    '<span>' + formatDate(announcement.date) + '</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    
    '<div class="progress-indicator">' + progressDots.join('') + '</div>' +
    '<div class="counter">' + (currentIndex + 1) + ' of ' + totalCount + '</div>' +
    '</div>' +
    
    // Footer
    '<div class="announcement-footer">' +
    '<button class="btn-skip" data-action="skip">Skip All</button>' +
    '<div class="nav-controls">' +
    '<button class="btn-nav" data-action="previous"' + (currentIndex === 0 ? ' disabled' : '') + '>' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<polyline points="15 18 9 12 15 6"></polyline>' +
    '</svg>' +
    '</button>' +
    '<button class="btn-primary" data-action="' + (isLast ? 'close' : 'next') + '">' +
    '<span>' + (isLast ? 'Got it!' : 'Next') + '</span>' +
    (isLast ? '' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>') +
    '</button>' +
    '</div>' +
    '</div>' +
    
    '</div>' +
    '</div>';
}

// Main render function with Firebase integration
function renderAnnouncementModal(userId) {
  const gadget = this;
  let currentIndex = 0;
  let announcements = [];

  return gadget.getDeclaredGadget('announcement_container')
    .push(function(container) {
      // Show loading
      return container.changeState({
        html: renderLoading()
      });
    })
    .push(function() {
      // Check Firebase databases
      return checkFirebaseDatabases(userId);
    })
    .push(function(data) {
      announcements = data;
      
      if (announcements.length === 0) {
        return gadget.getDeclaredGadget('announcement_container')
          .push(function(container) {
            return container.changeState({ html: '' });
          });
      }
      
      // Render first announcement
      return renderAndSetupHandlers();
    });

  function renderAndSetupHandlers() {
    const html = renderAnnouncement(announcements[currentIndex], currentIndex, announcements.length);
    
    return gadget.getDeclaredGadget('announcement_container')
      .push(function(container) {
        return container.changeState({ html: html });
      })
      .push(function() {
        // Setup event handlers
        const overlay = document.querySelector('.announcement-modal-overlay');
        if (!overlay) return;
        
        overlay.addEventListener('click', function(e) {
          const action = e.target.closest('[data-action]');
          if (!action) return;
          
          const actionType = action.dataset.action;
          
          if (actionType === 'close' || actionType === 'skip') {
            overlay.remove();
          } else if (actionType === 'next') {
            if (currentIndex < announcements.length - 1) {
              currentIndex++;
              renderAndSetupHandlers();
            }
          } else if (actionType === 'previous') {
            if (currentIndex > 0) {
              currentIndex--;
              renderAndSetupHandlers();
            }
          }
        });
      });
  }
}

// Inject CSS styles on load
function injectStyles() {
  if (document.getElementById('announcement-modal-styles')) return;
  
  const styleEl = document.createElement('style');
  styleEl.id = 'announcement-modal-styles';
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

// CSS Styles
const styles = `
.announcement-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.announcement-modal {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 42rem;
  width: 100%;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.announcement-header {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  padding: 1.5rem;
  color: white;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
}

.announcement-body {
  padding: 1.5rem;
}

.announcement-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.source-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-group {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-status-pending { background: #fef3c7; color: #92400e; }
.badge-status-approved { background: #d1fae5; color: #065f46; }
.badge-status-for-approval { background: #dbeafe; color: #1e40af; }
.badge-status-in-progress { background: #e9d5ff; color: #6b21a8; }
.badge-status-under-review { background: #fef3c7; color: #92400e; }
.badge-status-needs-revision { background: #fee2e2; color: #991b1b; }
.badge-status-for-pickup { background: #d1fae5; color: #065f46; }
.badge-status-waiting-parts { background: #fed7aa; color: #92400e; }
.badge-status-requires-action { background: #fee2e2; color: #991b1b; }

.badge-priority-high { background: #fee2e2; color: #991b1b; }
.badge-priority-medium { background: #fef3c7; color: #92400e; }
.badge-priority-low { background: #d1fae5; color: #065f46; }

.announcement-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.icon-container {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container svg {
  color: #2563eb;
}

.text-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.text-content p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.progress-dot {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: #d1d5db;
  transition: all 0.3s;
}

.progress-dot.active {
  width: 2rem;
  background: #2563eb;
}

.counter {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.announcement-footer {
  background: #f9fafb;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-skip {
  background: transparent;
  border: none;
  color: #4b5563;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-skip:hover {
  color: #111827;
}

.nav-controls {
  display: flex;
  gap: 0.5rem;
}

.btn-nav {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-nav:not(:disabled):hover {
  background: #e5e7eb;
}

.btn-nav:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.announcement-loading {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 9999;
  color: white;
  font-weight: 500;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

// Usage example:
/*
(function(window, rJS, RSVP) {
  'use strict';
  
  rJS(window)
    .declareGadget('announcement_container.html')
    .declareMethod('render', function() {
      var userId = this.state.user_id; // Get current user ID
      return renderAnnouncementModal.call(this, userId);
    });
    
}(window, rJS, RSVP));
*/

// Auto-inject styles on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
}

// Expose globally
(function(window) {
  'use strict';
  
  window.AnnouncementModal = {
    render: renderAnnouncementModal,
    checkDatabases: checkFirebaseDatabases,
    injectStyles: injectStyles
  };
  
  // Initialize styles
  injectStyles();
  
}(window));