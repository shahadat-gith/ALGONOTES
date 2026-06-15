import React from "react";

const SummaryCard = ({ summary = [] }) => {
  if (!summary.length) return null;

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm">
      <h2 className="mb-4 border-b border-[var(--border-default)] pb-2 text-base font-bold text-[var(--text-main)]">
        Problem Summary
      </h2>
      <div className="space-y-3">
        {summary.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed text-[var(--text-muted)]">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
};

export default SummaryCard;