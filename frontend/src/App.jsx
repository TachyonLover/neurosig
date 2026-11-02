import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  async function handleReadFile() {
    if (!selectedFile) return;

    const contents = await selectedFile.text();
    const lines = contents.trim().split("\n");
    console.log(lines);
    console.log(contents);
  }

  return (
    <>
      <h1>NeuroSig</h1>

      <h2>Current file: {selectedFile?.name ?? "No file selected"}</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={(event) => setSelectedFile(event.target.files[0])}
      />

      <button
        type="button"
        onClick={() => {
          setSelectedFile(null);
          fileInputRef.current.value = "";
        }}
      >
        Remove file
      </button>

      <button
        type="button"
        onClick={handleReadFile}>
          Read File
        </button>
    </>
  );
}

export default App;
