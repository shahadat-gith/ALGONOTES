import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProblemById, updateProblem, deleteProblem } from "../../api/problemApi";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Bookmark, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  Code2 
} from "lucide-react";
import toast from "react-hot-toast";
import ProblemDetailsSkeleton from "../../components/skeletons/ProblemDetailsSkeleton";

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

  // Toggle Bookmark status attribute flag
  const handleBookmarkToggle = async () => {
    if (!problem || actionLoading) return;
    setActionLoading(true);
    try {
      const response = await updateProblem(id, { isBookmarked: !problem.isBookmarked });
      if (response.success) {
        setProblem(response.problem);
        toast.success(response.problem.isBookmarked ? "Added to bookmarks!" : "Removed from bookmarks.");
      }
    } catch (err) {
      toast.error("Failed to modify bookmark state.");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Revision pending flag
  const handleRevisionToggle = async () => {
    if (!problem || actionLoading) return;
    setActionLoading(true);
    try {
      const response = await updateProblem(id, { needsRevision: !problem.needsRevision });
      if (response.success) {
        setProblem(response.problem);
        toast.success(response.problem.needsRevision ? "Marked as needing revision." : "Removed from revision queue.");
      }
    } catch (err) {
      toast.error("Failed to modify revision parameter.");
    } finally {
      setActionLoading(false);
    }
  };

  // Deletion logic loop
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently erase this problem and its synchronized study notes?")) return;
    try {
      const response = await deleteProblem(id);
      if (response.success) {
        toast.success("Problem cleanly purged from workspace.");
        navigate("/problems");
      }
    } catch (err) {
      toast.error("Could not remove problem instance.");
    }
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
        <ProblemDetailsSkeleton />
      </div>
    );
  }

  if (!problem) return null;

  // Determine difficulty design matching variant
  const difficultyVariants = { Easy: "success", Medium: "warning", Hard: "danger" };

  return (
    <div  className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      
      {/* 1. NAVIGATION BAR ACTION TRAY */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 justify-end">

        <div className="flex items-center flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleBookmarkToggle} 
            disabled={actionLoading}
            className={`bg-white ${problem.isBookmarked ? "text-[var(--warning)] border-[var(--warning)]/30 bg-[var(--warning-soft)]/20" : ""}`}
          >
            <Bookmark size={15} className={problem.isBookmarked ? "fill-current" : ""} />
            {problem.isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleRevisionToggle} 
            disabled={actionLoading}
            className={`bg-white ${problem.needsRevision ? "text-[var(--danger)] border-[var(--danger)]/30 bg-[var(--danger-soft)]/20" : ""}`}
          >
            {problem.needsRevision ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {problem.needsRevision ? "Remove from Revision" : "Mark for Revision"}
          </Button>

          <Link to={`/problems/${id}/edit`}>
            <Button variant="outline" className="bg-white">
              <Edit3 size={15} />
              Edit
            </Button>
          </Link>

          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={15} />
            Delete
          </Button>
        </div>
      </div>

      {/* 2. CORE PROBLEM METADATA BLOCK */}
      <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-card)] space-y-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-light)]">
            <span>{problem.platform}</span>
            <span>•</span>
            <span>Added on {new Date(problem.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
              {problem.title}
            </h1>
            {problem.problemLink && (
              <a 
                href={problem.problemLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
              >
                Open Original Link
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Badges and tags mapping */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant={difficultyVariants[problem.difficulty] || "default"}>
            {problem.difficulty}
          </Badge>
          <span className="px-2.5 py-0.5 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-soft)] rounded-md border border-[var(--border-default)]/40">
            {problem.language}
          </span>
          {problem.needsRevision && (
            <Badge variant="danger" className="animate-pulse">Needs Revision</Badge>
          )}
        </div>

        {problem.topics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {problem.topics.map((topic) => (
              <span 
                key={topic} 
                className="text-xs font-semibold px-2.5 py-1 bg-[var(--bg-soft)] text-[var(--text-muted)] rounded-md border border-[var(--border-default)]/60"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. CODE CODEBLOCK PRESENTATION VIEWPORT */}
      <div className="bg-[#1e1e2e] border border-neutral-800 rounded-2xl shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
        <div className="px-4 py-3 bg-[#181825] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <Code2 size={16} className="text-[var(--primary)]" />
            <span className="text-xs font-mono font-bold tracking-wide">saved_solution_file</span>
          </div>
          <Link to={`/problems/${id}/generate`}>
            <button className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-md shadow-sm transition-colors">
              <Sparkles size={12} />
              Generate AI Notes
            </button>
          </Link>
        </div>

        {/* Read-only stylized view block space */}
        <pre className="p-5 overflow-x-auto font-mono text-sm text-neutral-200 bg-transparent leading-relaxed tab-size-4">
          <code>{problem.userCode}</code>
        </pre>
      </div>

    </div>
  );
};

export default ProblemDetails;