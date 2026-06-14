import React from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";

const StepBlockEditor = ({ block, index, onUpdate }) => {
  return (
    <div className="flex gap-4 pr-8">
      <div className="shrink-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary)]">
          {index + 1}
        </span>
      </div>

      <div className="flex-1">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)]">
          Step {index + 1}
        </p>

        <AutoResizeTextarea
          value={block.text || ""}
          onChange={(value) => onUpdate({ text: value })}
          rows={2}
          placeholder="Describe this algorithm step..."
          className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm leading-7 text-[var(--text-main)] transition focus:border-[var(--primary)]"
        />
      </div>
    </div>
  );
};

export default StepBlockEditor;