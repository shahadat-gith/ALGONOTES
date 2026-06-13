import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import Button from "../common/Button";

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    // 🛠️ CHANGED: Swapped max-w-5xl for w-full max-w-full to allow a true full-width presentation block
    <section className="w-full max-w-full pt-16 sm:pt-24 px-4 sm:px-8 lg:px-16 text-center space-y-6 animate-fade-in relative">
      
      {/* Decorative full-width accent boundary element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--border-default)]/40 to-transparent pointer-events-none" />

      {/* Dynamic Upper Micro Banner */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--primary-soft)]/40 border border-[var(--primary-soft)] text-[var(--primary)] rounded-full text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-sm mx-auto select-none">
        <Sparkles size={11} className="animate-pulse" /> Track your coding progress effortlessly
      </div>

      {/* Main Selling Value Headline — Completely simplified text layout */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-main)] tracking-tight max-w-5xl mx-auto leading-[1.15]">
        The smart way to organize coding problems and keep{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-indigo-600">
          perfect study notes.
        </span>
      </h1>

      {/* Product Mission Core Description — Rewritten for laymen clarity */}
      <p className="text-xs sm:text-sm md:text-base text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed font-medium">
        Stop losing track of your code solutions. Save your favorite problems, visualize how code runs step-by-step, and generate instant smart summaries to clear your next technical interview.
      </p>

      {/* Action CTA Button Array */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto sm:max-w-none pb-10">
        <Button 
          variant="primary" 
          onClick={() => navigate("/dashboard")}
          className="text-xs h-11 px-6 font-bold w-full sm:w-auto shadow-lg shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 transition-all inline-flex items-center justify-center gap-1 group"
        >
          Go to Dashboard 
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/problems")}
          className="text-xs h-11 px-6 font-bold bg-white w-full sm:w-auto flex items-center justify-center gap-1.5 border-[var(--border-default)] hover:bg-[var(--bg-soft)]/40 transition-colors"
        >
          <Terminal size={13} className="text-[var(--text-light)]" /> Browse Your Problems
        </Button>
      </div>

    </section>
  );
};

export default HomeHero;