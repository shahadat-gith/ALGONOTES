import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTheoriesByUser, deleteTheoryNote } from "../../api/theoryApi";
import TheoryCard from "../../components/theory/viewer/TheoryCard";
import {
  Plus,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const Theories = () => {
  const navigate = useNavigate();

  // App state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination numbers (handled by backend)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  // Load specific page partitions from backend
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await getAllTheoriesByUser(page, pageSize);
        if (res?.success) {
          setNotes(res.theories || []);
          setTotalPages(
            res.totalPages || Math.ceil((res.totalCount || 1) / pageSize),
          );
        }
      } catch (err) {
        toast.error("Could not load your notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [page]);

  // Frontend Search filtering operation logic
  const filteredNotes = notes.filter((note) =>
    note.topic.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note permanently?")) return;
    try {
      const res = await deleteTheoryNote(id);
      if (res?.success) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        toast.success("Note deleted successfully.");
        if (notes.length === 1 && page > 1) setPage((p) => p - 1);
      }
    } catch (err) {
      toast.error("Failed to delete the note.");
    }
  };

  return (
    <div className="w-full font-sans text-text-main p-4 sm:p-6 max-w-[1400px] mx-auto flex flex-col gap-6">
      
      <Header
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        navigate={navigate}
      />

      {loading ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-primary" />
            <span>Loading your notes...</span>
          </div>
        </div>
      ) : (
        /* Single-column full-width list container */
        <div className="flex flex-col gap-4 w-full">
          {filteredNotes.map((note,idx) => (
            <TheoryCard key={idx} theory={note} onDelete={handleDeleteNote} />
          ))}
        </div>
      )}

      {/* Empty State Layout */}
      {!loading && filteredNotes.length === 0 && (
        <div className="w-full text-center py-12 border border-border-default rounded-md bg-bg-surface/20 text-xs font-mono text-text-light select-none tracking-wide">
          No matching notes found on this page.
        </div>
      )}
    </div>
  );
};

export default Theories;

const Header = ({ search, setSearch, page, setPage, totalPages, navigate }) => {
  return (
    <>
      {/* Header Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-5">
        
        {/* Left Side: Title */}
        <div className="flex flex-col gap-1 md:w-1/4">
          <h2 className="text-xl font-bold tracking-tight">Study Notes</h2>
          <p className="text-xs text-text-light">
            Read, manage, and update your personal collection of notes.
          </p>
        </div>

        {/* Center Side: Instant Frontend Search Bar */}
        <div className="w-full md:max-w-md flex-1 flex items-center border border-border-default rounded-sm bg-bg-surface px-2.5 focus-within:border-primary/40 transition-all mx-auto">
          <Search size={14} className="text-text-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Instant search within this page..."
            className="bg-transparent w-full p-2 outline-none text-text-main text-xs h-8 font-sans"
          />
        </div>

        <div className="flex flex-col items-end gap-2 md:w-1/4 min-w-[200px]">
          <button
            type="button"
            onClick={() => navigate("/theory/generate")}
            className="px-3 h-8 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold rounded-sm uppercase tracking-wide cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} />
            <span>Create New Note</span>
          </button>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 select-none">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-text-light mr-1">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1 rounded-sm bg-bg-soft border border-border-default text-text-muted hover:text-text-main disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-1 rounded-sm bg-bg-soft border border-border-default text-text-muted hover:text-text-main disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};