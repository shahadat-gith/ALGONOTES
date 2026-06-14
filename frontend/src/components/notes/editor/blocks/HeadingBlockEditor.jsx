import React from "react";

const HeadingBlockEditor = ({ block, onUpdate }) => {
  return (
    <input
      value={block.text || ""}
      onChange={(e) => onUpdate({ text: e.target.value })}
      placeholder="Heading..."
      className="w-full border-b border-transparent bg-transparent pb-1 text-base font-bold text-[var(--text-main)] outline-none transition focus:border-[var(--primary)]/40"
    />
  );
};

export default HeadingBlockEditor;