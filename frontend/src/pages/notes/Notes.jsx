import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNotesByUser } from "../../api/noteApi"; 

import NoteCard from "../../components/notes/viewer/NoteCard";
import Input from "../../components/common/Input";
import EmptyState from "../../components/common/EmptyState";
import NotesSummary from "../../components/notes/viewer/NotesSummary";
import NotesSkeleton from "../../components/skeletons/NotesSkeleton";
import Button from "../../components/common/Button"; 

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const Notes = () => {
  const navigate = useNavigate();

  // State Management Engine
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination State Engine
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  const PAGE_SIZE = 10;

  // 1. Fetch data from Supabase Mumbai server matching structural page boundaries
  const fetchUserNotes = useCallback(async (pageTarget, searchQuery) => {
    setLoading(true);
    try {
      // Passes cursor criteria directly down to our updated API layer
      const data = await getAllNotesByUser(pageTarget, PAGE_SIZE);

      if (data.success) {
        setNotes(data.notes || []);
        if (data.pagination) {
          setPaginationMeta(data.pagination);
        }
      }
    } catch (err) {
      toast.error("Could not load your notes from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch data whenever the page slice index changes
  useEffect(() => {
    fetchUserNotes(currentPage, search);
  }, [currentPage, fetchUserNotes]);

  // 3. Simple Debounce/Search trigger handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1); // Reset back to page 1 whenever search bounds mutate
    fetchUserNotes(1, search);
  };

  // 4. Handle clearing filters cleanly
  const handleClearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchUserNotes(1, "");
  };

  // 5. Client side pagination control changes
  const handleNextPage = () => {
    if (paginationMeta.hasNext) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (paginationMeta.hasPrevious) setCurrentPage((prev) => prev - 1);
  };

  // Loading skeleton state wrapper
  if (loading && notes.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
        <NotesSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
      
      {/* Title Header Blocks */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            My Study Notes
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Review generated DSA notes, solution insights, dry runs, and complexity breakdowns.
          </p>
        </div>

        <button
          onClick={() => navigate("/notes/generate")}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)]"
        >
          Generate Note
        </button>
      </div>

      {/* Summary Matrix Cards */}
      {/* Passing total metrics directly from the backend metadata payload safely */}
      <NotesSummary
        totalNotesCount={paginationMeta.totalItems}
        finalizedCount={notes.filter((n) => n.status === "final").length} // Scoped contextually to active page view
        draftCount={notes.filter((n) => n.status === "draft").length}
      />

      {/* Input Search Action Strip */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--text-light)]">
          <Search size={18} />
        </div>

        <Input
          placeholder="Search items by title, platform, difficulty, or language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-24"
        />
        
        <button 
          type="submit"
          className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-[var(--bg-soft)] border border-[var(--border-default)] hover:bg-[var(--border-default)] rounded-md text-xs font-semibold text-[var(--text-main)] transition-colors"
        >
          Search
        </button>
      </form>

      {/* Conditional Rendering Grid Engine */}
      {paginationMeta.totalItems === 0 && search === "" ? (
        <EmptyState
          title="No notes created yet"
          description="Generate your first AI-powered coding note using a problem link, code, and language."
          actionText="Generate Note"
          onAction={() => navigate("/notes/generate")}
        />
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="mb-1 text-sm font-medium text-[var(--text-muted)]">
            No notes match your search configuration parameters.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            Clear search query
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Main Card Mapping lists */}
          <div className={`space-y-4 ${loading ? "opacity-50 pointer-events-none transition-opacity" : ""}`}>
            {notes.map((noteItem) => (
              <NoteCard
                key={noteItem.noteId}
                noteItem={noteItem}
              />
            ))}
          </div>

          {/* Pagination UI Controls Bar */}
          {paginationMeta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--border-default)] pt-4 mt-6">
              <span className="text-xs text-[var(--text-muted)]">
                Showing page <strong className="text-[var(--text-main)]">{currentPage}</strong> of <strong className="text-[var(--text-main)]">{paginationMeta.totalPages}</strong> ({paginationMeta.totalItems} items)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={!paginationMeta.hasPrevious || loading}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!paginationMeta.hasNext || loading}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;