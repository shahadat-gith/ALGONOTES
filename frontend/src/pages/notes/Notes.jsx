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

  // 1. Fetch data from backend using server-side pagination & filtering
  const fetchUserNotes = useCallback(async (pageTarget, searchQuery) => {
    setLoading(true);
    try {
      // Passes page, size, and search text parameters down to your updated API layer
      const data = await getAllNotesByUser(pageTarget, PAGE_SIZE, searchQuery);

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

  // 2. Fetch data whenever the page index changes
  useEffect(() => {
    fetchUserNotes(currentPage, search);
  }, [currentPage, fetchUserNotes]);

  // 3. AUTO-RESET TRACKING: Triggers immediate load when search is cleared by user backspacing
  useEffect(() => {
    if (search === "") {
      setCurrentPage(1);
      fetchUserNotes(1, "");
    }
  }, [search, fetchUserNotes]);

  // 4. Search submit trigger handler (for active queries)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1); // Reset back to page 1 whenever search query changes
    fetchUserNotes(1, search);
  };

  // 5. Handle manual clearing search filters (via clear link/button actions)
  const handleClearSearch = () => {
    setSearch(""); // Changing this state now automatically fires our AUTO-RESET effect above!
  };

  // 6. Pagination navigation button handlers
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
      
      {/* Title & Top Pagination Controls Layout Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-default)]/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            My Notes
          </h1>
          <p className="mt-0.5 text-xs text-[var(--text-light)] font-medium">
            Review your generated DSA notes, dry runs, and time complexities.
          </p>
        </div>

        {/* Top Navigation Row: Includes Pagination Controls + Action Button */}
        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          
          {/* Top Pagination Interface */}
          {paginationMeta.totalPages > 1 && (
            <div className="flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-1.5 rounded-xl shadow-sm">
              <span className="text-xs text-[var(--text-muted)] font-medium select-none">
                Page <strong className="text-[var(--text-main)]">{currentPage}</strong> / {paginationMeta.totalPages}
              </span>
              
              <div className="flex items-center gap-1 border-l border-[var(--border-default)] pl-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={!paginationMeta.hasPrevious || loading}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-soft)] rounded-md transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)]"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!paginationMeta.hasNext || loading}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-soft)] rounded-md transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)]"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/notes/generate")}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] shadow-sm"
          >
            Generate Note
          </button>
        </div>
      </div>

      {/* Summary Analytics Metadata Row */}
      <NotesSummary
        totalNotesCount={paginationMeta.totalItems}
        finalizedCount={notes.filter((n) => n.status === "final").length} 
        draftCount={notes.filter((n) => n.status === "draft").length}
      />

      {/* Input Search Strip Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full shadow-sm rounded-xl">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--text-light)]">
          <Search size={18} />
        </div>

        <Input
          placeholder="Search items by title, platform, difficulty, or language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-24 py-2.5"
        />
        
        <button 
          type="submit"
          className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-[var(--bg-soft)] border border-[var(--border-default)] hover:bg-[var(--border-strong)]/30 rounded-lg text-xs font-semibold text-[var(--text-main)] transition-colors"
        >
          Search
        </button>
      </form>

      {/* Conditional Content Card Container Stream */}
      {paginationMeta.totalItems === 0 && search === "" ? (
        <EmptyState
          title="No notes created yet"
          description="Generate your first AI-powered coding note using a problem link, code, and language."
          actionText="Generate Note"
          onAction={() => navigate("/notes/generate")}
        />
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] p-12 text-center shadow-sm">
          <p className="mb-1 text-sm font-medium text-[var(--text-muted)]">
            No notes match your search configuration parameters.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            Clear search filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Main Feed Card Grid Column */}
          <div className={`space-y-4 ${loading ? "opacity-40 pointer-events-none transition-opacity duration-150" : ""}`}>
            {notes.map((noteItem) => (
              <NoteCard
                key={noteItem.noteId}
                noteItem={noteItem}
              />
            ))}
          </div>

          {/* Simple Bottom Item Count Status Indicator */}
          {paginationMeta.totalPages > 1 && (
            <div className="flex items-center justify-between text-[11px] text-[var(--text-light)] font-medium pt-2 px-1">
              <span>
                Showing {notes.length} of {paginationMeta.totalItems} saved items total
              </span>
              <span>
                Page {currentPage} / {paginationMeta.totalPages}
              </span>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Notes;