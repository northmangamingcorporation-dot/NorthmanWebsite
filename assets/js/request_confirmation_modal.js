// assets/js/request_modal.js

function renderGenericModal({ 
  title = "Request Details", 
  subtitle = "", 
  bodyContent = "", 
  photoUrl = "", 
  user = null 
}) {
  return `
    <div id="genericModal" class="modal-overlay">
      <div class="modal-card">
        <span id="closeGenericModal" class="modal-close">&times;</span>

        <!-- HEADER -->
        <div class="modal-header">
          <h2>${title}</h2>
          ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
        </div>

        <!-- BODY -->
        <div class="modal-body">
          ${bodyContent}

          ${photoUrl ? `
            <div class="photo-preview">
              <img src="${photoUrl}" alt="Preview" id="modalPreviewImg" />
            </div>
          ` : ""}
        </div>

        <!-- FOOTER -->
        <div class="modal-footer">
          <label>Department:</label>
          <select id="deptDropdown">
            <option value="">-- Select Department --</option>
            <option value="IT">IT</option>
            <option value="Technical">Technical</option>
            <option value="Admin">Admin</option>
            <option value="Operations">Operations</option>
          </select>

          <label>Assign to Staff:</label>
          <select id="staffDropdown" disabled>
            <option value="">-- Select Staff --</option>
          </select>

          <label>Status:</label>
          <select id="statusDropdown">
            <option value="">-- Select --</option>
            <option value="approve">Approve</option>
            <option value="deny">Deny</option>
          </select>

          <textarea id="denyRemarks" placeholder="Remarks (required if deny)" style="display:none;"></textarea>

          <button id="submitModalBtn">Submit</button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Viewer -->
    <div id="imageViewer" class="image-viewer">
      <img src="" id="fullImage" />
    </div>
  `;
}

function attachGenericModal(onSubmit, user) {
  const modal = document.getElementById("genericModal");
  const closeBtn = document.getElementById("closeGenericModal");
  const deptDropdown = document.getElementById("deptDropdown");
  const staffDropdown = document.getElementById("staffDropdown");
  const statusDropdown = document.getElementById("statusDropdown");
  const denyRemarks = document.getElementById("denyRemarks");
  const submitBtn = document.getElementById("submitModalBtn");

  // Close modal
  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Load staff from Firestore based on department
  deptDropdown.addEventListener("change", async (e) => {
    const dept = e.target.value;
    staffDropdown.innerHTML = `<option value="">-- Select Staff --</option>`;
    staffDropdown.disabled = true;

    if (!dept) return;

    try {
      const snapshot = await firebase.firestore()
        .collection("users")
        .where("department", "==", dept)
        .get();

      if (snapshot.empty) {
        staffDropdown.innerHTML = `<option value="">No staff in this department</option>`;
        return;
      }

      snapshot.forEach(doc => {
        const u = doc.data();
        staffDropdown.innerHTML += `<option value="${u.username}">${u.firstName} ${u.lastName}</option>`;
      });

      staffDropdown.disabled = false;
    } catch (err) {
      console.error("Error loading staff:", err);
      alert("Failed to load staff.");
    }
  });

  // Show remarks only if Deny is selected
  statusDropdown.addEventListener("change", (e) => {
    denyRemarks.style.display = e.target.value === "deny" ? "block" : "none";
  });

  // Handle submit
  submitBtn.addEventListener("click", () => {
    const dept = deptDropdown.value;
    const staff = staffDropdown.value;
    const status = statusDropdown.value;
    const remarks = denyRemarks.value.trim();

    if (!dept) return alert("Please select a department.");
    if (!staff) return alert("Please select a staff member.");
    if (!status) return alert("Please select a status.");
    if (status === "deny" && !remarks) return alert("Remarks required when denying.");

    onSubmit({
      dept,
      staff,
      status,
      remarks,
      user // 👈 pass back the user object
    });

    modal.remove();
  });

  // Photo preview click → fullscreen viewer
  const previewImg = document.getElementById("modalPreviewImg");
  const imageViewer = document.getElementById("imageViewer");
  const fullImage = document.getElementById("fullImage");

  if (previewImg) {
    previewImg.addEventListener("click", () => {
      fullImage.src = previewImg.src;
      imageViewer.style.display = "flex";
    });
  }

  // Close fullscreen on click
  imageViewer.addEventListener("click", () => {
    imageViewer.style.display = "none";
    fullImage.src = "";
  });

  // Drag + zoom on full image
  let isDragging = false, startX, startY, translateX = 0, translateY = 0, scale = 1;
  fullImage.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    fullImage.style.cursor = "grabbing";
  });
  window.addEventListener("mouseup", () => { 
    isDragging = false; 
    fullImage.style.cursor = "grab"; 
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    fullImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  });
  window.addEventListener("wheel", (e) => {
    if (imageViewer.style.display === "flex") {
      e.preventDefault();
      scale += e.deltaY * -0.001;
      scale = Math.min(Math.max(.5, scale), 3);
      fullImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
  });
}

function mountGenericModal(config) {
  closeAllModals?.();
  document.body.insertAdjacentHTML("beforeend", renderGenericModal(config));
  attachGenericModal(config.onSubmit, config.user);
}

window.mountGenericModal = mountGenericModal;

// --- Styles ---
const gStyle = document.createElement("style");
gStyle.innerHTML = `
  .modal-overlay {
    position: fixed;
    top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.5);
    display:flex; justify-content:center; align-items:center;
    z-index: 9999;
  }
  .modal-card {
    background:#fff;
    padding:20px;
    border-radius:12px;
    width:100%;
    max-width:600px;
    position:relative;
  }
  .modal-close {
    position:absolute; top:10px; right:14px;
    font-size:22px; cursor:pointer; color:#888;
  }
  .modal-header h2 { margin:0; font-size:20px; font-weight:600; }
  .modal-header .subtitle { font-size:14px; color:#666; }
  .modal-body { margin:20px 0; }
  .photo-preview img { max-width:100%; border-radius:8px; cursor:zoom-in; }
  .modal-footer { display:flex; flex-direction:column; gap:12px; }
  .modal-footer select, .modal-footer textarea, .modal-footer button {
    padding:8px; border-radius:6px; border:1px solid #ddd;
  }
  .modal-footer button {
    background:#4f46e5; color:#fff; cursor:pointer;
  }
  .modal-footer button:hover { background:#4338ca; }

  /* Fullscreen image viewer */
  .image-viewer {
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.8); display:none;
    justify-content:center; align-items:center;
    z-index:10000;
  }
  .image-viewer img {
    max-width:80%; max-height:80%;
    cursor:grab;
    transition: transform 0.1s ease;
  }
`;
document.head.appendChild(gStyle);
