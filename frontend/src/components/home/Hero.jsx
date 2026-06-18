import React from "react";

import { Sparkles, } from "lucide-react";

const Hero = () => {


  return (
    <section className="w-full max-w-[1400px] mx-auto pt-20 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in relative z-10">
      
      {/* Decorative center accent lighting boundary rule */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-border-default to-transparent pointer-events-none" />

      {/* Dynamic Upper Micro Banner Capsule */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-soft border border-primary/20 text-primary rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-card backdrop-blur-md mx-auto select-none">
        <Sparkles size={12} className="animate-pulse text-primary" /> 
        <span>AI-Powered DSA Study Workspace</span>
      </div>

      {/* Main Targeted Headline focusing on DSA Notes Generation */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-text-main tracking-tight max-w-5xl mx-auto leading-[1.12] select-none">
        Turn complex DSA problems into perfectly structured{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-indigo-400">
          study notes instantly.
        </span>
      </h1>

      {/* Product Mission Description rewritten specifically for data structures and algorithm analysis */}
      <p className="text-sm sm:text-base md:text-lg text-text-muted max-w-3xl mx-auto leading-relaxed font-normal tracking-wide">
        Stop wrestling with confusing algorithm write-ups. Paste any coding problem to instantly trace runtime data flows, document brute-force to optimal approaches, and generate clear step-by-step dry-runs.
      </p>

    </section>
  );
};

export default Hero;