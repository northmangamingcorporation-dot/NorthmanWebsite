// Load tickets from Firestore with real-time updates
function loadTickets() {
  const tbody = document.getElementById("ticketsTable");
  if (!tbody) {
    console.warn("ticketsTable not found.");
    return;
  }
  
  // Show loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="5" style="padding: 40px; text-align: center;">
        <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #10b981;"></i>
        <p style="margin-top: 16px; color: #64748b;">Loading tickets...</p>
      </td>
    </tr>
  `;

  setTimeout(() => {
    if (!window.db) {
      console.error('Database not initialized');
      tbody.innerHTML = `
        <tr class="no-data-row">
          <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
              <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #fee2e2, #fecaca);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <i class="fas fa-exclamation-triangle" style="font-size: 36px; color: #ef4444;"></i>
              </div>
              <div>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                  Database not initialized
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                  Please refresh the page or contact support
                </p>
              </div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    // Use real-time listener with docChanges for efficient updates
    window.db.collection('ticket_humanErr_report')
      .orderBy('submittedAt', 'desc')
      .limit(100)
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          tbody.innerHTML = `
            <tr class="no-data-row">
              <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                  <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <i class="fas fa-clipboard-list" style="font-size: 36px; color: #10b981;"></i>
                  </div>
                  <div>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                      No tickets yet
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                      Click "New Ticket" to paste and analyze a ticket
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          `;
          loadedTicketIds.clear();
          updateTellerRankings([]);
          return;
        }

        // Remove no-data row if exists
        const noDataRow = tbody.querySelector('.no-data-row');
        if (noDataRow) noDataRow.remove();

        // Track all tickets for rankings
        const allTickets = [];
        
        // Check if this is initial load
        const isInitialLoad = loadedTicketIds.size === 0;
        
        if (isInitialLoad) {
          // Initial load: build entire table in correct order
          let html = '';
          snapshot.forEach((doc) => {
            const ticketData = { ...doc.data(), id: doc.id };
            allTickets.push(ticketData);
            loadedTicketIds.add(doc.id);
            
            const rowHtml = renderTicketRow(ticketData);
            html += rowHtml.replace(/id="ticket-row-[^"]*"/, `id="ticket-row-${doc.id}"`);
          });
          tbody.innerHTML = html;
          console.log('Initial load: added', snapshot.size, 'tickets');
        } else {
          // Real-time updates: process only changes
          snapshot.docChanges().forEach((change) => {
            const doc = change.doc;
            const ticketData = { ...doc.data(), id: doc.id };
            
            if (change.type === 'added') {
              // Only add if not already loaded
              if (!loadedTicketIds.has(doc.id)) {
                const newRow = document.createElement('tr');
                newRow.id = `ticket-row-${doc.id}`;
                newRow.innerHTML = renderTicketRow(ticketData).replace(/<\/?tr[^>]*>/g, '');
                newRow.style.animation = 'slideInFromTop 0.4s ease-out';
                
                // Insert at the beginning (since orderBy desc)
                tbody.insertBefore(newRow, tbody.firstChild);
                loadedTicketIds.add(doc.id);
                
                console.log('New ticket added:', doc.id);
              }
            } else if (change.type === 'modified') {
              // Update existing row
              const existingRow = document.getElementById(`ticket-row-${doc.id}`);
              if (existingRow) {
                existingRow.innerHTML = renderTicketRow(ticketData).replace(/<\/?tr[^>]*>/g, '');
                existingRow.style.animation = 'pulse 0.3s ease';
                console.log('Ticket updated:', doc.id);
              }
            } else if (change.type === 'removed') {
              // Remove row
              const existingRow = document.getElementById(`ticket-row-${doc.id}`);
              if (existingRow) {
                existingRow.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => existingRow.remove(), 300);
                loadedTicketIds.delete(doc.id);
                console.log('Ticket removed:', doc.id);
              }
            }
          });
        }
        
        // Collect all current tickets for rankings
        snapshot.forEach((doc) => {
          allTickets.push({ ...doc.data(), id: doc.id });
        });
        
        // Update teller rankings
        updateTellerRankings(allTickets);
        
        console.log(`Total tickets: ${snapshot.size}`);
      }, (error) => {
        console.error('Error loading tickets:', error);
        tbody.innerHTML = `
          <tr class="no-data-row">
            <td colspan="5" style="padding: 60px 20px; text-align: center; border: none;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div style="
                  width: 80px;
                  height: 80px;
                  background: linear-gradient(135deg, #fee2e2, #fecaca);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <i class="fas fa-exclamation-triangle" style="font-size: 36px; color: #ef4444;"></i>
                </div>
                <div>
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px; font-weight: 600;">
                    Error loading tickets
                  </p>
                  <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                    ${error.message || 'Please try again later'}
                  </p>
                </div>
              </div>
            </td>
          </tr>
        `;
      });
  }, 500);
}

// Call loadTickets when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTickets);
} else {
  loadTickets();
}

// Expose loadTickets globally
window.loadTickets = loadTickets;