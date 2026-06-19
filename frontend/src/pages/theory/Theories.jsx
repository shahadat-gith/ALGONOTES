import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getAllTheoriesByUser, deleteTheoryNote } from "../../api/theoryApi";

import TheoryCard from "../../components/theory/TheoryCard";
import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm";

import NoteHeader from "../../components/common/NoteHeader";
import TheoriesSkeleton from "../../components/skeletons/TheoriesSkeleton";

const Theories = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  // 1. Debounce local search string updates to prevent API flooding
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getAllTheoriesByUser(page, pageSize, debouncedSearch);
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

  useEffect(() => {
    fetchNotes();
  }, [page, debouncedSearch]);

  const handleOpenDeleteModal = (id) => {
    setDeleteTargetId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await deleteTheoryNote(deleteTargetId);
      if (res?.success) {
        setNotes((prev) => prev.filter((note) => note.id !== deleteTargetId));
        toast.success("Note deleted successfully.");
        if (notes.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          fetchNotes();
        }
      }
    } catch (err) {
      toast.error("Failed to delete the note.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="w-full font-sans text-text-main p-4 sm:p-6 max-w-[1400px] mx-auto flex flex-col gap-6 relative z-10 animate-fade-in select-none">
      <NoteHeader
        title="Theory Notes"
        description="Read, manage, and update your personal collection of theory notes."
        btnText="Generate Note"
        onBtnClick={() => navigate("/theory/generate")}
        search={search}
        setSearch={setSearch}
        placeholder="Search your notes..."
      />

      {loading ? (
        <TheoriesSkeleton />
      ) : (
        <>
          {notes.length > 0 && (
            <div className="w-full flex justify-end items-center -mb-2 animate-fade-in">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {notes.length === 0 ? (
            <div className="w-full text-center py-12 border border-border-default rounded-md bg-bg-surface/20 text-xs font-mono text-text-light tracking-wide">
              No matching notes found on this page.
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full animate-fade-in">
              {notes.map((note) => (
                <TheoryCard
                  key={note.id}
                  theory={note}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
          )}
        </>
      )}

      <DeleteConfirm
        isOpen={isModalOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note permanently? This operation cannot be reversed."
        confirmText="Yes! Delete"
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

export default Theories;
