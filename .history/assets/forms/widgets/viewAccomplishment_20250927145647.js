// STANDALONE Accomplishment Modal: No dependencies (Firestore/TelegramConnect optional via pre-fetched data)
// FIXED: "Modal elements not found" via RAF deferral + retry. Auto-mock data if none provided.
// Features: Formal sections, draggable modal, photo gallery with zoom/pan (mouse wheel/touch), hover icons.
// Usage: mountAccomplishmentModal('id') → Uses mock data; or mountAccomplishmentModal('id', {data: {}, photos: []}) for real.

// Mock data generator (for standalone demo - generates realistic sample)
function generateMockData(id) {
  const mockFields = {
    employeeName: 'John Doe',
    department: 'IT Services',
    taskDescription: 'Resolved network outage for main office servers.',
    dateCompleted: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),  // Random recent date
    durationHours: Math.floor(Math.random() * 8) + 2,
    projectName: 'Annual Infrastructure Upgrade',
    status: 'Approved',
    descriptionOfService: 'Emergency repair of fiber optic connections and router reconfiguration to restore connectivity for 150+ users.',
    additionalNotes: 'Involved collaboration with external vendor; no downtime after fix.'
  };

  // Mock photos (using free placeholder services - replace with real URLs if needed)
  const mockPhotos = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, (_, i) => ({
    url: `https://picsum.photos/800/600?random=${id}-${i}`,  // Full res
    thumbnail: `https://picsum.photos/160/140?random=${id}-${i}`,  // Thumb
    caption: `Evidence photo ${i + 1}: Before/after repair documentation.`
  }));

  console.log(`Generated mock data for ID: ${id} (photos: ${mockPhotos.length})`);
  return {
    data: mockFields,
    photos: mockPhotos,
    id: id || 'demo-report'
  };
}

