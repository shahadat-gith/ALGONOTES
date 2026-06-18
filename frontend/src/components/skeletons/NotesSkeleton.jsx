import React from "react";

const NotesSkeleton = () => {
  // Simulates a realistic page chunk layout block containing multiple content blocks
  const skeletonCards = Array.from({ length: 4 });

  return (
    <div className="w-full space-y-6 animate-pulse select-none">
      
      {/* 1. Header Typography Skeleton Block */}
      <div className="flex flex-col gap-4 border-b border-border-default pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-5.5 bg-bg-soft rounded-xs w-32" />
          <div className="h-3.5 bg-bg-soft rounded-xs w-64 max-w-full" />
        </div>
        {/* Create Note Button Placeholder */}
        <div className="h-8.5 bg-bg-soft rounded-md w-28 shrink-0 hidden sm:block" />
      </div>

      {/* 2. Search Bar Input Component Wireframe */}
      <div className="h-10 w-full bg-bg-soft/40 border border-border-default rounded-md" />

      {/* 3. Meta Data Summary Row & Top-Right Pagination Wireframes */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        {/* Left Hand: Running Total Count */}
        <div className="h-3 bg-bg-soft rounded-xs w-40" />
        
        {/* Right Hand: Shared Pagination Layout Placeholder Wrapper */}
        <div className="flex items-center gap-3">
          <div className="h-3 bg-bg-soft rounded-xs w-16" />
          <div className="flex gap-1.5">
            <div className="w-6 h-6 bg-bg-soft rounded-sm border border-border-default" />
            <div className="w-6 h-6 bg-bg-soft rounded-sm border border-border-default" />
          </div>
        </div>
      </div>

      {/* 4. Complete One-Card-Per-Row Grid Flex Stack List Loader Block */}
      <div className="flex flex-col gap-4 w-full">
        {skeletonCards.map((_, index) => (
          <div 
            key={index} 
            className="w-full bg-bg-surface border border-border-default rounded-xl p-5 flex flex-col justify-between gap-4 relative shadow-xs"
          >
            {/* Inner Skeleton Top Row: Platform, Difficulty & Status Metadata Pill Shapes */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 w-full">
                <div className="h-3.5 bg-bg-soft rounded-xs w-16" />
                <span className="text-text-light/20 select-none">•</span>
                <div className="h-5 bg-bg-soft/80 rounded-sm w-14" />
              </div>
              <div className="h-5 bg-bg-soft/80 rounded-sm w-12 shrink-0" />
            </div>

            {/* Inner Skeleton Center Row: Title Typography String Loader & Paragraph lines */}
            <div className="space-y-2.5 w-full">
              <div className="h-4 bg-bg-soft rounded-xs w-[45%] max-w-sm" />
              <div className="space-y-1.5">
                <div className="h-3 bg-bg-soft/70 rounded-xs w-[85%] max-w-4xl" />
                <div className="h-3 bg-bg-soft/70 rounded-xs w-[60%] max-w-2xl" />
              </div>
            </div>

            {/* Inner Skeleton Bottom Row: Footer Meta Data (Left) and Text Actions Layout (Right) */}
            <div className="border-t border-border-default/60 pt-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
              
              {/* Technical Code Language Stack & Timestamps (Left Alignment Wireframe) */}
              <div className="flex items-center gap-3">
                <div className="h-4 bg-bg-soft/60 rounded-sm border border-border-default/40 w-14" />
                <div className="h-3.5 bg-bg-soft rounded-xs w-20" />
              </div>

              {/* Read, Edit, and Delete Text Link Controls Shape Placements (Right Alignment Wireframe) */}
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

export default NotesSkeleton;