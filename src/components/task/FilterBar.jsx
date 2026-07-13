import { useState, useEffect, useRef } from 'react';
import { PRIORITIES, CATEGORIES, SORT_OPTIONS } from '../../utils/filter';
import { FiFilter, FiArrowUp } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';

export default function FilterBar() {
  const { filters, setFilters, sortBy, setSortBy, selectedIds, batchComplete, batchDelete, batchUncomplete, clearSelection } = useTaskContext();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value }));
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const hasSelection = selectedIds && selectedIds.length > 0;

  return (
    <div className="space-y-3">
      {hasSelection && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
          <span className="text-xs font-medium text-primary">{selectedIds.length} dipilih</span>
          <div className="flex gap-1.5 ml-auto">
            <button
              onClick={batchComplete}
              className="px-2.5 py-1 text-[10px] sm:text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
            >
              Selesai
            </button>
            <button
              onClick={batchUncomplete}
              className="px-2.5 py-1 text-[10px] sm:text-xs font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer"
            >
              Belum Selesai
            </button>
            <button
              onClick={batchDelete}
              className="px-2.5 py-1 text-[10px] sm:text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              Hapus
            </button>
            <button
              onClick={clearSelection}
              className="px-2.5 py-1 text-[10px] sm:text-xs font-medium bg-gray-200 dark:bg-dark-surface text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-border transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 text-gray-400">
          <FiFilter size={14} />
          <span className="text-xs font-medium hidden sm:inline">Filter:</span>
        </div>

        <input
          type="text"
          placeholder="Cari tugas..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-auto sm:max-w-[160px]"
          aria-label="Cari tugas"
        />

        <select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          aria-label="Filter prioritas"
        >
          <option value="">Semua Prioritas</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          aria-label="Filter kategori"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          aria-label="Filter status"
        >
          <option value="">Semua Status</option>
          <option value="pending">Belum Selesai</option>
          <option value="completed">Selesai</option>
        </select>

        <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-dark-border" />

        <div className="flex items-center gap-1.5 text-gray-400">
          <FiArrowUp size={14} />
          <span className="text-xs font-medium hidden sm:inline">Urutkan:</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          aria-label="Urutkan"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
