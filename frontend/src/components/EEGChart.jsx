import { Line } from "react-chartjs-2";
import { useState } from "react";
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
);

function EEGChart({ measurements, timestamps }) {
  const colors = [
    "rgb(75, 192, 192)",
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 159, 64)",
    "rgb(153, 102, 255)",
  ];

  const [hiddenChannels, setHiddenChannels] = useState([]);

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
      hidden: hiddenChannels.includes(channel),
    })),
  };

  const options = {
    responsive: true,
    animation: false,
    elements: {
        point: {
            radius: 0
        }
    },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Time (seconds)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amplitude",
        },
      },
    },
  };

  return (
    <div>
      <h2>EEG Signal</h2>
      {Object.keys(measurements).map((channel) => (
        <label key={channel}>
          <input
            type="checkbox"
            checked={!hiddenChannels.includes(channel)}
            onChange={() => toggleChannel(channel)}
          />
          {channel}
        </label>
      ))}
      <Line data={data} options={options} />
    </div>
  );
}

export default EEGChart;
