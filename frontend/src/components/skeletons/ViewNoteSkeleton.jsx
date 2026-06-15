import React from "react";

const ViewNoteSkeleton = () => {
  // Simulates the stack of AI-generated content cards on the right side
  const skeletonCards = [1, 2, 3];

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-pulse">
      
      {/* 1. Top Action Utility Row Skeleton */}
      <div className="flex items-center justify-between border-b pb-4 border-[var(--border-default)]/40">
        {/* Back Button */}
        <div className="h-8 w-16 rounded-xl bg-[var(--bg-soft)]" />
        
        {/* Badges & Edit Button Group */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-12 rounded-full bg-[var(--bg-soft)]" />
          <div className="h-6 w-14 rounded-full bg-[var(--bg-soft)]" />
          <div className="h-9 w-24 rounded-xl bg-[var(--border-default)]" />
        </div>
      </div>

      {/* 2. Main Two-Column Structure Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT side: Problem Specifications (5 Columns Wide) */}
        <div className="lg:col-span-5 space-y-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm">
          
          {/* Platform Label & Title Banner */}
          <div className="space-y-3 border-b border-[var(--border-default)]/40 pb-4">
            <div className="flex gap-2">
              <div className="h-4 w-16 rounded bg-[var(--bg-soft)]" />
              <div className="h-4 w-12 rounded bg-[var(--bg-soft)]" />
            </div>
            <div className="h-8 w-3/4 rounded-lg bg-[var(--border-default)]" />
          </div>

          {/* Runtime Complexity Badges Box */}
          <div className="h-12 w-full rounded-xl bg-[var(--bg-soft)]" />

          {/* Description Text Mock Lines */}
          <div className="space-y-2.5 pt-2">
            <div className="h-4 w-32 rounded bg-[var(--border-default)]" />
            <div className="h-4 w-full rounded bg-[var(--bg-soft)]" />
            <div className="h-4 w-full rounded bg-[var(--bg-soft)]" />
            <div className="h-4 w-11/12 rounded bg-[var(--bg-soft)]" />
          </div>

          {/* Constraints Card Block */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-default)]/40">
            <div className="h-4 w-28 rounded bg-[var(--border-default)]" />
            <div className="rounded-xl bg-[var(--bg-soft)] p-4 space-y-2">
              <div className="h-3.5 w-3/4 rounded bg-[var(--border-default)]/50" />
              <div className="h-3.5 w-1/2 rounded bg-[var(--border-default)]/50" />
            </div>
          </div>
        </div>

        {/* RIGHT side: AI Document Streams (7 Columns Wide) */}
        <div className="lg:col-span-7 space-y-6">
          {skeletonCards.map((cardId) => (
            <div 
              key={cardId} 
              className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4"
            >
              {/* Card Title Line */}
              <div className="border-b pb-2 border-[var(--border-default)]/40">
                <div className="h-5 w-40 rounded-md bg-[var(--border-default)]" />
              </div>

              {/* Card Body Subheading & Inner Content Paragraphs */}
              <div className="space-y-3 pt-1">
                <div className="h-4 w-28 rounded bg-[var(--border-default)]/60" />
                <div className="h-4 w-full rounded bg-[var(--bg-soft)]" />
                <div className="h-4 w-full rounded bg-[var(--bg-soft)]" />
                <div className="h-4 w-4/5 rounded bg-[var(--bg-soft)]" />
              </div>

              {/* Extra visualization content blocks for specific blocks (e.g. Optimal Strategy code simulation) */}
              {cardId === 2 && (
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] p-4 space-y-2 mt-2">
                  <div className="h-3 w-5/6 rounded bg-[var(--border-default)]" />
                  <div className="h-3 w-4/5 rounded bg-[var(--border-default)]" />
                  <div className="h-3 w-2/3 rounded bg-[var(--border-default)]" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ViewNoteSkeleton;