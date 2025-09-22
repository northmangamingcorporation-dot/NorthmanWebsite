// window.GoogleDrive helper
// 
window.GoogleDrive = (function () {
  const API_BASE = "/api/drive";

  return {
    uploadFile: async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        return data;
      } catch (err) {
        console.error("❌ Google Drive upload error:", err);
        return null;
      }
    },

    deleteFile: async (fileId) => {
      try {
        const res = await fetch(`${API_BASE}/delete/${fileId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Delete failed");
        return data;
      } catch (err) {
        console.error("❌ Google Drive delete error:", err);
        return null;
      }
    },

    listFiles: async () => {
      try {
        const res = await fetch(`${API_BASE}/list`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "List failed");
        return data.files;
      } catch (err) {
        console.error("❌ Google Drive list error:", err);
        return [];
      }
    },

    downloadFile: async (fileId) => {
      try {
        const res = await fetch(`${API_BASE}/download/${fileId}`);
        if (!res.ok) throw new Error("Download failed");
        return await res.blob();
      } catch (err) {
        console.error("❌ Google Drive download error:", err);
        return null;
      }
    },
  };
})();
