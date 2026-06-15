import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit3 } from "lucide-react";
import toast from "react-hot-toast";

import { getNoteById } from "../../api/noteApi";

import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import NoteDetailsSkeleton from "../../components/skeletons/NoteDetailsSkeleton";

import ProblemDetails from "../../components/notes/ProblemDetails";
import SummaryCard from "../../components/notes/SummaryCard";
import ApproachCard from "../../components/notes/ApproachCard";
import DryRunCard from "../../components/notes/DryRunCard";
import BulletListCard from "../../components/notes/BulletListCard";

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNoteById(id);

        if (!response?.success || !response?.note) {
          throw new Error("Note not found");
        }

        setNoteData(response.note);
      } catch (error) {
        toast.error("Failed to load note.");
        setNoteData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
        <NoteDetailsSkeleton />
      </div>
    );
  }

  if (!noteData) {
    return (
      <EmptyState
        title="Note not found"
        description="This note does not exist or could not be loaded."
        actionText="Back to Notes"
        onAction={() => navigate("/notes")}
      />
    );
  }

  const {
    problem,
    note = {},
    status = "draft",
    language = "C++",
  } = noteData;

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] space-y-6 bg-[var(--bg-base)] p-4 sm:pt-6 lg:pt-8">
      {/* Upper Navigation Header Grid */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="default">{language}</Badge>
          <Badge variant={status === "final" ? "success" : "warning"}>
            {status}
          </Badge>

          <Link to={`/notes/${id}/edit`}>
            <Button size="sm" className="flex items-center gap-1.5">
              <Edit3 size={14} />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Container View Splits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="space-y-6 lg:sticky lg:top-6 lg:col-span-5 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <ProblemDetails problem={problem} />
        </aside>

        <main className="space-y-6 lg:col-span-7">
          {/* Plain Text Lists */}
          <SummaryCard summary={note.summary} />
          
          <BulletListCard title="Intuition" items={note.intuition} />

          {/* Deep Approach Layout Blocks */}
          <ApproachCard title="Brute Force Approach" approach={note.bruteForce} />
          
          <ApproachCard title="Optimal Approach" approach={note.optimalApproach} highlight />

          {/* Table Execution Matrix */}
          <DryRunCard dryRun={note.dryRun} />

          {/* Specialized Bullet Metrics */}
          <BulletListCard title="Complexity Analysis" items={note.complexity} />
          
          <BulletListCard title="Important Edge Cases" items={note.edgeCases} />
          
          <BulletListCard title="Mistakes To Avoid" items={note.mistakesToAvoid} variant="danger" />
        </main>
      </div>
    </div>
  );
};

export default NoteDetails;