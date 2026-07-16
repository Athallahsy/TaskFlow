import { useRef, useEffect } from 'react';
import StatusBadge from '../common/StatusBadge';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const cardRef = useRef(null);

  const formatDeadline = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isOverdue = task.deadline && task.status !== 'done' && new Date(task.deadline) < new Date();

  const statusOrder = ['todo', 'in_progress', 'done'];
  const currentIdx = statusOrder.indexOf(task.status);
  const nextStatus = currentIdx < statusOrder.length - 1 ? statusOrder[currentIdx + 1] : null;
  const prevStatus = currentIdx > 0 ? statusOrder[currentIdx - 1] : null;

  const statusBorderClasses = {
    todo: 'border-l-neutral',
    in_progress: 'border-l-warning',
    done: 'border-l-success',
  };

  return (
    <div
      ref={cardRef}
      className={[
        'bg-surface rounded-xl border border-border border-l-[3px] p-2 shadow-card hover:scale-[1.02] hover:shadow-card-hover transition-all duration-150 origin-center group',
        statusBorderClasses[task.status] || 'border-l-neutral',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-start gap-1 justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-main line-clamp-2">{task.title}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-neutral-bg hover:text-text-main transition-colors"
            aria-label={`Edit task: ${task.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-danger-bg hover:text-danger transition-colors"
            aria-label={`Hapus task: ${task.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-text-secondary mt-1.5 line-clamp-2">{task.description}</p>
      )}

      {/* Deadline */}
      {task.deadline && (
        <div className={`mt-1.5 flex items-center gap-1 text-xs ${isOverdue ? 'text-danger' : 'text-text-secondary'}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isOverdue ? 'Terlambat · ' : ''}{formatDeadline(task.deadline)}
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
        <StatusBadge status={task.status} />
        <div className="flex gap-1">
          {prevStatus && (
            <button
              onClick={() => onStatusChange(task.id, prevStatus)}
              className="text-[10px] px-2 py-1 rounded-md bg-neutral-bg text-text-secondary hover:bg-border transition-colors"
              aria-label="Kembalikan ke status sebelumnya"
            >
              ← Mundur
            </button>
          )}
          {nextStatus && (
            <button
              onClick={() => onStatusChange(task.id, nextStatus)}
              className="text-[10px] px-2 py-1 rounded-md bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Pindah ke status berikutnya"
            >
              Maju →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
