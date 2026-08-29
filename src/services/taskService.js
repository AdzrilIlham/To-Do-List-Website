import { supabase } from '../lib/supabase';

export const mapTaskFromSupabase = (row) => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  description: row.description || '',
  deadline: row.deadline,
  priority: row.priority || 'medium',
  category: row.category || 'lainnya',
  completed: Boolean(row.completed),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  completedAt: row.completed_at || null,
  subtasks: row.subtasks || [],
  recurrence: row.recurrence || null,
  notes: row.notes || '',
});

export const mapTaskToSupabase = (task) => {
  const payload = {
    title: task.title,
    description: task.description || '',
    deadline: task.deadline,
    priority: task.priority || 'medium',
    category: task.category || 'lainnya',
    completed: Boolean(task.completed),
    completed_at: task.completedAt || null,
    subtasks: task.subtasks || [],
    recurrence: task.recurrence || null,
    notes: task.notes || '',
    updated_at: new Date().toISOString(),
  };

  if (task.id) payload.id = task.id;
  if (task.userId) payload.user_id = task.userId;
  if (task.createdAt) payload.created_at = task.createdAt;

  return payload;
};

export const taskService = {
  async fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTaskFromSupabase);
  },

  async createTask(taskData, userId) {
    const payload = mapTaskToSupabase(taskData);
    if (userId) payload.user_id = userId;
    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return mapTaskFromSupabase(data);
  },

  async updateTask(id, updates) {
    const currentPayload = mapTaskToSupabase(updates);
    delete currentPayload.id;

    const { data, error } = await supabase
      .from('tasks')
      .update(currentPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapTaskFromSupabase(data);
  },

  async deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async batchUpdateTasks(ids, updates) {
    const payload = mapTaskToSupabase(updates);
    delete payload.id;

    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .in('id', ids)
      .select();

    if (error) throw error;
    return (data || []).map(mapTaskFromSupabase);
  },

  async batchDeleteTasks(ids) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return true;
  },
};
