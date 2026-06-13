import React from "react";
import { Code2, StickyNote, Calendar } from "lucide-react";

const ContributionTooltipModal = ({ activeDay, position, onClose }) => {
  if (!activeDay) return null;

  const { date, stats } = activeDay;

  // Format date nicely for the header context block
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      className="fixed z-50 -translate-x-1/2 -translate-y-full mb-3 w-52 bg-slate-900 text-white rounded-xl shadow-2xl p-3 border border-slate-800/80 pointer-events-none animate-fade-in space-y-2.5"
    >

      {/* 1. Header Calendar Context */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
        <Calendar size={12} className="text-slate-400 shrink-0" />
        <span className="text-[10px] font-bold text-slate-200 tracking-tight truncate">
          {formattedDate}
        </span>
      </div>

      {/* 2. Detailed Data Count Layout Rows */}
      <div className="space-y-1.5">
        
        {/* Row A: Problems Added Metrics */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Code2 size={11} className="text-indigo-400 shrink-0" />
            <span>Problems Added</span>
          </div>
          <span className="font-mono font-bold text-slate-100 bg-white/5 px-1.5 py-0.5 rounded">
            {stats.problems}
          </span>
        </div>

        {/* Row B: Notes Generated Metrics */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <StickyNote size={11} className="text-emerald-400 shrink-0" />
            <span>Notes Generated</span>
          </div>
          <span className="font-mono font-bold text-slate-100 bg-white/5 px-1.5 py-0.5 rounded">
            {stats.notes}
          </span>
        </div>

      </div>

      {/* 3. Combined Total Efficiency Indicator Footnote */}
      <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400 font-medium">
        <span>Total Metrics</span>
        <span className="text-emerald-400 font-bold font-mono">
          {stats.total} {stats.total === 1 ? "action" : "actions"}
        </span>
      </div>
    </div>
  );
};

export default ContributionTooltipModal;