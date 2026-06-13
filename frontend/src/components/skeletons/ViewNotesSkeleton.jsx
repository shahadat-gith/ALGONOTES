import React from "react";

const ViewNotesSkeleton = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse select-none">
      
      {/* 1. Upper Actions Control Header Deck */}
      <div className="flex items-center justify-end gap-2">
        {/* Status Pill Wireframe */}
        <div className="h-6 bg-[var(--bg-soft)] rounded-full w-16" />
        {/* Action Button Trigger Blueprint */}
        <div className="h-8 bg-[var(--bg-soft)] rounded-lg w-16" />
      </div>

      {/* 2. Sequential Technical Content Block Layout List */}
      <div className="space-y-6">
        
        {/* Sections 1 & 2: Content Block Viewers (Brute & Optimal Approximations) */}
        {[1, 2].map((idx) => (
          <div 
            key={idx} 
            className="p-6 bg-white border border-[var(--border-default)]/50 rounded-2xl space-y-4 shadow-sm"
          >
            {/* Section Header */}
            <div className="h-4 bg-[var(--bg-soft)] rounded w-1/4 mb-2 pb-1" />
            
            {/* Mock text paragraphs / code box block items */}
            <div className="space-y-2.5">
              <div className="h-3 bg-[var(--bg-soft)] rounded w-full" />
              <div className="h-3 bg-[var(--bg-soft)] rounded w-11/12" />
              <div className="h-24 bg-[var(--bg-soft)]/60 rounded-xl w-full border border-[var(--border-default)]/20" /> {/* Simulates code blocks */}
            </div>
          </div>
        ))}

        {/* Section 3: NoteAlgorithmViewer Sequential Block Lines */}
        <div className="p-6 bg-white border border-[var(--border-default)]/50 rounded-2xl space-y-4 shadow-sm">
          <div className="h-4 bg-[var(--bg-soft)] rounded w-1/4 mb-2" />
          
          <div className="space-y-3.5">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-3 items-start">
                {/* Step Index Circle Marker */}
                <div className="w-5 h-5 bg-[var(--bg-soft)] rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1 pt-0.5">
                  <div className="h-3 bg-[var(--bg-soft)] rounded w-1/3" />
                  <div className="h-2.5 bg-[var(--bg-soft)] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: NoteDryRunViewer Operational Table Simulation */}
        <div className="p-6 bg-white border border-[var(--border-default)]/50 rounded-2xl space-y-4 shadow-sm">
          <div className="h-4 bg-[var(--bg-soft)] rounded w-1/3 mb-2" />
          
          {/* Multi-Row Execution Simulation Blocks */}
          <div className="border border-[var(--border-default)]/40 rounded-xl overflow-hidden divide-y divide-[var(--border-default)]/30">
            <div className="h-9 bg-[var(--bg-soft)] w-full" /> {/* Table header line */}
            {[1, 2, 3].map((row) => (
              <div key={row} className="p-3 grid grid-cols-4 gap-4 items-center">
                <div className="h-2.5 bg-[var(--bg-soft)] rounded w-1/2" />
                <div className="h-3 bg-[var(--bg-soft)] rounded w-3/4" />
                <div className="h-2.5 bg-[var(--bg-soft)] rounded w-1/2" />
                <div className="h-2.5 bg-[var(--bg-soft)] rounded w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: NoteEdgeCaseViewer Panel Grid Blocks */}
        <div className="p-6 bg-white border border-[var(--border-default)]/50 rounded-2xl space-y-4 shadow-sm">
          <div className="h-4 bg-[var(--bg-soft)] rounded w-1/4 mb-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div key={item} className="p-4 bg-[var(--bg-soft)]/30 border border-[var(--border-default)]/40 rounded-xl space-y-2">
                <div className="h-3 bg-[var(--bg-soft)] rounded w-1/2 font-bold" />
                <div className="h-2.5 bg-[var(--bg-soft)] rounded w-5/6" />
                <div className="h-2.5 bg-[var(--bg-soft)] rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ViewNotesSkeleton;