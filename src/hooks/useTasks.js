import { useState, useCallback, useMemo, useEffect } from 'react';
import { isToday, isPastDue, wasCompletedLate } from '../utils/helper';
import { filterTasks, sortTasks } from '../utils/filter';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
    status: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error('Gagal mengambil tugas dari Supabase:', err);
      setError(err.message || 'Gagal memuat tugas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
    const completedLate = tasks.filter((t) => wasCompletedLate(t)).length;
    return { total, completed, pending, todayTasks, overdue, progress, completedLate };
  }, [tasks]);

  const addTask = useCallback(async (taskData) => {
    const payload = {
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

    try {
      const created = await taskService.createTask(payload, user?.id);
      setTasks((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Gagal membuat tugas:', err);
      throw err;
    }
  }, [user?.id]);

  const updateTask = useCallback(async (id, updates) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask) return;

    const merged = { ...currentTask, ...updates, updatedAt: new Date().toISOString() };
    setTasks((prev) => prev.map((t) => (t.id === id ? merged : t)));

    try {
      const updated = await taskService.updateTask(id, merged);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      console.error('Gagal memperbarui tugas:', err);
      setTasks((prev) => prev.map((t) => (t.id === id ? currentTask : t)));
      throw err;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id) => {
    const currentTask = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await taskService.deleteTask(id);
    } catch (err) {
      console.error('Gagal menghapus tugas:', err);
      if (currentTask) setTasks((prev) => [currentTask, ...prev]);
      throw err;
    }
  }, [tasks]);

  const deleteTaskWithUndo = useCallback(async (id, addToast) => {
    return deleteTask(id).then(() => {
      if (addToast) addToast('Tugas dihapus', 'info');
    });
  }, [deleteTask]);

  const toggleTask = useCallback(async (id) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask) return;

    const nowCompleted = !currentTask.completed;
    const updatedPayload = {
      ...currentTask,
      completed: nowCompleted,
      completedAt: nowCompleted ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => prev.map((t) => (t.id === id ? updatedPayload : t)));

    try {
      const updated = await taskService.updateTask(id, updatedPayload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      if (!currentTask.completed && currentTask.recurrence) {
        const deadlineDate = new Date(currentTask.deadline);
        let newDeadline;
        switch (currentTask.recurrence) {
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

        const recurringTask = {
          title: currentTask.title,
          description: currentTask.description || '',
          deadline: newDeadline.toISOString(),
          priority: currentTask.priority || 'medium',
          category: currentTask.category || 'lainnya',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: null,
          subtasks: currentTask.subtasks || [],
          recurrence: currentTask.recurrence,
          notes: currentTask.notes || '',
        };

        const createdRecurring = await taskService.createTask(recurringTask, user?.id);
        setTasks((prev) => [createdRecurring, ...prev]);
      }
    } catch (err) {
      console.error('Gagal toggle tugas:', err);
      setTasks((prev) => prev.map((t) => (t.id === id ? currentTask : t)));
    }
  }, [tasks, user?.id]);

  const batchComplete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const currentTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) && !t.completed
          ? { ...t, completed: true, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : t
      )
    );

    try {
      await taskService.batchUpdateTasks(selectedIds, {
        completed: true,
        completedAt: new Date().toISOString(),
      });
      setSelectedIds([]);
    } catch (err) {
      console.error('Gagal batch complete:', err);
      setTasks(currentTasks);
    }
  }, [selectedIds, tasks]);

  const batchUncomplete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const currentTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) && t.completed
          ? { ...t, completed: false, completedAt: null, updatedAt: new Date().toISOString() }
          : t
      )
    );

    try {
      await taskService.batchUpdateTasks(selectedIds, {
        completed: false,
        completedAt: null,
      });
      setSelectedIds([]);
    } catch (err) {
      console.error('Gagal batch uncomplete:', err);
      setTasks(currentTasks);
    }
  }, [selectedIds, tasks]);

  const batchDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const currentTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => !selectedIds.includes(t.id)));

    try {
      await taskService.batchDeleteTasks(selectedIds);
      setSelectedIds([]);
    } catch (err) {
      console.error('Gagal batch delete:', err);
      setTasks(currentTasks);
    }
  }, [selectedIds, tasks]);

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
    loading,
    error,
    refetchTasks: fetchTasks,
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
