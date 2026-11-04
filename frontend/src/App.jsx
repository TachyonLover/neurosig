import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  async function handleReadFile() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        setErrorMessage(data.detail);
        return;
      }

      setErrorMessage(null);

      setAnalysisResults(data);
    } catch (error) {
      console.error(error)
      setErrorMessage("Could not connect to the backend.");
    }
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

      <div>
        <h2>Current file: {selectedFile?.name ?? "No file selected"}</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(event) => setSelectedFile(event.target.files[0])}
        />

        <div>{errorMessage}</div>

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
      </div>

      <h2>Backend Status: {backendStatus?.status ?? "Not Checked"}</h2>

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
