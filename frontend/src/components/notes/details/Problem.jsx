import React from "react";
import { ExternalLink, AlertCircle, Cpu } from "lucide-react";
import Badge from "../../common/Badge";

const Problem = ({ problem }) => {
  if (!problem) return null;

  const difficultyVariant = {
    easy: "success",
    medium: "warning",
    hard: "danger",
  };

  const hasComplexity = problem.expectedTimeComplexity || problem.expectedSpaceComplexity;

  return (
    <div className="bg-bg-surface border border-border-default rounded-md p-6 space-y-6 select-none shadow-card">

      {/* Header */}
      <div className="border-b border-border-default pb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-light">
            {problem.platform || "Platform"}
          </span>

          <Badge
            variant={
              difficultyVariant[
                problem.difficulty?.toLowerCase()
              ] || "default"
            }
            className="text-[10px] px-2 py-0.5"
          >
            {problem.difficulty || "Unknown"}
          </Badge>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-text-main tracking-wide leading-tight">
            {problem.title || "Untitled Problem"}
          </h1>

          {problem.problemLink && (
            <a
              href={problem.problemLink}
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-text-light hover:text-primary transition-colors shrink-0 group/link"
            >
              <ExternalLink size={15} className="stroke-[1.75] text-text-light group-hover/link:text-primary transition-colors" />
            </a>
          )}
        </div>
      </div>

      {/* Description - Updated text baseline: 14px on mobile, scales to 16px on desktop */}
      {problem.description && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-light font-mono">
            Description
          </h3>
          <p className="text-[14px] md:text-[16px] leading-7 text-text-muted whitespace-pre-wrap font-normal tracking-wide">
            {problem.description}
          </p>
        </div>
      )}

      {/* Constraints - List items updated to 14px on mobile, 16px on desktop */}
      {problem.constraints?.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main font-mono">
            <AlertCircle size={14} className="text-text-light stroke-[2]" />
            <span>Constraints</span>
          </h3>

          <div className="rounded-sm bg-bg-soft/40 border border-border-default/60 p-4">
            <ul className="space-y-2.5 text-[14px] md:text-[16px] text-text-muted font-mono leading-relaxed">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="tracking-wide">• {constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Examples - Code properties use custom sizing, explanation uses 14px to 16px split */}
      {problem.testCases?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-light font-mono">
            Examples
          </h3>

          <div className="space-y-4">
            {problem.testCases.map((testCase, index) => (
              <div
                key={index}
                className="rounded-sm border border-border-default p-4 space-y-3.5 bg-bg-soft/20"
              >
                <div className="text-[10px] font-mono font-bold text-text-light uppercase tracking-widest border-b border-border-default/40 pb-1.5">
                  Example {index + 1}
                </div>

                <div className="font-mono text-[13px] md:text-[14px] space-y-2 text-text-muted">
                  <p className="tracking-wide">
                    <span className="text-text-light font-semibold">Input:</span>{" "}
                    {testCase.input}
                  </p>
                  <p className="tracking-wide">
                    <span className="text-text-light font-semibold">Output:</span>{" "}
                    {testCase.output}
                  </p>
                </div>

                {testCase.explanation && (
                  <div className="pt-3 border-t border-border-default/40 text-[14px] md:text-[16px] text-text-muted italic leading-7 font-normal tracking-wide">
                    <span className="not-italic font-mono font-semibold text-[10px] uppercase text-text-light block mb-1">Explanation:</span>
                    {testCase.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expected Complexity */}
      {hasComplexity && (
        <div className="space-y-2.5">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main font-mono">
            <Cpu size={14} className="text-text-light stroke-[1.75]" />
            <span>Expected Complexity</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-sm bg-bg-base p-3 flex items-center text-[13px] md:text-[14px] border border-border-default">
              <span className="text-text-muted font-normal tracking-wide">
                Time:{" "}
                <strong className="text-primary font-mono font-semibold ml-1 bg-primary-soft/10 px-1.5 py-0.5 rounded-xs border border-primary/10">
                  {problem.expectedTimeComplexity || "N/A"}
                </strong>
              </span>
            </div>

            <div className="rounded-sm bg-bg-base p-3 flex items-center text-[13px] md:text-[14px] border border-border-default">
              <span className="text-text-muted font-normal tracking-wide">
                Space:{" "}
                <strong className="text-purple-400 font-mono font-semibold ml-1 bg-purple-500/10 px-1.5 py-0.5 rounded-xs border border-purple-500/10">
                  {problem.expectedSpaceComplexity || "N/A"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Topics */}
      {problem.topics?.length > 0 && (
        <div className="pt-1 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-light font-mono">
            Topics
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {problem.topics.map((topic, index) => (
              <span
                key={index}
                className="rounded-sm bg-primary-soft border border-primary/10 px-2.5 py-1 text-[11px] font-mono font-medium text-primary shadow-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Problem;