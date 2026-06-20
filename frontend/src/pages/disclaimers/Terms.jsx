import React from "react";
import { FileText, Scale, Cpu, AlertTriangle } from "lucide-react";
import Glow from "../../components/common/Glow";

const Terms = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in select-none relative overflow-hidden">
      <Glow preset="subtle" />
      
      {/* Header Block */}
      <div className="border-b border-border-default pb-5 space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-soft border border-primary/20 text-primary rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-card backdrop-blur-md">
          <Scale size={12} className="stroke-[2]" /> 
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-xl font-bold text-text-main tracking-wide">Terms & Conditions</h1>
        <p className="text-xs text-text-light font-mono tracking-wide">Last updated: June 12, 2026 • Version 1.0.0</p>
      </div>

      {/* Main Framework Content */}
      <div className="space-y-6 pt-2">
        
        {/* Section 1 */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <FileText size={14} className="text-text-light stroke-[1.75]" /> 
            <span>1. Usage Terms</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            By registering a profile on ALGONOTES, you agree to access the platform's trace frameworks for legitimate computer science preparation, system tracing, and private algorithm studies. Any automated scrape testing or reverse engineering attacks on our infrastructure services will lead to instant account termination.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <Cpu size={14} className="text-text-light stroke-[1.75]" /> 
            <span>2. AI Code Analytics Sandbox Disclaimer</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            Our diagnostic systems leverage advanced machine learning models to structure dry-run simulations and trace code anomalies. While our model inference layers aim for maximum algorithmic accuracy, output parameters should be verified independently alongside production compiler runtime targets.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <AlertTriangle size={14} className="text-text-light stroke-[1.75]" /> 
            <span>3. Service Scope Limitations</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            ALGONOTES serves as an architectural tracker sandbox tool. We provide our workspace metrics and compiler logs on an "as-is" foundation, without liability regarding unforeseen processing service interruptions or localized network cache dropouts.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Terms;