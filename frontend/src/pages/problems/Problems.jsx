import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProblems, updateProblem, deleteProblem } from "../../api/problemApi";
import ProblemFilters from "../../components/problems/ProblemFilters";
import Input from "../../components/common/Input";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { 
  Search, 
  Plus, 
  Loader2, 
  Bookmark, 
  Trash2, 
  Eye, 
  Sparkles, 
  ExternalLink,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import ProblemsSkeleton from "../../components/skeletons/ProblemsSkeleton";

const Problems = () => {
  const navigate = useNavigate();
  
  // Main Data States 
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States 
  const [search, setSearch] = useState(""); 
  const [platform, setPlatform] = useState("");
  const [difficulty, setDifficulty] = useState(""); 
  const [language, setLanguage] = useState("");

  const fetchProblemsList = async () => {
    try {
      const data = await getAllProblems(); 
      if (data.success) {
        setProblems(data.problems);
      }
    } catch (err) {
      toast.error("Failed to load problem listings.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProblemsList();
  }, []);

  const handleBookmarkToggle = async (id, e) => {
    e.stopPropagation(); // Prevent row click navigation trigger
    const targetProblem = problems.find((p) => p.id === id);
    if (!targetProblem) return;

    try {
      const updatedData = await updateProblem(id, { 
        isBookmarked: !targetProblem.isBookmarked 
      });
      
      if (updatedData.success) {
        setProblems((prev) =>
          prev.map((p) => (p.id === id ? updatedData.problem : p))
        );
        toast.success(
          updatedData.problem.isBookmarked
            ? "Problem added to bookmarks!"
            : "Problem removed from bookmarks."
        );
      }
    } catch (err) {
      toast.error("Could not update bookmark status.");
    }
  };

  const handleDeleteProblem = async (id, e) => {
    e.stopPropagation(); // Prevent row click navigation trigger
    if (!window.confirm("Are you sure you want to permanently delete this logged solution and its notes?")) {
      return;
    }

    try {
      const response = await deleteProblem(id);
      if (response.success) {
        setProblems((prev) => prev.filter((p) => p.id !== id));
        toast.success("Problem removed from repository.");
      }
    } catch (err) {
      toast.error("Failed to remove problem record.");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setPlatform("");
    setDifficulty("");
    setLanguage("");
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase()); 
    const matchesPlatform = platform === "" || problem.platform === platform;
    const matchesDifficulty = difficulty === "" || problem.difficulty === difficulty; 
    const matchesLanguage = language === "" || problem.language === language; 

    return matchesSearch && matchesPlatform && matchesDifficulty && matchesLanguage;
  });

  const difficultyVariants = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger",
  };

  if (loading) {
    return (
      <div  className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto" >
        <ProblemsSkeleton/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      
      {/* Upper Management Summary Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            Problem Workspace
          </h1>
        </div>
        <Link to="/problems/add">
          <Button className="w-full sm:w-auto shadow-sm shadow-[var(--primary)]/10">
            <Plus size={16} className="stroke-[2.5]" />
            Add a Problem
          </Button>
        </Link>
      </div>

      {/* SEARCH CONSOLE */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-light)]">
          <Search size={18} />
        </div>
        <Input
          placeholder="Search problems by title string criteria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11"
        />
      </div>

      {/* EXTRACTED MODULAR MULTI-FILTER TRUNK PANEL */}
      <ProblemFilters
        platform={platform}
        setPlatform={setPlatform}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        language={language}
        setLanguage={setLanguage}
        onReset={handleResetFilters}
      />

      {/* TABULAR DISPLAY CONTAINER */}
      {problems.length === 0 ? (
        <EmptyState
          title="No problems added yet" 
          description="Your placement tracking workspace is blank. Add your first solution to compile structure sheets."
          actionText="Add a Problem"
          onAction={() => navigate("/problems/add")}
        />
      ) : filteredProblems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[var(--bg-surface)] border border-dashed border-[var(--border-default)] rounded-2xl text-center">
          <p className="text-sm text-[var(--text-muted)] font-medium mb-2">
            No items found.
          </p>
          
        </div>
      ) : (
        <div className="w-full border border-[var(--border-default)] rounded-2xl overflow-hidden bg-[var(--bg-surface)] shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[var(--bg-soft)] border-b border-[var(--border-default)] text-[var(--text-muted)] font-bold text-xs uppercase tracking-wider select-none">
                  <th className="p-4 w-12 text-center"></th>
                  <th className="p-4 min-w-[240px]">Problem Title</th>
                  <th className="p-4 w-36">Platform</th>
                  <th className="p-4 w-28">Difficulty</th>
                  <th className="p-4 w-28">Language</th>
                  <th className="p-4 min-w-[180px]">Topics</th>
                  <th className="p-4 w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-main)]">
                {filteredProblems.map((problem) => (
                  <tr 
                    key={problem.id} 
                    onClick={() => navigate(`/problems/${problem.id}`)}
                    className="hover:bg-[var(--bg-soft)]/30 cursor-pointer transition-colors group"
                  >
                    {/* Bookmark Toggle Column */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleBookmarkToggle(problem.id, e)}
                        className={`p-1.5 rounded-md transition-colors ${
                          problem.isBookmarked 
                            ? "text-[var(--warning)] hover:text-[var(--warning-hover)]" 
                            : "text-[var(--text-light)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-soft)]"
                        }`}
                      >
                        <Bookmark size={16} className={problem.isBookmarked ? "fill-current" : ""} />
                      </button>
                    </td>

                    {/* Problem Title Block */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold tracking-tight text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1.5">
                          {problem.title}
                          {problem.problemLink && (
                            <a 
                              href={problem.problemLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[var(--text-light)] hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        {problem.needsRevision && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--danger)]">
                            <AlertCircle size={12} />
                            Needs Revision
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Platform */}
                    <td className="p-4 font-semibold text-[var(--text-muted)] text-xs">
                      {problem.platform}
                    </td>

                    {/* Difficulty Badge */}
                    <td className="p-4">
                      <Badge variant={difficultyVariants[problem.difficulty] || "default"}>
                        {problem.difficulty}
                      </Badge>
                    </td>

                    {/* Language Label */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[var(--bg-soft)] text-[var(--text-muted)] border border-[var(--border-default)] rounded-md">
                        {problem.language}
                      </span>
                    </td>

                    {/* Topic Tags Pills */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {problem.topics?.slice(0, 2).map((topic) => (
                          <span 
                            key={topic}
                            className="text-[11px] font-medium px-2 py-0.5 bg-[var(--bg-soft)]/60 text-[var(--text-muted)] border border-[var(--border-default)]/40 rounded-md"
                          >
                            {topic}
                          </span>
                        ))}
                        {problem.topics?.length > 2 && (
                          <span className="text-[11px] font-bold text-[var(--text-light)] self-center pl-1">
                            +{problem.topics.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Inline Tabular Action Buttons Menu */}
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link 
                          to={`/problems/${problem.id}`} 
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-soft)] rounded-xl transition-colors"
                          title="View Code Solutions"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link 
                          to={`/problems/${problem.id}/generate`}
                          className="p-2 text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-xl transition-colors"
                          title="Generate/Open AI Notebook"
                        >
                          <Sparkles size={15} />
                        </Link>
                        <button 
                          type="button"
                          onClick={(e) => handleDeleteProblem(problem.id, e)}
                          className="p-2 text-[var(--text-light)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-xl transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Problems;