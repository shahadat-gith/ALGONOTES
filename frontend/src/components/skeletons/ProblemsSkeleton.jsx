import React from "react";

const ProblemsSkeleton = () => {
  // Simulates a realistic list payload of 6 individual row entries
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="space-y-6 animate-pulse select-none">
      
      {/* 1. Header Action Row Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-7 bg-[var(--bg-soft)] rounded-lg w-48" />
        <div className="h-10 bg-[var(--bg-soft)] rounded-xl w-full sm:w-36 shrink-0" />
      </div>

      {/* 2. Full-Width Search Bar Console Skeleton */}
      <div className="h-10 w-full bg-[var(--bg-soft)] rounded-xl" />

      {/* 3. Modular Multi-Filter Panel Strip Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[var(--bg-soft)]/30 rounded-2xl border border-[var(--border-default)]/40">
        <div className="h-9 bg-[var(--bg-soft)] rounded-xl" />
        <div className="h-9 bg-[var(--bg-soft)] rounded-xl" />
        <div className="h-9 bg-[var(--bg-soft)] rounded-xl" />
        <div className="h-9 bg-[var(--bg-soft)] rounded-xl" />
      </div>

      {/* 4. Tabular Wireframe Content Block Grid */}
      <div className="w-full border border-[var(--border-default)]/60 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[var(--bg-soft)] border-b border-[var(--border-default)]/60 text-[var(--text-light)] h-11">
                <th className="p-4 w-12"></th>
                <th className="p-4 min-w-[240px]">
                  <div className="h-2.5 bg-[var(--bg-soft)] rounded w-24" />
                </th>
                <th className="p-4 w-36">
                  <div className="h-2.5 bg-[var(--bg-soft)] rounded w-16" />
                </th>
                <th className="p-4 w-28">
                  <div className="h-2.5 bg-[var(--bg-soft)] rounded w-16" />
                </th>
                <th className="p-4 w-28">
                  <div className="h-2.5 bg-[var(--bg-soft)] rounded w-16" />
                </th>
                <th className="p-4 min-w-[180px]">
                  <div className="h-2.5 bg-[var(--bg-soft)] rounded w-14" />
                </th>
                <th className="p-4 w-40 text-right"></th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[var(--border-default)]/40">
              {skeletonRows.map((_, index) => (
                <tr key={index} className="h-[60px]">
                  {/* Bookmark Column Placeholder */}
                  <td className="p-4 text-center">
                    <div className="w-4 h-4 bg-[var(--bg-soft)] rounded mx-auto" />
                  </td>

                  {/* Title & Multi-Line Subtitle Block */}
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-[var(--bg-soft)] rounded w-3/4 sm:w-1/2" />
                      <div className="h-2 bg-[var(--bg-soft)] rounded w-1/4" />
                    </div>
                  </td>

                  {/* Platform Indicator Block */}
                  <td className="p-4">
                    <div className="h-3 bg-[var(--bg-soft)] rounded w-16" />
                  </td>

                  {/* Difficulty Badge Wireframe */}
                  <td className="p-4">
                    <div className="h-5 bg-[var(--bg-soft)] rounded-md w-16" />
                  </td>

                  {/* Programming Language Pill */}
                  <td className="p-4">
                    <div className="h-5 bg-[var(--bg-soft)] rounded-md w-12" />
                  </td>

                  {/* Sliced Topic Tag Pills */}
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <div className="h-4 bg-[var(--bg-soft)] rounded-md w-14" />
                      <div className="h-4 bg-[var(--bg-soft)] rounded-md w-12" />
                    </div>
                  </td>

                  {/* Quick Inline Actions Segment */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-7 h-7 bg-[var(--bg-soft)] rounded-lg" />
                      <div className="w-7 h-7 bg-[var(--bg-soft)] rounded-lg" />
                      <div className="w-7 h-7 bg-[var(--bg-soft)] rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProblemsSkeleton;