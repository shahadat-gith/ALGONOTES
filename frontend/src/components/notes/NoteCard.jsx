import React from "react";
import { Link } from "react-router-dom";
import { Edit3, Eye, Trash2, Calendar, Code2 } from "lucide-react";
import Badge from "../common/Badge";

const difficultyVariant = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

const formatDate = (date) => {
  if (!date) return "Recently";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Recently";

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NoteCard = ({ note, onDelete }) => {
  const {
    _id: id,
    problem = {},
    language = "C++",
    status = "draft",
    createdAt,
    updatedAt,
  } = note;
  const title = problem.title || "Untitled Problem";
  const description = problem.description || "";
  const platform = problem.platform || "Other";
  const difficulty = problem.difficulty || "Medium";

  return (
    <div className="group bg-bg-surface border border-border-default rounded-xl p-5 shadow-card hover:border-border-strong/60 transition-all duration-200 flex flex-col justify-between gap-4 w-full relative">
      
      {/* Top Section: Meta Badges & Title Layout */}
      <div className="space-y-2 min-w-0 w-full">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-text-muted font-medium truncate max-w-[120px] tracking-wide">
            {platform}
          </span>
          <span className="text-text-light/40 select-none">•</span>
          <Badge variant={difficultyVariant[difficulty] || "default"}>
            {difficulty}
          </Badge>

          {status !== "final" && (
            <>
              <span className="text-text-light/40 select-none">•</span>
              <Badge variant="warning">
                {status}
              </Badge>
            </>
          )}
        </div>

        <h3 className="text-base font-semibold text-text-main group-hover:text-primary transition-colors tracking-wide leading-snug truncate">
          <Link to={`/notes/${id}`} className="focus:outline-hidden">
            {title}
          </Link>
        </h3>

        {description && (
          <p className="text-xs text-text-muted leading-relaxed tracking-wide font-sans max-w-4xl">
            {description}
          </p>
        )}
      </div>

      {/* Bottom Section: Footer Metas (Left) & Action Handles (Right) */}
      <div className="border-t border-border-default/60 pt-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        
        {/* Technical Info (Bottom Left) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-mono text-text-light">
          <span className="flex items-center gap-1">
            <Code2 size={12} className="text-text-muted stroke-[1.75]" />
            <span>{language}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-text-muted stroke-[1.75]" />
            <span>{formatDate(updatedAt || createdAt)}</span>
          </span>
        </div>

        {/* Action Handles (Bottom Right) */}
        <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
          <Link
            to={`/notes/${id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-muted hover:bg-primary-soft hover:text-primary transition-all"
          >
            <Eye size={13} className="stroke-[1.75]" />
            <span>Read</span>
          </Link>

          <Link
            to={`/notes/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-muted hover:bg-bg-soft hover:text-text-main transition-all"
          >
            <Edit3 size={13} className="stroke-[1.75]" />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            onClick={() => onDelete(id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-muted hover:bg-danger/10 hover:text-danger transition-all cursor-pointer"
          >
            <Trash2 size={13} className="stroke-[1.75]" />
            <span>Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoteCard;