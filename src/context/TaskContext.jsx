import { createContext, useContext, useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';

const TaskContext = createContext(null);

const MAX_TOASTS = 5;

const NOTIF_DEFAULTS = { enabled: true, reminderHours: 24, sound: true, soundType: 'beep' };

export function TaskProvider({ children }) {
  const taskData = useTasks();
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'light');
  const [notifSettings, setNotifSettings] = useLocalStorage(STORAGE_KEYS.NOTIF, NOTIF_DEFAULTS);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', action = null) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      const next = [...prev, { id, message, type, action }];
      return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const updateNotifSettings = useCallback((updates) => {
    setNotifSettings((prev) => ({ ...prev, ...updates }));
  }, [setNotifSettings]);

  const value = {
    ...taskData,
    theme,
    toggleTheme,
    notifSettings,
    updateNotifSettings,
    toasts,
    addToast,
    removeToast,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;
