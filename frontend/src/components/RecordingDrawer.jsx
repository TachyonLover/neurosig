function RecordingDrawer({ recording, onClose }) {
  if (!recording) return null;

  return (
    <aside>
      <h2>Recording Details</h2>

      <p>Filename: {recording.filename}</p>
      <p>Samples: {recording.row_count}</p>

      <button type="button" onClick={onClose}>
        Close
      </button>
    </aside>
  );
}

export default RecordingDrawer;