const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-[var(--bg-soft)] text-[var(--text-muted)]",
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border border-transparent ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;