import React from "react";
import { Brain } from "lucide-react";

const ApplicationHero = ({ company, role, matchScore }) => {
  return (
    <div className="w-full rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Brain size={12} className="stroke-[2.2]" />
            <span>Interview Preparation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            {company}
          </h1>
          <p className="text-sm text-text-muted flex items-center gap-2">
            <span className="text-primary">•</span>
            {role}
          </p>
        </div>

        {matchScore !== undefined && (
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="6"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={2 * Math.PI * 30 * (1 - matchScore / 100)}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8a79ff" />
                    <stop offset="100%" stopColor="#6f7cff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-text-main">{matchScore}%</span>
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              Match
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationHero;