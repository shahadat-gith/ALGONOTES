import React from "react";

const NoteDetailsSkeleton = () => {
  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-pulse select-none">
      
      {/* 1. Upper Navigation Header Bar Wireframe */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
        {/* Back Button Placeholder */}
        <div className="h-9 w-16 bg-[var(--bg-soft)] rounded-xl" />

        {/* Right Header Status Badges & Action Group */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-12 bg-[var(--bg-soft)] rounded-md" />
          <div className="h-6 w-14 bg-[var(--bg-soft)] rounded-md" />
          <div className="h-9 w-20 bg-[var(--bg-soft)] rounded-xl" />
        </div>
      </div>

      {/* 2. Main Two-Column Structure Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Problem Details Sticky Shell Container */}
        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-6">
            
            {/* Header Area */}
            <div className="border-b border-[var(--border-default)] pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3.5 bg-[var(--bg-soft)] rounded w-20" />
                <div className="h-5 bg-[var(--bg-soft)] rounded-md w-14" />
              </div>
              <div className="h-7 bg-[var(--bg-soft)] rounded-lg w-3/4" />
            </div>

            {/* Problem Description Area */}
            <div className="space-y-2">
              <div className="h-4 bg-[var(--border-strong)]/20 rounded w-28 mb-3" />
              <div className="h-3.5 bg-[var(--bg-soft)] rounded w-full" />
              <div className="h-3.5 bg-[var(--bg-soft)] rounded w-11/12" />
              <div className="h-3.5 bg-[var(--bg-soft)] rounded w-4/5" />
            </div>

            {/* Constraints Block */}
            <div className="space-y-3">
              <div className="h-4 bg-[var(--border-strong)]/20 rounded w-24" />
              <div className="rounded-xl bg-[var(--bg-soft)] p-4 space-y-2">
                <div className="h-3 bg-[var(--border-strong)]/20 rounded w-2/3" />
                <div className="h-3 bg-[var(--border-strong)]/20 rounded w-1/2" />
              </div>
            </div>

            {/* Examples Blocks */}
            <div className="space-y-3">
              <div className="h-4 bg-[var(--border-strong)]/20 rounded w-20" />
              <div className="rounded-xl border border-[var(--border-default)] p-4 space-y-2 bg-[var(--bg-soft)]">
                <div className="h-3 bg-[var(--border-strong)]/20 rounded w-20" />
                <div className="h-3.5 bg-[var(--border-strong)]/20 rounded w-1/3" />
                <div className="h-3.5 bg-[var(--border-strong)]/20 rounded w-1/4" />
              </div>
            </div>

            {/* Expected Complexity Layout (Matches your recent code down bottom) */}
            <div className="space-y-3">
              <div className="h-4 bg-[var(--border-strong)]/20 rounded w-36" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-11 bg-[var(--bg-soft)] rounded-xl border border-[var(--border-default)]" />
                <div className="h-11 bg-[var(--bg-soft)] rounded-xl border border-[var(--border-default)]" />
              </div>
            </div>
            
          </div>
        </aside>

        {/* RIGHT COLUMN: Scrolling Main AI Note Blocks */}
        <main className="space-y-6 lg:col-span-7">
          
          {/* Summary Block Wireframe */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-3">
            <div className="h-4.5 bg-[var(--border-strong)]/20 rounded w-32 mb-1" />
            <div className="h-3.5 bg-[var(--bg-soft)] rounded w-full" />
            <div className="h-3.5 bg-[var(--bg-soft)] rounded w-11/12" />
          </div>

          {/* Intuition Block Wireframe */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-3">
            <div className="h-4.5 bg-[var(--border-strong)]/20 rounded w-24 mb-1" />
            <div className="h-3.5 bg-[var(--bg-soft)] rounded w-full" />
            <div className="h-3.5 bg-[var(--bg-soft)] rounded w-[95%]" />
          </div>

          {/* Brute Force Approach Block Wireframe */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="h-4.5 bg-[var(--border-strong)]/20 rounded w-44" />
            <div className="space-y-2">
              <div className="h-3.5 bg-[var(--bg-soft)] rounded w-full" />
              <div className="h-3.5 bg-[var(--bg-soft)] rounded w-5/6" />
            </div>
            {/* Mocking Code Block Terminal Window */}
            <div className="h-36 bg-[var(--bg-soft)] rounded-xl w-full" />
          </div>

          {/* Optimal Approach Block Wireframe */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="h-4.5 bg-[var(--border-strong)]/20 rounded w-40" />
            <div className="space-y-2">
              <div className="h-3.5 bg-[var(--bg-soft)] rounded w-full" />
              <div className="h-3.5 bg-[var(--bg-soft)] rounded w-11/12" />
            </div>
            {/* Mocking Code Block Terminal Window */}
            <div className="h-48 bg-[var(--bg-soft)] rounded-xl w-full" />
          </div>

          {/* Matrix / Execution Dry Run Table Block Wireframe */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-3">
            <div className="h-4.5 bg-[var(--border-strong)]/20 rounded w-36 mb-1" />
            <div className="h-24 bg-[var(--bg-soft)] rounded-xl w-full" />
          </div>

          {/* Complexity Analysis Block Wireframe */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-3">
            <div className="h-4.5 bg-[var(--border-strong)]/20 rounded w-40 mb-1" />
            <div className="h-3.5 bg-[var(--bg-soft)] rounded w-3/4" />
            <div className="h-3.5 bg-[var(--bg-soft)] rounded w-2/3" />
          </div>

        </main>
      </div>
    </div>
  );
};

export default NoteDetailsSkeleton;