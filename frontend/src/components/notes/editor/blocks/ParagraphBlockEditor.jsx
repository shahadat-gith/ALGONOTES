import React from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";

const ParagraphBlockEditor = ({ block, onUpdate }) => {
  return (
    <AutoResizeTextarea
      value={block.text || ""}
      onChange={(value) => onUpdate({ text: value })}
      rows={3}
      placeholder="Write explanation..."
      className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm leading-7 text-[var(--text-muted)] transition focus:border-[var(--primary)] focus:text-[var(--text-main)]"
    />
  );
};

export default ParagraphBlockEditor;