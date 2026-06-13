import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Code2, StickyNote } from "lucide-react";

const RecentActivityStream = ({ title, items, type, navigate }) => {
  const isNote = type === "note";

  return (
    <div className="bg-white border border-[var(--border-default)]/60 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-default)]/40 pb-3">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[var(--text-light)]" />
          <h2 className="text-sm font-bold text-[var(--text-main)]">{title}</h2>
        </div>
        <Link
          to={isNote ? "/notes" : "/problems"}
          className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-0.5"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="divide-y divide-[var(--border-default)]/40">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              onClick={() =>
                navigate(
                  isNote ? `/notes/${item.id}` : `/problems/${item.id}`,
                )
              }
              className="flex items-center justify-between py-3 hover:bg-[var(--bg-soft)]/40 rounded-xl px-2 cursor-pointer transition-colors group"
            >
              <div className="overflow-hidden flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 border ${isNote ? "bg-emerald-50 text-emerald-600 border-emerald-100/30" : "bg-indigo-50 text-indigo-600 border-indigo-100/30"}`}
                >
                  {isNote ? <StickyNote size={14} /> : <Code2 size={14} />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors truncate">
                    {isNote ? item.title : item.title}
                  </p>
                  <p className="text-[10px] text-[var(--text-light)] truncate mt-0.5">
                    {isNote
                      ? item.desc
                      : `${item.platform || "LeetCode"} • ${item.difficulty}`}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-medium text-[var(--text-light)] font-mono shrink-0">
                {new Date(item.updated || item.createdAt).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" },
                )}
              </span>
            </div>
          ))
        ) : (
          <p className="text-[11px] text-[var(--text-light)] py-4 text-center">
            No recent records recorded in this block.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivityStream;
