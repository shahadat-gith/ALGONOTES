import React from "react";
import BlockRenderer from "./BlockRenderer";

const ExplanationSection = ({ section }) => {
  if (!section) return null;

  return (
    <section id={section.id} className="scroll-mt-16">
      <h2
        id={`heading-${section.id}`}
        className="group mb-6 flex items-center gap-3 text-xl font-bold tracking-tight text-text-main"
      >
        <span className="text-primary">#</span>
        {section.title}
      </h2>

      <div className="explanation-section-content">
        {section.blocks?.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
};

export default ExplanationSection;
