export const CATEGORIES = [
  { value: 'kuliah', label: 'Kuliah' },
  { value: 'pekerjaan', label: 'Pekerjaan' },
  { value: 'pribadi', label: 'Pribadi' },
  { value: 'organisasi', label: 'Organisasi' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Rendah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'high', label: 'Tinggi' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'deadline-asc', label: 'Deadline Terdekat' },
  { value: 'deadline-desc', label: 'Deadline Terjauh' },
  { value: 'priority-desc', label: 'Prioritas Tertinggi' },
  { value: 'priority-asc', label: 'Prioritas Terendah' },
  { value: 'name-asc', label: 'Nama A-Z' },
  { value: 'name-desc', label: 'Nama Z-A' },
];

export const getPriorityLabel = (value) => {
  const p = PRIORITIES.find((p) => p.value === value);
  return p ? p.label : value;
};

export const getCategoryLabel = (value) => {
  const c = CATEGORIES.find((c) => c.value === value);
  return c ? c.label : value;
};

const priorityOrder = { high: 3, medium: 2, low: 1 };

export const filterTasks = (tasks, filters) => {
  return tasks.filter((task) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(searchLower);
      const matchDesc = task.description?.toLowerCase().includes(searchLower);
      const matchCat = task.category?.toLowerCase().includes(searchLower);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.category && task.category !== filters.category) return false;
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.status === 'pending' && task.completed) return false;
    if (filters.status === 'late') {
      if (!(task.completed && task.completedAt && task.deadline &&
        new Date(task.completedAt) > new Date(task.deadline))) return false;
    }

    return true;
  });
};

export const sortTasks = (tasks, sortBy) => {
  const sorted = [...tasks];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'deadline-asc':
      return sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    case 'deadline-desc':
      return sorted.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    case 'priority-desc':
      return sorted.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    case 'priority-asc':
      return sorted.sort((a, b) => (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0));
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
};

export const filterTasksByDate = (tasks, dateStr) => {
  return tasks.filter((task) => {
    const d = new Date(task.deadline);
    if (isNaN(d.getTime())) return false;
    const taskDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return taskDateStr === dateStr;
  });
};
