// ============================================================================
// ADVANCED TAMPERMONKEY SCRIPT MANAGER - FULL SYSTEM
// ============================================================================

// Global state management
const ScriptManager = {
  state: {
    scripts: [],
    filteredScripts: [],
    currentScript: null,
    isLoading: false,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  },
  
  cache: {
    lastFetch: 0,
    cacheExpiry: 60000 // 1 minute
  }
};

// ============================================================================
// LOAD SCRIPTS FROM FIRESTORE (Compatible with Firebase v8)
// ============================================================================
async function loadTampermonkeyScripts(forceRefresh = false) {
  const tableBody = document.getElementById('tampermonkeyScriptsTable');
  const searchInput = document.getElementById('searchScriptsInput');
  const statusFilter = document.getElementById('scriptStatusFilter');
  const sortSelect = document.getElementById('scriptSortSelect');
  
  // Show loading state
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading scripts...</p>
        </td>
      </tr>
    `;
  }
  
  try {
    // Check cache
    const now = Date.now();
    if (!forceRefresh && ScriptManager.cache.lastFetch && 
        (now - ScriptManager.cache.lastFetch) < ScriptManager.cache.cacheExpiry) {
      console.log('Using cached scripts');
      renderScripts();
      return;
    }
    
    // Use Firebase v8 syntax
    const scriptsSnapshot = await db.collection('remote_scripts').get();
    
    ScriptManager.state.scripts = [];
    scriptsSnapshot.forEach(doc => {
      ScriptManager.state.scripts.push({ 
        id: doc.id, 
        ...doc.data(),
        sizeKB: doc.data().code ? (new Blob([doc.data().code]).size / 1024).toFixed(2) : 0
      });
    });
    
    ScriptManager.cache.lastFetch = now;
    
    // Update stats with animation
    updateStats();
    
    // Initial render
    renderScripts();
    
    // Setup event listeners
    if (searchInput) {
      searchInput.removeEventListener('input', handleSearch);
      searchInput.addEventListener('input', handleSearch);
    }
    
    if (statusFilter) {
      statusFilter.removeEventListener('change', handleFilter);
      statusFilter.addEventListener('change', handleFilter);
    }
    
    if (sortSelect) {
      sortSelect.removeEventListener('change', handleSort);
      sortSelect.addEventListener('change', handleSort);
    }
    
  } catch (error) {
    console.error('Error loading scripts:', error);
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load scripts</p>
            <small>${error.message}</small>
            <button class="btn btn-secondary" onclick="loadTampermonkeyScripts(true)">
              <i class="fas fa-redo"></i> Retry
            </button>
          </td>
        </tr>
      `;
    }
  }
}

// ============================================================================
// UPDATE STATISTICS
// ============================================================================
function updateStats() {
  const scripts = ScriptManager.state.scripts;
  
  const totalEl = document.getElementById('totalScripts');
  const activeEl = document.getElementById('activeScripts');
  const disabledEl = document.getElementById('disabledScripts');
  
  const totalCount = scripts.length;
  const activeCount = scripts.filter(s => s.enabled).length;
  const disabledCount = scripts.filter(s => !s.enabled).length;
  
  animateNumber(totalEl, totalCount);
  animateNumber(activeEl, activeCount);
  animateNumber(disabledEl, disabledCount);
}

function animateNumber(element, targetValue) {
  if (!element) return;
  
  const startValue = parseInt(element.textContent) || 0;
  const duration = 500;
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
}

// ============================================================================
// SEARCH, FILTER & SORT HANDLERS
// ============================================================================
function handleSearch(e) {
  renderScripts();
}

function handleFilter(e) {
  renderScripts();
}

function handleSort(e) {
  const [sortBy, sortOrder] = e.target.value.split('-');
  ScriptManager.state.sortBy = sortBy;
  ScriptManager.state.sortOrder = sortOrder;
  renderScripts();
}

