import React from "react";
import { GraduationCap } from "lucide-react";

const DevEducation = ({ education }) => (
  <div className="bg-white border border-[var(--border-default)]/60 rounded-2xl p-5 shadow-sm space-y-4">
    <h3 className="text-xs font-black text-[var(--text-main)] border-b border-[var(--border-default)]/40 pb-2 flex items-center gap-1.5">
      <GraduationCap size={15} className="text-indigo-500" /> Academic Formation Chronology
    </h3>
    
    <div className="relative border-l border-[var(--border-default)] ml-2 pl-4 space-y-6">
      {education.map((edu, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-white border-2 border-[var(--border-default)] rounded-full group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] transition-all" />
          
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
              <h4 className="text-xs font-bold text-[var(--text-main)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                {edu.institution}
              </h4>
              <span className="text-[10px] font-bold font-mono text-[var(--text-light)] shrink-0">
                {edu.timeline}
              </span>
            </div>
            <p className="text-[11px] font-medium text-[var(--text-muted)]">{edu.degree}</p>
            <span className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[var(--primary-soft)]/20 border border-[var(--primary-soft)]/40 rounded text-[var(--primary)]">
              {edu.metric}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DevEducation;