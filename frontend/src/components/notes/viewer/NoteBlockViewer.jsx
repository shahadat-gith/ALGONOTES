import React from "react";

const NoteBlockViewer = ({ blocks = [] }) => {
  if (!blocks || blocks.length === 0) return null;

  // Sort blocks by their structural order safely
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4">
      {sortedBlocks.map((block, idx) => {
        switch (block.type) {
          case "heading":
            // Skip rendering headings inside sections if you already have static <h2> headers in ViewNotes.jsx
            // However, we render it if it's uniquely named or customized by the AI.
            return (
              <h3 key={idx} className="text-sm font-bold text-[var(--text-main)] mt-4 mb-2 tracking-wide uppercase">
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={idx} className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                {block.text}
              </p>
            );

          case "bullet":
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-muted)]">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            );

          case "code":
            return (
              <div key={idx} className="relative rounded-xl border border-[var(--border-default)] overflow-hidden font-mono text-xs shadow-sm">
                <div className="bg-[var(--bg-soft)] px-4 py-1.5 text-[var(--text-light)] text-[10px] font-bold tracking-wider uppercase flex justify-between items-center border-b border-[var(--border-default)]">
                  <span>{block.language || "code"}</span>
                </div>
                <pre className="p-4 bg-[var(--bg-base)] text-[var(--text-main)] overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default NoteBlockViewer;