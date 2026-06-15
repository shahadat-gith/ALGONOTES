import React from "react";
import { ExternalLink, AlertCircle, Cpu } from "lucide-react";
import Badge from "../common/Badge";

const ProblemDetails = ({ problem }) => {
  if (!problem) return null;

  console.log(problem);

  const difficultyVariant = {
    easy: "success",
    medium: "warning",
    hard: "danger",
  };

  // Check if we have any complexity data to show at the bottom
  const hasComplexity = problem.expectedTimeComplexity || problem.expectedSpaceComplexity;

  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-6">

      {/* Header */}
      <div className="border-b border-[var(--border-default)] pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase font-semibold text-[var(--text-light)]">
            {problem.platform || "Platform"}
          </span>

          <Badge
            variant={
              difficultyVariant[
                problem.difficulty?.toLowerCase()
              ] || "default"
            }
          >
            {problem.difficulty || "Unknown"}
          </Badge>
        </div>

        <div className="flex items-start gap-2">
          <h1 className="text-2xl font-bold text-[var(--text-main)] leading-tight">
            {problem.title || "Untitled Problem"}
          </h1>

          {problem.problemLink && (
            <a
              href={problem.problemLink}
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-[var(--text-light)] hover:text-[var(--primary)]"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {problem.description && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-main)]">
            Description
          </h3>

          <p className="text-sm leading-7 text-[var(--text-muted)] whitespace-pre-wrap">
            {problem.description}
          </p>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints?.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]">
            <AlertCircle size={15} />
            Constraints
          </h3>

          <div className="rounded-xl bg-[var(--bg-soft)] p-4">
            <ul className="space-y-2 text-sm text-[var(--text-muted)] font-mono">
              {problem.constraints.map((constraint, index) => (
                <li key={index}>• {constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Examples */}
      {problem.testCases?.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-main)]">
            Examples
          </h3>

          <div className="space-y-3">
            {problem.testCases.map((testCase, index) => (
              <div
                key={index}
                className="rounded-xl border border-[var(--border-default)] p-4 space-y-2 bg-[var(--bg-soft)]"
              >
                <div className="text-xs font-semibold text-[var(--text-light)]">
                  Example {index + 1}
                </div>

                <div className="font-mono text-sm">
                  <p>
                    <span className="text-[var(--text-light)]">
                      Input:
                    </span>{" "}
                    {testCase.input}
                  </p>

                  <p>
                    <span className="text-[var(--text-light)]">
                      Output:
                    </span>{" "}
                    {testCase.output}
                  </p>
                </div>

                {testCase.explanation && (
                  <p className="pt-2 border-t border-[var(--border-default)] text-sm text-[var(--text-muted)] italic">
                    {testCase.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expected Complexity (Repositioned to the Bottom) */}
      {hasComplexity && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]">
            <Cpu size={15} className="text-[var(--text-muted)]" />
            Expected Complexity
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--bg-soft)] p-3 flex items-center gap-2 text-sm border border-[var(--border-default)]">
              <span className="text-[var(--text-muted)]">
                Expected Time Complexity:{" "}
                <strong className="text-[var(--text-main)] font-mono">
                  {problem.expectedTimeComplexity || "N/A"}
                </strong>
              </span>
            </div>

            <div className="rounded-xl bg-[var(--bg-soft)] p-3 flex items-center gap-2 text-sm border border-[var(--border-default)]">
              <span className="text-[var(--text-muted)]">
                Expected Space Complexity:{" "}
                <strong className="text-[var(--text-main)] font-mono">
                  {problem.expectedSpaceComplexity || "N/A"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Topics */}
      {problem.topics?.length > 0 && (
        <div className="pt-2">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-main)]">
            Topics
          </h3>

          <div className="flex flex-wrap gap-2">
            {problem.topics.map((topic, index) => (
              <span
                key={index}
                className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[var(--primary)]"
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

export default ProblemDetails;