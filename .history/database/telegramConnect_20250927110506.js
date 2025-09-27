// database/telegramConnect.js

window.TelegramConnect = (function () {
  const BOT_TOKEN = "8371293203:AAEGWdqThHuXSWDf6CKDa3e74hgbqTxDYP4"; 
  const CHAT_ID = "-1003020976065"; 

  const mentions = {
    "IT Service Order": ["@Yong1961", "@Kaloiskie_IT", "@Kristinemdt"],
    "Travel Order": ["@MrCooperJosh", "@kimnanaeh", "Ke"],
    "Driver's Trip Ticket": ["@MrCooperJosh", "@kimnanaeh", "Ke"],
    "Accomplishment Report": []  // Add users if needed, e.g., ["@admin1"]
  };

  function escapeMarkdownV2(text) {
    if (!text) return "";
    return text.toString()
      .replace(/\\/g, "\\\\")
      .replace(/\*/g, "\\*")
      .replace(/_/g, "\\_")
      .replace(/\$/g, "\\$")  // Escaped for MarkdownV2
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

  // Helper: Check if item is a photo (File or URL)
  function isPhoto(item) {
    if (item instanceof File) {
      return item.type.startsWith('image/');
    } else if (typeof item === 'string') {
      const lower = item.toLowerCase();
      return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(lower);
    }
    return false;
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

  // Send single photo (handles both URL strings and File objects)
  async function sendPhoto(photo, caption = "", id = "") {
    try {
      let res;
      let finalCaption = caption;
      if (id) {
        finalCaption += `\n<b>Reference ID:</b> ${id}`;
      }

      if (typeof photo === 'string') {
        // URL-based send
        res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: CHAT_ID, 
            photo: photo,
            caption: finalCaption,
            parse_mode: "HTML"
          })
        });
      } else if (photo instanceof File) {
        // File upload
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

  // General: Send multiple photos (Files or URLs) for any request type
  async function SendPhotos(photos, id, requestType) {
    if (!Array.isArray(photos) || photos.length === 0) {
      console.log("No photos provided to SendPhotos.");
      return;
    }

    if (!requestType) {
      throw new Error("requestType is required for SendPhotos.");
    }

    console.log(`Sending ${photos.length} photos to Telegram for ${requestType} (ID: ${id})`);

    const validPhotos = photos.filter(photo => isPhoto(photo));
    if (validPhotos.length === 0) {
      console.log("No valid photos found in array.");
      return;
    }

    const mentionList = mentions[requestType] || [];
    let mentionText = mentionList.length > 0 ? `<br><i>Attention: ${mentionList.join(" ")}</i>` : "";

    for (let i = 0; i < validPhotos.length; i++) {
      const photo = validPhotos[i];
      let caption = "";
      let photoLink = "";
      if (typeof photo === 'string') {
        photoLink = `<br><a href="${photo}">View Full Image</a>`;
      }

      if (i === 0) {
        // Detailed caption for first photo
        caption = `📄 <b>${requestType}</b> - Proof Image ${i + 1} of ${validPhotos.length}${photoLink}<br><br>Sent via: Automated Request System${mentionText}`;
      } else {
        // Simple caption for additional photos
        caption = `<b>Additional Proof Image ${i + 1} of ${validPhotos.length} for ${requestType}</b>${photoLink}`;
      }

      try {
        await sendPhoto(photo, caption, id);
        console.log(`Photo ${i + 1}/${validPhotos.length} sent successfully for ${requestType} (ID: ${id})`);
        // Delay to avoid rate limits
        if (i < validPhotos.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        console.error(`Failed to send photo ${i + 1} for ${requestType}:`, err);
        // Continue with next (non-blocking)
      }
    }

    console.log(`All photos processed for ${requestType}.`);
  }

  return {
    sendRequest: async function(dataObj, requestType, files = []) {
      const referenceId = dataObj.id || `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;
      const id = dataObj.id || referenceId;
      const proofImages = dataObj.proofImages || [];  // URLs (optional)

      // Build text message (common for all types)
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

      // Send text message first (for all types)
      try {
        await sendMessage(message);
        console.log(`Telegram text message sent for ${requestType}.`);
      } catch (err) {
        console.error(`Failed to send text for ${requestType}:`, err);
        throw err;  // Block if text fails
      }

      // Handle attachments (general for all types)
      const attachments = [...files, ...proofImages];  // Combine files and URLs
      if (attachments.length > 0) {
        const photoAttachments = attachments.filter(isPhoto);
        const documentAttachments = attachments.filter(att => !isPhoto(att));

        // Send photos if any (generalized)
        if (photoAttachments.length > 0) {
          try {
            await SendPhotos(photoAttachments, id, requestType);
          } catch (err) {
            console.error(`Failed to send photos for ${requestType}:`, err);
            // Non-blocking for photos
          }
        }

        // Send documents if any (existing logic)
        if (documentAttachments.length > 0) {
          try {
            for (let i = 0; i < documentAttachments.length; i++) {
              const file = documentAttachments[i];
              const caption = i === 0 ? message : "";  // Only first gets full text
              await sendDocument(file.file || file, caption);  // Handle if wrapped
              if (i < documentAttachments.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
            console.log(`Documents sent for ${requestType}.`);
          } catch (err) {
            console.error(`Failed to send documents for ${requestType}:`, err);
            throw err;  // Block for documents if critical
          }
        }
      } else {
        console.log(`No attachments for ${requestType}.`);
      }
    },

    // General: SendPhotos (exposed for independent use)
    SendPhotos: async function(photos, id, requestType) {
      return SendPhotos(photos, id, requestType);  // Delegate to internal function
    }
  };
})();