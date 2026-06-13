import React from "react";
import { Code2, StickyNote } from "lucide-react";

const MetricCards = ({ counters }) => {
  const { totalProblems, totalNotes, difficulty } = counters;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 bg-white border border-[var(--border-default)]/60 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider block">
            Problems Added
          </span>
          <h3 className="text-2xl font-black text-[var(--text-main)]">
            {totalProblems}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/30">
          <Code2 size={20} />
        </div>
      </div>

      <div className="p-5 bg-white border border-[var(--border-default)]/60 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider block">
            AI Study Notes
          </span>
          <h3 className="text-2xl font-black text-[var(--text-main)]">
            {totalNotes}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-indigo-100/30">
          <StickyNote size={20} />
        </div>
      </div>

      <div className="p-5 bg-white border border-[var(--border-default)]/60 rounded-2xl shadow-sm sm:col-span-2 flex flex-col justify-center space-y-2.5">
        <span className="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider block">
          Problems by Difficulty
        </span>
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 text-center">
            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 py-1.5 rounded-lg mb-1">
              {difficulty.easy}
            </div>
            <span className="text-[10px] text-[var(--text-light)] font-medium">
              Easy
            </span>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100/50 py-1.5 rounded-lg mb-1">
              {difficulty.medium}
            </div>
            <span className="text-[10px] text-[var(--text-light)] font-medium">
              Medium
            </span>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100/50 py-1.5 rounded-lg mb-1">
              {difficulty.hard}
            </div>
            <span className="text-[10px] text-[var(--text-light)] font-medium">
              Hard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
