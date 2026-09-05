import { taskService } from '../services/taskService';

const STORAGE_KEYS = {
  THEME: 'todo_theme',
  NOTIF: 'todoo_notif_settings',
};

export const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      localStorage.removeItem('todoo_notif_settings');
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  async exportData() {
    try {
      const tasks = await taskService.fetchTasks();
      const theme = this.get(STORAGE_KEYS.THEME) || 'light';
      return {
        success: true,
        data: {
          todo_tasks: tasks,
          todo_theme: theme,
        },
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { success: false, error: error.message };
    }
  },

  async importData(jsonString, userId) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Format data tidak valid' };
      }

      if (Array.isArray(data.todo_tasks)) {
        for (const task of data.todo_tasks) {
          await taskService.createTask(task, userId);
        }
      }

      if (data.todo_theme) {
        this.set(STORAGE_KEYS.THEME, data.todo_theme);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'File tidak valid atau rusak' };
    }
  },
};

export { STORAGE_KEYS };
