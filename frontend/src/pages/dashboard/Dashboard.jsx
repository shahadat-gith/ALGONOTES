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
          console.log(response.data)
        }
      } catch (error) {
        console.error("Failed to load dashboard operational metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data)
    return (
      <div className="text-center py-20 text-xs font-bold text-[var(--text-muted)]">
        Failed to fetch data from backend.
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      <MetricCards counters={data.counters} />
      <ContributionGrid activityData={data.activityGrid} />
      <RecentActivityStream
        title="Recent Notes Study Blocks"
        items={data.recentActivity.notes}
        type="note"
        navigate={navigate}
      />

      <RecentActivityStream
        title="Recent Problems Added"
        items={data.recentActivity.problems}
        type="problem"
        navigate={navigate}
      />
    </div>
  );
};

export default Dashboard;
