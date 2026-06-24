import { Activity } from "lucide-react";

const sections = [
  { label: "Easy", key: 1, bar: "bg-success", bg: "bg-success-soft/30", textColor: "text-success" },
  { label: "Medium", key: 2, bar: "bg-warning", bg: "bg-warning-soft/30", textColor: "text-warning" },
  { label: "Hard", key: 3, bar: "bg-danger", bg: "bg-danger-soft/30", textColor: "text-danger" },
];

const ProgressBars = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono mb-4 flex items-center gap-2">
        <Activity size={14} className="text-primary" /> Submission Progress
      </h3>
      <div className="space-y-4">
        {sections.map(({ label, key, bar, bg, textColor }) => {
          const solved = data[`${label.toLowerCase()}Solved`] ?? 0;
          const total = data.acSubmissionNum?.[key]?.submissions || 0;
          const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

          return (
            <div key={label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${textColor}`}>{label}</span>
                <span className="font-mono text-text-light">{solved} / {total} ({pct}%)</span>
              </div>
              <div className={`h-2.5 rounded-full ${bg} overflow-hidden`}>
                <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBars;
