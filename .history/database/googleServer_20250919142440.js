
const express = require("express");
const fileUpload = require("express-fileupload");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Load service account
const KEYFILEPATH = path.join(__dirname, "service-account.json");
const FOLDER_ID = "1wAMtq0daFvVeJlISATiDi0OLQ4lly2w9";

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const driveService = google.drive({ version: "v3", auth });

// -----------------------------
// Upload file
// -----------------------------
app.post("/api/drive/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const fileMetadata = { name: file.name, parents: [FOLDER_ID] };
    const media = { mimeType: file.mimetype, body: file.data };

    const driveRes = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name, webViewLink, webContentLink",
    });

    res.json(driveRes.data);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Delete file
// -----------------------------
app.delete("/api/drive/delete/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    await driveService.files.delete({ fileId });
    res.json({ success: true, fileId });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// List files in folder
// -----------------------------
app.get("/api/drive/list", async (req, res) => {
  try {
    const response = await driveService.files.list({
      q: `'${FOLDER_ID}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, webViewLink, webContentLink)",
    });
    res.json({ files: response.data.files });
  } catch (err) {
    console.error("List Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Download file
// -----------------------------
app.get("/api/drive/download/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const response = await driveService.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileId}"`
    );

    response.data.pipe(res);
  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
