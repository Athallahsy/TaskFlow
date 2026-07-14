/**
 * Button component.
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
const variantClasses = {
  primary: 'bg-[#4F46E5] text-white hover:bg-[#4338CA] focus-visible:ring-[#4F46E5]',
  secondary: 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] focus-visible:ring-[#4F46E5]',
  danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus-visible:ring-[#EF4444]',
  ghost: 'bg-transparent text-[#64748B] hover:bg-[#F1F5F9] focus-visible:ring-[#4F46E5]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-sm min-h-[44px]',
  lg: 'px-6 py-3 text-base min-h-[48px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
