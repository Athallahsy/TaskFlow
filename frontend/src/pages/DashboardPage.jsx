import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/ToastContainer';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import SummaryChart from '../components/dashboard/SummaryChart';
import Button from '../components/common/Button';
import api from '../api/axios';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();

  const [summary, setSummary] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary').then((res) => setSummary(res.data)).catch(() => {});
  }, [projects]);

  const handleCreateOrUpdate = async (data) => {
    setFormLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        showToast('Project berhasil diperbarui.');
      } else {
        await createProject(data);
        showToast('Project berhasil dibuat.');
      }
      setModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan project.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProject(deleteConfirm.id);
      showToast('Project berhasil dihapus.');
      setDeleteConfirm(null);
    } catch {
      showToast('Gagal menghapus project.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-bold text-text-main text-lg">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary hidden sm:block">Halo, <strong className="text-text-main">{user?.name}</strong></span>
            <Button variant="ghost" size="sm" onClick={logout}>Keluar</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-3 py-4">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <div className="bg-surface rounded-lg border border-border p-3 shadow-card">
            <p className="text-sm text-text-secondary">Total Project</p>
            <p className="text-3xl font-bold text-text-main mt-1">{summary?.totalProjects ?? '—'}</p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-3 shadow-card">
            <p className="text-sm text-text-secondary">Task Selesai</p>
            <p className="text-3xl font-bold text-success mt-1">{summary?.taskStats?.done ?? '—'}</p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-3 shadow-card">
            <p className="text-sm text-text-secondary">Sedang Dikerjakan</p>
            <p className="text-3xl font-bold text-warning mt-1">{summary?.taskStats?.in_progress ?? '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Chart */}
          <div className="bg-surface rounded-lg border border-border p-3 shadow-card">
            <h2 className="font-semibold text-text-main mb-2">Progres Task</h2>
            <SummaryChart taskStats={summary?.taskStats} />
          </div>

          {/* Project List */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-text-main text-lg">Project Kamu</h2>
              <Button size="sm" onClick={() => { setEditingProject(null); setModalOpen(true); }}>
                + Buat Project Baru
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-6 bg-surface rounded-lg border border-dashed border-border shadow-card">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-text-secondary text-sm">Belum ada project. Yuk buat yang pertama!</p>
                <Button className="mt-2" size="sm" onClick={() => { setEditingProject(null); setModalOpen(true); }}>
                  + Buat Project Baru
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={setDeleteConfirm}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingProject}
        loading={formLoading}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <h3 className="font-bold text-[#0F172A] text-lg mb-2">Hapus Project?</h3>
            <p className="text-sm text-[#64748B] mb-6">
              Hapus project ini? Semua task di dalamnya juga akan terhapus.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Batal</Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>Hapus Project</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
