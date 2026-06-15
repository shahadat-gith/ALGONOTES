import React from "react";
import { Link } from "react-router-dom";
import Badge from "../../common/Badge";
import { 
  MessageSquareCode, 
  Calendar, 
  Edit3, 
  BookOpen, 
  ArrowRight,
  Code2
} from "lucide-react";

const NoteCard = ({ noteItem }) => {
  // 1. Core Fix: Extract noteId directly for your single-view router definitions
  const currentNoteId = noteItem.noteId;

  // Safely capture the lightweight problem schema properties passed into the dashboard feed
  const problemTitle = noteItem.problem?.title || "Untitled Problem";
  const platformName = noteItem.problem?.platform || "Other";
  const difficulty = noteItem.problem?.difficulty || "Medium";
  const selectedLanguage = noteItem.language || "C++";

  // 2. Structural Fix: Extract paragraph preview string out of nested polymorphism blocks
  const getNotePreview = () => {
    // If the note doesn't exist or is currently unpopulated, return immediate fallback
    if (!noteItem.note) return "Click view details to examine your saved code logic.";

    const targetBlocks = noteItem.note.optimalApproach?.length 
      ? noteItem.note.optimalApproach 
      : noteItem.note.bruteForce;

    if (!targetBlocks || !targetBlocks.length) {
      return "No preview commentary available for this note yet.";
    }
    
    // Scan structure arrays for paragraph strings
    const paragraphBlock = targetBlocks.find(b => b.type === "paragraph" && b.text);
    if (paragraphBlock) return paragraphBlock.text;
    
    const headingBlock = targetBlocks.find(b => b.type === "heading" && b.text);
    return headingBlock ? headingBlock.text : "Click view details to examine your saved code logic.";
  };

  const previewText = getNotePreview();

  // Dynamic status tag mappings
  const difficultyVariants = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger",
  };

  // 3. Fix: Parse lastEditedAt fallback to createdAt dynamically
  const timestampToFormat = noteItem.lastEditedAt || noteItem.createdAt;
  const formattedDate = timestampToFormat 
    ? new Date(timestampToFormat).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Recently";

  return (
    <article className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-200 relative flex flex-col justify-between space-y-4 group">
      
      {/* Post Header Layout */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          
          {/* Code avatar graphic block */}
          <div className="h-10 w-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
            <MessageSquareCode size={18} />
          </div>
          
          <div>
            <Link
              to={`/notes/${currentNoteId}/view`}
              className="font-bold text-base tracking-tight text-[var(--text-main)] hover:text-[var(--primary)] transition-colors block leading-tight"
            >
              {problemTitle}
            </Link>

            {/* Sub-label Metadata Tag Matrix Strip */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-[var(--text-light)] font-semibold mt-1.5">
              <span className="text-[var(--text-muted)] uppercase tracking-wider font-bold">
                {platformName}
              </span>
              <span>•</span>
              <Badge
                variant={difficultyVariants[difficulty] || "default"}
                className="px-1.5 py-0 scale-95 text-[10px]"
              >
                {difficulty}
              </Badge>
              <span>•</span>
              <div className="flex items-center gap-1 font-medium text-[var(--text-muted)]">
                <Code2 size={12} className="text-[var(--primary)]" />
                <span>{selectedLanguage}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 font-medium">
                <Calendar size={12} />
                <span>Updated {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Pipeline Note Progress Tracking State indicator */}
        <Badge variant={noteItem.status === "final" ? "success" : "warning"}>
          {noteItem.status}
        </Badge>
      </div>

      {/* Main Preview Paragraph Node Layer */}
      <div className="text-sm text-[var(--text-muted)] leading-relaxed pl-1 sm:pl-13">
        <p className="line-clamp-2 group-hover:text-[var(--text-main)] transition-colors duration-150">
          {previewText}
        </p>

        {previewText.length > 140 && (
          <Link
            to={`/notes/${currentNoteId}/view`}
            className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] inline-flex items-center gap-0.5 mt-2 transition-colors group/link"
          >
            Read More
            <ArrowRight
              size={12}
              className="transition-transform group-hover/link:translate-x-0.5"
            />
          </Link>
        )}
      </div>

      {/* Utility Footer Action Row Controller */}
      <div className="pt-3 border-t border-[var(--border-default)]/40 flex items-center justify-between text-xs text-[var(--text-light)] pl-1 sm:pl-13">
        <span className="font-medium italic select-none hidden sm:inline text-[var(--text-light)]">
          AI Generated
        </span>
        <div className="sm:hidden" />
        
        <div className="flex items-center gap-1.5">
          <Link
            to={`/notes/${currentNoteId}/edit`}
            className="inline-flex items-center gap-1 px-3 py-1.5 font-bold rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-soft)] transition-colors border border-transparent"
          >
            <Edit3 size={14} />
            Edit
          </Link>

          <Link
            to={`/notes/${currentNoteId}/view`}
            className="inline-flex items-center gap-1 px-3 py-1.5 font-bold rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
          >
            <BookOpen size={14} />
            View Note
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;