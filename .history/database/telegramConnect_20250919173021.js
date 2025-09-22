// TelegramConnect.js
window.TelegramConnect = (function () {
  const BOT_TOKEN = "8371293203:AAEGWdqThHuXSWDf6CKDa3e74hgbqTxDYP4"; 
  const CHAT_ID = "-1003020976065"; 

  // Map request types to mentions
  const mentions = {
    "IT Service Order": ["@Yong1961", "@Kaloiskie_IT"],
    "Travel Order": ["@MrCooperJosh", "@kimnanaeh", "Ke"],
    "Driver's Trip Ticket": ["@MrCooperJosh", "@kimnanaeh", "Ke"]
  };

  function escapeMarkdown(text) {
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

  return {
    sendRequest: async function(dataObj, requestType, files = []) {
            const referenceId = `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;

            // HEADER
            let message = `📄 ${escapeMarkdown(requestType)}*\n`;
            message += "*Reference ID: ${escapeMarkdown(referenceId)}\n\n`;

            // BODY
            for (const [key, value] of Object.entries(dataObj)) {
                message += `*${escapeMarkdown(key)}:* ${escapeMarkdown(value)}\n`;
            }

            // FOOTER with mentions
            const mentionList = mentions[requestType] || [];
            const mentionText = mentionList.length 
                ? `\n*Attention:* ${mentionList.map(u => escapeMarkdown(u)).join(" ")}` 
                : "";
            message += `\n*Sent via:* Automated Request System${mentionText}`;

            try {
                if (files && files.length) {
                // Send each file separately
                for (let f of files) {
                    const formData = new FormData();
                    formData.append("chat_id", CHAT_ID);
                    formData.append("document", f.file, f.file.name); // include filename
                    formData.append("caption", message);

                    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                    method: "POST",
                    body: formData
                    });

                    const respData = await res.json();
                    console.log("Telegram response:", respData);
                    if (!respData.ok) console.error("Telegram error:", respData.description);
                }
                } else {
                // Send text only
                const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "MarkdownV2" })
                });
                const respData = await res.json();
                console.log("Telegram response:", respData);
                if (!respData.ok) console.error("Telegram error:", respData.description);
                }
            } catch (err) {
                console.error("Telegram request error:", err);
            }
            }
  };
})();
