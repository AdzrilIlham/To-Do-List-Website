import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiArchive, FiClock, FiRotateCcw, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import { formatDate, getPriorityColor, getCategoryColor } from '../utils/helper';
import { getPriorityLabel, getCategoryLabel } from '../utils/filter';

export default function Archive() {
  const { tasks, toggleTask, deleteTask, addToast } = useTaskContext();

  const completedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)),
    [tasks]
  );

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const handleRestore = (task) => {
    toggleTask(task.id);
    addToast('Tugas dikembalikan ke daftar aktif', 'info');
  };

  const handleDelete = (task) => {
    deleteTask(task.id);
    addToast('Tugas dihapus secara permanen', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
            <FiArchive size={20} className="text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Arsip</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Tugas yang sudah diselesaikan
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <FiCheckCircle size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{completedTasks.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Selesai</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <FiClock size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{completionRate}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tingkat Penyelesaian</p>
            </div>
          </div>
        </motion.div>
      </div>

      {completedTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-8 sm:p-12 shadow-sm text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center mx-auto mb-4">
            <FiArchive size={28} className="text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-1">
            Belum ada tugas selesai
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tugas yang sudah diselesaikan akan muncul di sini.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {completedTasks.map((task, index) => {
            const priorityColor = getPriorityColor(task.priority);
            const categoryColor = getCategoryColor(task.category);

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 sm:p-5 shadow-sm"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-5 h-5 rounded-lg bg-green-500 border-2 border-green-500 text-white flex items-center justify-center mt-0.5">
                    <FiCheckCircle size={12} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold leading-tight line-through text-gray-400 dark:text-gray-500 mb-1">
                      {task.title}
                    </h3>
                    {task.completedAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                        Diselesaikan pada {formatDate(task.completedAt)}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${priorityColor.bg} ${priorityColor.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityColor.dot}`} />
                        {getPriorityLabel(task.priority)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                        {getCategoryLabel(task.category)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleRestore(task)}
                      aria-label={`Kembalikan ${task.title}`}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                      title="Kembalikan"
                    >
                      <FiRotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      aria-label={`Hapus permanen ${task.title}`}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Hapus permanen"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
