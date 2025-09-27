// DYNAMIC SELF-CONTAINED: Mount, Render, and Attach functions for Accomplishment Modal
// Refactored to match structure of IT Service Order Modal (assuming polished, draggable, zoomable design with previews)
// Enhancements: Image previews with thumbnails, zoom on click (lightbox-style), full modal drag via header

// Core function to mount (initialize and fetch data)
async function mountAccomplishmentModal(id) {
  if (!id || !window.db) {
    console.error('Invalid ID or database not available');
    alert('Error: Invalid report ID or database not available.');
    return null;
  }

  // Remove any existing dynamic modal (prevent stacking)
  const existingModal = document.querySelector('.dynamic-accomplishment-modal');
  if (existingModal) {
    existingModal.remove();
  }

  try {
    console.log(`Loading details for accomplishment ID: ${id}`);
    
    // Step 1: Fetch full doc from Firestore
    const doc = await window.db.collection('accomplishments').doc(id).get();
    if (!doc.exists) {
      throw new Error('Report not found.');
    }
    const data = doc.data();
    console.log('Fetched data:', data);  // Debug

    // Step 2: Fetch Telegram photos if available (non-blocking)
    let photos = [];
    if (window.TelegramConnect && typeof window.TelegramConnect.getDataById === 'function') {
      try {
        photos = await window.TelegramConnect.getDataById(id);
        console.log(`Retrieved ${photos.length} photos for ID: ${id}`, photos);  // Debug
      } catch (photoErr) {
        console.error('Failed to retrieve Telegram photos:', photoErr);
        photos = [];  // Fallback: No photos shown
      }
    } else if (photoCount > 0) {
      console.warn('TelegramConnect not available - photos cannot be retrieved.');
    }

    // Return mounted data for rendering
    return {
      data,
      photos,
      id
    };

  } catch (error) {
    console.error('Error mounting accomplishment modal:', error);
    const errorMsg = error.message || 'Failed to load report details.';
    alert(`Error: ${errorMsg}`);
    return null;
  }
}

