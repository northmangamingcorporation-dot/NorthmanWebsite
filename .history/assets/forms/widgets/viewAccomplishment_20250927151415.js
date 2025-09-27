// DYNAMIC SELF-CONTAINED: Mount, Render, and Attach functions for Accomplishment Modal
// Refactored to match structure of IT Service Order Modal (assuming polished, draggable, zoomable design with previews)
// Enhancements: Image previews with thumbnails, zoom on click (lightbox-style), full modal drag via header
// Standalone Version: Graceful degradation if Firestore or TelegramConnect unavailable; fixed bugs (e.g., undefined photoCount);
// UPDATED: mountAccomplishmentModal(id) now follows mountLogin pattern: async fetch (or use pre-fetched), remove existing modal,
//          insert full modal HTML via renderAccomplishmentModal (returns complete overlay HTML), then attach events.
//          Call directly on click: mountAccomplishmentModal('some-id'). Handles everything in one call.
//          Optional pre-fetched data supported for testing/offline use (skips fetch).
// FORMAL DESIGN UPDATE: Restructured layout for a more professional, report-like appearance.
// - Solid navy header (no gradient) with formal typography.
// - Content organized into logical SECTIONS based on field nature (e.g., "Report Summary", "Accomplishment Details", "Personnel Information", "Additional Details").
//   - Fixed fields (Description, Date, Status) in "Report Summary" table.
//   - Dynamic fields categorized by keywords in field names (e.g., 'employee'/'user' → Personnel; 'date'/'time' → Timeline; 'service'/'task' → Details; others → Additional).
//   - Each section uses a bordered card with heading for clarity.
// - Status as a subtle badge with neutral colors.
// - Photo section relabeled "Attached Evidence" with formal captioning and ZOOM ICON (magnifying glass on hover for emphasis).
// ENHANCED ZOOM: Lightbox now supports interactive zoom (mouse wheel/pinch) and drag-to-pan (anywhere on the photo when zoomed).
//   - Zoom levels: 1x to 4x (wheel up/down or pinch).
//   - Pan: Drag the image when zoomed >1x.
//   - Touch/mobile support: Pinch zoom + drag pan.
//   - Resets on new image or close.
// FIXED: Scope issue with lightbox state (moved to closure/outer scope for reuse across photos without recreation errors).
// PHOTO PREVIEW FIXES: 
// - Added robust validation for photo objects (ensure url exists; skip invalid photos).
// - Improved thumbnail fallback: If no 'thumbnail', use full 'url' as thumb (with object-fit: cover for sizing).
// - Added console logs for debugging photo loading/fetching.
// - Enhanced onerror handling: Better placeholder SVG; log errors.
// - If photos array is empty/undefined, show clear "No evidence" message without errors.
// - Ensured data-full-src only set if valid URL; skip items without fullSrc to prevent broken clicks.
// - Gallery now filters valid photos only (prevents empty or broken items from rendering).

