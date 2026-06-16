// components/notes/GenerateNote.jsx

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateAiNote, checkNoteStatus } from "../../api/geminiApi";
import { deleteNote } from "../../api/noteApi";
import Steps from "./Steps";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

import { Sparkles, Code2, AlertTriangle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const LANGUAGE_OPTIONS = [
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "C",
];

const INITIAL_STEPS = [
  { id: 1, text: "Reading problem link and solution code", status: "waiting" },
  { id: 2, text: "Extracting problem details and examples", status: "waiting" },
  { id: 3, text: "Understanding your algorithmic approach", status: "waiting" },
  { id: 4, text: "Creating concise revision notes", status: "waiting" },
  {
    id: 5,
    text: "Preparing dry run, edge cases, and complexity",
    status: "waiting",
  },
  { id: 6, text: "Finalising the generated note", status: "waiting" },
];

const GenerateNote = () => {
  const navigate = useNavigate();
  const pollTimer = useRef(null);

  const [formData, setFormData] = useState({
    problemLink: "",
    userCode: "",
    language: "C++",
  });
  const [errors, setErrors] = useState({ problemLink: "", userCode: "" });
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const resetSteps = () => setSteps(INITIAL_STEPS);

  const updateCurrentStep = () => {
    setSteps((prevSteps) => {
      const activeIndex = prevSteps.findIndex(
        (step) => step.status === "running",
      );
      if (activeIndex === -1) {
        return prevSteps.map((step, index) =>
          index === 0 ? { ...step, status: "running" } : step,
        );
      }
      if (activeIndex >= prevSteps.length - 1) return prevSteps;

      return prevSteps.map((step, index) => {
        if (index < activeIndex) return { ...step, status: "completed" };
        if (index === activeIndex) return { ...step, status: "completed" };
        if (index === activeIndex + 1) return { ...step, status: "running" };
        return step;
      });
    });
  };

  const failActiveSteps = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.status === "running" || step.status === "waiting"
          ? { ...step, status: "failed" }
          : step,
      ),
    );
  };

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  const handleGenerationFailure = async (noteId, message) => {
    stopPolling();
    failActiveSteps();
    setLoading(false);
    setApiErrorMessage(message);

    try {
      await deleteNote(noteId);
    } catch (cleanError) {
      console.error("Failed to run automated collection cleanup:", cleanError);
    }
  };

  const startPolling = (noteId) => {
    let tickCount = 0;
    stopPolling();

    pollTimer.current = setInterval(async () => {
      tickCount += 1;
      try {
        const check = await checkNoteStatus(noteId);
        if (!check?.success) return;

        if (check.status === "draft" || check.status === "final") {
          stopPolling();
          setSteps((prev) => prev.map((s) => ({ ...s, status: "completed" })));
          toast.success("Note generated successfully!");
          setTimeout(
            () => navigate(`/notes/${noteId}`, { replace: true }),
            800,
          );
          return;
        }

        if (check.status === "failed") {
          // Pass down noteId to execute post-failure collection sweeping rules safely
          handleGenerationFailure(
            noteId,
            check.message ||
              "AI service is temporarily experiencing high demand.",
          );
          return;
        }

        if (tickCount % 2 === 0) updateCurrentStep();
      } catch (error) {
        console.error("Polling sync error:", error);
      }
    }, 2000);
  };

  const startMakingNotes = async () => {
    if (loading) return;
    setApiErrorMessage("");
    let isValid = true;
    const newErrors = { problemLink: "", userCode: "" };

    if (!formData.problemLink.trim()) {
      newErrors.problemLink = "Problem link is required.";
      isValid = false;
    }
    if (!formData.userCode.trim()) {
      newErrors.userCode = "Solution source code block is required.";
      isValid = false;
    }
    setErrors(newErrors);
    if (!isValid) return;

    setLoading(true);
    setHasStarted(true);
    resetSteps();

    setSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx === 0 ? "running" : "waiting",
      })),
    );

    try {
      const initResponse = await generateAiNote({
        problemLink: formData.problemLink.trim(),
        userCode: formData.userCode.trim(),
        language: formData.language,
      });

      if (!initResponse?.success || !initResponse?.id)
        throw new Error("Queue allocation rejected.");
      startPolling(initResponse.id);
    } catch (error) {
      stopPolling();
      failActiveSteps();
      setLoading(false);
      setApiErrorMessage(
        "The AI generation queue is currently packed. Please try again shortly.",
      );
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-[var(--bg-base)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Main Content Form */}
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] sm:p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
              Generate note
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Paste the problem link, your accepted code, and language.
              AlgoNotes will create a concise revision note.
            </p>
          </div>

          {/* HTML Error Alert Container Box */}
          {apiErrorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-[var(--danger-soft)] bg-[var(--danger-soft)]/10 p-4 text-sm text-[var(--danger)] animate-fade-in">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold tracking-tight">
                  Generation Interrupted
                </p>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {apiErrorMessage}
                </p>
                <button
                  type="button"
                  onClick={startMakingNotes}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--danger)] hover:underline pt-1"
                >
                  <RefreshCw size={12} /> Try Again
                </button>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <Input
              label="Problem Link"
              type="url"
              name="problemLink"
              value={formData.problemLink}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  problemLink: e.target.value,
                }));
                if (errors.problemLink)
                  setErrors((p) => ({ ...p, problemLink: "" }));
              }}
              disabled={loading}
              error={errors.problemLink}
              placeholder="e.g. https://leetcode.com/problems/two-sum/"
            />

            <Select
              label="Language"
              name="language"
              value={formData.language}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, language: e.target.value }))
              }
              disabled={loading}
              options={LANGUAGE_OPTIONS}
            />

            <div className="w-full">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-main)]">
                <Code2 size={14} /> Your Solution Code
              </label>
              <textarea
                name="userCode"
                value={formData.userCode}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    userCode: e.target.value,
                  }));
                  if (errors.userCode)
                    setErrors((p) => ({ ...p, userCode: "" }));
                }}
                disabled={loading}
                rows={12}
                placeholder="Paste your accepted solution code here..."
                className={`w-full resize-y rounded-xl border bg-white px-4 py-3 font-mono text-xs leading-6 text-[var(--text-main)] transition-all outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] ${
                  errors.userCode
                    ? "border-[var(--danger)] focus:ring-[var(--danger)]/20 focus:border-[var(--danger)]"
                    : "border-[var(--border-default)]"
                }`}
              />
              {errors.userCode && (
                <p className="mt-1 text-sm text-[var(--danger)] font-medium">
                  {errors.userCode}
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              loading={loading}
              onClick={startMakingNotes}
              className="w-full uppercase tracking-wider text-xs font-bold shadow-md"
            >
              <Sparkles size={15} />
              Generate Note
            </Button>
          </div>
        </div>

        {/* Dynamic Stepper Bar Layer */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Steps
            steps={steps.map((s) => ({
              ...s,
              status: hasStarted ? s.status : "",
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateNote;
