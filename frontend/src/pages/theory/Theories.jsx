import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTheoriesByUser, deleteTheoryNote } from "../../api/theoryApi"; 

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Alert from "../../components/common/Alert";

import { 
  BookOpen, 
  Search, 
  Plus, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  FileText, 
  Sparkles 
} from "lucide-react";
import toast from "react-hot-toast";

const Theories = () => {
  const navigate = useNavigate();

  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Clean data-fetching layer utilizing the new theoryApi abstraction
  useEffect(() => {
    const fetchUserTheories = async () => {
      setLoading(true);
      try {
        const data = await getAllTheoriesByUser(page, 8, debouncedSearch);
        if (data?.success) {
          setTheories(data.theories || []);
          setPagination(data.pagination || { totalPages: 1, totalItems: 0 });
          setApiError("");
        }
      } catch (err) {
        setApiError("Failed to synchronize your computer science theory collection.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserTheories();
  }, [page, debouncedSearch]);

  const handleDeleteRecord = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this theory guide?")) return;

    const toastId = toast.loading("Purging masterclass record from index logs...");
    try {
      const res = await deleteTheoryNote(id);
      if (res?.success) {
        toast.success("Theory guide removed successfully.", { id: toastId });
        setTheories((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      toast.error("Failed to clear document record.", { id: toastId });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none animate-fade-in relative z-10 flex flex-col min-h-[calc(100vh-6rem)]">
      
      {/* Header Block Element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-5 mb-6 shrink-0">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-wide text-text-main flex items-center gap-2">
            <BookOpen size={22} className="text-primary stroke-[2]" />
            <span>Theory Masterclasses</span>
          </h1>
          <p className="text-xs text-text-muted tracking-wide max-w-xl leading-relaxed">
            Review and refine your custom-compiled computer science study material, academic guides, 
            and architectural definitions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("/theory/generate")}
          className="font-semibold text-xs tracking-widest uppercase h-10 px-5 bg-primary hover:bg-primary-hover text-white flex items-center gap-2 shadow-xs cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Compile New Guide</span>
        </Button>
      </div>

      {/* Control Utility Search */}
      <div className="w-full max-w-md mb-6 relative group shrink-0">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors stroke-[2]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic title or summary description parameters..."
          className="w-full h-10 bg-bg-surface border border-border-default rounded-md pl-10 pr-4 text-xs font-mono text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-surface/80 shadow-xs placeholder-text-light/50"
        />
      </div>

      {/* Main Core Document Collection Space */}
      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-bg-surface/40 border border-border-default rounded-md" />
            ))}
          </div>
        ) : apiError ? (
          <div className="max-w-xl">
            <Alert title="Collection Synchronizer Failure" message={apiError} variant="danger" />
          </div>
        ) : theories.length === 0 ? (
          <div className="rounded-md border border-border-default bg-bg-surface/30 p-12 text-center max-w-xl mx-auto my-8 border-dashed">
            <FileText size={32} className="text-text-light mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-text-main tracking-wide mb-1">No Theory Guides Indexed</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-xs mx-auto mb-5">
              {search ? "No matching records met your active case-insensitive lookahead criteria pool." : "You haven't compiled any core subject guides yet."}
            </p>
            {!search && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/theory/generate")}
                className="font-mono text-[11px] uppercase tracking-wider px-4 h-8 mx-auto"
              >
                <Sparkles size={11} />
                <span>Initialize AI Compiler</span>
              </Button>
            )}
          </div>
        ) : (
          /* Architecture Content Grid List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {theories.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/theory/${item._id}/edit`)}
                className="group bg-bg-surface border border-border-default hover:border-primary/40 rounded-md p-4 flex flex-col justify-between min-h-40 transition-all cursor-pointer shadow-card select-none hover:translate-y-[-2px]"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xs font-bold text-text-main tracking-wide line-clamp-2 leading-5 group-hover:text-primary transition-colors">
                      {item.topic}
                    </h2>
                    
                    <button
                      type="button"
                      onClick={(e) => handleDeleteRecord(e, item._id)}
                      className="p-1 rounded-xs border border-transparent text-text-light hover:text-danger hover:bg-danger-soft/10 hover:border-danger/10 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 size={13} className="stroke-[2]" />
                    </button>
                  </div>
                  
                  {item.content && (
                    <p className="text-[11px] text-text-muted leading-5 line-clamp-3 font-normal font-mono opacity-80">
                      {item.content.replace(/[#*`!\[\]()]/g, "").substring(0, 120)}...
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-3 border-t border-border-default/50 text-[10px] font-mono text-text-light font-medium tracking-wide shrink-0">
                  <Calendar size={11} className="stroke-[2]" />
                  <span>{formatDate(item.createdAt)}</span>
                  <span className="mx-0.5 text-border-strong">•</span>
                  <span className={`px-1.5 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                    item.status === "final" ? "bg-success-soft text-success border border-success/10" : "bg-bg-soft text-text-muted border border-border-strong"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Footer Pagination Track */}
      {pagination.totalPages > 1 && !loading && (
        <div className="flex items-center justify-between border-t border-border-default pt-4 mt-8 shrink-0 font-mono text-[11px]">
          <p className="text-text-light">
            Page <span className="font-bold text-text-muted">{page}</span> of <span className="font-bold text-text-muted">{pagination.totalPages}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider border border-border-strong text-text-main hover:bg-bg-soft disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft size={12} className="stroke-[2.5]" />
              <span>Prev</span>
            </Button>
            
            <Button
              variant="secondary"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider border border-border-strong text-text-main hover:bg-bg-soft disabled:opacity-40 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight size={12} className="stroke-[2.5]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Theories;