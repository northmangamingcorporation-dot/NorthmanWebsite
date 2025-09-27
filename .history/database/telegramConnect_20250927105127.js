// database/telegramConnect.js

window.TelegramConnect = (function () {
  const BOT_TOKEN = "8371293203:AAEGWdqThHuXSWDf6CKDa3e74hgbqTxDYP4"; 
  const CHAT_ID = "-1003020976065"; 

  const mentions = {
    "IT Service Order": ["@Yong1961", "@Kaloiskie_IT", "@Kristinemdt"],
    "Travel Order": ["@MrCooperJosh", "@kimnanaeh", "Ke"],
    "Driver's Trip Ticket": ["@MrCooperJosh", "@kimnanaeh", "Ke"]
    // Add "Accomplishment Report" here if needed, e.g.: "Accomplishment Report": ["@user1"]
  };

  function escapeMarkdownV2(text) {
    if (!text) return "";
    return text.toString()
      .replace(/\\/g, "\\\\")
      .replace(/\*/g, "\\*")
      .replace(/_/g, "\\_")
      .replace(/\$/g, "\\$")  // Escaped for MarkdownV2 (only once)
      .replace(/\$/g, "\\$")
      .replace(/\$/g, "\\$")
      .replace(/\$/g, "\\$")
      .replace(/\$/g, "\\$")
      .replace(/~/g, "\\~")
      .replace(/`/g, "\\`")
      .replace(/>/g, "\\>")
      .replace(/#/g, "\\#")
      .replace(/\+/g, "\\+")
      .replace(/-/g, "\\-")
      .replace(/=/g, "\\=")
      .replace(/\|/g, "\\|")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\./g, "\\.")
      .replace(/!/g, "\\!");
  }

  async function sendMessage(message, parseMode = "MarkdownV2") {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: parseMode })
      });
      const data = await res.json();
      if (!data.ok) {
        console.error("Telegram sendMessage error:", data.description);
        throw new Error(data.description);
      }
      return data;
    } catch (err) {
      console.error("Telegram sendMessage request error:", err);
      throw err;
    }
  }

  async function sendDocument(file, caption = "") {
    try {
      const formData = new FormData();
      formData.append("chat_id", CHAT_ID);
      formData.append("document", file, file.name);
      if (caption) formData.append("caption", caption);

      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!data.ok) {
        console.error("Telegram sendDocument error:", data.description);
        throw new Error(data.description);
      }
      return data;
    } catch (err) {
      console.error("Telegram sendDocument request error:", err);
      throw err;
    }
  }

  // UPDATED: Send single photo (handles both URL strings and File objects)
  async function sendPhoto(photo, caption = "", id = "") {
    try {
      let res;
      let finalCaption = caption;
      if (id) {
        finalCaption += `\n<b>Reference ID:</b> ${id}`;
      }

      if (typeof photo === 'string') {
        // URL-based send (existing logic)
        res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: CHAT_ID, 
            photo: photo,  // URL to the photo
            caption: finalCaption,
            parse_mode: "HTML"
          })
        });
      } else if (photo instanceof File) {
        // File upload (for direct File objects from form)
        const formData = new FormData();
        formData.append("chat_id", CHAT_ID);
        formData.append("photo", photo, photo.name || 'photo.jpg');
        if (finalCaption) formData.append("caption", finalCaption);
        formData.append("parse_mode", "HTML");

        res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          body: formData
        });
      } else {
        throw new Error("Invalid photo type: must be URL string or File object");
      }

      const data = await res.json();
      if (!data.ok) {
        console.error("Telegram sendPhoto error:", data.description);
        throw new Error(data.description);
      }
      return data;
    } catch (err) {
      console.error("Telegram sendPhoto request error:", err);
      throw err;
    }
  }

  return {
    sendRequest: async function(dataObj, requestType, files = []) {
      const referenceId = dataObj.id || `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;

      // Special handling for "Accomplishment Report": Send text details, then photos (via files or URLs)
      if (requestType === "Accomplishment Report") {
        const id = dataObj.id || referenceId;
        const proofImages = dataObj.proofImages || [];  // URLs (backward compat)
        const proofFiles = files || [];  // Files (new, from selectedFiles)

        // Build and send text message with details (MarkdownV2)
        let message = `*📄 ${escapeMarkdownV2(requestType)}*\n`;
        message += `*Reference ID:* ${escapeMarkdownV2(id)}\n\n`;
        for (const [key, value] of Object.entries(dataObj)) {
          if (key !== 'id' && key !== 'uniquekey' && key !== 'status' && key !== 'dateSubmitted' && key !== 'updatedAt' && key !== 'proofImages') {
            let val = (value && value.toDate) ? value.toDate().toLocaleString() : value;
            message += `*${escapeMarkdownV2(key)}:* ${escapeMarkdownV2(val.toString())}\n`;
          }
        }
        const mentionList = mentions[requestType] || [];
        if (mentionList.length) {
          message += `\n*Attention:* ${mentionList.map(u => escapeMarkdownV2(u)).join(" ")}\n`;
        }
        message += `\n*Sent via:* Automated Request System`;

        try {
          await sendMessage(message);
          console.log("Telegram text message sent for Accomplishment Report.");
        } catch (err) {
          console.error("Failed to send text message:", err);
          throw err;  // Block if text fails
        }

        // Send photos (prefer files if provided, else URLs)
        const photosToSend = proofFiles.length > 0 ? proofFiles : proofImages;
        if (photosToSend.length > 0) {
          await SendPhotos(photosToSend, id, requestType);  // Use new method
        } else {
          console.log("No photos to send for Accomplishment Report.");
        }

        return;  // Exit early
      }

      // Existing logic for other request types (unchanged)
      const useMarkdown = files.length === 0;

      let message = "";
      if (useMarkdown) {
        message += `*📄 ${escapeMarkdownV2(requestType)}*\n`;
        message += `*Reference ID:* ${escapeMarkdownV2(referenceId)}\n\n`;
        for (const [key, value] of Object.entries(dataObj)) {
          let val = (value && value.toDate) ? value.toDate().toLocaleString() : value;
          message += `*${escapeMarkdownV2(key)}:* ${escapeMarkdownV2(val)}\n`;
        }
        const mentionList = mentions[requestType] || [];
        if (mentionList.length) {
          message += `\n*Attention:* ${mentionList.map(u => escapeMarkdownV2(u)).join(" ")}\n`;
        }
        message += `*Sent via:* Automated Request System`;
      } else {
        // Plain text
        message += `${requestType}\n`;
        message += `Reference ID: ${referenceId}\n\n`;
        for (const [key, value] of Object.entries(dataObj)) {
          let val = (value && value.toDate) ? value.toDate().toLocaleString() : value;
          message += `${key}: ${val}\n`;
        }
        const mentionList = mentions[requestType] || [];
        if (mentionList.length) {
          message += `\nAttention: ${mentionList.join(" ")}\n`;
        }
        message += `Sent via: Automated Request System`;
      }

      try {
        if (files.length) {
          // Send each file; only first file gets the message as caption
          for (let i = 0; i < files.length; i++) {
            const caption = i === 0 ? message : "";
            const resp = await sendDocument(files[i].file || files[i], caption);
            if (!resp.ok) console.error("Telegram error:", resp.description);
          }
        } else {
          await sendMessage(message);
        }
      } catch (err) {
        console.error("Telegram request error:", err);
        throw err;
      }
    },

    // NEW: Send multiple photos (handles Files or URLs, with ID in captions)
    SendPhotos: async function(photos, id, requestType = "Accomplishment Report") {
      if (!Array.isArray(photos) || photos.length === 0) {
        console.log("No photos provided to SendPhotos.");
        return;
      }

      console.log(`Sending ${photos.length} photos to Telegram for ID: ${id}`);

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        let caption = "";
        if (i === 0) {
          // Detailed caption for first photo
          caption = `📄 <b>${requestType}</b> - Proof Image ${i + 1} of ${photos.length}<br><br>Sent via: Automated Request System`;
        } else {
          // Simple caption for additional photos
          caption = `<b>Additional Proof Image ${i + 1} of ${photos.length}</b>`;
        }

        try {
          await sendPhoto(photo, caption, id);
          console.log(`Photo ${i + 1}/${photos.length} sent successfully for ID: ${id}`);
          // Delay to avoid rate limits (adjust if needed)
          if (i < photos.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (err) {
          console.error(`Failed to send photo ${i + 1}:`, err);
          // Continue with next photo (non-blocking)
        }
      }

      console.log("All photos processed for SendPhotos.");
    }
  };
})();