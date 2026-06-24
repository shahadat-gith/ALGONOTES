import { Clock, CheckCircle2, XCircle } from "lucide-react";

const formatDate = (ts) => {
  if (!ts) return "N/A";
  return new Date(ts * 1000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const SubmissionsCard = ({ submissions = [] }) => {
  if (!submissions.length) return null;

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono mb-4 flex items-center gap-2">
        <Clock size={14} className="text-primary" /> Recent Submissions
      </h3>
      <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar">
        {submissions.map((sub, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-soft border border-border-default hover:border-border-strong/50 transition-colors">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-sm font-medium text-text-main truncate">{sub.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-text-light">{sub.lang}</span>
                <span className="text-[10px] text-text-light">{formatDate(sub.timestamp)}</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              sub.statusDisplay === "Accepted" ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
            }`}>
              {sub.statusDisplay === "Accepted" ? (
                <span className="flex items-center gap-1"><CheckCircle2 size={10} /> AC</span>
              ) : (
                <span className="flex items-center gap-1"><XCircle size={10} /> WA</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsCard;
