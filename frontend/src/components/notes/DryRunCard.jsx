import React from "react";

const DryRunCard = ({ dryRun = [] }) => {
  if (!dryRun.length) return null;

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm">
      <h2 className="mb-4 border-b border-[var(--border-default)] pb-2 text-base font-bold text-[var(--text-main)]">
        Execution Dry Run
      </h2>
      <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[var(--bg-soft)] border-b border-[var(--border-default)] text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <th className="p-3 font-semibold">Step</th>
              <th className="p-3 font-semibold">State</th>
              <th className="p-3 font-semibold">Action</th>
              <th className="p-3 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)] font-mono text-xs text-[var(--text-main)]">
            {dryRun.map((row, idx) => (
              <tr key={idx} className="hover:bg-[var(--bg-base)]/40 transition-colors">
                <td className="p-3 font-bold text-[var(--primary)]">{row.step}</td>
                <td className="p-3 whitespace-pre-wrap">{row.state}</td>
                <td className="p-3 text-[var(--text-muted)]">{row.action}</td>
                <td className="p-3 font-medium text-[var(--success)]">{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DryRunCard;