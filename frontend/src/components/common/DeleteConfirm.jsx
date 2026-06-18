import React, { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

const DeleteConfirm = ({
  isOpen,
  title = "Are you sure?",
  message = "Do you really want to continue? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) => {


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 isolate">
      {/* Backdrop overlay (z-0 via isolation layer default placement) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (!loading) onClose();
        }}
      />

      {/* Centered card panel surface (Forced to sit on top via z-10) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 flex flex-col items-center bg-bg-surface border border-border-default shadow-card rounded-xl py-6 px-5 md:w-[460px] w-[370px] transform transition-all duration-200 ease-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        
        {/* Red warning trash icon container */}
        <div className="flex items-center justify-center p-4 bg-danger/10 rounded-full text-danger select-none">
          <Trash2 size={24} />
        </div>

        {/* Content fields */}
        <h2 className="text-text-main font-semibold mt-4 text-xl tracking-tight select-none">
          {title}
        </h2>
        <p className="text-sm text-text-muted mt-2 text-center whitespace-pre-line leading-relaxed">
          {message}
        </p>

        {/* Action button controls */}
        <div className="flex items-center justify-center gap-4 mt-6 w-full">
          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-full md:w-36 h-10 inline-flex items-center justify-center font-medium text-sm rounded-md border border-border-default bg-bg-surface text-text-muted hover:bg-bg-soft active:scale-[0.98] transition-all duration-200 select-none outline-hidden cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="w-full md:w-36 h-10 inline-flex items-center justify-center gap-2 font-medium text-sm rounded-md text-white bg-danger hover:bg-opacity-90 active:scale-[0.98] transition-all duration-200 select-none outline-hidden cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow-xs"
          >
            {loading && (
              <Loader2 size={16} className="animate-spin shrink-0 text-white" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;