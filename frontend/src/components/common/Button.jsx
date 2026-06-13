import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold border transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-soft)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-[var(--bg-soft)] disabled:border-[var(--border-default)] disabled:text-[var(--text-light)] active:scale-[0.98] rounded-[var(--radius-md)]";

  const variants = {
    primary:
      "bg-[var(--primary)] border-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:border-[var(--primary-hover)]",
    secondary:
      "bg-[var(--bg-soft)] border-[var(--bg-soft)] text-[var(--text-main)] hover:bg-[var(--border-default)] hover:border-[var(--border-default)]",
    danger:
      "bg-[var(--danger)] border-[var(--danger)] text-white hover:bg-opacity-95 hover:border-opacity-95",
    outline:
      "bg-white border-[var(--border-default)] text-[var(--text-main)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)]",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4.5 py-2.5 text-sm", 
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin shrink-0" />}
      <span className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;