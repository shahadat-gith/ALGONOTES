import React from "react";
import { ShieldCheck, Cpu, Sliders, LayoutGrid } from "lucide-react";

const HomeFeatures = () => {
  const items = [
    {
      title: "Dynamic Contribution Grid",
      desc: "Monitor your workspace consistency metrics daily with a built-in, un-clipped GitHub-style contribution calendar tracker map.",
      icon: LayoutGrid,
      tint: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "AI Strategy Synthesis",
      desc: "Instantly compile detailed dry-runs, identify algorithmic density limits, and map out edge cases directly from your code logs.",
      icon: Cpu,
      tint: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Advanced Filtering Trunk",
      desc: "Quickly filter your problem tracking deck by platform types, specific difficulties, or programming language profiles inside an optimized UI data table.",
      icon: Sliders,
      tint: "text-amber-600 bg-amber-50",
    },
    {
      title: "Secure Data Sandbox Sovereignty",
      desc: "Your user submissions and authentication credentials remain tightly isolated and encrypted under absolute personal user token validation rules.",
      icon: ShieldCheck,
      tint: "text-rose-600 bg-rose-50",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
          Engineered for absolute programmatic optimization
        </h2>
        <p className="text-xs text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed font-medium">
          All the tracking, analysis, and data layers you need to stay
          organized, bundled inside a fast single-handshake client interface.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((feat, idx) => (
          <div
            key={idx}
            className="p-6 bg-white border border-[var(--border-default)]/60 rounded-2xl shadow-sm flex items-start gap-4 hover:border-[var(--primary)]/30 hover:shadow-md transition-all group"
          >
            <div
              className={`p-3 rounded-xl border border-current/5 shrink-0 ${feat.tint} group-hover:scale-105 transition-transform`}
            >
              <feat.icon size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] tracking-tight">
                {feat.title}
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeFeatures;
