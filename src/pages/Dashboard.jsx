import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp, FiCalendar, FiTarget } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import StatisticsCard from '../components/ui/StatisticsCard';
import ProgressBar from '../components/ui/ProgressBar';
import TaskList from '../components/task/TaskList';
import TaskForm from '../components/task/TaskForm';
import FilterBar from '../components/task/FilterBar';
import Modal from '../components/ui/Modal';
import { SkeletonStats } from '../components/ui/Skeleton';

export default function Dashboard() {
  const { filteredTasks, stats, addTask, updateTask, addToast, selectedIds, toggleSelectOne, toggleSelectAll, loading } = useTaskContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    filteredTasks.forEach((task) => {
      if (task.completed || notifiedRef.current.has(task.id)) return;
      const deadline = new Date(task.deadline);
      if (deadline > now && deadline < in24h) {
        new Notification('TaskFlow - Deadline Mendekat!', {
          body: `"${task.title}" deadline dalam kurang dari 24 jam!`,
          icon: '/favicon.svg',
        });
        notifiedRef.current.add(task.id);
      }
    });
  }, [filteredTasks]);

  const handleAddTask = async (taskData) => {
    try {
      await addTask(taskData);
      addToast('Tugas berhasil ditambahkan!', 'success');
      setShowAddModal(false);
    } catch {
      addToast('Gagal menambahkan tugas ke Supabase', 'error');
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      addToast('Tugas berhasil diperbarui!', 'success');
      setEditingTask(null);
    } catch {
      addToast('Gagal memperbarui tugas di Supabase', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola semua tugas kamu
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/25 transition-colors cursor-pointer"
        >
          <FiPlus size={16} />
          <span className="hidden sm:inline">Tambah Tugas</span>
        </motion.button>
      </div>

      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatisticsCard title="Total Task" value={stats.total} icon={FiTarget} color="bg-primary" />
          <StatisticsCard title="Selesai" value={stats.completed} icon={FiCheckCircle} color="bg-green-500" />
          <StatisticsCard title="Belum Selesai" value={stats.pending} icon={FiClock} color="bg-yellow-500" />
          <StatisticsCard title="Deadline Hari Ini" value={stats.todayTasks} icon={FiCalendar} color="bg-blue-500" />
          <StatisticsCard title="Terlambat" value={stats.overdue} icon={FiAlertCircle} color="bg-red-500" />
          <StatisticsCard title="Progres" value={`${stats.progress}%`} icon={FiTrendingUp} color="bg-purple-500" />
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 shadow-sm">
        <ProgressBar progress={stats.progress} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FilterBar />
          {filteredTasks.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              aria-label={selectedIds?.length === filteredTasks.length ? 'Batal pilih semua' : 'Pilih semua'}
            >
              {selectedIds?.length === filteredTasks.length ? 'Batal Pilih' : 'Pilih Semua'}
            </button>
          )}
        </div>
        <TaskList
          tasks={filteredTasks}
          onEdit={setEditingTask}
          selectedIds={selectedIds}
          onSelect={toggleSelectOne}
        />
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Tugas Baru"
      >
        <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Tugas"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleEditTask}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        aria-label="Tambah tugas baru"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center z-10 cursor-pointer lg:hidden"
      >
        <FiPlus size={24} />
      </motion.button>
    </div>
  );
}
