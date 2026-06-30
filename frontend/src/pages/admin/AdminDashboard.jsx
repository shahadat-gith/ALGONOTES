import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  BookOpen,
  Activity,
  Eye,
  Server,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import Glow from "../../components/common/Glow";
import adminApi from "../../api/adminApi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getStats();
      if (data?.success) {
        setStats(data.stats);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Admin session expired. Please login again.");
        navigate("/admin/login", { replace: true });
        return;
      }
      toast.error("Failed to load admin stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={40} className="text-text-light" />
        <p className="text-text-muted text-sm">Could not load dashboard data.</p>
        <button
          type="button"
          onClick={fetchStats}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          <RefreshCcw size={14} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      onClick: () => navigate("/admin/users"),
    },
    {
      label: "DSA Notes",
      value: stats.totalCodingNotes,
      icon: FileText,
      color: "text-success",
      bg: "bg-success/10",
      onClick: () => navigate("/admin/notes"),
    },
    {
      label: "Theory Notes",
      value: stats.totalTheoryNotes,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
      onClick: () => navigate("/admin/theories"),
    },
    {
      label: "Total Notes",
      value: stats.totalNotes,
      icon: Activity,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Page Visits",
      value: stats.totalPageVisits?.toLocaleString() || 0,
      icon: Eye,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "API Requests",
      value: stats.totalApiRequests?.toLocaleString() || 0,
      icon: Server,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Requests (24h)",
      value: stats.recentLogsCount24h?.toLocaleString() || 0,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
      onClick: () => navigate("/admin/logs"),
    },
  ];

  return (
    <div className="space-y-8 relative">
      <Glow preset="subtle" />
      <Glow preset="topRight" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Platform overview and key metrics at a glance.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-border-default text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-soft transition-all cursor-pointer"
        >
          <RefreshCcw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={card.onClick}
              className={`bg-bg-surface border border-border-default rounded-xl p-5 shadow-card hover:border-border-strong/60 transition-all duration-300 flex items-center justify-between group text-left ${
                card.onClick ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-light font-mono block">
                  {card.label}
                </span>
                <span className="text-3xl font-bold tracking-tight text-text-main group-hover:text-primary transition-colors duration-300">
                  {card.value}
                </span>
              </div>
              <div className={`p-3.5 ${card.bg} ${card.color} rounded-xl border border-border-default transition-transform duration-300 group-hover:scale-105`}>
                <Icon size={20} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes by Status */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted font-mono mb-4">
            DSA Notes by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.notesByStatus || {}).map(([status, count]) => {
              const statusColors = {
                processing: "bg-warning/10 text-warning border-warning/20",
                draft: "bg-primary/10 text-primary border-primary/20",
                final: "bg-success/10 text-success border-success/20",
                failed: "bg-red-500/10 text-red-400 border-red-500/20",
              };
              const colorClass = statusColors[status] || "bg-bg-soft text-text-muted border-border-default";
              return (
                <div key={status} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {status === "final" ? (
                      <CheckCircle2 size={14} className="text-success" />
                    ) : status === "failed" ? (
                      <AlertCircle size={14} className="text-red-400" />
                    ) : (
                      <Clock size={14} className="text-warning" />
                    )}
                    <span className="text-sm capitalize text-text-main">{status}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${colorClass}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theories by Status */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted font-mono mb-4">
            Theory Notes by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.theoriesByStatus || {}).map(([status, count]) => {
              const statusColors = {
                processing: "bg-warning/10 text-warning border-warning/20",
                draft: "bg-primary/10 text-primary border-primary/20",
                final: "bg-success/10 text-success border-success/20",
                failed: "bg-red-500/10 text-red-400 border-red-500/20",
              };
              const colorClass = statusColors[status] || "bg-bg-soft text-text-muted border-border-default";
              return (
                <div key={status} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {status === "final" ? (
                      <CheckCircle2 size={14} className="text-success" />
                    ) : status === "failed" ? (
                      <AlertCircle size={14} className="text-red-400" />
                    ) : (
                      <Clock size={14} className="text-warning" />
                    )}
                    <span className="text-sm capitalize text-text-main">{status}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${colorClass}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
