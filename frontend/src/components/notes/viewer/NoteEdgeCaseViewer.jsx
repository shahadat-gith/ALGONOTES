import React from "react";
import { AlertTriangle } from "lucide-react";

const NoteEdgeCaseViewer = ({ cases = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cases.map((c, idx) => (
        <div key={c.id || idx} className="p-4 bg-[var(--bg-soft)]/50 border border-[var(--border-default)] rounded-xl flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-[var(--warning-soft)] text-[var(--warning)] shrink-0 mt-0.5"><AlertTriangle size={14} /></div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wide">{c.case}</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{c.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteEdgeCaseViewer;