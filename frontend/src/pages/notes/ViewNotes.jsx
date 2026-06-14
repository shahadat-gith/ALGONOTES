import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getNoteById } from "../../api/noteApi"; 
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

// Rendering modules
import ProblemHeaderViewer from "../../components/notes/viewer/ProblemHeaderViewer";
import NoteBlockViewer from "../../components/notes/viewer/NoteBlockViewer";
import NoteAlgorithmViewer from "../../components/notes/viewer/NoteAlgorithmViewer";
import NoteDryRunViewer from "../../components/notes/viewer/NoteDryRunViewer";
import NoteEdgeCaseViewer from "../../components/notes/viewer/NoteEdgeCaseViewer";

import { Edit3, RefreshCw, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import ViewNotesSkeleton from "../../components/skeletons/ViewNotesSkeleton";
import EmptyState from "../../components/common/EmptyState";

const ViewNotes = () => {
  const { noteId } = useParams(); // Using noteId now contextually from dashboard routes
  const navigate = useNavigate();
  
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchNote = async () => {
    try {
      const response = await getNoteById(noteId);
      
      // Handle HTTP 202 status or active generation states gracefully
      if (response.status === "processing" || response.detail?.includes("processing")) {
        setIsProcessing(true);
        return;
      }

      if (response.success && response.note) {
        setNoteData(response.note);
        setIsProcessing(false);
      }
    } catch (err) {
      // Intercept errors if the generation framework drops tasks completely
      if (err.response?.status === 422) {
        toast.error("AI engine layout processing failed for this item.");
      } else {
        toast.error("Failed to fetch structured note metadata blocks.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  // Loading Skeleton State
  if (loading && !isProcessing) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <ViewNotesSkeleton />
      </div>
    );
  }

  // Active Polling/Processing Layout Fallback
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
        <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border-default)] shadow-sm text-center max-w-md space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <RefreshCw size={48} className="text-[var(--primary)] animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">AI Note is cooking...</h3>
          <p className="text-sm text-[var(--text-muted)]">
            We are compiling deep algorithmic notes, dry runs, and runtime constraints inside Mumbai. This takes roughly 15-30 seconds.
          </p>
          <Button size="sm" variant="outline" onClick={fetchNote} className="mt-2">
            <RefreshCw size={14} className="mr-1.5" /> Check Status Manually
          </Button>
        </div>
      </div>
    );
  }

  // Null Missing/Empty Record State Fallback 
  if (!noteData) {
    return (
      <EmptyState 
        title="Note Not Found"
        description="This structural block mapping could not be extracted or does not exist."
        actionText="Back to Dashboard"
        onAction={() => navigate("/dashboard")}
      />
    );
  }

  // Check if AI Pipeline dropped tasks midway
  if (noteData.status === "failed") {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
        <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border-default)] shadow-sm text-center max-w-md space-y-4">
          <AlertTriangle size={48} className="text-[var(--danger)] mx-auto animate-bounce" />
          <h3 className="text-lg font-bold text-[var(--text-main)]">Generation Error</h3>
          <p className="text-sm text-[var(--text-muted)]">
            The background processing pipeline ran into structural evaluation errors with the provided source constraints.
          </p>
          <Button size="sm" onClick={() => navigate("/dashboard")}>
            Return to Feed
          </Button>
        </div>
      </div>
    );
  }

  // Destruction Extraction Mapping variables safely according to db architecture models
  const { problem, note: blocks, status: noteStatus, language } = noteData;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Action Utility Row */}
      <div className="flex items-center justify-between border-b pb-4 border-[var(--border-default)]">
        <Button size="sm" variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-1">
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant={language === "Python" ? "primary" : "default"}>
            {language}
          </Badge>
          <Badge variant={noteStatus === "final" ? "success" : "warning"}>
            {noteStatus}
          </Badge>
          <Link to={`/notes/${noteId}/edit`}>
            <Button size="sm" className="flex items-center gap-1.5">
              <Edit3 size={14} /> Edit Note
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Structural Core Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Column: Problem Description & Specifications */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
          <ProblemHeaderViewer problem={problem} />
        </div>

        {/* Right Side Column: AI Notes Structured Content Block Component Engine */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Summary / Core Intuition Blocks */}
          {blocks.summary && blocks.summary.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2 tracking-wide">
                Problem Summary
              </h2>
              <NoteBlockViewer blocks={blocks.summary} />
            </div>
          )}

          {blocks.intuition && blocks.intuition.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2 tracking-wide">
                Algorithmic Intuition
              </h2>
              <NoteBlockViewer blocks={blocks.intuition} />
            </div>
          )}

          {/* Brute Force Approach Card Layer */}
          {blocks.bruteForce && blocks.bruteForce.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[var(--text-muted)] border-b pb-2 tracking-wide">
                1. Brute Force Approach
              </h2>
              <NoteBlockViewer blocks={blocks.bruteForce} />
            </div>
          )}

          {/* Optimal Approach Card Layer */}
          {blocks.optimalApproach && blocks.optimalApproach.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4 ring-1 ring-[var(--primary-soft)]">
              <h2 className="text-base font-bold text-[var(--primary)] border-b pb-2 tracking-wide">
                2. Optimal Strategy
              </h2>
              <NoteBlockViewer blocks={blocks.optimalApproach} />
            </div>
          )}

          {/* Core Procedural Step Blocks */}
          {blocks.algorithm && blocks.algorithm.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2 tracking-wide">
                3. Execution Walkthrough Sequence
              </h2>
              <NoteAlgorithmViewer steps={blocks.algorithm} />
            </div>
          )}

          {/* Dynamic Spreadsheet Simulation Matrix Grid Layout */}
          {blocks.dryRun && blocks.dryRun.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4 overflow-x-auto">
              <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2 tracking-wide">
                4. State Simulation Matrix Grid
              </h2>
              <NoteDryRunViewer steps={blocks.dryRun} />
            </div>
          )}

          {/* Edge Cases Analysis Block */}
          {blocks.edgeCases && blocks.edgeCases.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[var(--text-main)] border-b pb-2 tracking-wide">
                5. High-Risk Boundaries & Edge Conditions
              </h2>
              <NoteEdgeCaseViewer cases={blocks.edgeCases} />
            </div>
          )}

          {/* Mistakes To Avoid Block Mapping Layer */}
          {blocks.mistakesToAvoid && blocks.mistakesToAvoid.length > 0 && (
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--danger-soft)] rounded-2xl shadow-sm space-y-4 bg-gradient-to-br from-white to-[var(--danger-soft)]">
              <h2 className="text-base font-bold text-[var(--danger)] border-b pb-2 tracking-wide">
                6. Pitfalls & Common Anti-Patterns
              </h2>
              <NoteEdgeCaseViewer cases={blocks.mistakesToAvoid} />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ViewNotes;