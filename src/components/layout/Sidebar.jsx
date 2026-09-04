import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiCalendar, FiBarChart2, FiSettings, FiClock, FiArchive } from 'react-icons/fi';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/today', label: 'Hari Ini', icon: FiClock },
  { to: '/archive', label: 'Arsip', icon: FiArchive },
  { to: '/calendar', label: 'Kalender', icon: FiCalendar },
  { to: '/statistics', label: 'Statistik', icon: FiBarChart2 },
  { to: '/settings', label: 'Pengaturan', icon: FiSettings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border fixed left-0 top-0 z-30">
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

      <div className="p-4 border-t border-gray-100 dark:border-dark-border">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          ToDoo v1.0.0
        </p>
      </div>
    </aside>
  );
}