// ============================================================================
// RENDER SCRIPTS TABLE
// ============================================================================
function renderScripts() {
  const tableBody = document.getElementById('tampermonkeyScriptsTable');
  const searchInput = document.getElementById('searchScriptsInput');
  const statusFilter = document.getElementById('scriptStatusFilter');
  
  if (!tableBody) return;
  
  let filtered = [...ScriptManager.state.scripts];
  
  // Apply search filter
  const searchTerm = searchInput?.value.toLowerCase() || '';
  if (searchTerm) {
    filtered = filtered.filter(s => 
      s.scriptId?.toLowerCase().includes(searchTerm) ||
      s.description?.toLowerCase().includes(searchTerm) ||
      s.changelog?.toLowerCase().includes(searchTerm) ||
      s.id?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply status filter
  const status = statusFilter?.value || 'all';
  if (status === 'active') {
    filtered = filtered.filter(s => s.enabled);
  } else if (status === 'disabled') {
    filtered = filtered.filter(s => !s.enabled);
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    const aVal = a[ScriptManager.state.sortBy] || '';
    const bVal = b[ScriptManager.state.sortBy] || '';
    
    if (ScriptManager.state.sortBy === 'updatedAt' || ScriptManager.state.sortBy === 'createdAt') {
      const aDate = new Date(aVal).getTime() || 0;
      const bDate = new Date(bVal).getTime() || 0;
      return ScriptManager.state.sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    }
    
    if (ScriptManager.state.sortBy === 'activeUsers') {
      return ScriptManager.state.sortOrder === 'desc' ? 
        (bVal || 0) - (aVal || 0) : (aVal || 0) - (bVal || 0);
    }
    
    const compareResult = String(aVal).localeCompare(String(bVal));
    return ScriptManager.state.sortOrder === 'desc' ? -compareResult : compareResult;
  });
  
  ScriptManager.state.filteredScripts = filtered;
  
  // Empty state
  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">
          <i class="fas fa-code"></i>
          <p>${searchTerm ? 'No scripts found matching your search' : 'No scripts found'}</p>
          <button class="btn btn-primary" onclick="showAddScriptModal()">
            <i class="fas fa-plus"></i> Add First Script
          </button>
        </td>
      </tr>
    `;
    return;
  }
  
  // Render script rows
  tableBody.innerHTML = filtered.map((script, index) => `
    <tr class="script-row" data-script-id="${script.id}" style="animation: fadeInUp 0.3s ease ${index * 0.05}s both;">
      <td>
        <div class="user-cell">
          <div class="user-avatar script-avatar" style="background: ${getScriptColor(script.scriptId)};">
            <i class="fas fa-file-code"></i>
          </div>
          <div class="user-info">
            <strong>${escapeHtml(script.scriptId || 'Unnamed Script')}</strong>
            <span class="user-meta">${escapeHtml(script.description || 'No description')}</span>
          </div>
        </div>
      </td>
      <td><code class="script-id" title="${script.id}">${truncate(script.id, 12)}</code></td>
      <td>
        <span class="version-badge" title="Version ${script.version || '1.0'}">
          v${script.version || '1.0'}
        </span>
      </td>
      <td>
        <span class="status-badge ${script.enabled ? 'status-active' : 'status-inactive'}">
          <i class="fas fa-circle"></i>
          ${script.enabled ? 'Active' : 'Disabled'}
        </span>
      </td>
      <td>
        <div class="date-cell">
          <span class="date-primary">${formatDate(script.updatedAt)}</span>
          <span class="date-secondary">${formatFullDate(script.updatedAt)}</span>
        </div>
      </td>
      <td>
        <span class="stat-pill ${script.activeUsers > 0 ? 'info' : 'secondary'}" title="${script.activeUsers || 0} active users">
          <i class="fas fa-users"></i> ${script.activeUsers || 0}
        </span>
      </td>
      <td>
        <span class="stat-pill secondary" title="Script size: ${script.sizeKB || 0} KB">
          <i class="fas fa-file-code"></i> ${script.sizeKB || 0} KB
        </span>
      </td>
      <td>
        <div class="changelog-preview" title="${escapeHtml(script.changelog || 'No changelog')}">
          ${script.changelog ? escapeHtml(truncate(script.changelog, 40)) : '-'}
        </div>
      </td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" onclick="viewScript('${script.id}')" title="View Code">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn primary" onclick="duplicateScript('${script.id}')" title="Duplicate">
            <i class="fas fa-copy"></i>
          </button>
          <button class="action-btn edit" onclick="editScript('${script.id}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn ${script.enabled ? 'warning' : 'success'}" 
                  onclick="toggleScriptStatus('${script.id}', ${!script.enabled})" 
                  title="${script.enabled ? 'Disable' : 'Enable'}">
            <i class="fas fa-power-off"></i>
          </button>
          <button class="action-btn danger" onclick="deleteScript('${script.id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  // Add row click handler for details
  document.querySelectorAll('.script-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (!e.target.closest('.action-buttons') && !e.target.closest('button')) {
        const scriptId = row.dataset.scriptId;
        viewScript(scriptId);
      }
    });
  });
}

// ============================================================================
// VIEW SCRIPT CODE
// ============================================================================
async function viewScript(scriptId) {
  try {
    // Use Firebase v8 syntax
    const scriptDoc = await db.collection('remote_scripts').doc(scriptId).get();
    if (scriptDoc.exists) {
      const script = { id: scriptDoc.id, ...scriptDoc.data() };
      showCodeViewer(script);
    }
  } catch (error) {
    console.error('Error viewing script:', error);
    Modal.show('Failed to load script', 'error');
  }
}

