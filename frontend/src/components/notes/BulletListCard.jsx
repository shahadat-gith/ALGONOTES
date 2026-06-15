import React from "react";

const BulletListCard = ({ title, items = [], variant = "default" }) => {
  if (!items.length) return null;

  const isDanger = variant === "danger";

  return (
    <section
      className={`rounded-2xl border bg-[var(--bg-surface)] p-6 shadow-sm ${
        isDanger ? "border-[var(--danger-soft)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--danger-soft)]/5" : "border-[var(--border-default)]"
      }`}
    >
      <h2
        className={`mb-4 border-b border-[var(--border-default)] pb-2 text-base font-bold ${
          isDanger ? "text-[var(--danger)]" : "text-[var(--text-main)]"
        }`}
      >
        {title}
      </h2>
      <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                isDanger ? "bg-[var(--danger)]" : "bg-[var(--primary)]"
              }`}
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BulletListCard;