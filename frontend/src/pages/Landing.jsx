import { Link } from "react-router";

function Landing() {
  return (
    <main>
      <h1>NeuroSig</h1>

      <p>
        Analyze and visualize EEG recordings
        through an interactive workspace.
      </p>

      <Link to="/dashboard">Get Started</Link>
    </main>
  );
}

export default Landing;