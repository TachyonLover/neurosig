import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInputRef = useRef(null);

  async function handleReadFile() {
    if (!selectedFile) return;


    const formData = new FormData();
    formData.append("file", selectedFile);


    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
    });


    const data = await response.json();
    setAnalysisResults(data);
  }

  async function checkBackendStatus() {
    try {
      const response = await fetch("http://127.0.0.1:8000/status");

      if (!response.ok) {
        throw new Error("Backend returned an unsuccessful response");
      }

      const data = await response.json();
      setBackendStatus(data);

    } catch {
      setBackendStatus({ status: "offline" });
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

      <p>Backend Status: {backendStatus?.status ?? "Not Checked"}</p>

      <button type="button" onClick={checkBackendStatus}>
        Check Backend
      </button>

      <div>
        <h1>Results:</h1>

        {analysisResults ? (
          <>
            <p>Filename: {analysisResults.filename}</p>
            <p>Row count: {analysisResults.row_count}</p>

            <h2>Channel Averages:</h2>

            {Object.entries(analysisResults.averages).map(
              ([channel, average]) => (
                <p key={channel}>
                  {channel}: {average}
                </p>
              ),
            )}
          </>
        ) : (
          <p>No analysis available yet.</p>
        )}
      </div>


    </>
  );
}

export default App;
