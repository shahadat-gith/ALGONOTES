import React from "react";
import Input from "../../common/Input";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

const NoteEdgeCaseEditor = ({ cases = [], onUpdate, onAdd, onDelete }) => {
  return (
    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-[var(--primary)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
            5.Edge Cases
          </h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
        >
          <Plus size={14} /> Add Edge Case
        </button>
      </div>

      <div className="space-y-4">
        {cases.map((c, idx) => (
          <div
            key={idx}
            className="flex gap-4 items-start p-4 bg-[var(--bg-base)]/40 border border-[var(--border-default)] rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
              <div className="md:col-span-1">
                <Input
                  label="Boundary Case"
                  placeholder="Empty Array / Null Node"
                  value={c.case || ""}
                  onChange={(e) =>
                    onUpdate("edgeCases", idx, "case", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="System Response"
                  placeholder="Return 0 or handle manually..."
                  value={c.explanation || ""}
                  onChange={(e) =>
                    onUpdate("edgeCases", idx, "explanation", e.target.value)
                  }
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDelete("edgeCases", idx)}
              className="p-1.5 text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-md mt-7"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteEdgeCaseEditor;
