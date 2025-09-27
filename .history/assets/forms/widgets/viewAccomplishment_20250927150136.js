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
        <div class="dynamic-accomplishment-modal" role="dialog" aria-modal="