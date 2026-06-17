import React from "react";
import { Hourglass, HardDrive, Code, Cpu, BarChart2 } from "lucide-react";

const Approach = ({ title, approach, highlight = false }) => {
  // Gracefully drop rendering if the specific approach data doesn't exist or is null
  if (!approach || Object.keys(approach).length === 0) return null;

  const { 
    complexity = { time: "N/A", space: "N/A" }, 
    description = "", // <-- UPDATED: Expect a flat string format directly from backend models
    codeBlock, 
    algorithmSteps = [] 
  } = approach;

  return (
    <section className={`border rounded-md p-6 shadow-card select-none animate-fade-in space-y-6 transition-all duration-200 ${
      highlight 
        ? "bg-bg-surface border-primary/40 ring-1 ring-primary/10 shadow-primary/5" 
        : "bg-bg-surface border-border-default"
    }`}>
      
      {/* Section Header */}
      <h2 className="text-xs font-bold uppercase tracking-widest border-b border-border-default/60 pb-3.5 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <Cpu size={14} className={highlight ? "text-primary stroke-[2]" : "text-text-light stroke-[2]"} />
          <span className={highlight ? "text-primary font-bold" : "text-text-main"}>{title}</span>
        </div>
        {highlight && (
          <span className="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border border-primary/20">
            Recommended
          </span>
        )}
      </h2>

      {/* Description Text Block - Updated from mapping array to direct clean text string layout */}
      {description && description.strip?.() !== "" && (
        <div className="space-y-3">
          <p className="text-[14px] md:text-[16px] leading-7 text-text-muted font-normal tracking-wide whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}

      {/* Algorithm Steps List - 14px on mobile, scales to 16px on desktop frames */}
      {algorithmSteps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-light font-mono">
            Core Strategy Steps
          </h4>
          <ul className="space-y-2.5">
            {algorithmSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[14px] md:text-[16px] text-text-muted leading-relaxed">
                <span className={`mt-2 md:mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${highlight ? "bg-primary/60" : "bg-text-light/50"}`} />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Snippet Box */}
      {codeBlock && codeBlock.code && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-light font-mono">
            <Code size={12} />
            <span>Implementation ({codeBlock.language || "C++"})</span>
          </div>
          <div className="bg-bg-soft/40 border border-border-default/60 rounded-sm p-4 font-mono text-[13px] text-text-main overflow-x-auto whitespace-pre custom-scrollbar leading-relaxed">
            {codeBlock.code}
          </div>
        </div>
      )}

      {/* Complexity Analysis Panel - 13px on mobile, scales to 14px on desktop frames */}
      <div className="space-y-3 pt-2 border-t border-border-default/40">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-light font-mono flex items-center gap-1.5">
          <BarChart2 size={13} className={highlight ? "text-primary" : "text-text-light"} />
          <span>Complexity Analysis:</span>
        </h3>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-sm p-4 font-mono text-[13px] md:text-[14px] ${
          highlight ? "bg-primary/5 border-primary/10" : "bg-bg-soft/20 border-border-default/60"
        }`}>
          <div className="flex items-center gap-2.5">
            <Hourglass size={14} className={highlight ? "text-primary/70" : "text-text-light"} />
            <span className="text-text-muted">Time Complexity:</span>
            <span className={`font-bold ${highlight ? "text-primary" : "text-text-main"}`}>
              {complexity.time || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:border-l border-border-default/60 sm:pl-5">
            <HardDrive size={14} className={highlight ? "text-primary/70" : "text-text-light"} />
            <span className="text-text-muted">Space Complexity:</span>
            <span className="font-bold text-text-main">
              {complexity.space || "N/A"}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Approach;