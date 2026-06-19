import React from "react";
import { Link } from "react-router-dom";
import { useNoteGeneration } from "../../hooks/useNoteGeneration";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Alert from "../../components/common/Alert";
import NoteGeneratingModal from "../../components/common/NoteGeneratingModal";
import { LANGUAGE_OPTIONS } from "../../constants/languages";
import { ArrowRight, CircleHelp, Code2, Link2, Sparkles, StickyNote } from "lucide-react";

const NoteGenerator = () => {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    apiErrorMessage,
    startMakingNotes,
  } = useNoteGeneration();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar select-none animate-fade-in relative z-10 flex flex-col gap-6">
      
      <div className="sticky top-0 z-30 w-full border-b border-border-default pb-4 bg-bg-base/95 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-text-main">Study Notes Builder</h1>
            <p className="max-w-2xl text-sm leading-6 text-text-light">
              Turn a solved problem into polished revision notes with clear explanations, code walkthroughs, and interview-ready insights.
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
            onClick={startMakingNotes}
            className="h-11 shrink-0 px-5 text-sm font-semibold shadow-xs cursor-pointer"
          >
            <Sparkles size={15} className="stroke-[2.1]" />
            <span>Create Notes</span>
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
              The stronger the context you provide, the better the final note reads. Add your accepted code and any personal observations you want included.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">What to include</p>
            <p className="mt-2 text-sm leading-6 text-text-light">
              Add the original problem link, choose the language used in your solution, and paste the final code version you want explained.
            </p>
          </div>
          <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Best results</p>
            <p className="mt-2 text-sm leading-6 text-text-light">
              Use custom notes to mention tricky cases, alternative ideas, or why you chose this approach.
            </p>
          </div>
        </div>
      </section>

      {/* Error Alert Display Layer */}
      {apiErrorMessage && (
        <Alert
          title="Generation Interrupted"
          message={apiErrorMessage}
          variant="danger"
          actionLabel="Try Again"
          onAction={startMakingNotes}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card">
          <div className="space-y-1 border-b border-border-default pb-4">
            <h2 className="text-base font-semibold tracking-tight text-text-main">Problem setup</h2>
            <p className="text-sm leading-6 text-text-light">
              Provide the reference details so the final note can stay focused and accurate.
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
              value={formData.problemLink}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, problemLink: e.target.value }));
                if (errors.problemLink) setErrors((p) => ({ ...p, problemLink: "" }));
              }}
              disabled={loading}
              error={errors.problemLink}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, userNotes: e.target.value }))}
              disabled={loading}
              placeholder="Add observations, edge cases, or the intuition you want highlighted."
              style={{ fieldSizing: "content" }}
              className="w-full min-h-[140px] resize-none rounded-xl border bg-bg-base px-4 py-3 font-mono text-[14px] leading-7 text-text-main transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80"
            />
          </div>
        </section>

        <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card mb-6 xl:mb-0">
          <div className="space-y-1 border-b border-border-default pb-4">
            <h2 className="text-base font-semibold tracking-tight text-text-main">Solution to explain</h2>
            <p className="text-sm leading-6 text-text-light">
              Paste the final code you want transformed into clear study material.
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
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, userCode: e.target.value }));
                if (errors.userCode) setErrors((p) => ({ ...p, userCode: "" }));
              }}
              disabled={loading}
              placeholder="Paste your working solution here so the note can break it down step by step."
              style={{ fieldSizing: "content" }}
              className={`w-full min-h-[360px] resize-none rounded-2xl border bg-bg-base px-4 py-4 font-mono text-[14px] md:text-[15px] leading-7 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 ${
                errors.userCode ? "border-danger focus:border-danger" : "border-border-default"
              }`}
            />
            {errors.userCode && (
              <p className="text-xs font-medium text-danger tracking-wide">{errors.userCode}</p>
            )}
          </div>
        </section>
      </div>

      {/* Shared Global Processing Modal overlay */}
      <NoteGeneratingModal
        isOpen={loading}
        title="Creating your study notes"
        subtitle="We are reviewing your solution, organizing the explanation, and preparing a clean note you can revise later."
        footerNote="Most note requests finish in about one to two minutes."
      />
      
    </div>
  );
};

export default NoteGenerator;