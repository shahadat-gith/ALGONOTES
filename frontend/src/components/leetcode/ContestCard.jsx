import { Trophy, Medal, Calendar, TrendingUp, Globe, Percent } from "lucide-react";

const iconMap = {
  "Attended": Calendar,
  "Rating": TrendingUp,
  "Global Rank": Globe,
  "Top %": Percent,
};

const colorMap = {
  "Attended": "text-primary bg-primary-soft",
  "Rating": "text-warning bg-warning-soft",
  "Global Rank": "text-success bg-success-soft",
  "Top %": "text-danger bg-danger-soft",
};

const Stat = ({ label, value }) => {
  const Icon = iconMap[label] || Trophy;
  const colors = colorMap[label] || "text-text-muted bg-bg-soft";
  return (
    <div className="p-3.5 rounded-lg bg-bg-soft border border-border-default hover:border-border-strong/50 transition-colors group">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted font-mono">{label}</p>
        <div className={`p-1.5 rounded-md ${colors} group-hover:scale-105 transition-transform`}>
          <Icon size={12} className="stroke-[2]" />
        </div>
      </div>
      <p className="text-xl font-bold text-text-main">{value}</p>
    </div>
  );
};

const ContestCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono mb-4 flex items-center gap-2">
        <Trophy size={14} className="text-warning" /> Contest Ranking
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Attended" value={data.contestAttend || 0} />
        <Stat label="Rating" value={data.contestRating ? Math.round(data.contestRating) : "N/A"} />
        <Stat label="Global Rank" value={data.contestGlobalRanking ? `#${data.contestGlobalRanking.toLocaleString()}` : "N/A"} />
        <Stat label="Top %" value={data.contestTopPercentage ? `${data.contestTopPercentage}%` : "N/A"} />
      </div>
      {data.contestBadges?.name && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-warning-soft/20 to-transparent border border-warning/20 hover:border-warning/40 transition-colors">
          <Medal size={16} className="text-warning shrink-0" />
          <span className="text-sm font-medium text-text-main">{data.contestBadges.name}</span>
        </div>
      )}
    </div>
  );
};

export default ContestCard;
