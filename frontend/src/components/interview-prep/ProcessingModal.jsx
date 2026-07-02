import { Loader2 } from "lucide-react";
import React from "react";

const ProcessingModal = ({ title = "", subtitle = "" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-bg-surface p-6 text-center space-y-4 shadow-card">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-soft text-primary">
          <Loader2 size={24} className="animate-spin stroke-[2]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-text-main">{title}</h3>
          <p className="text-xs text-text-muted leading-relaxed">{subtitle}</p>
        </div>
        <div className="pt-2 text-[11px] font-medium text-text-light tracking-wide border-t border-border-default/40">
          This usually takes 1–2 minutes. Please wait...
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;
