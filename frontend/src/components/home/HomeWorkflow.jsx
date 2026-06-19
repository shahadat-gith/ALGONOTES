import React from "react";
import { ArrowRight, BrainCircuit, FilePenLine, SendToBack } from "lucide-react";


const steps = [
  {
    title: "Share your input",
    description: "Paste a problem link or theory topic, then provide your code or instructions.",
    icon: FilePenLine,
  },
  {
    title: "Generation pipeline runs",
    description: "ALGONOTES queues your request and processes it through the generation workflow.",
    icon: SendToBack,
  },
  {
    title: "Review and refine",
    description: "Open the generated note, edit what you need, and keep a final revision-ready version.",
    icon: BrainCircuit,
  },
];


const HomeWorkflow = () => {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
          How ALGONOTES works
        </h2>
        <p className="text-sm text-text-muted leading-6 max-w-2xl">
          A simple flow designed to save time while still giving you structured, editable study material.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-bg-surface/85 to-bg-base/85 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-sm hover:border-primary/35 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-[#c8bbff] text-xs font-semibold">
                  {idx + 1}
                </div>
                <ArrowRight size={14} className="text-text-light" />
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/12 text-[#c8bbff]">
                  <Icon size={15} className="stroke-[2]" />
                </div>
              </div>

              <h3 className="text-base font-semibold tracking-tight text-text-main">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};


export default HomeWorkflow;