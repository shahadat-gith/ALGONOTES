import React from "react";
import { Sparkles, Cpu, Search, FolderCode } from "lucide-react";

const Features = () => {
  const items = [
    {
      title: "Instant AI Dry-Run Synthesis",
      desc: "Paste any algorithm problem to automatically map out logical execution logs, runtime table states, and variable mutations step-by-step.",
      icon: Cpu,
      tint: "text-primary bg-primary-soft border-primary/10",
    },
    {
      title: "Optimal Strategy Breakdown",
      desc: "Automatically decompose problem approaches from raw brute-force mechanisms to space and time optimized mathematical thresholds.",
      icon: Sparkles,
      tint: "text-purple-400 bg-purple-500/10 border-purple-500/10",
    },
    {
      title: "Pattern-Based Note Vaults",
      desc: "Keep notes cleanly cataloged under core DSA tags like Sliding Window, Graphs, Dynamic Programming, and Two Pointers.",
      icon: FolderCode,
      tint: "text-emerald-400 bg-success-soft border-success/10",
    },
    {
      title: "Smart Filter Architecture",
      desc: "Instantly scan through your compiled study logs by matching specific problem complexities, language variants, or keyword indices.",
      icon: Search,
      tint: "text-amber-400 bg-warning-soft border-warning/10",
    },
  ];

  return (
    <section className="w-full space-y-12">
      {/* Dynamic Section Heading Group */}
      <div className="text-center space-y-3 select-none">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight max-w-2xl mx-auto leading-tight">
          Engineered for absolute algorithmic optimization
        </h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed font-normal tracking-wide">
          All the tracking, analysis, and data layers you need to analyze patterns and store clean study templates inside an accelerated space.
        </p>
      </div>

      {/* Grid Canvas System */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((feat, idx) => (
          <div
            key={idx}
            className="p-6 bg-bg-surface border border-border-default rounded-md flex items-start gap-4 hover:border-border-strong transition-all duration-200 group select-none shadow-card"
          >
            {/* Themed Icon Layer */}
            <div
              className={`p-3 rounded-sm border shrink-0 group-hover:scale-105 transition-transform duration-200 ${feat.tint}`}
            >
              <feat.icon size={16} className="stroke-[1.75]" />
            </div>

            {/* Content Group */}
            <div className="flex flex-col gap-1 overflow-hidden">
              <h4 className="text-xs sm:text-sm font-semibold text-text-main tracking-wide group-hover:text-primary transition-colors">
                {feat.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed font-normal tracking-wide">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;