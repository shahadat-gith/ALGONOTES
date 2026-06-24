import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  PlusCircle,
  RefreshCcw,
} from "lucide-react";
import toast from "react-hot-toast";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";
import { getUserDashboard } from "../../api/userApi";

const formatRelativeTime = (value) => {
  if (!value) return "Recently updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";

  const diffInSeconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getUserDashboard();

      if (!data?.success || !data?.dashboard) {
        throw new Error("Dashboard data was unavailable.");
      }

      setDashboard(data.dashboard);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not load your dashboard right now.");
      toast.error("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        id: 1,
        label: "Coding Notes",
        count: dashboard.stats?.totalCodingNotes || 0,
        helper: "Your personal coding notes library",
        icon: Code2,
        color: "text-primary",
        bg: "bg-primary-soft",
      },
      {
        id: 2,
        label: "Theory Notes",
        count: dashboard.stats?.totalTheoryNotes || 0,
        helper: "Your personal theory notes collection",
        icon: FileText,
        color: "text-success",
        bg: "bg-success-soft",
      },
      {
        id: 3,
        label: "Pending Drafts",
        count: dashboard.stats?.pendingDrafts || 0,
        helper: "Notes that still need review before you finalize them",
        icon: Clock,
        color: "text-warning",
        bg: "bg-warning-soft",
      },
    ];
  }, [dashboard]);

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-text-main font-sans select-none animate-fade-in relative z-10">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8 text-text-main font-sans select-none animate-fade-in relative z-10">

      {errorMessage && (
        <Alert
          title="Dashboard Unavailable"
          message={errorMessage}
          variant="danger"
          actionLabel="Try Again"
          onAction={fetchDashboard}
        />
      )}

      {/* 2. Key Platform Statistics Node Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={stat.id}
              className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card hover:border-border-strong/60 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-mono block">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-bold tracking-tight text-text-main group-hover:text-primary transition-colors duration-300">
                    {stat.count}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-text-light flex items-center gap-1 leading-5 max-w-[210px]">
                  {stat.helper}
                </span>
              </div>

              <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-xl border border-border-default transition-transform duration-300 group-hover:scale-105`}>
                <IconComponent size={20} className="stroke-[1.75]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Recent Workspace Activity */}
      <div className="grid grid-cols-1 gap-6 items-start">
        
        <div className="bg-bg-surface border border-border-default rounded-xl shadow-card flex flex-col overflow-hidden">
          <div className="p-5 border-b border-border-default flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-text-muted" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono">
                Recent Workspace Activity
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/notes")}
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors group cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={12} className="transform transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {dashboard?.recentActivity?.length ? (
            <div className="divide-y divide-border-default/60">
              {dashboard.recentActivity.map((note) => (
                <div 
                  key={note.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-bg-soft/30 transition-colors duration-200"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      <span className="text-text-light font-sans font-semibold tracking-normal text-xs">
                        {note.info}
                      </span>
                      <span className="text-text-light/40 select-none">•</span>
                      <span className={`px-1.5 py-0.5 rounded-sm border ${
                        note.type === "DSA" 
                          ? "bg-primary-soft text-primary border-primary/20" 
                          : "bg-bg-soft text-text-muted border-border-default"
                      }`}>
                        {note.type}
                      </span>
                    </div>
                    
                    <h3 
                      onClick={() => navigate(note.href)}
                      className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors cursor-pointer truncate max-w-xl"
                    >
                      {note.title}
                    </h3>

                    <p className="text-[11px] text-text-light font-medium truncate max-w-lg">
                      {note.type === "DSA" ? "Coding note ready for revision." : "Theory note ready for revision."}
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-text-light tracking-wide order-2 sm:order-1">
                      {formatRelativeTime(note.updatedAt)}
                    </span>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] bold font-mono uppercase tracking-wider order-1 sm:order-2 ${
                      note.status === "final" 
                        ? "bg-success/10 text-success border border-success/20" 
                        : "bg-warning/10 text-warning border border-warning/20"
                    }`}>
                      {note.status === "final" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                      <span>{note.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-text-light">
              No recent study activity yet. Create your first note to get started.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;