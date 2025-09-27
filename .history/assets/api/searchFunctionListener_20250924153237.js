// ============================================
// IT Requests Search & Filter Functionality
// Compatible with Enhanced IT Requests Section HTML
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

// --- Attach Search Input Listener (with retry for dynamic content) ---
function attachRequestSearchListener() {
  let attempts = 0;
  const maxAttempts = 50; // Retry up to 5 seconds (50 * 100ms)
  const retryInterval = 100; // ms

  function tryAttach() {
    const requestSearch = document.getElementById("searchRequestsInput");

    if (!requestSearch) {
      attempts++;
      if (attempts < maxAttempts) {
        console.log(`Search input not found yet (attempt ${attempts}/${maxAttempts}). Retrying in ${retryInterval}ms...`);
        setTimeout(tryAttach, retryInterval);
        return;
      } else {
        console.error("Search input '#searchRequestsInput' not found after retries! Check HTML ID and loading order.");
        return;
      }
    }

    // Clear button (#clearSearchBtn from your HTML)
    const clearSearchBtn = document.getElementById("clearSearchBtn");

    console.log("Attaching search listener to #searchRequestsInput"); // Success log

    // Debounced input event for real-time search
    requestSearch.addEventListener("input", debounce(function() {
      const searchTerm = this.value || '';
      // Search in Employee (col 1), Type (col 2), Details (col 4)
      filterTable("adminRequestsTable", searchTerm, [1, 2, 4]);
    }, 300));

    // Clear button handler (resets search and shows all rows)
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", function(e) {
        e.preventDefault(); // Prevent any default button behavior
        requestSearch.value = "";
        filterTable("adminRequestsTable", "", [1, 2, 4]);
        requestSearch.focus(); // Refocus for better UX
        this.style.display = "none"; // Hide after clear
      });

      // Show/hide clear button based on input value
      requestSearch.addEventListener("input", function() {
        clearSearchBtn.style.display = this.value.trim() ? "block" : "none";
      });
    }

    // Clear filter on Escape key
    requestSearch.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        this.value = "";
        filterTable("adminRequestsTable", "", [1, 2, 4]);
        if (clearSearchBtn) clearSearchBtn.style.display = "none";
      }
    });

    // Initial state for clear button
    if (clearSearchBtn) clearSearchBtn.style.display = requestSearch.value.trim() ? "block" : "none";

    // Optional: MutationObserver for future dynamic changes (e.g., if section is re-loaded)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const newInput = document.getElementById("searchRequestsInput");
          if (newInput && newInput !== requestSearch) {
            console.log("Dynamic input detected; re-attaching listener.");
            attachRequestSearchListener(); // Re-attach
          }
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  tryAttach(); // Start attachment
}

// --- Attach Status/Type Filter Listeners ---
function attachFilterListeners() {
  const statusFilter = document.getElementById("statusFilter");
  const typeFilter = document.getElementById("typeFilter");

  if (statusFilter) {
    statusFilter.addEventListener("change", applyCombinedFilters);
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", applyCombinedFilters);
  }
}

// --- Combined Filter Function (search + status + type) ---
function applyCombinedFilters() {
  const searchInput = document.getElementById("searchRequestsInput");
  const searchTerm = searchInput ? searchInput.value : '';

  const statusFilter = document.getElementById("statusFilter")?.value || '';
  const typeFilter = document.getElementById("typeFilter")?.value || '';

  const table = document.getElementById("adminRequestsTable");
  if (!table) return;

  const rows = table.getElementsByTagName("tr");
  let visibleCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    if (cells.length === 0 || row.classList.contains("loading-state")) continue; // Skip loading row

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
        shouldShow = statusText.includes(statusFilter.toLowerCase());
      } else {
        shouldShow = false;
      }
    }

    // 3. Type filter (col 2: Type)
    if (shouldShow && typeFilter && typeFilter !== '') {
      const typeCell = cells[2];
      if (typeCell) {
        const typeText = (typeCell.textContent || typeCell.innerText || '').trim().toLowerCase();
        shouldShow = typeText.includes(typeFilter.toLowerCase());
      } else {
        shouldShow = false;
      }
    }

    row.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  }

  console.log(`Combined filter complete: ${visibleCount} rows visible.`); // Debug log
}

// --- Public API: Initialize Filters (call after dynamic table load) ---
function initRequestsFilters() {
  attachRequestSearchListener();
  attachFilterListeners();
}

// --- Auto-Initialize on DOM Load ---
function initializeOnLoad() {
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initRequestsFilters);
  } else {
    initRequestsFilters();
  }
}

initializeOnLoad();

// --- Export for Other Scripts ---
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce, filterTable, attachRequestSearchListener, attachFilterListeners, applyCombinedFilters, initRequestsFilters };
} else {
  window.requestsFilters = { debounce, filterTable, attachRequestSearchListener, attachFilterListeners, applyCombinedFilters, initRequestsFilters };
}