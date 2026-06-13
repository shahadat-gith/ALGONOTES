import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getNoteByProblem, saveNote } from "../../api/noteApi";
import Button from "../../components/common/Button";

import NoteTextBlockEditor from "../../components/notes/editor/NoteTextBlockEditor";
import NoteAlgorithmEditor from "../../components/notes/editor/NoteAlgorithmEditor";
import NoteDryRunEditor from "../../components/notes/editor/NoteDryRunEditor";
import NoteEdgeCaseEditor from "../../components/notes/editor/NoteEdgeCaseEditor";

import { Save, Check, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const EditNotes = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [noteData, setNoteData] = useState({
    bruteForce: [],
    optimalApproach: [],
    algorithm: [],
    dryRun: [],
    edgeCases: [],
  });

  useEffect(() => {
    if (location.state?.draftData) {
      setNoteData(location.state.draftData);
      setLoading(false);
      return;
    }
    const loadNoteSheet = async () => {
      try {
        const response = await getNoteByProblem(problemId);
        if (response.success && response.note) setNoteData(response.note);
      } catch (err) {
        toast.error("Failed to recover saved study blocks.");
      } finally {
        setLoading(false);
      }
    };
    loadNoteSheet();
  }, [problemId, location.state]);

  const handleUpdateField = (section, index, field, value) => {
    const updated = [...noteData[section]];
    updated[index][field] = value;
    setNoteData((prev) => ({ ...prev, [section]: updated }));
  };

  const handleAddContentBlock = (section, type) => {
    const current = noteData[section] || [];
    const newBlock = {
      type,
      order: current.length + 1,
      text: type !== "code" ? "" : "",
      code: type === "code" ? "" : "",
    };
    setNoteData((prev) => ({ ...prev, [section]: [...current, newBlock] }));
  };

  const handleAddAlgorithmStep = () => {
    const current = noteData.algorithm || [];
    const newStep = { stepNo: current.length + 1, title: "", description: "" };
    setNoteData((prev) => ({ ...prev, algorithm: [...current, newStep] }));
  };

  const handleAddDryRunStep = () => {
    const current = noteData.dryRun || [];
    const newRow = {
      stepNo: current.length + 1,
      inputState: "",
      action: "",
      outputState: "",
      explanation: "",
    };
    setNoteData((prev) => ({ ...prev, dryRun: [...current, newRow] }));
  };

  const handleAddEdgeCase = () => {
    const current = noteData.edgeCases || [];
    const newCase = { case: "", explanation: "" };
    setNoteData((prev) => ({ ...prev, edgeCases: [...current, newCase] }));
  };

  const handleDeleteRow = (section, index) => {
    const filtered = noteData[section].filter((_, i) => i !== index);
    const reindexed = filtered.map((item, idx) => ({
      ...item,
      [section === "algorithm" || section === "dryRun" ? "stepNo" : "order"]:
        idx + 1,
    }));
    setNoteData((prev) => ({ ...prev, [section]: reindexed }));
  };


  const handleCommitSave = async (targetStatus = "draft") => {
    setSaving(true);
    try {
      const response = await saveNote({
        ...noteData,
        problem: problemId,
        status: targetStatus,
      });
      if (response.success) {
        toast.success(`Note saved as ${targetStatus}!`);
        navigate(`/notes/${problemId}/view`);
      }
    } catch (err) {
      toast.error("Failed to submit notebooks layout mutations.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-[var(--primary)]">
        <Loader2 className="animate-spin mb-2" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-4">
       
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleCommitSave("draft")}
            loading={saving}
            className="bg-white"
          >
            <Save size={15} /> Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCommitSave("final")}
            loading={saving}
          >
            <Check size={15} /> Finalize Note
          </Button>
        </div>
      </div>

      <NoteTextBlockEditor
        sectionKey="bruteForce"
        title="1. Brute Force"
        blocks={noteData.bruteForce}
        onUpdate={handleUpdateField}
        onAdd={handleAddContentBlock}
        onDelete={handleDeleteRow}
      />
      <NoteTextBlockEditor
        sectionKey="optimalApproach"
        title="2. Optimal Approach"
        blocks={noteData.optimalApproach}
        onUpdate={handleUpdateField}
        onAdd={handleAddContentBlock}
        onDelete={handleDeleteRow}
      />
      <NoteAlgorithmEditor
        steps={noteData.algorithm}
        onUpdate={handleUpdateField}
        onAdd={handleAddAlgorithmStep}
        onDelete={handleDeleteRow}
      />
      <NoteDryRunEditor
        rows={noteData.dryRun}
        onUpdate={handleUpdateField}
        onAdd={handleAddDryRunStep}
        onDelete={handleDeleteRow}
      />
      <NoteEdgeCaseEditor
        cases={noteData.edgeCases}
        onUpdate={handleUpdateField}
        onAdd={handleAddEdgeCase}
        onDelete={handleDeleteRow}
      />
    </div>
  );
};

export default EditNotes;
