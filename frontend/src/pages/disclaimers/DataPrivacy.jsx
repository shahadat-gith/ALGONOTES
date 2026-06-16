import React from "react";
import { Database, Binary, Server, HardDrive, RefreshCw } from "lucide-react";

const DataPrivacy = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in select-none">
      
      {/* Header Block */}
      <div className="border-b border-border-default pb-5 space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-soft border border-primary/20 text-primary rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-card backdrop-blur-md">
          <Binary size={12} className="stroke-[2]" /> 
          <span>System Engineering Blueprint</span>
        </div>
        <h1 className="text-xl font-bold text-text-main tracking-wide">Data Privacy Engine</h1>
        <p className="text-xs text-text-light font-mono tracking-wide">Architecture Spec Index • Active Monitoring</p>
      </div>

      {/* Tech Spec Grid Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-bg-surface border border-border-default rounded-md space-y-2.5 shadow-card transition-colors duration-200 hover:border-border-strong">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-main">
            <Server size={14} className="text-primary stroke-[1.75]" /> 
            <span>Encryption Boundaries</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed font-normal tracking-wide">
            Data arrays are shielded on transit using AES-256 protocols and locked down with unique database document indexing variables.
          </p>
        </div>
        
        <div className="p-5 bg-bg-surface border border-border-default rounded-md space-y-2.5 shadow-card transition-colors duration-200 hover:border-border-strong">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-main">
            <RefreshCw size={14} className="text-purple-400 stroke-[1.75]" /> 
            <span>Isolated Model Pipelines</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed font-normal tracking-wide">
            Your code snippets are evaluated temporarily in volatile memory buffers for AI note generation and are never used to train public foundational weights.
          </p>
        </div>
      </div>

      {/* Detailed Protocols Section */}
      <div className="space-y-6 pt-2">
        
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <Database size={14} className="text-text-light stroke-[1.75]" /> 
            <span>Tokenized Client Handshakes</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            Session data maps authenticate exclusively via cryptographically signed stateless tokens. This setup limits internal workspace lookup visibility tightly to your custom account scope profile guidelines.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <HardDrive size={14} className="text-text-light stroke-[1.75]" /> 
            <span>Sandbox Architecture Commitments</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            We avoid third-party ad tracking scripts. All technical statistics, from the core algorithm tagging matrices down to platform difficulty breakdowns, are computed locally using optimized query pipelines.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DataPrivacy;