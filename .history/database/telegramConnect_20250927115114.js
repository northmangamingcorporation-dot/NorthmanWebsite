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

  // Helper: Escape HTML special chars in dynamic content (prevent parsing errors)
  function escapeHtml(text) {
    if (!text) return "";
    return text.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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

  // NEW: Get file info from Telegram (for URL construction)
  async function getFile(fileId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: fileId })
      });
      const data = await res.json();
      if (!data.ok) {
        console.error("Telegram getFile error:", data.description);
        throw new Error(data.description);
      }
      return data.result;
    } catch (err) {
      console.error("Telegram getFile request error:", err);
      throw err;
    }
  }

  // Send single photo (handles both URL strings and File objects)
  async function sendPhoto(photo, caption = "", id = "") {
    try {
      let res;
      let finalCaption = caption;
      if (id) {
        finalCaption += `\n<b>Reference ID:</b> ${escapeHtml(id)}`;
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
        console.error("Telegram sendPhoto error:", data.description, "- Caption preview:", finalCaption.substring(0, 100) + "...");
        throw new Error(data.description);
      }
      return data;
    } catch (err) {
      console.error("Telegram sendPhoto request error:", err, "- Caption preview:", caption.substring(0, 100) + "...");
      throw err;
    }
  }

  // UPDATED: Send multiple photos (Files or URLs) for any request type - Now captures file_ids and returns them
  async function SendPhotos(photos, id, requestType) {
    if (!Array.isArray(photos) || photos.length === 0) {
      console.log("No photos provided to SendPhotos.");
      return [];
    }

    if (!requestType) {
      throw new Error("requestType is required for SendPhotos.");
    }

    console.log(`Sending ${photos.length} photos to Telegram for ${requestType} (ID: ${id})`);

    const validPhotos = photos.filter(photo => isPhoto(photo));
    if (validPhotos.length === 0) {
      console.log("No valid photos found in array.");
      return [];
    }

    const mentionList = mentions[requestType] || [];
    let mentionText = mentionList.length > 0 ? `\n<i>Attention: ${mentionList.join(" ")}</i>` : "";

    const sentPhotos = [];  // NEW: Collect {file_id, caption, message_id}

    for (let i = 0; i < validPhotos.length; i++) {
      const photo = validPhotos[i];
      let caption = "";
      let photoLink = "";
      if (typeof photo === 'string') {
        photoLink = `\n<a href="${escapeHtml(photo)}">View Full Image</a>`;
      }

      if (i === 0) {
        // Detailed caption for first photo (use \n instead of <br>)
        caption = `📄 <b>${escapeHtml(requestType)}</b> - Proof Image ${i + 1} of ${validPhotos.length}${photoLink}\n\nSent via: Automated Request System${mentionText}`;
      } else {
        // Simple caption for additional photos (use \n)
        caption = `<b>Additional Proof Image ${i + 1} of ${validPhotos.length} for ${escapeHtml(requestType)}</b>${photoLink}`;
      }

      try {
        const response = await sendPhoto(photo, caption, id);
        const result = response.result;
        const fileId = result.photo ? result.photo[result.photo.length - 1].file_id : null;  // Largest photo file_id
        const messageId = result.message_id;

        if (fileId) {
          sentPhotos.push({
            file_id: fileId,
            caption: caption,
            message_id: messageId
          });
          console.log(`Photo ${i + 1}/${validPhotos.length} sent successfully for ${requestType} (ID: ${id}, file_id: ${fileId})`);
        } else {
          console.warn(`No file_id in response for photo ${i + 1}`);
        }

        // Delay to avoid rate limits
        if (i < validPhotos.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        console.error(`Failed to send photo ${i + 1} for ${requestType}:`, err);
        // Continue with next (non-blocking)
      }
    }
    
  
    await window.db.collection('accomplishments').doc(id).set({
       telegramPhotos: sentPhotos
          }, { merge: true });

    console.log(`All photos processed for ${requestType}. Sent: ${sentPhotos.length} with file_ids.`);
    return sentPhotos;  // NEW: Return array for storage
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

        let sentPhotos = [];  // NEW: Collect for storage

                // Send photos if any (generalized)
        if (photoAttachments.length > 0) {
          try {
            const sentPhotos = await SendPhotos(photoAttachments, id, requestType);
            // NEW: Non-blockingly store telegramPhotos in Firestore
            if (sentPhotos.length > 0 && window.db) {
              try {
                await window.db.collection("accomplishments").doc(id).update({
                  telegramPhotos: firebase.firestore.FieldValue.arrayUnion(...sentPhotos)
                });
                console.log(`Stored ${sentPhotos.length} telegramPhotos in Firestore for ID: ${id}`);
              } catch (storageErr) {
                console.error(`Failed to store telegramPhotos for ${id} (non-blocking):`, storageErr);
              }
            }
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
    },

    // NEW: Get Telegram photo data by reference ID (fetches fresh URLs from stored file_ids)
    getDataById: async function(id) {
      if (!id) {
        throw new Error("ID is required for getDataById.");
      }

      if (!window.db) {
        console.warn("Firestore (window.db) not available - cannot retrieve Telegram data.");
        return [];
      }

      try {
        console.log(`Retrieving Telegram data for ID: ${id}`);
        const doc = await window.db.collection("accomplishments").doc(id).get();
        if (!doc.exists) {
          console.warn(`No Firestore record found for ID: ${id}`);
          return [];
        }

        const data = doc.data();
        const telegramPhotos = data.telegramPhotos || [];
        if (telegramPhotos.length === 0) {
          console.log(`No telegramPhotos stored for ID: ${id}`);
          return [];
        }

        const photoData = [];
        for (let i = 0; i < telegramPhotos.length; i++) {
          const photoInfo = telegramPhotos[i];
          try {
            const fileInfo = await getFile(photoInfo.file_id);
            const filePath = fileInfo.file_path;
            const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
            
            // Get photo sizes (largest for main URL, smaller for thumbnail if needed)
            const largestPhoto = fileInfo ? { url, width: fileInfo.file_size ? 'full' : undefined } : null;
            const thumbnail = fileInfo.thumbnails ? fileInfo.thumbnails[0] : null;  // Smallest thumbnail if available

            photoData.push({
              url: url,
              caption: photoInfo.caption,
              message_id: photoInfo.message_id,
              file_id: photoInfo.file_id,
              thumbnail: thumbnail ? `https://api.telegram.org/file/bot${BOT_TOKEN}/${thumbnail.file_path}` : null,
              size: fileInfo.file_size || 'unknown'
            });

            console.log(`Retrieved photo ${i + 1}/${telegramPhotos.length} for ID: ${id} (URL: ${url.substring(0, 50)}...)`);

            // Delay to avoid rate limits on getFile calls
            if (i < telegramPhotos.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          } catch (err) {
            console.error(`Failed to retrieve photo ${i + 1} (file_id: ${photoInfo.file_id}) for ID: ${id}:`, err);
            // Continue with next (partial data)
          }
        }

        console.log(`Retrieved ${photoData.length} photos for ID: ${id}`);
        return photoData;
      } catch (err) {
        console.error(`Failed to get Telegram data for ID: ${id}:`, err);
        throw err;
      }
    }
  };
})();