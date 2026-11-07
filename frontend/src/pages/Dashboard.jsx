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
  const [drawerClosing, setDrawerClosing] = useState(false);

  return (
    <div className="dashboard-header">
      <div className="dashboard">
        <main>
          <h1>Your Recordings</h1>
          <p>Upload and manage your EEG recordings here.</p>

          <section className="upload-section">
            <div className="section-header">
              <h2>Upload Recording</h2>
              <p>Import and EEG recording to begin analysis</p>
            </div>

            <FileUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              errorMessage={errorMessage}
              fileInputRef={fileInputRef}
              handleReadFile={handleReadFile}
            />
          </section>

          <section className="recordings-section">
            <h2>Recordings</h2>

            {recordings.length === 0 ? (
              <p>No recordings uploaded yet.</p>
            ) : (
              <ul className="recordings-list">
                {recordings.map((recording) => (
                  <li key={recording.id}>
                    <button
                      type="button"
                      className="recording-item"
                      onClick={() => setSelectedRecordingId(recording.id)}
                    >
                      <span className="recording-info">
                        <span className="recording-name">{recording.filename}</span>
                        <span className="recording-details">
                          {recording.row_count.toLocaleString()} samples
                        </span>
                        <small>{recording.id}</small>
                      </span>

                      <span className="recording-arrow" aria-hidden="true">➔</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {selectedRecording && (
              <aside>
                <RecordingDrawer
                  recording={selectedRecording}
                  closing={drawerClosing}
                  onClose={() => setDrawerClosing(true)}
                  onAnimationEnd={() => {
                    setSelectedRecordingId(null);
                    setDrawerClosing(false);
                  }}
                />
              </aside>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
