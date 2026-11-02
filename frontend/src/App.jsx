import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const fileInputRef = useRef(null);

  async function handleReadFile() {
    if (!selectedFile) return;

    const contents = await selectedFile.text();
    const lines = contents.trim().split("\n");
    console.log(lines);
    console.log(contents);
  }

  async function checkBackendStatus() {
    try{
      const response = await fetch("http://127.0.0.1:8000/status");
      if (!response.ok) {
        throw new Error("Backend returned an unsuccessful response");
      }
      const data = await response.json();
      setBackendStatus(data);
      
    } catch {
      setBackendStatus({status: "offline"});
    }
    
  }

  return (
    <>
      <h1>NeuroSig</h1>

      <h2>Current file: {selectedFile?.name ?? "No file selected"}</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={(event) => setSelectedFile(event.target.files[0])}
      />

      <button
        type="button"
        onClick={() => {
          setSelectedFile(null);
          fileInputRef.current.value = "";
        }}
      >
        Remove file
      </button>

      <button type="button" onClick={handleReadFile}>
        Read File
      </button>

      <p>
        Backend Status: {backendStatus?.status ?? "Not Checked"}
      </p>

      <button type="button" onClick={checkBackendStatus}>
        Check Backend
      </button>

    </>
  );
}

export default App;
