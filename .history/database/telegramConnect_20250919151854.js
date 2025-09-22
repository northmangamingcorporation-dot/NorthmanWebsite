// TelegramConnect.js
window.TelegramConnect = (function () {
  const BOT_TOKEN = "8371293203:AAEGWdqThHuXSWDf6CKDa3e74hgbqTxDYP4"; 
  const CHAT_ID = "-1003020976065"; 

  return {
    sendRequest: async function(dataObj, requestType) {
      const referenceId = `${requestType.toUpperCase().replace(/\s/g,'')}-${Date.now()}`;
      const payload = {
        ...dataObj,
        "Reference ID": referenceId,
        "Request Type": requestType
      };

      const captionText = Object.entries(payload)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

      try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: captionText })
        });

        const respData = await res.json();
        console.log("Telegram response:", respData);

        if (!respData.ok) {
          console.error("Telegram error:", respData.description);
        }
      } catch (err) {
        console.error("Telegram request error:", err);
      }
    }
  };
})();
