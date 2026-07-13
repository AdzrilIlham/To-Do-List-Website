import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import EmptyState from '../ui/EmptyState';
import { FiInbox } from 'react-icons/fi';

const TaskList = memo(function TaskList({ tasks, onEdit, selectedIds, onSelect }) {
  if (tasks.length === 0) {
    return <EmptyState icon={FiInbox} description="Belum ada tugas. Tambahkan tugas pertamamu." />;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onEdit={onEdit}
            selected={selectedIds?.includes(task.id)}
            onSelect={onSelect}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default TaskList;
