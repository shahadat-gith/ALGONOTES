import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNotesByUser } from "../../api/noteApi";
import NoteCard from "../../components/notes/viewer/NoteCard";
import Input from "../../components/common/Input";
import EmptyState from "../../components/common/EmptyState";
import { Search, Loader2, FileText, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import NotesSummary from "../../components/notes/viewer/NotesSummary";
import NotesSkeleton from "../../components/skeletons/NotesSkeleton";

const Notes = () => {
  const navigate = useNavigate();

  // Data and UI States
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Input State
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const data = await getAllNotesByUser();
        if (data.success) {
          setNotes(data.notes);
        }
      } catch (err) {
        toast.error("Could not load your notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserNotes();
  }, []);

  // Filter notes strictly based on the text input matching the problem title
  const filteredNotes = notes.filter((noteItem) => {
    const titleString = noteItem.problem?.title?.toLowerCase() || "";
    return titleString.includes(search.toLowerCase());
  });

  // Top metric counters
  const totalNotesCount = notes.length;
  const finalizedCount = notes.filter((n) => n.status === "final").length;
  const draftCount = totalNotesCount - finalizedCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
        <NotesSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* Header Block */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
          Your Generated Notes
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Review your strategy logs, code breakdowns, and algorithmic step
          notes.
        </p>
      </div>

      {/* Summary Metrics Banner */}
      <NotesSummary
        totalNotesCount={totalNotesCount}
        finalizedCount={finalizedCount}
        draftCount={draftCount}
      />

      {/* Simple Search Input Console */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-light)]">
          <Search size={18} />
        </div>
        <Input
          placeholder="Search notes by problem title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11"
        />
      </div>

      {/* Notes Post Feed */}
      {notes.length === 0 ? (
        <EmptyState
          title="No notes created yet"
          description="Go to your problem workspace and select a problem to generate note content cards here."
          actionText="Browse Problems"
          onAction={() => navigate("/problems")}
        />
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[var(--bg-surface)] border border-dashed border-[var(--border-default)] rounded-2xl text-center">
          <p className="text-sm text-[var(--text-muted)] font-medium mb-1">
            No notes match your search.
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            Clear search query
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredNotes.map((noteItem) => (
            <NoteCard key={noteItem.id} noteItem={noteItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
