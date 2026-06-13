import React from "react";
import { Link } from "react-router-dom";
import Badge from "../../common/Badge";
import { 
  MessageSquareCode, 
  Calendar, 
  Edit3, 
  BookOpen, 
  ArrowRight 
} from "lucide-react";

const NoteCard = ({ noteItem }) => {
  // Safely grab the nested problem document properties
  const problemId = noteItem.problem?.id;
  const problemTitle = noteItem.problem?.title || "Unknown Problem";
  const platformName = noteItem.problem?.platform || "Other";
  const difficulty = noteItem.problem?.difficulty || "Medium";

  // Compute a clean text preview snippet from the note content arrays
  const getNotePreview = () => {
    // Check optimal approach first, fallback to brute force
    const blocks = noteItem.optimalApproach?.length ? noteItem.optimalApproach : noteItem.bruteForce;
    if (!blocks || !blocks.length) return "No preview commentary available for this note yet.";
    
    // Grab the first available paragraph block text
    const paragraphBlock = blocks.find(b => b.type === "paragraph" && b.text);
    if (paragraphBlock) return paragraphBlock.text;
    
    // Fallback to header text block if no paragraph exists
    const headingBlock = blocks.find(b => b.type === "heading" && b.text);
    return headingBlock ? headingBlock.text : "Click view details to examine the saved code logic.";
  };

  const previewText = getNotePreview();

  const difficultyVariants = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger",
  };

  return (
    <article className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-200 relative flex flex-col justify-between space-y-4 group">
      
      {/* Post Header Layout */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Stylized code avatar icon */}
          <div className="h-10 w-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
            <MessageSquareCode size={18} />
          </div>
          <div>
            <Link
              to={`/notes/${problemId}/view`}
              className="font-bold text-base tracking-tight text-[var(--text-main)] hover:text-[var(--primary)] transition-colors block leading-tight"
            >
              {problemTitle}
            </Link>

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
              <div className="flex items-center gap-1 font-medium">
                <Calendar size={12} />
                <span>
                  Updated {new Date(noteItem.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Badge variant={noteItem.status === "final" ? "success" : "warning"}>
          {noteItem.status}
        </Badge>
      </div>

      {/* Main Text Content Paragraph Block */}
      <div className="text-sm text-[var(--text-muted)] leading-relaxed pl-1 sm:pl-13">
        <p className="line-clamp-3 group-hover:text-[var(--text-main)] transition-colors duration-150">
          {previewText}
        </p>

        {previewText.length > 140 && (
          <Link
            to={`/notes/${problemId}/view`}
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

      {/* Footer Action Row Container */}
      <div className="pt-3 border-t border-[var(--border-default)]/40 flex items-center justify-between text-xs text-[var(--text-light)] pl-1 sm:pl-13">
        <span className="font-medium italic select-none hidden sm:inline">
          AI Generated Note
        </span>
        <div className="sm:hidden" />
        
        <div className="flex items-center gap-1.5">
          <Link
            to={`/notes/${problemId}/edit`}
            className="inline-flex items-center gap-1 px-3 py-1.5 font-bold rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-soft)] transition-colors border border-transparent"
          >
            <Edit3 size={14} />
            Edit Note
          </Link>

          <Link
            to={`/notes/${problemId}/view`}
            className="inline-flex items-center gap-1 px-3 py-1.5 font-bold rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
          >
            <BookOpen size={14} />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;