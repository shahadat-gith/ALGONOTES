import React from "react";
import { GraduationCap } from "lucide-react";

const DevEducation = ({ education }) => (
  <div className="bg-bg-surface border border-border-default rounded-md p-5 shadow-card space-y-5 select-none">
    
    {/* Section Section Title Header */}
    <h3 className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-default pb-3 flex items-center gap-2">
      <GraduationCap size={15} className="text-primary stroke-[2]" /> 
      <span>Academic Formation Chronology</span>
    </h3>
    
    {/* Chronological Vertical Timeline Stack */}
    <div className="relative border-l border-border-default ml-2.5 pl-4 space-y-6">
      {education.map((edu, idx) => (
        <div key={idx} className="relative group">
          
          {/* Interactive Timeline Core Ring Node */}
          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-bg-surface border-2 border-border-default rounded-full group-hover:border-primary group-hover:bg-primary transition-all duration-200 shadow-xs" />
          
          {/* Metadata Grid Container */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <h4 className="text-xs font-semibold text-text-main tracking-wide group-hover:text-primary transition-colors">
                {edu.institution}
              </h4>
              <span className="text-[10px] font-mono font-medium text-text-light shrink-0">
                {edu.timeline}
              </span>
            </div>
            
            <p className="text-[11px] font-normal text-text-muted tracking-wide leading-normal">
              {edu.degree}
            </p>
            
            {/* Structural Performance Badge Element */}
            <div className="pt-0.5">
              <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 bg-primary-soft border border-primary/10 rounded-sm text-primary shadow-xs">
                {edu.metric}
              </span>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  </div>
);

export default DevEducation;