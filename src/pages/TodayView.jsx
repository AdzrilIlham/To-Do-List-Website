import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSun, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import { isToday, isPastDue, isDueSoon } from '../utils/helper';
import TaskList from '../components/task/TaskList';
import TaskForm from '../components/task/TaskForm';
import Modal from '../components/ui/Modal';

export default function TodayView() {
  const { tasks, addTask, updateTask, addToast } = useTaskContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isToday(t.deadline));
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => !t.completed && isPastDue(t.deadline) && !isToday(t.deadline));
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((t) => !t.completed && isDueSoon(t.deadline) && !isToday(t.deadline) && !isPastDue(t.deadline));
  }, [tasks]);

  const handleAddTask = (taskData) => {
    addTask(taskData);
    addToast('Tugas berhasil ditambahkan!', 'success');
    setShowAddModal(false);
  };

  const handleEditTask = (taskData) => {
    updateTask(editingTask.id, taskData);
    addToast('Tugas berhasil diperbarui!', 'success');
    setEditingTask(null);
  };

  const todayCompleted = todayTasks.filter((t) => t.completed).length;
  const todayTotal = todayTasks.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Hari Ini</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/25 transition-colors cursor-pointer"
        >
          <FiPlus size={16} />
          <span className="hidden sm:inline">Tambah</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiSun size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{todayTotal}</p>
              <p className="text-[10px] text-gray-400">Total Hari Ini</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FiCheckCircle size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{todayCompleted}</p>
              <p className="text-[10px] text-gray-400">Selesai</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <FiClock size={18} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{todayTotal - todayCompleted}</p>
              <p className="text-[10px] text-gray-400">Tersisa</p>
            </div>
          </div>
        </motion.div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FiAlertCircle size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-red-500">Terlambat ({overdueTasks.length})</h2>
          </div>
          <TaskList tasks={overdueTasks} onEdit={setEditingTask} />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tugas Hari Ini ({todayTasks.length})
        </h2>
        <TaskList tasks={todayTasks} onEdit={setEditingTask} />
      </div>

      {upcomingTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Akan Datang ({upcomingTasks.length})
          </h2>
          <TaskList tasks={upcomingTasks} onEdit={setEditingTask} />
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Tugas Baru">
        <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Tugas">
        {editingTask && (
          <TaskForm task={editingTask} onSubmit={handleEditTask} onCancel={() => setEditingTask(null)} />
        )}
      </Modal>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        aria-label="Tambah tugas baru"
        className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center z-10 cursor-pointer lg:hidden"
      >
        <FiPlus size={24} />
      </motion.button>
    </div>
  );
}
