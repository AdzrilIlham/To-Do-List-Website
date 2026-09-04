import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiFlag, FiTag, FiFileText, FiRepeat, FiX, FiPlus } from 'react-icons/fi';
import { CATEGORIES, PRIORITIES } from '../../utils/filter';
import { generateId, toLocalDatetimeString } from '../../utils/helper';
import Button from '../ui/Button';

const initialForm = {
  title: '',
  description: '',
  deadline: '',
  priority: 'medium',
  category: 'lainnya',
  notes: '',
  subtasks: [],
  recurrence: '',
};

const MAX_TITLE = 100;
const MAX_DESC = 500;
const MAX_NOTES = 1000;

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        deadline: task.deadline ? toLocalDatetimeString(task.deadline) : '',
        priority: task.priority || 'medium',
        category: task.category || 'lainnya',
        notes: task.notes || '',
        subtasks: task.subtasks || [],
        recurrence: task.recurrence || '',
      });
    }
  }, [task]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = 'Judul wajib diisi';
    } else if (form.title.trim().length > MAX_TITLE) {
      newErrors.title = `Judul maksimal ${MAX_TITLE} karakter`;
    }
    if (form.description.length > MAX_DESC) {
      newErrors.description = `Deskripsi maksimal ${MAX_DESC} karakter`;
    }
    if (!form.deadline) {
      newErrors.deadline = 'Deadline wajib diisi';
    } else {
      const deadlineDate = new Date(form.deadline);
      const now = new Date();
      if (!task && deadlineDate < now) {
        newErrors.deadline = 'Tidak boleh tanggal lampau';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: new Date(form.deadline).toISOString(),
    });

    if (!task) {
      setForm(initialForm);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addSubtask = () => {
    const text = subtaskInput.trim();
    if (!text) return;
    const newSubtask = { id: generateId(), text, completed: false };
    setForm((prev) => ({ ...prev, subtasks: [...prev.subtasks, newSubtask] }));
    setSubtaskInput('');
  };

  const removeSubtask = (id) => {
    setForm((prev) => ({ ...prev, subtasks: prev.subtasks.filter((s) => s.id !== id) }));
  };

  const toggleSubtask = (id) => {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    }));
  };

  const handleSubtaskKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtask();
    }
  };

  const RECURRENCE_OPTIONS = [
    { value: '', label: 'Tidak Berulang' },
    { value: 'daily', label: 'Harian' },
    { value: 'weekly', label: 'Mingguan' },
    { value: 'monthly', label: 'Bulanan' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Judul <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Masukkan judul tugas..."
          maxLength={MAX_TITLE}
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : 'title-count'}
          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
            errors.title ? 'border-red-400' : 'border-gray-200 dark:border-dark-border'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.title ? (
            <motion.p
              id="title-error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500"
            >
              {errors.title}
            </motion.p>
          ) : (
            <span />
          )}
          <span id="title-count" className="text-[10px] text-gray-400">
            {form.title.length}/{MAX_TITLE}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="task-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Deskripsi
        </label>
        <textarea
          id="task-desc"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Masukkan deskripsi tugas..."
          rows={3}
          maxLength={MAX_DESC}
          aria-describedby={errors.description ? 'desc-error' : 'desc-count'}
          aria-invalid={!!errors.description}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <motion.p
              id="desc-error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500"
            >
              {errors.description}
            </motion.p>
          ) : (
            <span />
          )}
          <span id="desc-count" className="text-[10px] text-gray-400">
            {form.description.length}/{MAX_DESC}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          <FiCalendar size={14} className="inline mr-1" />
          Deadline <span className="text-red-500">*</span>
        </label>
        <input
          id="task-deadline"
          type="datetime-local"
          value={form.deadline}
          onChange={(e) => handleChange('deadline', e.target.value)}
          aria-required="true"
          aria-invalid={!!errors.deadline}
          aria-describedby={errors.deadline ? 'deadline-error' : undefined}
          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
            errors.deadline ? 'border-red-400' : 'border-gray-200 dark:border-dark-border'
          }`}
        />
        {errors.deadline && (
          <motion.p
            id="deadline-error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {errors.deadline}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <FiFlag size={14} className="inline mr-1" />
            Prioritas
          </label>
          <select
            id="task-priority"
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <FiTag size={14} className="inline mr-1" />
            Kategori
          </label>
          <select
            id="task-category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="task-recurrence" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          <FiRepeat size={14} className="inline mr-1" />
          Pengulangan
        </label>
        <select
          id="task-recurrence"
          value={form.recurrence}
          onChange={(e) => handleChange('recurrence', e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
        >
          {RECURRENCE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          <FiFileText size={14} className="inline mr-1" />
          Catatan
        </label>
        <textarea
          id="task-notes"
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Tambahkan catatan..."
          rows={3}
          maxLength={MAX_NOTES}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
        />
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-gray-400">{form.notes.length}/{MAX_NOTES}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Subtasks
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            onKeyDown={handleSubtaskKeyDown}
            placeholder="Tambah subtask..."
            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={addSubtask}
            className="px-3 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <FiPlus size={16} />
          </button>
        </div>
        {form.subtasks.length > 0 && (
          <ul className="mt-2 space-y-1">
            {form.subtasks.map((subtask) => (
              <li key={subtask.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(subtask.id)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                  {subtask.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <FiX size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel} type="button">
          Batal
        </Button>
        <Button type="submit" className="flex-1">
          {task ? 'Simpan Perubahan' : 'Tambah Tugas'}
        </Button>
      </div>
    </form>
  );
}
