import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

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
            <label htmlFor="project-name" className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Nama Project <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              placeholder="Contoh: Website Portofolio"
              className={[
                'w-full px-3.5 py-2.5 rounded-lg border text-[#0F172A] text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition',
                'placeholder:text-[#94A3B8]',
                errors.name ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-white',
              ].join(' ')}
            />
            {errors.name && <p className="mt-1 text-xs text-[#EF4444]">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="project-desc" className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Deskripsi <span className="text-[#94A3B8] font-normal">(opsional)</span>
            </label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Apa yang ingin kamu capai di project ini?"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-[#94A3B8] resize-none"
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
