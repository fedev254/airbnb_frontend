// In src/components/RevenueChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueChart({ chartData }) {
  if (!chartData || !chartData.labels || !chartData.data) {
    return <p>No revenue data available to display chart.</p>;
  }
  
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Monthly Revenue (KES)',
        data: chartData.data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }, // The parent component has the title
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
            callback: function(value) {
                return `KES ${value.toLocaleString()}`;
            }
        }
      },
    },
  };

  return <Bar options={options} data={data} />;
}