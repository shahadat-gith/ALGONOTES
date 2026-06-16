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
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <NotesSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative z-10">
      
      {/* Header View Area */}
      <div className="flex flex-col gap-4 border-b border-border-default pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-text-main tracking-wide">
            My Notes
          </h1>
          <p className="text-xs text-text-muted tracking-wide">
            Review and reference your generated DSA notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/notes/generate")}
          className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-hover cursor-pointer shadow-xs"
        >
          Generate Note
        </button>
      </div>

      {/* Actionable Search Engine Layer */}
      <form onSubmit={handleSearchSubmit} className="relative rounded-md shadow-xs w-full">
        <Search
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light stroke-[1.75]"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, platform, difficulty, or language..."
          className="w-full py-2 pl-11 pr-24 bg-bg-surface border-border-default rounded-md text-sm h-10"
        />
        <button
          type="submit"
          className="absolute bottom-1.5 right-2 top-1.5 rounded-sm border border-border-default bg-bg-soft px-3 text-[11px] font-semibold text-text-main transition-colors duration-150 hover:bg-border-strong/20 cursor-pointer"
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
        <div className="rounded-md border border-dashed border-border-default bg-bg-surface p-12 text-center space-y-1">
          <p className="text-xs text-text-muted tracking-wide">
            No notes matched your search parameters.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className={`space-y-4 ${loading ? "pointer-events-none opacity-40" : ""}`}>
          
          {/* Table Header Controls (Pagination Top-Right) */}
          <div className="flex items-center justify-between text-xs font-medium text-text-muted px-0.5">
            <span className="tracking-wide">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, pagination.totalItems)} of {pagination.totalItems} notes
            </span>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-text-light font-mono text-[11px]">
                  Page {currentPage}/{pagination.totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={!pagination.hasPrevious || loading}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-sm border border-border-default bg-bg-surface p-1.5 text-text-main hover:bg-bg-soft transition-all disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={13} className="stroke-[2]" />
                  </button>

                  <button
                    type="button"
                    disabled={!pagination.hasNext || loading}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-sm border border-border-default bg-bg-surface p-1.5 text-text-main hover:bg-bg-soft transition-all disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={13} className="stroke-[2]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tabular Layout Implementation */}
          <div className="overflow-hidden rounded-md border border-border-default bg-bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-bg-soft/60 text-[10px] font-bold uppercase tracking-widest text-text-light border-b border-border-default font-mono">
                  <tr>
                    <th className="px-6 py-3.5">Problem Name</th>
                    <th className="px-6 py-3.5">Platform</th>
                    <th className="px-6 py-3.5">Difficulty</th>
                    <th className="px-6 py-3.5">Language</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Updated</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default text-text-main text-xs">
                  {notes.map((note) => {
                    const { _id: id, problem = {}, language = "C++", status = "draft", createdAt, updatedAt } = note;
                    const title = problem.title || "Untitled Problem";
                    const platform = problem.platform || "Other";
                    const difficulty = problem.difficulty || "Medium";
                    
                    return (
                      <tr 
                        key={id} 
                        className="group hover:bg-bg-soft/30 transition-colors"
                      >
                        {/* Title Column */}
                        <td className="px-6 py-4 max-w-xs sm:max-w-md truncate font-semibold text-text-main">
                          <Link 
                            to={`/notes/${id}`} 
                            className="hover:text-primary transition-colors tracking-wide"
                          >
                            {title}
                          </Link>
                        </td>

                        {/* Platform Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-text-muted font-medium tracking-wide">
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
                          <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted bg-bg-base px-2 py-0.5 rounded-sm border border-border-default/50 w-fit">
                            <Code2 size={12} className="text-text-light stroke-[1.75]" />
                            <span>{language}</span>
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={status === "final" ? "success" : "warning"}>
                            {status}
                          </Badge>
                        </td>

                        {/* Updated Timestamp Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-text-light">
                          <span className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Calendar size={12} className="text-text-muted stroke-[1.75]" />
                            <span>{formatDate(updatedAt || createdAt)}</span>
                          </span>
                        </td>

                        {/* Action Control Icons Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/notes/${id}/edit`}
                              className="rounded-sm p-1.5 text-text-muted hover:bg-bg-soft hover:text-text-main transition-all"
                              title="Edit note"
                            >
                              <Edit3 size={14} className="stroke-[1.75]" />
                            </Link>
                            <Link
                              to={`/notes/${id}`}
                              className="rounded-sm p-1.5 text-text-muted hover:bg-primary-soft hover:text-primary transition-all"
                              title="View full note"
                            >
                              <Eye size={14} className="stroke-[1.75]" />
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