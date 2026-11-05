import { Line } from "react-chartjs-2";
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

  const data = {
    labels: timestamps,
    datasets: Object.entries(measurements).map(([channel, values], index) => ({
      label: channel,
      data: values,
      borderColor: colors[index % colors.length],
    })),
  };

  return (
    <div>
      <h2>EEG Signal</h2>
      <Line data={data} />
    </div>
  );
}

export default EEGChart;
