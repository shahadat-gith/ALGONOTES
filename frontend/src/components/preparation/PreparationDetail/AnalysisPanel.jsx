import React from "react";
import { FileText, Trophy, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import Badge from "../../common/Badge";

const AnalysisPanel = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Summary Card - Full Width */}
      <div className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={15} className="text-primary stroke-[2]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Summary
          </span>
        </div>
        <p className="text-sm leading-7 text-text-light">
          {analysis.summary || "No summary available."}
        </p>
      </div>

      {/* Stats Blocks - 2 Column Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Strengths */}
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={15} className="text-success stroke-[2]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Strengths
              </span>
            </div>
            {analysis.strengths?.length > 0 ? (
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-light">
                    <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5 stroke-[2]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No strengths identified.</p>
            )}
          </div>
        </div>

        {/* Weaknesses & Gaps */}
        <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={15} className="text-danger stroke-[2]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Weaknesses & Gaps
            </span>
          </div>
          <div className="space-y-4">
            {analysis.weaknesses?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Weaknesses
                </p>
                <ul className="space-y-1.5">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-light">
                      <ShieldAlert size={14} className="text-warning shrink-0 mt-0.5 stroke-[2]" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.missingSkills?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Missing Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((ms, i) => (
                    <Badge key={i} variant="danger" className="text-[11px]">
                      {ms}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(!analysis.weaknesses?.length && !analysis.missingSkills?.length) && (
              <p className="text-sm text-text-muted">No weaknesses or gaps identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;