import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Edit2, Trash2, Calendar, FileText } from "lucide-react";
import Badge from "../common/Badge";

const statusVariantMap = {
  draft: "warning",
  final: "success",
};

const formatDate = (date) => {
  if (!date) return "Recent";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Recent";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTextSnippet = (htmlString) => {
  if (!htmlString || htmlString.trim() === "")
    return "No content preview available.";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const firstParagraph = tempDiv.querySelector("p");

  const text = firstParagraph
    ? firstParagraph.textContent || firstParagraph.innerText
    : tempDiv.textContent || tempDiv.innerText || "";

  return text.trim();
};

const TheoryCard = ({ theory, onDelete }) => {
  const { _id: id, topic, status, content, createdAt } = theory;
  const navigate = useNavigate();

  return (
    <div className="group bg-bg-surface border border-border-default rounded-xl p-5 shadow-card hover:border-border-strong/60 transition-all duration-200 flex flex-col justify-between gap-4 w-full relative font-sans">
      {/* Top Section: Meta Badges & Title Layout */}
      <div className="space-y-2 min-w-0 w-full">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {status !== "final" && (
            <Badge
              variant={statusVariantMap[status?.toLowerCase()] || "default"}
            >
              {status}
            </Badge>
          )}
        </div>

        <h3
          onClick={() => navigate(`/theory/${id}`)}
          className="text-base font-semibold text-text-main group-hover:text-primary transition-colors tracking-wide leading-snug truncate cursor-pointer"
          title={topic}
        >
          {topic}
        </h3>

        {content && (
          <p className="text-xs text-text-muted leading-relaxed tracking-wide font-sans  max-w-4xl">
            {getTextSnippet(content)}
          </p>
        )}
      </div>

      {/* Bottom Section: Footer Metas (Left) & Action Handles (Right) */}
      <div className="border-t border-border-default/60 pt-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        {/* Technical Info (Bottom Left) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-mono text-text-light">
          <span className="flex items-center gap-1.5">
            <FileText size={12} className="text-text-muted stroke-[1.75]" />
            <span className="font-sans font-medium text-text-muted tracking-wide">
              Theory Note
            </span>
          </span>
          <span className="text-text-light/40 select-none">•</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-text-muted stroke-[1.75]" />
            <span>{formatDate(createdAt)}</span>
          </span>
        </div>

        {/* Action Handles matching NoteCard layout style (Bottom Right) */}
        <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => navigate(`/theory/${id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-muted hover:bg-primary-soft hover:text-primary transition-all cursor-pointer"
          >
            <BookOpen size={13} className="stroke-[1.75]" />
            <span>Read</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/theory/${id}/edit`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-muted hover:bg-bg-soft hover:text-text-main transition-all cursor-pointer"
          >
            <Edit2 size={13} className="stroke-[1.75]" />
            <span>Edit</span>
          </button>

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

export default TheoryCard;
