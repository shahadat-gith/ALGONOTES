import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Edit2, Trash2, Calendar, FileText } from "lucide-react";
import Button from "../../common/Button";
import Badge from "../../common/Badge";

const TheoryCard = ({ theory, onDelete }) => {
  const { _id:id, topic, status, content, createdAt } = theory;
  const navigate = useNavigate();

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";


 // Extracts only the content from the first paragraph tag for a clean summary
  const getTextSnippet = (htmlString) => {
    if (!htmlString || htmlString.trim() === "") return "No content preview available.";
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    
    // Find the very first semantic paragraph node inside the document string
    const firstParagraph = tempDiv.querySelector("p");
    

    const text = firstParagraph 
      ? firstParagraph.textContent || firstParagraph.innerText
      : tempDiv.textContent || tempDiv.innerText || "";

   return text.trim();
  };
  const statusVariantMap = {
    draft: "warning",
    final: "success",
  };

  return (
    <div className="w-full bg-bg-surface border border-border-default hover:border-border-strong rounded-md p-5 flex flex-col gap-3 shadow-xs hover:shadow-md group transition-all duration-300 font-sans">
      
      {/* Main Structural Row Container */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 min-w-0">
        
        {/* Left Hand: Icon, Title, and Metadata Stack */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="p-2 bg-bg-soft border border-border-default text-text-muted group-hover:text-primary group-hover:border-primary/20 rounded-sm mt-0.5 transition-colors duration-300 flex-shrink-0">
            <FileText size={16} />
          </div>
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <h3
              onClick={() => navigate(`/theory/${id}`)}
              className="text-text-main font-bold text-sm truncate cursor-pointer hover:text-primary transition-colors duration-200"
              title={topic}
            >
              {topic}
            </h3>
            
            {/* Metadata Badges line right below title element block */}
            <div className="flex items-center gap-2.5 text-text-light text-[11px]">
              <div className="flex items-center gap-1">
                <Calendar size={11} />
                <span>{formattedDate}</span>
              </div>
              <Badge variant={statusVariantMap[status?.toLowerCase()] || "default"} className="uppercase scale-90 origin-left">
                {status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Hand: Buttons packed closely together at the top-right corner */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/theory/${id}/details`)}
            title="Read Study Note"
          >
            <BookOpen size={13} />
            <span>Read</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/theory/${id}/edit`)}
            title="Edit Content Workspace"
          >
            <Edit2 size={13} />
            <span>Edit</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDelete(id)}
            className="text-text-light hover:text-danger hover:bg-danger-soft hover:border-danger/20!"
            title="Delete note permanently"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Expanded Description text rendering area directly underneath headers */}
      <p className="text-text-muted text-[12.5px] leading-relaxed line-clamp-3 sm:line-clamp-2 px-1 pl-11">
        {getTextSnippet(content)}
      </p>

    </div>
  );
};

export default TheoryCard;