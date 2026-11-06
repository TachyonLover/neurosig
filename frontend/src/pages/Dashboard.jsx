import FileUpload from "../components/FileUpload";
import RecordingDrawer from "../components/RecordingDrawer";
import { useState } from "react";

function Dashboard({
  recordings,
  selectedFile,
  setSelectedFile,
  errorMessage,
  fileInputRef,
  handleReadFile,
}) {
  const [selectedRecordingId, setSelectedRecordingId] = useState(null);
  const selectedRecording = recordings.find(
    (recording) => recording.id === selectedRecordingId,
  );

  return (
    <main>
      <h1>Your Recordings</h1>
      <p>Upload and manage your EEG recordings here.</p>

      <FileUpload
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        errorMessage={errorMessage}
        fileInputRef={fileInputRef}
        handleReadFile={handleReadFile}
      />

      <h2>Recordings</h2>

      {recordings.length === 0 ? (
        <p>No recordings uploaded yet.</p>
      ) : (
        <ul>
          {recordings.map((recording) => (
            <li key={recording.id}>
              <button
                type="button"
                onClick={() => setSelectedRecordingId(recording.id)}
              >
                {recording.filename}
              </button>
              <p>{recording.row_count} samples</p>
            </li>
          ))}
        </ul>
      )}

      {selectedRecording && (
        <aside>
          <RecordingDrawer
            recording={selectedRecording}
            onClose={() => setSelectedRecordingId(null)}
          />
        </aside>
      )}
    </main>
  );
}

export default Dashboard;
