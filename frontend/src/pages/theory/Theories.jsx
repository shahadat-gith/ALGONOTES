import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTheoriesByUser, deleteTheoryNote } from "../../api/theoryApi"; 

import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";

import { 
  BookOpen, 
  Search, 
  Plus, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Edit2,
  Eye,
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

  useEffect(() => {
    const fetchUserTheories = async () => {
      setLoading(true);
      try {
        const data = await getAllTheoriesByUser(page, 10, debouncedSearch); // Upped to 10 rows for clean table distributions
        if (data?.success) {
          setTheories(data.theories || []);
          setPagination(data.pagination || { totalPages: 1, totalItems: 0 });
          setApiError("");
        }
      } catch (err) {
        setApiError("We couldn't load your study notes collection at the moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserTheories();
  }, [page, debouncedSearch]);

  const handleDeleteRecord = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this study note?")) return;

    const toastId = toast.loading("Deleting study note...");
    try {
      const res = await deleteTheoryNote(id);
      if (res?.success) {
        toast.success("Study note deleted.", { id: toastId });
        setTheories((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      toast.error("Could not delete the note.", { id: toastId });
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

  // Safely strips both markdown tokens AND raw HTML tags to extract a pristine plaintext summary
  const cleanSnippetPreview = (htmlOrMarkdown) => {
    if (!htmlOrMarkdown) return "No content written yet...";
    const withoutHtml = htmlOrMarkdown.replace(/<[^>]*>/g, "");
    const cleanText = withoutHtml.replace(/[#*`!\[\]()]/g, "");
    return cleanText.length > 90 ? `${cleanText.substring(0, 90)}...` : cleanText;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none animate-fade-in relative z-10 flex flex-col min-h-[calc(100vh-6rem)] font-sans">
      
      {/* Upper Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-5 mb-6 shrink-0">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-wide text-text-main flex items-center gap-2">
            <BookOpen size={22} className="text-primary stroke-[2]" />
            <span>My Study Notes</span>
          </h1>
          <p className="text-xs text-text-muted tracking-wide max-w-xl leading-relaxed">
            Manage your custom computer science study materials, subject explanations, and exam review guides.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("/theory/generate")}
          className="font-bold text-xs tracking-wider uppercase h-10 px-5 bg-primary hover:bg-primary-hover text-white flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Create New Note</span>
        </Button>
      </div>

      {/* Input Filtering Bar */}
      <div className="w-full max-w-md mb-6 relative group shrink-0">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors stroke-[2]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic title or description contents..."
          className="w-full h-10 bg-bg-surface border border-border-default rounded-md pl-10 pr-4 text-xs font-sans text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-surface/80 shadow-xs placeholder-text-light/50"
        />
      </div>

      {/* Data Table Component Core Sheet Area */}
      <div className="flex-1 overflow-x-auto border border-border-default rounded-md bg-bg-surface shadow-card min-h-0">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-bg-soft/60 rounded-sm w-full" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-bg-soft/30 rounded-sm w-full" />
            ))}
          </div>
        ) : apiError ? (
          <div className="p-6 max-w-xl">
            <Alert title="Sync Error" message={apiError} variant="danger" />
          </div>
        ) : theories.length === 0 ? (
          <div className="p-16 text-center max-w-md mx-auto">
            <FileText size={36} className="text-text-light mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-text-main tracking-wide mb-1">No study notes found</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              {search ? "No notes matched your search query phrase." : "You haven't added any study materials to your dashboard account yet."}
            </p>
            {!search && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/theory/generate")}
                className="text-[11px] font-bold tracking-wider px-4 h-8 mx-auto flex items-center gap-1.5"
              >
                <Sparkles size={12} />
                <span>Create with AI Assistant</span>
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-xs font-sans">
            <thead>
              <tr className="bg-bg-soft border-b border-border-default text-text-main font-bold tracking-wide select-none">
                <th className="p-4 w-[25%]">Topic Title</th>
                <th className="p-4 w-[35%]">Description Preview</th>
                <th className="p-4 w-[15%]">Date Created</th>
                <th className="p-4 w-[10%]">Status</th>
                <th className="p-4 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/50 text-text-muted">
              {theories.map((item) => (
                <tr 
                  key={item._id}
                  className="hover:bg-bg-soft/30 transition-colors group"
                >
                  {/* Column 1: Title */}
                  <td className="p-4 font-bold text-text-main max-w-xs truncate group-hover:text-primary transition-colors">
                    {item.topic}
                  </td>
                  
                  {/* Column 2: Text Preview */}
                  <td className="p-4 max-w-sm truncate text-text-muted font-normal">
                    {cleanSnippetPreview(item.content)}
                  </td>
                  
                  {/* Column 3: Date */}
                  <td className="p-4 whitespace-nowrap text-text-light font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="stroke-[1.5]" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </td>
                  
                  {/* Column 4: Status Indicator Badge */}
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                      item.status === "final" 
                        ? "bg-success-soft text-success border border-success/10" 
                        : "bg-bg-soft text-text-muted border border-border-strong"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  {/* Column 5: Action Button Panel */}
                  <td className="p-4 whitespace-nowrap text-right font-medium">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/theory/${item._id}/details`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-border-default bg-bg-surface text-text-muted hover:text-text-main hover:border-border-strong transition-all text-[11px] font-semibold cursor-pointer"
                        title="Read Note"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => navigate(`/theory/${item._id}/edit`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-border-default bg-bg-surface text-text-muted hover:text-primary hover:border-primary/20 transition-all text-[11px] font-semibold cursor-pointer"
                        title="Edit Content"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => handleDeleteRecord(e, item._id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-transparent bg-transparent text-text-light hover:text-danger hover:bg-danger-soft/10 hover:border-danger/10 transition-all text-[11px] font-semibold cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Global Footer Pagination Track */}
      {pagination.totalPages > 1 && !loading && (
        <div className="flex items-center justify-between border-t border-border-default pt-4 mt-6 shrink-0 font-mono text-[11px]">
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