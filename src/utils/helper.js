import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelative = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Besok';
  if (diffDays === -1) return 'Kemarin';
  if (diffDays > 0) return `${diffDays} hari lagi`;
  return `${Math.abs(diffDays)} hari yang lalu`;
};

export const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isThisWeek = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
};

export const isPastDue = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return date < now;
};

export const wasCompletedLate = (task) => {
  return task.completed && task.completedAt && task.deadline &&
    new Date(task.completedAt) > new Date(task.deadline);
};

export const isDueSoon = (dateString, hours = 24) => {
  const now = new Date();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= hours;
};

export const toLocalDatetimeString = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' };
    case 'medium':
      return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' };
    case 'low':
      return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' };
  }
};

export const getCategoryColor = (category) => {
  switch (category) {
    case 'kuliah': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' };
    case 'pekerjaan': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' };
    case 'pribadi': return { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' };
    case 'organisasi': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' };
    default: return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' };
  }
};

export const getDefaultTasks = () => [
  {
    id: generateId(),
    title: 'Selamat Datang di ToDoo!',
    description: 'Ini adalah tugas contoh. Kamu bisa menghapusnya dan menambahkan tugas baru.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
    category: 'pribadi',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    subtasks: [],
    recurrence: null,
    notes: '',
  },
  {
    id: generateId(),
    title: 'Kumpulkan Tugas Pemrograman Web',
    description: 'Selesaikan project React Todo App dan push ke GitHub.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    category: 'kuliah',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    subtasks: [],
    recurrence: null,
    notes: '',
  },
  {
    id: generateId(),
    title: 'Rapat Organisasi',
    description: 'Rapat mingguan divisi kebersamaan.',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    category: 'organisasi',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    subtasks: [],
    recurrence: null,
    notes: '',
  },
];
