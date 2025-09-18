// assets/js/it_service_order_form_modal.js

function renderITServiceOrderForm() {
  return `
    <div id="itServiceModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 p-4 overflow-auto" style>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative">

        <!-- Close button -->
        <button id="closeITServiceModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>

        <h2 class="text-3xl font-semibold text-teal-500 mb-6 text-center">IT Service Order Form</h2>

        <form id="itServiceForm" class="space-y-6">

          <!-- Employee Info Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block font-medium mb-1">Full Name <span class="text-red-500">*</span></label>
              <input type="text" name="name" placeholder="John Doe" required
                     class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            </div>
            <div>
              <label class="block font-medium mb-1">Department <span class="text-red-500">*</span></label>
              <input type="text" name="department" placeholder="IT" required
                     class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            </div>
            <div>
              <label class="block font-medium mb-1">Position</label>
              <input type="text" name="position" placeholder="System Administrator"
                     class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            </div>
            <div class="md:col-span-2">
              <label class="block font-medium mb-1">Contact (Email/Phone) <span class="text-red-500">*</span></label>
              <input type="text" name="contact" placeholder="john@example.com" required
                     class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            </div>
          </div>

          <!-- Service Info Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block font-medium mb-1">Type of Request <span class="text-red-500">*</span></label>
              <select name="type" required
                      class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
                <option value="">Select Type</option>
                <option value="Hardware Issue">Hardware Issue</option>
                <option value="Software Installation">Software Installation</option>
                <option value="Network Problem">Network Problem</option>
                <option value="Account Access">Account Access</option>
                <option value="Peripheral Setup">Peripheral Setup</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Priority Level <span class="text-red-500">*</span></label>
              <select name="priority" required
                      class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Asset/Device Involved</label>
              <input type="text" name="asset" placeholder="Laptop, Printer, etc."
                     class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            </div>
            <div>
              <label class="block font-medium mb-1">Location</label>
              <input type="text" name="location" placeholder="Office / Building"
                     class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            </div>
            <div class="md:col-span-3">
              <label class="block font-medium mb-1">Problem / Request Description <span class="text-red-500">*</span></label>
              <textarea name="description" rows="4" placeholder="Describe the problem..." required
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none"></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-4">
            <button type="button" id="cancelITForm"
                    class="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">
              Cancel
            </button>
            <button type="submit"
                    class="px-6 py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 font-semibold">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  `;
}



function attachITServiceForm() {
  const modal = document.getElementById("itServiceModal");
  const form = document.getElementById("itServiceForm");

  document.getElementById("closeITServiceModal").addEventListener("click", () => modal.style.display = "none");
  document.getElementById("cancelITForm").addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    const id = "IT-" + Date.now();
    const data = { id, ...formData, status: "Pending", dateSubmitted: serverTimestamp() };

    try {
      await setDoc(doc(collection(db, "it_service_orders"), id), data);
      alert(`✅ IT Service Order Submitted!\nReference ID: ${id}`);
      modal.style.display = "none";
      form.reset();
    } catch (err) {
      console.error("❌ Error saving IT Service Order:", err);
      alert("Error submitting request. Please try again.");
    }
  });
}

function mountITServiceForm() {
  if (!document.getElementById("itServiceModal")) {
    document.body.insertAdjacentHTML("beforeend", renderITServiceOrderForm());
    attachITServiceForm();
  }
  const modal = document.getElementById("itServiceModal");
  if (modal) modal.style.display = "flex";
}

window.mountITServiceForm = mountITServiceForm;
