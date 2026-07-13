import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import { formatShortDate, isPastDue } from '../utils/helper';
import { getPriorityLabel, filterTasksByDate } from '../utils/filter';

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function Calendar() {
  const { tasks } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, key: `empty-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, key: `day-${d}` });
    }
    return days;
  }, [firstDay, daysInMonth]);

  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filterTasksByDate(tasks, dateStr);
  };

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    return getTasksForDay(selectedDate);
  }, [selectedDate, tasks, year, month]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Kalender</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Lihat tugas berdasarkan tanggal</p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-dark-border">
          <button onClick={prevMonth} aria-label="Bulan sebelumnya" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-500 cursor-pointer">
            <FiChevronLeft size={18} />
          </button>
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-dark-text">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} aria-label="Bulan berikutnya" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-500 cursor-pointer">
            <FiChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7">
          {WEEKDAYS.map((day) => (
            <div key={day} className="px-1 sm:px-2 py-2.5 text-center text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-50 dark:border-dark-border">
              {day}
            </div>
          ))}

          {calendarDays.map(({ day, key }) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            const dateKey = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
            const isTodayDate = dateKey === todayStr;
            const isSelected = selectedDate === day;
            const hasPastDue = dayTasks.some((t) => isPastDue(t.deadline) && !t.completed);

            return (
              <motion.button
                key={key}
                whileHover={day ? { scale: 1.05 } : {}}
                whileTap={day ? { scale: 0.95 } : {}}
                onClick={() => day && setSelectedDate(selectedDate === day ? null : day)}
                disabled={!day}
                aria-label={day ? `${day} ${MONTHS[month]}, ${dayTasks.length} tugas` : undefined}
                className={`relative min-h-[48px] sm:min-h-[72px] p-1 border-b border-r border-gray-50 dark:border-dark-border transition-all cursor-pointer disabled:cursor-default ${
                  !day
                    ? ''
                    : isSelected
                    ? 'bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/30'
                    : isTodayDate
                    ? 'bg-blue-50/50 dark:bg-blue-900/10'
                    : 'hover:bg-gray-50 dark:hover:bg-dark-surface'
                }`}
              >
                {day && (
                  <>
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[9px] sm:text-xs font-medium ${
                        isTodayDate
                          ? 'bg-primary text-white'
                          : isSelected
                          ? 'text-primary font-bold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="mt-0.5 flex flex-wrap gap-0.5">
                        {dayTasks.slice(0, 3).map((t, i) => (
                          <div
                            key={i}
                            className={`w-full h-1 rounded-full ${
                              t.completed ? 'bg-green-400' : hasPastDue && !t.completed ? 'bg-red-400' : 'bg-primary/60'
                            }`}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className="text-[8px] sm:text-[9px] text-gray-400">+{dayTasks.length - 3}</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-4 sm:p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-3">
            Tugas pada tanggal {selectedDate} {MONTHS[month]} {year}
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Tidak ada tugas pada tanggal ini.</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    task.completed
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
                      : isPastDue(task.deadline)
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                      : 'bg-gray-50 dark:bg-dark-surface border-gray-100 dark:border-dark-border'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <FiClock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">{formatShortDate(task.deadline)}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
