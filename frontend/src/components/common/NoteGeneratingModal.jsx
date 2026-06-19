import React from "react";
import { Loader2 } from "lucide-react";

const NoteGeneratingModal = ({ isOpen, title = "AI is Crafting Your Study Note", subtitle = "Analyzing inputs, generating layout schemas, and checking edge cases..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-bg-surface border border-border-default rounded-md p-8 max-w-md w-full mx-4 shadow-xl flex flex-col items-center justify-center text-center space-y-4 border-b-2 border-b-primary/40 animate-scale-up">
        <Loader2 className="animate-spin text-primary stroke-[1.5]" size={44} />
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono">
            {title}
          </h3>
          <p className="text-xs text-text-light max-w-xs leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteGeneratingModal;