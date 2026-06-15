import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ListSectionEditor = ({ title, items = [], onChange }) => {
  const handleItemChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3 mb-4">
        <h3 className="text-base font-bold text-[var(--text-main)]">{title}</h3>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs italic text-[var(--text-light)]">No points added yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-3 text-xs font-medium text-[var(--text-light)] w-4">
                {index + 1}.
              </span>
              <textarea
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none"
                placeholder="Type your explanation or observation here..."
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mt-2 text-[var(--text-light)] hover:text-[var(--danger)] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSectionEditor;