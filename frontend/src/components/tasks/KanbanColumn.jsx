import { useRef, useEffect } from 'react';
import { staggerCards } from '../../utils/animations';
import TaskCard from './TaskCard';
import Button from '../common/Button';

const COLUMN_CONFIG = {
  todo: {
    label: 'To Do',
    textColor: 'text-text-main',
    dotColor: 'bg-neutral', // slate-400
  },
  in_progress: {
    label: 'In Progress',
    textColor: 'text-text-main',
    dotColor: 'bg-warning', // amber-500
  },
  done: {
    label: 'Selesai',
    textColor: 'text-text-main',
    dotColor: 'bg-success', // green-500
  },
};

export default function KanbanColumn({ status, tasks, onEdit, onDelete, onStatusChange, onAddTask }) {
  const listRef = useRef(null);
  const config = COLUMN_CONFIG[status];

  useEffect(() => {
    if (listRef.current) {
      const cards = listRef.current.querySelectorAll('[data-task-card]');
      staggerCards(Array.from(cards));
    }
  }, [tasks.length]);

  return (
    <div className="flex flex-col w-full">
      {/* Column Header */}
      <div className="flex items-center gap-1 py-1.5 mb-2 border-b border-border">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dotColor}`} />
        <span className={`font-semibold text-sm ${config.textColor}`}>{config.label}</span>
        <span className="ml-auto text-xs bg-neutral-bg border border-border px-2 py-0.5 rounded-full font-medium text-text-secondary">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div ref={listRef} className="flex flex-col gap-3 flex-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-[#94A3B8]">Belum ada task di sini.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} data-task-card>
              <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            </div>
          ))
        )}
      </div>

      {/* Add task button */}
      {status === 'todo' && (
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTask}
            className="w-full justify-start text-[#64748B] border border-dashed border-[#E2E8F0] hover:border-[#4F46E5] hover:text-[#4F46E5]"
          >
            + Tambah Task
          </Button>
        </div>
      )}
    </div>
  );
}
