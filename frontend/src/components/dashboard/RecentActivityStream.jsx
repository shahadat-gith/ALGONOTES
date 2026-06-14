import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, StickyNote } from "lucide-react";

const RecentActivityStream = ({ title, items, navigate }) => {
  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] space-y-4">
      
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[var(--text-light)]" />
          <h2 className="text-sm font-bold text-[var(--text-main)]">
            {title}
          </h2>
        </div>

        <Link
          to="/notes"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="divide-y divide-[var(--border-default)]">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.noteId}
              onClick={() => navigate(`/notes/${item.noteId}/view`)}
              className="group flex cursor-pointer items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-[var(--bg-soft)]"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                
                <div className="shrink-0 rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-emerald-600">
                  <StickyNote size={14} />
                </div>

                <div className="overflow-hidden">
                  <p className="truncate text-xs font-bold text-[var(--text-main)] transition-colors group-hover:text-[var(--primary)]">
                    {item.title}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-[var(--text-light)]">
                    {item.platform || "LeetCode"} •{" "}
                    {item.difficulty || "Unknown"} •{" "}
                    {item.language || "C++"}
                  </p>
                </div>
              </div>

              <span className="shrink-0 font-mono text-[10px] font-medium text-[var(--text-light)]">
                {new Date(
                  item.updated || item.createdAt
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-[11px] text-[var(--text-light)]">
            No recent notes found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivityStream;