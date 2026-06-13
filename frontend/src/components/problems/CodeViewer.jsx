
import React from "react";
import { Code2 } from "lucide-react";

const CodeViewer = ({ language, userCode, onChange, error, loading }) => {
  const getFileExtension = () => {
    switch (language) {
      case "C++": return "cpp";
      case "Java": return "java";
      case "Python": return "py";
      default: return "js";
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-[#1e1e2e] border border-neutral-800 rounded-2xl shadow-[var(--shadow-card)] overflow-hidden min-h-[440px]">
      
      {/* Editor Header */}
      <div className="px-4 py-3 bg-[#181825] border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-400">
          <Code2 size={16} className="text-[var(--primary)]" />
          <span className="text-xs font-mono font-bold tracking-wide">
            solution_source.{getFileExtension()}
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded-md">
          {language}
        </span>
      </div>

      {/* Editor Input Space */}
      <textarea
        name="userCode"
        placeholder="// Paste your compiled source code solution right here..."
        value={userCode}
        onChange={onChange}
        disabled={loading}
        className={`w-full flex-1 bg-transparent p-5 font-mono text-sm text-neutral-200 resize-none outline-none focus:ring-0 ${
          error ? "placeholder-red-400/50" : "placeholder-neutral-500"
        }`}
        style={{ minHeight: "380px", tabSize: 4 }}
      />
    </div>
  );
};

export default CodeViewer;