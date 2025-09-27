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

// --- Filter Table Function (improved with debugging) ---
function filterTable(tableId, searchTerm, columnIndexes) {
  console.log(`Filtering table '${tableId}' with term: "${searchTerm}" on columns: [${columnIndexes.join(', ')}]`); // Debug log

  const table = document.getElementById(tableId);
  if (!table) {
    console.error(`Table with ID '${tableId}' not found!`); // Error if table missing
    return;
  }

  const rows = table.getElementsByTagName("tr");
  if (rows.length <= 1) {
    console.warn("No data rows found in table."); // Warn if empty
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
      // Search in specified columns
      columnIndexes.forEach(colIndex => {
        if (colIndex >= 0 && colIndex < cells.length) {
          const cell = cells[colIndex];
          const cellText = cell.textContent || cell.innerText || ''; // Fallback for text extraction
          if (cellText.toLowerCase().includes(searchTerm.toLowerCase())) {
            shouldShow = true;
            return; // Early exit if match found
          }
        } else {
          console.warn(`Invalid column index ${colIndex} for row with ${cells.length} cells.`); // Debug invalid index
        }
      });
    }
    
    row.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  }

  console.log(`Filter complete: ${visibleCount} rows visible.`); // Debug log
  showNotification(`${visibleCount} results found.`, "info"); // Optional: User feedback (if showNotification exists)
}

// --- Attach Search Event Listener (with error handling) ---
function attachRequestSearch() {
  const requestSearch = document.getElementById("searchRequestsInput");
  if (!requestSearch) {
    console.error("Search input '#searchRequestsInput' not found!"); // Error if input missing
    return;
  }

  console.log("Attaching search listener to #searchRequestsInput"); // Debug log

  requestSearch.addEventListener("input", debounce(function() {
    const searchTerm = this.value || ''; // Ensure empty string if no value
    filterTable("adminRequestsTable", searchTerm, [1, 2, 4]); // Adjust indexes if needed: e.g., [0, 1, 3] for ID/Employee/Type/Desc
  }, 300));

  // Optional: Clear filter on Escape key
  requestSearch.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      this.value = "";
      filterTable("adminRequestsTable", "", [1, 2, 4]);
    }
  });
}

// --- Initialize (call this after DOM loads or table populates) ---
document.addEventListener("DOMContentLoaded", attachRequestSearch);

// If your table loads dynamically (e.g., after Firebase query), re-attach or call after load:
// Example: after loadOrders() or similar
// attachRequestSearch(); // Re-attach if elements were added dynamically