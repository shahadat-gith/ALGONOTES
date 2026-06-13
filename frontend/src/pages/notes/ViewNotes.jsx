import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getNoteByProblem } from "../../api/noteApi";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

// Clean import links pointing to the brand-new viewer submodule paths
import NoteBlockViewer from "../../components/notes/viewer/NoteBlockViewer";
import NoteAlgorithmViewer from "../../components/notes/viewer/NoteAlgorithmViewer";
import NoteDryRunViewer from "../../components/notes/viewer/NoteDryRunViewer";
import NoteEdgeCaseViewer from "../../components/notes/viewer/NoteEdgeCaseViewer";

import { Edit3, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import ViewNotesSkeleton from "../../components/skeletons/ViewNotesSkeleton";

const ViewNotes = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoteSheet = async () => {
      try {
        const response = await getNoteByProblem(problemId);
        if (response.success && response.note) setNote(response.note);
      } catch (err) {
        toast.error("Failed to fetch structured note blocks.");
      } finally {
        setLoading(false);
      }
    };
    fetchNoteSheet();
  }, [problemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
        <ViewNotesSkeleton />
      </div>
    );
  }

  if (!note)
    return (
      <div className="text-center py-12">
        <Link to={`/problems/${problemId}/generate`}>
          <Button size="sm">Generate Notes Now</Button>
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Badge variant={note.status === "final" ? "success" : "warning"}>
            {note.status}
          </Badge>
          <Link to={`/notes/${problemId}/edit`}>
            <Button size="sm">
              <Edit3 size={14} /> Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2">
            1. Brute Force Approach
          </h2>
          <NoteBlockViewer blocks={note.bruteForce} />
        </div>
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2">
            2. Optimal Approach
          </h2>
          <NoteBlockViewer blocks={note.optimalApproach} />
        </div>
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2">
            3. Algorithm Steps
          </h2>
          <NoteAlgorithmViewer steps={note.algorithm} />
        </div>
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2">
            4. Dry Run Execution Simulation
          </h2>
          <NoteDryRunViewer steps={note.dryRun} />
        </div>
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2">
            5. Edge Cases
          </h2>
          <NoteEdgeCaseViewer cases={note.edgeCases} />
        </div>
      </div>
    </div>
  );
};

export default ViewNotes;
