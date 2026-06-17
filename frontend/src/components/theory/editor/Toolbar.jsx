import React from "react";
import { Heading1, Heading2, Bold, Code2, List, Pilcrow } from "lucide-react";

const Toolbar = ({ onFormatCommand }) => {
  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-t-md p-2 flex items-center gap-1 text-xs font-mono select-none flex-shrink-0 shadow-card">
      <button
        type="button"
        onClick={() => onFormatCommand("formatBlock", "<h2>")}
        className="p-1.5 rounded-sm hover:bg-bg-soft text-text-muted hover:text-text-main transition-colors"
        title="Header H2"
      >
        <Heading1 size={15} />
      </button>
      <button
        type="button"
        onClick={() => onFormatCommand("formatBlock", "<h3>")}
        className="p-1.5 rounded-sm hover:bg-bg-soft text-text-muted hover:text-text-main transition-colors"
        title="Sub-header H3"
      >
        <Heading2 size={15} />
      </button>
      <button
        type="button"
        onClick={() => onFormatCommand("formatBlock", "<p>")}
        className="p-1.5 rounded-sm hover:bg-bg-soft text-text-muted hover:text-text-main transition-colors"
        title="Paragraph Format"
      >
        <Pilcrow size={15} />
      </button>
      <div className="w-[1px] h-4 bg-border-default mx-1" />
      <button
        type="button"
        onClick={() => onFormatCommand("bold")}
        className="p-1.5 rounded-sm hover:bg-bg-soft text-text-muted hover:text-text-main transition-colors font-bold"
        title="Apply Bold Accent"
      >
        <Bold size={15} />
      </button>
      <button
        type="button"
        onClick={() => onFormatCommand("insertUnorderedList")}
        className="p-1.5 rounded-sm hover:bg-bg-soft text-text-muted hover:text-text-main transition-colors"
        title="Unordered List"
      >
        <List size={15} />
      </button>
      <button
        type="button"
        onClick={() => onFormatCommand("formatBlock", "<pre>")}
        className="p-1.5 rounded-sm hover:bg-bg-soft text-text-muted hover:text-text-main transition-colors"
        title="Format Code Block"
      >
        <Code2 size={15} />
      </button>
    </div>
  );
};

export default Toolbar;