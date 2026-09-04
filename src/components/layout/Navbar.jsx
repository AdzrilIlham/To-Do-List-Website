import { useState } from 'react';
import { FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { getAvatarStats } from '../../utils/avatarSystem';
import Avatar from '../ui/Avatar';
import GamificationModal from '../ui/GamificationModal';

export default function Navbar() {
  const { filters, setFilters, theme, toggleTheme, tasks } = useTaskContext();
  const { score, level, nextLevel, progress, onTimeCount, lateCount } = getAvatarStats(tasks || []);
  const [showGamification, setShowGamification] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-dark-border">
        <div className="flex items-center gap-2 sm:gap-4 px-4 lg:px-8 py-3">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
              aria-pressed={theme === 'dark'}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <button
              onClick={() => setShowGamification(true)}
              title={`${level.name} — ${score} EXP`}
              className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors cursor-pointer"
            >
              <Avatar level={level.level} size={36} />
              <span className="hidden sm:block text-left min-w-0">
                <span className="block text-[10px] font-semibold text-gray-900 dark:text-dark-text truncate">{level.name}</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">{score} EXP</span>
                  <span className="w-12 h-1.5 bg-gray-200 dark:bg-dark-surface rounded-full overflow-hidden">
                    <span className="block h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                  </span>
                </span>
              </span>
              <span className="sm:hidden text-[10px] font-medium text-gray-400">{score} EXP</span>
            </button>
          </div>
        </div>
      </header>

      <GamificationModal
        isOpen={showGamification}
        onClose={() => setShowGamification(false)}
        score={score}
        level={level}
        nextLevel={nextLevel}
        progress={progress}
        onTimeCount={onTimeCount}
        lateCount={lateCount}
      />
    </>
  );
}
