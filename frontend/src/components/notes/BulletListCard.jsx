import React from "react";
import { ListMinus, AlertOctagon } from "lucide-react";

const BulletListCard = ({ title, items = [], variant = "default" }) => {
  if (!items.length) return null;

  const isDanger = variant === "danger";

  return (
    <section
      className={`rounded-md border p-6 shadow-card bg-bg-surface select-none transition-all duration-300 ${
        isDanger
          ? "border-danger/30 ring-1 ring-danger-soft/30 bg-gradient-to-b from-bg-surface to-danger-soft/2"
          : "border-border-default"
      }`}
    >
      {/* Card Section Header */}
      <h2
        className={`text-xs font-bold uppercase tracking-widest border-b pb-3.5 flex items-center gap-2 font-mono ${isDanger ? "text-danger border-danger/20" : "text-text-main border-border-default"
        }`}
        >
        {isDanger ? (
          <AlertOctagon size={14} className="text-danger stroke-[2]" />
        ) : (
          <ListMinus size={14} className="text-text-light stroke-[2]" />
        )}
        <span>{title}</span>
      </h2>

      {/* Bullet Items Collection Flow Stack */}
      <ul className="space-y-3 mt-4 text-xs text-text-muted">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 leading-6 tracking-wide">
            {/* Custom High-Contrast Indicator Capsule */}
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-transform group-hover:scale-110 ${
                isDanger ? "bg-danger shadow-xs shadow-danger/40" : "bg-primary shadow-xs shadow-primary/40"
              }`}
            />
            <span className="font-normal">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BulletListCard;