

import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, FileText, Sparkles, AlertCircle, ArrowRight, Trash2 } from "lucide-react";
import Badge from "../common/Badge";

const ProblemCard = ({ problem, onBookmarkToggle, onDelete }) => {
  const { id, title, platform, difficulty, language, topics, isBookmarked, needsRevision } = problem;

  // Map programmatic difficulty values directly onto your design token badges
  const difficultyVariants = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger",
  };

  return (
    <div className="group relative p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Upper Information Tray */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-light)] select-none">
              {platform}
            </span>
            <Link 
              to={`/problems/${id}`} 
              className="text-lg font-bold text-[var(--text-main)] hover:text-[var(--primary)] transition-colors line-clamp-1 tracking-tight"
            >
              {title} 
            </Link>
          </div>

          {/* Interactive Utility Ring Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onBookmarkToggle(id)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? "text-[var(--warning)] bg-[var(--warning-soft)]" 
                  : "text-[var(--text-light)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-soft)]"
              }`}
            >
              <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} /> 
            </button>
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="p-2 text-[var(--text-light)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-lg transition-colors"
            >
              <Trash2 size={16} /> 
            </button>
          </div>
        </div>

        {/* Dynamic Status Flags Matrix */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={difficultyVariants[difficulty] || "default"}>
            {difficulty} 
          </Badge>
          <span className="px-2 py-0.5 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-soft)] rounded-md">
            {language} 
          </span>
          {needsRevision && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-[var(--danger)] bg-[var(--danger-soft)] rounded-md border border-[var(--danger)]/10 animate-pulse">
              <AlertCircle size={12} />
              Needs Revision 
            </span>
          )}
        </div>

        {/* Problem Tag Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {topics.slice(0, 3).map((topic) => (
            <span 
              key={topic} 
              className="text-xs font-medium px-2 py-0.5 bg-[var(--bg-soft)] text-[var(--text-muted)] rounded-full border border-[var(--border-default)]/40"
            >
              {topic} 
            </span>
          ))}
          {topics.length > 3 && (
            <span className="text-xs font-medium text-[var(--text-light)] pl-1">
              +{topics.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Button Navigation Rows */}
      <div className="pt-4 border-t border-[var(--border-default)]/60 grid grid-cols-2 gap-3">
        <Link 
          to={`/problems/${id}`}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-soft)] hover:bg-[var(--border-strong)]/30 rounded-[var(--radius-md)] transition-colors group"
        >
          <FileText size={14} />
          View Code
        </Link>
        <Link 
          to={`/problems/${id}/generate`}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-md)] shadow-sm shadow-[var(--primary)]/10 transition-colors"
        >
          <Sparkles size={14} />
          AI Notes
        </Link>
      </div>
    </div>
  );
};

export default ProblemCard;