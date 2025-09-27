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
      if (!data.ok) console.error("Telegram error:", data.description);
      return data;
    } catch (err) {
      console.error("Telegram request error:", err);
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
      if (!data.ok) console.error("Telegram error:", data.description);
      return data;
    } catch (err) {
      console.error("Telegram request error:", err);
    }
  }

  // NEW: Send photo via URL (supports direct URLs from Firebase Storage)
  async function sendPhoto(photoUrl, caption = "") {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: CHAT_ID, 
          photo: photoUrl,  // URL to the photo
          caption: caption,
          parse_mode: "HTML"  // Use HTML for simple captions with URLs
        })
      });
      const data = await res.json();
      if (!data.ok) console.error("Telegram sendPhoto error:", data.description);
      return data;
    } catch (err) {
      console.error("Telegram sendPhoto request error:", err);
    }
  }

  return {
    sendRequest: async function(dataObj, requestType, files = []) {
      const referenceId = `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;

      // Special handling for "Accomplishment Report": Only send ID and photos (if any)
      if (requestType === "Accomplishment Report") {
        const id = dataObj.id || referenceId;  // Use provided ID or fallback
        const proofImages = dataObj.proofImages || [];  // Array of photo URLs

        let message = "";
        const useMarkdown = proofImages.length === 0;

        if (useMarkdown) {
          // Text-only message (no photos)
          message += `*📄 ${escapeMarkdownV2(requestType)}*\n`;
          message += `*Reference ID:* ${escapeMarkdownV2(id)}\n`;
          message += `*Sent via:* Automated Request System`;
          await sendMessage(message);
        } else {
          // Send photos with captions (first photo gets full message)
          for (let i = 0; i < proofImages.length; i++) {
            const photoUrl = proofImages[i];
            let caption = "";
            if (i === 0) {
              // Full caption for first photo
              caption = `
                📄 <b>${requestType}</b><br>
                <b>Reference ID:</b> ${id}<br><br>
                Proof Image ${i + 1} of ${proofImages.length}<br>
                <a href="${photoUrl}">View Full Image</a><br><br>
                Sent via: Automated Request System
              `;
            } else {
              // Simple caption for additional photos
              caption = `
                📄 <b>${requestType} - Additional Proof</b><br>
                <b>Reference ID:</b> ${id}<br>
                Proof Image ${i + 1} of ${proofImages.length}<br>
                <a href="${photoUrl}">View Full Image</a>
              `;
            }
            await sendPhoto(photoUrl, caption);
          }
        }

        return;  // Exit early for this type
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
            const resp = await sendDocument(files[i].file, caption);
            if (!resp.ok) console.error("Telegram error:", resp.description);
          }
        } else {
          await sendMessage(message);
        }
      } catch (err) {
        console.error("Telegram request error:", err);
      }
    }
  };
})();