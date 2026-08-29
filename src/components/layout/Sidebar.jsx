import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiCalendar, FiBarChart2, FiSettings, FiX, FiClock, FiArchive, FiLogOut, FiUser } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/today', label: 'Hari Ini', icon: FiClock },
  { to: '/archive', label: 'Arsip', icon: FiArchive },
  { to: '/calendar', label: 'Kalender', icon: FiCalendar },
  { to: '/statistics', label: 'Statistik', icon: FiBarChart2 },
  { to: '/settings', label: 'Pengaturan', icon: FiSettings },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useTaskContext();
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-dark-border">
        <img src="/favicon-32x32.png" alt="ToDoo Logo" className="w-9 h-9 object-contain" />
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-dark-text tracking-tight">ToDoo</h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Manage your tasks</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navigasi utama">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className="block"
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-dark-border space-y-3">
        {user && (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 overflow-hidden text-xs text-gray-600 dark:text-gray-400">
              <FiUser size={14} className="shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <button
              onClick={signOut}
              title="Keluar"
              className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        )}
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          ToDoo v1.0.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 h-screen bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-card z-50 lg:hidden shadow-xl"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Tutup menu"
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-400 cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
