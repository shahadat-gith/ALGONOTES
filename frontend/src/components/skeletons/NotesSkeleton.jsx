import React from "react";

const NotesSkeleton = () => {
  // Simulates a realistic page fill of 6 table rows
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse select-none">
      
      {/* 1. Header Typography Skeleton Block */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-default)]/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 bg-[var(--bg-soft)] rounded-xl w-40" />
          <div className="h-4 bg-[var(--bg-soft)] rounded-lg w-72 max-w-full" />
        </div>
        {/* Create Note Button Placeholder */}
        <div className="h-10 bg-[var(--bg-soft)] rounded-xl w-32 shrink-0 hidden sm:block" />
      </div>

      {/* 2. Search Bar Input Component Wireframe */}
      <div className="h-11 w-full bg-[var(--bg-soft)] rounded-xl" />

      {/* 3. Table Meta & Top-Right Pagination Skeleton */}
      <div className="flex items-center justify-between px-1 pt-2">
        {/* Total results count block */}
        <div className="h-3.5 bg-[var(--bg-soft)] rounded w-44" />
        {/* Mini right pagination cluster */}
        <div className="flex items-center gap-3">
          <div className="h-3.5 bg-[var(--bg-soft)] rounded w-20" />
          <div className="flex gap-1.5">
            <div className="w-7 h-7 bg-[var(--bg-soft)] rounded-lg" />
            <div className="w-7 h-7 bg-[var(--bg-soft)] rounded-lg" />
          </div>
        </div>
      </div>

      {/* 4. Complete Tabular Grid Layout Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {/* Table Headers Wireframe */}
            <thead className="bg-[var(--bg-soft)] border-b border-[var(--border-default)]">
              <tr>
                <th className="px-6 py-4 w-[35%]"><div className="h-3 bg-[var(--border-strong)]/30 rounded w-24" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-3 bg-[var(--border-strong)]/30 rounded w-16" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-3 bg-[var(--border-strong)]/30 rounded w-16" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-3 bg-[var(--border-strong)]/30 rounded w-16" /></th>
                <th className="px-6 py-4 w-[10%]"><div className="h-3 bg-[var(--border-strong)]/30 rounded w-12" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-3 bg-[var(--border-strong)]/30 rounded w-16" /></th>
                <th className="px-6 py-4 w-[7%] text-right"><div className="h-3 bg-[var(--border-strong)]/30 rounded w-8 ml-auto" /></th>
              </tr>
            </thead>
            
            {/* Table Rows Loader Wireframe */}
            <tbody className="divide-y divide-[var(--border-default)] bg-[var(--bg-surface)]">
              {skeletonRows.map((_, index) => (
                <tr key={index} className="h-[61px]">
                  {/* Problem Title Column */}
                  <td className="px-6 py-4">
                    <div className="h-4 bg-[var(--bg-soft)] rounded-lg w-[85%]" />
                  </td>

                  {/* Platform Column */}
                  <td className="px-6 py-4">
                    <div className="h-4 bg-[var(--bg-soft)] rounded-lg w-16" />
                  </td>

                  {/* Difficulty Badge Column */}
                  <td className="px-6 py-4">
                    <div className="h-6 bg-[var(--bg-soft)] rounded-full w-16" />
                  </td>

                  {/* Language Snippet Column */}
                  <td className="px-6 py-4">
                    <div className="h-4 bg-[var(--bg-soft)] rounded-lg w-12" />
                  </td>

                  {/* Status Badge Column */}
                  <td className="px-6 py-4">
                    <div className="h-6 bg-[var(--bg-soft)] rounded-full w-14" />
                  </td>

                  {/* Updated Clock Column */}
                  <td className="px-6 py-4">
                    <div className="h-3.5 bg-[var(--bg-soft)] rounded w-20" />
                  </td>

                  {/* Actions Tools Column */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <div className="w-7 h-7 bg-[var(--bg-soft)] rounded-md" />
                      <div className="w-7 h-7 bg-[var(--bg-soft)] rounded-md" />
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

export default NotesSkeleton;