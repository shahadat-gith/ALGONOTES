import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";

import Button from "../common/Button";


const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full rounded-3xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/10 px-6 py-10 sm:px-10 sm:py-14 shadow-card relative overflow-hidden">
      <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-success-soft blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles size={12} className="stroke-[2.2]" />
          <span>ALGONOTES Learning Workspace</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-main leading-[1.1]">
          Build smarter revision notes for coding and theory, in one clean system.
        </h1>

        <p className="max-w-2xl text-sm sm:text-base leading-7 text-text-light">
          ALGONOTES helps you turn solved problems and concept topics into structured notes you can revise quickly before interviews, tests, or project work.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            onClick={() => navigate("/notes/generate")}
            className="h-11 px-5 text-sm font-semibold"
          >
            <BookOpenText size={15} className="stroke-[2]" />
            <span>Create Coding Notes</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/theory/generate")}
            className="h-11 px-5 text-sm font-semibold"
          >
            <span>Create Theory Notes</span>
            <ArrowRight size={14} className="stroke-[2]" />
          </Button>
        </div>
      </div>
    </section>
  );
};


export default HomeHero;