import React from "react";
import { X, AlertCircle, RefreshCw } from "lucide-react";

const ErrorModal = ({ 
  isOpen, 
  title = "Error", 
  message, 
  onClose, 
  actionLabel, 
  onAction 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop Glassmorphism Blur Filter Layer */}
      <div 
        className="absolute inset-0 bg-bg-base/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Surface Box */}
      <div className="relative w-full max-w-md transform rounded-2xl border border-border-default bg-bg-surface p-6 shadow-xl transition-all animate-scale-in flex flex-col gap-5">
        
        {/* Close Button Anchor Corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main rounded-lg p-1.5 hover:bg-bg-base transition-colors cursor-pointer"
        >
          <X size={16} className="stroke-[2.2]" />
        </button>

        {/* Header Layout Grid */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger border border-danger/15">
            <AlertCircle size={20} className="stroke-[2.2]" />
          </div>
          <div className="space-y-1 mt-0.5">
            <h3 className="text-base font-semibold text-text-main tracking-tight">
              {title}
            </h3>
            <p className="text-sm font-medium leading-6 text-text-light pr-4">
              {message}
            </p>
          </div>
        </div>

        {/* Action Triggers Footer Interface Panel */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border-default/60 pt-4 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 text-xs font-semibold tracking-wide text-text-light hover:text-text-main rounded-xl border border-border-strong bg-bg-surface hover:bg-bg-soft/60 transition-all duration-200 cursor-pointer"
          >
            Dismiss
          </button>

          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex h-10 items-center gap-1.5 px-4 text-xs font-semibold tracking-wide text-white rounded-xl bg-danger hover:bg-danger-hover shadow-xs transition-all duration-200 cursor-pointer"
            >
              <RefreshCw size={13} className="stroke-[2.5]" />
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;