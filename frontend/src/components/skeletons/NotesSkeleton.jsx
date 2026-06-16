import React from "react";

const NotesSkeleton = () => {
  // Simulates a realistic layout matching your PAGE_SIZE data rows
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="w-full space-y-6 animate-pulse select-none">
      
      {/* 1. Header Typography Skeleton Block */}
      <div className="flex flex-col gap-4 border-b border-border-default pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-5.5 bg-bg-soft rounded-xs w-32" />
          <div className="h-3.5 bg-bg-soft rounded-xs w-64 max-w-full" />
        </div>
        {/* Create Note Button Placeholder */}
        <div className="h-8.5 bg-bg-soft rounded-md w-28 shrink-0 hidden sm:block" />
      </div>

      {/* 2. Search Bar Input Component Wireframe */}
      <div className="h-10 w-full bg-bg-soft/40 border border-border-default rounded-md" />

      {/* 3. Table Meta & Top-Right Pagination Skeleton */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        {/* Total results count block */}
        <div className="h-3 bg-bg-soft rounded-xs w-40" />
        {/* Mini right pagination cluster */}
        <div className="flex items-center gap-3">
          <div className="h-3 bg-bg-soft rounded-xs w-16" />
          <div className="flex gap-1.5">
            <div className="w-6 h-6 bg-bg-soft rounded-sm border border-border-default" />
            <div className="w-6 h-6 bg-bg-soft rounded-sm border border-border-default" />
          </div>
        </div>
      </div>

      {/* 4. Complete Tabular Grid Layout Skeleton */}
      <div className="overflow-hidden rounded-md border border-border-default bg-bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {/* Table Headers Wireframe */}
            <thead className="bg-bg-soft/60 border-b border-border-default">
              <tr>
                <th className="px-6 py-4 w-[35%]"><div className="h-2.5 bg-border-strong/20 rounded-xs w-24" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-2.5 bg-border-strong/20 rounded-xs w-16" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-2.5 bg-border-strong/20 rounded-xs w-16" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-2.5 bg-border-strong/20 rounded-xs w-14" /></th>
                <th className="px-6 py-4 w-[10%]"><div className="h-2.5 bg-border-strong/20 rounded-xs w-12" /></th>
                <th className="px-6 py-4 w-[12%]"><div className="h-2.5 bg-border-strong/20 rounded-xs w-16" /></th>
                <th className="px-6 py-4 w-[7%] text-right"><div className="h-2.5 bg-border-strong/20 rounded-xs w-8 ml-auto" /></th>
              </tr>
            </thead>
            
            {/* Table Rows Loader Wireframe */}
            <tbody className="divide-y divide-border-default bg-bg-surface">
              {skeletonRows.map((_, index) => (
                <tr key={index} className="h-[61px]">
                  {/* Problem Title Column */}
                  <td className="px-6 py-4">
                    <div className="h-3.5 bg-bg-soft rounded-xs w-[75%]" />
                  </td>

                  {/* Platform Column */}
                  <td className="px-6 py-4">
                    <div className="h-3.5 bg-bg-soft rounded-xs w-14" />
                  </td>

                  {/* Difficulty Badge Column */}
                  <td className="px-6 py-4">
                    <div className="h-5 bg-bg-soft/80 rounded-sm w-16" />
                  </td>

                  {/* Language Snippet Column */}
                  <td className="px-6 py-4">
                    <div className="h-5 bg-bg-soft/60 rounded-sm border border-border-default/40 w-12" />
                  </td>

                  {/* Status Badge Column */}
                  <td className="px-6 py-4">
                    <div className="h-5 bg-bg-soft/80 rounded-sm w-14" />
                  </td>

                  {/* Updated Clock Column */}
                  <td className="px-6 py-4">
                    <div className="h-3 bg-bg-soft rounded-xs w-20" />
                  </td>

                  {/* Actions Tools Column */}
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 justify-end">
                      <div className="w-6 h-6 bg-bg-soft rounded-sm" />
                      <div className="w-6 h-6 bg-bg-soft rounded-sm" />
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