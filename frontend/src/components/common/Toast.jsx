import { useEffect, useRef } from 'react';
import { toastIn, toastOut } from '../../utils/animations';

/**
 * Toast notification — Design System v2 colours.
 * type: 'success' | 'error' | 'info'
 */
const TYPE_CONFIG = {
  success: { bg: 'bg-success',  icon: '✓' },
  error:   { bg: 'bg-danger',   icon: '✕' },
  info:    { bg: 'bg-primary',  icon: 'ℹ' },
};

export default function Toast({ message, type = 'success', onClose }) {
  const ref = useRef(null);
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  useEffect(() => {
    if (ref.current) toastIn(ref.current);
    const timer = setTimeout(() => {
      if (ref.current) toastOut(ref.current, onClose);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="alert"
      className={[
        'fixed top-6 left-1/2 -translate-x-1/2 z-[9999]',
        'flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium',
        'min-w-[280px] max-w-[420px]',
        config.bg,
      ].join(' ')}
    >
      <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full text-xs flex-shrink-0">
        {config.icon}
      </span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => { if (ref.current) toastOut(ref.current, onClose); }}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>
    </div>
  );
}
