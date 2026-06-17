import React from "react";
import { useNoteGeneration } from "../../hooks/useNoteGeneration";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Steps from "../../components/common/Steps";
import Alert from "../../components/common/Alert";

import { Sparkles, Code2, StickyNote } from "lucide-react";

const LANGUAGE_OPTIONS = [
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "C",
];

const NoteGenerator = () => {
  
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    hasStarted,
    steps,
    apiErrorMessage,
    startMakingNotes,
  } = useNoteGeneration();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:h-[calc(100vh-6rem)] md:max-h-[calc(100vh-6rem)] md:overflow-hidden select-none animate-fade-in relative z-10">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start lg:h-full lg:max-h-full">
        {/* Left Input Form Panel - Independent Scrollable Track */}
        <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-6 shadow-card lg:h-full lg:max-h-full lg:overflow-y-auto custom-scrollbar pr-3">
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
                <StickyNote size={13} className="text-text-light stroke-[2]" />
                <span>Custom Instructions / Notes (Optional)</span>
              </label>
              <textarea
                name="userNotes"
                value={formData.userNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    userNotes: e.target.value,
                  }))
                }
                disabled={loading}
                rows={4}
                placeholder="Add your observations..."
                className="w-full resize-y rounded-sm border bg-bg-base px-4 py-3 font-mono text-[14px] md:text-[16px] leading-7 text-text-main transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar"
              />
            </div>

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
                rows={10}
                placeholder="Paste your accepted solution code here..."
                className={`w-full resize-y rounded-sm border bg-bg-base px-4 py-3 font-mono text-[14px] md:text-[16px] leading-7 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar ${
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

        {/* Right Layout Sidebar Panel - Locked in Viewport Frame */}
        <div className="space-y-4 lg:h-full lg:max-h-full lg:overflow-y-auto lg:sticky lg:top-0 custom-scrollbar pr-1">
          <Steps
            steps={steps.map((s) => ({
              ...s,
              status: hasStarted ? s.status : "",
            }))}
          />

          {/* Corrected: Re-enabled clean error handling interface display logic safely here */}
          {apiErrorMessage && (
            <Alert
              title="Generation Interrupted"
              message={apiErrorMessage}
              variant="danger"
              actionLabel="Try Again"
              onAction={startMakingNotes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteGenerator;
