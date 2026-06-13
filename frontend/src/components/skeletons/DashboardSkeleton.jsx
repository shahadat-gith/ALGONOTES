import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-pulse select-none">
      
      {/* 1. Metric Cards Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Problems Added Skeleton Card */}
        <div className="p-5 bg-white border border-[var(--border-default)]/40 rounded-2xl flex items-center justify-between h-[90px]">
          <div className="space-y-2 flex-1">
            <div className="h-2.5 bg-[var(--bg-soft)] rounded w-1/2" />
            <div className="h-6 bg-[var(--bg-soft)] rounded w-1/3" />
          </div>
          <div className="w-11 h-11 bg-[var(--bg-soft)] rounded-xl" />
        </div>

        {/* AI Notes Skeleton Card */}
        <div className="p-5 bg-white border border-[var(--border-default)]/40 rounded-2xl flex items-center justify-between h-[90px]">
          <div className="space-y-2 flex-1">
            <div className="h-2.5 bg-[var(--bg-soft)] rounded w-1/2" />
            <div className="h-6 bg-[var(--bg-soft)] rounded w-1/3" />
          </div>
          <div className="w-11 h-11 bg-[var(--bg-soft)] rounded-xl" />
        </div>

        {/* Difficulty Breakdown Double-Wide Card */}
        <div className="p-5 bg-white border border-[var(--border-default)]/40 rounded-2xl sm:col-span-2 flex flex-col justify-center space-y-3 h-[90px]">
          <div className="h-2.5 bg-[var(--bg-soft)] rounded w-1/4" />
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-8 bg-[var(--bg-soft)] rounded-lg" />
            <div className="flex-1 h-8 bg-[var(--bg-soft)] rounded-lg" />
            <div className="flex-1 h-8 bg-[var(--bg-soft)] rounded-lg" />
          </div>
        </div>
      </div>

      {/* 2. Contribution Grid Card Skeleton */}
      <div className="p-5 bg-white border border-[var(--border-default)]/40 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-default)]/30 pb-3">
          <div className="h-3 bg-[var(--bg-soft)] rounded w-1/4" />
          <div className="h-2.5 bg-[var(--bg-soft)] rounded w-16" />
        </div>
        {/* Simulates the horizontal 7-row matrix landscape block */}
        <div className="w-full h-24 bg-[var(--bg-soft)]/60 rounded-xl border border-[var(--border-default)]/20" />
      </div>

      {/* 3. Recent Activity Streams Stack/Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stream A: Recent Notes Study Blocks Skeleton */}
        <div className="bg-white border border-[var(--border-default)]/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-default)]/30 pb-3">
            <div className="flex items-center gap-2 w-1/3">
              <div className="w-4 h-4 bg-[var(--bg-soft)] rounded-md" />
              <div className="h-3 bg-[var(--bg-soft)] rounded flex-1" />
            </div>
            <div className="h-2.5 bg-[var(--bg-soft)] rounded w-12" />
          </div>
          {/* List Item Skeleton Rows */}
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <div className="w-8 h-8 bg-[var(--bg-soft)] rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-[var(--bg-soft)] rounded w-2/3" />
                    <div className="h-2 bg-[var(--bg-soft)] rounded w-1/2" />
                  </div>
                </div>
                <div className="h-2 bg-[var(--bg-soft)] rounded w-8 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Stream B: Recent Problems Added Skeleton */}
        <div className="bg-white border border-[var(--border-default)]/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-default)]/30 pb-3">
            <div className="flex items-center gap-2 w-1/3">
              <div className="w-4 h-4 bg-[var(--bg-soft)] rounded-md" />
              <div className="h-3 bg-[var(--bg-soft)] rounded flex-1" />
            </div>
            <div className="h-2.5 bg-[var(--bg-soft)] rounded w-12" />
          </div>
          {/* List Item Skeleton Rows */}
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <div className="w-8 h-8 bg-[var(--bg-soft)] rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-[var(--bg-soft)] rounded w-3/4" />
                    <div className="h-2 bg-[var(--bg-soft)] rounded w-1/3" />
                  </div>
                </div>
                <div className="h-2 bg-[var(--bg-soft)] rounded w-8 shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardSkeleton;