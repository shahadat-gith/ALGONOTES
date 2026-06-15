import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Edit3, Eye, Calendar, Code2 } from "lucide-react";
import toast from "react-hot-toast";

import { getAllNotesByUser } from "../../api/noteApi";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import EmptyState from "../../components/common/EmptyState";
import NotesSkeleton from "../../components/skeletons/NotesSkeleton";

const PAGE_SIZE = 10;

const difficultyVariant = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

const formatDate = (date) => {
  if (!date) return "Recently";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Recently";

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Notes = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchNotes = useCallback(async (page, query) => {
    setLoading(true);
    try {
      const data = await getAllNotesByUser(page, PAGE_SIZE, query);

      if (!data?.success) {
        throw new Error("Failed to fetch notes");
      }

      setNotes(data.notes || []);

      setPagination({
        totalItems: data.pagination?.totalItems || 0,
        totalPages: data.pagination?.totalPages || 1,
        hasNext: data.pagination?.hasNext || false,
        hasPrevious: data.pagination?.hasPrevious || false,
      });
    } catch (error) {
      toast.error("Could not load notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes(currentPage, submittedSearch);
  }, [currentPage, submittedSearch, fetchNotes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanedSearch = search.trim();
    setCurrentPage(1);
    setSubmittedSearch(cleanedSearch);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSubmittedSearch("");
    setCurrentPage(1);
  };

  if (loading && notes.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
        <NotesSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
      {/* Header View Area */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-default)]/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">
            My Notes
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Review and reference your generated DSA notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/notes/generate")}
          className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--primary-hover)]"
        >
          Generate Note
        </button>
      </div>

      {/* Actionable Search Engine Layer */}
      <form onSubmit={handleSearchSubmit} className="relative rounded-xl shadow-sm">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, platform, difficulty, or language..."
          className="w-full py-2.5 pl-11 pr-24"
        />
        <button
          type="submit"
          className="absolute bottom-1.5 right-2 top-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-soft)] px-3 text-xs font-semibold text-[var(--text-main)] transition-colors duration-150 hover:bg-[var(--border-strong)]/20"
        >
          Search
        </button>
      </form>

      {/* Conditional Layout Rendering */}
      {pagination.totalItems === 0 && !submittedSearch ? (
        <EmptyState
          title="No notes yet"
          description="Generate your first AI-powered DSA note."
          actionText="Generate Note"
          onAction={() => navigate("/notes/generate")}
        />
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No notes matched your search.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="mt-2 text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className={`space-y-3 ${loading ? "pointer-events-none opacity-50" : ""}`}>
          
          {/* Table Header Controls (Pagination Top-Right) */}
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)] px-1">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, pagination.totalItems)} of {pagination.totalItems} notes
            </span>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-light)]">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={!pagination.hasPrevious || loading}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-1.5 text-[var(--text-main)] hover:bg-[var(--bg-soft)] transition-all disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={!pagination.hasNext || loading}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-1.5 text-[var(--text-main)] hover:bg-[var(--bg-soft)] transition-all disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tabular Layout Implementation */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[var(--bg-soft)] text-xs font-semibold uppercase tracking-wider text-[var(--text-light)] border-b border-[var(--border-default)]">
                  <tr>
                    <th className="px-6 py-4">Problem Name</th>
                    <th className="px-6 py-4">Platform</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Language</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-main)]">
                  {notes.map((note) => {
                    const { _id: id, problem = {}, language = "C++", status = "draft", createdAt, updatedAt } = note;
                    const title = problem.title || "Untitled Problem";
                    const platform = problem.platform || "Other";
                    const difficulty = problem.difficulty || "Medium";
                    
                    return (
                      <tr 
                        key={id} 
                        className="group hover:bg-[var(--bg-soft)]/40 transition-colors"
                      >
                        {/* Title Column */}
                        <td className="px-6 py-4 max-w-xs sm:max-w-md truncate font-semibold">
                          <Link 
                            to={`/notes/${id}`} 
                            className="hover:text-[var(--primary)] transition-colors"
                          >
                            {title}
                          </Link>
                        </td>

                        {/* Platform Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--text-muted)] font-medium">
                          {platform}
                        </td>

                        {/* Difficulty Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={difficultyVariant[difficulty] || "default"}>
                            {difficulty}
                          </Badge>
                        </td>

                        {/* Language Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
                            <Code2 size={13} />
                            {language}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={status === "final" ? "success" : "warning"}>
                            {status}
                          </Badge>
                        </td>

                        {/* Updated Timestamp Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--text-light)]">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-[var(--text-muted)]" />
                            {formatDate(updatedAt || createdAt)}
                          </span>
                        </td>

                        {/* Action Control Icons Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/notes/${id}/edit`}
                              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-main)] transition-all"
                              title="Edit note"
                            >
                              <Edit3 size={15} />
                            </Link>
                            <Link
                              to={`/notes/${id}`}
                              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-all"
                              title="View full note"
                            >
                              <Eye size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Notes;