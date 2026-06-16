import React from "react";
import { FileText } from "lucide-react";

const SummaryCard = ({ summary = [] }) => {
  if (!summary.length) return null;

  return (
    <section className="bg-bg-surface border border-border-default rounded-md p-6 shadow-card select-none">
      
      {/* Section Header */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <FileText size={14} className="text-primary stroke-[2]" />
        <span>Problem Summary</span>
      </h2>
      
      {/* Paragraph Render Stack */}
      <div className="space-y-3 mt-4">
        {summary.map((paragraph, index) => (
          <p 
            key={index} 
            className="text-xs leading-6 text-text-muted font-normal tracking-wide"
          >
            {paragraph}
          </p>
        ))}
      </div>

    </section>
  );
};

export default SummaryCard;