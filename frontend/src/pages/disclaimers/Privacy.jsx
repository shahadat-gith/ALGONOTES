import React from "react";
import { ShieldCheck, Eye, Key, ShieldAlert } from "lucide-react";

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-6 font-sans">
      
      {/* Header Block */}
      <div className="border-b border-[var(--border-default)]/60 pb-5 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100/40 rounded-full text-[11px] font-bold tracking-wide">
          <ShieldCheck size={12} /> Compliance Policy
        </div>
        <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-[var(--text-light)] font-mono">Last updated: June 12, 2026 • Version 1.0.0</p>
      </div>

      {/* Intro Summary Callout */}
      <div className="p-4 bg-[var(--bg-soft)]/50 border border-[var(--border-default)]/40 rounded-xl flex items-start gap-3">
        <ShieldAlert size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
          At <span className="font-bold text-[var(--text-main)]">ALGONOTES</span>, we prioritize absolute data sovereignty. We design sandbox environments ensuring your algorithmic problem submissions, local dry-run matrices, and solution script trees belong exclusively to you.
        </p>
      </div>

      {/* Policy Clauses Body */}
      <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
        
        {/* Section 1 */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Eye size={14} className="text-[var(--text-light)]" /> 1. Data Collection Profiles
          </h2>
          <p className="text-xs pl-6">
            We minimize telemetry collection to maintain high execution speeds. Account details (name, email address, and authentication hashes) are recorded exclusively to securely manage sync parameters across your workstations.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Key size={14} className="text-[var(--text-light)]" /> 2. Repository Infrastructure & Processing
          </h2>
          <p className="text-xs pl-6">
            Your saved problem listings, compiler target logs, and programming blocks are transmitted via SSL/TLS encryption straight to secure cloud storage nodes. Your script payloads are parsed dynamically only when generating custom AI optimization summaries.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <ShieldCheck size={14} className="text-[var(--text-light)]" /> 3. Information Retention Rules
          </h2>
          <p className="text-xs pl-6">
            We enforce strict data isolation parameters. Should you request account deletion through your dashboard control console, your entire data footprint—including matching dynamic dry-runs and historical repository items—is completely purged from our active clusters within 72 hours.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Privacy;