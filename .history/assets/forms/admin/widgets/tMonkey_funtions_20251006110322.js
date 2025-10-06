// Load Tampermonkey Scripts from Firestore
async function loadTampermonkeyScripts() {
  const tableBody = document.getElementById('tampermonkeyScriptsTable');
  const searchInput = document.getElementById('searchScriptsInput');
  const statusFilter = document.getElementById('scriptStatusFilter');
  
  try {
    const scriptsRef = collection(db, 'remote_scripts');
    const scriptsSnapshot = await getDocs(scriptsRef);
    
    let scripts = [];
    scriptsSnapshot.forEach(doc => {
      scripts.push({ id: doc.id, ...doc.data() });
    });
    
    // Update stats
    document.getElementById('totalScripts').textContent = scripts.length;
    document.getElementById('activeScripts').textContent = scripts.filter(s => s.enabled).length;
    document.getElementById('disabledScripts').textContent = scripts.filter(s => !s.enabled).length;
    
    function renderScripts() {
      let filtered = scripts;
      
      // Apply search filter
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(s => 
          s.scriptId?.toLowerCase().includes(searchTerm) ||
          s.changelog?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply status filter
      const status = statusFilter.value;
      if (status === 'active') {
        filtered = filtered.filter(s => s.enabled);
      } else if (status === 'disabled') {
        filtered = filtered.filter(s => !s.enabled);
      }
      
      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="8" class="empty-state">
              <i class="fas fa-code"></i>
              <p>No scripts found</p>
              <button class="btn btn-primary" onclick="showAddScriptModal()">
                <i class="fas fa-plus"></i> Add First Script
              </button>
            </td>
          </tr>
        `;
        return;
      }
      
      tableBody.innerHTML = filtered.map(script => `
        <tr>
          <td>
            <div class="user-cell">
              <div class="user-avatar script-avatar">
                <i class="fas fa-file-code"></i>
              </div>
              <div class="user-info">
                <strong>${script.scriptId || 'Unnamed Script'}</strong>
                <span class="user-meta">${script.description || 'No description'}</span>
              </div>
            </div>
          </td>
          <td><code class="script-id">${script.id}</code></td>
          <td>
            <span class="version-badge">v${script.version || '1.0'}</span>
          </td>
          <td>
            <span class="status-badge ${script.enabled ? 'status-active' : 'status-inactive'}">
              <i class="fas fa-circle"></i>
              ${script.enabled ? 'Active' : 'Disabled'}
            </span>
          </td>
          <td>${formatDate(script.updatedAt)}</td>
          <td>
            <span class="stat-pill info">
              <i class="fas fa-users"></i> ${script.activeUsers || 0}
            </span>
          </td>
          <td>
            <div class="changelog-preview" title="${script.changelog || 'No changelog'}">
              ${script.changelog ? truncate(script.changelog, 40) : '-'}
            </div>
          </td>
          <td>
            <div class="action-buttons">
              <button class="action-btn view" onclick="viewScript('${script.id}')" title="View Code">
                <i class="fas fa-eye"></i>
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
    }
    
    renderScripts();
    searchInput.addEventListener('input', renderScripts);
    statusFilter.addEventListener('change', renderScripts);
    
  } catch (error) {
    console.error('Error loading scripts:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load scripts</p>
          <button class="btn btn-secondary" onclick="loadTampermonkeyScripts()">
            <i class="fas fa-redo"></i> Retry
          </button>
        </td>
      </tr>
    `;
  }
}

// View Script Code
async function viewScript(scriptId) {
  try {
    const scriptDoc = await getDoc(doc(db, 'remote_scripts', scriptId));
    if (scriptDoc.exists()) {
      const script = scriptDoc.data();
      showCodeViewer(script);
    }
  } catch (error) {
    console.error('Error viewing script:', error);
  }
}

// Edit Script
async function editScript(scriptId) {
  try {
    const scriptDoc = await getDoc(doc(db, 'remote_scripts', scriptId));
    if (scriptDoc.exists()) {
      const script = scriptDoc.data();
      showScriptEditor(scriptId, script);
    }
  } catch (error) {
    console.error('Error loading script:', error);
  }
}

// Toggle Script Status
async function toggleScriptStatus(scriptId, enabled) {
  try {
    await updateDoc(doc(db, 'remote_scripts', scriptId), {
      enabled: enabled,
      updatedAt: new Date().toISOString()
    });
    
    Modal.show(`Script ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
    loadTampermonkeyScripts();
  } catch (error) {
    console.error('Error toggling script:', error);
    Modal.show('Failed to update script status', 'error');
  }
}

// Delete Script
async function deleteScript(scriptId) {
  if (!confirm('Are you sure you want to delete this script? This action cannot be undone.')) {
    return;
  }
  
  try {
    await deleteDoc(doc(db, 'remote_scripts', scriptId));
    Modal.show('Script deleted successfully', 'success');
    loadTampermonkeyScripts();
  } catch (error) {
    console.error('Error deleting script:', error);
    Modal.show('Failed to delete script', 'error');
  }
}

// Helper Functions
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'Yesterday';
  return date.toLocaleDateString();
}

function truncate(text, length) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

// Inject Tampermonkey Section Styles
function injectTampermonkeyStyles() {
  const existingStyle = document.querySelector('style[data-tampermonkey-styles]');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.setAttribute('data-tampermonkey-styles', 'true');
  style.textContent = `
    /* Tampermonkey Extensions Section Styles */
    
    .script-avatar {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
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

    .changelog-preview {
      font-size: 13px;
      color: #64748b;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.5;
    }

    .stat-pill.warning {
      background: rgba(251, 191, 36, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(251, 191, 36, 0.2);
    }

    .stat-pill.warning i {
      color: #f59e0b;
    }

    .status-badge.status-inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .action-btn.warning {
      background: rgba(251, 191, 36, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(251, 191, 36, 0.2);
    }

    .action-btn.warning:hover {
      background: #fef3c7;
      transform: translateY(-2px);
    }

    .action-btn.success {
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .action-btn.success:hover {
      background: #dcfce7;
      transform: translateY(-2px);
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
      height: 80vh;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideIn 0.4s ease;
    }

    .code-viewer-header {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .code-viewer-header h3 {
      margin: 0;
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

    .code-viewer-actions {
      display: flex;
      gap: 8px;
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
    }

    .code-viewer-body pre {
      margin: 0;
      padding: 24px;
      background: #0f172a;
      color: #e2e8f0;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 13px;
      line-height: 1.8;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .code-viewer-body code {
      color: #94a3b8;
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
      max-width: 1200px;
      height: 85vh;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideIn 0.4s ease;
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
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
    }

    .editor-meta-fields input::placeholder {
      color: rgba(255, 255, 255, 0.6);
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
    }

    .editor-toolbar button {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }

    .editor-toolbar button:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .code-editor-wrapper {
      flex: 1;
      overflow: auto;
      background: #0f172a;
    }

    .code-editor {
      width: 100%;
      height: 100%;
      min-height: 400px;
      padding: 24px;
      background: #0f172a;
      color: #e2e8f0;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 13px;
      line-height: 1.8;
      border: none;
      resize: none;
      outline: none;
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

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Scrollbar Styling */
    .code-viewer-body::-webkit-scrollbar,
    .code-editor-wrapper::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    .code-viewer-body::-webkit-scrollbar-track,
    .code-editor-wrapper::-webkit-scrollbar-track {
      background: #1e293b;
    }

    .code-viewer-body::-webkit-scrollbar-thumb,
    .code-editor-wrapper::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 6px;
    }

    .code-viewer-body::-webkit-scrollbar-thumb:hover,
    .code-editor-wrapper::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
  `;
  
  document.head.appendChild(style);
  console.log('Tampermonkey styles injected successfully');
}

// Auto-inject on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectTampermonkeyStyles);
} else {
  injectTampermonkeyStyles();
}

// Also expose globally for manual injection
window.injectTampermonkeyStyles = injectTampermonkeyStyles;