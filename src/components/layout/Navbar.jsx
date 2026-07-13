import { FiSearch, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';

export default function Navbar() {
  const { filters, setFilters, theme, toggleTheme, setSidebarOpen } = useTaskContext();

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-dark-border">
      <div className="flex items-center gap-2 sm:gap-4 px-4 lg:px-8 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Buka menu navigasi"
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-500 dark:text-gray-400 lg:hidden cursor-pointer"
        >
          <FiMenu size={20} />
        </button>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari tugas..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              aria-label="Cari tugas"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
            aria-pressed={theme === 'dark'}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
