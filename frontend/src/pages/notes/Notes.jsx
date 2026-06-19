import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

import { getAllNotesByUser, deleteNote } from "../../api/noteApi";
import Input from "../../components/common/Input";
import EmptyState from "../../components/common/EmptyState";
import NotesSkeleton from "../../components/skeletons/NotesSkeleton";

import NoteCard from "../../components/notes/NoteCard";
import DeleteConfirm from "../../components/common/DeleteConfirm";
import Pagination from "../../components/common/Pagination";
import NoteHeader from "../../components/common/NoteHeader";

const PAGE_SIZE = 10;

const Notes = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      console.log(error);
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

  const handleOpenDeleteModal = (id) => {
    setDeleteTargetId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await deleteNote(deleteTargetId);
      if (res?.success) {
        setNotes((prev) => prev.filter((note) => note._id !== deleteTargetId));
        toast.success("Note deleted successfully.");
        if (notes.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
        else fetchNotes(currentPage, submittedSearch);
      }
    } catch (err) {
      toast.error("Failed to delete the note.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setDeleteTargetId(null);
    }
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
      <NoteHeader
        title="DSA Notes"
        description="All your generated DSA notes."
        btnText="Generate Note"
        onBtnClick={() => navigate("/notes/generate")}
        search={search}
        setSearch={setSearch}
        placeholder="Search by title, platform, difficulty, or language..."
      />

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
        <div
          className={`space-y-4 ${loading ? "pointer-events-none opacity-40" : ""}`}
        >
          {/* Row Control Layer: Count & Reusable Pagination (Top-Right Alignment) */}
          <div className="flex items-center justify-between text-xs font-medium text-text-muted px-0.5">
            <span className="tracking-wide">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
              {Math.min(currentPage * PAGE_SIZE, pagination.totalItems)} of{" "}
              {pagination.totalItems} notes
            </span>

            <Pagination
              page={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Clean Grid Layout System Replacing Old <table> Setup */}
          <div className="flex flex-col gap-4 w-full">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Safe Portal Delete Modal Overlay Hook */}
      <DeleteConfirm
        isOpen={isModalOpen}
        title="Delete Note"
        message="Are you sure you want to delete this study note permanently? This action cannot be undone."
        confirmText="Permanently Delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsModalOpen(false);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

export default Notes;
