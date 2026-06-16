import React from "react";
import { Terminal } from "lucide-react";

const DevSkills = ({ skills }) => (
  <div className="bg-bg-surface border border-border-default rounded-md p-5 shadow-card space-y-5 select-none">
    
    {/* Section Title Header */}
    <h3 className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-default pb-3 flex items-center gap-2">
      <Terminal size={14} className="text-primary stroke-[2]" /> 
      <span>Engine Core & Framework Pillars</span>
    </h3>
    
    {/* Categories Adaptive Matrix Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(skills).map(([category, list]) => (
        <div 
          key={category} 
          className="p-4 rounded-sm bg-bg-soft/40 border border-border-default flex flex-col gap-2.5 transition-colors duration-200 hover:border-border-strong"
        >
          {/* Internal Category Metric Title */}
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block border-b border-border-default/40 pb-1.5 font-mono">
            {category}
          </span>
          
          {/* Skill Badges Flow Wrap Collection */}
          <div className="flex flex-wrap gap-1.5">
            {list.map((skill) => (
              <span 
                key={skill}
                className="text-[11px] font-mono font-medium px-2.5 py-1 bg-bg-base text-text-muted border border-border-default rounded-sm transition-all duration-150 hover:text-text-main hover:border-primary/40 hover:bg-primary-soft/10 cursor-default"
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