// assets/js/it_service_order_form_modal.js

function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative">
        
        <button id="closeITServiceModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        
        <h2 class="text-2xl font-semibold text-teal-500 mb-6">IT Service Order Form</h2>

        <form id="itServiceForm" class="space-y-4">

          <div class="grid grid-cols-2 gap-4">
            <!-- Requester Info -->
            <div>
              <label class="block font-medium mb-1">Full Name</label>
              <input type="text" name="name" placeholder="John Doe" required
                     class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
            </div>

            <div>
              <label class="block font-medium mb-1">Department</label>
              <input type="text" name="department" placeholder="IT" required
                     class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
            </div>

            <div>
              <label class="block font-medium mb-1">Position</label>
              <input type="text" name="position" placeholder="System Administrator"
                     class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
            </div>

            <div>
              <label class="block font-medium mb-1">Contact (Email/Phone)</label>
              <input type="text" name="contact" placeholder="john@example.com" required
                     class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
            </div>

            <!-- Request Details -->
            <div>
              <label class="block font-medium mb-1">Type of Request</label>
              <select name="type" required
                      class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
                <option value="Hardware Issue">Hardware Issue</option>
                <option value="Software Installation">Software Installation</option>
                <option value="Network Problem">Network Problem</option>
                <option value="Account Access">Account Access</option>
                <option value="Peripheral Setup">Peripheral Setup</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block font-medium mb-1">Priority Level</label>
              <select name="priority" required
                      class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label class="block font-medium mb-1">Asset/Device Involved</label>
              <input type="text" name="asset" placeholder="Laptop, Printer, etc."
                     class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
            </div>

            <div>
              <label class="block font-medium mb-1">Location</label>
              <input type="text" name="location" placeholder="Office / Building"
                     class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500">
            </div>

            <!-- Full-width description -->
            <div class="col-span-2">
              <label class="block font-medium mb-1">Problem / Request Description</label>
              <textarea name="description" rows="4" placeholder="Describe the problem..." required
                        class="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500"></textarea>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 mt-4">
            <button type="button" id="cancelITForm"
                    class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit"
                    class="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  `;
}

// Attach events
function attachITServiceForm() {
  const modal = document.getElementById("itServiceModal");
  const form = document.getElementById("itServiceForm");

  const closeModal = () => modal.classList.add('hidden');
  
  document.getElementById("closeITServiceModal").addEventListener("click", closeModal);
  document.getElementById("cancelITForm").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    const id = "IT-" + Date.now();
    const data = { id, ...formData, status: "Pending", dateSubmitted: serverTimestamp() };

    try {
      await setDoc(doc(collection(db, "it_service_orders"), id), data);
      alert(`✅ IT Service Order Submitted!\nReference ID: ${id}`);
      closeModal();
      form.reset();
    } catch (err) {
      console.error("❌ Error saving IT Service Order:", err);
      alert("Error submitting request. Please try again.");
    }
  });
}

// Mount function using Tailwind hidden toggle
function mountITServiceForm() {
  let modal = document.getElementById("itServiceModal");
  if (!modal) {
    document.body.insertAdjacentHTML("beforeend", renderITServiceOrderForm());
    attachITServiceForm();
    modal = document.getElementById("itServiceModal");
  }
  modal.classList.remove('hidden'); // Show modal
}

window.mountITServiceForm = mountITServiceForm;