function showCodeViewer(script) {
  const existingModal = document.querySelector('.code-viewer-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'code-viewer-modal';
  modal.innerHTML = `
    <div class="code-viewer-container">
      <div class="code-viewer-header">
        <div>
          <h3>
            <i class="fas fa-code"></i>
            ${escapeHtml(script.scriptId || 'Unnamed Script')}
            <span class="version-info">v${script.version || '1.0'}</span>
          </h3>
          <div class="script-meta">
            <span><i class="fas fa-calendar"></i> ${formatFullDate(script.updatedAt)}</span>
            <span><i class="fas fa-users"></i> ${script.activeUsers || 0} users</span>
            <span><i class="fas fa-file"></i> ${script.sizeKB || 0} KB</span>
          </div>
        </div>
        <div class="code-viewer-actions">
          <button onclick="copyScriptCode('${script.id}')" title="Copy Code">
            <i class="fas fa-copy"></i> Copy
          </button>
          <button onclick="downloadScript('${script.id}')" title="Download">
            <i class="fas fa-download"></i> Download
          </button>
          <button onclick="exportScript('${script.id}')" title="Export JSON">
            <i class="fas fa-file-export"></i> Export
          </button>
          <button onclick="closeCodeViewer()" title="Close">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
      
      <div class="code-viewer-body">
        <pre><code id="viewerCode">${escapeHtml(script.code || '// No code available')}</code></pre>
      </div>
      
      <div class="code-viewer-footer">
        <div class="script-info">
          <span>${(script.code || '').split('\n').length} lines</span>
          <span>${(script.code || '').length} characters</span>
        </div>
        <button class="btn-edit" onclick="closeCodeViewer(); editScript('${script.id}')">
          <i class="fas fa-edit"></i> Edit Script
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCodeViewer();
  });
  
  // Syntax highlighting (basic)
  highlightCode();
}

function closeCodeViewer() {
  const modal = document.querySelector('.code-viewer-modal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  }
  if (typeof closeAllModals === "undefined") {
    window.closeAllModals = function() {
        document.querySelectorAll(".modal-overlay").forEach(el => el.remove());
    };
  }
}

// ============================================================================
// EDIT SCRIPT
// ============================================================================
async function editScript(scriptId) {
  try {
    // Use Firebase v8 syntax
    const scriptDoc = await db.collection('remote_scripts').doc(scriptId).get();
    if (scriptDoc.exists) {
      const script = { id: scriptDoc.id, ...scriptDoc.data() };
      showScriptEditor(scriptId, script);
    }
  } catch (error) {
    console.error('Error loading script:', error);
    Modal.show('Failed to load script for editing', 'error');
  }
}

function showScriptEditor(scriptId, script) {
  const existingModal = document.querySelector('.script-editor-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'script-editor-modal';
  modal.innerHTML = `
    <div class="script-editor-container">
      <div class="script-editor-header">
        <h3><i class="fas fa-edit"></i> Edit Script: ${escapeHtml(script.scriptId)}</h3>
        <div class="editor-meta-fields">
          <input type="text" id="editScriptId" value="${escapeHtml(script.scriptId || '')}" placeholder="Script ID*" required>
          <input type="text" id="editScriptVersion" value="${escapeHtml(script.version || '1.0')}" placeholder="Version*">
          <input type="text" id="editScriptDescription" value="${escapeHtml(script.description || '')}" placeholder="Description">
          <input type="text" id="editScriptChangelog" value="${escapeHtml(script.changelog || '')}" placeholder="Changelog" style="grid-column: 1 / -1;">
        </div>
      </div>
      
      <div class="script-editor-body">
        <div class="editor-toolbar">
          <button onclick="formatEditorCode()" title="Format Code">
            <i class="fas fa-indent"></i> Format
          </button>
          <button onclick="validateEditorScript()" title="Validate">
            <i class="fas fa-check-circle"></i> Validate
          </button>
          <button onclick="insertTemplate()" title="Insert Template">
            <i class="fas fa-file-code"></i> Template
          </button>
          <button onclick="undoEditor()" title="Undo">
            <i class="fas fa-undo"></i>
          </button>
          <button onclick="redoEditor()" title="Redo">
            <i class="fas fa-redo"></i>
          </button>
          <div class="editor-stats">
            <span id="lineCount">0 lines</span>
            <span id="charCount">0 chars</span>
            <span id="wordCount">0 words</span>
          </div>
        </div>
        
        <div class="code-editor-wrapper">
          <div class="line-numbers" id="lineNumbers"></div>
          <textarea id="editScriptCode" class="code-editor" spellcheck="false">${escapeHtml(script.code || '')}</textarea>
        </div>
      </div>
      
      <div class="script-editor-footer">
        <div class="editor-info">
          <i class="fas fa-info-circle"></i>
          <span id="editorStatus">Ready to save changes</span>
        </div>
        <div class="editor-actions">
          <button class="btn-cancel" onclick="closeScriptEditor()">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="btn-save" onclick="updateScript('${scriptId}')">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        closeScriptEditor();
      }
    }
  });
  
  setupEditor();
}

