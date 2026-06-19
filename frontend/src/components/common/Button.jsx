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
    "inline-flex items-center justify-center gap-2 font-medium border transition-all duration-200 select-none outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-bg-soft disabled:border-border-default disabled:text-text-light active:scale-[0.98] rounded-md";

  const variants = {
    primary:
      "bg-primary border-primary text-white hover:bg-primary-hover hover:border-primary-hover shadow-[0_0_18px_rgba(138,121,255,0.35)]",
    secondary:
      "bg-bg-soft border-bg-soft text-text-main hover:bg-border-default hover:border-border-default",
    danger:
      "bg-danger border-danger text-white hover:bg-opacity-90 hover:border-opacity-90 shadow-xs",
    outline:
      "bg-bg-surface/90 border-border-default text-text-main hover:bg-bg-soft hover:border-primary/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm", 
    lg: "px-5 py-2.5 text-base",
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