import React from "react";

const NoteDetailsSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse select-none">
      
      {/* 1. Upper Navigation Header Bar Wireframe */}
      <div className="flex items-center justify-between border-b border-border-default pb-5">
        {/* Back Button Placeholder */}
        <div className="h-9 w-16 bg-bg-soft rounded-sm border border-border-default/40" />

        {/* Right Header Status Badges & Action Group */}
        <div className="flex items-center gap-3.5">
          <div className="h-5.5 w-12 bg-bg-soft rounded-xs" />
          <div className="h-5.5 w-14 bg-bg-soft rounded-xs" />
          <div className="h-9 w-24 bg-bg-soft rounded-sm" />
        </div>
      </div>

      {/* 2. Flat Full-Width Segmented Tab Controller Rail Bar Wireframe */}
      <div className="flex items-center gap-1 bg-bg-soft/40 p-1 rounded-md border border-border-default/60 w-full overflow-x-auto">
        <div className="h-8 w-36 bg-bg-surface border border-border-default rounded-sm shrink-0" />
        <div className="h-8 w-40 bg-bg-soft/20 rounded-sm shrink-0" />
        <div className="h-8 w-32 bg-bg-soft/20 rounded-sm shrink-0" />
        <div className="h-8 w-32 bg-bg-soft/20 rounded-sm shrink-0" />
        <div className="h-8 w-36 bg-bg-soft/20 rounded-sm shrink-0" />
      </div>

      {/* 3. Dynamic Render Area Content Shell (100% Structural Width Box) */}
      <main className="w-full min-h-[50vh]">
        
        {/* Simulating the default Tab 1 Content Block: ProblemDetails Wireframe Layout */}
        <div className="bg-bg-surface border border-border-default rounded-md p-6 space-y-6 shadow-card w-full">
          
          {/* Internal Problem Header */}
          <div className="border-b border-border-default pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 bg-bg-soft rounded-xs w-20" />
              <div className="h-4.5 bg-bg-soft rounded-xs w-14" />
            </div>
            <div className="h-5.5 bg-bg-soft rounded-xs w-1/3" />
          </div>

          {/* Problem Body Content Area Description lines */}
          <div className="space-y-2.5">
            <div className="h-3 bg-border-strong/20 rounded-xs w-24 mb-1" />
            <div className="h-3.5 bg-bg-soft rounded-xs w-full" />
            <div className="h-3.5 bg-bg-soft rounded-xs w-11/12" />
            <div className="h-3.5 bg-bg-soft rounded-xs w-4/5" />
          </div>

          {/* Constraints Block footprint */}
          <div className="space-y-3">
            <div className="h-3 bg-border-strong/20 rounded-xs w-20" />
            <div className="rounded-sm bg-bg-soft/40 border border-border-default/60 p-4 space-y-2">
              <div className="h-2.5 bg-border-strong/20 rounded-xs w-2/3" />
              <div className="h-2.5 bg-border-strong/20 rounded-xs w-1/2" />
            </div>
          </div>

          {/* Example Test Cases Block wireframe */}
          <div className="space-y-3">
            <div className="h-3 bg-border-strong/20 rounded-xs w-16" />
            <div className="rounded-sm border border-border-default p-4 space-y-3 bg-bg-soft/20">
              <div className="h-3 bg-border-strong/20 rounded-xs w-16 border-b border-border-default/40 pb-4 w-full" />
              <div className="h-3 bg-border-strong/20 rounded-xs w-1/3 mt-1" />
              <div className="h-3 bg-border-strong/20 rounded-xs w-1/4" />
            </div>
          </div>

          {/* Expected Complexity Bottom Grid Indicators footprints */}
          <div className="space-y-3">
            <div className="h-3 bg-border-strong/20 rounded-xs w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-10 bg-bg-base rounded-sm border border-border-default" />
              <div className="h-10 bg-bg-base rounded-sm border border-border-default" />
            </div>
          </div>
          
        </div>

      </main>
    </div>
  );
};

export default NoteDetailsSkeleton;