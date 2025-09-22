window.TelegramConnect = (function () {
  const BOT_TOKEN = "8371293203:AAEGWdqThHuXSWDf6CKDa3e74hgbqTxDYP4"; // ⚠️ Testing only
  const CHAT_ID = "3020976065";

  let currentForm = null;
  let referenceId = null;
  let currentRequestType = null;

  // DOM Elements
  const modal = document.getElementById("telegramRequestModal");
  const referenceText = document.getElementById("telegramReferenceId");
  const typeText = document.getElementById("telegramRequestType");
  const confirmBtn = document.getElementById("telegramConfirmUploadBtn");
  const cancelBtn = document.getElementById("telegramCancelUploadBtn");

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

    modal.style.display = "block";
  }

  confirmBtn.addEventListener("click", async () => {
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
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    currentForm = null;
    referenceId = null;
    currentRequestType = null;
  });

  return {
    sendRequest: (formElement, requestType) => openModal(formElement, requestType),
    getCurrentReferenceId: () => referenceId
  };
})();
