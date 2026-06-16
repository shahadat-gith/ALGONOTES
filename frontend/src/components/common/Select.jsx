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
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-xs font-semibold text-text-muted uppercase tracking-wider select-none"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <select
          id={selectId}
          aria-invalid={!!error}
          className={`w-full rounded-md border bg-bg-surface pl-3.5 pr-10 py-2 text-sm text-text-main transition-all appearance-none outline-hidden focus:ring-2 focus:ring-offset-0 ${
            error 
              ? "border-danger focus:border-danger focus:ring-danger-soft" 
              : "border-border-default focus:border-primary focus:ring-primary-soft"
          } disabled:bg-bg-soft disabled:text-text-light disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          <option value="" className="text-text-light">Select an option</option>

          {options.map((option) => {
            const isObject = typeof option === "object" && option !== null;
            const val = isObject ? option.value : option;
            const labelText = isObject ? option.label : option;
            
            return (
              <option key={val} value={val} className="text-text-main bg-bg-surface">
                {labelText}
              </option>
            );
          })}
        </select>
        
        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-light">
          <svg className="h-4 w-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-xs text-danger font-medium tracking-wide animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;