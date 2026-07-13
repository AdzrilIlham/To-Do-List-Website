import { indexedDBStorage } from './db.js';

const STORAGE_KEYS = {
  TASKS: 'todo_tasks',
  THEME: 'todo_theme',
};

let useIndexedDB = false;

async function probeIndexedDB() {
  try {
    await indexedDBStorage.set('__probe__', true);
    await indexedDBStorage.remove('__probe__');
    useIndexedDB = true;
    syncAllFromIndexedDB();
  } catch {
    useIndexedDB = false;
  }
}

async function syncAllFromIndexedDB() {
  if (!useIndexedDB) return;
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      const value = await indexedDBStorage.get(key);
      if (value !== null) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {}
  }
}

async function syncToIndexedDB(key, value) {
  if (!useIndexedDB) return;
  try {
    await indexedDBStorage.set(key, value);
  } catch {}
}

probeIndexedDB();

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
      syncToIndexedDB(key, value);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error('Storage quota exceeded');
        return { error: 'quota_exceeded' };
      }
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      if (useIndexedDB) {
        indexedDBStorage.remove(key).catch(() => {});
      }
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
      if (useIndexedDB) {
        indexedDBStorage.clear().catch(() => {});
      }
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  async exportData() {
    try {
      const data = {};
      const keys = Object.values(STORAGE_KEYS);
      if (useIndexedDB) {
        const result = await indexedDBStorage.exportData(keys);
        if (result.success) return result;
      }
      keys.forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) data[key] = JSON.parse(item);
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { success: false, error: error.message };
    }
  },

  async importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Format data tidak valid' };
      }
      const filtered = {};
      Object.entries(data).forEach(([key, value]) => {
        if (STORAGE_KEYS[key]) {
          filtered[key] = value;
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      if (useIndexedDB) {
        return await indexedDBStorage.importData(JSON.stringify(filtered));
      }
      return { success: true };
    } catch {
      return { success: false, error: 'File tidak valid atau rusak' };
    }
  },
};

export { STORAGE_KEYS };
