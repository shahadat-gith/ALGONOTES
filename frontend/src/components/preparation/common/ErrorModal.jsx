import { RefreshCcw, XCircle } from "lucide-react";
import React from "react";

import { deleteApplication } from "../../../api/preparationApi";

const ErrorModal = ({title, error, setError, }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-danger/20 bg-bg-surface p-6 space-y-4 shadow-card">
        <div className="flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-danger/10 text-danger shrink-0">
            <XCircle size={20} className="stroke-[2]" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-main">
              {title}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed break-words">
              {error}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-default/40">
          <button
            type="button"
            onClick={() => setError("")}
            className="h-8 text-[11px] px-3.5 font-semibold text-text-muted hover:text-text-main rounded-md border border-border-default hover:bg-bg-soft transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            className="h-8 text-[11px] px-3.5 font-semibold bg-danger text-white rounded-md hover:bg-danger/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCcw size={11} className="stroke-[2.5]" />
            <span>Try Later!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
