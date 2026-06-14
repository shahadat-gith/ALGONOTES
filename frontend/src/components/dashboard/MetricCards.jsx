import React from "react";
import { StickyNote, BarChart3 } from "lucide-react";

const MetricCards = ({ counters = {} }) => {
  const totalNotes = counters.totalNotes || 0;

  const difficulty = counters.difficulty || {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="space-y-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)]">
            Total Study Notes
          </span>

          <h3 className="text-2xl font-black text-[var(--text-main)]">
            {totalNotes}
          </h3>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-600">
          <StickyNote size={20} />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] sm:col-span-1 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)]">
            Notes by Problem difficulty level
          </span>

          <BarChart3 size={16} className="text-[var(--text-light)]" />
        </div>

        <div className="flex w-full items-center gap-4">
          <div className="flex-1 text-center">
            <div className="mb-1 rounded-lg border border-emerald-100 bg-emerald-50 py-1.5 text-xs font-bold text-emerald-600">
              {difficulty.easy || 0}
            </div>

            <span className="text-[10px] font-medium text-[var(--text-light)]">
              Easy
            </span>
          </div>

          <div className="flex-1 text-center">
            <div className="mb-1 rounded-lg border border-amber-100 bg-amber-50 py-1.5 text-xs font-bold text-amber-600">
              {difficulty.medium || 0}
            </div>

            <span className="text-[10px] font-medium text-[var(--text-light)]">
              Medium
            </span>
          </div>

          <div className="flex-1 text-center">
            <div className="mb-1 rounded-lg border border-rose-100 bg-rose-50 py-1.5 text-xs font-bold text-rose-600">
              {difficulty.hard || 0}
            </div>

            <span className="text-[10px] font-medium text-[var(--text-light)]">
              Hard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;