import React from "react";

const ApplicationCardSkeleton = () => (
  <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card animate-pulse">
    <div className="flex justify-between gap-4">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-40 rounded bg-bg-soft" />
          <div className="h-4 w-24 rounded bg-bg-soft" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-bg-soft/70" />
          <div className="h-3 w-4/5 rounded bg-bg-soft/70" />
        </div>

        <div className="h-3 w-28 rounded bg-bg-soft" />
      </div>

      <div className="h-9 w-9 rounded-lg bg-bg-soft shrink-0" />
    </div>
  </div>
);

const InterviewDashboardSkeleton = () => {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[1400px] animate-pulse space-y-6 overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border-default pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded bg-bg-soft" />
          <div className="h-4 w-80 rounded bg-bg-soft/70" />
        </div>

        <div className="h-10 w-40 rounded-lg bg-bg-soft" />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <ApplicationCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default InterviewDashboardSkeleton;