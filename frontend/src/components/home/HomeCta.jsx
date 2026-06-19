import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Button from "../common/Button";


const HomeCta = () => {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-bg-surface/95 via-bg-surface/90 to-primary/12 px-6 py-8 sm:px-8 sm:py-10 shadow-[0_10px_42px_rgba(0,0,0,0.38)]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
            Ready to build your next revision note?
          </h2>
          <p className="text-sm leading-6 text-text-muted">
            Start with one coding problem or theory topic and let ALGONOTES generate a structured draft you can improve in minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate("/register")} className="h-11 px-5 text-sm font-semibold">
            <span>Create Free Account</span>
            <ArrowRight size={14} className="stroke-[2]" />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="h-11 px-5 text-sm font-semibold"
          >
            <span>Open Dashboard</span>
          </Button>
        </div>
      </div>
    </section>
  );
};


export default HomeCta;