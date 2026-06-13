import React from "react";

const ProblemDetailsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse select-none">
      
      {/* =======================================================
          CONTAINER 1 : INTEGRATED TERMINAL CARD (HEADER + CODE)
      ======================================================== */}
      <div className="bg-[#1e1e2e] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar Skeleton */}
        <div className="h-14 px-4 bg-[#181825] border-b border-neutral-800 flex items-center justify-between">
          {/* Left: Filename icon & name text string */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-neutral-800/80 rounded" />
            <div className="h-3 bg-neutral-800/80 rounded w-24" />
          </div>

          {/* Center: Main title placeholder string (Hidden on mobile) */}
          <div className="h-4 bg-neutral-800/80 rounded w-48 hidden md:block" />

          {/* Right: Inline actions tray mini placeholders */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-800/80 rounded-lg" />
            <div className="w-7 h-7 bg-neutral-800/80 rounded-lg" />
            <div className="w-7 h-7 bg-neutral-800/80 rounded-lg" />
            <div className="w-7 h-7 bg-neutral-800/80 rounded-lg" />
          </div>
        </div>

        {/* Code Block Content Skeleton */}
        <div className="min-h-[450px] p-6 space-y-4 bg-[#1e1e2e]">
          <div className="h-3 bg-neutral-800 rounded w-1/4" />
          <div className="h-3 bg-neutral-800 rounded w-2/3 pl-4" />
          <div className="h-3 bg-neutral-800 rounded w-1/2 pl-8" />
          <div className="h-3 bg-neutral-800 rounded w-3/4 pl-8" />
          <div className="h-3 bg-neutral-800 rounded w-1/3 pl-4" />
          <div className="h-3 bg-neutral-800 rounded w-5/12 pl-4" />
          <div className="h-3 bg-neutral-800 rounded w-1/4" />
        </div>

        {/* =======================================================
            CONTAINER 2 : CONNECTED METADATA SKELETON PANEL
        ======================================================== */}
        <div className="border-t border-neutral-800 bg-[#181825] p-6 space-y-6">
          
          <div className="space-y-3">
            {/* Properties section sub-header label text line */}
            <div className="h-3 bg-neutral-800/60 rounded w-28" />
            
            {/* 5-Column Responsive Matrix Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              
              {/* Difficulty Card Placeholder */}
              <div className="bg-[#1e1e2e] border border-neutral-800/60 rounded-xl p-3 space-y-2">
                <div className="h-2.5 bg-neutral-800/70 rounded w-12" />
                <div className="h-5 bg-neutral-800/70 rounded-md w-16" />
              </div>

              {/* Language Card Placeholder */}
              <div className="bg-[#1e1e2e] border border-neutral-800/60 rounded-xl p-3 space-y-2.5">
                <div className="h-2.5 bg-neutral-800/70 rounded w-14" />
                <div className="h-4 bg-neutral-800/70 rounded w-10" />
              </div>

              {/* Platform Card Placeholder */}
              <div className="bg-[#1e1e2e] border border-neutral-800/60 rounded-xl p-3 space-y-2.5">
                <div className="h-2.5 bg-neutral-800/70 rounded w-14" />
                <div className="h-4 bg-neutral-800/70 rounded w-16" />
              </div>

              {/* Topics Card Placeholder (Stretches across 2 columns) */}
              <div className="col-span-2 md:col-span-2 bg-[#1e1e2e] border border-neutral-800/60 rounded-xl p-3 space-y-2.5">
                <div className="h-2.5 bg-neutral-800/70 rounded w-12" />
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-4 bg-neutral-800/70 rounded w-14" />
                  <div className="h-4 bg-neutral-800/70 rounded w-20" />
                  <div className="h-4 bg-neutral-800/70 rounded w-12" />
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Timestamp & Source Link Footer Strip */}
          <div className="pt-4 border-t border-neutral-800/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-3 bg-neutral-800/60 rounded w-40" />
            <div className="h-8 bg-neutral-800/60 rounded-lg w-36" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProblemDetailsSkeleton;