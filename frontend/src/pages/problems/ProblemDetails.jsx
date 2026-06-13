import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getProblemById,
  updateProblem,
  deleteProblem,
} from "../../api/problemApi";
import Badge from "../../components/common/Badge";
import {
  Edit3,
  Trash2,
  Sparkles,
  Bookmark,
  ExternalLink,
  Code2,
  Calendar,
  Globe,
  Award,
  Layers,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import ProblemDetailsSkeleton from "../../components/skeletons/ProblemDetailsSkeleton";
import { EXTENSION_MAP } from "../../constants/problems";

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const data = await getProblemById(id);

        if (data.success) {
          setProblem(data.problem);
        }
      } catch (err) {
        toast.error("Failed to fetch problem details.");
        navigate("/problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [id, navigate]);

  const handleBookmarkToggle = async () => {
    if (!problem || actionLoading) return;

    setActionLoading(true);

    try {
      const response = await updateProblem(id, {
        isBookmarked: !problem.isBookmarked,
      });

      if (response.success) {
        setProblem(response.problem);
        toast.success(
          response.problem.isBookmarked
            ? "Added to bookmarks!"
            : "Removed from bookmarks.",
        );
      }
    } catch (err) {
      toast.error("Failed to update bookmark.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this problem and its notes?",
    );

    if (!confirmed) return;

    try {
      const response = await deleteProblem(id);

      if (response.success) {
        toast.success("Problem deleted successfully.");
        navigate("/problems");
      }
    } catch (err) {
      toast.error("Could not delete problem.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto">
        <ProblemDetailsSkeleton />
      </div>
    );
  }

  if (!problem) return null;

  const difficultyVariants = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger",
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 animate-fade-in max-w-7xl mx-auto">
      {/* SINGLE INTEGRATED CONTAINER */}
      <div className="bg-[#1e1e2e] border border-neutral-800 rounded-2xl shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
        {/* =======================================================
            SECTION 1 : HEADER BAR ( filename + title + actions )
        ======================================================== */}
        <div className="relative h-14 px-4 bg-[#181825] border-b border-neutral-800 flex items-center justify-between">
          {/* Left : File Name */}
          <div className="flex items-center gap-2 text-neutral-400 min-w-0">
            <Code2 size={16} className="text-[var(--primary)] shrink-0" />
            <span className="text-xs font-mono font-bold tracking-wide truncate">
              your_solution{EXTENSION_MAP[problem?.language] || ""}
            </span>
          </div>

          {/* Center : Problem Title */}
          <div className="absolute left-1/2 -translate-x-1/2 max-w-[40%] hidden md:block">
            <h1 className="text-sm font-bold text-neutral-100 truncate text-center">
              {problem?.title}
            </h1>
          </div>

          {/* Right : Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Bookmark */}
            <button
              onClick={handleBookmarkToggle}
              disabled={actionLoading}
              title="Bookmark"
              className={`p-2 rounded-lg transition-colors ${
                problem.isBookmarked
                  ? "text-yellow-400 bg-yellow-500/10"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              <Bookmark
                size={15}
                className={problem.isBookmarked ? "fill-current" : ""}
              />
            </button>

            {/* Edit */}
            <Link to={`/problems/${id}/edit`}>
              <button
                title="Edit Problem"
                className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-800 transition-colors"
              >
                <Edit3 size={15} />
              </button>
            </Link>

            {/* Delete */}
            <button
              onClick={handleDelete}
              title="Delete Problem"
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={15} />
            </button>

            {/* Generate Notes */}
            <Link to={`/problems/${id}/note/generate`} state={{ problem }}>
              <button
                title="Generate AI Notes"
                className="p-2 rounded-lg text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors"
              >
                <Sparkles size={15} />
              </button>
            </Link>
          </div>
        </div>

        {/* =======================================================
            SECTION 2 : CODE BLOCK VIEWER
        ======================================================== */}
        <div className="flex-1 min-h-[450px] bg-[#1e1e2e]">
          <pre className="h-full p-6 overflow-x-auto font-mono text-sm leading-7 text-neutral-200">
            <code>{problem.userCode}</code>
          </pre>
        </div>

        {/* =======================================================
          SECTION 3 : METADATA PANEL 
        ======================================================== */}
        <div className="border-t border-neutral-800 bg-[#181825] p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-neutral-500 tracking-wider uppercase flex items-center gap-1.5">
              <Layers size={12} className="text-[var(--primary)]" />
              Problem metadata
            </h3>

            {/* Grid setup: 2 columns on small screens, 5 columns total on medium+ screens */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {/* Difficulty Card (Takes 1 column slot) */}
              <div className="bg-[#1e1e2e] border border-neutral-800 rounded-xl p-3 flex flex-col gap-1.5">
                <span className="text-[10px] tracking-wider text-neutral-500 font-medium flex items-center gap-1">
                  <Award size={11} /> DIFFICULTY
                </span>
                <div>
                  <Badge
                    variant={
                      difficultyVariants[problem.difficulty] || "default"
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Language Card (Takes 1 column slot) */}
              <div className="bg-[#1e1e2e] border border-neutral-800 rounded-xl p-3 flex flex-col gap-1.5">
                <span className="text-[10px] tracking-wider text-neutral-500 font-medium flex items-center gap-1">
                  <Code2 size={11} /> LANGUAGE
                </span>
                <span className="text-xs font-bold text-neutral-200 font-mono">
                  {problem.language}
                </span>
              </div>

              {/* Platform Card (Takes 1 column slot) */}
              <div className="bg-[#1e1e2e] border border-neutral-800 rounded-xl p-3 flex flex-col gap-1.5">
                <span className="text-[10px] tracking-wider text-neutral-500 font-medium flex items-center gap-1">
                  <Globe size={11} /> PLATFORM
                </span>
                <span className="text-xs font-semibold text-neutral-200">
                  {problem.platform}
                </span>
              </div>

              {/* Topics & Tags Card (Takes 2 columns remaining on wide viewports to stretch dynamically) */}
              <div className="col-span-2 md:col-span-2 bg-[#1e1e2e] border border-neutral-800 rounded-xl p-3 flex flex-col gap-1.5">
                <span className="text-[10px] tracking-wider text-neutral-500 font-medium flex items-center gap-1">
                  <Tag size={11} /> TOPICS
                </span>

                {problem.topics?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {problem.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-[11px] font-medium rounded border border-neutral-700/60 bg-[#141421] text-neutral-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-neutral-500 italic">
                    No tags assigned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sub-Footer Layout : Timestamps & Links */}
          <div className="pt-4 border-t border-neutral-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 text-neutral-500">
              <Calendar size={13} />
              Added on{" "}
              {new Date(problem.createdAt).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </span>

            {problem.problemLink && (
              <a
                href={problem.problemLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--primary)] font-semibold bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg border border-[var(--primary)]/20 transition-colors"
              >
                Open Original Problem
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
