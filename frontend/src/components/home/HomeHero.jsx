import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";

import Button from "../common/Button";


const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full rounded-[2rem] border border-white/10 bg-gradient-to-b from-bg-surface/95 via-bg-surface/88 to-bg-base px-6 py-12 sm:px-10 sm:py-16 shadow-[0_10px_80px_rgba(0,0,0,0.48)] relative overflow-hidden text-center">
      <div className="absolute top-[-28%] left-1/2 -translate-x-1/2 h-[26rem] w-[26rem] rounded-full bg-primary/28 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 h-80 w-[42rem] max-w-[88vw] rounded-full bg-[#7d7dff]/18 blur-[120px] pointer-events-none" />
      <div className="absolute left-[10%] top-[34%] hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-bg-surface/70 px-3 text-xs text-text-muted backdrop-blur md:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        DSA + CS Notes
      </div>
      <div className="absolute right-[10%] top-[38%] hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-bg-surface/70 px-3 text-xs text-text-muted backdrop-blur md:inline-flex">
        <Sparkles size={12} className="text-primary" />
        Revision Ready
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c8bbff]">
          <Sparkles size={12} className="stroke-[2.2]" />
          <span>India's smart coding notes workspace</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-main leading-[1.06]">
          Get interview-ready faster
          <br className="hidden sm:block" />
          with ALGONOTES.
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-7 text-text-muted">
          Turn coding problems and theory topics into polished revision notes with a clean workflow, readable formatting, and fast revisit support.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button
            onClick={() => navigate("/notes/generate")}
            className="h-11 px-5 text-sm font-semibold shadow-[0_0_25px_rgba(139,92,246,0.38)]"
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

        <div className="mx-auto mt-4 w-full max-w-4xl rounded-2xl border border-white/10 bg-bg-surface/72 p-4 shadow-[0_8px_45px_rgba(0,0,0,0.42)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <p className="text-left text-sm font-semibold text-text-main">ALGONOTES</p>
            <div className="inline-flex gap-2">
              <span className="h-2 w-2 rounded-full bg-primary/90" />
              <span className="h-2 w-2 rounded-full bg-white/35" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-3">
            {["DSA Revision", "System Design", "DBMS Theory"].map((card) => (
              <div
                key={card}
                className="rounded-xl border border-white/10 bg-bg-base/70 p-3 text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-light">Continue</p>
                <p className="mt-2 text-sm font-medium text-text-main">{card}</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-[#a899ff]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


export default HomeHero;