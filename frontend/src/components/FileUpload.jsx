function FileUpload({
  selectedFile,
  setSelectedFile,
  errorMessage,
  fileInputRef,
  handleReadFile,
}) {
  return (
    <section>
      <h2>Upload EEG Recording</h2>
      <h3>Current file: {selectedFile?.name ?? "No file selected"}</h3>
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
    </section>
  );
}

export default FileUpload;
