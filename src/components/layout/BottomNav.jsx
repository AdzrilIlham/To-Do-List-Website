import { NavLink } from 'react-router-dom';
import { FiGrid, FiClock, FiCalendar, FiSettings } from 'react-icons/fi';

const tabs = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/today', label: 'Hari Ini', icon: FiClock },
  { to: '/calendar', label: 'Kalender', icon: FiCalendar },
  { to: '/settings', label: 'Pengaturan', icon: FiSettings },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border-t border-gray-100 dark:border-dark-border" aria-label="Navigasi bawah">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
