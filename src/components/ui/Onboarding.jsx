import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckSquare, FiBarChart2, FiCalendar } from 'react-icons/fi';

const STORAGE_KEY = 'taskflow_onboarded';

const features = [
  {
    icon: FiCheckSquare,
    title: 'Kelola Tugas',
    desc: 'Buat, edit, dan tandai tugas selesai dengan mudah.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: FiBarChart2,
    title: 'Lihat Statistik',
    desc: 'Pantau progres dan produktivitas harianmu.',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
  },
  {
    icon: FiCalendar,
    title: 'Atur Jadwal',
    desc: 'Lihat tugas di kalender dan atur deadline.',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500',
  },
];

export default function Onboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-2xl p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4"
              >
                <FiCheckSquare size={24} className="text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-900 dark:text-dark-text"
              >
                Selamat Datang di TaskFlow!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-2"
              >
                Kelola tugas harianmu dengan lebih efisien.
              </motion.p>
            </div>

            <div className="space-y-3 mb-6">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-surface"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${feat.color}`}>
                    <feat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{feat.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/25 transition-colors cursor-pointer"
            >
              Mulai
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
