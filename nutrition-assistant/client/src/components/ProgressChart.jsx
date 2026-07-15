import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = ({ data, type = 'line', title, height = 300 }) => {
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: type !== 'pie' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
  }), [type, title]);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      default:
        return <Line data={data} options={chartOptions} />;
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div style={{ height }}>
          {renderChart()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProgressChart;
