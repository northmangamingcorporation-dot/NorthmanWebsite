// ENHANCED DYNAMIC SELF-CONTAINED: View detailed service order (with zoom/drag lightbox)
async function viewAccomplishment(id) {
  if (!id || !window.db) {
    console.error('Invalid ID or database not available');
    alert('Error: Invalid report ID or database not available.');
    return;
  }

  // Remove any existing dynamic modal (prevent stacking)
  const existingModal = document.querySelector('.dynamic-accomplishment-modal');
  if (existingModal) {
    existingModal.remove();
  }

  try {
    console.log(`Loading details for service order ID: ${id}`);
    
    // Step 1: Fetch full doc from Firestore
    const doc = await window.db.collection('accomplishments').doc(id).get();
    if (!doc.exists) {
      throw new Error('Service order not found.');
    }
    const data = doc.data();
    console.log('Fetched data:', data);  // Debug

    // Define photoCount for fallback logic
    const photoCount = data.telegramPhotos ? data.telegramPhotos.length : 0;

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

    // Step 3: Build content (service order layout: header, description, fields, gallery)
    let contentHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; line-height: 1.6;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #0ea5a4, #14b8a6); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="margin: 0; font-size: 24px; font-weight: 600;">📋 Service Order Details</h2>
          <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Order ID: ${data.id || 'N/A'}</p>
        </div>

        <!-- Status & Date Card -->
        <div style="background: #f8fafc; padding: 15px; border-radius: 0 0 12px 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <p style="margin: 0; font-size: 16px;"><strong>🗓️ Date Submitted:</strong> ${data.dateSubmitted ? new Date(data.dateSubmitted.toDate()).toLocaleString() : 'N/A'}</p>
            <p style="margin: 0;"><strong>Status:</strong> <span style="background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 20px; font-size: 14px; font-weight: 500;">${data.status || 'Submitted'}</span></p>
          </div>
        </div>

        <!-- Description/Notes Card -->
        <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h4 style="color: #0ea5a4; margin: 0 0 10px; font-size: 18px;">📝 Description of Service</h4>
          <p style="margin: 0; color: #374151; font-size: 16px;">${data.descriptionOfService || 'No description provided.'}</p>
        </div>

        <!-- Dynamic Custom Fields Card -->
        ${Object.entries(data).filter(([key]) => !['id', 'uniquekey', 'status', 'dateSubmitted', 'updatedAt', 'telegramPhotos', 'descriptionOfService'].includes(key)).length > 0 ? `
          <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h4 style="color: #0ea5a4; margin: 0 0 15px; font-size: 18px;">⚙️ Additional Details</h4>
            <div style="display: grid; gap: 10px;">
              ${Object.entries(data).filter(([key]) => !['id', 'uniquekey', 'status', 'dateSubmitted', 'updatedAt', 'telegramPhotos', 'descriptionOfService'].includes(key)).map(([key, value]) => {
                const val = (value && value.toDate) ? value.toDate().toLocaleString() : value;
                return `<p style="margin: 0;"><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${val || 'N/A'}</p>`;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Photo Gallery Section -->
    `;

    // Photo Gallery Logic
    if (photos.length > 0) {
      contentHTML += `
        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h4 style="color: #0ea5a4; margin: 0 0 15px; font-size: 18px;">📸 Proof Photos (${photos.length})</h4>
          <p style="margin: 0 0 15px; color: #6b7280; font-style: italic;">Click any photo to zoom and explore in full screen.</p>
          <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
      `;
      // Filter out broken photos (url: null from partial failures)
      const validPhotos = photos.filter(photo => photo.url);
      validPhotos.slice(0, 10).forEach((photo, index) => {
        const thumbSrc = photo.thumbnail ? photo.thumbnail : photo.url;  // Fallback to main if no thumb
        contentHTML += `
          <div class="photo-item" style="text-align: center; cursor: pointer; transition: transform 0.2s; border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; background: #f9fafb;" onclick="openLightbox(${index}, ${JSON.stringify(validPhotos)})">
            <img src="${thumbSrc}" alt="Proof Photo ${index + 1}" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';">
            <p style="font-size: 12px; color: #6b7280; margin-top: 8px; word-break: break-word;">${photo.caption.substring(0, 80)}${photo.caption.length > 80 ? '...' : ''}</p>
          </div>
        `;
      });
      if (validPhotos.length > 10) {
        contentHTML += `<p style="text-align: center; color: #6b7280; grid-column: 1 / -1; margin-top: 10px;">... and ${validPhotos.length - 10} more photos (use lightbox to view all)</p>`;
      }
      contentHTML += '</div></div>';
    } else if (photoCount > 0) {
      contentHTML += `
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #f59e0b;">
          <p style="color: #92400e; margin: 0;"><strong>⚠️ Photos Alert</strong><br>Photos were sent to Telegram (${photoCount}) but could not be retrieved at this time. Please try refreshing.</p>
        </div>
      `;
    } else {
      contentHTML += `
        <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-style: italic;">📷 No photos attached to this service order.</p>
        </div>
      `;
    }

    contentHTML += '</div>';

    console.log('Content built, creating dynamic modal...');  // Debug

    // Step 4: Dynamically create and show modal
    const overlay = document.createElement('div');
    overlay.className = 'dynamic-accomplishment-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'service-order-title');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
      z-index: 9999; backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.3s ease;
      padding: 20px;
    `;

    const modalBox = document.createElement('div');
    modalBox.style.cssText = `
      background: white; border-radius: 12px; box-shadow: 0 25px 50px rgba(0,0,0,0.15);
      padding: 0; max-width: 90vw; max-height: 90vh; overflow-y: auto;
      transform: scale(0.95); transition: transform 0.3s ease; position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    modalBox.innerHTML = `
      <button id="dynamic-close-btn" style="
        position: absolute; top: 15px; right: 20px; background: rgba(255,255,255,0.9); border: none;
        font-size: 24px; cursor: pointer; color: #6b7280; width: 40px; height: 40px;
        display: flex; align-items: center; justify-content: center; border-radius: 50%;
        transition: all 0.2s; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      " aria-label="Close" title="Close">&times;</button>
      <div id="service-order-title" style="background: linear-gradient(135deg, #0ea5a4, #14b8a6); color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">📋 Service Order Details</h2>
      </div>
      <div style="padding: 20px;">${contentHTML}</div>
      <div style="text-align: center; margin-top: 20px; padding: 15px; border-top: 1px solid #e5e7eb; background: #f8fafc; border-radius: 0 0 12px 12px;">
        <button id="dynamic-footer-close" style="
          background: #ef4444; color: white; border: none; padding: 12px 24px;
          border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500;
          transition: background 0.2s;
        ">Close Order</button>
      </div>
    `;

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => {
      overlay.style.opacity = '1';
      modalBox.style.transform = 'scale(1)';
    }, 10);

    // Inject enhanced styles (once, for modal, gallery, lightbox)
    if (!document.querySelector('#enhanced-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'enhanced-modal-styles';
      style.textContent = `
        .photo-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .photo-item { margin: 0; text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; background: #f9fafb; }
        .photo-item:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-color: #0ea5a4; }
        .photo-item img { width: 100%; height: 150px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        #dynamic-close-btn:hover { background: #f3f4f6; color: #374151; transform: scale(1.1); }
        #dynamic-footer-close:hover { background: #dc2626; transform: translateY(-1px); }
        
        /* Lightbox Styles */
        .lightbox-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: