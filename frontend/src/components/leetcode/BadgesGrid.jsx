import { Award } from "lucide-react";

const BadgesGrid = ({ data }) => {
  if (!data?.badges?.length) return null;

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono mb-4 flex items-center gap-2">
        <Award size={14} className="text-primary" /> Badges ({data.badgesCount})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.badges.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-soft border border-border-default hover:border-primary/30 transition-all duration-200 group"
          >
            {badge.icon ? (
              <img src={badge.icon} alt={badge.displayName} className="h-10 w-10 object-contain group-hover:scale-110 transition-transform" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
                <Award size={18} className="text-primary" />
              </div>
            )}
            <span className="text-[10px] font-semibold text-text-muted text-center leading-tight">{badge.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesGrid;
