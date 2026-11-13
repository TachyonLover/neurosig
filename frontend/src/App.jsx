import { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./components/AppLayout";
import "./App.css";
import EEGChart from "./components/EEGChart";
import FileUpload from "./components/FileUpload";
import StatsPanel from "./components/StatsPanel";
import Header from "./components/Header";
import RecordingAnalysis from "./pages/RecordingAnalysis";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);
  const [recordings, setRecordings] = useState([]);

  async function loadRecordings() {
    try {
      const response = await fetch("http://127.0.0.1:8000/recordings");

      if (!response.ok) {
        throw new Error("Failed to fetch recordings");
      }

      const data = await response.json();

      setRecordings(data.recordings);
    } catch (error) {
      console.error("Could not load recordings:", error);
    }
  }

  useEffect(() => {
    loadRecordings();
  }, []);

  async function handleReadFile() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/recordings", {
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
      setRecordings((prev) => [...prev, data])

      setRecordings((prev) => {
        const existingRecording = prev.find(
          (recording) => recording.filename === data.filename,
        );

        if (existingRecording) {
          return prev.map((recording) =>
            recording.id === existingRecording.id
              ? { ...data, id: recording.id }
              : recording,
          );
        }

        return [...prev, newRecording];
      });

      console.log("Recordings:", recordings);
    } catch (error) {
      setErrorMessage("Could not connect to backend.");
    }
  }

  async function handleDeleteRecording(recordingId) {
    try {
      const response = await fetch (`http://127.0.0.1:8000/recordings/${recordingId}`,
        { method: "DELETE"}
      );

      console.log("DELETE status:", response.status)
      
      if (!response.ok) {
        throw new Error("Failed to delete recording");
      }


      setRecordings((prev) => prev.filter((recording) => recording.id !== recordingId)
    );

    return true;
    } catch (error) {
      console.error("Could not delete recording:", error)
      return false;
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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                recordings={recordings}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                errorMessage={errorMessage}
                fileInputRef={fileInputRef}
                handleReadFile={handleReadFile}
                handleDeleteRecording={handleDeleteRecording}
              />
            }
          />
          <Route
            path="/recordings/:id"
            element={<RecordingAnalysis />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
