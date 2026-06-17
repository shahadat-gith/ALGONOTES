import React from "react";
import { AlertCircle } from "lucide-react";

const Mistakes = ({ mistakesToAvoid = [] }) => {
  if (!mistakesToAvoid || !mistakesToAvoid.length) return null;

  return (
    <section className="bg-bg-surface border border-border-default rounded-md p-6 shadow-card select-none animate-fade-in">
      
      {/* Section Header */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <AlertCircle size={14} className="text-red-500 stroke-[2]" />
        <span>Mistakes To Avoid</span>
      </h2>
      
      {/* List Stack */}
      <ul className="mt-4 space-y-3">
        {mistakesToAvoid.map((mistakeItem, index) => (
          <li 
            key={index} 
            className="text-[14px] md:text-[16px] leading-7 text-text-muted font-normal tracking-wide flex items-start gap-3 bg-red-500/[0.02] border border-red-500/10 rounded-xs p-3.5"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/60" />
            <span className="text-text-main font-sans font-medium">{mistakeItem}</span>
          </li>
        ))}
      </ul>

    </section>
  );
};

export default Mistakes;