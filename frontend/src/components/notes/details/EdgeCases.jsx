import React from "react";
import { ShieldAlert } from "lucide-react";

const EdgeCases = ({ edgeCases = [] }) => {
  if (!edgeCases || !edgeCases.length) return null;

  return (
    <section className="bg-bg-surface border border-border-default rounded-md p-6 shadow-card select-none animate-fade-in">
      
      {/* Section Header */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <ShieldAlert size={14} className="text-amber-500 stroke-[2]" />
        <span>Important Edge Cases</span>
      </h2>
      
      {/* List Stack */}
      <ul className="mt-4 space-y-3">
        {edgeCases.map((caseItem, index) => (
          <li 
            key={index} 
            className="text-[14px] md:text-[16px] leading-7 text-text-muted font-normal tracking-wide flex items-start gap-3 bg-amber-500/[0.02] border border-amber-500/10 rounded-xs p-3.5"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/60" />
            <span className="text-text-main font-sans font-medium">{caseItem}</span>
          </li>
        ))}
      </ul>

    </section>
  );
};

export default EdgeCases;