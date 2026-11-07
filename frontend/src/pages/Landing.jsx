import { Link } from "react-router";
import EEGBackground from "../components/EEGBackground";

function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <EEGBackground />
        <div className="landing-hero-content">
          <h1>
            NeuroSig<span>.</span>
          </h1>
          <Link to="/dashboard" className="landing-button">
            Get Started
          </Link>
        </div>
        <a href="#about" className="landing-scroll">
          <span>Scroll</span>
          <span aria-hidden="true">˅</span>
        </a>
      </section>

      <section className="landing-about" id="about">
        <div className="landing-about-content">
          <h2>About NeuroSig</h2>

          <p>
            NeuroSig is a web-based application designed to simplify the
            visualization and analysis of EEG data. Users can upload recordings,
            explore neural signals through interactive charts, and examine
            statistical measurements across multiple channels.
          </p>
          <a
            href="https://github.com/TachyonLover/neurosig"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-github"
          >
            View on GitHub ↗
          </a>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
