import React, { useEffect, useRef } from "react";

const AutoResizeTextarea = ({
  value,
  onChange,
  placeholder,
  rows = 2,
  className = "",
}) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ""}
      onChange={(e) => {
        onChange(e.target.value);
        adjustHeight();
      }}
      rows={rows}
      placeholder={placeholder}
      className={`w-full resize-none overflow-hidden outline-none ${className}`}
    />
  );
};

export default AutoResizeTextarea;