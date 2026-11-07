function RecordingDrawer({ recording, onClose, closing, onAnimationEnd }) {
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
        aria-lavel="Close recording preview"
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
            <strong>{recording.channels.length}</strong>
          </div>

          <button className="view-analysis-button" type="button" disabled>
            View Full Analysis
          </button>
        </div>
      </div>
    </aside>
  );
}

export default RecordingDrawer;
