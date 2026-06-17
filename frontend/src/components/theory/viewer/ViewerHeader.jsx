import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";

const ViewerHeader = ({ topic, onBackClick }) => {
  return (
    <div className="flex items-center gap-4 border-b border-border-default pb-4 mb-6 font-mono select-none flex-shrink-0">
      
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          <BookOpen size={12} />
          <span>Comprehensive Theory on</span>
        </div>
        <h1 className="text-xl font-bold text-text-main tracking-wide truncate mt-0.5">
          {topic}
        </h1>
      </div>
    </div>
  );
};

export default ViewerHeader;