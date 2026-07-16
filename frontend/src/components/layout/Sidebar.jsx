import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../common/ToastContainer';
import ProjectForm from '../projects/ProjectForm';
import Button from '../common/Button';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { projects, createProject, fetchProjects } = useProjects();
  const { showToast } = useToast();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateProject = async (data) => {
    setFormLoading(true);
    try {
      await createProject(data);
      showToast('Project berhasil dibuat.');
      setIsModalOpen(false);
      // Refetch projects to sync lists if needed
      fetchProjects();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal membuat project.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Generate a deterministic soft warm color dot based on project ID/name
  const getProjectDotColor = (id) => {
    const colors = ['bg-[#0F6E56]', 'bg-[#D97706]', 'bg-[#107B57]', 'bg-[#D94646]', 'bg-[#87928E]'];
    return colors[id % colors.length];
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex flex-col w-[220px] bg-sidebar-bg border-r border-border transition-transform duration-200 ease-in-out md:translate-x-0 md:static',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header / Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <Link to="/dashboard" onClick={onClose}>
            <span className="font-brand text-3xl text-text-main font-normal">TaskFlow</span>
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:bg-neutral-bg hover:text-text-main md:hidden transition-colors"
            aria-label="Tutup sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-3">
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) => [
                'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'text-text-secondary hover:bg-neutral-bg hover:text-text-main',
              ].join(' ')}
            >
              📊 Dashboard
            </NavLink>
          </div>

          {/* Projects Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2.5 py-1">
              <span className="text-[11px] font-bold tracking-wider text-text-secondary uppercase">
                Projects
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-neutral-bg text-text-secondary hover:text-text-main transition-colors text-xs font-bold"
                title="Buat Project Baru"
              >
                ＋
              </button>
            </div>

            <div className="space-y-0.5 max-h-[250px] overflow-y-auto">
              {projects.length === 0 ? (
                <div className="px-2.5 py-1.5 text-xs text-text-secondary italic">
                  Belum ada project
                </div>
              ) : (
                projects.map((project) => {
                  const isActive = location.pathname === `/projects/${project.id}`;
                  return (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      onClick={onClose}
                      className={[
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors truncate',
                        isActive
                          ? 'bg-primary-light text-primary font-semibold'
                          : 'text-text-secondary hover:bg-neutral-bg hover:text-text-main',
                      ].join(' ')}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getProjectDotColor(project.id)}`} />
                      <span className="truncate">{project.name}</span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </nav>

        {/* Footer / Profile Info */}
        <div className="p-2 border-t border-border bg-sidebar-bg flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm font-display uppercase">
              {user?.name ? user.name.substring(0, 2) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text-main truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-text-secondary truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-xs hover:bg-danger-bg hover:text-danger py-1.5"
          >
            🚪 Keluar
          </Button>
        </div>
      </aside>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={formLoading}
      />
    </>
  );
}
