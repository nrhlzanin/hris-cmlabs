import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const data = {
  labels: ['March 20', 'March 21', 'March 22', 'March 23', 'March 24', 'March 25', 'March 26'],
  datasets: [
    {
      label: 'Work Hours',
      data: [8, 2, 4, 2.5, 6.72, 2, 4],
      backgroundColor: '#3B82F6',
      borderRadius: 6
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y} hr`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 8,
      ticks: {
        callback: (value) => `${value} hr`
      }
    }
  }
};

export default function WorkHoursChart() {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Your Work Hours</h2>
      <div className="text-lg font-medium mb-2">120h 54m</div>
      <Bar data={data} options={options} />
    </div>
  );
}
