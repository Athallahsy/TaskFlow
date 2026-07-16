/**
 * StatusBadge — semantic status indicator using Design System v2 colours.
 * status: 'todo' | 'in_progress' | 'done'
 */
const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    icon: '○',
    classes: 'bg-neutral-bg text-text-secondary',
  },
  in_progress: {
    label: 'In Progress',
    icon: '◑',
    classes: 'bg-warning-bg text-warning',
  },
  done: {
    label: 'Selesai',
    icon: '●',
    classes: 'bg-success-bg text-success',
  },
};

export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.classes,
        className,
      ].join(' ')}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
