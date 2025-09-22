// GoogleDriveConnect.js
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load service account key
const KEYFILEPATH = path.join(__dirname, "service-account.json");

// Folder ID where files will be stored
const FOLDER_ID = "1wAMtq0daFvVeJlISATiDi0OLQ4lly2w9";

// Create auth client
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const driveService = google.drive({ version: "v3", auth });

/**
 * Upload a file to Google Drive folder
 * @param {string} filePath - Path to local file
 * @returns {Promise<string>} File ID
 */
async function uploadFile(filePath) {
  const fileName = path.basename(filePath);

  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID], // upload inside your folder
  };

  const media = {
    mimeType: "application/octet-stream",
    body: fs.createReadStream(filePath),
  };

  const res = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink, webContentLink",
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

module.exports = { uploadFile, deleteFile };