// Function to render the modal content (HTML structure with enhanced design like IT Service Order Modal)
function renderAccomplishmentModal(mountedData) {
  if (!mountedData) return '';

  const { data, photos, id } = mountedData;

  // Enhanced content HTML (polished design: cleaner typography, consistent colors, card-based layout like IT Service Order)
  let contentHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; line-height: 1.6;">
      <div style="background: linear-gradient(135deg, #0ea5a4 0%, #14b8a6 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; cursor: move; user-select: none;">
        <h3 style="margin: 0; font-size: 24px; font-weight: 600;">Accomplishment Report Details</h3>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">ID: ${id}</p>
      </div>
      <div style="background: #ffffff; padding: 25px; border-radius: 0 0 12px 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 25px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5a4;">
            <p><strong>Description of Service:</strong></p>
            <p style="color: #374151; margin-top: 5px;">${data.descriptionOfService || 'N/A'}</p>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p><strong>Date Submitted:</strong></p>
            <p style="color: #374151; margin-top: 5px;">${data.dateSubmitted ? new Date(data.dateSubmitted.toDate()).toLocaleString() : 'N/A'}</p>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p><strong>Status:</strong></p>
            <p style="color: #374151; margin-top: 5px;"><span style="color: #10b981; font-weight: 600;">${data.status || 'Submitted'}</span></p>
          </div>
        </div>
        ${Object.entries(data).filter(([key]) => !['id', 'uniquekey', 'status', 'dateSubmitted', 'updatedAt', 'telegramPhotos'].includes(key)).map(([key, value]) => {
          const val = (value && value.toDate) ? value.toDate().toLocaleString() : value;
          return `
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #6b7280;">
              <p><strong style="color: #0ea5a4;">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong></p>
              <p style="color: #374151; margin-top: 5px;">${val || 'N/A'}</p>
            </div>
          `;
        }).join('')}
      </div>
  `;

  // Enhanced Photo Gallery with Previews, Zoom, and Thumbnails (like IT Service Order: grid previews, click-to-zoom lightbox)
  if (photos.length > 0) {
    contentHTML += `
      <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border-radius: 12px;">
        <h4 style="color: #0ea5a4; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #0ea5a4; padding-bottom: 5px;">Proof Photos (${photos.length})</h4>
        <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; justify-items: center;">
    `;
    photos.slice(0, 12).forEach((photo, index) => {  // Limit to 12 for better layout
      const thumbSrc = photo.thumbnail || photo.url;  // Use thumbnail if available, fallback to full
      contentHTML += `
        <div class="photo-preview-item" style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: transform 0.2s; cursor: pointer;">
          <img src="${thumbSrc}" alt="Preview ${index + 1}" 
               style="width: 100%; height: 120px; object-fit: cover; display: block;"
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByZXZpZXcgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 5px; font-size: 12px; text-align: center;">
            ${photo.caption ? photo.caption.substring(0, 50) + (photo.caption.length > 50 ? '...' : '') : `Photo ${index + 1}`}
          </div>
          <!-- Hidden full image for zoom -->
          <img src="${photo.url}" alt="Full Photo ${index + 1}" class="hidden-full-img" style="display: none;" data-index="${index}">
        </div>
      `;
    });
    if (photos.length > 12) {
      contentHTML += `<p style="text-align: center; color: #6b7280; margin-top: 15px;">... and ${photos.length - 12} more photos</p>`;
    }
    contentHTML += '</div></div>';
  } else {
    contentHTML += `
      <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8fafc; border-radius: 8px; margin-top: 20px;">
        No photos attached to this report.
      </div>
    `;
  }

  contentHTML += '</div>';

  return contentHTML;
}

// Function to attach and display the modal (with drag, zoom, and event handling)
function attachAccomplishmentModal(mountedData) {
  if (!mountedData) return;

  const contentHTML = renderAccomplishmentModal(mountedData);

  // Step: Dynamically create and show modal (enhanced design like IT Service Order: rounded, shadowed, draggable header)
  const overlay = document.createElement('div');
  overlay.className = 'dynamic-accomplishment-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'accomplishment-title');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center;
    z-index: 10000; backdrop-filter: blur(5px); opacity: 0; transition: opacity 0.3s ease;
    padding: 20px;
  `;

  const modalBox = document.createElement('div');
  modalBox.style.cssText = `
    background: white; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    max-width: 90vw; max-height: 90vh; overflow-y: auto; position: relative;
    transform: scale(0.9) translateY(-20px); transition: all 0.3s ease;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; max-width: 750px;
  `;
  modalBox.innerHTML = `
    <button id="dynamic-close-btn" style="
      position: absolute; top: 15px; right: 20px; background: rgba(255,255,255,0.9); border: none;
      font-size: 20px; cursor: pointer; color: #6b7280; width: 35px; height: 35px;
      display: flex; align-items: center; justify-content: center; border-radius: 50%;
      transition: all 0.2s; z-index: 10; backdrop-filter: blur(10px);
    " aria-label="Close">&times;</button>
    <div id="accomplishment-title" style="cursor: move; user-select: none;">${contentHTML}</div>
    <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <button id="dynamic-footer-close" style="
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 12px 30px;
        border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500; transition: all 0.2s;
      ">Close Report</button>
    </div>
  `;

  overlay.appendChild(modalBox);
  document.body.appendChild(overlay);

  // Animate in
  setTimeout(() => {
    overlay.style.opacity = '1';
    modalBox.style.transform = 'scale(1) translateY(0)';
  }, 10);

  // Inject enhanced styles (once, for gallery, drag, zoom like IT Service Order)
  if (!document.querySelector('#dynamic-accomplishment-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-accomplishment-styles';
    style.textContent = `
      .photo-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; justify-items: center; }
      .photo-preview-item { transition: transform 0.2s ease; }
      .photo-preview-item:hover { transform: scale(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
      .hidden-full-img { display: none !important; }
      #dynamic-close-btn:hover { background: #fee2e2; color: #dc2626; transform: scale(1.1); }
      #dynamic-footer-close:hover { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); transform: translateY(-2px); box-shadow: 0 4px 8px rgba(239,68,68,0.3); }
      
      /* Zoom Lightbox (click preview to open) */
      .zoom-lightbox { 
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); 
        display: none; align-items: center; justify-content: center; z-index: 10001; 
        backdrop-filter: blur(5px); 
      }
      .zoom-lightbox img { max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .zoom-lightbox.active { display: flex !important; }
      .zoom-close { position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 30px; cursor: pointer; }
      
      /* Drag Functionality */
      .dragging { cursor: grabbing !important; }
      .dragging * { cursor: grabbing !important; user-select: none !important; }
      
      @media (max-width: 768px) { 
        .photo-gallery { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; } 
        .dynamic-accomplishment-modal { padding: 10px; } 
        .modal-box { max-width: 95vw; } 
        /* Disable drag on mobile for usability */
        [style*="cursor: move"] { cursor: default !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // Event Listeners
  const closeBtn = overlay.querySelector('#dynamic-close-btn');
  const footerClose = overlay.querySelector('#dynamic-footer-close');
  const header = modalBox.querySelector('#accomplishment-title > div[style*="gradient"]');  // Draggable header

  // Close handlers
  const closeModal = () => {
    overlay.style.opacity = '0';
    modalBox.style.transform = 'scale(0.9) translateY(-20px)';
    setTimeout(() => overlay.remove(), 300);
    document.removeEventListener('keydown', escHandler);
    // Close any open zoom lightbox
    const lightbox = document.querySelector('.zoom-lightbox');
    if (lightbox) lightbox.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeModal);
  footerClose.addEventListener('click', closeModal);

  // Close on overlay click (outside content)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', escHandler);

  // Drag Functionality (make header draggable like IT Service Order)
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  const makeDraggable = (elem) => {
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

  // Photo Zoom Functionality (lightbox on click, like IT Service Order Modal)
  const photoItems = modalBox.querySelectorAll('.photo-preview-item');
  photoItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // Prevent drag interference
      if (isDragging) return;

      const fullImgSrc = item.querySelector('.hidden-full-img')?.src;
      if (!fullImgSrc) return;

      // Create lightbox if not exists (reuse if already created)
      let lightbox = document.querySelector('.zoom-lightbox');
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'zoom-lightbox';
        lightbox.innerHTML = `
          <button class="zoom-close" aria-label="Close zoom">&times;</button>
          <img src="${fullImgSrc}" alt="Zoomed photo">
        `;
        lightbox.querySelector('img').src = fullImgSrc;  // Set src
        document.body.appendChild(lightbox);

        // Lightbox close handlers
        const zoomClose = lightbox.querySelector('.zoom-close');
        zoomClose.addEventListener('click', () => {
          lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox || e.target === zoomClose) {
            lightbox.classList.remove('active');
          }
        });

        // ESC to close lightbox
        const lightboxEscHandler = (e) => {
          if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
          }
        };
        document.addEventListener('keydown', lightboxEscHandler);

        // Cleanup on modal close
        const originalCloseModal = closeModal;
        closeModal = () => {
          originalCloseModal();
          if (lightbox) {
            lightbox.classList.remove('active');
            document.removeEventListener('keydown', lightboxEscHandler);
          }
        };
      } else {
        lightbox.querySelector('img').src = fullImgSrc;
      }

      // Activate lightbox
      lightbox.classList.add('active');
    });
  });

  // Prevent body scroll while modal is open
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';

  // Restore scroll on close
  const originalCloseModal = closeModal;
  closeModal = () => {
    originalCloseModal();
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };
}

// Usage example: To open the modal, call mount then attach
// await mountAccomplishmentModal('some-id').then(attachAccomplishmentModal);