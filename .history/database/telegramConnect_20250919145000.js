window.TelegramConnect = (function () {
  const BOT_TOKEN = "YOUR_BOT_TOKEN"; // ⚠️ For testing only, unsafe in production
  const CHAT_ID = "YOUR_CHAT_ID";     // Bot sends all requests here

  let selectedFile = null;
  let referenceId = null;
  let currentRequestType = null;

  // DOM Elements
  const fileInput = document.getElementById("requestFileInput");
  const modal = document.getElementById("telegramRequestModal");
  const previewImage = document.getElementById("telegramPreviewImage");
  const referenceText = document.getElementById("telegramReferenceId");
  const typeText = document.getElementById("telegramRequestType");
  const confirmBtn = document.getElementById("telegramConfirmUploadBtn");
  const cancelBtn = document.getElementById("telegramCancelUploadBtn");

  // Open modal and preview
  function openModal(file, requestType) {
    selectedFile = file;
    currentRequestType = requestType;
    referenceId = `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;

    referenceText.textContent = `Reference ID: ${referenceId}`;
    typeText.textContent = `Request Type: ${requestType}`;

    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImage.src = ev.target.result;
        modal.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.src = "";
      modal.style.display = "block";
    }
  }

  // Confirm send
  confirmBtn.addEventListener("click", async () => {
    try {
      const captionText = `Request Type: ${currentRequestType}\nReference ID: ${referenceId}`;
      let res, data;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("chat_id", CHAT_ID);
        formData.append("document", selectedFile);
        formData.append("caption", captionText);

        res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
          method: "POST",
          body: formData
        });
        data = await res.json();
      } else {
        res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: captionText })
        });
        data = await res.json();
      }

      if (data.ok) {
        alert(`✅ ${currentRequestType} request sent!\nTelegram message ID: ${data.result.message_id || "N/A"}`);
      } else {
        alert(`❌ Telegram error: ${data.description}`);
      }

    } catch (err) {
      console.error("Telegram request error:", err);
      alert("❌ Error sending request");
    } finally {
      modal.style.display = "none";
      fileInput.value = "";
      selectedFile = null;
      referenceId = null;
      currentRequestType = null;
    }
  });

  // Cancel button
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    fileInput.value = "";
    selectedFile = null;
    referenceId = null;
    currentRequestType = null;
  });

  // Public API
  return {
    sendRequest: (file, requestType) => openModal(file, requestType),
    getCurrentReferenceId: () => referenceId
  };
})();
