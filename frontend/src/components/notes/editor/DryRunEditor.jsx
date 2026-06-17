import React from "react";
import { Plus, Trash2, Activity } from "lucide-react";

const DryRunEditor = ({ dryRun = [], onChange }) => {
  const handleRowChange = (index, field, value) => {
    const updated = [...dryRun];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addRow = () => {
    onChange([...dryRun, { step: String(dryRun.length + 1), state: "", action: "", result: "" }]);
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-5 shadow-card select-none">
      <div className="flex items-center justify-between border-b border-border-default pb-3.5 font-mono">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary stroke-[2]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-main">Execution Dry Run Matrix</h3>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm bg-primary-soft border border-primary/10 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-xs"
        >
          <Plus size={13} className="stroke-[2.5]" />
          <span>Add Row</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {dryRun.length > 0 && (
          <div className="hidden md:flex gap-2.5 px-1 text-[10px] font-mono font-bold uppercase tracking-widest text-text-light">
            <span className="w-16 text-center">Step</span>
            <span className="w-full">Memory State Map</span>
            <span className="w-full">Operation / Action</span>
            <span className="w-full">Result String</span>
            <span className="w-8 shrink-0" />
          </div>
        )}

        <div className="space-y-2.5">
          {dryRun.map((row, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center border border-border-default/40 md:border-none p-3.5 md:p-0 bg-bg-base/30 md:bg-transparent rounded-sm md:rounded-none animate-fade-in relative group">
              
              <input
                type="text"
                value={row.step}
                onChange={(e) => handleRowChange(index, "step", e.target.value)}
                className="w-full md:w-16 rounded-sm border border-border-default bg-bg-base px-2 py-1.5 text-[14px] md:text-[16px] font-mono font-bold text-center text-primary focus:border-primary/40 outline-hidden transition-all"
              />
              
              <input
                type="text"
                value={row.state}
                onChange={(e) => handleRowChange(index, "state", e.target.value)}
                className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-[14px] md:text-[16px] font-mono text-text-main focus:border-primary/40 outline-hidden transition-all"
                placeholder="State maps (e.g., left=0, right=n-1)"
              />
              
              <input
                type="text"
                value={row.action}
                onChange={(e) => handleRowChange(index, "action", e.target.value)}
                className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-[14px] md:text-[16px] text-text-main focus:border-primary/40 outline-hidden transition-all"
                placeholder="Details of operation statement..."
              />
              
              <input
                type="text"
                value={row.result}
                onChange={(e) => handleRowChange(index, "result", e.target.value)}
                className="w-full rounded-sm border border-border-default bg-bg-base px-3 py-1.5 text-[14px] md:text-[16px] font-mono font-semibold text-success focus:border-success/40 outline-hidden transition-all"
                placeholder="Resulting code changes..."
              />
              
              <button
                type="button"
                onClick={() => onChange(dryRun.filter((_, i) => i !== index))}
                className="p-1.5 rounded-sm text-text-light hover:text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {dryRun.length === 0 && (
          <div className="text-center py-6 border border-dashed border-border-default rounded-sm bg-bg-soft/10 text-xs text-text-muted">
            No dry-run traces tracked yet. Tap "+ Add Row" to initialize code dry-run matrices.
          </div>
        )}
      </div>
    </div>
  );
};

export default DryRunEditor;