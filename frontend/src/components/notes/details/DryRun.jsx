import React from "react";
import { Activity } from "lucide-react";

const DryRun = ({ dryRun = [] }) => {
  if (!dryRun || !dryRun.length) return null;

  return (
    <section className="bg-bg-surface border border-border-default rounded-md p-6 shadow-card select-none animate-fade-in">
      
      {/* Section Header */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <Activity size={14} className="text-primary stroke-[2]" />
        <span>Execution Dry Run</span>
      </h2>
      
      {/* Tabular Matrix Container Block */}
      <div className="overflow-hidden rounded-sm border border-border-default bg-bg-surface mt-4 shadow-inner">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            
            {/* Matrix Data Field Labels */}
            <thead className="bg-bg-soft/60 border-b border-border-default text-[10px] font-bold uppercase tracking-widest text-text-light font-mono">
              <tr>
                <th className="px-5 py-3.5 w-[10%]">Step</th>
                <th className="px-5 py-3.5 w-[35%]">State Map</th>
                <th className="px-5 py-3.5 w-[35%]">Operation</th>
                <th className="px-5 py-3.5 w-[20%] text-right">Result String</th>
              </tr>
            </thead>
            
            {/* Step-by-Step State Mutators Stack */}
            {/* Updated text alignment baseline: 13px on mobile, scales seamlessly to 16px on desktop frames */}
            <tbody className="divide-y divide-border-default font-mono text-[13px] md:text-[16px] text-text-main bg-bg-surface">
              {dryRun.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="group hover:bg-bg-soft/30 transition-colors duration-150"
                >
                  {/* Step Metric Pointer */}
                  <td className="px-5 py-4 font-bold text-primary tracking-wide">
                    {row.step}
                  </td>
                  
                  {/* Local Variables Memory Matrix State */}
                  <td className="px-5 py-4 whitespace-pre-wrap text-text-muted leading-relaxed font-normal tracking-wide group-hover:text-text-main transition-colors">
                    {row.state}
                  </td>
                  
                  {/* Code Line Handlers Instruction */}
                  <td className="px-5 py-4 text-text-muted leading-relaxed font-normal tracking-wide group-hover:text-text-main transition-colors">
                    {row.action}
                  </td>
                  
                  {/* Post-execution Evaluation Result Conditional */}
                  <td className="px-5 py-4 font-semibold text-success tracking-wide text-right">
                    <span className="inline-block bg-success-soft px-2 py-0.5 rounded-xs border border-success/10 text-[10px] md:text-[11px]">
                      {row.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </section>
  );
};

export default DryRun;