import React from "react";

const TheoriesSkeleton = () => {
  const skeletonCards = Array.from({ length: 4 });

  return (
    <div className="w-full space-y-6 animate-pulse select-none">
      {/* 1. Header Control Top-Right Pagination Loading Grid Placeholder */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <div className="h-3 bg-bg-soft rounded-xs w-36" />
        <div className="flex items-center gap-3">
          <div className="h-3 bg-bg-soft rounded-xs w-16" />
          <div className="flex gap-1.5">
            <div className="w-6 h-6 bg-bg-soft rounded-sm border border-border-default" />
            <div className="w-6 h-6 bg-bg-soft rounded-sm border border-border-default" />
          </div>
        </div>
      </div>

      {/* 2. List Card Row Skeleton Flow Stack */}
      <div className="flex flex-col gap-4 w-full">
        {skeletonCards.map((_, index) => (
          <div 
            key={index} 
            className="w-full bg-bg-surface border border-border-default rounded-xl p-5 flex flex-col justify-between gap-4 relative shadow-xs"
          >
            {/* Top Pill Shape Badge Layer */}
            <div className="flex items-center justify-between gap-2">
              <div className="h-5 bg-bg-soft/80 rounded-sm w-14" />
            </div>

            {/* Central Main Title & Snippet Loader */}
            <div className="space-y-2.5 w-full">
              <div className="h-4 bg-bg-soft rounded-xs w-[35%] max-w-sm" />
              <div className="space-y-1.5">
                <div className="h-3 bg-bg-soft/70 rounded-xs w-[80%] max-w-4xl" />
                <div className="h-3 bg-bg-soft/70 rounded-xs w-[55%] max-w-2xl" />
              </div>
            </div>

            {/* Footer Control Info Block Section Split Grid */}
            <div className="border-t border-border-default/60 pt-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
              {/* Technical Meta (Left Side) */}
              <div className="flex items-center gap-3">
                <div className="h-4 bg-bg-soft/60 rounded-sm border border-border-default/40 w-24" />
                <span className="text-text-light/20 select-none">•</span>
                <div className="h-3.5 bg-bg-soft rounded-xs w-20" />
              </div>

              {/* Action Link Text Placeholders (Right Side) */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <div className="h-7.5 bg-bg-soft/80 rounded-md w-16" />
                <div className="h-7.5 bg-bg-soft/80 rounded-md w-14" />
                <div className="h-7.5 bg-bg-soft/80 rounded-md w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheoriesSkeleton;