import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBackoffPolling } from "../../hooks/useBackoffPolling";
import { generateTheoryNote, checkTheoryStatus, deleteTheoryNote } from "../../api/theoryApi"; 
import { optimizeTheoryInstructions, checkPromptOptimizationStatus } from "../../api/promptApi";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ErrorModal from "../../components/modals/ErrorModal";
import NoteGeneratingModal from "../../components/modals/NoteGeneratingModal";
import toast from "react-hot-toast";

import {
  BookOpenText,
  CircleHelp,
  Code2,
  FileText,
  Lightbulb,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import Glow from "../../components/common/Glow";

const STORAGE_KEY = "theory_note_generation";
const DEFAULT_FORM_DATA = { topic: "", instructions: "", language: "" };

const TheoryGenerator = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  // --- Unified Self-Contained States ---
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_FORM_DATA, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse cached Theory session data:", e);
      }
    }
    return DEFAULT_FORM_DATA;
  });

  const [loading, setLoading] = useState(false);
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up polling loops on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // --- Handlers ---
  const handleTopicChange = (e) => {
    const uppercaseValue = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, topic: uppercaseValue }));
  };

  const handleLanguageChange = (e) => {
    setFormData((prev) => ({ ...prev, language: e.target.value }));
  };

  // --- Rollback Handler on Generation Failure ---
  const handleGenerationFailure = useCallback(async (theoryId, message) => {
    setLoading(false);
    setError(message);
    try {
      await deleteTheoryNote(theoryId);
    } catch (cleanError) {
      console.error("Rollback failed:", cleanError);
    }
  }, []);

  // --- Action: Optimize / Polish Prompt ---
  const handleOptimizeUserPrompt = async () => {
    if (!formData.topic || formData.topic.trim() === "") {
      toast.error("Please enter a topic name first to give the AI some context.");
      return;
    }

    setError("");
    setIsPromptLoading(true);

    try {
      const res = await optimizeTheoryInstructions({
        topic: formData.topic,
        instructions: formData.instructions || "",
        language: formData.language || null,
      });

      if (res?.success && res?.jobId) {
        startPolling({
          resourceId: res.jobId,
          checkStatusFn: checkPromptOptimizationStatus,
          onSuccess: (data) => {
            setIsPromptLoading(false);
            if (data?.optimizedInstructions) {
              setFormData((prev) => ({
                ...prev,
                instructions: data.optimizedInstructions,
              }));
              toast.success("Instructions polished!");
            } else {
              setError("Polished data was empty. Please try re-typing your points.");
            }
          },
          onFailure: (err) => {
            setIsPromptLoading(false);
            setError(err || "Could not polish instructions. Please try again.");
          },
        });
      } else {
        throw new Error("Queue rejected optimization.");
      }
    } catch (err) {
      setIsPromptLoading(false);
      setError("Could not connect to the prompt optimization pipeline.");
    }
  };

  // --- Action: Start Theory Generation ---
  const handleStartTheoryGeneration = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    try {
      const initResponse = await generateTheoryNote({
        topic: formData.topic.trim(),
        instructions: formData.instructions.trim() || undefined,
        language: formData.language || null,
      });

      const targetId = initResponse?.id || initResponse?.theoryId;

      if (!initResponse?.success || !targetId) {
        throw new Error("Queue rejected.");
      }

      startPolling({
        resourceId: targetId,
        checkStatusFn: checkTheoryStatus,
        onSuccess: () => {
          toast.success("Theory generated!");
          sessionStorage.removeItem(STORAGE_KEY);
          setTimeout(() => {
            navigate(`/theory/${targetId}/edit`, { replace: true });
          }, 800);
        },
        onFailure: (errMsg) => handleGenerationFailure(targetId, errMsg),
      });
    } catch (err) {
      stopPolling();
      setLoading(false);
      setError(err.message || "AI agent is currently unavailable! Please try after sometime.");
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in flex flex-col gap-6 h-auto">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="w-full border-b border-border-default rounded-2xl p-4 bg-bg-base/95 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-text-main">
              Theory Notes Builder
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-text-light">
              Build clear topic summaries with your own requirements, preferred
              language examples, and AI-assisted prompt polishing.
            </p>
            <Link
              to="/how-it-works/theory"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary hover:text-primary-hover transition-colors"
            >
              <CircleHelp size={13} className="stroke-[2]" />
              <span>How it works?</span>
            </Link>
          </div>

         
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-6 shadow-card">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <BookOpenText size={12} className="stroke-[2.2]" />
            <span>Concept-first workflow</span>
          </div>
          <div className="mt-4 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-text-main">
              Start with a topic, then shape the result with your own instructions.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-text-light">
              Use this page to create clean theory notes, revision blueprints,
              or topic explainers that follow your preferred structure.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Suggested use
            </p>
            <p className="mt-2 text-sm leading-6 text-text-light">
              Add the concept name, choose a language if code examples matter,
              and describe the exact depth or sections you want covered.
            </p>
          </div>
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Prompt polish
            </p>
            <p className="mt-2 text-sm leading-6 text-text-light">
              If your requirements are rough, use the AI polish action to
              rewrite them into a clearer instruction set before generating.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full bg-bg-surface border border-border-default rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs mb-6">
        <div className="flex justify-between gap-1 border-b border-border-default pb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-text-main flex items-center gap-2">
            <Lightbulb size={16} className="text-primary stroke-[2]" />
            <span>Topic setup</span>
          </h2>
          <p className="text-sm leading-6 text-text-light">
            Define the concept and any optional rules that should shape the
            final theory notes.
          </p>
          </div>


           <Button
            variant="primary"
            size="sm"
            loading={loading}
            disabled={isPromptLoading || !formData.topic}
            onClick={handleStartTheoryGeneration}
            className="h-11 shrink-0 px-5 text-sm font-semibold shadow-xs cursor-pointer"
          >
            <Sparkles size={15} className="stroke-[2.2]" />
            <span>Generate</span>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-border-default bg-bg-base/35 p-4">
            <Input
              label="Topic or Concept"
              type="text"
              name="topic"
              required
              value={formData.topic || ""}
              onChange={handleTopicChange}
              disabled={loading || isPromptLoading}
              placeholder="Example: Binary Search Trees"
              className="text-sm h-11 bg-bg-base border-border-default rounded-md pl-3.5 font-semibold tracking-wide uppercase placeholder:normal-case w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full bg-bg-base/35 p-4 rounded-2xl border border-border-default/60">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-[0.18em] flex items-center gap-2">
              <Code2 size={14} className="text-text-light stroke-[2]" />
              <span>Code example language</span>
            </label>
            <select
              name="language"
              value={formData.language || ""}
              onChange={handleLanguageChange}
              disabled={loading || isPromptLoading}
              className="w-full h-11 px-3.5 border border-border-default rounded-xl bg-bg-surface text-sm font-medium text-text-main outline-hidden focus:border-primary/40 transition-all cursor-pointer"
            >
              <option value="">Choose a language</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="C">C</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="SQL">SQL</option>
              <option value="Go">Go</option>
            </select>
            <p className="text-xs leading-5 text-text-muted">
              Optional. Use this when the output should include code samples or
              syntax-specific explanations.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative rounded-2xl border border-border-default bg-bg-base/35 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted flex items-center gap-2 h-5">
                <FileText size={13} className="text-text-light stroke-[2.5]" />
                <span>Requirements or rough notes</span>
              </label>
              <p className="mt-1 text-sm leading-6 text-text-light">
                Share bullet points, sections to include, or the level of detail
                you expect.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={
                loading ||
                isPromptLoading ||
                !formData.topic?.trim() ||
                !formData.instructions?.trim()
              }
              onClick={handleOptimizeUserPrompt}
              className="mt-3 sm:mt-0 text-xs font-semibold h-9 px-3.5 border-dashed border-border-strong bg-bg-soft/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 rounded-xl transition-all duration-200"
            >
              <Wand2 size={13} className="stroke-[2.3]" />
              <span>Polish with AI</span>
            </Button>
          </div>

          <div className="relative w-full rounded-sm overflow-hidden">
            {isPromptLoading && (
              <div className="absolute inset-0 bg-bg-surface/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2 animate-fade-in">
                <Loader2
                  size={20}
                  className="animate-spin text-primary stroke-[2.5]"
                />
                <span className="text-[11px] font-mono font-bold tracking-wider text-text-muted uppercase">
                  Polishing your points...
                </span>
              </div>
            )}

            <textarea
              name="instructions"
              value={formData.instructions || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }));
              }}
              disabled={loading || isPromptLoading}
              placeholder={`Add raw notes, a rough outline, or the rules you want followed.\n\nExample:\n- compare singly and doubly linked lists\n- include insertion and deletion steps\n- end with common interview mistakes`}
              style={{ fieldSizing: "content" }}
              className="w-full min-h-[220px] resize-none block rounded-2xl border border-border-default bg-bg-base px-4 py-4 font-mono text-[13px] md:text-[14px] leading-6 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80"
            />
          </div>
        </div>
      </div>

      <NoteGeneratingModal
        isOpen={loading}
        title="Creating your theory notes"
        footerNote="Theory requests can take a little longer when the topic is broad or highly detailed."
      />

      <ErrorModal
        isOpen={!!error}
        title="Error generating note"
        message={error}
        onClose={() => setError("")}
        actionLabel={loading ? "Try Again" : null}
        onAction={loading ? handleStartTheoryGeneration : null}
      />
    </div>
  );
};

export default TheoryGenerator;