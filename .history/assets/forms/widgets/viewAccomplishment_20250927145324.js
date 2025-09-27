// DYNAMIC SELF-CONTAINED: Mount, Render, and Attach functions for Accomplishment Modal (FIXED: Photo Zoom/Drag)
// All previous enhancements retained; fixes applied to lightbox zoom (wheel/pinch), pan (mouse/touch drag), hover icon, and activation.
// Debug logs added (remove console.log in production). Tested for multiple opens/closes.

async function mountAccomplishmentModal(id, optionalPreFetchedData = null) {
  try {
    // [Unchanged: Data fetching/pre-fetch logic - omitted for brevity; same as before]
    let mountedData = null;
    if (optionalPreFetchedData) {
      console.log('Using pre-fetched data for standalone mode');
      mountedData = {
        data: optionalPreFetchedData.data || optionalPreFetchedData,
        photos: optionalPreFetchedData.photos || [],
        id: optionalPreFetchedData.id || id
      };
    } else {
      if (!id) throw new Error('Invalid ID provided');
      if (!window.db) throw new Error('Database not available. Pass pre-fetched data for standalone.');
      const existingModal = document.querySelector('.dynamic-accomplishment-modal');
      if (existingModal) existingModal.remove();
      console.log(`Loading details for accomplishment ID: ${id}`);
      const doc = await window.db.collection('accomplishments').doc(id).get();
      if (!doc.exists) throw new Error('Report not found.');
      const data = doc.data();
      console.log('Fetched data:', data);
      let photos = [];
      if (window.TelegramConnect && typeof window.TelegramConnect.getDataById === 'function') {
        try {
          photos = await window.TelegramConnect.getDataById(id);
          console.log(`Retrieved ${photos ? photos.length : 0} photos for ID: ${id}`);
          photos = (photos || []).filter(photo => photo && photo.url && typeof photo.url === 'string');
          console.log(`Filtered to ${photos.length} valid photos`);
        } catch (photoErr) {
          console.error('Failed to retrieve Telegram photos:', photoErr);
          photos = [];
        }
      } else {
        console.warn('TelegramConnect not available - photos cannot be retrieved.');
      }
      mountedData = { data, photos, id };
    }

    const existingModal = document.querySelector('.dynamic-accomplishment-modal');
    if (existingModal) existingModal.remove();
    
    const fullModalHTML = renderAccomplishmentModal(mountedData);
    document.body.insertAdjacentHTML("beforeend", fullModalHTML);
    
    attachAccomplishmentModal();
    
    // [Unchanged: Animation CSS injection - omitted for brevity]
    if (!document.querySelector('#accomplishment-modal-animations')) {
      const style = document.createElement("style");
      style.id = 'accomplishment-modal-animations';
      style.textContent = `
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleIn { from { transform: scale(0.9) translateY(-20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `;
      document.head.appendChild(style);
    }
    
    console.log('Accomplishment modal mounted and attached successfully');
    
  } catch (error) {
    console.error("Error mounting accomplishment modal:", error);
    const errorMsg = error.message || 'Failed to load report details.';
    if (window.Modal && window.Modal.show) {
      window.Modal.show(`Error: ${errorMsg}`, 'error');
    } else {
      alert(`Error: ${errorMsg}`);
    }
  }
}

// [Unchanged: renderAccomplishmentModal - same as before, but with enhanced logging in photo loop]
function renderAccomplishmentModal(mountedData) {
  if (!mountedData) return '';

  const { data, photos, id } = mountedData;

  // [Unchanged: categorizeFields and renderSectionTable - omitted for brevity]

  // [Unchanged: contentHTML for sections - omitted]

  // FIXED Photo Section: Added validation and logs
  const validPhotos = (photos || []).filter(photo => photo && photo.url && typeof photo.url === 'string');
  console.log(`Rendering ${validPhotos.length} valid photos in gallery`);
  let photoHTML = '';
  if (validPhotos.length > 0) {
    photoHTML = `
      <div style="margin-top: 24px; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Attached Evidence (${validPhotos.length} Items)</h3>
        <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; font-style: italic;">Click any item to zoom (wheel/pinch) and drag to pan.</p>
        <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; justify-items: center;">
    `;
    validPhotos.slice(0, 12).forEach((photo, index) => {
      const fullSrc = photo.url;
      const thumbSrc = photo.thumbnail || photo.url || '';
      const caption = photo.caption ? photo.caption.substring(0, 60) + (photo.caption.length > 60 ? '...' : '') : `Evidence Item ${index + 1}`;
      console.log(`Photo ${index + 1}: thumb=${thumbSrc}, full=${fullSrc} (valid: true)`);
      photoHTML += `
        <div class="photo-preview-item" style="position: relative; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: box-shadow 0.2s; cursor: pointer;" data-full-src="${fullSrc}">
          <img src="${thumbSrc}" alt="Evidence Preview ${index + 1}" 
               style="width: 100%; height: 140px; object-fit: cover; display: block;"
               onerror="console.error('Thumbnail load failed: ${thumbSrc}'); this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='; this.onerror=null;">
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
      photoHTML += `<p style="text-align: center; color: #6b7280; margin-top: 16px; font-style: italic;">... and ${validPhotos.length - 12} more</p>`;
    }
    photoHTML += '</div></div>';
  } else {
    photoHTML = `
      <div style="text-align: center; padding: 24px; color: #6b7280; font-style: italic; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-top: 20px;">
        No evidence attached.
      </div>
    `;
  }

  // [Unchanged: Full modal HTML structure - insert photoHTML into contentHTML]

  // Return fullModalHTML (same as before, but with photoHTML integrated)
  // ... (abbreviated; use the previous renderAccomplishmentModal body, replacing the photo section with above)
}

// FIXED: attachAccomplishmentModal - Enhanced with re-attachment, logs, and robust events
function attachAccomplishmentModal() {
  const overlay = document.querySelector('.dynamic-accomplishment-modal');
  const modalBox = overlay?.querySelector('.modal-box');
  if (!overlay || !modalBox) {
    console.error('Modal elements not found.');
    return;
  }

  // Animate in (unchanged)
  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.animation = 'none';
    modalBox.style.transform = 'scale(1) translateY(0)';
    modalBox.style.animation = 'none';
  }, 10);

  // FIXED CSS: Enhanced for lightbox, with better transforms and cursors
  if (!document.querySelector('#dynamic-accomplishment-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-accomplishment-styles';
    style.textContent = `
      /* [Unchanged: Previous styles for gallery, hover, drag, tables - omitted] */
      
      /* FIXED Lightbox CSS: Better zoom/pan support */
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
      
      /* FIXED Hover Icon: Better positioning and non-blocking */
      .photo-preview-item:hover .zoom-icon-overlay { display: flex !important; opacity: 1; }
      .zoom-icon-overlay { display: none; opacity: 0; transition: opacity 0.2s ease; pointer-events: none; }
      
      /* Prevent interference during lightbox */
      .zoom-lightbox * { user-select: none !important; -webkit-user-select: none !important; }
      
      @media (max-width: 768px) { 
        .zoom-lightbox .lightbox-container { width: 95%; height: 95%; } 
        .lightbox-img { cursor: default !important; } /* Disable mouse cursor on touch */
      }
    `;
    document.head.appendChild(style);
  }

  // [Unchanged: Close handlers, modal drag, ESC - omitted for brevity]

  // FIXED Lightbox: Always re-attach events for robustness; added logs and image load check
  let lightbox = document.querySelector('.zoom-lightbox');
  if (!lightbox) {
    lightbox =