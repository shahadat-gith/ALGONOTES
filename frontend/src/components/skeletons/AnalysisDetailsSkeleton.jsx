import React from "react";

const CardSkeleton = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card ${className}`}
  >
    {children}
  </div>
);

const Line = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${height} ${width} rounded bg-bg-soft`} />
);

const Badge = ({ width = "w-20" }) => (
  <div className={`h-6 ${width} rounded-full bg-bg-soft`} />
);

const TopicCardSkeleton = () => (
  <CardSkeleton>
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-1 items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-bg-soft shrink-0" />

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Line width="w-44" />
            <Badge />
          </div>

          <div className="space-y-2">
            <Line />
            <Line width="w-4/5" />
          </div>
        </div>
      </div>

      <div className="h-9 w-24 rounded-lg bg-bg-soft shrink-0" />
    </div>
  </CardSkeleton>
);

const AnalysisDetailsSkeleton = () => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1400px] animate-pulse space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      {/* Company / Role */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <CardSkeleton key={item}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-bg-soft" />

              <div className="space-y-2 flex-1">
                <Line width="w-24" height="h-3" />
                <Line width="w-40" height="h-5" />
              </div>
            </div>
          </CardSkeleton>
        ))}
      </div>

      {/* Summary */}
      <CardSkeleton className="space-y-5">
        <Line width="w-36" />

        <div className="space-y-3">
          <Line />
          <Line />
          <Line width="w-5/6" />
          <Line width="w-2/3" />
        </div>
      </CardSkeleton>

      {/* Analysis Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <CardSkeleton key={item}>
            <Line width="w-28" />

            <div className="mt-5 space-y-3">
              <Line />
              <Line width="w-4/5" />
              <Line width="w-2/3" />
            </div>
          </CardSkeleton>
        ))}
      </div>

      {/* Recommendations */}
      <CardSkeleton>
        <Line width="w-40" />

        <div className="mt-5 space-y-3">
          <Line />
          <Line width="w-5/6" />
          <Line width="w-4/5" />
          <Line width="w-2/3" />
        </div>
      </CardSkeleton>

      {/* Topics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <Line width="w-52" height="h-5" />
          <Badge width="w-16" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <TopicCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetailsSkeleton;