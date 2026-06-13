import React from "react";
import { Code2, FileJson, Activity, Milestone } from "lucide-react";

const HomeStats = () => {
  const stats = [
    { label: "Active Algorithms", value: "2,400+", desc: "Solutions Tracked", icon: Code2, color: "text-indigo-600 bg-indigo-50" },
    { label: "AI Study Logs", value: "18,500+", desc: "Notebooks Derived", icon: FileJson, color: "text-emerald-600 bg-emerald-50" },
    { label: "Daily Submissions", value: "94.2%", desc: "Consistency Floor", icon: Activity, color: "text-amber-600 bg-amber-50" },
    { label: "Interview Blocks", value: "14+ Patterns", desc: "Density Vectors", icon: Milestone, color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-[var(--border-default)]/60 p-5 rounded-2xl shadow-sm">
        {stats.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl flex items-center gap-4 hover:bg-[var(--bg-soft)]/30 transition-colors">
            <div className={`p-2.5 rounded-xl border border-current/5 shrink-0 ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider block">{item.label}</span>
              <h3 className="text-xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">{item.value}</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeStats;