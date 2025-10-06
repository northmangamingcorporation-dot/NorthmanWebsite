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