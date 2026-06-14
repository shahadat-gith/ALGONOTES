import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNoteById, updateNote } from "../../api/noteApi";
import NoteSectionEditor from "../../components/notes/editor/NoteSectionEditor";

import {
  ArrowLeft,
  Check,
  Loader2,
  ExternalLink,
  Save,
} from "lucide-react";

import toast from "react-hot-toast";

const EMPTY_NOTE = {
  summary: [],
  intuition: [],
  bruteForce: [],
  optimalApproach: [],
  algorithm: [],
  dryRun: [],
  complexity: [],
  edgeCases: [],
  mistakesToAvoid: [],
};

const SECTIONS = [
  { key: "summary", title: "Summary" },
  { key: "intuition", title: "Core Intuition" },
  { key: "bruteForce", title: "Brute Force" },
  { key: "optimalApproach", title: "Optimal Approach" },
  { key: "algorithm", title: "Algorithm Steps" },
  { key: "dryRun", title: "Dry Run" },
  { key: "complexity", title: "Complexity Analysis" },
  { key: "edgeCases", title: "Edge Cases" },
  { key: "mistakesToAvoid", title: "Mistakes to Avoid" },
];

const EditNotes = () => {
  const { noteId } = useParams();
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
        const response = await getNoteById(noteId);

        if (response.success && response.note) {
          setProblem(response.note.problem || {});
          setNote({
            ...EMPTY_NOTE,
            ...(response.note.note || {}),
          });
          setLanguage(response.note.language || "C++");
          setUserCode(response.note.userCode || "");
        }
      } catch (err) {
        toast.error("Failed to load note.");
        navigate("/notes");
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, navigate]);

  const updateProblemField = (field, value) => {
    setProblem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSectionBlocks = (sectionKey, blocks) => {
    setNote((prev) => ({
      ...prev,
      [sectionKey]: blocks,
    }));
  };

  const handleSave = async (status = "draft") => {
    setSaving(true);

    try {
      const payload = {
        problem,
        note,
        language,
        userCode,
        status,
      };

      const response = await updateNote(noteId, payload);

      if (response.success) {
        toast.success(status === "final" ? "Note finalized." : "Note saved.");
        navigate(`/notes/${noteId}/view`);
      }
    } catch (err) {
      toast.error("Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-[var(--primary)]">
        <Loader2 className="animate-spin" size={34} />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate("/notes")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)]"
          >
            <ArrowLeft size={15} />
            Back to notes
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-soft)]"
            >
              <Save size={14} />
              Save Draft
            </button>

            <button
              onClick={() => handleSave("final")}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--primary-hover)]"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
              Finalize
            </button>
          </div>
        </div>

        <div>
  <h1 className="text-2xl font-black text-[var(--text-main)]">
    Generated notes for {problem.title || "this problem"}
  </h1>

  <p className="mt-1 text-sm text-[var(--text-muted)]">
    Edit the generated explanation, algorithm, dry run, edge cases, and code notes.
  </p>
</div>
      </div>

      {SECTIONS.map((section) => (
        <NoteSectionEditor
          key={section.key}
          sectionKey={section.key}
          title={section.title}
          blocks={note[section.key] || []}
          onChange={(updatedBlocks) =>
            updateSectionBlocks(section.key, updatedBlocks)
          }
          language={language}
        />
      ))}
    </div>
  );
};

export default EditNotes;