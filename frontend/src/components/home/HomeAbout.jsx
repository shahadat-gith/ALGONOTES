import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen, Code2, Lightbulb } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "AI-Powered DSA Notes",
    description: "Turn any coding problem into structured revision notes with intuition, approaches, complexity analysis, and dry-run traces.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Theory Notes",
    description: "Build topic-based study guides for CS concepts with rich text editing, code blocks, and image support.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Lightbulb,
    title: "Smart Organization",
    description: "Search across all your notes, filter by topic or difficulty, and revisit your material whenever you need a refresher.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const HomeAbout = () => {
  return (
    <section className="w-full rounded-[2rem] border border-border-default bg-bg-surface/60 p-6 sm:p-10 shadow-card relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 h-[20rem] w-[30rem] rounded-full bg-primary/8 blur-[130px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles size={12} className="stroke-[2.2]" />
            <span>Why ALGONOTES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            Everything you need to master DSA and CS theory
          </h2>
          <p className="text-sm text-text-light max-w-lg mx-auto">
            ALGONOTES combines AI-powered generation with a clean workspace so you can focus on what matters — learning.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border-default bg-bg-surface p-5 shadow-card hover:border-border-strong/60 transition-all duration-300 group"
              >
                <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} mb-3 w-fit transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={18} className="stroke-[1.75]" />
                </div>
                <h3 className="text-sm font-bold text-text-main mb-1.5">{item.title}</h3>
                <p className="text-xs leading-5 text-text-light">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Know More CTA */}
        <div className="text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-default bg-bg-surface text-text-main text-sm font-semibold hover:border-primary/30 hover:text-primary hover:shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Know More</span>
            <ArrowRight size={14} className="stroke-[2]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
