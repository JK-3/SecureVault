// src/FileViewer.js
import React, { useEffect, useState } from 'react';
import { getFiles, downloadFile, deleteFile, uploadFile } from './api';

const FileViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await getFiles();
      setFiles(res);
    } catch (err) {
      console.error('Error fetching files:', err.message);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadFile(selectedFile);
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      console.error('Upload failed:', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (key) => {
    try {
      await downloadFile(key);
    } catch (err) {
      console.error('Download failed:', err.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteFile(key);
      fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
     <h2
             style={{
               fontSize: "2rem",
               color: "#6C5CE7",
               marginBottom: "1rem",
               display: "flex",
               alignItems: "center",
               gap: "0.6rem",
               background: "linear-gradient(to right, #a29bfe, #81ecec)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent"
             }}
           >
       📂 The FileManager
     </h2>

      <div style={{ marginBottom: '1rem' }}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={uploading}
        style={{
            marginRight: "0.5rem",
            padding: "0.4rem 0.8rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {files.map((key) => (
          <li key={key} style={{ marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
            <strong>{key}</strong>
            <div style={{ marginTop: '0.3rem' }}>
              <button onClick={() => handleDownload(key)} style={{ marginRight: '0.5rem' }}>Download</button>
              <button onClick={() => handleDelete(key)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileViewer;
