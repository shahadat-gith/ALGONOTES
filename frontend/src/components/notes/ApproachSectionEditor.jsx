import React from "react";
import { Plus, Trash2, Code2, ListOrdered, FileText } from "lucide-react";

const ApproachSectionEditor = ({ title, approach, onChange, defaultLanguage = "C++" }) => {
  // Gracefully handle uninitialized/optional approaches
  const data = approach || { 
    description: [], 
    codeBlock: { language: defaultLanguage, code: "" }, 
    algorithmSteps: [] 
  };

  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleDescTextChange = (index, text) => {
    const updatedDesc = [...data.description];
    updatedDesc[index] = { ...updatedDesc[index], text };
    handleFieldChange("description", updatedDesc);
  };

  const addDescBlock = (type) => {
    const updatedDesc = [...data.description, { type, text: "" }];
    handleFieldChange("description", updatedDesc);
  };

  const removeDescBlock = (index) => {
    handleFieldChange("description", data.description.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, val) => {
    const updatedSteps = [...data.algorithmSteps];
    updatedSteps[index] = val;
    handleFieldChange("algorithmSteps", updatedSteps);
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-6 shadow-card select-none">
      
      {/* Block Title Header */}
      <div className="border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <Code2 size={14} className="text-primary stroke-[2]" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-main">{title}</h3>
      </div>

      {/* Description Block Sub-Editor */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono flex items-center gap-1.5">
            <FileText size={12} className="stroke-[2]" />
            <span>Description Blocks</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addDescBlock("paragraph")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-sm border border-border-default bg-bg-base text-text-main hover:bg-bg-soft transition-colors cursor-pointer"
            >
              + Paragraph
            </button>
            <button
              type="button"
              onClick={() => addDescBlock("heading")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-sm border border-border-default bg-bg-base text-text-main hover:bg-bg-soft transition-colors cursor-pointer"
            >
              + Subheading
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {data.description.map((block, idx) => (
            <div key={idx} className="flex gap-2 items-center animate-fade-in">
              <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-xs border shrink-0 text-center min-w-[70px] ${
                block.type === "heading" 
                  ? "bg-primary-soft/10 text-primary border-primary/20" 
                  : "bg-bg-base text-text-light border-border-default"
              }`}>
                {block.type}
              </span>
              <input
                type="text"
                value={block.text}
                onChange={(e) => handleDescTextChange(idx, e.target.value)}
                className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-xs font-normal text-text-main placeholder-text-light/40 outline-hidden focus:border-primary/40 focus:bg-bg-base/80 transition-all"
                placeholder={block.type === "heading" ? "e.g., Sub-optimal Edge Logic" : "Explain approach detail..."}
              />
              <button 
                type="button" 
                onClick={() => removeDescBlock(idx)} 
                className="p-1.5 rounded-sm text-text-light hover:text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer shrink-0"
                title="Remove block"
              >
                <Trash2 size={13} className="stroke-[1.75]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Trace Ordered Array List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono flex items-center gap-1.5">
            <ListOrdered size={12} className="stroke-[2]" />
            <span>Core Execution Steps</span>
          </label>
          <button
            type="button"
            onClick={() => handleFieldChange("algorithmSteps", [...data.algorithmSteps, ""])}
            className="text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            + Add sequential step
          </button>
        </div>
        
        <div className="space-y-2">
          {data.algorithmSteps.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-center animate-fade-in">
              <span className="text-[11px] font-mono font-bold text-text-light shrink-0 w-5 text-left">{idx + 1}.</span>
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(idx, e.target.value)}
                className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-xs font-normal text-text-main placeholder-text-light/40 outline-hidden focus:border-primary/40 focus:bg-bg-base/80 transition-all"
                placeholder="e.g., Maintain left and right pointers..."
              />
              <button
                type="button"
                onClick={() => handleFieldChange("algorithmSteps", data.algorithmSteps.filter((_, i) => i !== idx))}
                className="p-1.5 rounded-sm text-text-light hover:text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer shrink-0"
                title="Remove step"
              >
                <Trash2 size={13} className="stroke-[1.75]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor Snippet Textarea */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono">
          Implementation Code Block ({defaultLanguage})
        </label>
        <div className="rounded-sm overflow-hidden border border-border-default relative">
          <textarea
            value={data.codeBlock?.code || ""}
            onChange={(e) => handleFieldChange("codeBlock", { language: defaultLanguage, code: e.target.value })}
            rows={8}
            className="w-full resize-y bg-bg-base px-4 py-3 font-mono text-xs text-text-main leading-6 placeholder-text-light/30 transition-all outline-hidden focus:bg-bg-base/80 custom-scrollbar"
            placeholder="// Paste clean implementation snippet code here..."
          />
        </div>
      </div>

    </div>
  );
};

export default ApproachSectionEditor;