//database\telegramConnect.js

window.TelegramConnect = (function () {
  const BOT_TOKEN = "8371293203:AAEGWdqThHuXSWDf6CKDa3e74hgbqTxDYP4"; 
  const CHAT_ID = "-1003020976065"; 

  const mentions = {
    "IT Service Order": ["@Yong1961", "@Kaloiskie_IT", "@Kristinemdt"],
    "Travel Order": ["@MrCooperJosh", "@kimnanaeh", "Ke"],
    "Driver's Trip Ticket": ["@MrCooperJosh", "@kimnanaeh", "Ke"]
  };

  function escapeMarkdownV2(text) {
    if (!text) return "";
    return text.toString()
      .replace(/\\/g, "\\\\")
      .replace(/\*/g, "\\*")
      .replace(/_/g, "\\_")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
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

  return {
  sendRequest: async function(dataObj, requestType, files = []) {
    const referenceId = `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;

    // Check if we should use MarkdownV2
    const useMarkdown = files.length === 0;

    // Build message
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
