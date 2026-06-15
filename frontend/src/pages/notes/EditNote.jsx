import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getNoteById, updateNote } from "../../api/noteApi";
import EditNoteSkeleton from "../../components/skeletons/EditNoteSkeleton";

import ListSectionEditor from "../../components/notes/ListSectionEditor";
import ApproachSectionEditor from "../../components/notes/ApproachSectionEditor";
import DryRunSectionEditor from "../../components/notes/DryRunSectionEditor";

const EMPTY_NOTE = {
  summary: [],
  intuition: [],
  complexity: [],
  edgeCases: [],
  mistakesToAvoid: [],
  dryRun: [],
  bruteForce: null,
  optimalApproach: null,
};

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [problem, setProblem] = useState({});
  const [note, setNote] = useState(EMPTY_NOTE);
  const [language, setLanguage] = useState("C++");
  const [userCode, setUserCode] = useState("");

  useEffect(() => {
    const loadNote = async () => {
      try {
        const response = await getNoteById(id);

        if (!response?.success || !response?.note) {
          throw new Error("Note not found");
        }

        const fetchedNote = response.note;

        setProblem(fetchedNote.problem || {});
        setNote({
          ...EMPTY_NOTE,
          ...(fetchedNote.note || {}),
        });
        setLanguage(fetchedNote.language || "C++");
        setUserCode(fetchedNote.userCode || "");
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
        status,
      };

      const response = await updateNote(id, payload);

      if (!response?.success) {
        throw new Error("Update transmission failed");
      }

      toast.success("Note saved successfully.");
      // Navigates directly back to your clean structural reader view page
      navigate(`/notes/${id}`);
    } catch (error) {
      toast.error("Failed to update note details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
        <EditNoteSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
      {/* Actionable Save Header Wrapper Controls */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={() => handleSave("final")}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 transition-all"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
            Save Modifications
          </button>
        </div>

        <div className="mt-5">
          <h1 className="text-xl font-bold text-[var(--text-main)]">
            Modify Notes: {problem.title || "DSA Exercise"}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Review and tweak code implementations, update step trace steps, or document newly discovered edge criteria fields.
          </p>
        </div>
      </div>

      {/* Grouped Type-Safe Field Section Blocks */}
      <div className="space-y-6">
        <ListSectionEditor title="Problem Summary List" items={note.summary} onChange={(d) => updateSectionData("summary", d)} />
        <ListSectionEditor title="Intuition Tracking Breakdown" items={note.intuition} onChange={(d) => updateSectionData("intuition", d)} />

        <ApproachSectionEditor title="Brute Force Setup Block" approach={note.bruteForce} defaultLanguage={language} onChange={(d) => updateSectionData("bruteForce", d)} />
        <ApproachSectionEditor title="Optimal Implementation Layer" approach={note.optimalApproach} defaultLanguage={language} onChange={(d) => updateSectionData("optimalApproach", d)} />

        <DryRunSectionEditor dryRun={note.dryRun} onChange={(d) => updateSectionData("dryRun", d)} />

        <ListSectionEditor title="Complexity Metrics" items={note.complexity} onChange={(d) => updateSectionData("complexity", d)} />
        <ListSectionEditor title="Important Boundary Conditions" items={note.edgeCases} onChange={(d) => updateSectionData("edgeCases", d)} />
        <ListSectionEditor title="Critical Implementation Pitfalls" items={note.mistakesToAvoid} onChange={(d) => updateSectionData("mistakesToAvoid", d)} />
      </div>
    </div>
  );
};

export default EditNote;