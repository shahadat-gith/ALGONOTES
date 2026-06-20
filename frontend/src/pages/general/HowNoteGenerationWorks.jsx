import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileCode2, Link2, Sparkles, Workflow } from "lucide-react";
import Glow from "../../components/common/Glow";


const steps = [
  {
    title: "Provide problem context",
    description:
      "You add the problem link, language, optional notes, and your final code solution.",
    icon: Link2,
  },
  {
    title: "ALGONOTES queues generation",
    description:
      "Your request is sent to the backend queue so generation runs reliably without blocking your session.",
    icon: Workflow,
  },
  {
    title: "AI builds the explanation",
    description:
      "The system composes intuition, edge cases, complexity notes, and an approach-focused breakdown.",
    icon: Sparkles,
  },
  {
    title: "You review and refine",
    description:
      "Open the generated note, edit details if needed, and save your final revision-ready material.",
    icon: FileCode2,
  },
];


const HowNoteGenerationWorks = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8 animate-fade-in relative overflow-hidden">
      <Glow preset="subtle" />
      <Glow preset="topRight" />
      <section className="rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-6 sm:p-8 shadow-card space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles size={12} className="stroke-[2.2]" />
          <span>How It Works</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
          How coding note generation works in ALGONOTES
        </h1>

        <p className="max-w-3xl text-sm sm:text-base leading-7 text-text-light">
          The coding note pipeline is designed to turn your accepted solution into clear study content with minimal manual effort.
        </p>

        <Link
          to="/notes/generate"
          className="inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-base/70 px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/40 hover:text-primary transition-all"
        >
          <span>Open Coding Notes Builder</span>
          <ArrowRight size={14} className="stroke-[2]" />
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-bold">
                  {index + 1}
                </div>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Icon size={15} className="stroke-[2]" />
                </div>
              </div>

              <h2 className="text-base font-semibold tracking-tight text-text-main">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-light">
                {step.description}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
};


export default HowNoteGenerationWorks;