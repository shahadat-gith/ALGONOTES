import React from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";

const CodeBlockEditor = ({ block, onUpdate }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Solution Code
        </span>
      </div>

      <AutoResizeTextarea
        value={block.code || ""}
        onChange={(value) => onUpdate({ code: value })}
        rows={8}
        placeholder="// Write code here..."
        className="bg-slate-950 px-4 py-3 font-mono text-xs leading-6 text-slate-100"
      />
    </div>
  );
};

export default CodeBlockEditor;