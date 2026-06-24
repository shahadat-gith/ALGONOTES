const LeetcodeSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse select-none">
      {/* Profile Header Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-bg-soft shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-bg-soft rounded-xs w-44" />
            <div className="h-3.5 bg-bg-soft rounded-xs w-28" />
            <div className="flex gap-3">
              <div className="h-3 bg-bg-soft rounded-xs w-20" />
              <div className="h-3 bg-bg-soft rounded-xs w-24" />
              <div className="h-3 bg-bg-soft rounded-xs w-16" />
            </div>
            <div className="flex gap-2">
              <div className="h-3 bg-bg-soft rounded-xs w-14" />
              <div className="h-3 bg-bg-soft rounded-xs w-14" />
              <div className="h-3 bg-bg-soft rounded-xs w-14" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-bg-soft rounded-xs w-20" />
              <div className="h-9 w-9 rounded-lg bg-bg-soft" />
            </div>
            <div className="mt-3">
              <div className="h-8 bg-bg-soft rounded-xs w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
        <div className="h-4 bg-bg-soft rounded-xs w-44 mb-5" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 bg-bg-soft rounded-xs w-10" />
                <div className="h-3 bg-bg-soft rounded-xs w-24" />
              </div>
              <div className="h-2.5 rounded-full bg-bg-soft overflow-hidden">
                <div className="h-full rounded-full bg-bg-soft/60" style={{ width: `${[60, 40, 25][i - 1]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contest + Skills Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
          <div className="h-4 bg-bg-soft rounded-xs w-36 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3.5 rounded-lg bg-bg-soft border border-border-default">
                <div className="h-2.5 bg-bg-soft/70 rounded-xs w-14 mb-2" />
                <div className="h-5 bg-bg-soft/70 rounded-xs w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
          <div className="h-4 bg-bg-soft rounded-xs w-24 mb-4" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-2.5 bg-bg-soft rounded-xs w-20 mb-2" />
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 bg-bg-soft rounded-sm w-16" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
        <div className="h-4 bg-bg-soft rounded-xs w-24 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-soft border border-border-default">
              <div className="h-10 w-10 rounded-full bg-bg-soft/70" />
              <div className="h-2.5 bg-bg-soft/70 rounded-xs w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* Languages + Submissions Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
          <div className="h-4 bg-bg-soft rounded-xs w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-soft border border-border-default">
                <div className="h-4 bg-bg-soft/70 rounded-xs w-20" />
                <div className="h-5 bg-bg-soft/70 rounded-sm w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
          <div className="h-4 bg-bg-soft rounded-xs w-32 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-soft border border-border-default">
                <div className="flex-1 mr-3 space-y-1.5">
                  <div className="h-4 bg-bg-soft/70 rounded-xs w-3/4" />
                  <div className="h-2.5 bg-bg-soft/60 rounded-xs w-1/3" />
                </div>
                <div className="h-5 bg-bg-soft/70 rounded-sm w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetcodeSkeleton;
