import { useNavigate } from "react-router";

function RecordingDrawer({ recording, onClose, onDelete, closing, onAnimationEnd }) {
  const navigate = useNavigate();
  if (!recording) return null;

  return (
    <aside
      className={`recording-drawer
    ${closing ? "drawer-closing" : ""}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && closing) {
          onAnimationEnd();
        }
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="drawer-close"
        aria-label="Close recording preview"
      >
        x
      </button>
      <div>
        <h2>Recording Preview</h2>
        <p>EEG recording details</p>
      </div>

      <div className="drawer-summary">
        <h3>Filename: {recording.filename}</h3>

        <div className="drawer-stats">
          <div className="drawer-stat">
            <span>Samples</span>
            <strong>{recording.row_count.toLocaleString()}</strong>
          </div>

          <div className="drawer-stat">
            <span>Channels</span>
            <strong>{recording.channel_count}</strong>
          </div>

          <button className="view-analysis-button" type="button" onClick={() => navigate(`/recordings/${recording.id}`)}>
            View Full Analysis
          </button>
          <button type="button" className="delete-recording-button" onClick={onDelete}>
            🗑
          </button>
        </div>
      </div>
    </aside>
  );
}

export default RecordingDrawer;
