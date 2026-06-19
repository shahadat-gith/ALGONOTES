import React, { useEffect, useMemo, useState } from "react";
import { Activity, Database, FileText, Users } from "lucide-react";

import { getAnalyticsStats } from "../../api/analyticsApi";


const HomeAnalyticsPanel = () => {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAnalyticsStats();
        if (res?.success && res?.stats) {
          setStatsData(res.stats);
        }
      } catch (error) {
        console.error("Analytics fetch failed:", error);
      }
    };

    fetchStats();
  }, []);

  const cards = useMemo(() => {
    if (!statsData) return [];

    return [
      {
        label: "Registered Users",
        value: statsData.totalRegisteredUsers,
        subtitle: "Learners actively using ALGONOTES",
        icon: Users,
      },
      {
        label: "Notes Created",
        value: statsData.totalNotesCreated,
        subtitle: "Total coding and theory notes generated",
        icon: FileText,
      },
      {
        label: "API Requests Served",
        value: statsData.totalApiRequestsServed,
        subtitle: "Requests processed through the backend",
        icon: Activity,
      },
      {
        label: "Platform Visits",
        value: statsData.totalPageVisits,
        subtitle: "Tracked visits across the app",
        icon: Database,
      },
    ];
  }, [statsData]);

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
          Live platform analytics
        </h2>
        <p className="text-sm text-text-muted leading-6 max-w-2xl">
          Transparent metrics that show how the ALGONOTES ecosystem is being used in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {(cards.length ? cards : [1, 2, 3, 4]).map((card, idx) => {
          if (typeof card === "number") {
            return (
              <div key={card} className="rounded-2xl border border-white/10 bg-bg-surface/80 p-5 shadow-[0_8px_28px_rgba(0,0,0,0.35)] animate-pulse">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="mt-4 h-8 w-20 rounded bg-white/10" />
                <div className="mt-3 h-3 w-40 rounded bg-white/10" />
              </div>
            );
          }

          const Icon = card.icon;
          return (
            <article
              key={idx}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-bg-surface/85 to-bg-base/85 p-5 shadow-[0_8px_28px_rgba(0,0,0,0.35)] hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted font-semibold">
                  {card.label}
                </p>
                <div className="h-8 w-8 rounded-lg border border-primary/25 bg-primary/12 text-[#c8bbff] inline-flex items-center justify-center">
                  <Icon size={15} className="stroke-[2]" />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold tracking-tight text-text-main">
                {card.value}
              </p>
              <p className="mt-2 text-xs text-text-muted leading-5">
                {card.subtitle}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};


export default HomeAnalyticsPanel;