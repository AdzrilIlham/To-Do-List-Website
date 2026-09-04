import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiClock, FiCheck, FiAlertTriangle, FiRepeat, FiFileText } from 'react-icons/fi';
import { formatShortDate, isDueSoon, isPastDue, getPriorityColor, getCategoryColor, wasCompletedLate } from '../../utils/helper';
import { getPriorityLabel, getCategoryLabel } from '../../utils/filter';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal';
import { useTaskContext } from '../../context/TaskContext';

const TaskCard = memo(function TaskCard({ task, index = 0, onEdit, selected, onSelect }) {
  const { toggleTask, deleteTask, addToast } = useTaskContext();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  const priorityColor = getPriorityColor(task.priority);
  const categoryColor = getCategoryColor(task.category);
  const dueSoon = isDueSoon(task.deadline);
  const pastDue = isPastDue(task.deadline) && !task.completed;

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      addToast('Tugas berhasil dihapus', 'info');
    } catch {
      addToast('Gagal menghapus tugas dari Supabase', 'error');
    } finally {
      setShowDelete(false);
    }
  };

  const handleToggle = () => {
    toggleTask(task.id);
    addToast(
      task.completed ? 'Tugas dikembalikan' : 'Tugas selesai!',
      task.completed ? 'info' : 'success'
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ y: -2, scale: 1.005 }}
        className={`group bg-white dark:bg-dark-card rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
          task.completed
            ? 'border-green-200 dark:border-green-800/30 opacity-75'
            : pastDue
            ? 'border-red-200 dark:border-red-800/30'
            : 'border-gray-100 dark:border-dark-border hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20'
        } ${selected ? 'ring-2 ring-primary/30' : ''}`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex items-center gap-2 mt-0.5">
            {onSelect && (
              <button
                onClick={() => onSelect(task.id)}
                aria-label={selected ? `Batal pilih ${task.title}` : `Pilih ${task.title}`}
                aria-pressed={selected}
                className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                  selected
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                }`}
              >
                {selected && <FiCheck size={10} strokeWidth={3} />}
              </button>
            )}
            <button
              onClick={handleToggle}
              aria-label={task.completed ? `Tandai belum selesai: ${task.title}` : `Tandai selesai: ${task.title}`}
              aria-pressed={task.completed}
              className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary'
              }`}
            >
              {task.completed && <FiCheck size={12} strokeWidth={3} />}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                onClick={() => navigate('/task/' + task.id)}
                className={`text-sm sm:text-base font-semibold leading-tight cursor-pointer hover:text-primary transition-colors ${
                  task.completed
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-900 dark:text-dark-text'
                }`}
              >
                {task.title}
              </h3>
              {dueSoon && !task.completed && (
                <div className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <FiAlertTriangle size={12} className="text-red-500" />
                  <span className="text-[10px] font-bold text-red-500">HARI INI</span>
                </div>
              )}
            </div>

            {task.description && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                {task.description}
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
              {task.subtasks && task.subtasks.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} selesai
                </span>
              )}
              {task.recurrence && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-purple-500">
                  <FiRepeat size={12} />
                </span>
              )}
              {task.notes && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-amber-500">
                  <FiFileText size={12} />
                </span>
              )}
              {wasCompletedLate(task) && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  Terlambat
                </span>
              )}
              <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs ${pastDue && !task.completed ? 'text-red-500 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                <FiClock size={12} />
                {formatShortDate(task.deadline)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-400 hover:text-primary transition-colors cursor-pointer"
              title="Edit"
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              aria-label={`Hapus ${task.title}`}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Hapus"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmDeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />
    </>
  );
});

export default TaskCard;
