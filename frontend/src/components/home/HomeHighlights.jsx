import React from "react";
import { BadgeCheck, BookOpenCheck, SearchCheck, WandSparkles } from "lucide-react";


const points = [
  {
    title: "Structured output by default",
    desc: "Notes are organized for revision, not dumped as raw paragraphs.",
    icon: BadgeCheck,
  },
  {
    title: "Built for coding and theory",
    desc: "Use one workspace to manage DSA notes and subject concept notes.",
    icon: BookOpenCheck,
  },
  {
    title: "Search and revisit quickly",
    desc: "Find older notes fast when you need focused revision before tests.",
    icon: SearchCheck,
  },
  {
    title: "Prompt polish included",
    desc: "Refine rough instructions into clearer generation prompts when needed.",
    icon: WandSparkles,
  },
];


const HomeHighlights = () => {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
          Why learners prefer ALGONOTES
        </h2>
        <p className="text-sm text-text-muted leading-6 max-w-2xl">
          Focus on understanding concepts while ALGONOTES handles note structure and consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point) => {
          const Icon = point.icon;
          return (
            <article
              key={point.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-bg-surface/88 to-bg-base/85 p-5 shadow-[0_8px_28px_rgba(0,0,0,0.35)] flex items-start gap-4 hover:border-primary/30 transition-all duration-300"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/12 text-[#c8bbff] shrink-0">
                <Icon size={16} className="stroke-[2]" />
              </div>

              <div>
                <h3 className="text-base font-semibold tracking-tight text-text-main">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-text-muted">
                  {point.desc}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};


export default HomeHighlights;