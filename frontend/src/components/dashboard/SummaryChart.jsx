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
        backgroundColor: ['#94A3B8', '#F59E0B', '#22C55E'],
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
          font: { family: 'Inter', size: 13 },
          color: '#0F172A',
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
      <div className="flex flex-col items-center justify-center h-52 text-[#94A3B8]">
        <p className="text-sm">Belum ada task untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative h-56">
      {/* Center total */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ bottom: '40px' }}>
        <span className="text-3xl font-bold text-[#0F172A]">{total}</span>
        <span className="text-xs text-[#64748B]">Total Task</span>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
}
