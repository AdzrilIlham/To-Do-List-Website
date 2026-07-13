import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTaskContext } from '../context/TaskContext';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 12,
        usePointStyle: true,
        pointStyleWidth: 8,
        font: { size: 11 },
      },
    },
  },
};

const barOptions = {
  ...chartOptions,
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } },
  },
};

const lineOptions = {
  ...chartOptions,
  scales: {
    y: { beginAtZero: true },
    x: { grid: { display: false } },
  },
};

export default function Statistics() {
  const { tasks } = useTaskContext();

  const pieData = useMemo(() => ({
    labels: ['Selesai', 'Belum Selesai'],
    datasets: [
      {
        data: [
          tasks.filter((t) => t.completed).length,
          tasks.filter((t) => !t.completed).length,
        ],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
        spacing: 4,
      },
    ],
  }), [tasks]);

  const barData = useMemo(() => ({
    labels: ['Rendah', 'Sedang', 'Tinggi'],
    datasets: [
      {
        label: 'Jumlah Tugas',
        data: [
          tasks.filter((t) => t.priority === 'low').length,
          tasks.filter((t) => t.priority === 'medium').length,
          tasks.filter((t) => t.priority === 'high').length,
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  }), [tasks]);

  const lineData = useMemo(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const count = tasks.filter((t) => {
        const created = new Date(t.createdAt);
        const createdStr = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}-${String(created.getDate()).padStart(2, '0')}`;
        return createdStr === dayStr;
      }).length;
      weekData.push(count);
    }

    return {
      labels: days.map((d, i) => {
        const d2 = new Date(today);
        d2.setDate(today.getDate() - (6 - i));
        return `${d} ${d2.getDate()}`;
      }),
      datasets: [
        {
          label: 'Tugas Baru',
          data: weekData,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Statistik</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Analisis produktivitas tugas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Status Tugas</h3>
          <div className="h-56 sm:h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Prioritas Tugas</h3>
          <div className="h-56 sm:h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 shadow-sm sm:col-span-2 lg:col-span-1"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Progres Mingguan</h3>
          <div className="h-56 sm:h-64">
            <Line data={lineData} options={lineOptions} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Tugas', value: tasks.length, color: 'text-primary' },
          { label: 'Tingkat Penyelesaian', value: `${completionRate}%`, color: 'text-green-500' },
          { label: 'Tugas Selesai', value: completedCount, color: 'text-green-500' },
          { label: 'Tugas Tertunda', value: tasks.length - completedCount, color: 'text-yellow-500' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 text-center shadow-sm"
          >
            <p className={`text-2xl sm:text-3xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
