import React from "react";

const ProblemDetailsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse select-none">
      
      {/* 1. Upper Action Buttons Tray Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 justify-end">
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          {/* Bookmark Button Placeholder */}
          <div className="h-9 bg-[var(--bg-soft)] rounded-xl w-24" />
          {/* Revision Button Placeholder */}
          <div className="h-9 bg-[var(--bg-soft)] rounded-xl w-36" />
          {/* Edit Button Placeholder */}
          <div className="h-9 bg-[var(--bg-soft)] rounded-xl w-16" />
          {/* Delete Button Placeholder */}
          <div className="h-9 bg-[var(--bg-soft)] rounded-xl w-20" />
        </div>
      </div>

      {/* 2. Core Problem Metadata Card Skeleton */}
      <div className="p-6 bg-white border border-[var(--border-default)]/50 rounded-2xl shadow-sm space-y-4">
        {/* Platform & Date Subtitle Strings */}
        <div className="space-y-2">
          <div className="h-3 bg-[var(--bg-soft)] rounded w-1/3 sm:w-1/4" />
          
          {/* Problem Title Headline Line */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between pt-1">
            <div className="h-7 bg-[var(--bg-soft)] rounded-lg w-2/3 max-w-full" />
            <div className="h-3 bg-[var(--bg-soft)] rounded w-24 shrink-0" />
          </div>
        </div>

        {/* Difficulty & Language Status Badges Row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 bg-[var(--bg-soft)] rounded-md w-16" />
          <div className="h-5 bg-[var(--bg-soft)] rounded-md w-12" />
        </div>

        {/* Horizontal Categorization Topic Tags Pill List */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <div className="h-6 bg-[var(--bg-soft)] rounded-md w-20" />
          <div className="h-6 bg-[var(--bg-soft)] rounded-md w-16" />
          <div className="h-6 bg-[var(--bg-soft)] rounded-md w-24" />
        </div>
      </div>

      {/* 3. Dark Terminal Code Block Viewport Skeleton */}
      <div className="bg-[#1e1e2e] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col h-72">
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-[#181825] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-neutral-800 rounded" />
            <div className="h-3 bg-neutral-800 rounded w-28" />
          </div>
          <div className="h-6 bg-neutral-800 rounded-md w-32" />
        </div>

        {/* Mock Code Blocks Segment */}
        <div className="p-5 space-y-3 flex-1 overflow-hidden">
          <div className="h-3 bg-neutral-800 rounded w-1/3" />
          <div className="h-3 bg-neutral-800 rounded w-2/3 pl-4" />
          <div className="h-3 bg-neutral-800 rounded w-1/2 pl-8" />
          <div className="h-3 bg-neutral-800 rounded w-4/5 pl-8" />
          <div className="h-3 bg-neutral-800 rounded w-1/4 pl-4" />
          <div className="h-3 bg-neutral-800 rounded w-1/3" />
        </div>
      </div>

    </div>
  );
};

export default ProblemDetailsSkeleton;