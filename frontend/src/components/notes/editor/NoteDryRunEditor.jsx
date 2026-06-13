import React from "react";
import Input from "../../common/Input";
import { Plus, Trash2, Table } from "lucide-react";

const NoteDryRunEditor = ({ rows = [], onUpdate, onAdd, onDelete }) => {
  return (
    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Table size={18} className="text-[var(--primary)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
            4. Dry Run Simulation
          </h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
        >
          <Plus size={14} /> Append Row
        </button>
      </div>

      <div className="space-y-4">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="p-4 bg-[var(--bg-base)]/40 border border-[var(--border-default)] rounded-xl space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-muted)]">
                Matrix Execution Sequence Row #{row.stepNo}
              </span>
              <button
                type="button"
                onClick={() => onDelete("dryRun", idx)}
                className="text-[var(--danger)] hover:bg-[var(--danger-soft)] p-1 rounded-md"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                label="Input State"
                placeholder="nums=[1,2], i=0"
                value={row.inputState || ""}
                onChange={(e) =>
                  onUpdate("dryRun", idx, "inputState", e.target.value)
                }
              />
              <Input
                label="Action Code"
                placeholder="Check map lookup"
                value={row.action || ""}
                onChange={(e) =>
                  onUpdate("dryRun", idx, "action", e.target.value)
                }
              />
              <Input
                label="Output State"
                placeholder="map={1:0}"
                value={row.outputState || ""}
                onChange={(e) =>
                  onUpdate("dryRun", idx, "outputState", e.target.value)
                }
              />
              <Input
                label="Explanation"
                placeholder="Pushed to indices"
                value={row.explanation || ""}
                onChange={(e) =>
                  onUpdate("dryRun", idx, "explanation", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteDryRunEditor;
