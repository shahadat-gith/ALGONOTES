import React from "react";

const NoteBlockViewer = ({ blocks = [] }) => {
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4">
      {sortedBlocks.map((block, index) => {
        const key = block.id || index;
        switch (block.type) {
          case "heading":
            return <h3 key={key} className="text-lg font-bold text-[var(--text-main)] pt-2 tracking-tight">{block.text}</h3>;
          case "paragraph":
            return <p key={key} className="text-sm text-[var(--text-muted)] leading-relaxed">{block.text}</p>;
          case "code":
            return (
              <div key={key} className="bg-[#1e1e2e] border border-neutral-800 rounded-xl overflow-hidden my-3">
                <pre className="p-4 overflow-x-auto font-mono text-xs text-neutral-200 leading-relaxed tab-size-4"><code>{block.code}</code></pre>
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