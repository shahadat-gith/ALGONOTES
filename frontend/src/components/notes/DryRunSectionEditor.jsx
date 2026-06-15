import React from "react";
import { Plus, Trash2 } from "lucide-react";

const DryRunSectionEditor = ({ dryRun = [], onChange }) => {
  const handleRowChange = (index, field, value) => {
    const updated = [...dryRun];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addRow = () => {
    onChange([...dryRun, { step: String(dryRun.length + 1), state: "", action: "", result: "" }]);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3 mb-4">
        <h3 className="text-base font-bold text-[var(--text-main)]">Execution Dry Run Matrix</h3>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>

      <div className="space-y-3">
        {dryRun.map((row, index) => (
          <div key={index} className="flex flex-wrap md:flex-nowrap gap-2 items-center border-b border-[var(--border-default)]/40 pb-3 md:pb-0 md:border-none">
            <input
              type="text"
              value={row.step}
              placeholder="Step"
              onChange={(e) => handleRowChange(index, "step", e.target.value)}
              className="w-16 rounded-lg border border-[var(--border-default)] p-1.5 text-xs font-bold text-center"
            />
            <input
              type="text"
              value={row.state}
              placeholder="State variables (e.g., i=0, sum=0)"
              onChange={(e) => handleRowChange(index, "state", e.target.value)}
              className="w-full rounded-lg border border-[var(--border-default)] p-1.5 text-xs font-mono"
            />
            <input
              type="text"
              value={row.action}
              placeholder="Action details"
              onChange={(e) => handleRowChange(index, "action", e.target.value)}
              className="w-full rounded-lg border border-[var(--border-default)] p-1.5 text-xs"
            />
            <input
              type="text"
              value={row.result}
              placeholder="Resulting change"
              onChange={(e) => handleRowChange(index, "result", e.target.value)}
              className="w-full rounded-lg border border-[var(--border-default)] p-1.5 text-xs text-[var(--success)] font-medium"
            />
            <button
              type="button"
              onClick={() => onChange(dryRun.filter((_, i) => i !== index))}
              className="text-[var(--text-light)] hover:text-[var(--danger)] px-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DryRunSectionEditor;