import { useState, useRef } from "react";
import "./App.css";
import EEGChart from "./EEGChart";
import FileUpload from "./components/FileUpload";
import StatsPanel from "./components/StatsPanel";
import Header from "./components/Header";

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
      setErrorMessage("Could not connect to backend.");
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
      <Header
        backendStatus={backendStatus}
        checkBackendStatus={checkBackendStatus}
      />

      <FileUpload 
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        errorMessage={errorMessage}
        fileInputRef={fileInputRef}
        handleReadFile={handleReadFile}
        />


      <StatsPanel 
        analysisResults={analysisResults}/>

      <div>
        {analysisResults && (
          <EEGChart
            measurements={analysisResults.measurements}
            timestamps={analysisResults.timestamps}/>
        )}

      </div>
    </>
  );
}

export default App;
