import React from "react";
import { Menu } from "lucide-react";

import Glow from "../common/Glow";

import "./TopicExplanation.css";

const TopicExplanationLayout = ({
  toc = [],
  activeSection = "",
  onNavigate,
  children,
}) => {
  return (
    <div className="relative flex h-screen overflow-hidden bg-bg-base text-text-main">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <aside className="hidden h-full w-[280px] shrink-0 border-r border-border-default/60 bg-bg-surface/40 lg:flex lg:flex-col">
        <div className="flex items-center gap-2 border-b border-border-default/60 px-5 py-4">
          <Menu size={14} className="text-primary" />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-light">
            Table of Contents
          </span>
        </div>

        <nav className="custom-sidebar-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {toc.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate?.(item.id)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-all ${
                activeSection === item.id
                  ? " bg-primary-soft pl-[10px] font-semibold text-primary"
                  : "text-text-muted hover:bg-bg-soft/40 hover:text-text-main"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="topic-explanation-main custom-sidebar-scrollbar flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1000px] pb-16">{children}</div>
      </main>
    </div>
  );
};

export default TopicExplanationLayout;
