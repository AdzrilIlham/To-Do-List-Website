import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiTrash2, FiInfo, FiDatabase, FiDownload, FiUpload, FiBell, FiArchive, FiLogOut, FiPlay, FiVolume2, FiSmartphone, FiUserMinus } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { playSound } from '../hooks/useNotifications';
import usePushSubscription from '../hooks/usePushSubscription';
import Button from '../components/ui/Button';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';

const SOUND_OPTIONS = [
  { value: 'beep', label: 'Beep' },
  { value: 'chime', label: 'Chime' },
  { value: 'ding', label: 'Ding' },
  { value: 'bell', label: 'Bell' },
  { value: 'none', label: 'Tanpa Suara' },
];

function getPlatform() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  return { isIOS, isAndroid, isStandalone };
}

export default function Settings() {
  const { theme, toggleTheme, tasks, addToast, notifSettings, updateNotifSettings, clearAllTasks, refetchTasks } = useTaskContext();
  const { user, signOut, deleteAccount } = useAuth();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const fileInputRef = useRef(null);
  const [notifPermission, setNotifPermission] = useState(
    () => (typeof Notification !== 'undefined' ? Notification.permission : 'denied')
  );
  const { isSubscribed, loading: pushLoading, subscribe, unsubscribe } = usePushSubscription();
  const [platform] = useState(() => getPlatform());

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleRequestNotifPermission = async () => {
    if (typeof Notification === 'undefined') {
      addToast('Browser tidak mendukung notifikasi', 'error');
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setNotifPermission(result);
      if (result === 'granted') {
        addToast('Notifikasi berhasil diaktifkan!', 'success');
      } else {
        addToast('Izin notifikasi ditolak', 'error');
      }
    } catch {
      addToast('Gagal meminta izin notifikasi', 'error');
    }
  };

  const handleTogglePush = async () => {
    if (pushLoading) return;
    if (isSubscribed) {
      const ok = await unsubscribe();
      addToast(ok ? 'Notifikasi push dinonaktifkan' : 'Gagal menonaktifkan push', ok ? 'info' : 'error');
    } else {
      if (notifPermission !== 'granted') {
        const permPromise = Notification.requestPermission();
        const result = await permPromise.catch(() => 'denied');
        setNotifPermission(result);
        if (result !== 'granted') {
          addToast('Izin notifikasi diperlukan untuk push', 'error');
          return;
        }
      }
      const res = await subscribe();
      if (res && res.success) {
        addToast('Notifikasi push aktif! Reminder akan muncul walau app tertutup.', 'success');
      } else {
        addToast(res?.error || 'Gagal mengaktifkan push', 'error');
      }
    }
  };

  const handleClearData = async () => {
    try {
      await clearAllTasks();
      storage.clear();
      addToast('Semua data tugas berhasil dihapus.', 'success');
    } catch {
      addToast('Gagal menghapus semua data tugas.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      addToast('Akun Anda berhasil dihapus.', 'info');
    } catch (err) {
      console.error('Gagal menghapus akun:', err);
      addToast(err.message || 'Gagal menghapus akun', 'error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleExport = async () => {
    const result = await storage.exportData();
    if (result.success) {
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todoo-backup-${new Date().toISOString().split('T')[0]}.json`;
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
    reader.onload = async (event) => {
      const result = await storage.importData(event.target.result, user?.id);
      if (result.success) {
        await refetchTasks();
        addToast('Data berhasil diimport!', 'success');
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
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <FiBell size={18} className="text-pink-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Pengingat</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Notifikasi sebelum deadline</p>
            </div>
          </div>
          <div className="space-y-4">
            {notifPermission !== 'granted' && (
              <div className="flex items-center justify-between gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                <div className="flex items-center gap-2">
                  <FiBell size={14} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-xs text-yellow-700 dark:text-yellow-300">
                    {notifPermission === 'denied'
                      ? platform.isIOS
                        ? 'Izin ditolak. Buka iPhone → Pengaturan → Safari → Notifikasi → ToDoo → Aktifkan.'
                        : platform.isAndroid
                          ? 'Izin ditolak. Buka Pengaturan → Aplikasi → Chrome → Notifikasi → ToDoo → Aktifkan.'
                          : 'Izin notifikasi ditolak. Aktifkan di pengaturan browser.'
                      : 'Aktifkan izin notifikasi agar pengingat berfungsi.'}
                  </span>
                </div>
                {notifPermission !== 'denied' && (
                  <Button variant="secondary" size="sm" onClick={handleRequestNotifPermission}>
                    Aktifkan
                  </Button>
                )}
              </div>
            )}

            {!platform.isStandalone && (platform.isIOS || platform.isAndroid) && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiSmartphone size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    {platform.isIOS ? 'Tambahkan ke Layar Utama' : 'Install Aplikasi'}
                  </span>
                </div>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 mb-2">
                  {platform.isIOS
                    ? 'Push notification hanya aktif jika ToDoo di-install dari Layar Utama. Buka di Safari, ketuk tombol Share, pilih "Add to Home Screen".'
                    : 'Push notification hanya aktif jika ToDoo di-install. Buka di Chrome, ketuk menu ⋮ → "Install app" / "Tambahkan ke Layar Utama".'}
                </p>
                {platform.isIOS && (
                  <ol className="text-[10px] text-blue-600/80 dark:text-blue-400/70 space-y-0.5 list-decimal list-inside">
                    <li>Buka Todoo di Safari</li>
                    <li>Ketuk tombol Share (kotak dengan panah ↑)</li>
                    <li>Pilih &quot;Add to Home Screen&quot;</li>
                    <li>Ketuk &quot;Add&quot;</li>
                    <li>Buka ToDoo dari Layar Utama</li>
                  </ol>
                )}
                {platform.isAndroid && (
                  <ol className="text-[10px] text-blue-600/80 dark:text-blue-400/70 space-y-0.5 list-decimal list-inside">
                    <li>Buka Todoo di Chrome</li>
                    <li>Ketuk menu ⋮ (titik tiga)</li>
                    <li>Pilih &quot;Install app&quot; atau &quot;Tambahkan ke Layar Utama&quot;</li>
                    <li>Ketuk &quot;Install&quot;</li>
                    <li>Buka ToDoo dari Layar Utama</li>
                  </ol>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Aktifkan Pengingat</span>
              <button
                onClick={() => updateNotifSettings({ enabled: !notifSettings.enabled })}
                aria-label={notifSettings.enabled ? 'Nonaktifkan pengingat' : 'Aktifkan pengingat'}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                  notifSettings.enabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: notifSettings.enabled ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FiSmartphone size={14} className="text-gray-400 dark:text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block">Push (App Tertutup)</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {!platform.isStandalone && (platform.isIOS || platform.isAndroid)
                      ? 'Perlu install dari Layar Utama'
                      : 'Reminder tetap jalan walau app ditutup'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleTogglePush}
                disabled={pushLoading || (!platform.isStandalone && (platform.isIOS || platform.isAndroid))}
                aria-label={isSubscribed ? 'Nonaktifkan push' : 'Aktifkan push'}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubscribed ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: isSubscribed ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Suara Notifikasi</span>
              <div className="space-y-2">
                {SOUND_OPTIONS.filter((o) => o.value !== 'none').map((opt) => (
                  <div key={opt.value} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                    <div className="flex items-center gap-2">
                      <FiVolume2 size={14} className="text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => playSound(opt.value)}
                        aria-label={`Coba suara ${opt.label}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors cursor-pointer"
                        title={`Coba ${opt.label}`}
                      >
                        <FiPlay size={12} className="text-gray-400 dark:text-gray-500" />
                      </button>
                      <button
                        onClick={() => updateNotifSettings({ soundType: opt.value, sound: true })}
                        aria-label={`Pilih suara ${opt.label}`}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                          notifSettings.soundType === opt.value
                            ? 'border-primary bg-primary'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                        }`}
                      >
                        {notifSettings.soundType === opt.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">Supabase</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FiArchive size={18} className="text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Arsip</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lihat tugas yang sudah selesai</p>
            </div>
          </div>
          <Link
            to="/archive"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            <FiArchive size={14} />
            Buka Arsip
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
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
          transition={{ delay: 0.3 }}
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
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">ToDoo</span>
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-red-200 dark:border-red-800/30 p-5 shadow-sm space-y-3"
        >
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 transition-colors cursor-pointer"
          >
            <FiLogOut size={18} />
            Keluar
          </button>

          <button
            onClick={() => setShowDeleteAccountConfirm(true)}
            disabled={isDeletingAccount}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <FiUserMinus size={18} />
            Hapus Akun Permanen
          </button>
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

      <ConfirmDeleteModal
        isOpen={showDeleteAccountConfirm}
        onClose={() => setShowDeleteAccountConfirm(false)}
        onConfirm={() => {
          setShowDeleteAccountConfirm(false);
          handleDeleteAccount();
        }}
        taskTitle="AKUN ANDA DAN SEMUA DATA DI DATABASE"
      />
    </div>
  );
}
