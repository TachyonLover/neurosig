function Header({ backendStatus, checkBackendStatus }) {
  return (
    <header>
      <h1>NeuroSig</h1>
      <div>
        <span>
          Backend Status: {backendStatus?.status ?? "Not Checked"}
        </span>

        <button type="button" onClick={checkBackendStatus}>
          Check Backend
        </button>
      </div>
    </header>
  );
}

export default Header;