import { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { animateChartIn } from '../../utils/animations';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SummaryChart({ taskStats }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current) animateChartIn(wrapperRef.current);
  }, []);

  const total = (taskStats?.todo || 0) + (taskStats?.in_progress || 0) + (taskStats?.done || 0);

  const data = {
    labels: ['To Do', 'In Progress', 'Selesai'],
    datasets: [
      {
        data: [taskStats?.todo || 0, taskStats?.in_progress || 0, taskStats?.done || 0],
        backgroundColor: ['#87928E', '#D97706', '#107B57'],
        borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { family: 'Manrope', size: 13 },
          color: '#1D2D29',
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} task`,
        },
      },
    },
  };

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-text-secondary">
        <p className="text-sm">Belum ada task untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative h-56">
      {/* Center total */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ bottom: '40px' }}>
        <span className="text-3xl font-bold text-text-main font-display">{total}</span>
        <span className="text-xs text-text-secondary">Total Task</span>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
}
