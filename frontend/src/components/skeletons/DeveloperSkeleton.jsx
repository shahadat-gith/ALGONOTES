import React from "react";

const DeveloperSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse select-none">
      {/* Hero Bio Banner Section */}
      <div className="bg-white border border-[var(--border-default)]/40 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-[var(--bg-soft)] shrink-0" />
        <div className="space-y-2 flex-1 text-center sm:text-left w-full">
          <div className="h-5 bg-[var(--bg-soft)] rounded w-1/3 mx-auto sm:mx-0" />
          <div className="h-3 bg-[var(--bg-soft)] rounded w-1/4 mx-auto sm:mx-0" />
          <div className="h-2.5 bg-[var(--bg-soft)] rounded w-1/2 mx-auto sm:mx-0 pt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Social Grid & Contact info */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-[var(--border-default)]/40 rounded-2xl p-4 h-48" />
        </div>

        {/* Right Column - Tech Tree & Timelines */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[var(--border-default)]/40 rounded-2xl p-5 space-y-3">
            <div className="h-3 bg-[var(--bg-soft)] rounded w-1/4" />
            <div className="flex flex-wrap gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 bg-[var(--bg-soft)] rounded-md w-16" />
              ))}
            </div>
          </div>
          <div className="bg-white border border-[var(--border-default)]/40 rounded-2xl p-5 h-56" />
        </div>
      </div>
    </div>
  );
};

export default DeveloperSkeleton;