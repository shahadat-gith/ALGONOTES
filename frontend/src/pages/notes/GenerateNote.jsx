import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateAiNote, checkNoteStatus } from "../../api/geminiApi";
import Steps from "./Steps";

import {
  Sparkles,
  Link as LinkIcon,
  Code2,
  Languages,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const LANGUAGE_OPTIONS = ["C++", "Java", "Python", "JavaScript", "TypeScript", "C"];

const GenerateNote = () => {
  const navigate = useNavigate();
  const pollTimer = useRef(null);

  const [formData, setFormData] = useState({
    problemLink: "",
    userCode: "",
    language: "C++",
  });

  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [steps, setSteps] = useState([
    { id: 1, text: "Reading problem link and solution code", status: "waiting" },
    { id: 2, text: "Extracting problem details and examples", status: "waiting" },
    { id: 3, text: "Understanding your algorithmic approach", status: "waiting" },
    { id: 4, text: "Creating concise revision notes", status: "waiting" },
    { id: 5, text: "Preparing dry run, edge cases, and complexity", status: "waiting" },
    { id: 6, text: "Saving your generated study note", status: "waiting" },
  ]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  const resetSteps = () => {
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "waiting",
      }))
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.problemLink.trim()) {
      toast.error("Problem link is required.");
      return false;
    }

    if (!formData.userCode.trim()) {
      toast.error("Solution code is required.");
      return false;
    }

    if (!formData.language.trim()) {
      toast.error("Language is required.");
      return false;
    }

    return true;
  };

  const handleGenerationSuccess = (noteId) => {
    clearInterval(pollTimer.current);

    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "completed",
      }))
    );

    setTimeout(() => {
      navigate(`/notes/${noteId}/edit`, {
        replace: true,
      });
    }, 700);
  };

  const handleGenerationFailure = () => {
    clearInterval(pollTimer.current);

    setLoading(false);
    setHasStarted(false);
    resetSteps();

    toast.error("AI note generation failed. Please try again.");
  };

  const startMakingNotes = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setHasStarted(true);

    setSteps((prev) =>
      prev.map((step) =>
        step.id === 1
          ? {
              ...step,
              status: "running",
            }
          : {
              ...step,
              status: "waiting",
            }
      )
    );

    try {
      const initResponse = await generateAiNote({
        problemLink: formData.problemLink.trim(),
        userCode: formData.userCode.trim(),
        language: formData.language,
      });

      if (!initResponse.success || !initResponse.noteId) {
        throw new Error("Failed to start note generation.");
      }

      const noteId = initResponse.noteId;
      let tickCount = 0;

      pollTimer.current = setInterval(async () => {
        tickCount++;

        try {
          const check = await checkNoteStatus(noteId);

          if (check.status === "draft" || check.status === "final") {
            handleGenerationSuccess(noteId);
            return;
          }

          if (check.status === "failed") {
            handleGenerationFailure();
            return;
          }

          if (tickCount % 2 === 0) {
            setSteps((prevSteps) => {
              const activeIdx = prevSteps.findIndex(
                (step) => step.status === "running"
              );

              if (activeIdx === -1 || activeIdx >= prevSteps.length - 1) {
                return prevSteps;
              }

              const updated = [...prevSteps];
              updated[activeIdx] = {
                ...updated[activeIdx],
                status: "completed",
              };

              updated[activeIdx + 1] = {
                ...updated[activeIdx + 1],
                status: "running",
              };

              return updated;
            });
          }
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
        }
      }, 2200);
    } catch (err) {
      console.error(err);
      handleGenerationFailure();
    }
  };

  const processedSteps = steps.map((step) => ({
    ...step,
    status: hasStarted ? step.status : "",
  }));

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-[var(--bg-base)] px-4 py-8 sm:px-6 lg:px-8">

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
              Generate AI Study Note
            </h1>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Paste the problem link, your accepted code, and language. AlgoNotes
              will create a concise revision note.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                <LinkIcon size={14} />
                Problem Link
              </label>

              <input
                type="url"
                name="problemLink"
                value={formData.problemLink}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://leetcode.com/problems/two-sum/"
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-main)] transition focus:border-[var(--primary)] disabled:bg-[var(--bg-soft)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                <Languages size={14} />
                Language
              </label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-medium text-[var(--text-main)] transition focus:border-[var(--primary)] disabled:bg-[var(--bg-soft)]"
              >
                {LANGUAGE_OPTIONS.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                <Code2 size={14} />
                Your Solution Code
              </label>

              <textarea
                name="userCode"
                value={formData.userCode}
                onChange={handleChange}
                disabled={loading}
                rows={14}
                placeholder="Paste your accepted solution code here..."
                className="w-full resize-y rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-mono text-xs leading-6 text-[var(--text-main)] transition focus:border-[var(--primary)] disabled:bg-[var(--bg-soft)]"
              />
            </div>

            <button
              onClick={startMakingNotes}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition hover:bg-[var(--primary-hover)] disabled:opacity-70"
            >
              <Sparkles size={15} />
              {loading ? "Generating Note..." : "Generate Note"}
            </button>
          </div>
        </div>

        <div>
          <Steps steps={processedSteps} />
        </div>
      </div>
    </div>
  );
};

export default GenerateNote;