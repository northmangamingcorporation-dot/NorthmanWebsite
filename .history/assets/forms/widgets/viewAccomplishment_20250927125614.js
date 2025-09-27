// DYNAMIC SELF-CONTAINED: View detailed accomplishment (builds modal on-the-fly)
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
    console.log(`Loading details for accomplishment ID: ${id}`);
    
    // Step 1: Fetch full doc from Firestore
    const doc = await window.db.collection('accomplishments').doc(id).get();
    if (!doc.exists) {
      throw new Error('Report not found.');
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

    // Step 3: Build content (details + gallery)
    let contentHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h3 style="color: #0ea5a4; text-align: center; margin-bottom: 20px;">Accomplishment Report Details</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Report ID:</strong> ${data.id}</p>
          <p><strong>Description:</strong> ${data.descriptionOfService || 'N/A'}</p>
          <p><strong>Date Submitted:</strong> ${data.dateSubmitted ? new Date(data.dateSubmitted.toDate()).toLocaleString() : 'N/A'}</p>
          <p><strong>Status:</strong> <span style="color: #10b981;">${data.status || 'Submitted'}</span></p>
          ${Object.entries(data).filter(([key]) => !['id', 'uniquekey', 'status', 'dateSubmitted', 'updatedAt', 'telegramPhotos'].includes(key)).map(([key, value]) => {
            const val = (value && value.toDate) ? value.toDate().toLocaleString() : value;
            return `<p><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${val || 'N/A'}</p>`;
          }).join('')}
        </div>
    `;

    // Photo Gallery
    if (photos.length > 0) {
      contentHTML += `
        <div style="margin-top: 20px;">
          <h4 style="color: #0ea5a4; margin-bottom: 15px;">Proof Photos (${photos.length})</h4>
          <div class="photo-gallery">
      `;
      // Filter out broken photos (url: null from partial failures)
      const validPhotos = photos.filter(photo => photo.url);
      validPhotos.slice(0, 10).forEach((photo, index) => {
        const thumbSrc = photo.thumbnail ? `<img src="${photo.thumbnail}" alt="Thumbnail" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">` : '';
        contentHTML += `
          <div class="photo-item">
            ${thumbSrc}
            <img src="${photo.url}" alt="Proof Photo ${index + 1}" 
                 style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'; this.style.display='block';">
            <p style="font-size: 12px; color: #6b7280; margin-top: 5px; word-break: break-word;">${photo.caption.substring(0, 100)}${photo.caption.length > 100 ? '...' : ''}</p>
          </div>
        `;
      });
      if (validPhotos.length > 10) {
        contentHTML += `<p style="text-align: center; color: #6b7280;">... and ${validPhotos.length - 10} more photos</p>`;
      }
      contentHTML += '</div></div>';
    } else if (photoCount > 0) {
      contentHTML += '<p style="color: #f59e0b; text-align: center;">Photos were sent to Telegram (${photoCount}) but could not be retrieved at this time.</p>';
    } else {
      contentHTML += '<p style="color: #6b7280; text-align: center; font-style: italic;">No photos attached to this report.</p>';
    }

    contentHTML += '</div>';

    console.log('Content built, creating dynamic modal...');  // Debug

    // Step 4: Dynamically create and show modal
    const overlay = document.createElement('div');
    overlay.className = 'dynamic-accomplishment-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'accomplishment-title');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
      z-index: 9999; backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.3s ease;
      padding: 20px;
    `;

    const modalBox = document.createElement('div');
    modalBox.style.cssText = `
      background: white; border-radius: 12px; box-shadow: 0 20px 25px rgba(0,0,0,0.1);
      padding: 20px; max-width: 90vw; max-height: 90vh; overflow-y: auto;
      transform: scale(0.95); transition: transform 0.3s ease; position: relative;
      font-family: Arial, sans-serif; max-width: 600px; width: 100%;
    `;
    modalBox.innerHTML = `
      <button id="dynamic-close-btn" style="
        position: absolute; top: 10px; right: 15px; background: none; border: none;
        font-size: 24px; cursor: pointer; color: #6b7280; width: 30px; height: 30px;
        display: flex; align-items: center; justify-content: center; border-radius: 50%;
        transition: background 0.2s;
      " aria-label="Close">&times;</button>
      <h2 id="accomplishment-title" style="color: #0ea5a4; text-align: center; margin-bottom: 20px; margin-top: 0;">Accomplishment Report Details</h2>
      ${contentHTML}
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <button id="dynamic-footer-close" style="
          background: #ef4444; color: white; border: none; padding: 10px 20px;
          border-radius: 6px; cursor: pointer; font-size: 14px;
        ">Close</button>
      </div>
    `;

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => {
      overlay.style.opacity = '1';
      modalBox.style.transform = 'scale(1)';
    }, 10);

    // Inject styles (once, for gallery and modal)
    if (!document.querySelector('#dynamic-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'dynamic-modal-styles';
      style.textContent = `
        .photo-gallery { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .photo-item { margin: 10px; text-align: center; max-width: 200px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background: white; }
        .photo-item img { width: 100%; max-width: 200px; height: auto; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        #dynamic-close-btn:hover { background: #f3f4f6; color: #374151; }
        #dynamic-footer-close:hover { background: #dc2626; }
        @media (max-width: 768px) { .photo-gallery { flex-direction: column; align-items: center; } .photo-item { max-width: 100%; } .dynamic-accomplishment-modal { padding: 10px; } }
      `;
      document.head.appendChild(style);
    }

    // Event listeners
    const closeBtn = overlay.querySelector('#dynamic-close-btn');
    const footerClose = overlay.querySelector('#dynamic-footer-close');
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

    // Close function
    function closeModal() {
      overlay.style.opacity = '0';
      modalBox.style.transform = 'scale(0.95)';
      setTimeout(() => overlay.remove(), 300);
      document.removeEventListener('keydown', escHandler);
    }

    // Focus management
    closeBtn.focus();

    console.log('Dynamic modal shown successfully');  // Debug

  } catch (error) {
    console.error('Error viewing accomplishment:', error);
    const errorMsg = error.message || 'Failed to load report details.';
    alert(`Error: ${errorMsg}`);
  }
}

// Export for global access (like your enhanced functions)
window.viewAccomplishment = viewAccomplishment;