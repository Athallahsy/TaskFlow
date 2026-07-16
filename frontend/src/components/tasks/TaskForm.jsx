import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Selesai' },
];

// Shared input/select class string using Design System v2 tokens
const inputBase = [
  'w-full px-3.5 py-2.5 rounded-lg border text-text-main text-sm transition',
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
  'placeholder:text-neutral bg-surface',
].join(' ');

export default function TaskForm({ isOpen, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', deadline: '' });
  const [errors, setErrors] = useState({});

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'todo',
        deadline: initialData?.deadline || '',
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Judul task wajib diisi.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      deadline: form.deadline || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Tambah Task Baru'}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-text-main mb-1.5">
              Judul Task <span className="text-danger">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Apa yang perlu dikerjakan?"
              className={[inputBase, errors.title ? 'border-danger bg-danger-bg' : 'border-border'].join(' ')}
            />
            {errors.title && <p className="mt-1 text-xs text-danger">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-sm font-medium text-text-main mb-1.5">
              Deskripsi <span className="text-neutral font-normal">(opsional)</span>
            </label>
            <textarea
              id="task-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tambahkan detail task..."
              rows={3}
              className={[inputBase, 'border-border resize-none'].join(' ')}
            />
          </div>

          {/* Status + Deadline row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-text-main mb-1.5">Status</label>
              <select
                id="task-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={[inputBase, 'border-border'].join(' ')}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-deadline" className="block text-sm font-medium text-text-main mb-1.5">
                Deadline <span className="text-neutral font-normal">(opsional)</span>
              </label>
              <input
                id="task-deadline"
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className={[inputBase, 'border-border'].join(' ')}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="secondary" onClick={onClose} type="button">Batal</Button>
          <Button type="submit" loading={loading}>
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Task' : 'Tambah Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
