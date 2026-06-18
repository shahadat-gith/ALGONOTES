import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, onPageChange, className = "" }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-text-light mr-1">
        Page {page} of {totalPages}
      </span>
      
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        className="p-1 rounded-sm bg-bg-soft border border-border-default text-text-muted hover:text-text-main disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        <ChevronLeft size={13} />
      </button>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        className="p-1 rounded-sm bg-bg-soft border border-border-default text-text-muted hover:text-text-main disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

export default Pagination;