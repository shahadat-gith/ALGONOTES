import React from "react";
import { Plus, Trash2 } from "lucide-react";

const BulletBlockEditor = ({ block, onUpdate }) => {
  const items = block.items || [];

  const updateItem = (index, value) => {
    const updated = items.map((item, i) => (i === index ? value : item));
    onUpdate({ items: updated });
  };

  const addItem = () => {
    onUpdate({ items: [...items, ""] });
  };

  const removeItem = (index) => {
    onUpdate({
      items: items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-sm text-[var(--primary)]">•</span>

          <input
            value={item || ""}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder="Bullet point..."
            className="flex-1 rounded-lg border border-transparent bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--primary)]"
          />

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="rounded-lg p-2 text-[var(--text-light)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
      >
        <Plus size={13} />
        Add bullet
      </button>
    </div>
  );
};

export default BulletBlockEditor;