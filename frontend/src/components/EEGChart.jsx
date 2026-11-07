import { Line } from "react-chartjs-2";
import { useState, useRef } from "react";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
);

function EEGChart({ measurements, timestamps }) {
  const colors = ["#06fbe6", "#ffff00", "#ff0000", "#cc00ff", "#00ff40"];

  const [hiddenChannels, setHiddenChannels] = useState([]);

  const chartRef = useRef(null);

  function resetZoom() {
    chartRef.current?.resetZoom();
  }

  function toggleChannel(channel) {
    setHiddenChannels((previous) =>
      previous.includes(channel)
        ? previous.filter((name) => name !== channel)
        : [...previous, channel],
    );
  }

  const data = {
    datasets: Object.entries(measurements).map(([channel, values], index) => ({
      label: channel,
      data: values.map((value, index) => ({
        x: timestamps[index],
        y: value,
      })),
      borderColor: colors[index % colors.length],
      borderWidth: 1.5,
      tension: 0,
      hidden: hiddenChannels.includes(channel),
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
      axis: "x",
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        type: "linear",
        grid: {
          color: "#333333",
        },
        ticks: {
          color: "#A3A3A3",
        },
        title: {
          display: true,
          text: "Time (seconds)",
          color: "#A3A3A3",
        },
      },
      y: {
        grid: {
          color: "#333333",
        },
        ticks: {
          color: "#A3A3A3",
        },
        title: {
          display: true,
          text: "Amplitude",
          color: "#A3A3A3",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },

      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          mode: "x",
        },
      },
    },
  };

  return (
    <div>
      <div className="eeg-channel-controls">
        {Object.keys(measurements).map((channel, index) => (
          <label
            key={channel}
            className="eeg-channel-toggle"
            style={{
              "--channel-color": colors[index % colors.length],
            }}
          >
            <input
              type="checkbox"
              checked={!hiddenChannels.includes(channel)}
              onChange={() => toggleChannel(channel)}
            />

            <span className="channel-indicator" />
            <span>{channel}</span>
          </label>
        ))}
      </div>

      <div className="eeg-chart-canvas">
        <Line ref={chartRef} data={data} options={options} />
        <div className="eeg-chart-toolbar">
          <button
            type="button"
            className="eeg-reset-button"
            onClick={resetZoom}
          >
            Reset Zoom
          </button>
        </div>
      </div>
    </div>
  );
}

export default EEGChart;
