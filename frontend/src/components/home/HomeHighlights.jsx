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
        <p className="text-sm text-text-light leading-6 max-w-2xl">
          Focus on understanding concepts while ALGONOTES handles note structure and consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point) => {
          const Icon = point.icon;
          return (
            <article
              key={point.title}
              className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card flex items-start gap-4"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shrink-0">
                <Icon size={16} className="stroke-[2]" />
              </div>

              <div>
                <h3 className="text-base font-semibold tracking-tight text-text-main">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-text-light">
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