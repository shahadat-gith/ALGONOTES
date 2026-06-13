import React, { useState } from "react";
import ContributionTooltipModal from "../modals/ContributionTooltipModal";

const ContributionGrid = ({ activityData }) => {
  const [activeDay, setActiveDay] = useState(null);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });

  const getPastYearDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = parseInt(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`, 10);
      days.push({ key, date: d });
    }
    return days;
  };

  const daysArray = getPastYearDays();

  const handleSquareMouseEnter = (e, day, stats) => {
    const rect = e.target.getBoundingClientRect();
    
    // Calculate precise absolute window viewport coordinates
    setModalPos({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
    });
    
    setActiveDay({ date: day.date, stats });
  };

  const getColorDensity = (totalCount) => {
    if (!totalCount) return "bg-[var(--bg-soft)] border-[var(--border-default)]/10";
    if (totalCount <= 1) return "bg-emerald-100/80 border-emerald-200/40 text-emerald-700";
    if (totalCount <= 3) return "bg-emerald-300 border-emerald-400/40";
    if (totalCount <= 5) return "bg-emerald-500 border-emerald-600/40";
    return "bg-emerald-700";
  };

  return (
   <>
    <div className="p-5 bg-white border border-[var(--border-default)]/60 rounded-2xl shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-[var(--border-default)]/40 pb-2">
        <h3 className="text-xs font-bold text-[var(--text-main)]">Workspace Activity Tracking Matrix</h3>
        <span className="text-[10px] text-[var(--text-light)] font-medium">Past 365 Days</span>
      </div>

      {/* Pure horizontal scrolling view layer wrapper - safe from clipping rules now */}
      <div className="overflow-x-auto w-full pt-1 scrollbar-thin">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[820px] max-w-full">
          {daysArray.map((day, idx) => {
            const stats = activityData[day.key] || { total: 0, problems: 0, notes: 0 };
            return (
              <div
                key={idx}
                onMouseEnter={(e) => handleSquareMouseEnter(e, day, stats)}
                onMouseLeave={() => setActiveDay(null)}
                className={`w-3 h-3 rounded-[3px] border transition-all duration-300 cursor-pointer ${getColorDensity(stats.total)}`}
              />
            );
          })}
        </div>
      </div>

     
    </div>

     {/* Render the modal floating at screen level, completely un-clipped */}
      <ContributionTooltipModal 
        activeDay={activeDay} 
        position={modalPos} 
        onClose={() => setActiveDay(null)} 
      />
   </>
  );
};

export default ContributionGrid;