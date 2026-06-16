const Input = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-text-muted uppercase tracking-wider select-none"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={!!error}
        className={`w-full rounded-md border bg-bg-surface px-3.5 py-2 text-sm text-text-main transition-all placeholder:text-text-light outline-hidden focus:ring-2 focus:ring-offset-0 ${
          error 
            ? "border-danger focus:border-danger focus:ring-danger-soft" 
            : "border-border-default focus:border-primary focus:ring-primary-soft"
        } disabled:bg-bg-soft disabled:text-text-light disabled:cursor-not-allowed ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-danger font-medium tracking-wide animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;