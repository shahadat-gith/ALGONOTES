import React from "react";

const DeveloperSkeleton = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse select-none">
      
      {/* 1. Hero Bio Banner Section Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-md p-6 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-bg-soft shrink-0" />
        <div className="flex-1 w-full flex flex-col gap-2.5 pt-1">
          <div className="h-5 bg-bg-soft rounded-xs w-1/3 mx-auto sm:mx-0" />
          <div className="h-3.5 bg-bg-soft rounded-xs w-1/4 mx-auto sm:mx-0" />
          <div className="h-3 bg-bg-soft rounded-xs w-1/2 mx-auto sm:mx-0 mt-1" />
        </div>
      </div>

      {/* 2. Social Networks Matrix Card Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-md p-5 space-y-4">
        <div className="h-3 bg-bg-soft rounded-xs w-20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-sm border border-border-default bg-bg-soft/20 flex items-center gap-3 h-[50px]" />
          ))}
        </div>
      </div>

      {/* 3. Technical Skills Matrix Block Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-md p-5 space-y-5">
        <div className="h-3.5 bg-bg-soft rounded-xs w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((group) => (
            <div key={group} className="p-4 rounded-sm bg-bg-soft/40 border border-border-default space-y-3.5">
              <div className="h-2.5 bg-bg-soft rounded-xs w-16" />
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4].map((skill) => (
                  <div key={skill} className="h-6 bg-bg-base border border-border-default rounded-sm w-16" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Chronological Education Timeline Skeleton */}
      <div className="bg-bg-surface border border-border-default rounded-md p-5 space-y-5">
        <div className="h-3.5 bg-bg-soft rounded-xs w-1/5" />
        <div className="relative border-l border-border-default ml-2.5 pl-4 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="relative space-y-2">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-bg-surface border-2 border-border-default rounded-full" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="h-3.5 bg-bg-soft rounded-xs w-1/3" />
                <div className="h-2.5 bg-bg-soft rounded-xs w-12" />
              </div>
              <div className="h-3 bg-bg-soft rounded-xs w-1/4" />
              <div className="h-5 bg-bg-soft/60 rounded-sm w-14 mt-1" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DeveloperSkeleton;