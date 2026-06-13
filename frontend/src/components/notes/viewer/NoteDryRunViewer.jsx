import React from "react";

const NoteDryRunViewer = ({ steps = [] }) => {
  const sortedSteps = [...steps].sort((a, b) => a.stepNo - b.stepNo);

  return (
    <div className="w-full border border-[var(--border-default)] rounded-xl overflow-hidden bg-[var(--bg-surface)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-[var(--bg-soft)] border-b border-[var(--border-default)] text-[var(--text-muted)] font-bold uppercase tracking-wider">
              <th className="p-3.5 w-16 text-center">Step</th>
              <th className="p-3.5 min-w-[120px]">Input State</th>
              <th className="p-3.5 min-w-[140px]">Action Execution</th>
              <th className="p-3.5 min-w-[120px]">Output State</th>
              <th className="p-3.5 min-w-[200px]">Explanation Logic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-main)]">
            {sortedSteps.map((step, idx) => (
              <tr key={step.id || idx} className="hover:bg-[var(--bg-soft)]/40 transition-colors">
                <td className="p-3.5 text-center font-bold font-mono text-[var(--text-light)]">{step.stepNo}</td>
                <td className="p-3.5 font-mono text-[var(--primary)] bg-[var(--primary-soft)]/10 font-medium">{step.inputState || "—"}</td>
                <td className="p-3.5 font-medium">{step.action || "—"}</td>
                <td className="p-3.5 font-mono text-[var(--success)] bg-[var(--success-soft)]/20 font-medium">{step.outputState || "—"}</td>
                <td className="p-3.5 text-[var(--text-muted)] leading-relaxed">{step.explanation || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoteDryRunViewer;