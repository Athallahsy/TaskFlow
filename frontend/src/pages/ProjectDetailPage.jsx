import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/common/ToastContainer';
import { useTasks } from '../hooks/useTasks';
import KanbanColumn from '../components/tasks/KanbanColumn';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/common/Button';
import api from '../api/axios';

const STATUSES = ['todo', 'in_progress', 'done'];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks(id);

  const [project, setProject] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => navigate('/dashboard'));
  }, [id, navigate]);

  const filteredTasks = (status) => {
    const byStatus = tasks.filter((t) => t.status === status);
    if (filterStatus === 'all' || filterStatus === status) return byStatus;
    return [];
  };

  const handleCreateOrUpdate = async (data) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        showToast('Task berhasil disimpan.');
      } else {
        await createTask(data);
        showToast('Task berhasil ditambahkan.');
      }
      setTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan task.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      showToast('Gagal mengubah status task.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTask(deleteConfirm.id);
      showToast('Task berhasil dihapus.');
      setDeleteConfirm(null);
    } catch {
      showToast('Gagal menghapus task.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 h-16 flex items-center gap-2">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg text-text-secondary hover:bg-neutral-bg hover:text-text-main transition-colors"
            aria-label="Kembali ke dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-text-main text-lg truncate">
              {project?.name || 'Memuat...'}
            </h1>
            {project?.description && (
              <p className="text-xs text-text-secondary truncate">{project.description}</p>
            )}
          </div>
          <Button size="sm" onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}>
            + Tambah Task
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-3 py-3">
        {/* Filter chips */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {[{ value: 'all', label: 'Semua' }, { value: 'todo', label: 'To Do' }, { value: 'in_progress', label: 'In Progress' }, { value: 'done', label: 'Selesai' }].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                filterStatus === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary border border-border hover:border-primary hover:text-primary',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto pb-3">
            <div className="grid grid-cols-3 gap-3 min-w-[900px] md:min-w-0">
              {STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={filteredTasks(status)}
                  onEdit={(task) => { setEditingTask(task); setTaskModalOpen(true); }}
                  onDelete={setDeleteConfirm}
                  onStatusChange={handleStatusChange}
                  onAddTask={() => { setEditingTask(null); setTaskModalOpen(true); }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask}
        loading={formLoading}
      />

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <h3 className="font-bold text-[#0F172A] text-lg mb-2">Hapus Task?</h3>
            <p className="text-sm text-[#64748B] mb-6">Task <strong>{deleteConfirm.title}</strong> akan dihapus secara permanen.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Batal</Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>Hapus Task</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
