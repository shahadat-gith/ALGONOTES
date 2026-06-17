import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Loader2, StickyNote } from "lucide-react";
import toast from "react-hot-toast";

import { getNoteById, updateNote } from "../../api/noteApi";
import EditNoteSkeleton from "../../components/skeletons/EditNoteSkeleton";

import TextEditor from "../../components/notes/editor/TextEditor";
import ApproachEditor from "../../components/notes/editor/ApproachEditor";
import DryRunEditor from "../../components/notes/editor/DryRunEditor";
import ListEditor from "../../components/notes/editor/ListEditor";

const EMPTY_NOTE = {
  intuition: "",
  edgeCases: [],
  mistakesToAvoid: [],
  dryRun: [],
  bruteForce: null,
  better: null,
  optimalApproach: null,
};

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [problem, setProblem] = useState({});
  const [note, setNote] = useState(EMPTY_NOTE);
  const [language, setLanguage] = useState("C++");
  const [userCode, setUserCode] = useState("");
  const [userNotes, setUserNotes] = useState("");

  useEffect(() => {
    const loadNote = async () => {
      try {
        const response = await getNoteById(id);
        if (!response?.success || !response?.note) {
          throw new Error("Note not found");
        }

        const fetchedNote = response.note;
        setProblem(fetchedNote.problem || {});
        setLanguage(fetchedNote.language || "C++");
        setUserCode(fetchedNote.userCode || "");
        setUserNotes(fetchedNote.userNotes || "");

        setNote({
          ...EMPTY_NOTE,
          ...(fetchedNote.note || {}),
        });
      } catch (error) {
        toast.error("Failed to load note data.");
        navigate("/notes");
      } finally {
        setLoading(false);
      }
    };
    loadNote();
  }, [id, navigate]);

  const updateSectionData = (key, data) => {
    setNote((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  const handleSave = async (status = "final") => {
    setSaving(true);
    try {
      const payload = {
        problem,
        note,
        language,
        userCode,
        userNotes,
        status,
      };

      const response = await updateNote(id, payload);
      if (!response?.success) {
        throw new Error("Update transmission failed");
      }

      toast.success("Note saved successfully.");
      navigate(`/notes/${id}`);
    } catch (error) {
      toast.error("Failed to update note details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <EditNoteSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative z-10">
      {/* Top Banner Context Wrapper Row */}
      <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="stroke-[2]" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("final")}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 h-9 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={13} />
            ) : (
              <Check size={13} className="stroke-[2.5]" />
            )}
            <span>Save Modifications</span>
          </button>
        </div>

        <div className="space-y-1 border-t border-border-default/40 pt-4">
          <h1 className="text-xl font-bold text-text-main tracking-wide">
            Modify Notes:{" "}
            <span className="text-primary font-semibold">
              {problem.title || "DSA Exercise"}
            </span>
          </h1>
          <p className="text-xs text-text-muted tracking-wide leading-relaxed">
            Tweak structured descriptions, complexity metrics, step tracks, or
            runtime boundary situations.
          </p>
        </div>
      </div>

      {/* Editor Main Canvas Form Fields Stack */}
      <div className="space-y-5">
        <TextEditor
          title="Your Custom Notes"
          textString={userNotes}
          onChange={(val) => setUserNotes(val)}
        />


        <TextEditor
          title="Intuition"
          textString={note.intuition}
          onChange={(val) => updateSectionData("intuition", val)}
        />

        {/* Decoupled Solution Strategy Framework Blocks */}
        {note.bruteForce && (
          <ApproachEditor
            title="1. Brute Force Approach"
            approach={note.bruteForce}
            defaultLanguage={language}
            onChange={(data) => updateSectionData("bruteForce", data)}
          />
        )}

        {/* Conditionally Render Better Algorithmic Transition Phase if it exists */}
        {note.better && (
          <ApproachEditor
            title="2. Better Approach"
            approach={note.better}
            defaultLanguage={language}
            onChange={(data) => updateSectionData("better", data)}
          />
        )}

        {/* Conditionally Render Optimal Implementation Layer if it exists */}
        {note.optimalApproach && (
          <ApproachEditor
            title="3. Optimal Approach"
            approach={note.optimalApproach}
            defaultLanguage={language}
            onChange={(data) => updateSectionData("optimalApproach", data)}
          />
        )}

        {/* Tabular Dry-run Matrix Engine */}
        <DryRunEditor
          dryRun={note.dryRun}
          onChange={(matrix) => updateSectionData("dryRun", matrix)}
        />

        {/* Standard List Arrays Track Fields */}
        <ListEditor
          title="Important Boundary Edge Cases"
          items={note.edgeCases}
          onChange={(list) => updateSectionData("edgeCases", list)}
        />
        <ListEditor
          title="Critical Implementation Mistakes to Avoid"
          items={note.mistakesToAvoid}
          onChange={(list) => updateSectionData("mistakesToAvoid", list)}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
