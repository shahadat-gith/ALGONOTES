import { Sparkles } from "lucide-react";
import Badge from "../common/Badge";

const levels = [
  { key: "advanced", label: "Advanced", color: "text-danger" },
  { key: "intermediate", label: "Intermediate", color: "text-warning" },
  { key: "fundamental", label: "Fundamental", color: "text-success" },
];

const SkillsCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono mb-4 flex items-center gap-2">
        <Sparkles size={14} className="text-primary" /> Skill Tags
      </h3>
      <div className="space-y-4">
        {levels.map(({ key, label, color }) => {
          const items = data[key];
          if (!items?.length) return null;
          return (
            <div key={key}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${color}`}>{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill, i) => (
                  <Badge key={i} variant="default">{skill.tagName} ({skill.problemsSolved})</Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsCard;
