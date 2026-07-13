import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiTrash2, FiInfo, FiDatabase, FiDownload, FiUpload } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import { storage } from '../utils/storage';
import Button from '../components/ui/Button';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';

export default function Settings() {
  const { theme, toggleTheme, tasks, addToast } = useTaskContext();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const handleClearData = () => {
    storage.clear();
    addToast('Semua data berhasil dihapus. Memuat ulang...', 'success');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleExport = () => {
    const result = storage.exportData();
    if (result.success) {
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Data berhasil diexport!', 'success');
    } else {
      addToast('Gagal export data', 'error');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = storage.importData(event.target.result);
      if (result.success) {
        addToast('Data berhasil diimport! Memuat ulang...', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        addToast(result.error || 'Gagal import data', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Pengaturan</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Sesuaikan aplikasi sesuai kebutuhanmu</p>
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                {theme === 'dark' ? (
                  <FiSun size={18} className="text-yellow-500" />
                ) : (
                  <FiMoon size={18} className="text-yellow-500" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Tema</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Saat ini: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: theme === 'dark' ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiDatabase size={18} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Data</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kelola data lokal aplikasi</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Jumlah Tugas Tersimpan</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">{tasks.length}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Penyimpanan</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">Local Storage</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FiDownload size={18} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Backup & Restore</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Export atau import data tugas</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" size="sm" onClick={handleExport} className="flex-1">
              <FiDownload size={14} />
              Export JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1">
              <FiUpload size={14} />
              Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              aria-label="Import file JSON"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FiTrash2 size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Reset Data</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hapus semua data tugas</p>
            </div>
          </div>
          <p className="text-xs text-red-500 dark:text-red-400 mb-3 flex items-center gap-1.5">
            <FiInfo size={14} />
            Tindakan ini tidak dapat dibatalkan. Semua data akan hilang permanen.
          </p>
          <Button variant="danger" size="sm" onClick={() => setShowClearConfirm(true)}>
            <FiTrash2 size={14} />
            Hapus Semua Data
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FiInfo size={18} className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Tentang</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Informasi aplikasi</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Nama Aplikasi</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">TaskFlow</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Versi</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tech Stack</span>
              <span className="text-sm text-gray-900 dark:text-dark-text">React + Vite + Tailwind</span>
            </div>
          </div>
        </motion.div>
      </div>

      <ConfirmDeleteModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          setShowClearConfirm(false);
          handleClearData();
        }}
        taskTitle="SEMUA DATA TUGAS"
      />
    </div>
  );
}
