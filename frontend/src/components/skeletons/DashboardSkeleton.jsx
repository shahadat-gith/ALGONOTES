const DashboardSkeleton = () => {
  return (
    <div className="w-full space-y-8 animate-pulse select-none">
     

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-bg-soft rounded-xs w-24" />
                <div className="h-8 bg-bg-soft rounded-xs w-14" />
                <div className="h-3 bg-bg-soft rounded-xs w-40" />
              </div>
              <div className="h-14 w-14 rounded-xl bg-bg-soft" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-xl shadow-card">
        <div className="p-5 border-b border-border-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-bg-soft" />
              <div className="h-4 bg-bg-soft rounded-xs w-44" />
            </div>
            <div className="h-3.5 bg-bg-soft rounded-xs w-16" />
          </div>
        </div>
        <div className="divide-y divide-border-default/60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-bg-soft rounded-xs w-36" />
                  <div className="h-4 bg-bg-soft rounded-sm w-10" />
                </div>
                <div className="h-4 bg-bg-soft rounded-xs w-3/4" />
                <div className="h-3 bg-bg-soft rounded-xs w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
