import React from "react";
import Input from "../../common/Input";
import { Plus, Trash2, FileText } from "lucide-react";

const NoteAlgorithmEditor = ({ steps = [], onUpdate, onAdd, onDelete }) => {
  return (
    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[var(--primary)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
            3. Algorithms
          </h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
        >
          <Plus size={14} /> Add Step
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex gap-4 items-start p-4 bg-[var(--bg-base)]/40 border border-[var(--border-default)] rounded-xl"
          >
            <span className="h-7 w-7 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0 mt-7">
              {step.stepNo}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
              <div className="md:col-span-1">
                <Input
                  label="Step Title"
                  placeholder="Initialize Trackers"
                  value={step.title || ""}
                  onChange={(e) =>
                    onUpdate("algorithm", idx, "title", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Description"
                  placeholder="Provide logic parameters..."
                  value={step.description || ""}
                  onChange={(e) =>
                    onUpdate("algorithm", idx, "description", e.target.value)
                  }
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDelete("algorithm", idx)}
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

export default NoteAlgorithmEditor;
