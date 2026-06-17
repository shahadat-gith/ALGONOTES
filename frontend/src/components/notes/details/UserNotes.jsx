import React from "react";
import { StickyNote, HelpCircle } from "lucide-react";
import { splitSentence } from "../../../utils/splitSentence";

const UserNotes = ({ userNotes }) => {
  if (!userNotes || !userNotes.trim()) return null;

  const notesList = splitSentence(userNotes);

  return (
    <div className="bg-bg-surface border border-border-default rounded-md shadow-card overflow-hidden animate-fade-in">
      {/* Header section with clean layout accent */}
      <div className="flex items-center justify-between border-b border-border-default bg-bg-soft/20 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-sm bg-primary/10 text-primary">
            <StickyNote size={14} className="stroke-[2]" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-main font-mono">
            Your Observations & Notes
          </h3>
        </div>
        
        <div className="flex items-center gap-1.5 text-text-light hover:text-text-muted transition-colors cursor-help group relative">
          <HelpCircle size={14} className="stroke-[2]" />
          <span className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-bg-inverse text-text-inverse text-[10px] font-medium tracking-wide px-2 py-1 rounded-sm whitespace-nowrap shadow-md z-30 font-sans">
            AI-optimized translation of your rough notes
          </span>
        </div>
      </div>

      {/* Content wrapper panel */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-bg-surface to-bg-soft/10">
        <ul className="space-y-4 machine-list">
          {notesList.map((note, index) => (
            <li 
              key={index} 
              className="flex items-start gap-3 text-[14px] md:text-[16px] leading-7 text-text-muted font-normal tracking-wide font-sans"
            >
              {/* Premium custom bullet point marker to align with theme */}
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>{note}{note.endsWith('.') ? '' : '.'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserNotes;