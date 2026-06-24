import { Code2 } from "lucide-react";

const LanguagesCard = ({ data }) => {
  const langs = data?.languageProblemCount;
  if (!langs?.length) return null;

  const maxSolved = Math.max(...langs.map((l) => l.problemsSolved), 1);

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono mb-4 flex items-center gap-2">
        <Code2 size={14} className="text-primary" /> Languages
      </h3>
      <div className="space-y-3">
        {langs.map((lang, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-text-main">{lang.languageName}</span>
              <span className="text-xs font-semibold font-mono text-primary">{lang.problemsSolved}</span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-soft overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-700 group-hover:opacity-80"
                style={{ width: `${Math.round((lang.problemsSolved / maxSolved) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesCard;
