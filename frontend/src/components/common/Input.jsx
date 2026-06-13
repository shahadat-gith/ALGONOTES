const Input = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-[var(--text-main)]">
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={!!error}
        className={`w-full rounded-[var(--radius-md)] border bg-white px-4 py-3 text-sm text-[var(--text-main)] transition outline-none focus:border-[var(--primary)] ${
          error ? "border-[var(--danger)] focus:border-[var(--danger)]" : "border-[var(--border-default)]"
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-[var(--danger)] font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;