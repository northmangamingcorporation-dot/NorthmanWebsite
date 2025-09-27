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