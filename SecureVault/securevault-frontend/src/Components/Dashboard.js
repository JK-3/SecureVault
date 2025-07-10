import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { getDashboardFiles, deleteFile } from "../api";
import { jwtDecode } from "jwt-decode";

const token = process.env.REACT_APP_AUTH_TOKEN;
const user = jwtDecode(token);
const endpoint = user.role === "ADMIN" ? "/api/v1/files/all" : "/api/v1/files/my";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getDashboardFiles();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const downloadFile = async (key) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/files/download/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = key;
      a.click();
    } catch (error) {
      console.error("Download error:", error);
    }
  };
 const handleDelete = async (key) => {
   try {
     await deleteFile(key);
     setFiles(prev => prev.filter(f => f.fileKey !== key));
   } catch (err) {
     console.error("Delete failed:", err);
     alert("Delete failed: " + err.message);
   }
 };

  return (
    <div className="dashboard-container">
      <div className="user-info">
        <h3>👋 Welcome, {user.sub}</h3>
        <p>🛡️ Role: {user.role}</p>
      </div>
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
        📂 SecureVault Dashboard
      </h2>
      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>📎 File Name</th>
                <th>📁 Type</th>
                <th>📏 Size (KB)</th>
                <th>👤 Uploaded By</th>
                <th>🕓 Uploaded At</th>
                <th>⬇️ Action</th>
                <th>🗑️   Action</th>
              </tr>
            </thead>
            <tbody>
              {files
                .filter((file) =>
                  file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((file) => (
                  <tr key={file.id}>
                    <td>{file.originalName}</td>
                    <td>{file.contentType}</td>
                    <td>{(file.size / 1024).toFixed(2)}</td>
                    <td>{file.uploadedBy}</td>
                    <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => downloadFile(file.fileKey)}>⬇️ Download</button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(file.fileKey)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

//exporting ,OUTSIDE the function
export default Dashboard;
