import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Selesai' },
];

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
            <label htmlFor="task-title" className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Judul Task <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Apa yang perlu dikerjakan?"
              className={[
                'w-full px-3.5 py-2.5 rounded-lg border text-[#0F172A] text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition',
                'placeholder:text-[#94A3B8]',
                errors.title ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-white',
              ].join(' ')}
            />
            {errors.title && <p className="mt-1 text-xs text-[#EF4444]">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Deskripsi <span className="text-[#94A3B8] font-normal">(opsional)</span>
            </label>
            <textarea
              id="task-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tambahkan detail task..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-[#94A3B8] resize-none"
            />
          </div>

          {/* Status + Deadline row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-[#0F172A] mb-1.5">Status</label>
              <select
                id="task-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-deadline" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Deadline <span className="text-[#94A3B8] font-normal">(opsional)</span>
              </label>
              <input
                id="task-deadline"
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
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
