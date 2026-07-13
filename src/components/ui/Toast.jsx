import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX, FiRotateCcw } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';

const icons = {
  success: <FiCheckCircle size={18} className="text-green-500" />,
  error: <FiAlertCircle size={18} className="text-red-500" />,
  warning: <FiAlertTriangle size={18} className="text-yellow-500" />,
  info: <FiInfo size={18} className="text-blue-500" />,
};

const bgColors = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

export default function Toast() {
  const { toasts, removeToast } = useTaskContext();

  return (
    <div
      className="fixed bottom-24 right-4 sm:bottom-4 z-[100] flex flex-col gap-2 max-w-sm"
      aria-live="polite"
      aria-label="Notifikasi"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColors[toast.type] || bgColors.info}`}
          >
            {icons[toast.type] || icons.info}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">
              {toast.message}
            </p>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick();
                  removeToast(toast.id);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
              >
                <FiRotateCcw size={12} />
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Tutup notifikasi"
              className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <FiX size={14} className="text-gray-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