// FIXED: mountAccomplishmentModal - Standalone with mock fallback and RAF for attachment
async function mountAccomplishmentModal(id, optionalPreFetchedData = null) {
  try {
    let mountedData = null;

    if (optionalPreFetchedData) {
      console.log('Using pre-fetched data');
      mountedData = {
        data: optionalPreFetchedData.data || optionalPreFetchedData,
        photos: optionalPreFetchedData.photos || [],
        id: optionalPreFetchedData.id || id
      };
    } else {
      // Standalone: Generate mock data if no pre-fetch
      console.log('No pre-fetched data: Generating mock for standalone demo');
      mountedData = generateMockData(id);
    }

    if (!mountedData || !mountedData.id) {
      throw new Error('Invalid ID or data provided');
    }

    // Remove existing modal
    const existingModal = document.querySelector('.dynamic-accomplishment-modal');
    if (existingModal) {
      existingModal.remove();
      console.log('Removed existing modal');
    }

    // Render and insert full HTML
    const fullModalHTML = renderAccomplishmentModal(mountedData);
    document.body.insertAdjacentHTML("beforeend", fullModalHTML);
    console.log(`HTML inserted: ${fullModalHTML.length} chars`);

    // FIXED: Defer attachment with RAF to ensure DOM is queryable
    requestAnimationFrame(() => {
      attachAccomplishmentModal();
    });

    // Inject animations CSS (once)
    if (!document.querySelector('#accomplishment-modal-animations')) {
      const style = document.createElement("style");
      style.id = 'accomplishment-modal-animations';
      style.textContent = `
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleIn { from { transform: scale(0.9) translateY(-20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `;
      document.head.appendChild(style);
    }

    console.log('Accomplishment modal mounted successfully');
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

// renderAccomplishmentModal: Generates full modal HTML (unchanged core, with mock integration)
function renderAccomplishmentModal(mountedData) {
  if (!mountedData) return '';

  const { data, photos, id } = mountedData;

  // Helper: Categorize fields (unchanged)
  function categorizeFields(entries) {
    const sections = { summary: [], details: [], personnel: [], timeline: [], additional: [] };

    // Fixed summary
    sections.summary = [
      { key: 'Description of Service', value: data.descriptionOfService || 'N/A' },
      { key: 'Date Submitted', value: data.dateSubmitted ? new Date(data.dateSubmitted).toLocaleString() : new Date().toLocaleString() },
      { key: 'Status', value: data.status || 'Submitted' }
    ];

    // Dynamic categorization
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

  // Render section table (unchanged)
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

  // Content HTML (sections + photos)
  let contentHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; line-height: 1.5; color: #1f2937;">
      <div style="background: #1e40af; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center; cursor: move; user-select: none; border-bottom: 3px solid #3b82f6;">
        <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Accomplishment Report</h2>
        <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">Report Identifier: <strong>${id}</strong></p>
      </div>
      <div style="background: #ffffff; padding: 24px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        ${renderSectionTable('Report Summary', sections.summary)}
        ${sections.details.length > 0 ? renderSectionTable('Accomplishment Details', sections.details) : ''}
        ${sections.personnel.length > 0 ? renderSectionTable('Personnel Information', sections.personnel) : ''}
        ${sections.timeline.length > 0 ? renderSectionTable('Timeline', sections.timeline) : ''}
        ${sections.additional.length > 0 ? renderSectionTable('Additional Information', sections.additional) : ''}
      </div>
  `;

  // Photo section (unchanged from fixed version)
  const validPhotos = (photos || []).filter(photo => photo && photo.url && typeof photo.url === 'string');
  console.log(`Rendering ${validPhotos.length} valid photos`);
  if (validPhotos.length > 0) {
    contentHTML += `
      <div style="margin-top: 24px; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Attached Evidence (${validPhotos.length} Items)</h3>
        <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; font-style: italic;">Click to zoom (wheel/pinch) and drag to pan.</p>
        <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; justify-items: center;">
    `;
    validPhotos.slice(0, 12).forEach((photo, index) => {
      const fullSrc = photo.url;
      const thumbSrc = photo.thumbnail || photo.url || '';
      const caption = photo.caption ? photo.caption.substring(0, 60) + (photo.caption.length > 60 ? '...' : '') : `Evidence Item ${index + 1}`;
      console.log(`Photo ${index + 1}: thumb=${thumbSrc}, full=${fullSrc}`);
      contentHTML += `
        <div class="photo-preview-item" style="position: relative; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: box-shadow 0.2s; cursor: pointer;" data-full-src="${fullSrc}">
          <img src="${thumbSrc}" alt="Evidence Preview ${index + 1}" 
               style="width: 100%; height: 140px; object-fit: cover; display: block;"
               onerror="console.error('Thumbnail failed: ${thumbSrc}'); this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='; this.onerror=null;">
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
      contentHTML += `<p style="text-align: center; color: #6b7280; margin-top: 16px; font-style: italic;">... and ${validPhotos.length - 12} more</p>`;
    }
    contentHTML += '</div></div>';
  } else {
    contentHTML += `
      <div style="text-align: center; padding: 24px; color: #6b7280; font-style: italic; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-top: 20px;">
        No evidence attached.
      </div>
    `;
  }

  contentHTML += '</div>';

  // Full modal HTML (overlay + box)
  const fullModalHTML = `
    <div class="dynamic-accomplishment-modal" role="dialog" aria-modal="true" aria-labelledby="accomplishment-title" style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center;
      z-index: 10000; backdrop-filter: blur(5px); opacity: 0; transition: opacity 0.3s ease;
      padding: 20px;
    ">
      <div class="modal-box" style="
        background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        max-width: 90vw; max-height: 90vh; overflow-y: auto; position: relative;
        transform: scale(0.95) translateY(-10px); transition: all 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; max-width: 950px;
        border: 1px solid #e5e7eb;
      ">
        <button id="dynamic-close-btn" style="
          position: absolute; top: 12px; right: 16px; background: #f9fafb; border: 1px solid #e5e7eb;
                    border-radius: 50%; font-size: 18px; cursor: pointer; color: #6b7280; width: 32px; height: 32px;
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

// FIXED: attachAccomplishmentModal - With RAF retry, robust element checks, and full lightbox re-attachment
function attachAccomplishmentModal() {
  // FIXED: Query elements with retry (RAF + timeout fallback)
  let overlay, modalBox;
  const checkElements = () => {
    overlay = document.querySelector('.dynamic-accomplishment-modal');
    modalBox = overlay?.querySelector('.modal-box');
    return !!overlay && !!modalBox;
  };

  if (checkElements()) {
    console.log('Modal elements found immediately');
  } else {
    console.log('Elements not found immediately - retrying with RAF');
    requestAnimationFrame(() => {
      if (checkElements()) {
        console.log('Elements found after RAF');
      } else {
        // Fallback retry with timeout (rare case)
        setTimeout(() => {
          if (checkElements()) {
            console.log('Elements found after timeout retry');
          } else {
            console.error('Modal elements still not found after retries. Check HTML insertion.');
            return;
          }
        }, 100);
      }
    });
    return;  // Exit if not found yet; RAF will handle
  }

  // Animate in
  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.animation = 'none';
    modalBox.style.transform = 'scale(1) translateY(0)';
    modalBox.style.animation = 'none';
  }, 10);

  // Inject styles (once)
  if (!document.querySelector('#dynamic-accomplishment-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-accomplishment-styles';
    style.textContent = `
      .photo-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; justify-items: center; }
      .photo-preview-item { transition: box-shadow 0.2s ease; position: relative; }
      .photo-preview-item:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.1); transform: scale(1.02); }
      .photo-preview-item:hover .zoom-icon-overlay { display: flex !important; opacity: 1; }
      .zoom-icon-overlay { display: none; opacity: 0; transition: opacity 0.2s ease; pointer-events: none; }
      #dynamic-close-btn:hover { background: #f3f4f6; color: #374151; transform: scale(1.05); border-color: #d1d5db; }
      #dynamic-footer-close:hover { background: #dc2626; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(239,68,68,0.2); }
      
      /* FIXED Lightbox CSS */
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
      
      /* Drag */
      .dragging { cursor: grabbing !important; }
      .dragging * { cursor: grabbing !important; user-select: none !important; }
      
      /* Tables */
      .dynamic-accomplishment-modal table td { border-color: #e5e7eb !important; }
      .dynamic-accomplishment-modal table tr:nth-child(even) td { background: #fafbfc; }
      
      /* Sections */
      .dynamic-accomplishment-modal div[style*="border: 1px solid #e5e7eb"][style*="margin-bottom: 24px"] { border-radius: 6px; }
      
      /* Lightbox no-select */
      .zoom-lightbox * { user-select: none !important; -webkit-user-select: none !important; }
      
      @media (max-width: 768px) { 
        .photo-gallery { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; } 
        .dynamic-accomplishment-modal { padding: 10px; } 
        .modal-box { max-width: 95vw; font-size: 14px; } 
        .dynamic-accomplishment-modal table { font-size: 14px; }
        [style*="cursor: move"] { cursor: default !important; }
        .dynamic-accomplishment-modal table td { padding: 10px 8px; }
        .zoom-icon-overlay { width: 36px; height: 36px; font-size: 14px; }
        .zoom-lightbox .lightbox-container { width: 95%; height: 95%; }
        .lightbox-img { cursor: default !important; }
      }
    `;
    document.head.appendChild(style);
    console.log('Styles injected');
  }

  // Close handlers
  let lightbox = null;
  let lightboxEscHandler = null;
  let originalScrollY = window.scrollY;
  let isDragging = false;  // For modal drag

  const closeModal = () => {
    overlay.style.opacity = '0';
    overlay.style.animation = 'fadeOut 0.3s ease-out';
    modalBox.style.transform = 'scale(0.95) translateY(-10px)';
    setTimeout(() => {
      overlay.remove();
      if (lightbox) {
        lightbox.classList.remove('active');
        lightbox.remove();
        lightbox = null;
      }
      if (lightboxEscHandler) {
        document.removeEventListener('keydown', lightboxEscHandler);
        lightboxEscHandler = null;
      }
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, originalScrollY);
    }, 300);
    document.removeEventListener('keydown', modalEscHandler);
  };

  const modalEscHandler = (e) => { if (e.key === 'Escape') closeModal(); };
  document.addEventListener('keydown', modalEscHandler);

  const closeBtn = overlay.querySelector('#dynamic-close-btn');
  const footerClose = overlay.querySelector('#dynamic-footer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (footerClose) footerClose.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  // Modal drag (header)
  const header = overlay.querySelector('#accomplishment-title > div[style*="1e40af"]');
  let startX, startY, initialLeft, initialTop;

  const makeDraggable = (elem) => {
    if (!elem) return;
    elem.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'IMG') return;
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
      modalBox.style.transform = 'none';
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

  if (header) makeDraggable(header);

  // FIXED Lightbox (full from previous)
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
    console.log('Lightbox created');
  }

  const container = lightbox.querySelector('.lightbox-container');
  const img = lightbox.querySelector('.lightbox-img');
  const resetBtn = lightbox.querySelector('.zoom-reset-btn');
  const closeBtnLightbox = lightbox.querySelector('.zoom-close');

  // State
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isPanning = false;
  let startPanX, startPanY, startTranslateX, startTranslateY;
  let lastTouchDistance = 0;
  let touchStart = null;
  let wheelTimeout = null;

  const resetZoom = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    img.style.transform = 'scale(1) translate(0px, 0px)';
    img.classList.remove('zoomed', 'grabbing');
    container.classList.remove('grabbing');
    container.style.cursor = 'zoom-in';
    console.log('Zoom reset');
  };

  const applyTransform = () => {
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const maxTranslateX = (containerRect.width - imgRect.width * scale) / 2;
    const maxTranslateY = (containerRect.height - imgRect.height * scale) / 2;
    translateX = Math.min(Math.max(translateX, maxTranslateX), -maxTranslateX);
    translateY = Math.min(Math.max(translateY, maxTranslateY), -maxTranslateY);

    img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    if (scale > 1) {
      img.classList.add('zoomed');
      container.style.cursor = 'grab';
    } else {
      img.classList.remove('zoomed');
      container.style.cursor = 'zoom-in';
    }
    console.log(`Transform: scale=${scale.toFixed(2)}, translate=(${translateX.toFixed(0)}, ${translateY.toFixed(0)})`);
  };

  // Wheel zoom
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wheelTimeout) clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale = Math.min(Math.max(scale * delta, 0.5), 4);
      applyTransform();
      console.log(`Wheel zoom to ${scale.toFixed(2)}`);
    }, 50);
  }, { passive: false });

  // Mouse pan
  container.addEventListener('mousedown', (e) => {
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
    console.log('Mouse pan start');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    e.preventDefault();
    translateX = startTranslateX + (e.clientX - startPanX);
    translateY = startTranslateY + (e.clientY - startPanY);
    applyTransform();
  });

  document.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      container.classList.remove('grabbing');
      img.classList.remove('grabbing');
      console.log('Mouse pan end');
    }
  });

  // Touch
  container.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    if (e.touches.length === 1 && scale > 1) {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startTranslateX = translateX;
      startTranslateY = translateY;
      console.log('Touch pan start');
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      console.log('Pinch start');
    }
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length === 1 && touchStart && scale > 1) {
      translateX = startTranslateX + (e.touches[0].clientX - touchStart.x);
      translateY = startTranslateY + (e.touches[0].clientY - touchStart.y);
      applyTransform();
    } else if (e.touches.length === 2) {
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
  }, { passive: false });

  container.addEventListener('touchend', (e) => {
    e.stopPropagation();
    touchStart = null;
    lastTouchDistance = 0;
    console.log('Touch end');
  }, { passive: false });

  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetZoom();
  });

  closeBtnLightbox.addEventListener('click', (e) => {
    e.stopPropagation();
    resetZoom();
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtnLightbox) {
      resetZoom();
      lightbox.classList.remove('active');
    }
  });

  lightboxEscHandler = (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      resetZoom();
      lightbox.classList.remove('active');
    }
  };
  document.addEventListener('keydown', lightboxEscHandler);

  // Update closeModal for lightbox
  const originalCloseModal = closeModal;
  closeModal = () => {
    originalCloseModal();
        resetZoom();
    lightbox.classList.remove('active');
    document.removeEventListener('keydown', lightboxEscHandler);
    if (wheelTimeout) clearTimeout(wheelTimeout);
    console.log('Modal closed: Lightbox cleaned up');
  };

  // FIXED Photo interactions: Hover + click with validation and pre-load
  const photoItems = overlay.querySelectorAll('.photo-preview-item');
  console.log(`Attaching events to ${photoItems.length} photo items`);
  photoItems.forEach((item, index) => {
    // Hover for zoom icon
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

    // Click to open lightbox
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) return;  // Avoid modal drag conflict

      const fullImgSrc = item.getAttribute('data-full-src');
      console.log(`Photo ${index + 1} clicked: src=${fullImgSrc}`);
      if (!fullImgSrc || fullImgSrc === '') {
        console.error('Invalid fullSrc on photo item');
        alert('Invalid image source.');  // Fallback (no Modal dep)
        return;
      }

      // Pre-load image for validation
      const tempImg = new Image();
      tempImg.onload = () => {
        console.log(`Image loaded: ${fullImgSrc}`);
        img.src = fullImgSrc;
        img.alt = `Zoomed evidence ${index + 1}`;
        resetZoom();
        lightbox.classList.add('active');
        console.log(`Lightbox opened for photo ${index + 1}`);
      };
      tempImg.onerror = () => {
        console.error(`Failed to load: ${fullImgSrc}`);
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2FiYWJhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
        img.alt = 'Image not available';
        resetZoom();
        lightbox.classList.add('active');
        alert('Image could not be loaded. Showing placeholder.');
      };
      tempImg.src = fullImgSrc;
    });
  });

  // Prevent body scroll while open
  originalScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${originalScrollY}px`;
  document.body.style.width = '100%';
  console.log('Body scroll locked');

  console.log('attachAccomplishmentModal completed: All events attached successfully');
}

// Global exposure for easy use (e.g., from onclick or other scripts)
window.mountAccomplishmentModal = mountAccomplishmentModal;

// Optional: Auto-test on load (remove in production)
// Uncomment below to demo on page load:
// setTimeout(() => mountAccomplishmentModal('auto-demo'), 1000);