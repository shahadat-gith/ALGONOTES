const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-bg-soft text-text-muted border-border-default",
    primary: "bg-primary-soft text-primary border-transparent",
    success: "bg-success-soft text-success border-transparent",
    warning: "bg-warning-soft text-warning border-transparent",
    danger: "bg-danger-soft text-danger border-transparent",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium tracking-wide border rounded-full transition-colors duration-150 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;