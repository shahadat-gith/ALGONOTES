const Select = ({
  label,
  options = [],
  error,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-[var(--text-main)]">
          {label}
        </label>
      )}

      <select
        id={selectId}
        aria-invalid={!!error}
        className={`w-full rounded-[var(--radius-md)] border bg-white px-4 py-3 text-sm text-[var(--text-main)] transition outline-none appearance-none focus:border-[var(--primary)] ${
          error ? "border-[var(--danger)] focus:border-[var(--danger)]" : "border-[var(--border-default)]"
        } ${className}`}
        {...props}
      >
        <option value="">Select an option</option>

        {options.map((option) => {
          const isObject = typeof option === "object" && option !== null;
          const val = isObject ? option.value : option;
          const labelText = isObject ? option.label : option;
          
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>

      {error && (
        <p className="mt-1 text-sm text-[var(--danger)] font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;