import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

// Shared input class string using Design System v2 tokens
const inputBase = [
  'w-full px-3.5 py-2.5 rounded-lg border text-text-main text-sm transition',
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
  'placeholder:text-neutral',
].join(' ');

export default function ProjectForm({ isOpen, onClose, onSubmit, initialData, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nama project wajib diisi.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ name: name.trim(), description: description.trim() || null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Project' : 'Buat Project Baru'}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-text-main mb-1.5">
              Nama Project <span className="text-danger">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              placeholder="Contoh: Website Portofolio"
              className={[inputBase, errors.name ? 'border-danger bg-danger-bg' : 'border-border bg-surface'].join(' ')}
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="project-desc" className="block text-sm font-medium text-text-main mb-1.5">
              Deskripsi <span className="text-neutral font-normal">(opsional)</span>
            </label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Apa yang ingin kamu capai di project ini?"
              rows={3}
              className={[inputBase, 'border-border bg-surface resize-none'].join(' ')}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="secondary" onClick={onClose} type="button">
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Project' : 'Buat Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
