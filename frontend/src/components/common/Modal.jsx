import { useEffect, useRef, useCallback } from 'react';
import { openModal, closeModal } from '../../utils/animations';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closingRef = useRef(false);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    closeModal(overlayRef.current, panelRef.current, () => {
      closingRef.current = false;
      onClose();
    });
  }, [onClose]);

  useEffect(() => {
    if (isOpen && overlayRef.current && panelRef.current) {
      openModal(overlayRef.current, panelRef.current);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={panelRef}
        className={[
          'bg-surface rounded-xl shadow-modal w-full',
          'flex flex-col max-h-[90vh]',
          sizeClasses[size],
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="modal-title" className="text-lg font-bold text-text-main font-display">{title}</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-neutral-bg hover:text-text-main transition-colors"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
