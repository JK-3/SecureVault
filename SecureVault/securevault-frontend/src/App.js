import React from "react";
import Dashboard from "./Components/Dashboard";
import FileViewer from "./FileViewer";

function App() {
  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f6fa",
      padding: "2rem",
      color: "#333",
      minHeight: "100vh"
    }}>
      <section style={{
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginBottom: "2rem"
      }}>
        <Dashboard />
      </section>
      <section style={{
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <FileViewer />
      </section>
    </div>
  );
}

export default App;
