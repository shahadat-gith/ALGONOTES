import React from "react";
import { Code2, ListOrdered } from "lucide-react";

const ApproachCard = ({ title, approach, highlight = false }) => {
  if (!approach) return null;

  const { description = [], codeBlock, algorithmSteps = [] } = approach;

  return (
    <section
      className={`rounded-md border p-6 shadow-card bg-bg-surface select-none transition-all duration-300 ${
        highlight
          ? "border-primary/40 ring-1 ring-primary-soft/30 bg-gradient-to-b from-bg-surface to-primary-soft/2"
          : "border-border-default"
      }`}
    >
      {/* Card Section Header */}
      <h2
        className={`text-xs font-bold uppercase tracking-widest border-b pb-3.5 flex items-center gap-2 font-mono ${
          highlight 
            ? "text-primary border-primary/20" 
            : "text-text-main border-border-default"
        }`}
      >
        <Code2 size={14} className={highlight ? "text-primary stroke-[2]" : "text-text-light stroke-[2]"} />
        <span>{title}</span>
      </h2>

      {/* Structured Description Render Block */}
      {description.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {description.map((desc, idx) => {
            if (desc.type === "heading") {
              return (
                <h3 key={idx} className="text-xs font-semibold text-text-main tracking-wide mt-4 first:mt-0 font-mono uppercase text-primary/90">
                  {desc.text}
                </h3>
              );
            }
            return (
              <p key={idx} className="text-xs leading-6 text-text-muted font-normal tracking-wide">
                {desc.text}
              </p>
            );
          })}
        </div>
      )}

      {/* Ordered Step Array Breakdown */}
      {algorithmSteps.length > 0 && (
        <div className="mt-5 space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono flex items-center gap-1.5">
            <ListOrdered size={12} className="stroke-[2]" />
            <span>Algorithm Steps</span>
          </h4>
          <ol className="space-y-2.5 text-xs text-text-muted">
            {algorithmSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 leading-relaxed tracking-wide">
                <span className="flex items-center justify-center w-5 h-5 rounded-xs bg-bg-soft border border-border-default text-[10px] font-mono font-bold text-text-light shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Raw Isolated Syntax Snippet Block */}
      {codeBlock?.code && (
        <div className="mt-5 rounded-sm overflow-hidden border border-border-default bg-bg-base p-4 shadow-inner relative group">
          <div className="flex items-center justify-between border-b border-border-default/40 pb-2.5 mb-3.5 text-[10px] font-mono font-medium text-text-light uppercase tracking-widest">
            <span>Implementation Snippet</span>
            <span className="rounded-xs bg-bg-soft border border-border-default px-2 py-0.5 font-bold text-text-muted">
              {codeBlock.language || "C++"}
            </span>
          </div>
          <pre className="overflow-x-auto font-mono text-xs text-text-main leading-6 custom-scrollbar">
            <code>{codeBlock.code}</code>
          </pre>
        </div>
      )}
    </section>
  );
};

export default ApproachCard;