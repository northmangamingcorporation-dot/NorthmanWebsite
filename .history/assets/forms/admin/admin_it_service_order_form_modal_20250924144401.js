// --- Render Admin IT Service Modal Content (using enhanced classes) ---
function renderAdminITServiceModalContent(orderData, admin) {
  return `
    <div class="admin-it-service-modal">
      <!-- Section: Employee Info -->
      <div class="modal-section">
        <h3 class="section-title">
          <i class="fas fa-user"></i>
          Employee Information
        </h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Employee Name</label>
            <input name="employeeName" value="${orderData.username || ''}" disabled class="form-input disabled">
          </div>
          <div class="form-group">
            <label>Department</label>
            <input name="department" value="${orderData.department || ''}" disabled class="form-input disabled">
          </div>
          <div class="form-group">
            <label>Position</label>
            <input name="position" value="${orderData.position || ''}" disabled class="form-input disabled">
          </div>
          <div class="form-group full-width">
            <label>Contact</label>
            <input name="contact" value="${orderData.email || orderData.contact || ''}" disabled class="form-input disabled">
          </div>
        </div>
      </div>

      <!-- Section: Service Info -->
      <div class="modal-section">
        <h3 class="section-title">
          <i class="fas fa-cogs"></i>
          Service Request
        </h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Type</label>
            <input name="type" value="${orderData.type || ''}" disabled class="form-input disabled">
          </div>
          <div class="form-group">
            <label>Priority</label>
            <input name="priority" value="${orderData.priority || ''}" disabled class="form-input disabled">
          </div>
          <div class="form-group">
            <label>Asset</label>
            <input name="asset" value="${orderData.asset || ''}" disabled class="form-input disabled">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input name="location" value="${orderData.location || ''}" disabled class="form-input disabled">
          </div>
          <div class="form-group full-width">
            <label>Description</label>
            <textarea name="description" rows="4" disabled class="form-textarea disabled">${orderData.description || ''}</textarea>
          </div>
        </div>
      </div>

      <!-- Section: Assignment -->
      <div class="modal-section">
        <h3 class="section-title">
          <i class="fas fa-user-plus"></i>
          Assignment
        </h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Assign To</label>
            <select id="staffDropdown" required class="form-select">
              <option value="">-- Select Staff --</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label>Remarks (optional)</label>
            <textarea id="adminRemarks" placeholder="Add any additional remarks or instructions..." rows="3" class="form-textarea"></textarea>
          </div>
        </div>
      </div>

      <!-- Hidden context for form submission -->
      <input type="hidden" id="orderId" value="${orderData.id}">
      <input type="hidden" id="adminUsername" value="${admin.username || admin.firstName || ''}">
    </div>
  `;
}

