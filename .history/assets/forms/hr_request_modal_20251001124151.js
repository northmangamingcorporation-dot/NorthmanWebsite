// Enhanced assets/js/hr_request_modal.js - Leave & Early Rest Day Forms

// Show Leave Request Modal
function showLeaveRequestModal() {
  // Check if user is already logged in with better UX
  const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  const user = JSON.parse(loggedInUser);
  if (document.getElementById('leaveRequestModal')) {
    document.getElementById('leaveRequestModal').remove();
  }
  
  document.body.insertAdjacentHTML('beforeend', renderLeaveRequestForm(user));
  
  // Initialize form functionality after DOM insertion
  setTimeout(() => initializeLeaveForm(), 100);
}

// Show Early Rest Request Modal
function showEarlyRestModal() {
  // Check if user is already logged in with better UX
  const loggedInUser = sessionStorage.getItem("loggedInUser") || localStorage.getItem("loggedInUser");
  const user = JSON.parse(loggedInUser);
  if (document.getElementById('earlyRestModal')) {
    document.getElementById('earlyRestModal').remove();
  }
  
  document.body.insertAdjacentHTML('beforeend', renderEarlyRestForm(user));
  
  // Initialize form functionality after DOM insertion
  setTimeout(() => initializeEarlyRestForm(), 100);
}

// Initialize Leave Form (Event Listeners & Validation)
function initializeLeaveForm() {
  const modal = document.getElementById('leaveRequestModal');
  const form = document.getElementById('leaveRequestForm');
  const submitBtn = document.getElementById('submitLeaveRequest');
  const cancelBtn = document.getElementById('cancelLeaveRequest');
  const closeBtn = document.getElementById('closeLeaveModal');
  const loadingOverlay = document.getElementById('leaveFormLoading');
  const startDateInput = form.querySelector('input[name="startDate"]');
  const endDateInput = form.querySelector('input[name="endDate"]');
  const totalDaysInput = form.querySelector('input[name="totalDays"]');
  const leaveTypeSelect = form.querySelector('select[name="leaveType"]');
  const reasonTextarea = form.querySelector('textarea[name="reason"]');

  if (!form) return;

  // Close modal handlers
  function closeModal() {
    if (modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }
  }

  cancelBtn?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Date change handler for total days calculation
  function calculateTotalDays() {
    const start = startDateInput.value;
    const end = endDateInput.value;
    
    if (start && end && new Date(end) >= new Date(start)) {
      const diffTime = Math.abs(new Date(end) - new Date(start));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
      totalDaysInput.value = diffDays;
      return diffDays;
    }
    
    totalDaysInput.value = '0';
    return 0;
  }

  startDateInput?.addEventListener('change', calculateTotalDays);
  endDateInput?.addEventListener('change', calculateTotalDays);

  // Character counter for reason
  function updateCharCounter() {
    const maxLength = 1000;
    const length = reasonTextarea.value.length;
    const counter = reasonTextarea.parentElement.querySelector('.char-counter') || 
                    document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = `${length}/${maxLength}`;
    
    if (!reasonTextarea.parentElement.querySelector('.char-counter')) {
      reasonTextarea.parentElement.appendChild(counter);
    }
    
    if (length > maxLength * 0.9) counter.classList.add('warning');
    else if (length > maxLength * 0.95) counter.classList.add('danger');
    else counter.classList.remove('warning', 'danger');
  }

  reasonTextarea?.addEventListener('input', debounce(updateCharCounter, 300));

  // Form validation
  function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[data-required="true"]');
    
    requiredFields.forEach(field => {
      const fieldContainer = field.closest('.form-group');
      const errorEl = fieldContainer.querySelector('.field-error');
      
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        errorEl.textContent = 'This field is required.';
        errorEl.classList.add('show');
      } else {
        field.style.borderColor = '#22c55e';
        field.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
        errorEl.classList.remove('show');
      }
    });

    // Additional validations
    const start = startDateInput.value;
    const end = endDateInput.value;
    if (start && end && new Date(end) < new Date(start)) {
      isValid = false;
      const errorEl = endDateInput.closest('.form-group').querySelector('.field-error');
      errorEl.textContent = 'End date must be after start date.';
      errorEl.classList.add('show');
    }

    // Enable/disable submit button
    if (isValid && calculateTotalDays() > 0 && leaveTypeSelect.value && reasonTextarea.value.trim()) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Complete Form First';
      submitBtn.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    }

    return isValid;
  }

  // Real-time validation
  form.addEventListener('input', debounce(validateForm, 300));
  form.addEventListener('change', validateForm);

  // Initial validation
  validateForm();

  // Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  const formData = new FormData(form);
  const leaveData = {
    username: window.currentUser?.username || '',
    employeeName: formData.get('employeeName'),
    department: formData.get('department'),
    type: formData.get('leaveType'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    totalDays: parseInt(formData.get('totalDays')),
    reason: formData.get('reason').trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    submittedBy: window.currentUser?.uid || ''
  };

  // Show loading
  loadingOverlay.style.display = 'flex';
  submitBtn.disabled = true;

  try {

    if (!window.db) {
        throw new Error('Database not initialized');
        }

        // ✅ Save to Firestore
        const docRef = await window.db.collection('leave_requests').add(leaveData);

        // ✅ Prepare final data object (merge Firestore ID + timestamps)
        const data = {
        id: `LR-${Date.now()}`, // use Firestore doc ID instead of TO-timestamp
        ...leaveData,
        status: "Pending",
        dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // ✅ Notify Telegram (HR + dept head)
        if (window.TelegramConnect && typeof window.TelegramConnect.sendRequest === 'function') {
        await window.TelegramConnect.sendRequest(data, 'Leave Request');
        }

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'form-message success show';
    successMsg.innerHTML = `
      <i class="fas fa-check-circle" style="margin-right: 8px; color: #16a34a;"></i>
      Leave request submitted successfully! It will be reviewed by HR.
    `;
    form.insertBefore(successMsg, form.firstElementChild);
    
    // Reset form and close after delay
    setTimeout(() => {
      form.reset();
      totalDaysInput.value = '0';
      closeModal();
      if (typeof loadLeaveRequests === 'function') loadLeaveRequests(); // Refresh dashboard
    }, 2000);

  } catch (error) {
    console.error('Error submitting leave request:', error);
    
    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-message error show';
    errorMsg.innerHTML = `
      <i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #dc2626;"></i>
      Error submitting request. Please try again.
    `;
    form.insertBefore(errorMsg, form.firstElementChild);
    
    setTimeout(() => errorMsg.remove(), 5000);
  } finally {
    loadingOverlay.style.display = 'none';
    submitBtn.disabled = false;
  }
});
}

