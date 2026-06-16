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
            () => navigate(`/notes/${noteId}/edit`, { replace: true }),
            800,
          );
          return;
        }

        if (check.status === "failed") {
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
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen select-none animate-fade-in relative z-10">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start">
        
        {/* Main Content Form Card */}
        <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-6 shadow-card">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-wide text-text-main">
              Generate Note
            </h1>
            <p className="text-xs text-text-muted tracking-wide leading-relaxed">
              Paste the problem link, your accepted code, and target syntax language. AlgoNotes will evaluate the inputs and compile a structured custom revision canvas.
            </p>
          </div>

          {/* Error Alert Container Box */}
          {apiErrorMessage && (
            <div className="flex items-start gap-3.5 rounded-sm border border-danger/10 bg-danger-soft/40 p-4 text-xs text-danger animate-fade-in shadow-xs">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 stroke-[2]" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="font-semibold tracking-wide">
                  Generation Interrupted
                </p>
                <p className="text-text-muted leading-relaxed font-normal">
                  {apiErrorMessage}
                </p>
                <button
                  type="button"
                  onClick={startMakingNotes}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-danger hover:text-primary transition-colors pt-1 cursor-pointer font-mono"
                >
                  <RefreshCw size={11} className="stroke-[2]" /> 
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Fields Stack */}
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
              className="text-sm h-10 bg-bg-base border-border-default rounded-md pl-4"
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
              className="text-sm h-10 bg-bg-base border-border-default rounded-md px-3"
            />

            <div className="w-full flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-light flex items-center gap-2 font-mono">
                <Code2 size={13} className="text-text-light stroke-[2]" /> 
                <span>Your Solution Code</span>
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
                className={`w-full resize-y rounded-sm border bg-bg-base px-4 py-3 font-mono text-xs leading-6 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar ${
                  errors.userCode
                    ? "border-danger focus:border-danger"
                    : "border-border-default"
                }`}
              />
              
              {errors.userCode && (
                <p className="text-xs font-medium text-danger tracking-wide">
                  {errors.userCode}
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              loading={loading}
              onClick={startMakingNotes}
              className="w-full font-semibold text-xs tracking-widest uppercase h-11 shadow-xs cursor-pointer mt-2"
            >
              <Sparkles size={14} className="stroke-[2]" />
              <span>Generate Note</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Stepper Sidebar Layer */}
        <div className="lg:sticky lg:top-[5.5rem] h-fit lg:max-h-[calc(100vh-8rem)] overflow-y-auto pr-0 custom-scrollbar">
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