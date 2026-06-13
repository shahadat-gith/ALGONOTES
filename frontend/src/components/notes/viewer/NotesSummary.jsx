import React from "react";
import { FileText, CheckCircle2, Clock } from "lucide-react";

const NotesSummary = ({
  totalNotesCount = 0,
  finalizedCount = 0,
  draftCount = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      
      {/* Total Notes Card */}
      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--primary)]/20 rounded-2xl shadow-[0_4px_20px_-4px_rgba(var(--primary-rgb),0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group overflow-hidden relative">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-24 h-24 bg-[var(--primary-soft)]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-br from-[var(--primary)] to-blue-500 text-white rounded-xl shadow-md shadow-[var(--primary)]/10">
            <FileText size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] text-[var(--text-light)] font-bold uppercase tracking-widest">
              Total Notes
            </p>
            <p className="text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">
              {totalNotesCount}
            </p>
          </div>
        </div>
      </div>

      {/* Finalized Notes Card */}
      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group overflow-hidden relative">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-24 h-24 bg-[var(--success-soft)]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-br from-[var(--success)] to-emerald-500 text-white rounded-xl shadow-md shadow-[var(--success)]/10">
            <CheckCircle2 size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] text-[var(--text-light)] font-bold uppercase tracking-widest">
              Finalized
            </p>
            <p className="text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">
              {finalizedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Draft Notes Card */}
      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group overflow-hidden relative">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-24 h-24 bg-[var(--warning-soft)]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-br from-[var(--warning)] to-amber-500 text-white rounded-xl shadow-md shadow-[var(--warning)]/10">
            <Clock size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] text-[var(--text-light)] font-bold uppercase tracking-widest">
              Drafts
            </p>
            <p className="text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">
              {draftCount}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NotesSummary;