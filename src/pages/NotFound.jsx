import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle size={36} className="text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-dark-text mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
        </p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/25 transition-colors cursor-pointer"
          >
            <FiHome size={16} />
            Kembali ke Dashboard
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
