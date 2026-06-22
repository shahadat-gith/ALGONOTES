import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateAiNote, checkNoteStatus, deleteNote } from "../../api/noteApi";
import { useBackoffPolling } from "../../hooks/useBackoffPolling";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import ErrorModal from "../../components/modals/ErrorModal";
import NoteGeneratingModal from "../../components/modals/NoteGeneratingModal";
import toast from "react-hot-toast";

import { LANGUAGE_OPTIONS } from "../../constants/languages";
import {
  ArrowRight,
  CircleHelp,
  Code2,
  Link2,
  Sparkles,
  StickyNote,
} from "lucide-react";
import Glow from "../../components/common/Glow";

const STORAGE_KEY = "dsa_note_generation";
const DEFAULT_FORM_DATA = {
  problemLink: "",
  userCode: "",
  language: "C++",
  userNotes: "",
};

const NoteGenerator = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  // --- Unified Self-Contained States ---
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_FORM_DATA, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse cached DSA session data:", e);
      }
    }
    return DEFAULT_FORM_DATA;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up polling loops on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerationFailure = useCallback(async (noteId, message) => {
    setLoading(false);
    setError(message);
    try {
      await deleteNote(noteId);
    } catch (cleanError) {
      console.error("Clean error during deletion rollback:", cleanError);
    }
  }, []);

  // --- Core Note Generation Action ---
  const handleStartMakingNotes = async () => {
    if (loading) return;

    // Client-Side Input Validations via Toast Alerts
    if (!formData.problemLink || !formData.problemLink.trim()) {
      toast.error("Please provide a valid problem reference link first.");
      return;
    }
    if (!formData.userCode || !formData.userCode.trim()) {
      toast.error(
        "Please paste your solution code block to let the AI build notes.",
      );
      return;
    }

    setError("");
    setLoading(true);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    try {
      const initResponse = await generateAiNote({
        problemLink: formData.problemLink.trim(),
        userCode: formData.userCode.trim(),
        language: formData.language,
        userNotes: formData.userNotes.trim(),
      });

      if (!initResponse?.success || !initResponse?.id) {
        throw new Error("Queue rejected.");
      }

      startPolling({
        resourceId: initResponse.id,
        checkStatusFn: checkNoteStatus,
        onSuccess: () => {
          sessionStorage.removeItem(STORAGE_KEY);
          navigate(`/notes/${initResponse.id}/edit`, { replace: true });
        },
        onFailure: (errMsg) => handleGenerationFailure(initResponse.id, errMsg),
      });
    } catch (err) {
      console.log(err)
      stopPolling();
      setLoading(false);
      setError(err.message || "AI agent is currently unavailable! Please try after sometime.",
      );
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar select-none animate-fade-in relative overflow-hidden flex flex-col gap-6">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="sticky top-0 z-30 w-full border-b border-border-default pb-4 bg-bg-base/95 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-text-main">
              Study Notes Builder
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-text-light">
              Turn a solved problem into polished revision notes with clear
              explanations, code walkthroughs, and interview-ready insights.
            </p>
            <Link
              to="/how-it-works/notes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary hover:text-primary-hover transition-colors"
            >
              <CircleHelp size={13} className="stroke-[2]" />
              <span>How it works?</span>
            </Link>
          </div>

          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={handleStartMakingNotes}
            className="h-11 shrink-0 px-5 text-sm font-semibold shadow-xs cursor-pointer"
          >
            <Sparkles size={15} className="stroke-[2.1]" />
            <span>Generate</span>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-6 shadow-card">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles size={12} className="stroke-[2.2]" />
            <span>Smart note generation</span>
          </div>
          <div className="mt-4 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-text-main">
              Share the problem, your language, and your solution.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-text-light">
              The stronger the context you provide, the better the final note
              reads. Add your accepted code and any personal observations you
              want included.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              What to include
            </p>
            <p className="mt-2 text-sm leading-6 text-text-light">
              Add the original problem link, choose the language used in your
              solution, and paste the final code version you want explained.
            </p>
          </div>
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Best results
            </p>
            <p className="mt-2 text-sm leading-6 text-text-light">
              Use custom notes to mention tricky cases, alternative ideas, or
              why you chose this approach.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card">
          <div className="space-y-1 border-b border-border-default pb-4">
            <h2 className="text-base font-semibold tracking-tight text-text-main">
              Problem setup
            </h2>
            <p className="text-sm leading-6 text-text-light">
              Provide the reference details so the final note can stay focused
              and accurate.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Link2 size={13} className="stroke-[2.1]" />
              <span>Reference</span>
            </div>

            <Input
              label="Problem Link"
              type="url"
              name="problemLink"
              required
              value={formData.problemLink}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Paste the coding problem URL"
              className="text-sm h-11 bg-bg-base border-border-default rounded-md pl-4 w-full"
            />
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              <ArrowRight size={13} className="stroke-[2.1]" />
              <span>Output preferences</span>
            </div>

            <Select
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              disabled={loading}
              options={LANGUAGE_OPTIONS}
              className="text-sm h-11 bg-bg-base border-border-default rounded-md px-3 w-full"
            />
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
            <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              <StickyNote size={13} className="stroke-[2]" />
              <span>Extra context</span>
            </label>
            <textarea
              name="userNotes"
              value={formData.userNotes}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Add observations, edge cases, or the intuition you want highlighted."
              style={{ fieldSizing: "content" }}
              className="w-full min-h-[140px] resize-none rounded-xl border bg-bg-base px-4 py-3 font-mono text-[14px] leading-7 text-text-main transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80"
            />
          </div>
        </section>

        <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card mb-6 xl:mb-0">
          <div className="space-y-1 border-b border-border-default pb-4">
            <h2 className="text-base font-semibold tracking-tight text-text-main">
              Solution to explain
            </h2>
            <p className="text-sm leading-6 text-text-light">
              Paste the final code you want transformed into clear study
              material.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted flex items-center gap-2">
              <Code2 size={14} className="text-text-light stroke-[2]" />
              <span>Your Solution Code</span>
            </label>
            <textarea
              name="userCode"
              value={formData.userCode}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Paste your working solution here so the note can break it down step by step."
              style={{ fieldSizing: "content" }}
              className="w-full min-h-[360px] resize-none block rounded-2xl border border-border-default bg-bg-base px-4 py-4 font-mono text-[14px] md:text-[15px] leading-7 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80"
            />
          </div>
        </section>
      </div>

      <NoteGeneratingModal
        isOpen={loading}
        title="Creating your study notes"
        subtitle="We are reviewing your solution, organizing the explanation, and preparing a clean note you can revise later."
        footerNote="Most note requests finish in about one to two minutes."
      />

      <ErrorModal
        isOpen={!!error}
        title="Note Generation Failed"
        message={error}
        onClose={() => setError("")}
        actionLabel={loading ? "Try Again" : null}
        onAction={loading ? handleStartMakingNotes : null}
      />
    </div>
  );
};

export default NoteGenerator;
