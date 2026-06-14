import React from "react";
import { ExternalLink, Code, Layers, AlertCircle } from "lucide-react";
import Badge from "../../common/Badge";

const ProblemHeaderViewer = ({ problem }) => {
  if (!problem) return null;

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "danger";
      default: return "default";
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm p-6 space-y-6">
      {/* Title & Platform Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">
              {problem.platform || "Platform"}
            </span>
            <Badge variant={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty || "Unknown"}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
            {problem.title || "Untitled Problem"}
            {problem.problemLink && (
              <a 
                href={problem.problemLink} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[var(--text-light)] hover:text-[var(--primary)] transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </h1>
        </div>
      </div>

      {/* Complexities and Topics Info Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--bg-soft)] rounded-xl text-sm">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <Code size={16} className="text-[var(--primary)]" />
          <span>Time: <strong className="text-[var(--text-main)]">{problem.expectedTimeComplexity || "N/A"}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <Layers size={16} className="text-[var(--primary)]" />
          <span>Space: <strong className="text-[var(--text-main)]">{problem.expectedSpaceComplexity || "N/A"}</strong></span>
        </div>
      </div>

      {/* Problem Description */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Description</h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
          {problem.description || "No description provided."}
        </p>
      </div>

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <AlertCircle size={14} /> Constraints
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-soft)] p-3 rounded-xl border border-[var(--border-default)]">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Sample Test Cases */}
      {problem.testCases && problem.testCases.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Example Test Cases</h3>
          <div className="space-y-3">
            {problem.testCases.map((tc, index) => (
              <div key={index} className="border border-[var(--border-default)] rounded-xl overflow-hidden text-xs">
                <div className="bg-[var(--bg-soft)] px-3 py-1.5 font-semibold text-[var(--text-muted)] border-b border-[var(--border-default)]">
                  Example {index + 1}
                </div>
                <div className="p-3 space-y-2 font-mono bg-white">
                  <div><span className="text-[var(--text-light)]">Input:</span> {tc.input}</div>
                  <div><span className="text-[var(--text-light)]">Output:</span> {tc.output}</div>
                  {tc.explanation && (
                    <div className="pt-2 mt-2 border-t border-[var(--bg-soft)] text-[var(--text-muted)] font-sans italic">
                      <span className="font-semibold font-sans not-italic text-xs block text-[var(--text-main)]">Explanation:</span>
                      {tc.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Badges */}
      {problem.topics && problem.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {problem.topics.map((topic, index) => (
            <span key={index} className="text-xs bg-[var(--primary-soft)] text-[var(--primary)] px-2.5 py-1 rounded-full font-medium">
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemHeaderViewer;