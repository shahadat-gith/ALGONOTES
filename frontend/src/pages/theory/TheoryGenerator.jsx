import React from "react";
import { useTheoryGeneration } from "../../hooks/useTheoryGeneration";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Steps from "../../components/common/Steps";
import Alert from "../../components/common/Alert";

import { Sparkles, Bookmark, FileText } from "lucide-react";

const TheoryGenerator = () => {
  const {
    formData = { topic: "", instructions: "" },
    setFormData,
    errors = {},
    setErrors,
    loading,
    hasStarted,
    steps,
    apiErrorMessage,
    startTheoryGeneration,
  } = useTheoryGeneration();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:h-[calc(100vh-6rem)] md:max-h-[calc(100vh-6rem)] md:overflow-hidden select-none animate-fade-in relative z-10">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start lg:h-full lg:max-h-full">
        
        {/* Left Input Form Panel - Independent Scroll Track */}
        <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-6 shadow-card lg:h-full lg:max-h-full lg:overflow-y-auto custom-scrollbar pr-3">
          <div className="space-y-5">
            
            {/* Input 1: Topic Target Name */}
            <Input
              label="Topic / Concept Title"
              type="text"
              name="topic"
              value={formData.topic || ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, topic: e.target.value }));
                if (errors.topic) setErrors((p) => ({ ...p, topic: "" }));
              }}
              disabled={loading}
              error={errors.topic}
              placeholder="e.g., Matrix Chain Multiplication or LL(1) Parser Tables"
              className="text-sm h-10 bg-bg-base border-border-default rounded-md pl-4"
            />

            {/* Input 2: Dynamic Custom Instructions Block */}
            <div className="w-full flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-light flex items-center gap-2 font-mono">
                <FileText size={13} className="text-text-light stroke-[2]" />
                <span>Descriptions & Specific Instructions (Optional)</span>
              </label>
              <textarea
                name="instructions"
                value={formData.instructions || ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, instructions: e.target.value }));
                  if (errors.instructions) setErrors((p) => ({ ...p, instructions: "" }));
                }}
                disabled={loading}
                rows={10}
                placeholder={`Give high-quality prompt rules to guide note generation. For example:\n\n- Explain the core operational logic and structural flow step-by-step.\n- Provide an execution trace using a sample string like 'id + id * id'.\n- Add full abstract mathematical formula validations and proof models.\n- List common operational edge cases, implementation trade-offs, and design mistakes to avoid.`}
                className={`w-full resize-y rounded-sm border bg-bg-base px-4 py-3 font-mono text-[14px] md:text-[16px] leading-7 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar ${
                  errors.instructions ? "border-danger focus:border-danger" : "border-border-default"
                }`}
              />
              {errors.instructions && (
                <p className="text-xs font-medium text-danger tracking-wide">
                  {errors.instructions}
                </p>
              )}
            </div>

            {/* Core Action Trigger Component Button */}
            <Button
              variant="primary"
              size="md"
              loading={loading}
              onClick={startTheoryGeneration}
              className="w-full font-semibold text-xs tracking-widest uppercase h-11 shadow-xs cursor-pointer mt-2"
            >
              <Sparkles size={14} className="stroke-[2]" />
              <span>Generate Study Guide</span>
            </Button>
          </div>
        </div>

        {/* Right Sidebar Layout Status Tracker Panel */}
        <div className="space-y-4 lg:h-full lg:max-h-full lg:overflow-y-auto lg:sticky lg:top-0 custom-scrollbar pr-1">
          <Steps
            steps={steps.map((s) => ({
              ...s,
              status: hasStarted ? s.status : "",
            }))}
          />

          {apiErrorMessage && (
            <Alert
              title="Generation Interrupted"
              message={apiErrorMessage}
              variant="danger"
              actionLabel="Try Again"
              onAction={startTheoryGeneration}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default TheoryGenerator;