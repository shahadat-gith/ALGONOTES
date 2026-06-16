import React from "react";
import { Plus, Trash2, ListTree } from "lucide-react";

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
    <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-5 shadow-card select-none">
      
      {/* Header Block Section */}
      <div className="flex items-center justify-between border-b border-border-default pb-3.5 font-mono">
        <div className="flex items-center gap-2">
          <ListTree size={14} className="text-primary stroke-[2]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-main">
            {title}
          </h3>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm bg-primary-soft border border-primary/10 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-xs"
        >
          <Plus size={13} className="stroke-[2.5]" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Conditional Content Block Layout */}
      {items.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border-default rounded-sm bg-bg-soft/10 text-xs text-text-muted font-normal tracking-wide">
          No points added yet. Tap "Add Item" to add an annotation block.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 animate-fade-in group">
              {/* Sequential Row Pointer Number */}
              <span className="mt-2.5 text-xs font-mono font-bold text-text-light w-5 shrink-0 text-left">
                {String(index + 1).padStart(2, "0")}.
              </span>
              
              {/* Dynamic Multiple Paragraph Input Field */}
              <textarea
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                rows={2}
                className="w-full resize-none rounded-sm border border-border-default bg-bg-base px-3 py-2 text-xs font-normal text-text-main placeholder-text-light/30 leading-6 transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar"
                placeholder="Type your explanation, observation, or algorithmic criteria here..."
              />
              
              {/* Row Destruction Trigger Button */}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mt-1.5 p-1.5 rounded-sm text-text-light hover:text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                title="Purge description lane"
              >
                <Trash2 size={13} className="stroke-[1.75]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSectionEditor;