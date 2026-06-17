import React from "react";
import { FileText } from "lucide-react";

const TextEditor = ({ title, textString = "", onChange }) => {
  return (
    <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-4 shadow-card select-none">
      
      {/* Title Header */}
      <div className="border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <FileText size={14} className="text-primary stroke-[2]" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-main">{title}</h3>
      </div>
      
     
      <textarea
        value={textString}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={`Write down core details regarding ${title.toLowerCase()}...`}
        className="w-full resize-y rounded-sm border bg-bg-base px-4 py-3 text-[14px] md:text-[16px] leading-7 text-text-main placeholder-text-light/30 transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar"
      />
      
    </div>
  );
};

export default TextEditor;