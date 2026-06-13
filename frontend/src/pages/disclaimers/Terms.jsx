import React from "react";
import { FileText, Scale, Cpu, AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-6 font-sans">
      
      {/* Header Block */}
      <div className="border-b border-[var(--border-default)]/60 pb-5 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100/40 rounded-full text-[11px] font-bold tracking-wide">
          <Scale size={12} /> Legal Agreement
        </div>
        <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Terms & Conditions</h1>
        <p className="text-xs text-[var(--text-light)] font-mono">Last updated: June 12, 2026 • Version 1.0.0</p>
      </div>

      {/* Main Framework Content */}
      <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
        
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <FileText size={14} className="text-[var(--text-light)]" /> 1. Usage Terms
          </h2>
          <p className="text-xs pl-6">
            By registering a profile on ALGONOTES, you agree to access the platform's trace frameworks for legitimate computer science preparation, system tracing, and private algorithm studies. Any automated scrape testing or reverse engineering attacks on our infrastructure services will lead to instant account termination.
          </p>
        </div>

        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Cpu size={14} className="text-[var(--text-light)]" /> 2. AI Code Analytics Sandbox Disclaimer
          </h2>
          <p className="text-xs pl-6">
            Our diagnostic systems leverage advanced machine learning models to structure dry-run simulations and trace code anomalies. While our model inference layers aim for maximum algorithmic accuracy, output parameters should be verified independently alongside production compiler runtime targets.
          </p>
        </div>

        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <AlertTriangle size={14} className="text-[var(--text-light)]" /> 3. Service Scope Limitations
          </h2>
          <p className="text-xs pl-6">
            ALGONOTES serves as an architectural tracker sandbox tool. We provide our workspace metrics and compiler logs on an "as-is" foundation, without liability regarding unforeseen processing service interruptions or localized network cache dropouts.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Terms;