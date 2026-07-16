import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-xs text-text-secondary py-1 overflow-x-auto whitespace-nowrap flex-shrink-0" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-text-secondary select-none text-[10px]" aria-hidden="true">
                ›
              </span>
            )}
            
            {isLast || !item.href ? (
              <span className="font-medium text-text-main truncate max-w-[160px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-primary transition-colors truncate max-w-[160px]"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
