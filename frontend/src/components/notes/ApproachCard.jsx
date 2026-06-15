import React from "react";

const ApproachCard = ({ title, approach, highlight = false }) => {
  if (!approach) return null;

  const { description = [], codeBlock, algorithmSteps = [] } = approach;

  return (
    <section
      className={`rounded-2xl border bg-[var(--bg-surface)] p-6 shadow-sm ${
        highlight
          ? "border-[var(--primary)]/30 ring-1 ring-[var(--primary-soft)]"
          : "border-[var(--border-default)]"
      }`}
    >
      <h2
        className={`mb-4 border-b border-[var(--border-default)] pb-2 text-base font-bold ${
          highlight ? "text-[var(--primary)]" : "text-[var(--text-main)]"
        }`}
      >
        {title}
      </h2>

      {/* Structured Description Render Block */}
      {description.length > 0 && (
        <div className="mb-4 space-y-2">
          {description.map((desc, idx) => {
            if (desc.type === "heading") {
              return (
                <h3 key={idx} className="text-sm font-semibold text-[var(--text-main)] mt-3">
                  {desc.text}
                </h3>
              );
            }
            return (
              <p key={idx} className="text-sm leading-relaxed text-[var(--text-muted)]">
                {desc.text}
              </p>
            );
          })}
        </div>
      )}

      {/* Ordered Step Array Breakdown */}
      {algorithmSteps.length > 0 && (
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">
            Algorithm Steps
          </h4>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[var(--text-muted)]">
            {algorithmSteps.map((step, idx) => (
              <li key={idx} className="pl-1">{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Raw Isolated Syntax Snippet Block */}
      {codeBlock?.code && (
        <div className="rounded-xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-soft)] p-4">
          <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2 mb-3 text-xs font-mono text-[var(--text-light)]">
            <span>Implementation Snippet</span>
            <span className="rounded bg-[var(--bg-base)] px-1.5 py-0.5 uppercase font-bold">
              {codeBlock.language || "C++"}
            </span>
          </div>
          <pre className="overflow-x-auto font-mono text-xs text-[var(--text-main)] leading-relaxed">
            <code>{codeBlock.code}</code>
          </pre>
        </div>
      )}
    </section>
  );
};

export default ApproachCard;