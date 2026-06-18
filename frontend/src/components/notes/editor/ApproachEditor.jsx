import React from "react";
import { Plus, Trash2, Code2, ListOrdered, FileText, Hourglass, HardDrive } from "lucide-react";


const ApproachEditor = ({ title, approach, onChange, defaultLanguage = "C++" }) => {
  const data = approach || { 
    complexity: { time: "", space: "" },
    description: "", 
    codeBlock: { language: defaultLanguage, code: "" }, 
    algorithmSteps: [] 
  };

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleComplexityChange = (metric, value) => {
    const updatedComplexity = { ...data.complexity, [metric]: value };
    handleFieldChange("complexity", updatedComplexity);
  };

  const handleStepChange = (index, val) => {
    const updatedSteps = [...data.algorithmSteps];
    updatedSteps[index] = val;
    handleFieldChange("algorithmSteps", updatedSteps);
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-6 shadow-card select-none">
      
      {/* Title Header */}
      <div className="border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <Code2 size={14} className="text-primary stroke-[2]" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-main">{title}</h3>
      </div>

      {/* Embedded Complexity Big O Spec Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono flex items-center gap-1.5">
            <Hourglass size={12} />
            <span>Time Complexity</span>
          </label>
          <input
            type="text"
            value={data.complexity?.time || ""}
            onChange={(e) => handleComplexityChange("time", e.target.value)}
            placeholder="e.g., O(N log N)"
            className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-[14px] md:text-[16px] font-mono focus:border-primary/40 outline-hidden transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono flex items-center gap-1.5">
            <HardDrive size={12} />
            <span>Space Complexity</span>
          </label>
          <input
            type="text"
            value={data.complexity?.space || ""}
            onChange={(e) => handleComplexityChange("space", e.target.value)}
            placeholder="e.g., O(N)"
            className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-[14px] md:text-[16px] font-mono focus:border-primary/40 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Description Subsection - UPDATED: Converted to a single, clean text field editor */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono flex items-center gap-1.5">
          <FileText size={12} />
          <span>Approach Description</span>
        </label>
        <textarea
          value={data.description || ""}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          style={{ fieldSizing: "content" }}
          placeholder="Explain the strategy implementation flow details in plain English..."
          className="w-full resize-y rounded-sm border bg-bg-base px-4 py-3 text-[14px] md:text-[16px] leading-7 text-text-main placeholder-text-light/30 transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar"
        />
      </div>

      {/* Algorithm Sequence Tracks */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono flex items-center gap-1.5">
            <ListOrdered size={12} />
            <span>Sequential Execution Steps</span>
          </label>
          <button
            type="button"
            onClick={() => handleFieldChange("algorithmSteps", [...data.algorithmSteps, ""])}
            className="text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            + Add Step
          </button>
        </div>
        
        <div className="space-y-2">
          {data.algorithmSteps.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-center animate-fade-in">
              <span className="text-[11px] font-mono font-bold text-text-light shrink-0 w-5">{idx + 1}.</span>
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(idx, e.target.value)}
                className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-[14px] md:text-[16px] text-text-main outline-hidden focus:border-primary/40 focus:bg-bg-base/80 transition-all"
                placeholder="e.g., Maintain dynamic two pointer reference index thresholds..."
              />
              <button
                type="button"
                onClick={() => handleFieldChange("algorithmSteps", data.algorithmSteps.filter((_, i) => i !== idx))}
                className="p-1.5 rounded-sm text-text-light hover:text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Code Editor */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono">
          Code Block Text Snippet Editor ({defaultLanguage})
        </label>
        <div className="rounded-sm overflow-hidden border border-border-default relative">
          <textarea
            value={data.codeBlock?.code || ""}
            onChange={(e) => handleFieldChange("codeBlock", { language: defaultLanguage, code: e.target.value })}
           style={{ fieldSizing: "content" }}
            className="w-full resize-y bg-bg-base px-4 py-3 font-mono text-[14px] md:text-[16px] text-text-main leading-6 placeholder-text-light/30 outline-hidden focus:bg-bg-base/80 custom-scrollbar"
            placeholder="// Paste optimized algorithm codebase scripts here..."
          />
        </div>
      </div>

    </div>
  );
};

export default ApproachEditor;