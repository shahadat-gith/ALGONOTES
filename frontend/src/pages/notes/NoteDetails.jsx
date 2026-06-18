import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Edit3,
  ArrowLeft,
  AlertCircle,
  FileText,
  Code2,
  Activity,
  ShieldAlert,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";

import { getNoteById } from "../../api/noteApi";

import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import NoteDetailsSkeleton from "../../components/skeletons/NoteDetailsSkeleton";

import Problem from "../../components/notes/details/Problem";
import UserNotes from "../../components/notes/details/UserNotes";
import DryRun from "../../components/notes/details/DryRun";
import Intuition from "../../components/notes/details/Intuition";
import Approach from "../../components/notes/details/Approach";
import EdgeCases from "../../components/notes/details/EdgeCases";
import Mistakes from "../../components/notes/details/Mistakes";

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true)
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
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <NoteDetailsSkeleton />
      </div>
    );
  }

  if (!noteData) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Note not found"
          description="This note does not exist or could not be loaded."
          actionText="Back to Notes"
          onAction={() => navigate("/notes")}
        />
      </div>
    );
  }

  const {
    problem,
    note = {},
    status = "draft",
    language = "C++",
    userNotes = "",
  } = noteData;

  const tabOptions = [
    { id: "problem", label: "Problem Statement", icon: Code },
    { id: "overview", label: "Overview & Intuition", icon: FileText },
    { id: "strategies", label: "Approach & Solutions", icon: Code2 },
    { id: "dryrun", label: "Dry run execution", icon: Activity },
    { id: "analysis", label: "Edge Cases & Pitfalls", icon: ShieldAlert },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative z-10">
      
      {/* Upper Navigation Header Row */}
      <div className="flex items-center justify-between border-b border-border-default pb-5">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(-1)}
          className="h-9 text-xs font-semibold px-4 border-border-default hover:bg-bg-soft hover:border-border-strong text-text-main flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} className="stroke-[2]" />
          <span>Back</span>
        </Button>

        <div className="flex items-center gap-3.5">
          <Badge
            variant="default"
            className="font-mono text-[11px] px-2.5 py-0.5"
          >
            {language}
          </Badge>
          <Badge
            variant={status === "final" ? "success" : "warning"}
            className="text-[11px] px-2.5 py-0.5"
          >
            {status}
          </Badge>

          <Link to={`/notes/${id}/edit`} className="block">
            <Button
              size="sm"
              variant="primary"
              className="h-9 text-xs font-semibold px-4 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 size={13} className="stroke-[2]" />
              <span>Edit Note</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Segmented Tab Controller Rail Bar */}
      <div className="flex items-center gap-1 bg-bg-soft/40 p-1 rounded-md border border-border-default/60 overflow-x-auto custom-scrollbar w-full">
        {tabOptions.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? "bg-bg-surface border border-border-default text-primary shadow-xs"
                  : "text-text-muted hover:text-text-main hover:bg-bg-soft/20"
              }`}
            >
              <TabIcon
                size={13}
                className={
                  isActive
                    ? "text-primary stroke-[2]"
                    : "text-text-light stroke-[1.75]"
                }
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Render Area */}
      <main className="focus:outline-hidden animate-fade-in w-full min-h-[50vh]">
        
        {/* TAB 1: PROBLEM STATEMENT */}
        {activeTab === "problem" && (
          <div className="w-full animate-fade-in">
            {problem && Object.keys(problem).length > 0 ? (
              <Problem problem={problem} />
            ) : (
              <div className="bg-bg-surface border border-border-default rounded-md p-6 text-center space-y-2 shadow-card">
                <AlertCircle
                  size={20}
                  className="text-text-light mx-auto stroke-[1.75]"
                />
                <p className="text-xs text-text-muted tracking-wide font-medium">
                  Problem descriptions could not be resolved cleanly for this snapshot.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OVERVIEW & INTUITION */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <UserNotes userNotes={userNotes} />
            <Intuition intuition={note.intuition} />
          </div>
        )}

        {/* TAB 3: CODE SOLUTIONS */}
        {activeTab === "strategies" && (
          <div className="space-y-6 animate-fade-in">
            <Approach
              title="1. Brute Force Approach"
              approach={note.bruteForce}
              language={noteData.language}
            />
            <Approach 
              title="2. Better Solution" 
              approach={note.better} 
              language={noteData.language}
            />
            <Approach
              title="3. Optimal Approach"
              approach={note.optimalApproach}
              highlight={true}
              language={noteData.language}
            />
          </div>
        )}

        {/* TAB 4: EXECUTION TRACE MATRIX */}
        {activeTab === "dryrun" && (
          <div className="w-full animate-fade-in">
            <DryRun 
              dryRun={note.dryRun} 
              code={note.optimalApproach?.codeBlock?.code || ""} 
              language={noteData?.language || ""}
            />
          </div>
        )}

        {/* TAB 5: ANALYTICS & PITFALLS */}
        {activeTab === "analysis" && (
          <div className="space-y-6 animate-fade-in">
            <EdgeCases edgeCases={note.edgeCases} />
            <Mistakes mistakesToAvoid={note.mistakesToAvoid} />
          </div>
        )}
      </main>
    </div>
  );
};

export default NoteDetails;