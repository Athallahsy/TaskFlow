import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="bg-surface rounded-xl border border-border border-l-[3px] border-l-primary p-3 shadow-card hover:scale-[1.02] hover:shadow-card-hover transition-all duration-150 origin-center group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link
            to={`/projects/${project.id}`}
            className="block font-semibold text-text-main hover:text-primary transition-colors truncate text-base font-display"
          >
            {project.name}
          </Link>
          {project.description && (
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-neutral-bg hover:text-text-main transition-colors"
            aria-label={`Edit project ${project.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-danger-bg hover:text-danger transition-colors"
            aria-label={`Hapus project ${project.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-border">
        <Link
          to={`/projects/${project.id}`}
          className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
        >
          Lihat Tasks →
        </Link>
      </div>
    </div>
  );
}
