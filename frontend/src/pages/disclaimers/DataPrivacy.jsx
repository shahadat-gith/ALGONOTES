import React from "react";
import { Database, Binary, Server, HardDrive, RefreshCw } from "lucide-react";

const DataPrivacy = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-6 font-sans">
      
      {/* Header Block */}
      <div className="border-b border-[var(--border-default)]/60 pb-5 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100/40 rounded-full text-[11px] font-bold tracking-wide">
          <Binary size={12} /> System Engineering Blueprint
        </div>
        <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Data Privacy Engine</h1>
        <p className="text-xs text-[var(--text-light)] font-mono">Architecture Spec Index • Active Monitoring</p>
      </div>

      {/* Tech Spec Grid Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-[var(--border-default)]/60 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
            <Server size={14} className="text-[var(--primary)]" /> Encryption Boundaries
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Data arrays are shielded on transit using AES-256 protocols and locked down with unique database document indexing variables.
          </p>
        </div>
        
        <div className="p-4 bg-white border border-[var(--border-default)]/60 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
            <RefreshCw size={14} className="text-indigo-500" /> Isolated Model Pipelines
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Your code snippets are evaluated temporarily in volatile memory buffers for AI note generation and are never used to train public foundational weights.
          </p>
        </div>
      </div>

      {/* Detailed Protocols Section */}
      <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed pt-2">
        
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Database size={14} className="text-[var(--text-light)]" /> Tokenized Client Handshakes
          </h2>
          <p className="text-xs pl-6">
            Session data maps authenticate exclusively via cryptographically signed stateless tokens. This setup limits internal workspace lookup visibility tightly to your custom account scope profile guidelines.
          </p>
        </div>

        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <HardDrive size={14} className="text-[var(--text-light)]" /> Sandbox Architecture Commitments
          </h2>
          <p className="text-xs pl-6">
            We avoid third-party ad tracking scripts. All technical statistics, from the GitHub-style contribution matrix down to platform difficulty breakdowns, are computed locally using optimized query pipelines.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DataPrivacy;