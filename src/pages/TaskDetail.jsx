import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiFlag, FiTag, FiClock, FiCheck, FiEdit2, FiRepeat, FiFileText } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import { formatDate, isPastDue, isDueSoon, getPriorityColor, getCategoryColor, formatRelative } from '../utils/helper';
import { getPriorityLabel, getCategoryLabel } from '../utils/filter';
import Button from '../components/ui/Button';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, toggleTask, updateTask, addToast } = useTaskContext();

  const task = useMemo(() => tasks.find((t) => t.id === id), [tasks, id]);

  if (!task) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">
          <FiArrowLeft size={16} />
          Kembali
        </button>
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-500">Tugas tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  const priorityColor = getPriorityColor(task.priority);
  const categoryColor = getCategoryColor(task.category);
  const pastDue = isPastDue(task.deadline) && !task.completed;
  const dueSoon = isDueSoon(task.deadline);

  const handleToggle = () => {
    toggleTask(task.id);
    addToast(
      task.completed ? 'Tugas dikembalikan' : 'Tugas selesai!',
      task.completed ? 'info' : 'success'
    );
  };

  const handleToggleSubtask = (subtaskId) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const RECURRENCE_LABELS = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">
        <FiArrowLeft size={16} />
        Kembali
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 shadow-sm"
      >
        <div className="flex items-start gap-4 mb-6">
          <button
            onClick={handleToggle}
            aria-label={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
            className={`mt-1 flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary'
            }`}
          >
            {task.completed && <FiCheck size={14} strokeWidth={3} />}
          </button>

          <div className="flex-1 min-w-0">
            <h1 className={`text-xl sm:text-2xl font-bold leading-tight mb-2 ${
              task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-dark-text'
            }`}>
              {task.title}
            </h1>

            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-100 dark:border-dark-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${priorityColor.bg} flex items-center justify-center`}>
                <FiFlag size={16} className={priorityColor.text} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Prioritas</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{getPriorityLabel(task.priority)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${categoryColor.bg} flex items-center justify-center`}>
                <FiTag size={16} className={categoryColor.text} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Kategori</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{getCategoryLabel(task.category)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${pastDue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'} flex items-center justify-center`}>
                <FiCalendar size={16} className={pastDue ? 'text-red-500' : 'text-blue-500'} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Deadline</p>
                <p className={`text-sm font-semibold ${pastDue ? 'text-red-500' : 'text-gray-900 dark:text-dark-text'}`}>
                  {formatDate(task.deadline)}
                </p>
                <p className="text-[10px] text-gray-400">{formatRelative(task.deadline)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                <FiClock size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Status</p>
                <p className={`text-sm font-semibold ${task.completed ? 'text-green-500' : pastDue ? 'text-red-500' : dueSoon ? 'text-yellow-500' : 'text-gray-900 dark:text-dark-text'}`}>
                  {task.completed ? 'Selesai' : pastDue ? 'Terlambat' : dueSoon ? 'Hampir Jatuh Tempo' : 'Berjalan'}
                </p>
              </div>
            </div>

            {task.recurrence && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FiRepeat size={16} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Pengulangan</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{RECURRENCE_LABELS[task.recurrence]}</p>
                </div>
              </div>
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="border-t border-gray-100 dark:border-dark-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">Subtasks</p>
                <span className="text-xs text-gray-400">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} selesai
                </span>
              </div>
              <ul className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <li key={subtask.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-dark-surface rounded-lg">
                    <button
                      onClick={() => handleToggleSubtask(subtask.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                        subtask.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                      }`}
                    >
                      {subtask.completed && <FiCheck size={12} strokeWidth={3} />}
                    </button>
                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                      {subtask.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {task.notes && (
            <div className="border-t border-gray-100 dark:border-dark-border pt-4">
              <div className="flex items-center gap-2 mb-2">
                <FiFileText size={16} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">Catatan</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-dark-surface rounded-xl p-4">
                {task.notes}
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-dark-border pt-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Dibuat: {formatDate(task.createdAt)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Diperbarui: {formatDate(task.updatedAt)}</p>
            {task.completedAt && (
              <p className="text-xs text-green-500 mt-1">Selesai: {formatDate(task.completedAt)}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/')}>
              <FiArrowLeft size={14} />
              Kembali
            </Button>
            <Button className="flex-1" onClick={() => navigate('/')}>
              <FiEdit2 size={14} />
              Edit
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
