window.TelegramConnect = (function () {
  

  let currentForm = null;
  let referenceId = null;
  let currentRequestType = null;

  // Inject modal HTML into the document body
  const modalHTML = `
    <div id="telegramRequestModal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
      <div class="modal-content" style="background:white; border-radius:8px; max-width:600px; width:90%; padding:20px; position:relative;">
        <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2 style="margin:0; font-size:1.25rem;">Telegram Request</h2>
          <button id="telegramCancelUploadBtn" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body" style="max-height:60vh; overflow:auto; margin-bottom:16px;">
          <p id="telegramReferenceId" style="font-weight:bold;"></p>
          <p id="telegramRequestType" style="font-weight:bold;"></p>
        </div>
        <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:8px;">
          <button id="telegramCancelUploadBtnFooter" style="padding:8px 16px; background:#ccc; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
          <button id="telegramConfirmUploadBtn" style="padding:8px 16px; background:#007bff; color:white; border:none; border-radius:4px; cursor:pointer;">Send to Telegram</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // DOM Elements
  const modal = document.getElementById("telegramRequestModal");
  const referenceText = document.getElementById("telegramReferenceId");
  const typeText = document.getElementById("telegramRequestType");
  const confirmBtn = document.getElementById("telegramConfirmUploadBtn");
  const cancelBtn = document.getElementById("telegramCancelUploadBtn");
  const cancelFooterBtn = document.getElementById("telegramCancelUploadBtnFooter");

  function openModal(formElement, requestType) {
    currentForm = formElement;
    currentRequestType = requestType;
    referenceId = `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;

    referenceText.textContent = `Reference ID: ${referenceId}`;
    typeText.textContent = `Request Type: ${requestType}`;

    // Optional preview
    const formDataPreview = {};
    new FormData(formElement).forEach((value, key) => {
      formDataPreview[key] = value instanceof File ? value.name : value;
    });

    modal.querySelector("#telegramFormPreview")?.remove();
    const pre = document.createElement("pre");
    pre.id = "telegramFormPreview";
    pre.textContent = JSON.stringify(formDataPreview, null, 2);
    modal.querySelector(".modal-body")?.appendChild(pre);

    modal.style.display = "flex";
  }

  async function sendFormToTelegram() {
    if (!currentForm) return;

    try {
      const formData = new FormData(currentForm);
      formData.append("Reference ID", referenceId);
      formData.append("Request Type", currentRequestType);

      // Separate files and text fields
      const textFields = {};
      const files = [];
      formData.forEach((value, key) => {
        if (value instanceof File && value.name) {
          files.push({ key, file: value });
        } else {
          textFields[key] = value;
        }
      });

      const captionText = Object.entries(textFields)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

      // Send files first
      for (const f of files) {
        const fileData = new FormData();
        fileData.append("chat_id", CHAT_ID);
        fileData.append("document", f.file);
        fileData.append("caption", captionText);

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
          method: "POST",
          body: fileData
        });
      }

      // If no files, just send text
      if (files.length === 0) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: captionText })
        });
      }

      alert(`✅ ${currentRequestType} request sent successfully!`);

    } catch (err) {
      console.error("Telegram request error:", err);
      alert("❌ Error sending request");
    } finally {
      modal.style.display = "none";
      currentForm.reset();
      currentForm = null;
      referenceId = null;
      currentRequestType = null;
    }
  }

  confirmBtn.addEventListener("click", sendFormToTelegram);
  cancelBtn.addEventListener("click", () => { modal.style.display = "none"; });
  cancelFooterBtn.addEventListener("click", () => { modal.style.display = "none"; });

  return {
    sendRequest: (formElement, requestType) => openModal(formElement, requestType),
    getCurrentReferenceId: () => referenceId
  };
})();
