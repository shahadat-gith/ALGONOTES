import React from "react";
import { useNoteGeneration } from "../../hooks/useNoteGeneration";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Alert from "../../components/common/Alert";
import NoteGeneratingModal from "../../components/common/NoteGeneratingModal";
import { LANGUAGE_OPTIONS } from "../../constants/languages";
import { Sparkles, Code2, StickyNote } from "lucide-react";

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
      
      {/* FIX: Sticky Header Navbar Action Row */}
      <div className="sticky top-0 z-30 w-full flex items-center justify-between border-b border-border-default pb-4 bg-bg-base/95 backdrop-blur-md">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold tracking-tight text-text-main font-mono uppercase">DSA Note Workspace</h1>
          <p className="text-xs text-text-light">Generate highly detailed deep-dives of your code solutions instantly.</p>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          loading={loading}
          onClick={startMakingNotes}
          className="font-semibold text-xs tracking-widest uppercase h-10 px-5 shadow-xs cursor-pointer border border-primary/20 hover:shadow-primary/10 transition-all duration-200 shrink-0"
        >
          <Sparkles size={13} className="stroke-[2]" />
          <span>Generate Note</span>
        </Button>
      </div>

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

      {/* Full Width Form Panel Wrapper */}
      <div className="w-full bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-5 shadow-card mb-6">
        
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
          placeholder="e.g. https://leetcode.com/problems/two-sum/"
          className="text-sm h-10 bg-bg-base border-border-default rounded-md pl-4 w-full"
        />

        <Select
          label="Language"
          name="language"
          value={formData.language}
          onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
          disabled={loading}
          options={LANGUAGE_OPTIONS}
          className="text-sm h-10 bg-bg-base border-border-default rounded-md px-3 w-full"
        />

        {/* Custom Instructions Textarea */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-light flex items-center gap-2 font-mono">
            <StickyNote size={13} className="text-text-light stroke-[2]" />
            <span>Custom Instructions / Notes (Optional)</span>
          </label>
          <textarea
            name="userNotes"
            value={formData.userNotes}
            onChange={(e) => setFormData((prev) => ({ ...prev, userNotes: e.target.value }))}
            disabled={loading}
            placeholder="Add your observations..."
            style={{ fieldSizing: "content" }}
            className="w-full min-h-[100px] resize-none rounded-sm border bg-bg-base px-4 py-3 font-mono text-[14px] md:text-[16px] leading-7 text-text-main transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80"
          />
        </div>

        {/* Solution Code Textarea */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-light flex items-center gap-2 font-mono">
            <Code2 size={13} className="text-text-light stroke-[2]" />
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
            placeholder="Paste your accepted solution code here..."
            style={{ fieldSizing: "content" }}
            className={`w-full min-h-[240px] resize-none rounded-sm border bg-bg-base px-4 py-3 font-mono text-[14px] md:text-[16px] leading-7 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 ${
              errors.userCode ? "border-danger focus:border-danger" : "border-border-default"
            }`}
          />
          {errors.userCode && (
            <p className="text-xs font-medium text-danger tracking-wide">{errors.userCode}</p>
          )}
        </div>

      </div>

      {/* Shared Global Processing Modal overlay */}
      <NoteGeneratingModal isOpen={loading} />
      
    </div>
  );
};

export default NoteGenerator;