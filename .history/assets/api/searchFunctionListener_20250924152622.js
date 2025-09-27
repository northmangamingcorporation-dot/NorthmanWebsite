// ============================================
// IT Requests Search & Filter Functionality
// Listens to #searchRequestsInput (or .searchRequestsInput as fallback)
// ============================================

// --- Debounce Utility (prevents excessive calls during typing) ---
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

// --- Filter Table Function (searches across specified columns) ---
function filterTable(tableId, searchTerm, columnIndexes) {
  console.log(`Filtering table '${tableId}' with term: "${searchTerm}" on columns: [${columnIndexes.join(', ')}]`); // Debug log (remove in production)

  const table = document.getElementById(tableId);
  if (!table) {
    console.error(`Table with ID '${tableId}' not found!`);
    return;
  }

  const rows = table.getElementsByTagName("tr");
  if (rows.length <= 1) {
    console.warn("No data rows found in table.");
    return;
  }

  let visibleCount = 0;

  for (let i = 1; i < rows.length; i++) { // Skip header row (index 0)
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    
    if (cells.length === 0) continue; // Skip empty rows (e.g., loading states)

    let shouldShow = false;
    
    // If search term is empty, show all rows
    if (!searchTerm.trim()) {
      shouldShow = true;
    } else {
      // Search in specified columns (case-insensitive)
      columnIndexes.forEach(colIndex => {
        if (colIndex >= 0 && colIndex < cells.length) {
          const cell = cells[colIndex];
          const cellText = (cell.textContent || cell.innerText || '').trim();
          if (cellText.toLowerCase().includes(searchTerm.toLowerCase())) {
            shouldShow = true;
            return; // Early exit if match found
          }
        } else {
          console.warn(`Invalid column index ${colIndex} for row with ${cells.length} cells.`);
        }
      });
    }
    
    row.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  }

  console.log(`Filter complete: ${visibleCount} rows visible.`); // Debug log
  // Optional: Update a counter or show notification (if showNotification exists)
  // showNotification(`${visibleCount} results found.`, "info");
}

// --- Attach Search Input Listener (targets #searchRequestsInput or .searchRequestsInput) ---
function attachRequestSearchListener() {
  // Primary: Target by ID
  let requestSearch = document.getElementById("searchRequestsInput");
  
  // Fallback: Target by class if ID not found
  if (!requestSearch) {
    requestSearch = document.querySelector(".searchRequestsInput");
    if (!requestSearch) {
      console.error("Search input '#searchRequestsInput' or '.searchRequestsInput' not found!");
      return;
    }
    console.warn("Using class selector '.searchRequestsInput' as fallback (ID not found).");
  }

  // Optional: Clear button (if #clearSearchBtn exists in your HTML)
  const clearSearchBtn = document.getElementById("clearSearchBtn") || document.querySelector(".search-clear");

  console.log("Attaching search listener to search input"); // Debug log

  // Debounced input event for real-time search
  requestSearch.addEventListener("input", debounce(function() {
    const searchTerm = this.value || '';
    // Search in Employee (col 1), Type (col 2), Details (col 4) – adjust indexes if table changes
    filterTable("adminRequestsTable", searchTerm, [1, 2, 4]);
  }, 300));

  // Clear button handler (resets search and shows all rows) – optional
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", function() {
      requestSearch.value = "";
      filterTable("adminRequestsTable", "", [1, 2, 4]);
      requestSearch.focus(); // Optional: Refocus for better UX
      // Hide clear button if needed (add CSS or toggle visibility)
      this.style.display = "none"; // Assuming it's hidden by default when empty
    });

    // Show/hide clear button based on input value
    requestSearch.addEventListener("input", function() {
      clearSearchBtn.style.display = this.value.trim() ? "block" : "none";
    });
  }

  // Optional: Clear filter on Escape key
  requestSearch.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      this.value = "";
      filterTable("adminRequestsTable", "", [1, 2, 4]);
      if (clearSearchBtn) clearSearchBtn.style.display = "none";
    }
  });

  // Initial clear (in case of pre-filled value)
  if (clearSearchBtn) clearSearchBtn.style.display = requestSearch.value.trim() ? "block" : "none";
}

// --- Optional: Attach Status/Type Filter Listeners (if dropdowns exist) ---
function attachFilterListeners() {
  const statusFilter = document.getElementById("statusFilter");
  const typeFilter = document.getElementById("typeFilter");

  if (statusFilter) {
    statusFilter.addEventListener("change", function() {
      applyCombinedFilters(); // Call a combined filter function
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", function() {
      applyCombinedFilters();
    });
  }
}

// --- Combined Filter Function (searches + status + type) ---
function applyCombinedFilters() {
  // Get current search term from the input
  let searchInput = document.getElementById("searchRequestsInput");
  if (!searchInput) searchInput = document.querySelector(".searchRequestsInput");
  const searchTerm = searchInput ? searchInput.value : '';

  // Get filter values (Status col 6, Type col 2)
  const statusFilter = document.getElementById("statusFilter")?.value || '';
  const typeFilter = document.getElementById("typeFilter")?.value || '';

  // Enhanced filterTable to handle all filters
  const table = document.getElementById("adminRequestsTable");
  if (!table) return;

  const rows = table.getElementsByTagName("tr");
  let visibleCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    if (cells.length === 0) continue;

    let shouldShow = true;

    // 1. Search filter (if term exists)
    if (searchTerm.trim()) {
      let searchMatch = false;
      [1, 2, 4].forEach(colIndex => { // Employee, Type, Details
        if (colIndex < cells.length) {
          const cellText = (cells[colIndex].textContent || cells[colIndex].innerText || '').trim();
          if (cellText.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchMatch = true;
          }
        }
      });
      shouldShow = searchMatch;
    }

    // 2. Status filter (col 6: Status)
    if (shouldShow && statusFilter && statusFilter !== '') {
      const statusCell = cells[6];
      if (statusCell) {
        const statusText = (statusCell.textContent || statusCell.innerText || '').trim().toLowerCase();
        const filterValue = statusFilter.toLowerCase();
        shouldShow = statusText.includes(filterValue);
      } else {
        shouldShow = false;
      }
    }

    // 3. Type filter (col 2: Type)
    if (shouldShow && typeFilter && typeFilter !== '') {
      const typeCell = cells[2];
      if (typeCell) {
        const typeText = (typeCell.textContent || typeCell.innerText || '').trim().toLowerCase();
        const filterValue = typeFilter.toLowerCase();
        shouldShow = typeText.includes(filterValue);
      } else {
        shouldShow = false;
      }
    }

    row.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  }

  console.log(`Combined filter complete: ${visibleCount} rows visible.`); // Debug log
}

// --- Public API: Re-attach Listeners (for dynamic table loading) ---
function initRequestsFilters() {
  attachRequestSearchListener();
  attachFilterListeners(); // Optional: For status/type filters
}

// --- Auto-Initialize on DOM Load ---
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initRequestsFilters);
} else {
  // DOM already loaded
  initRequestsFilters();
}

// --- Export Functions (for use in other scripts, e.g., after dynamic load) ---
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce, filterTable, attachRequestSearchListener, attachFilterListeners, applyCombinedFilters, initRequestsFilters };
} else {
  window.requestsFilters = { debounce, filterTable, attachRequestSearchListener, attachFilterListeners, applyCombinedFilters, initRequestsFilters };
}