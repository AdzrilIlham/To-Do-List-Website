import { useState, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId, getDefaultTasks, isToday, isPastDue } from '../utils/helper';
import { filterTasks, sortTasks } from '../utils/filter';
import { STORAGE_KEYS } from '../utils/storage';

const INITIAL_TASKS = getDefaultTasks();

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
    status: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const deletedRef = useRef(null);

  const filteredTasks = useMemo(() => {
    return sortTasks(filterTasks(tasks, filters), sortBy);
  }, [tasks, filters, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => !t.completed && isPastDue(t.deadline)).length;
    const todayTasks = tasks.filter((t) => isToday(t.deadline)).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, todayTasks, overdue, progress };
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      deadline: taskData.deadline,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'lainnya',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      subtasks: taskData.subtasks || [],
      recurrence: taskData.recurrence || null,
      notes: taskData.notes || '',
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, [setTasks]);

  const deleteTaskWithUndo = useCallback((id, addToast) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    deletedRef.current = task;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (addToast) {
      addToast('Tugas dihapus. Ketuk "Urungkan" untuk membatalkan.', 'warning', {
        label: 'Urungkan',
        onClick: () => {
          if (deletedRef.current) {
            setTasks((prev) => [deletedRef.current, ...prev]);
            deletedRef.current = null;
            addToast('Tugas dikembalikan!', 'success');
          }
        },
      });
    }
  }, [tasks, setTasks]);

  const toggleTask = useCallback((id) => {
    let completedTask = null;
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id !== id) return task;
        const wasCompleted = task.completed;
        const nowCompleted = !wasCompleted;
        completedTask = task;
        return {
          ...task,
          completed: nowCompleted,
          completedAt: nowCompleted ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };
      });
      if (completedTask && !completedTask.completed && completedTask.recurrence) {
        const deadlineDate = new Date(completedTask.deadline);
        let newDeadline;
        switch (completedTask.recurrence) {
          case 'daily':
            newDeadline = new Date(deadlineDate.getTime() + 1 * 24 * 60 * 60 * 1000);
            break;
          case 'weekly':
            newDeadline = new Date(deadlineDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'monthly':
            newDeadline = new Date(deadlineDate);
            newDeadline.setMonth(newDeadline.getMonth() + 1);
            break;
          default:
            newDeadline = new Date(deadlineDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        }
        const newTask = {
          ...completedTask,
          id: generateId(),
          deadline: newDeadline.toISOString(),
          completed: false,
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [newTask, ...updated];
      }
      return updated;
    });
  }, [setTasks]);

  const batchComplete = useCallback(() => {
    setTasks((prev) =>
      prev.map((task) =>
        selectedIds.includes(task.id) && !task.completed
          ? { ...task, completed: true, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : task
      )
    );
    setSelectedIds([]);
  }, [selectedIds, setTasks]);

  const batchDelete = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !selectedIds.includes(task.id)));
    setSelectedIds([]);
  }, [selectedIds, setTasks]);

  const batchUncomplete = useCallback(() => {
    setTasks((prev) =>
      prev.map((task) =>
        selectedIds.includes(task.id) && task.completed
          ? { ...task, completed: false, completedAt: null, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setSelectedIds([]);
  }, [selectedIds, setTasks]);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.length === filteredTasks.length) return [];
      return filteredTasks.map((t) => t.id);
    });
  }, [filteredTasks]);

  const toggleSelectOne = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  return {
    tasks,
    filteredTasks,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    addTask,
    updateTask,
    deleteTask,
    deleteTaskWithUndo,
    toggleTask,
    selectedIds,
    setSelectedIds,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    batchComplete,
    batchDelete,
    batchUncomplete,
    stats,
  };
}

export default useTasks;
