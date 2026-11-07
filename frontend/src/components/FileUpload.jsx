function FileUpload({
  selectedFile,
  setSelectedFile,
  errorMessage,
  fileInputRef,
  handleReadFile,
}) {
  return (
    <section>
      <h3>Current file: {selectedFile?.name ?? "No file selected"}</h3>
      <input
        className="file-input"
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={(event) => setSelectedFile(event.target.files[0])}
      />

      <div>{errorMessage}</div>

      <div className="upload-actions">
        <button
          type="button"
          onClick={handleReadFile}
          className="analyze-button"
          disabled={!selectedFile}
        >
          Analyze Recording
        </button>

        <button
          type="button"
          className="remove-file-button"
          onClick={() => {
            setSelectedFile(null);
            fileInputRef.current.value = "";
          }}
        >
          Remove file
        </button>
      </div>
    </section>
  );
}

export default FileUpload;
