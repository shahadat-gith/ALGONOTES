import React from "react";

const TheoryEditorSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-bg-base flex flex-col font-sans animate-pulse select-none">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1 h-screen max-h-screen overflow-hidden space-y-4">
        
        {/* 1. Header Skeleton Area */}
        <div className="flex items-center justify-between border-b border-border-default pb-4 w-full">
          <div className="space-y-2 flex-1">
            {/* Topic Title Placeholder */}
            <div className="h-6 bg-bg-soft rounded-md w-1/3 max-w-sm" />
            {/* Status Info Subtext Line */}
            <div className="h-3.5 bg-bg-soft/70 rounded-xs w-48" />
          </div>
          {/* Action Save Button Placeholder */}
          <div className="h-9 bg-bg-soft rounded-md w-24 shrink-0" />
        </div>

        {/* 2. Toolbar Framework Placeholder Row */}
        <div className="w-full h-11 bg-bg-surface border border-border-default rounded-t-md flex items-center px-4 gap-4">
          <div className="h-5 bg-bg-soft rounded-xs w-16" />
          <div className="w-px h-4 bg-border-default" />
          <div className="flex gap-2.5">
            <div className="w-6 h-6 bg-bg-soft rounded-xs" />
            <div className="w-6 h-6 bg-bg-soft rounded-xs" />
            <div className="w-6 h-6 bg-bg-soft rounded-xs" />
          </div>
          <div className="w-px h-4 bg-border-default" />
          <div className="h-5 bg-bg-soft rounded-xs w-20" />
        </div>

        {/* 3. Main Text Content Editable Canvas Container Area */}
        <div className="w-full flex-1 rounded-b-md border-x border-b border-border-default bg-bg-surface p-6 md:p-10 min-h-0 mb-4 flex flex-col space-y-4">
          <div className="h-4 bg-bg-soft/80 rounded-xs w-[75%] max-w-2xl" />
          <div className="h-4 bg-bg-soft/60 rounded-xs w-[40%] max-w-sm" />
          <div className="space-y-2.5 pt-4">
            <div className="h-3 bg-bg-soft/50 rounded-xs w-full" />
            <div className="h-3 bg-bg-soft/50 rounded-xs w-[95%]" />
            <div className="h-3 bg-bg-soft/50 rounded-xs w-[92%]" />
            <div className="h-3 bg-bg-soft/50 rounded-xs w-[65%]" />
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-3 bg-bg-soft/50 rounded-xs w-[98%]" />
            <div className="h-3 bg-bg-soft/50 rounded-xs w-[88%]" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TheoryEditorSkeleton;