import React, { useState } from "react";
import ContributionTooltipModal from "../modals/ContributionTooltipModal";

const ContributionGrid = ({ activityData = {} }) => {
  const [activeDay, setActiveDay] = useState(null);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });

  const getPastThreeMonthsDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const key = parseInt(
        `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
          d.getDate()
        ).padStart(2, "0")}`,
        10
      );

      days.push({ key, date: d });
    }

    return days;
  };

  const daysArray = getPastThreeMonthsDays();

  const handleSquareMouseEnter = (e, day, stats) => {
    const rect = e.target.getBoundingClientRect();

    setModalPos({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
    });

    setActiveDay({ date: day.date, stats });
  };

  const getColorDensity = (totalCount) => {
    if (!totalCount) {
      return "bg-[var(--bg-soft)] border-[var(--border-default)]";
    }

    if (totalCount <= 1) {
      return "bg-emerald-100 border-emerald-200";
    }

    if (totalCount <= 3) {
      return "bg-emerald-300 border-emerald-400";
    }

    if (totalCount <= 5) {
      return "bg-emerald-500 border-emerald-600";
    }

    return "bg-emerald-700 border-emerald-800";
  };

  return (
    <>
      <div className="space-y-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
          <h3 className="text-xs font-bold text-[var(--text-main)]">
            Notes Activity
          </h3>

          <span className="text-[10px] font-medium text-[var(--text-light)]">
            Last 3 Months
          </span>
        </div>

        <div className="w-full overflow-x-auto pt-1">
          <div className="grid min-w-[360px] grid-flow-col grid-rows-7 gap-1.5">
            {daysArray.map((day) => {
              const stats = activityData[day.key] || {
                total: 0,
                notes: 0,
              };

              return (
                <div
                  key={day.key}
                  onMouseEnter={(e) =>
                    handleSquareMouseEnter(e, day, stats)
                  }
                  onMouseLeave={() => setActiveDay(null)}
                  className={`h-3 w-3 cursor-pointer rounded-[3px] border transition-all duration-300 ${getColorDensity(
                    stats.total
                  )}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <ContributionTooltipModal
        activeDay={activeDay}
        position={modalPos}
        onClose={() => setActiveDay(null)}
      />
    </>
  );
};

export default ContributionGrid;