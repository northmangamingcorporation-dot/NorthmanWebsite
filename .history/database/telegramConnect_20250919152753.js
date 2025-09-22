// TelegramConnect.js
window.TelegramConnect = (function () {
  const BOT_TOKEN = "8371293203:AAEGWdqThHuXSWDf6CKDa3e74hgbqTxDYP4"; 
  const CHAT_ID = "-1003020976065"; 

  // Map request types to arrays of usernames to mention
  const mentions = {
    "IT Service Order": ["@it_team", "@it_manager"],
    "Travel Order": ["@hr_team", "@f@kimnanaeh"],
    "Maintenance Request": ["@maintenance_team", "@facility_manager"]
  };

  // Escape Markdown special characters
  function escapeMarkdown(text) {
    if (!text) return "";
    return text.toString().replace(/[_*[\]()~`>#+-=|{}.!]/g, "\\$&");
  }

  return {
    sendRequest: async function(dataObj, requestType) {
      const referenceId = `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;

      // HEADER
      let message = `*📄 ${escapeMarkdown(requestType)}*\n`;
      message += `*Reference ID:* ${escapeMarkdown(referenceId)}\n\n`;

      // BODY
      for (const [key, value] of Object.entries(dataObj)) {
        message += `*${escapeMarkdown(key)}:* ${escapeMarkdown(value)}\n`;
      }

      // FOOTER with multiple mentions
      const mentionList = mentions[requestType] || [];
      const mentionText = mentionList.length ? `\n*Attention:* ${mentionList.join(" ")}` : "";
      message += `\n*Sent via:* Automated Request System${mentionText}`;

      try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: CHAT_ID, 
            text: message, 
            parse_mode: "MarkdownV2" 
          })
        });

        const respData = await res.json();
        console.log("Telegram response:", respData);
        if (!respData.ok) console.error("Telegram error:", respData.description);

      } catch (err) {
        console.error("Telegram request error:", err);
      }
    }
  };
})();
