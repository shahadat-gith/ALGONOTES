import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ApproachSectionEditor = ({ title, approach, onChange, defaultLanguage = "C++" }) => {
  // Gracefully handle uninitialized/optional approaches
  const data = approach || { description: [], codeBlock: { language: defaultLanguage, code: "" }, algorithmSteps: [] };

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
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-6">
      <div className="border-b border-[var(--border-default)] pb-3">
        <h3 className="text-base font-bold text-[var(--text-main)]">{title}</h3>
      </div>

      {/* Description Block Sub-Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">Description Blocks</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addDescBlock("paragraph")}
              className="text-xs font-semibold px-2 py-1 border border-[var(--border-default)] rounded hover:bg-[var(--bg-soft)] text-[var(--text-main)]"
            >
              + Paragraph
            </button>
            <button
              type="button"
              onClick={() => addDescBlock("heading")}
              className="text-xs font-semibold px-2 py-1 border border-[var(--border-default)] rounded hover:bg-[var(--bg-soft)] text-[var(--text-main)]"
            >
              + Subheading
            </button>
          </div>
        </div>
        {data.description.map((block, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--bg-soft)] text-[var(--text-light)]">
              {block.type}
            </span>
            <input
              type="text"
              value={block.text}
              onChange={(e) => handleDescTextChange(idx, e.target.value)}
              className="w-full rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-sm"
              placeholder={block.type === "heading" ? "e.g., Sub-optimal Edge Logic" : "Explain approach detail..."}
            />
            <button type="button" onClick={() => removeDescBlock(idx)} className="text-[var(--text-light)] hover:text-[var(--danger)]">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Algorithm Trace Ordered Array List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">Core Execution Steps</label>
          <button
            type="button"
            onClick={() => handleFieldChange("algorithmSteps", [...data.algorithmSteps, ""])}
            className="text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            + Add sequential step
          </button>
        </div>
        {data.algorithmSteps.map((step, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-xs font-mono text-[var(--text-light)]">{idx + 1}.</span>
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(idx, e.target.value)}
              className="w-full rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-sm"
              placeholder="e.g., Maintain left and right pointers..."
            />
            <button
              type="button"
              onClick={() => handleFieldChange("algorithmSteps", data.algorithmSteps.filter((_, i) => i !== idx))}
              className="text-[var(--text-light)] hover:text-[var(--danger)]"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Code Editor Snippet Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">Implementation Code</label>
        <textarea
          value={data.codeBlock?.code || ""}
          onChange={(e) => handleFieldChange("codeBlock", { language: defaultLanguage, code: e.target.value })}
          rows={6}
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-soft)] p-3 font-mono text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
          placeholder="// Paste clean implementation snippet code here..."
        />
      </div>
    </div>
  );
};

export default ApproachSectionEditor;