function closeScriptEditor() {
  const modal = document.querySelector('.script-editor-modal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  }
}

// ============================================================================
// UPDATE SCRIPT
// ============================================================================
async function updateScript(scriptId) {
  const scriptIdInput = document.getElementById('editScriptId');
  const versionInput = document.getElementById('editScriptVersion');
  const descriptionInput = document.getElementById('editScriptDescription');
  const changelogInput = document.getElementById('editScriptChangelog');
  const codeInput = document.getElementById('editScriptCode');
  
  const newScriptId = scriptIdInput.value.trim();
  const version = versionInput.value.trim();
  const description = descriptionInput.value.trim();
  const changelog = changelogInput.value.trim();
  const code = codeInput.value.trim();
  
  if (!newScriptId || !code) {
    updateEditorStatus('Script ID and code are required', 'error');
    Modal.show('Please fill in all required fields', 'error');
    return;
  }
  
  if (!validateEditorScript()) {
    Modal.show('Please fix script errors before saving', 'error');
    return;
  }
  
  try {
    updateEditorStatus('Updating script...', 'info');
    
    // Use Firebase v8 syntax
    await db.collection('remote_scripts').doc(scriptId).update({
      scriptId: newScriptId,
      version: version || '1.0',
      description: description,
      changelog: changelog,
      code: code,
      updatedAt: new Date().toISOString()
    });
    
    updateEditorStatus('Script updated successfully!', 'success');
    Modal.show('Script updated successfully!', 'success');
    
    setTimeout(() => {
      closeScriptEditor();
      loadTampermonkeyScripts(true);
    }, 1000);
    
  } catch (error) {
    console.error('Error updating script:', error);
    updateEditorStatus('Failed to update script', 'error');
    Modal.show('Failed to update script: ' + error.message, 'error');
  }
}

// ============================================================================
// ADD NEW SCRIPT
// ============================================================================
function showAddScriptModal() {
  const existingModal = document.querySelector('.script-editor-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'script-editor-modal';
  modal.innerHTML = `
    <div class="script-editor-container">
      <div class="script-editor-header">
        <h3><i class="fas fa-plus-circle"></i> Add New Tampermonkey Script</h3>
        <div class="editor-meta-fields">
          <input type="text" id="newScriptId" placeholder="Script ID (e.g., error-detector)*" required>
          <input type="text" id="newScriptVersion" placeholder="Version (e.g., 1.0)*" value="1.0">
          <input type="text" id="newScriptDescription" placeholder="Description">
          <input type="text" id="newScriptChangelog" placeholder="Changelog" style="grid-column: 1 / -1;">
        </div>
      </div>
      
      <div class="script-editor-body">
        <div class="editor-toolbar">
          <button onclick="formatEditorCode()" title="Format Code">
            <i class="fas fa-indent"></i> Format
          </button>
          <button onclick="validateEditorScript()" title="Validate">
            <i class="fas fa-check-circle"></i> Validate
          </button>
          <button onclick="insertTemplate()" title="Insert Template">
            <i class="fas fa-file-code"></i> Template
          </button>
          <button onclick="importScript()" title="Import File">
            <i class="fas fa-file-import"></i> Import
          </button>
          <div class="editor-stats">
            <span id="lineCount">0 lines</span>
            <span id="charCount">0 chars</span>
            <span id="wordCount">0 words</span>
          </div>
        </div>
        
        <div class="code-editor-wrapper">
          <div class="line-numbers" id="lineNumbers"></div>
          <textarea id="newScriptCode" class="code-editor" spellcheck="false" placeholder="// Paste your Tampermonkey script here..."></textarea>
        </div>
      </div>
      
      <div class="script-editor-footer">
        <div class="editor-info">
          <i class="fas fa-info-circle"></i>
          <span id="editorStatus">Ready to add script</span>
        </div>
        <div class="editor-actions">
          <button class="btn-cancel" onclick="closeAddScriptModal()">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="btn-save" onclick="saveNewScript()">
            <i class="fas fa-save"></i> Add Script
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAddScriptModal();
  });
  
  setupEditor();
}

function closeAddScriptModal() {
  const modal = document.querySelector('.script-editor-modal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  }
}

async function saveNewScript() {
  const scriptIdInput = document.getElementById('newScriptId');
  const versionInput = document.getElementById('newScriptVersion');
  const descriptionInput = document.getElementById('newScriptDescription');
  const changelogInput = document.getElementById('newScriptChangelog');
  const codeInput = document.getElementById('newScriptCode');
  
  const scriptId = scriptIdInput.value.trim();
  const version = versionInput.value.trim() || '1.0';
  const description = descriptionInput.value.trim();
  const changelog = changelogInput.value.trim() || 'Initial version';
  const code = codeInput.value.trim();
  
  if (!scriptId) {
    updateEditorStatus('Script ID is required', 'error');
    Modal.show('Please enter a Script ID', 'error');
    scriptIdInput.focus();
    return;
  }
  
  if (!code) {
    updateEditorStatus('Script code is required', 'error');
    Modal.show('Please enter script code', 'error');
    codeInput.focus();
    return;
  }
  
  if (!validateEditorScript()) {
    Modal.show('Please fix script errors before saving', 'error');
    return;
  }
  
  try {
    updateEditorStatus('Saving script...', 'info');
    
    // Check if script ID already exists (Firebase v8 syntax)
    const existingScripts = await db.collection('remote_scripts')
      .where('scriptId', '==', scriptId)
      .get();
    
    if (!existingScripts.empty) {
      updateEditorStatus('Script ID already exists', 'error');
      Modal.show('A script with this ID already exists. Please use a different ID.', 'error');
      scriptIdInput.focus();
      return;
    }
    
    const newScript = {
      scriptId: scriptId,
      version: version,
      description: description || 'No description provided',
      code: code,
      enabled: true,
      changelog: changelog,
      activeUsers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Use Firebase v8 syntax
    await db.collection('remote_scripts').add(newScript);
    
    updateEditorStatus('Script saved successfully!', 'success');
    Modal.show('Script added successfully!', 'success');
    
    // Clear draft
    localStorage.removeItem('tampermonkey_draft');
    
    setTimeout(() => {
      closeAddScriptModal();
      loadTampermonkeyScripts(true);
    }, 1000);
    
  } catch (error) {
    console.error('Error saving script:', error);
    updateEditorStatus('Failed to save script', 'error');
    Modal.show('Failed to save script: ' + error.message, 'error');
  }
}

// ============================================================================
// TOGGLE SCRIPT STATUS
// ============================================================================
async function toggleScriptStatus(scriptId, enabled) {
  try {
    // Use Firebase v8 syntax
    await db.collection('remote_scripts').doc(scriptId).update({
      enabled: enabled,
      updatedAt: new Date().toISOString()
    });
    
    Modal.show(`Script ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
    loadTampermonkeyScripts(true);
  } catch (error) {
    console.error('Error toggling script:', error);
    Modal.show('Failed to update script status', 'error');
  }
}

// ============================================================================
// DELETE SCRIPT
// ============================================================================
async function deleteScript(scriptId) {
  const script = ScriptManager.state.scripts.find(s => s.id === scriptId);
  const scriptName = script?.scriptId || 'this script';
  
  const confirmed = confirm(
    `Are you sure you want to delete "${scriptName}"?\n\n` +
    `This action cannot be undone and will affect ${script?.activeUsers || 0} active users.`
  );
  
  if (!confirmed) return;
  
  try {
    // Use Firebase v8 syntax
    await db.collection('remote_scripts').doc(scriptId).delete();
    Modal.show('Script deleted successfully', 'success');
    loadTampermonkeyScripts(true);
  } catch (error) {
    console.error('Error deleting script:', error);
    Modal.show('Failed to delete script', 'error');
  }
}

// ============================================================================
// DUPLICATE SCRIPT
// ============================================================================
async function duplicateScript(scriptId) {
  try {
    // Use Firebase v8 syntax
    const scriptDoc = await db.collection('remote_scripts').doc(scriptId).get();
    if (!scriptDoc.exists) {
      Modal.show('Script not found', 'error');
      return;
    }
    
    const originalScript = scriptDoc.data();
    const newScriptId = `${originalScript.scriptId}_copy_${Date.now()}`;
    
    const duplicatedScript = {
      ...originalScript,
      scriptId: newScriptId,
      description: `Copy of ${originalScript.description || originalScript.scriptId}`,
      changelog: 'Duplicated from original script',
      activeUsers: 0,
      enabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('remote_scripts').add(duplicatedScript);
    Modal.show('Script duplicated successfully', 'success');
    loadTampermonkeyScripts(true);
    
  } catch (error) {
    console.error('Error duplicating script:', error);
    Modal.show('Failed to duplicate script', 'error');
  }
}

// ============================================================================
// COPY, DOWNLOAD & EXPORT FUNCTIONS
// ============================================================================
async function copyScriptCode(scriptId) {
  try {
    // Use Firebase v8 syntax
    const scriptDoc = await db.collection('remote_scripts').doc(scriptId).get();
    if (scriptDoc.exists) {
      const script = scriptDoc.data();
      await navigator.clipboard.writeText(script.code);
      Modal.show('Code copied to clipboard!', 'success');
    }
  } catch (error) {
    console.error('Error copying code:', error);
    Modal.show('Failed to copy code', 'error');
  }
}

async function downloadScript(scriptId) {
  try {
    // Use Firebase v8 syntax
    const scriptDoc = await db.collection('remote_scripts').doc(scriptId).get();
    if (scriptDoc.exists) {
      const script = scriptDoc.data();
      const blob = new Blob([script.code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${script.scriptId || 'script'}.user.js`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Modal.show('Script downloaded successfully!', 'success');
    }
  } catch (error) {
    console.error('Error downloading script:', error);
    Modal.show('Failed to download script', 'error');
  }
}

async function exportScript(scriptId) {
  try {
    // Use Firebase v8 syntax
    const scriptDoc = await db.collection('remote_scripts').doc(scriptId).get();
    if (scriptDoc.exists) {
      const script = { id: scriptDoc.id, ...scriptDoc.data() };
      const jsonData = JSON.stringify(script, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${script.scriptId || 'script'}_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Modal.show('Script exported successfully!', 'success');
    }
  } catch (error) {
    console.error('Error exporting script:', error);
    Modal.show('Failed to export script', 'error');
  }
}

// ============================================================================
// EDITOR FUNCTIONS
// ============================================================================
function setupEditor() {
  const textarea = document.getElementById('newScriptCode') || document.getElementById('editScriptCode');
  if (!textarea) return;
  
  // Update line numbers and stats
  updateLineNumbers();
  updateEditorStats();
  
  // Auto-update on input
  textarea.addEventListener('input', () => {
    updateLineNumbers();
    updateEditorStats();
  });
  
  // Tab handling
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      updateLineNumbers();
      updateEditorStats();
    }
  });
  
  // Auto-save to localStorage
  textarea.addEventListener('input', debounce(() => {
    localStorage.setItem('tampermonkey_draft', textarea.value);
  }, 1000));
  
  // Load draft if exists
  const draft = localStorage.getItem('tampermonkey_draft');
  if (draft && !textarea.value) {
    if (confirm('Found unsaved draft. Would you like to restore it?')) {
      textarea.value = draft;
      updateLineNumbers();
      updateEditorStats();
    }
  }
}

function updateLineNumbers() {
  const textarea = document.getElementById('newScriptCode') || document.getElementById('editScriptCode');
  const lineNumbers = document.getElementById('lineNumbers');
  if (!textarea || !lineNumbers) return;
  
  const lines = textarea.value.split('\n').length;
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join('');
  
  // Sync scroll
  textarea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = textarea.scrollTop;
  });
}

function updateEditorStats() {
  const textarea = document.getElementById('newScriptCode') || document.getElementById('editScriptCode');
  if (!textarea) return;
  
  const code = textarea.value;
  const lines = code.split('\n').length;
  const chars = code.length;
  const words = code.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  const lineCountEl = document.getElementById('lineCount');
  const charCountEl = document.getElementById('charCount');
  const wordCountEl = document.getElementById('wordCount');
  
  if (lineCountEl) lineCountEl.textContent = `${lines} lines`;
  if (charCountEl) charCountEl.textContent = `${chars} chars`;
  if (wordCountEl) wordCountEl.textContent = `${words} words`;
}

function formatEditorCode() {
  const textarea = document.getElementById('newScriptCode') || document.getElementById('editScriptCode');
  if (!textarea) return;
  
  try {
    // Basic formatting
    const lines = textarea.value.split('\n');
    let formatted = [];
    let indentLevel = 0;
    
    for (let line of lines) {
      const trimmed = line.trim();
      
      // Decrease indent for closing braces
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add indentation
      formatted.push('  '.repeat(indentLevel) + trimmed);
      
      // Increase indent for opening braces
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }
    }
    
    textarea.value = formatted.join('\n');
    updateLineNumbers();
    updateEditorStats();
    updateEditorStatus('Code formatted successfully', 'success');
  } catch (error) {
    updateEditorStatus('Failed to format code', 'error');
  }
}

function validateEditorScript() {
  const textarea = document.getElementById('newScriptCode') || document.getElementById('editScriptCode');
  if (!textarea) return false;
  
  const code = textarea.value.trim();
  
  if (!code) {
    updateEditorStatus('Script code is empty', 'error');
    return false;
  }
  
  // Check for UserScript header
  if (!code.includes('// ==UserScript==')) {
    updateEditorStatus('Warning: Missing UserScript header', 'warning');
  }
  
  // Basic syntax check
  try {
    new Function(code);
    updateEditorStatus('Script validation passed', 'success');
    return true;
  } catch (error) {
    updateEditorStatus(`Syntax error: ${error.message}`, 'error');
    return false;
  }
}

function insertTemplate() {
  const textarea = document.getElementById('newScriptCode') || document.getElementById('editScriptCode');
  if (!textarea) return;
  
  if (textarea.value.trim() && !confirm('This will replace current content. Continue?')) {
    return;
  }
  
  textarea.value = `// ==UserScript==
// @name         New Tampermonkey Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enter description here
// @author       Your Name
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('Script loaded successfully!');
    
    // Your code here
    
})();`;
  
  updateLineNumbers();
  updateEditorStats();
  updateEditorStatus('Template inserted', 'success');
}

function importScript() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.js,.user.js,.txt';
  
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const textarea = document.getElementById('newScriptCode') || document.getElementById('editScriptCode');
      if (textarea) {
        textarea.value = event.target.result;
        updateLineNumbers();
        updateEditorStats();
        updateEditorStatus(`Imported: ${file.name}`, 'success');
      }
    };
    reader.readAsText(file);
  });
  
  input.click();
}

function undoEditor() {
  document.execCommand('undo');
  updateLineNumbers();
  updateEditorStats();
}

function redoEditor() {
  document.execCommand('redo');
  updateLineNumbers();
  updateEditorStats();
}

function updateEditorStatus(message, type = 'info') {
  const statusEl = document.getElementById('editorStatus');
  if (!statusEl) return;
  
  const icons = {
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle'
  };
  
  const colors = {
    info: '#64748b',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b'
  };
  
  statusEl.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
  statusEl.style.color = colors[type];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function truncate(text, length) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'Yesterday';
  if (hours < 168) return `${Math.floor(hours / 24)}d ago`;
  return date.toLocaleDateString();
}

function formatFullDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getScriptColor(scriptId) {
  const colors = [
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ef4444, #dc2626)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #6366f1, #4f46e5)'
  ];
  
  const hash = (scriptId || '').split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

function highlightCode() {
  // Basic syntax highlighting for JavaScript
  const codeEl = document.getElementById('viewerCode');
  if (!codeEl) return;
  
  let code = codeEl.textContent;
  
  // Keywords
  code = code.replace(/\b(function|const|let|var|if|else|for|while|return|async|await|try|catch)\b/g, 
    '<span style="color: #c678dd;">$1</span>');
  
  // Strings
  code = code.replace(/(['"`])(.*?)\1/g, 
    '<span style="color: #98c379;">$1$2$1</span>');
  
  // Comments
  code = code.replace(/(\/\/.*$)/gm, 
    '<span style="color: #5c6370; font-style: italic;">$1</span>');
  
  codeEl.innerHTML = code;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================
async function enableAllScripts() {
  if (!confirm('Enable all scripts? This will affect all users.')) return;
  
  try {
    const batch = writeBatch(db);
    ScriptManager.state.scripts.forEach(script => {
      const ref = doc(db, 'remote_scripts', script.id);
      batch.update(ref, { enabled: true, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
    Modal.show('All scripts enabled', 'success');
    loadTampermonkeyScripts(true);
  } catch (error) {
    console.error('Error enabling all scripts:', error);
    Modal.show('Failed to enable all scripts', 'error');
  }
}

async function disableAllScripts() {
  if (!confirm('Disable all scripts? This will affect all users immediately.')) return;
  
  try {
    const batch = writeBatch(db);
    ScriptManager.state.scripts.forEach(script => {
      const ref = doc(db, 'remote_scripts', script.id);
      batch.update(ref, { enabled: false, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
    Modal.show('All scripts disabled', 'success');
    loadTampermonkeyScripts(true);
  } catch (error) {
    console.error('Error disabling all scripts:', error);
    Modal.show('Failed to disable all scripts', 'error');
  }
}

// ============================================================================
// INJECT STYLES
// ============================================================================
function injectTampermonkeyStyles() {
  const existingStyle = document.querySelector('style[data-tampermonkey-styles]');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.setAttribute('data-tampermonkey-styles', 'true');
  style.textContent = `
    /* Tampermonkey Script Manager Styles */
    
    .loading-state, .empty-state, .error-state {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(139, 92, 246, 0.1);
      border-top-color: #8b5cf6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .script-row {
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .script-row:hover {
      background: rgba(139, 92, 246, 0.05);
      transform: translateX(4px);
    }
    
    .script-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
    }

    .script-id {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      background: rgba(139, 92, 246, 0.1);
      padding: 4px 8px;
      border-radius: 6px;
      color: #7c3aed;
      font-weight: 600;
      display: inline-block;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .version-badge {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      color: #1d4ed8;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .date-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .date-primary {
      font-weight: 600;
      color: #1e293b;
    }
    
    .date-secondary {
      font-size: 11px;
      color: #94a3b8;
    }

    .changelog-preview {
      font-size: 13px;
      color: #64748b;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stat-pill {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .stat-pill.info {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .stat-pill.secondary {
      background: rgba(100, 116, 139, 0.1);
      color: #475569;
      border: 1px solid rgba(100, 116, 139, 0.2);
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    .status-badge.status-active {
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    
    .status-badge.status-inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    .status-badge i {
      font-size: 8px;
    }

    .action-btn {
      background: rgba(100, 116, 139, 0.1);
      border: 1px solid rgba(100, 116, 139, 0.2);
      color: #475569;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 13px;
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
    }
    
    .action-btn.view {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
      border-color: rgba(59, 130, 246, 0.2);
    }
    
    .action-btn.view:hover {
      background: #dbeafe;
    }
    
    .action-btn.primary {
      background: rgba(139, 92, 246, 0.1);
      color: #7c3aed;
      border-color: rgba(139, 92, 246, 0.2);
    }
    
    .action-btn.primary:hover {
      background: #ede9fe;
    }
    
    .action-btn.edit {
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
      border-color: rgba(34, 197, 94, 0.2);
    }
    
    .action-btn.edit:hover {
      background: #dcfce7;
    }

    .action-btn.warning {
      background: rgba(251, 191, 36, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(251, 191, 36, 0.2);
    }

    .action-btn.warning:hover {
      background: #fef3c7;
    }

    .action-btn.success {
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .action-btn.success:hover {
      background: #dcfce7;
    }
    
    .action-btn.danger {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      border-color: rgba(239, 68, 68, 0.2);
    }
    
    .action-btn.danger:hover {
      background: #fee2e2;
    }

    /* Code Viewer Modal */
    .code-viewer-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }

    .code-viewer-container {
      background: #1e293b;
      width: 90%;
      max-width: 1200px;
      height: 85vh;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .code-viewer-header {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      padding: 20px 24px;
      color: white;
    }

    .code-viewer-header h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .code-viewer-header .version-info {
      font-size: 13px;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 12px;
    }
    
    .script-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      opacity: 0.9;
    }
    
    .script-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .code-viewer-actions {
      display: flex;
      gap: 8px;
      position: absolute;
      top: 20px;
      right: 24px;
    }

    .code-viewer-actions button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .code-viewer-actions button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .code-viewer-body {
      flex: 1;
      overflow: auto;
      padding: 0;
      background: #0f172a;
    }

    .code-viewer-body pre {
      margin: 0;
      padding: 24px;
      color: #e2e8f0;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 13px;
      line-height: 1.8;
    }

    .code-viewer-body code {
      color: #94a3b8;
    }
    
    .code-viewer-footer {
      background: #1e293b;
      padding: 16px 24px;
      border-top: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .script-info {
      display: flex;
      gap: 16px;
      color: #94a3b8;
      font-size: 13px;
    }
    
    .btn-edit {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .btn-edit:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }

    /* Script Editor Modal */
    .script-editor-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }

    .script-editor-container {
      background: white;
      width: 90%;
      max-width: 1400px;
      height: 90vh;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .script-editor-header {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      padding: 20px 24px;
      color: white;
    }

    .script-editor-header h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .editor-meta-fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .editor-meta-fields input {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
    }

    .editor-meta-fields input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    .editor-meta-fields input:focus {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .script-editor-body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .editor-toolbar {
      background: #f8fafc;
      padding: 12px 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .editor-toolbar button {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .editor-toolbar button:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    
    .editor-stats {
      margin-left: auto;
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #64748b;
    }

    .code-editor-wrapper {
      flex: 1;
      overflow: auto;
      background: #0f172a;
      display: flex;
      position: relative;
    }
    
    .line-numbers {
      background: #1e293b;
      color: #64748b;
      padding: 24px 12px;
      text-align: right;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 13px;
      line-height: 1.8;
      user-select: none;
      border-right: 1px solid #334155;
      overflow: hidden;
    }
    
    .line-numbers div {
      height: 24px;
    }

    .code-editor {
      flex: 1;
      padding: 24px;
      background: #0f172a;
      color: #e2e8f0;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 13px;
      line-height: 1.8;
      border: none;
      resize: none;
      outline: none;
      overflow-x: auto;
    }

    .script-editor-footer {
      background: #f8fafc;
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .editor-info {
      font-size: 13px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .editor-actions {
      display: flex;
      gap: 12px;
    }

    .editor-actions button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .editor-actions .btn-cancel {
      background: #f1f5f9;
      color: #475569;
    }

    .editor-actions .btn-cancel:hover {
      background: #e2e8f0;
    }

    .editor-actions .btn-save {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
    }

    .editor-actions .btn-save:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    /* Scrollbar Styling */
    .code-viewer-body::-webkit-scrollbar,
    .code-editor-wrapper::-webkit-scrollbar,
    .code-editor::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    .code-viewer-body::-webkit-scrollbar-track,
    .code-editor-wrapper::-webkit-scrollbar-track,
    .code-editor::-webkit-scrollbar-track {
      background: #1e293b;
    }

    .code-viewer-body::-webkit-scrollbar-thumb,
    .code-editor-wrapper::-webkit-scrollbar-thumb,
    .code-editor::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 6px;
    }

    .code-viewer-body::-webkit-scrollbar-thumb:hover,
    .code-editor-wrapper::-webkit-scrollbar-thumb:hover,
    .code-editor::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
  `;
  
  document.head.appendChild(style);
  console.log('Tampermonkey styles injected successfully');
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================
window.loadTampermonkeyScripts = loadTampermonkeyScripts;
window.viewScript = viewScript;
window.editScript = editScript;
window.deleteScript = deleteScript;
window.duplicateScript = duplicateScript;
window.toggleScriptStatus = toggleScriptStatus;
window.showAddScriptModal = showAddScriptModal;
window.closeAddScriptModal = closeAddScriptModal;
window.saveNewScript = saveNewScript;
window.showCodeViewer = showCodeViewer;
window.closeCodeViewer = closeCodeViewer;
window.showScriptEditor = showScriptEditor;
window.closeScriptEditor = closeScriptEditor;
window.updateScript = updateScript;
window.copyScriptCode = copyScriptCode;
window.downloadScript = downloadScript;
window.exportScript = exportScript;
window.formatEditorCode = formatEditorCode;
window.validateEditorScript = validateEditorScript;
window.insertTemplate = insertTemplate;
window.importScript = importScript;
window.undoEditor = undoEditor;
window.redoEditor = redoEditor;
window.updateEditorStatus = updateEditorStatus;
window.enableAllScripts = enableAllScripts;
window.disableAllScripts = disableAllScripts;
window.injectTampermonkeyStyles = injectTampermonkeyStyles;

// Auto-inject styles
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectTampermonkeyStyles);
} else {
  injectTampermonkeyStyles();
}

console.log('Advanced Tampermonkey Script Manager loaded successfully');