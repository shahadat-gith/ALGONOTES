import React from "react";
import { Lightbulb } from "lucide-react";
import { splitSentence } from "../../../utils/splitSentence";

const Intuition = ({ intuition = "" }) => {
  if (!intuition || !intuition.trim()) return null;

  const sentencesList = splitSentence(intuition);
  
  return (
    <section className="bg-bg-surface border border-border-default rounded-md p-6 shadow-card select-none animate-fade-in">
      
      {/* Section Header */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-default pb-3.5 flex items-center gap-2 font-mono">
        <Lightbulb size={14} className="text-amber-500 stroke-[2]" />
        <span>Core Intuition</span>
      </h2>
      
      {/* Sentences Render Stack */}
      <div className="space-y-4 mt-4">
        {sentencesList.map((sentence, index) => (
          <p 
            key={index} 
            className="text-[14px] md:text-[16px] leading-7 text-text-muted font-normal tracking-wide flex items-start gap-3"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
            <span>{sentence}{sentence.endsWith('.') ? '' : '.'}</span>
          </p>
        ))}
      </div>

    </section>
  );
};

export default Intuition;