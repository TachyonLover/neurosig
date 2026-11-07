import { useParams } from "react-router";
import EEGChart from "../components/EEGChart";

function RecordingAnalysis({ recordings }) {
  const { id } = useParams();
  const recording = recordings.find((recording) => recording.id === id);

  if (!recording) {
    return (
      <div className="recording-analysis">
        <h1>Recording not found</h1>
        <p>This recording may not exist or may no longer be loaded</p>
      </div>
    );
  }

  return (
    <div className="recording-analysis">
      <header className="analysis-header">
        <p>RECORDING ANALYSIS</p>
        <h1>{recording.filename}</h1>
        <span>EEG recording overview</span>
      </header>

      <section className="analysis-stats">
        <div className="analysis-stat-card">
          <span className="analysis-stat-label">Total Samples</span>
          <h2>{recording.row_count.toLocaleString()}</h2>
          <p>Recorded measurements</p>
        </div>

        <div className="analysis-stat-card">
          <span className="analysis-stat-label">EEG Channels</span>
          <h2>{recording.channels.length}</h2>
          <p>Available signal channels</p>
        </div>
      </section>

      <section className="analysis-chart">
        <div className="analysis-chart-header">
          <h2>EEG Signal Visualization</h2>
          <EEGChart
            measurements={recording.measurements}
            timestamps={recording.timestamps}
          />
        </div>
      </section>

      <section className="channel-statistics">
        <h2>Channel Statistics</h2>

        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Mean</th>
              <th>Std. Deviation</th>
              <th>Minimum</th>
              <th>Maximum</th>
            </tr>
          </thead>

          <tbody>
            {recording.channels.map((channel) => (
              <tr key={channel}>
                <td>{channel}</td>
                <td>{recording.averages[channel]?.toFixed(2)}</td>
                <td>{recording.standard_devs[channel]?.toFixed(2)}</td>
                <td>{recording.minimums[channel]?.toFixed(2)}</td>
                <td>{recording.maximums[channel]?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default RecordingAnalysis;
