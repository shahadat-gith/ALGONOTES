import React from "react";
import { Terminal } from "lucide-react";

const DevSkills = ({ skills }) => (
  <div className="bg-white border border-[var(--border-default)]/60 rounded-2xl p-5 shadow-sm space-y-4">
    <h3 className="text-xs font-black text-[var(--text-main)] border-b border-[var(--border-default)]/40 pb-2 flex items-center gap-1.5">
      <Terminal size={14} className="text-[var(--primary)]" /> Engine Core & Framework Pillars
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(skills).map(([category, list]) => (
        <div key={category} className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-soft)]/30 border border-[var(--border-default)]/30">
          <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wide block border-b border-[var(--border-default)]/20 pb-1 mb-1">
            {category}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {list.map((skill) => (
              <span 
                key={skill}
                className="text-[11px] font-semibold px-2.5 py-1 bg-white text-[var(--text-muted)] border border-[var(--border-default)]/40 rounded-lg shadow-sm hover:border-[var(--primary)]/30 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DevSkills;