import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ uploadUrl, token }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage("No files selected.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);
    setMessage("");

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Files uploaded successfully!");
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">Upload Files</h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      {selectedFiles.length > 0 && (
        <ul className="mb-4">
          {selectedFiles.map((file, idx) => (
            <li key={idx} className="text-sm">
              {file.name}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default FileUpload;
