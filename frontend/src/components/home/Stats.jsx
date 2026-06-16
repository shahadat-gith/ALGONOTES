import React from "react";
import { Code2, FileJson, Activity, Milestone } from "lucide-react";

const Stats = () => {
  const stats = [
    { label: "Notes Generated", value: "24,000+", desc: "DSA Solutions Tracked", icon: Code2, color: "text-primary bg-primary-soft border-primary/10" },
    { label: "AI Dry-Runs", value: "185,000+", desc: "Executions Visualized", icon: FileJson, color: "text-purple-400 bg-purple-500/10 border-purple-500/10" },
    { label: "Success Rate", value: "99.4%", desc: "Accurate Explanations", icon: Activity, color: "text-emerald-400 bg-success-soft border-success/10" },
    { label: "DSA Patterns", value: "15+ Core", desc: "Sliding Window to Graphs", icon: Milestone, color: "text-amber-400 bg-warning-soft border-warning/10" },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div 
            key={idx} 
            className="p-5 rounded-md bg-bg-surface border border-border-default hover:border-border-strong transition-all duration-200 flex items-start gap-4 shadow-card group select-none"
          >
            {/* Themed Icon Container */}
            <div className={`p-2.5 rounded-sm border shrink-0 group-hover:scale-105 transition-transform duration-200 ${item.color}`}>
              <item.icon size={16} className="stroke-[1.75]" />
            </div>

            {/* Typography Metrics */}
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="text-[10px] font-semibold text-text-light uppercase tracking-widest block">
                {item.label}
              </span>
              <h3 className="text-xl font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">
                {item.value}
              </h3>
              <p className="text-[11px] text-text-muted font-normal tracking-wide truncate">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;