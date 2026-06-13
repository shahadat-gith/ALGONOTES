import React from "react";

const NotesSkeleton = () => {
  // Simulates a realistic vertical stack feed of 3 active note items
  const skeletonCards = Array.from({ length: 3 });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse select-none">
      
      {/* 1. Header Typography Skeleton Block */}
      <div className="space-y-2">
        <div className="h-7 bg-[var(--bg-soft)] rounded-lg w-64" />
        <div className="h-4 bg-[var(--bg-soft)] rounded w-96 max-w-full" />
      </div>

      {/* 2. NotesSummary Micro Counters Row Wireframe */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((idx) => (
          <div 
            key={idx} 
            className="p-4 bg-white border border-[var(--border-default)]/40 rounded-2xl flex items-center gap-3.5 h-[76px]"
          >
            <div className="w-10 h-10 bg-[var(--bg-soft)] rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-2.5 bg-[var(--bg-soft)] rounded w-1/2" />
              <div className="h-5 bg-[var(--bg-soft)] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search Bar Input Component Wireframe */}
      <div className="h-10 w-full bg-[var(--bg-soft)] rounded-xl" />

      {/* 4. Vertical Notes Post Feed Cards List */}
      <div className="space-y-5">
        {skeletonCards.map((_, index) => (
          <div 
            key={index}
            className="p-5 bg-white border border-[var(--border-default)]/50 rounded-2xl space-y-4 shadow-sm"
          >
            {/* Card Top Title Bar Block */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2.5 flex-1">
                {/* Simulated Parent Problem Title */}
                <div className="h-4 bg-[var(--bg-soft)] rounded w-2/3 sm:w-1/3" />
                {/* Meta details (Difficulty tag line, etc.) */}
                <div className="flex gap-2">
                  <div className="h-4 bg-[var(--bg-soft)] rounded w-16" />
                  <div className="h-4 bg-[var(--bg-soft)] rounded w-12" />
                </div>
              </div>
              {/* Dynamic Status Pill Block (Draft vs Final Indicator) */}
              <div className="h-6 bg-[var(--bg-soft)] rounded-full w-16 shrink-0" />
            </div>

            {/* Simulated Note Summary Text Content Lines */}
            <div className="space-y-2 pt-1">
              <div className="h-3 bg-[var(--bg-soft)] rounded w-full" />
              <div className="h-3 bg-[var(--bg-soft)] rounded w-11/12" />
              <div className="h-3 bg-[var(--bg-soft)] rounded w-4/5" />
            </div>

            {/* Card Bottom Panel / Footer Tools Segment */}
            <div className="flex items-center justify-between border-t border-[var(--border-default)]/30 pt-3 mt-1">
              {/* Last edited clock text placeholder */}
              <div className="h-2.5 bg-[var(--bg-soft)] rounded w-24" />
              {/* Action utility triggers blueprint (Expand, View code, etc.) */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-[var(--bg-soft)] rounded-lg" />
                <div className="w-8 h-8 bg-[var(--bg-soft)] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NotesSkeleton;