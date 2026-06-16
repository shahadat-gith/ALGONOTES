import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateAiNote, checkNoteStatus } from "../../api/geminiApi";
import Steps from "./Steps";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

import { Sparkles, Code2 } from "lucide-react";
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
  { id: 5, text: "Preparing dry run, edge cases, and complexity", status: "waiting" },
  { id: 6, text: "finalising the note", status: "waiting" },
];

const GenerateNote = () => {
  const navigate = useNavigate();
  const pollTimer = useRef(null);

  const [formData, setFormData] = useState({
    problemLink: "",
    userCode: "",
    language: "C++",
  });

  const [errors, setErrors] = useState({
    problemLink: "",
    userCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [steps, setSteps] = useState(INITIAL_STEPS);

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const resetSteps = () => setSteps(INITIAL_STEPS);

  // FIXED: Keeps historical steps locked into 'completed' status
  const updateCurrentStep = () => {
    setSteps((prevSteps) => {
      const activeIndex = prevSteps.findIndex((step) => step.status === "running");

      if (activeIndex === -1) {
        return prevSteps.map((step, index) =>
          index === 0 ? { ...step, status: "running" } : step
        );
      }

      if (activeIndex >= prevSteps.length - 1) return prevSteps;

      return prevSteps.map((step, index) => {
        if (index < activeIndex) return { ...step, status: "completed" }; // Lock history
        if (index === activeIndex) return { ...step, status: "completed" };
        if (index === activeIndex + 1) return { ...step, status: "running" };
        return step;
      });
    });
  };

  const completeAllSteps = () => {
    setSteps((prevSteps) => prevSteps.map((step) => ({ ...step, status: "completed" })));
  };

  const failActiveSteps = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.status === "running" || step.status === "waiting"
          ? { ...step, status: "failed" }
          : step
      )
    );
  };

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
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
    return isValid;
  };

  const handleGenerationSuccess = (noteId) => {
    stopPolling();
    completeAllSteps();
    toast.success("Note generated successfully!");
    setTimeout(() => {
      navigate(`/notes/${noteId}`, { replace: true });
    }, 800);
  };

  const handleGenerationFailure = (message = "AI note generation failed.") => {
    stopPolling();
    failActiveSteps();
    setLoading(false);
    setHasStarted(false);
    toast.error(message);
  };

  const startPolling = (noteId) => {
    let tickCount = 0;
    stopPolling(); // Defensive check to clear existing timers

    pollTimer.current = setInterval(async () => {
      tickCount += 1;
      try {
        const check = await checkNoteStatus(noteId);
        if (!check?.success) return;

        if (check.status === "draft" || check.status === "final") {
          handleGenerationSuccess(noteId);
          return;
        }

        if (check.status === "failed") {
          handleGenerationFailure("AI compilation failed. Please verify your data.");
          return;
        }

        // Advance visual stepper steps every 4 seconds (2 ticks)
        if (tickCount % 2 === 0) {
          updateCurrentStep();
        }
      } catch (error) {
        console.error("Polling sync error:", error);
      }
    }, 2000);
  };

  const startMakingNotes = async () => {
    if (!validateForm() || loading) return;

    setLoading(true);
    setHasStarted(true);
    resetSteps();

    setSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx === 0 ? "running" : "waiting",
      }))
    );

    try {
      const initResponse = await generateAiNote({
        problemLink: formData.problemLink.trim(),
        userCode: formData.userCode.trim(),
        language: formData.language,
      });

      if (!initResponse?.success || !initResponse?.id) {
        throw new Error("Initialization failed.");
      }

      startPolling(initResponse.id);
    } catch (error) {
      console.error(error);
      handleGenerationFailure("Failed to queue generation task. Please try again.");
    }
  };

  const processedSteps = steps.map((step) => ({
    ...step,
    status: hasStarted ? step.status : "",
  }));

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-[var(--bg-base)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        
        {/* Main Content Form */}
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
              Generate AI Study Note
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Paste the problem link, your accepted code, and language. AlgoNotes will create a concise revision note.
            </p>
          </div>

          <div className="space-y-5">
            <Input
              label="Problem Link"
              type="url"
              name="problemLink"
              value={formData.problemLink}
              onChange={handleChange}
              disabled={loading}
              error={errors.problemLink}
              placeholder="e.g. https://leetcode.com/problems/two-sum/"
            />

            <Select
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
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
                onChange={handleChange}
                disabled={loading}
                rows={12}
                placeholder="Paste your accepted solution code here..."
                className={`w-full resize-y rounded-xl border bg-white px-4 py-3 font-mono text-xs leading-6 text-[var(--text-main)] transition-all outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] ${
                  errors.userCode ? "border-[var(--danger)] focus:ring-[var(--danger)]/20 focus:border-[var(--danger)]" : "border-[var(--border-default)]"
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
          <Steps steps={processedSteps} />
        </div>
      </div>
    </div>
  );
};

export default GenerateNote;