// Enhanced mount function with better error handling (async, like mountLogin but with data fetching)
async function mountAccomplishmentModal(id, optionalPreFetchedData = null) {
  try {
    // Standalone: Allow passing data directly for testing or if db unavailable
    let mountedData = null;
    if (optionalPreFetchedData) {
      console.log('Using pre-fetched data for standalone mode');
      mountedData = {
        data: optionalPreFetchedData.data || optionalPreFetchedData,
        photos: optionalPreFetchedData.photos || [],
        id: optionalPreFetchedData.id || id
      };
    } else {
      // Fetch data if not pre-fetched
      if (!id) {
        throw new Error('Invalid ID provided');
      }

      if (!window.db) {
        throw new Error('Database not available. For standalone testing, pass pre-fetched data as second argument.');
      }

      // Remove any existing dynamic modal (prevent stacking)
      const existingModal = document.querySelector('.dynamic-accomplishment-modal');
      if (existingModal) {
        existingModal.remove();
      }

      console.log(`Loading details for accomplishment ID: ${id}`);
      
      // Step 1: Fetch full doc from Firestore
      const doc = await window.db.collection('accomplishments').doc(id).get();
      if (!doc.exists) {
        throw new Error('Report not found.');
      }
      const data = doc.data();
      console.log('Fetched data:', data);  // Debug

      // Step 2: Fetch Telegram photos if available (non-blocking) - FIXED: Better error handling and logging
      let photos = [];
      if (window.TelegramConnect && typeof window.TelegramConnect.getDataById === 'function') {
        try {
          photos = await window.TelegramConnect.getDataById(id);
          console.log(`Retrieved ${photos ? photos.length : 0} photos for ID: ${id}`, photos);  // Debug: Log actual array
          // Filter valid photos (must have url)
          photos = (photos || []).filter(photo => photo && photo.url && typeof photo.url === 'string');
          console.log(`Filtered to ${photos.length} valid photos (with URL)`);
        } catch (photoErr) {
          console.error('Failed to retrieve Telegram photos:', photoErr);
          photos = [];  // Fallback: No photos shown
        }
      } else {
        // Standalone: Warn only if TelegramConnect is expected but missing
        console.warn('TelegramConnect not available - photos cannot be retrieved. Pass photos in pre-fetched data for standalone use.');
      }

      mountedData = { data, photos, id };
    }

    // Remove any existing dynamic modal (prevent stacking, even for pre-fetched)
    const existingModal = document.querySelector('.dynamic-accomplishment-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Generate and insert full modal HTML (complete overlay structure)
    const fullModalHTML = renderAccomplishmentModal(mountedData);
    document.body.insertAdjacentHTML("beforeend", fullModalHTML);
    
    // Attach event listeners and animations
    attachAccomplishmentModal();
    
    // Add additional CSS for fadeOut animation (like mountLogin)
    if (!document.querySelector('#accomplishment-modal-animations')) {
      const style = document.createElement("style");
      style.id = 'accomplishment-modal-animations';
      style.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9) translateY(-20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    console.log('Accomplishment modal mounted and attached successfully');
    
  } catch (error) {
    console.error("Error mounting accomplishment modal:", error);
    const errorMsg = error.message || 'Failed to load report details.';
    if (window.Modal && window.Modal.show) {
      window.Modal.show(`Error: ${errorMsg}. For standalone testing, pass mock data as second argument.`, 'error');
    } else {
      alert(`Error: ${errorMsg}. For standalone testing, pass mock data as second argument.`);
    }
  }
}

// Function to render the full modal HTML (complete overlay + box + content, inserted directly like renderLoginModal)
function renderAccomplishmentModal(mountedData) {
  if (!mountedData) return '';

  const { data, photos, id } = mountedData;

  // Helper to categorize fields by nature (keyword-based sections)
  function categorizeFields(entries) {
    const sections = {
      summary: [],  // Fixed: Description, Date, Status
      details: [],  // Service/Task-related
      personnel: [],  // Employee/User-related
      timeline: [],  // Date/Time-related
      additional: []  // Others
    };

    // Fixed summary fields
    sections.summary = [
      { key: 'Description of Service', value: data.descriptionOfService || 'N/A' },
      { key: 'Date Submitted', value: data.dateSubmitted ? (data.dateSubmitted.toDate ? data.dateSubmitted.toDate().toLocaleString() : new Date(data.dateSubmitted).toLocaleString()) : 'N/A' },
      { key: 'Status', value: data.status || 'Submitted' }
    ];

    // Dynamic fields categorization
    entries.filter(([key]) => !['id', 'uniquekey', 'status', 'dateSubmitted', 'updatedAt', 'telegramPhotos', 'descriptionOfService'].includes(key))
      .forEach(([key, value]) => {
        const formalLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
        const val = (value && typeof value.toDate === 'function') ? value.toDate().toLocaleString() : (value || 'N/A');
        const lowerKey = key.toLowerCase();

        if (lowerKey.includes('employee') || lowerKey.includes('user') || lowerKey.includes('name') || lowerKey.includes('department')) {
          sections.personnel.push({ key: formalLabel, value: val });
        } else if (lowerKey.includes('date') || lowerKey.includes('time') || lowerKey.includes('duration')) {
          sections.timeline.push({ key: formalLabel, value: val });
        } else if (lowerKey.includes('service') || lowerKey.includes('task') || lowerKey.includes('accomplish') || lowerKey.includes('project')) {
          sections.details.push({ key: formalLabel, value: val });
        } else {
          sections.additional.push({ key: formalLabel, value: val });
        }
      });

    return sections;
  }

  const fieldEntries = Object.entries(data);
  const sections = categorizeFields(fieldEntries);

  // Render section as a formal table
  function renderSectionTable(sectionTitle, fields) {
    if (fields.length === 0) return '';
    let rows = '';
    fields.forEach(({ key, value }) => {
      rows += `
        <tr>
          <td style="width: 30%; padding: 12px; background: #f8fafc; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; vertical-align: top;"><strong>${key}</strong></td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; color: #1f2937;">${(value || 'N/A').toString().replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    });
    return `
      <div style="margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="background: #f8fafc; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1e40af; font-size: 16px;">
          ${sectionTitle}
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tbody style="background: white;">${rows}</tbody>
        </table>
      </div>
    `;
  }

  // Enhanced content inner HTML (formal design: section-based layout for report-like structure)
  let contentHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; line-height: 1.5; color: #1f2937;">
      <!-- Formal Header -->
      <div style="background: #1e40af; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center; cursor: move; user-select: none; border-bottom: 3px solid #3b82f6;">
        <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Accomplishment Report</h2>
        <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">Report Identifier: <strong>${id}</strong></p>
      </div>
      
      <!-- Sectioned Data -->
      <div style="background: #ffffff; padding: 24px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        ${renderSectionTable('Report Summary', sections.summary)}
        ${sections.details.length > 0 ? renderSectionTable('Accomplishment Details', sections.details) : ''}
        ${sections.personnel.length > 0 ? renderSectionTable('Personnel Information', sections.personnel) : ''}
        ${sections.timeline.length > 0 ? renderSectionTable('Timeline', sections.timeline) : ''}
        ${sections.additional.length > 0 ? renderSectionTable('Additional Information', sections.additional) : ''}
      </div>
  `;

  // Formal Photo/Evidence Section with Zoom Icon - FIXED: Filter valid photos, better fallbacks, logging
  const validPhotos = (photos || []).filter(photo => photo && photo.url && typeof photo.url === 'string');
  console.log(`Rendering ${validPhotos.length} valid photos in gallery`);  // Debug
  if (validPhotos.length > 0) {
    contentHTML += `
      <div style="margin-top: 24px; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Attached Evidence (${validPhotos.length} Items)</h3>
        <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; font-style: italic;">Click any item below to open interactive viewer (zoom with wheel/pinch, drag to pan).</p>
        <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; justify-items: center;">
    `;
    validPhotos.slice(0, 12).forEach((photo, index) => {  // Limit to 12 for better layout
      const fullSrc = photo.url;  // Guaranteed valid
      const thumbSrc = photo.thumbnail || photo.url || '';  // Fallback to full if no thumb (will crop via object-fit)
      const caption = photo.caption ? photo.caption.substring(0, 60) + (photo.caption.length > 60 ? '...' : '') : `Evidence Item ${index + 1}`;
      console.log(`Photo ${index + 1}: thumb=${thumbSrc}, full=${fullSrc}`);  // Debug per photo
      contentHTML += `
        <div class="photo-preview-item" style="position: relative; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: box-shadow 0.2s; cursor: pointer;" data-full-src="${fullSrc}">
          <img src="${thumbSrc}" alt="Evidence Preview ${index + 1}" 
               style="width: 100%; height: 140px; object-fit: cover; display: block;"
               onerror="console.error('Thumbnail load failed for ${thumbSrc}'); this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV2aWRlbmNlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+'; this.onerror=null;">
          <!-- Zoom Icon Overlay (appears on hover) -->
          <div class="zoom-icon-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(30, 64, 175, 0.8); color: white; width: 40px; height: 40px; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; pointer-events: none;">
            🔍
          </div>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(30, 64, 175, 0.9); color: white; padding: 8px; font-size: 13px; text-align: center; font-weight: 500; pointer-events: none;">
            ${caption}
          </div>
        </div>
      `;
    });
    if (validPhotos.length > 12) {
      contentHTML += `<p style="text-align: center; color: #6b7280; margin-top: 16px; font-style: italic;">... and ${validPhotos.length - 12} additional items</p>`;
    }
    contentHTML += '</div></div>';
  } else {
    contentHTML += `
      <div style="text-align: center; padding: 24px; color: #6b7280; font-style: italic; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-top: 20px;">
        No evidence attached to this report.
      </div>
    `;
  }

  contentHTML += '</div>';

  // Full modal HTML structure (overlay + box, like renderLoginModal - ready for direct insertion)
  const fullModalHTML = `
        <div class="dynamic-accomplishment-modal" role="dialog" aria-modal="true" aria-labelledby="accomplishment-title" style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center;
      z-index: 10000; backdrop-filter: blur(5px); opacity: 0; transition: opacity 0.3s ease;
      padding: 20px; animation: fadeOut 0.3s ease-out;
    ">
      <div class="modal-box" style="
        background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        max-width: 90vw; max-height: 90vh; overflow-y: auto; position: relative;
        transform: scale(0.95) translateY(-10px); transition: all 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; max-width: 950px;
        animation: scaleIn 0.3s ease-out; border: 1px solid #e5e7eb;
      ">
        <button id="dynamic-close-btn" style="
          position: absolute; top: 12px; right: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 50%;
          font-size: 18px; cursor: pointer; color: #6b7280; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10;
        " aria-label="Close">&times;</button>
        <div id="accomplishment-title" style="cursor: move; user-select: none;">${contentHTML}</div>
        <div style="text-align: center; margin-top: 24px; padding: 20px; border-top: 1px solid #e5e7eb; background: #f9fafb;">
          <button id="dynamic-footer-close" style="
            background: #ef4444; color: white; border: none; padding: 12px 32px;
            border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.2s;
            letter-spacing: 0.5px; border: 1px solid #dc2626;
          ">Close Report</button>
        </div>
      </div>
    </div>
  `;

  return fullModalHTML;
}

// Function to attach event listeners (like attachLogin - targets inserted elements by ID/class, no params needed)
function attachAccomplishmentModal() {
  // Find the inserted modal elements
  const overlay = document.querySelector('.dynamic-accomplishment-modal');
  const modalBox = overlay?.querySelector('.modal-box');
  if (!overlay || !modalBox) {
    console.error('Modal elements not found - attachAccomplishmentModal called too early?');
    return;
  }

  // Animate in (override initial opacity/transform)
  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.animation = 'none';  // Remove fadeOut if present
    modalBox.style.transform = 'scale(1) translateY(0)';
    modalBox.style.animation = 'none';
  }, 10);

  // Inject enhanced styles (once, for gallery, drag, zoom like IT Service Order) - Updated for formal design, zoom icon, and interactive lightbox
  if (!document.querySelector('#dynamic-accomplishment-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-accomplishment-styles';
    style.textContent = `
      .photo-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; justify-items: center; }
      .photo-preview-item { transition: box-shadow 0.2s ease; position: relative; }
      .photo-preview-item:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.1); transform: scale(1.02); }
      .photo-preview-item:hover .zoom-icon-overlay { display: flex !important; opacity: 1; }
      .zoom-icon-overlay { 
        display: none; opacity: 0; transition: opacity 0.2s ease; pointer-events: none; 
      }
      #dynamic-close-btn:hover { background: #f3f4f6; color: #374151; transform: scale(1.05); border-color: #d1d5db; }
      #dynamic-footer-close:hover { background: #dc2626; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(239,68,68,0.2); }
      
      /* Enhanced Zoom Lightbox with Pan/Zoom - FIXED: Better cursors, transforms, and mobile support */
      .zoom-lightbox { 
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); 
        display: none; align-items: center; justify-content: center; z-index: 10001; 
        backdrop-filter: blur(8px); 
      }
      .zoom-lightbox .lightbox-container { 
        position: relative; width: 90%; height: 90%; overflow: hidden; border-radius: 6px; background: #000; 
        display: flex; align-items: center; justify-content: center; cursor: zoom-in; 
        will-change: transform; 
      }
      .zoom-lightbox .lightbox-img { 
        max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px; 
        box-shadow: 0 8px 25px rgba(0,0,0,0.3); border: 1px solid #e5e7eb; 
        transform-origin: center center; transition: transform 0.1s ease; cursor: zoom-in; 
        will-change: transform; 
      }
      .zoom-lightbox .lightbox-img.zoomed { cursor: grab; max-width: none; max-height: none; }
      .zoom-lightbox .lightbox-container.grabbing, .zoom-lightbox .lightbox-img.grabbing { cursor: grabbing !important; }
      .zoom-lightbox.active { display: flex !important; }
      .zoom-close { 
        position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.9); border: 1px solid #e5e7eb; 
        border-radius: 50%; color: #374151; font-size: 24px; cursor: pointer; width: 40px; height: 40px; 
        display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10; 
      }
      .zoom-close:hover { background: white; color: #1e40af; transform: scale(1.1); }
      .zoom-reset-btn { 
        position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
        background: rgba(255,255,255,0.9); border: 1px solid #e5e7eb; border-radius: 20px; 
        color: #374151; padding: 8px 16px; cursor: pointer; font-size: 14px; z-index: 10; 
        transition: all 0.2s; 
      }
      .zoom-reset-btn:hover { background: white; color: #1e40af; }
      
      /* Drag Functionality for Modal */
      .dragging { cursor: grabbing !important; }
      .dragging * { cursor: grabbing !important; user-select: none !important; }
      
      /* Formal table enhancements */
      .dynamic-accomplishment-modal table td { border-color: #e5e7eb !important; }
      .dynamic-accomplishment-modal table tr:nth-child(even) td { background: #fafbfc; }
      
      /* Section cards */
      .dynamic-accomplishment-modal div[style*="border: 1px solid #e5e7eb"][style*="margin-bottom: 24px"] {
        border-radius: 6px;
      }
      
      /* Lightbox no-select and pointer-events */
      .zoom-lightbox * { user-select: none !important; -webkit-user-select: none !important; }
      
      @media (max-width: 768px) { 
        .photo-gallery { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; } 
        .dynamic-accomplishment-modal { padding: 10px; } 
        .modal-box { max-width: 95vw; font-size: 14px; } 
        .dynamic-accomplishment-modal table { font-size: 14px; }
        /* Disable drag on mobile for usability */
        [style*="cursor: move"] { cursor: default !important; }
        .dynamic-accomplishment-modal table td { padding: 10px 8px; }
        .zoom-icon-overlay { width: 36px; height: 36px; font-size: 14px; }
        .zoom-lightbox .lightbox-container { width: 95%; height: 95%; }
        .lightbox-img { cursor: default !important; } /* Disable mouse cursor on touch devices */
      }
    `;
    document.head.appendChild(style);
  }

  // Event Listeners
  const closeBtn = overlay.querySelector('#dynamic-close-btn');
  const footerClose = overlay.querySelector('#dynamic-footer-close');
  const header = overlay.querySelector('#accomplishment-title > div[style*="1e40af"]');  // Updated selector for formal navy header

  // Unified close handlers (combines all cleanups to avoid nested overrides)
let lightbox = null;
let lightboxEscHandler = null;
let originalScrollY = window.scrollY;
// FIXED: Declare as 'let' to allow reassignment for lightbox override
let closeModal = () => {
  // Animate out (using fadeOut and scale)
  overlay.style.opacity = '0';
  overlay.style.animation = 'fadeOut 0.3s ease-out';
  modalBox.style.transform = 'scale(0.95) translateY(-10px)';
  setTimeout(() => {
    overlay.remove();
    // Cleanup lightbox if exists
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.remove();
      lightbox = null;
    }
    // Remove ESC handler if added
    if (lightboxEscHandler) {
      document.removeEventListener('keydown', lightboxEscHandler);
      lightboxEscHandler = null;
    }
    // Restore body scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, originalScrollY);
  }, 300);
  // Remove modal ESC handler
  document.removeEventListener('keydown', modalEscHandler);
};

// Modal ESC key
const modalEscHandler = (e) => {
  if (e.key === 'Escape') closeModal();
};
document.addEventListener('keydown', modalEscHandler);
closeBtn.addEventListener('click', closeModal);
footerClose.addEventListener('click', closeModal);
// Close on overlay click (outside content)
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

  // Drag Functionality (make header draggable like IT Service Order)
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  const makeDraggable = (elem) => {
    if (!elem) return;  // Safety check

    elem.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'IMG') return;  // Don't drag on buttons/images
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = modalBox.offsetLeft;
      initialTop = modalBox.offsetTop;
      modalBox.classList.add('dragging');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      modalBox.style.left = (initialLeft + dx) + 'px';
      modalBox.style.top = (initialTop + dy) + 'px';
      modalBox.style.transform = 'none';  // Override scale for drag
      modalBox.style.position = 'absolute';
      overlay.style.justifyContent = 'flex-start';
      overlay.style.alignItems = 'flex-start';
    }

    function onMouseUp() {
      isDragging = false;
      modalBox.classList.remove('dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  };

  // Apply drag to the header if it exists
  if (header) {
    makeDraggable(header);
  }

  // FIXED: Create or reuse lightbox with re-attachment of events for robustness (prevents stale bindings on reuse)
  lightbox = document.querySelector('.zoom-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'zoom-lightbox';
    lightbox.innerHTML = `
      <button class="zoom-close" aria-label="Close zoom">&times;</button>
      <button class="zoom-reset-btn" aria-label="Reset zoom">Reset View</button>
      <div class="lightbox-container">
        <img class="lightbox-img" src="" alt="Zoomed evidence">
      </div>
    `;
    document.body.appendChild(lightbox);
    console.log('Lightbox created successfully');
  } else {
    console.log('Reusing existing lightbox - re-attaching events');
  }

  // FIXED: Always re-attach lightbox events (even on reuse) to ensure fresh state and bindings
  const container = lightbox.querySelector('.lightbox-container');
  const img = lightbox.querySelector('.lightbox-img');
  const resetBtn = lightbox.querySelector('.zoom-reset-btn');
  const closeBtnLightbox = lightbox.querySelector('.zoom-close');

  // State variables (redefine for fresh state on each attach - FIXED scoping)
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isPanning = false;
  let startPanX, startPanY, startTranslateX, startTranslateY;
  let lastTouchDistance = 0;
  let touchStart = null;
  let wheelTimeout = null;  // For debouncing wheel events

  // FIXED Reset function: Comprehensive with logs and cursor fix
  const resetZoom = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    img.style.transform = 'scale(1) translate(0px, 0px)';
    img.classList.remove('zoomed', 'grabbing');
    container.classList.remove('grabbing');
    container.style.cursor = 'zoom-in';
    console.log('Zoom reset to 1x');
  };

  // FIXED Apply transform: With bounds checking to prevent over-pan
  const applyTransform = () => {
    // Bounds: Limit pan to container edges when zoomed
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const maxTranslateX = Math.max(0, (containerRect.width - imgRect.width * scale) / 2);
    const maxTranslateY = Math.max(0, (containerRect.height - imgRect.height * scale) / 2);
    translateX = Math.min(Math.max(translateX, -maxTranslateX), maxTranslateX);
    translateY = Math.min(Math.max(translateY, -maxTranslateY), maxTranslateY);

    img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    if (scale > 1) {
      img.classList.add('zoomed');
      container.style.cursor = 'grab';
    } else {
      img.classList.remove('zoomed');
      container.style.cursor = 'zoom-in';
    }
    console.log(`Transform applied: scale=${scale.toFixed(2)}, translate=(${translateX.toFixed(0)}, ${translateY.toFixed(0)})`);
  };

  // FIXED Mouse wheel zoom: Debounced, with preventDefault and stopPropagation
  const wheelHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wheelTimeout) clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale = Math.min(Math.max(scale * delta, 0.5), 4);  // Allow min 0.5x for better UX
      applyTransform();
      console.log(`Wheel zoom: ${delta > 1 ? 'in' : 'out'} to ${scale.toFixed(2)}`);
    }, 50);  // Debounce to prevent jitter
  };
  container.addEventListener('wheel', wheelHandler, { passive: false });

  // FIXED Mouse pan: With preventDefault, logs, and grabbing class
  const mouseDownHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (scale <= 1) return;
    isPanning = true;
    startPanX = e.clientX;
    startPanY = e.clientY;
    startTranslateX = translateX;
    startTranslateY = translateY;
    container.classList.add('grabbing');
    img.classList.add('grabbing');
    console.log('Mouse pan started');
  };
  container.addEventListener('mousedown', mouseDownHandler);

  const mouseMoveHandler = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    translateX = startTranslateX + (e.clientX - startPanX);
    translateY = startTranslateY + (e.clientY - startPanY);
    applyTransform();
  };
  document.addEventListener('mousemove', mouseMoveHandler);

  const mouseUpHandler = () => {
    if (isPanning) {
      isPanning = false;
      container.classList.remove('grabbing');
      img.classList.remove('grabbing');
      console.log('Mouse pan ended');
    }
  };
  document.addEventListener('mouseup', mouseUpHandler);

  // FIXED Touch events: Pinch zoom + pan, with passive: false and logs
  const touchStartHandler = (e) => {
    e.stopPropagation();
    if (e.touches.length === 1 && scale > 1) {
      // Single touch pan
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startTranslateX = translateX;
      startTranslateY = translateY;
      console.log('Touch pan started');
    } else if (e.touches.length === 2) {
      // Pinch start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      console.log('Pinch zoom started');
    }
  };
  container.addEventListener('touchstart', touchStartHandler, { passive: false });

  const touchMoveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length === 1 && touchStart && scale > 1) {
      // Pan
      translateX = startTranslateX + (e.touches[0].clientX - touchStart.x);
      translateY = startTranslateY + (e.touches[0].clientY - touchStart.y);
      applyTransform();
    } else if (e.touches.length === 2) {
      // Pinch
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      if (lastTouchDistance > 0) {
        const delta = currentDistance / lastTouchDistance;
        scale = Math.min(Math.max(scale * delta, 0.5), 4);
        applyTransform();
      }
      lastTouchDistance = currentDistance;
    }
  };
  container.addEventListener('touchmove', touchMoveHandler, { passive: false });

  const touchEndHandler = (e) => {
    e.stopPropagation();
    touchStart = null;
    lastTouchDistance = 0;
    if (e.touches.length === 0) {
      console.log('Touch interaction ended');
    }
  };
  container.addEventListener('touchend', touchEndHandler, { passive: false });

  // FIXED Reset button: With stopPropagation
  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetZoom();
    console.log('Reset button clicked');
  });

  // FIXED Close lightbox: With reset and logs
  closeBtnLightbox.addEventListener('click', (e) => {
    e.stopPropagation();
    resetZoom();
    lightbox.classList.remove('active');
    console.log('Lightbox closed via button');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtnLightbox) {
      resetZoom();
      lightbox.classList.remove('active');
      console.log('Lightbox closed via overlay/click');
    }
  });

  // FIXED ESC for lightbox (re-attach fresh handler)
  lightboxEscHandler = (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      resetZoom();
      lightbox.classList.remove('active');
      console.log('Lightbox closed via ESC');
    }
  };
  document.addEventListener('keydown', lightboxEscHandler);

  // FIXED: Update closeModal to include lightbox cleanup (override with fresh version)
  const originalCloseModal = closeModal;
  closeModal = () => {
    originalCloseModal();
    resetZoom();
    lightbox.classList.remove('active');
    if (lightboxEscHandler) {
      document.removeEventListener('keydown', lightboxEscHandler);
    }
    if (wheelTimeout) clearTimeout(wheelTimeout);
    console.log('Modal closed: Lightbox reset and cleaned up');
  };

  // FIXED Photo interactions: Hover + click with validation, pre-load check, and logs
  const photoItems = overlay.querySelectorAll('.photo-preview-item');
  console.log(`Attaching events to ${photoItems.length} photo items`);
  photoItems.forEach((item, index) => {
    // Hover for zoom icon (with pointer-events: none on overlay to avoid blocking)
    const zoomOverlay = item.querySelector('.zoom-icon-overlay');
    item.addEventListener('mouseenter', () => {
      if (zoomOverlay) {
        zoomOverlay.style.display = 'flex';
        zoomOverlay.style.opacity = '1';
        console.log(`Hover on photo ${index + 1}: Icon shown`);
      }
    });
    item.addEventListener('mouseleave', () => {
      if (zoomOverlay) {
        zoomOverlay.style.display = 'none';
        zoomOverlay.style.opacity = '0';
      }
    });

    // FIXED Click: Validate src, pre-load image, then open with reset
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();  // Prevent modal drag interference
      if (isDragging) return;  // Skip if modal is being dragged

      const fullImgSrc = item.getAttribute('data-full-src');
      console.log(`Photo ${index + 1} clicked: src=${fullImgSrc}`);
      if (!fullImgSrc || fullImgSrc === '') {
        console.error('Invalid fullSrc on photo item');
        alert('Invalid image source. Please try another.');
        return;
      }

      // Pre-load to validate and ensure load before opening
      const tempImg = new Image();
      tempImg.onload = () => {
        console.log(`Image pre-loaded successfully: ${fullImgSrc}`);
        img.src = fullImgSrc;
        img.alt = `Zoomed evidence ${index + 1}`;
        resetZoom();  // Reset state for new image
        lightbox.classList.add('active');
        console.log(`Lightbox opened with src: ${fullImgSrc}`);
      };
      tempImg.onerror = () => {
        console.error(`Failed to load image: ${fullImgSrc}`);
        // Fallback placeholder
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
        img.alt = 'Image not available';
        resetZoom();
        lightbox.classList.add('active');
        alert('Image could not be loaded. Showing placeholder.');
      };
      tempImg.src = fullImgSrc;
    });
  });

  // Prevent body scroll while modal is open
  originalScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${originalScrollY}px`;
  document.body.style.width = '100%';
  console.log('Body scroll locked during modal open');

  console.log('attachAccomplishmentModal completed: All events (including zoom/pan) attached successfully');
}

// Usage example: To open the modal on click, simply call with ID (handles everything internally)
// e.g., in a button onclick: mountAccomplishmentModal('some-accomplishment-id')
// Or async: await mountAccomplishmentModal('some-id'); // For error handling if needed
// For testing/offline: mountAccomplishmentModal('test-id', { data: mockData, photos: mockPhotos, id: 'test-id' });

// Export for global access (like mountLogin)
window.mountAccomplishmentModal = mountAccomplishmentModal;