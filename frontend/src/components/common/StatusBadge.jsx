const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    icon: '○',
    classes: 'bg-[#F1F5F9] text-[#64748B]',
  },
  in_progress: {
    label: 'In Progress',
    icon: '◑',
    classes: 'bg-[#FFFBEB] text-[#92400E]',
  },
  done: {
    label: 'Selesai',
    icon: '●',
    classes: 'bg-[#F0FDF4] text-[#166534]',
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