// Initialize Early Rest Form (Event Listeners & Validation)
function initializeEarlyRestForm() {
  const modal = document.getElementById('earlyRestModal');
  const form = document.getElementById('earlyRestForm');
  const submitBtn = document.getElementById('submitRestRequest');
  const cancelBtn = document.getElementById('cancelRestRequest');
  const closeBtn = document.getElementById('closeRestModal');
  const loadingOverlay = document.getElementById('restFormLoading');
  const dateInput = form.querySelector('input[name="requestDate"]');
  const requestTypeSelect = form.querySelector('select[name="requestType"]');
  const reasonTextarea = form.querySelector('textarea[name="reason"]');

  if (!form) return;

  // Close modal handlers
  function closeModal() {
    if (modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }
  }

  cancelBtn?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Character counter for reason
  function updateCharCounter() {
    const maxLength = 1000;
    const length = reasonTextarea.value.length;
    const counter = reasonTextarea.parentElement.querySelector('.char-counter') || 
                    document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = `${length}/${maxLength}`;
    
    if (!reasonTextarea.parentElement.querySelector('.char-counter')) {
      reasonTextarea.parentElement.appendChild(counter);
    }
    
    if (length > maxLength * 0.9) counter.classList.add('warning');
    else if (length > maxLength * 0.95) counter.classList.add('danger');
    else counter.classList.remove('warning', 'danger');
  }

  reasonTextarea?.addEventListener('input', debounce(updateCharCounter, 300));

  // Form validation
  function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[data-required="true"]');
    
    requiredFields.forEach(field => {
      const fieldContainer = field.closest('.form-group');
      const errorEl = fieldContainer.querySelector('.field-error');
      
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        errorEl.textContent = 'This field is required.';
        errorEl.classList.add('show');
      } else {
        field.style.borderColor = '#f59e0b';
               field.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
        errorEl.classList.remove('show');
      }
    });

    // Enable/disable submit button
    if (
      isValid &&
      dateInput.value &&
      requestTypeSelect.value &&
      reasonTextarea.value.trim()
    ) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
      submitBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-times" style="color: #ef4444;"></i> Complete Form First';
      submitBtn.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    }

    return isValid;
  }

  // Real-time validation
  form.addEventListener('input', debounce(validateForm, 300));
  form.addEventListener('change', validateForm);

  // Initial validation
  validateForm();

  // Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const formData = new FormData(form);
  const restData = {
    username: window.currentUser?.username || '',
    employeeName: formData.get('employeeName'),
    department: formData.get('department'),
    type: formData.get('requestType'),
    date: formData.get('requestDate'),
    reason: formData.get('reason').trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    submittedBy: window.currentUser?.uid || ''
  };

  // Show loading
  loadingOverlay.style.display = 'flex';
  submitBtn.disabled = true;

  try {
        if (!window.db) {
        throw new Error('Database not initialized');
        }

        // ✅ Save to Firestore
        const docRef = await window.db.collection('early_rest_requests').add(restData);

        // ✅ Prepare final data object (merge Firestore ID + timestamps)
        const data = {
        id: `RD-${Date.now()}`, // use Firestore doc ID instead of TO-timestamp
        ...restData,
        status: "Pending",
        dateSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // ✅ Notify Telegram (HR + dept head)
        if (window.TelegramConnect && typeof window.TelegramConnect.sendRequest === 'function') {
        await window.TelegramConnect.sendRequest(data, 'Early Rest Day');
        }


    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'form-message success show';
    successMsg.innerHTML = `
      <i class="fas fa-check-circle" style="margin-right: 8px; color: #16a34a;"></i>
      Early rest request submitted successfully! It will be reviewed by HR.
    `;
    form.insertBefore(successMsg, form.firstElementChild);

    // Reset form and close after delay
    setTimeout(() => {
      form.reset();
      closeModal();
      if (typeof loadEarlyRestRequests === 'function') loadEarlyRestRequests(); // Refresh dashboard
    }, 2000);

  } catch (error) {
    console.error('Error submitting early rest request:', error);

    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-message error show';
    errorMsg.innerHTML = `
      <i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #dc2626;"></i>
      Error submitting request. Please try again.
    `;
    form.insertBefore(errorMsg, form.firstElementChild);

    setTimeout(() => errorMsg.remove(), 5000);
  } finally {
    loadingOverlay.style.display = 'none';
    submitBtn.disabled = false;
  }
});
}