// --- Attach Admin Modal Logic (enhanced with event delegation) ---
function attachAdminITServiceModal(modalElement) {
  const form = modalElement.querySelector('#adminITServiceForm');
  const staffDropdown = modalElement.querySelector('#staffDropdown');
  const closeBtn = modalElement.querySelector('.modal-close');
  const cancelBtn = modalElement.querySelector('#cancelAdminITService');

  // Close handlers
  closeBtn?.addEventListener('click', () => closeModal());
  cancelBtn?.addEventListener('click', () => closeModal());
  modalElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });

  // Form submission
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const staffVal = staffDropdown.value;
    const remarks = modalElement.querySelector('#adminRemarks').value.trim();
    const orderId = modalElement.querySelector('#orderId').value;
    const adminUsername = modalElement.querySelector('#adminUsername').value;

    if (!staffVal) {
      showNotification('Please select staff to assign.', 'warning');
      return;
    }

    showNotification('Assigning IT Service Request...', 'info');

    const [staffName, staffPos] = staffVal.split('|');

    try {
      // 1️⃣ Update original IT Service Order
      await db.collection('it_service_orders').doc(orderId).update({
        status: `Assigned to ${staffName} - ${staffPos}`,
        assignedStaff: staffName,
        assignedPosition: staffPos,
        reviewedBy: adminUsername,
        remarks,
        assignedAt: firebase.firestore.FieldValue.serverTimestamp() // ⏰ new field
      });

      // 2️⃣ Add to department_tasks (for staff)
      await db.collection('ITdepartment_tasks').add({
        relatedId: orderId,
        type: 'IT Service Order',
        staff: staffName,
        position: staffPos,
        department: admin.department || 'Unknown',
        status: 'Pending',
        remarks,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        details: { ...orderData } // Pass order data as details
      });

      closeModal();
      showNotification(`✅ Request assigned to ${staffName} - ${staffPos}`, 'success');
      
      // Refresh dashboard data if available
      if (window.loadOrders) {
        window.loadOrders();
      }

    } catch (err) {
      console.error('Error assigning IT service:', err);
      showNotification('Failed to assign request. Please try again.', 'error');
    }
  });

  // Populate staff dropdown dynamically (fetch on attach)
  async function populateStaffDropdown(adminDept) {
    staffDropdown.innerHTML = '<option value="">-- Loading staff... --</option>';
    
    try {
      const staffSnap = await db.collection('clients')
        .where('department', '==', adminDept)
        .where('status', '==', 'active') // Only active staff
        .get();

      staffDropdown.innerHTML = '<option value="">-- Select Staff --</option>';

      if (staffSnap.empty) {
        staffDropdown.innerHTML += '<option value="" disabled>No active staff found</option>';
        return;
      }

      staffSnap.forEach(doc => {
        const u = doc.data();
        if (u.position && u.username) {
          staffDropdown.innerHTML += `<option value="${u.username}|${u.position}">${u.username} - ${u.position}</option>`;
        }
      });

    } catch (err) {
      console.error('Error loading staff:', err);
      staffDropdown.innerHTML = '<option value="" disabled>Error loading staff</option>';
    }
  }

  // Call populate if admin data is available
  if (modalElement.currentContext?.admin?.department) {
    populateStaffDropdown(modalElement.currentContext.admin.department);
  }
}

// --- Mount Admin IT Service Modal (using enhanced modal system) ---
async function mountAdminITServiceModal(admin, orderData) {
  // Ensure modal styles are injected (from dashboard)
  if (!document.querySelector('#enhanced-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'enhanced-modal-styles';
    style.textContent = `
      .admin-it-service-modal {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .modal-section {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 20px;
      }
      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
      }
      .form-group.full-width {
        grid-column: 1 / -1;
      }
      .form-group label {
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 4px;
        font-size: 0.9rem;
      }
      .form-input, .form-select, .form-textarea {
        padding: 12px;
        border: 2px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
        color: var(--text-primary);
        font-size: 0.95rem;
        transition: var(--transition);
      }
      .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .form-input.disabled, .form-select:disabled, .form-textarea:disabled {
        background: #f8fafc;
        color: #9ca3af;
        cursor: not-allowed;
      }
      .form-textarea {
        resize: vertical;
        min-height: 80px;
      }
      #adminITServiceForm {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
        margin-top: 16px;
      }
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create modal using enhanced system
  const modalContent = renderAdminITServiceModalContent(orderData, admin);
  const modalHTML = createModal(
    'Review & Assign IT Service Request',
    `
      ${modalContent}
      <form id="adminITServiceForm" style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Form content injected above -->
        <div class="modal-actions">
          <button type="button" id="cancelAdminITService" class="btn btn-secondary">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-user-plus"></i> Assign Task
          </button>
        </div>
      </form>
    `
  );

  // Show modal
  const modalElement = showModal(modalHTML);

  // Attach logic to the shown modal
  modalElement.currentContext = { admin, orderData };
  attachAdminITServiceModal(modalElement);

  // Auto-focus on staff dropdown after a short delay
  setTimeout(() => {
    const staffDropdown = modalElement.querySelector('#staffDropdown');
    if (staffDropdown) staffDropdown.focus();
  }, 300);
}

// Export for global access
window.mountAdminITServiceModal = mountAdminITServiceModal;
window.renderAdminITServiceModalContent = renderAdminITServiceModalContent;
window.attachAdminITServiceModal = attachAdminITServiceModal;