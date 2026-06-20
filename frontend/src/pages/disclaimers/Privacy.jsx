import React from "react";
import { ShieldCheck, Eye, Key, ShieldAlert } from "lucide-react";
import Glow from "../../components/common/Glow";

const Privacy = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in select-none relative overflow-hidden">
      <Glow preset="subtle" />
      
      {/* Header Block */}
      <div className="border-b border-border-default pb-5 space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-soft border border-success/10 text-success rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-card backdrop-blur-md">
          <ShieldCheck size={12} className="stroke-[2]" /> 
          <span>Compliance Policy</span>
        </div>
        <h1 className="text-xl font-bold text-text-main tracking-wide">Privacy Policy</h1>
        <p className="text-xs text-text-light font-mono tracking-wide">Last updated: June 12, 2026 • Version 1.0.0</p>
      </div>

      {/* Intro Summary Callout Block */}
      <div className="p-4 bg-bg-soft border border-border-default rounded-sm flex items-start gap-3.5 shadow-xs">
        <ShieldAlert size={15} className="text-primary shrink-0 mt-0.5 stroke-[2]" />
        <p className="text-xs text-text-muted leading-relaxed font-normal tracking-wide">
          At <span className="font-semibold text-text-main">ALGONOTES</span>, we prioritize absolute data sovereignty. We design sandbox environments ensuring your algorithmic problem submissions, local dry-run matrices, and solution script trees belong exclusively to you.
        </p>
      </div>

      {/* Policy Clauses Body Modules */}
      <div className="space-y-6 pt-2">
        
        {/* Section 1 */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <Eye size={14} className="text-text-light stroke-[1.75]" /> 
            <span>1. Data Collection Profiles</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            We minimize telemetry collection to maintain high execution speeds. Account details (name, email address, and authentication hashes) are recorded exclusively to securely manage sync parameters across your workstations.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <Key size={14} className="text-text-light stroke-[1.75]" /> 
            <span>2. Repository Infrastructure & Processing</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            Your saved problem listings, compiler target logs, and programming blocks are transmitted via SSL/TLS encryption straight to secure cloud storage nodes. Your script payloads are parsed dynamically only when generating custom AI optimization summaries.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2.5">
            <ShieldCheck size={14} className="text-text-light stroke-[1.75]" /> 
            <span>3. Information Retention Rules</span>
          </h2>
          <p className="text-xs text-text-muted pl-6.5 leading-relaxed font-normal tracking-wide">
            We enforce strict data isolation parameters. Should you request account deletion through your dashboard control console, your entire data footprint—including matching dynamic dry-runs and historical repository items—is completely purged from our active clusters within 72 hours.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Privacy;