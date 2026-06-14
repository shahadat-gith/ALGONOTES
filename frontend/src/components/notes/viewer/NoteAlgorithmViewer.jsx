import React from "react";

const NoteAlgorithmViewer = ({ steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  // 1. Sort elements sequentially by prompt index assignment
  const sortedBlocks = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));

  // 2. Filter out explicit text descriptions so we track structural counters safely
  const stepItems = sortedBlocks.filter(block => block.type === "step");
  const metaParagraphs = sortedBlocks.filter(block => block.type === "paragraph");

  return (
    <div className="space-y-4">
      {/* Handle introductory description block if present */}
      {metaParagraphs.map((p, idx) => (
        <p key={idx} className="text-sm text-[var(--text-muted)] mb-2 leading-relaxed">{p.text}</p>
      ))}

      {/* Structured Stepper List Timeline */}
      <div className="space-y-5 relative pl-4 border-l-2 border-[var(--border-default)] ml-2">
        {stepItems.map((step, idx) => (
          <div key={idx} className="relative space-y-1 group">
            {/* Timeline Circle Bullet node */}
            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--border-strong)] group-hover:bg-[var(--primary)] transition-colors border-2 border-white" />
            
            <div className="flex flex-col space-y-1">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-soft)] px-1.5 py-0.5 rounded">
                  Step {idx + 1}
                </span>
              </div>
              <p className="text-sm text-[var(--text-main)] font-medium leading-relaxed pl-0.5">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteAlgorithmViewer;