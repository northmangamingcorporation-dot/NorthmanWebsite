// database/GoogleDriveConnect.js
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// Load service account key
const KEYFILEPATH = path.join(__dirname, "service-account.json");

// Google Drive Folder ID
const FOLDER_ID = "1wAMtq0daFvVeJlISATiDi0OLQ4lly2w9";

// Auth client
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const driveService = google.drive({ version: "v3", auth });

/**
 * Upload a file to Google Drive folder
 * @param {string} filePath - Path to local file
 * @returns {Promise<Object>} File info (id, links)
 */
async function uploadFile(filePath) {
  const fileName = path.basename(filePath);

  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: mime.lookup(filePath) || "application/octet-stream",
    body: fs.createReadStream(filePath),
  };

  const res = await driveService.files.create({
    resource: fileMetadata,
    media,
    fields: "id, name, webViewLink, webContentLink",
  });

  console.log("✅ File Uploaded:", res.data);
  return res.data;
}

/**
 * Delete a file from Google Drive
 * @param {string} fileId - The ID of the file to delete
 */
async function deleteFile(fileId) {
  await driveService.files.delete({ fileId });
  console.log(`🗑️ File with ID ${fileId} deleted.`);
}

/**
 * List files inside the target folder
 * @returns {Promise<Array>} List of files
 */
async function listFiles() {
  const res = await driveService.files.list({
    q: `'${FOLDER_ID}' in parents and trashed=false`,
    fields: "files(id, name, webViewLink, webContentLink)",
  });

  console.log("📂 Files in folder:", res.data.files);
  return res.data.files;
}

/**
 * Download a file by ID
 * @param {string} fileId - Google Drive file ID
 * @param {string} destPath - Path to save the file locally
 */
async function downloadFile(fileId, destPath) {
  const dest = fs.createWriteStream(destPath);

  await driveService.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" },
    (err, res) => {
      if (err) return console.error("❌ Download error:", err);

      res.data
        .on("end", () => console.log(`⬇️ File downloaded to ${destPath}`))
        .on("error", (err) => console.error("❌ Error downloading:", err))
        .pipe(dest);
    }
  );
}

module.exports = { uploadFile, deleteFile, listFiles, downloadFile };
