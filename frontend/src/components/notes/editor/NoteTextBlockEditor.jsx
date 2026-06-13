import React, { useEffect, useRef } from "react";
import { Trash2, Heading, FileText, Code, Layers } from "lucide-react";

const NoteTextBlockEditor = ({
  sectionKey,
  title,
  blocks = [],
  onUpdate,
  onAdd,
  onDelete,
}) => {
  
  // Custom helper component to handle auto-resizing height smoothly
  const AutoResizingTextarea = ({ value, onChange, className, placeholder, rows }) => {
    const textareaRef = useRef(null);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [value]);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e);
          adjustHeight();
        }}
        rows={rows}
        placeholder={placeholder}
        className={`${className} resize-none overflow-hidden`}
      />
    );
  };

  return (
    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-6">
      
      {/* Section Title Header */}
      <div className="flex items-center gap-2 border-b pb-3">
        <Layers size={18} className="text-[var(--primary)]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
          {title}
        </h3>
      </div>

      {/* Unified Text Stream Canvas */}
      <div className="space-y-6">
        {blocks.map((block, idx) => (
          <div
            key={idx}
            className="flex gap-4 items-start group relative transition-all duration-200"
          >
            {/* Input fields based on block type matrix */}
            <div className="flex-1">
              {block.type === "heading" && (
                <AutoResizingTextarea
                  value={block.text || ""}
                  onChange={(e) => onUpdate(sectionKey, idx, "text", e.target.value)}
                  rows={1}
                  placeholder="Heading..."
                  className="w-full text-base font-bold text-[var(--text-main)] bg-transparent outline-none border-b border-transparent focus:border-[var(--primary)]/30 pb-1 transition-colors"
                />
              )}

              {block.type === "paragraph" && (
                <AutoResizingTextarea
                  value={block.text || ""}
                  onChange={(e) => onUpdate(sectionKey, idx, "text", e.target.value)}
                  rows={2}
                  placeholder="Type paragraph commentary text..."
                  className="w-full text-sm text-[var(--text-muted)] bg-transparent outline-none leading-relaxed focus:text-[var(--text-main)] transition-colors"
                />
              )}

              {block.type === "code" && (
                <div className="bg-[#1e1e2e] border border-neutral-800 rounded-xl overflow-hidden shadow-inner w-full">
                  <div className="px-4 py-1.5 bg-[#181825] border-b border-neutral-800 text-[10px] font-mono text-neutral-500 uppercase tracking-wider select-none">
                    Pseudocode Block
                  </div>
                  <AutoResizingTextarea
                    value={block.code || ""}
                    onChange={(e) => onUpdate(sectionKey, idx, "code", e.target.value)}
                    rows={3}
                    placeholder="// Paste or write source logic steps..."
                    className="w-full text-xs p-4 bg-transparent font-mono text-zinc-200 outline-none leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Cleaned Hover-Revealed Inline Trash Deck */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute right-2 -top-3.5 z-10">
              <button
                type="button"
                onClick={() => onDelete(sectionKey, idx)}
                className="p-1.5 text-[var(--text-light)] hover:text-[var(--danger)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--danger-soft)] rounded-lg shadow-sm transition-colors"
                title="Delete Block"
              >
                <Trash2 size={13} />
              </button>
            </div>

          </div>
        ))}

        {/* Empty Canvas Placeholder */}
        {blocks.length === 0 && (
          <p className="text-xs text-center text-[var(--text-light)] py-4 italic select-none">
            This workspace segment is empty. Append a block type below to begin editing.
          </p>
        )}
      </div>

      {/* Floating Action Insertion Bar */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-default)]/60">
        <button
          type="button"
          onClick={() => onAdd(sectionKey, "heading")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-[var(--border-default)] rounded-xl bg-white hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all active:scale-98 shadow-sm"
        >
          <Heading size={13} className="text-[var(--primary)]" /> Add Heading
        </button>
        <button
          type="button"
          onClick={() => onAdd(sectionKey, "paragraph")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-[var(--border-default)] rounded-xl bg-white hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all active:scale-98 shadow-sm"
        >
          <FileText size={13} className="text-[var(--success)]" /> Add Paragraph
        </button>
        <button
          type="button"
          onClick={() => onAdd(sectionKey, "code")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-[var(--border-default)] rounded-xl bg-white hover:bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all active:scale-98 shadow-sm"
        >
          <Code size={13} className="text-[var(--warning)]" /> Add Code Block
        </button>
      </div>

    </div>
  );
};

export default NoteTextBlockEditor;