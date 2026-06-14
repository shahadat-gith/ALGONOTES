import React from "react";

const NoteDryRunViewer = ({ steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  const sortedBlocks = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Extract paragraph labels and the literal structured table array matrix
  const introductoryText = sortedBlocks.find(b => b.type === "paragraph")?.text;
  const tableBlock = sortedBlocks.find(b => b.type === "table");

  if (!tableBlock || !tableBlock.table) return null;

  return (
    <div className="space-y-4">
      {introductoryText && (
        <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
          {introductoryText}
        </p>
      )}

      {/* Native Micro-Spreadsheet Simulation Matrix View */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-default)] shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--bg-soft)] border-b border-[var(--border-default)] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
              <th className="p-3 w-12 text-center">Step</th>
              <th className="p-3 min-w-[120px]">Variable State</th>
              <th className="p-3 min-w-[180px]">Action Performed</th>
              <th className="p-3 min-w-[180px]">Result / Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)] bg-white text-[var(--text-main)] font-mono">
            {tableBlock.table.map((row, index) => (
              <tr key={index} className="hover:bg-[var(--bg-base)] transition-colors">
                <td className="p-3 text-center font-bold text-[var(--primary)] bg-[var(--bg-base)] w-12">
                  {row.step}
                </td>
                <td className="p-3 whitespace-pre-wrap text-[var(--text-muted)]">
                  {row.state}
                </td>
                <td className="p-3 font-sans text-sm font-medium">
                  {row.action}
                </td>
                <td className="p-3 font-sans text-sm text-[var(--text-muted)] bg-gradient-to-r from-transparent to-[var(--primary-soft)]/10">
                  {row.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoteDryRunViewer;