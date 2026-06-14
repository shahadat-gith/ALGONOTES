import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardMetrics } from "../../api/userApi";

// Sub-Component Imports
import MetricCards from "../../components/dashboard/MetricCards";
import ContributionGrid from "../../components/dashboard/ContributionGrid";
import RecentActivityStream from "../../components/dashboard/RecentActivityStream";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await getDashboardMetrics();

        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-6 py-5 text-center shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold text-[var(--text-main)]">
            Failed to load dashboard
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
      <MetricCards counters={data.counters} />

      <ContributionGrid activityData={data.activityGrid} />

      <RecentActivityStream
        title="Recently generated notes"
        items={data.recentActivity?.notes || []}
        type="note"
        navigate={navigate}
      />
    </div>
  );
};

export default Dashboard;