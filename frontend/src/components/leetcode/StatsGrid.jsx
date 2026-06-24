import { CheckCircle2, Zap, BarChart3, Target } from "lucide-react";

const StatCard = ({ label, value, subtitle, icon: Icon, color, bg }) => (
  <div className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card hover:border-border-strong/60 transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-mono">{label}</span>
      <div className={`p-2.5 rounded-lg ${bg} ${color} group-hover:scale-105 transition-transform`}>
        <Icon size={16} className="stroke-[1.75]" />
      </div>
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className="text-3xl font-bold tracking-tight text-text-main">{value}</span>
      {subtitle && <span className="text-xs text-text-muted">/ {subtitle}</span>}
    </div>
  </div>
);

const StatsGrid = ({ data }) => {
  if (!data) return null;

  const maxSolved = data.easySolved + data.mediumSolved + data.hardSolved;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Solved"
        value={maxSolved}
        subtitle={`${data.acSubmissionNum?.[0]?.submissions || 0} submissions`}
        icon={CheckCircle2}
        color="text-primary"
        bg="bg-primary-soft"
      />
      <StatCard label="Easy" value={data.easySolved} icon={Zap} color="text-success" bg="bg-success-soft" />
      <StatCard label="Medium" value={data.mediumSolved} icon={BarChart3} color="text-warning" bg="bg-warning-soft" />
      <StatCard label="Hard" value={data.hardSolved} icon={Target} color="text-danger" bg="bg-danger-soft" />
    </div>
  );
};

export default StatsGrid;
