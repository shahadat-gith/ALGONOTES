import React from "react";
import { Code2, X } from "lucide-react";
// Import the brand icons you provided
import { FaPython, FaJava } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { BsJavascript, BsTypescript } from "react-icons/bs";
import { TbBrandCpp, TbBrandCSharp } from "react-icons/tb";
import { SiRust } from "react-icons/si";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", icon: BsJavascript, color: "hover:text-[#F7DF1E]" },
  { id: "python", label: "Python", icon: FaPython, color: "hover:text-[#3776AB]" },
  { id: "java", label: "Java", icon: FaJava, color: "hover:text-[#007396]" },
  { id: "cpp", label: "C++", icon: TbBrandCpp, color: "hover:text-[#00599C]" },
  { id: "typescript", label: "TypeScript", icon: BsTypescript, color: "hover:text-[#3178C6]" },
  { id: "go", label: "Go", icon: FaGolang, color: "hover:text-[#00ADD8]" },
  { id: "rust", label: "Rust", icon: SiRust, color: "hover:text-[#CE412B]" },
  { id: "csharp", label: "C#", icon: TbBrandCSharp, color: "hover:text-[#239120]" },
];

const LanguageSelectModal = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-border-default bg-bg-surface p-6 shadow-card">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted transition hover:bg-bg-soft hover:text-text-main cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Code2 size={18} className="stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-main">
              Choose Code Language
            </h3>
            <p className="text-xs text-text-muted">
              Select the language you'd like examples in for this guide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => {
            const IconComponent = lang.icon;
            
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => onSelect(lang.id)}
                className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-base p-3.5 text-left transition hover:border-primary/30 hover:bg-primary-soft/30 cursor-pointer group"
              >
                {/* Dynamically applying standard transition and custom brand hover color */}
                <span className={`text-xl text-text-muted transition-colors duration-200 ${lang.color}`}>
                  <IconComponent />
                </span>
                <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors duration-200">
                  {lang.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onSelect(null)}
          className="mt-4 w-full rounded-xl border border-dashed border-border-default py-2.5 text-xs text-text-muted transition hover:border-text-muted hover:text-text-light cursor-pointer"
        >
          No preference — let AI decide
        </button>
      </div>
    </div>
  );
};

export default LanguageSelectModal;