import React from "react";

const NoteAlgorithmViewer = ({ steps = [] }) => {
  const sortedSteps = [...steps].sort((a, b) => a.stepNo - b.stepNo);

  return (
    <div className="space-y-4 relative pl-4 border-l-2 border-[var(--border-default)] ml-2">
      {sortedSteps.map((step, idx) => (
        <div key={step._id || idx} className="relative space-y-1 group">
          <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--border-strong)] group-hover:bg-[var(--primary)] transition-colors border-2 border-white" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary-soft)] px-1.5 py-0.5 rounded">Step {step.stepNo}</span>
            <h4 className="text-sm font-bold text-[var(--text-main)]">{step.title}</h4>
          </div>
          <p className="text-xs text-[var(--text-muted)] pl-0.5 leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default NoteAlgorithmViewer;