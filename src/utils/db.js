// Deprecated IndexedDB storage utility. Retained as stub for backwards compatibility.
export const indexedDBStorage = {
  async get() { return null; },
  async set() { return false; },
  async remove() { return false; },
  async clear() { return false; },
  async exportData() { return { success: true, data: {} }; },
  async importData() { return { success: true }; },
};
