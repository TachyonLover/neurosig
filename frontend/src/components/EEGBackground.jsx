import "./EEGBackground.css";

function EEGBackground() {
  return (
    <div className="eeg-background" aria-hidden="true">
      <svg viewBox="0 0 600 400" preserveAspectRatio="none">
        <g className="eeg-wave-track">
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 0"
            to="-600 0"
            dur="15s"
            repeatCount="indefinite"
          />

          {[0, 600, 1200].map((offset) => (
            <path
              key={offset}
              className="eeg-wave"
              transform={`translate(${offset} 0)`}
              d="M 0 200
                L 80 200
                L 110 195
                L 130 210
                L 150 170
                L 170 230
                L 190 185
                L 210 200
                L 300 200
                L 340 190
                L 370 215
                L 400 160
                L 430 240
                L 460 185
                L 490 200
                L 600 200
            "
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default EEGBackground;
