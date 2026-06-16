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
      
      {/* Actionable Save Header Wrapper Controls */}
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
            {saving ? <Loader2 className="animate-spin" size={13} /> : <Check size={13} className="stroke-[2.5]" />}
            <span>Save Modifications</span>
          </button>
        </div>

        <div className="space-y-1 border-t border-border-default/40 pt-4">
          <h1 className="text-xl font-bold text-text-main tracking-wide">
            Modify Notes: <span className="text-primary font-semibold">{problem.title || "DSA Exercise"}</span>
          </h1>
          <p className="text-xs text-text-muted tracking-wide leading-relaxed">
            Review and tweak code implementations, update step trace states, or document newly discovered edge criteria fields.
          </p>
        </div>
      </div>

      {/* Grouped Type-Safe Field Section Editor Canvas Blocks */}
      <div className="space-y-5">
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