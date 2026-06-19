import React, { useState, useEffect } from "react";
import { useTheoryGeneration } from "../../hooks/useTheoryGeneration";
import { optimizeTheoryInstructions, checkPromptOptimizationStatus } from "../../api/promptApi";
import { useBackoffPolling } from "../../hooks/useBackoffPolling";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Alert from "../../components/common/Alert";
import NoteGeneratingModal from "../../components/common/NoteGeneratingModal";
import toast from "react-hot-toast";

import { Sparkles, FileText, Lightbulb, Code2, Wand2, Loader2 } from "lucide-react";

const TheoryGenerator = () => {
  const { startPolling, stopPolling } = useBackoffPolling();

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    apiErrorMessage, 
    startTheoryGeneration,
  } = useTheoryGeneration();

  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [promptErrorMessage, setPromptErrorMessage] = useState("");

  // Clean up polling loops on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // Client-Side Rate Limiter: Max 3 requests per minute
  const checkRateLimit = () => {
    const NOW = Date.now();
    const ONE_MINUTE = 60000;
    const storageKey = "theory_generator_req_timestamps";
    const MAX_ALLOWED_REQ_PER_MIN = 3;
    
    let timestamps = JSON.parse(localStorage.getItem(storageKey) || "[]");
    timestamps = timestamps.filter((time) => NOW - time < ONE_MINUTE);
    
    if (timestamps.length >= MAX_ALLOWED_REQ_PER_MIN) {
      const oldestRemaining = timestamps[0];
      const secondsLeft = Math.ceil((ONE_MINUTE - (NOW - oldestRemaining)) / 1000);
      return { allowed: false, secondsLeft };
    }
    
    timestamps.push(NOW);
    localStorage.setItem(storageKey, JSON.stringify(timestamps));
    return { allowed: true };
  };

  const handleTopicChange = (e) => {
    const uppercaseValue = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, topic: uppercaseValue }));
    if (errors.topic) setErrors((p) => ({ ...p, topic: "" }));
  };

  const handleLanguageChange = (e) => {
    setFormData((prev) => ({ ...prev, language: e.target.value }));
  };

  // Submits raw instructions to the backend for optimization
  const handleOptimizeUserPrompt = async () => {
    if (!formData.topic || formData.topic.trim() === "") {
      setErrors((p) => ({ ...p, topic: "Please enter a topic name first to give the AI some context." }));
      return;
    }

    setPromptErrorMessage("");
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setPromptErrorMessage(`Rate limit reached. Please wait ${rateLimit.secondsLeft}s before polishing again.`);
      return;
    }

    setIsPromptLoading(true);

    try {
      const res = await optimizeTheoryInstructions({
        topic: formData.topic,
        instructions: formData.instructions || "",
        language: formData.language || "C++",
      });

      if (res?.success && res?.jobId) {
        startPolling({
          resourceId: res.jobId,
          checkStatusFn: checkPromptOptimizationStatus,
          onSuccess: (finalData) => {
            setIsPromptLoading(false);
            if (finalData?.optimizedInstructions) {
              setFormData((prev) => ({
                ...prev,
                instructions: finalData.optimizedInstructions,
              }));
              if (errors.instructions) setErrors((p) => ({ ...p, instructions: "" }));
              toast.success("Instructions polished!");
            } else {
              setPromptErrorMessage("Polished data was empty. Please try re-typing your points.");
            }
          },
          onFailure: (errorMsg) => {
            setIsPromptLoading(false);
            setPromptErrorMessage(errorMsg || "Could not polish instructions. Please try again.");
          },
        });
      } else {
        throw new Error("Failed to initialize background optimization job.");
      }
    } catch (err) {
      setIsPromptLoading(false);
      setPromptErrorMessage("Could not connect to the prompt optimization pipeline.");
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar select-none animate-fade-in relative z-10 flex flex-col gap-6">
      
      {/* Sticky Header Navbar Action Row */}
      <div className="sticky top-0 z-30 w-full flex items-center justify-between border-b border-border-default pb-4 bg-bg-base/95 backdrop-blur-md">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold tracking-tight text-text-main font-mono uppercase">Theory Guide Workspace</h1>
          <p className="text-xs text-text-light">Enter custom rules and topics to generate comprehensive revision blueprints.</p>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          loading={loading}
          disabled={isPromptLoading || !formData.topic}
          onClick={startTheoryGeneration}
          className="font-semibold text-xs tracking-widest uppercase h-10 px-5 shadow-xs cursor-pointer border border-primary/20 hover:shadow-primary/10 transition-all duration-200 shrink-0"
        >
          <Sparkles size={13} className="stroke-[2.5]" />
          <span>Generate Guide</span>
        </Button>
      </div>

      {/* Process Interrupt Error Render Box */}
      {apiErrorMessage && (
        <Alert
          title="Process Interrupted"
          message={apiErrorMessage}
          variant="danger"
          actionLabel="Try Again"
          onAction={startTheoryGeneration}
        />
      )}

      {/* Core Full Width Data Input Panel */}
      <div className="w-full bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-5 shadow-xs mb-6">
        
        <div className="flex flex-col gap-1 border-b border-border-default pb-4">
          <h2 className="text-sm font-bold tracking-tight text-text-main flex items-center gap-2 font-mono uppercase">
            <Lightbulb size={15} className="text-primary stroke-[2]" />
            <span>Configure Material Rules</span>
          </h2>
        </div>

        {/* Topic Input Field */}
        <Input
          label="Topic / Concept Title"
          type="text"
          name="topic"
          value={formData.topic || ""}
          onChange={handleTopicChange}
          disabled={loading || isPromptLoading}
          error={errors.topic}
          placeholder="E.G., LINKEDLIST BASICS OR MATRIX MULTIPLICATION"
          className="text-xs h-10 bg-bg-base border-border-default rounded-sm pl-3 font-semibold tracking-wide uppercase placeholder:normal-case w-full"
        />

        {/* Language Selection Config */}
        <div className="flex flex-col gap-1.5 w-full bg-bg-base/30 p-3 rounded-sm border border-border-default/60">
          <label className="text-xs font-bold text-text-light uppercase tracking-wider flex items-center gap-1.5">
            <Code2 size={14} className="text-text-light stroke-[2]" />
            <span>Language Selection (For Code Component Blocks):</span>
          </label>
          <select
            name="language"
            value={formData.language || "C++"}
            onChange={handleLanguageChange}
            disabled={loading || isPromptLoading}
            className="w-full md:max-w-xs h-9 px-3 border border-border-default rounded-sm bg-bg-surface text-xs font-medium text-text-main outline-hidden focus:border-primary/40 transition-all cursor-pointer"
          >
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="C">C</option>
            <option value="JavaScript">JavaScript</option>
          </select>
        </div>

        {/* Instruction Requirements Box with Floating Optimizer Trigger */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-[11px] font-bold uppercase tracking-wider text-text-light flex items-center gap-2 font-mono h-5">
            <FileText size={13} className="text-text-light stroke-[2.5]" />
            <span>Your Requirements or Rough Notes (Optional)</span>
          </label>

          {/* Prompt Optimizer Floating Action Button */}
          <div className="absolute right-0 top-0 z-20">
            <Button
              variant="outline"
              size="sm"
              disabled={loading || isPromptLoading || !formData.topic?.trim() || !formData.instructions?.trim()}
              onClick={handleOptimizeUserPrompt}
              className="text-[10px] font-bold tracking-wide h-6 px-2.5 border-dashed border-border-strong bg-bg-soft/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 rounded-sm transition-all duration-200"
            >
              <Wand2 size={10} className="stroke-[2.5]" />
              <span>Polish with AI</span>
            </Button>
          </div>

          {/* Main Content Resizing Input Container */}
          <div className="relative w-full rounded-sm overflow-hidden">
            {isPromptLoading && (
              <div className="absolute inset-0 bg-bg-surface/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2 animate-fade-in">
                <Loader2 size={20} className="animate-spin text-primary stroke-[2.5]" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-text-muted uppercase">
                  Polishing your points...
                </span>
              </div>
            )}

            <textarea
              name="instructions"
              value={formData.instructions || ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, instructions: e.target.value }));
                if (errors.instructions) setErrors((p) => ({ ...p, instructions: "" }));
              }}
              disabled={loading || isPromptLoading}
              placeholder={`Type your rough points, copy-pasted concepts, or specific features here. \n\nExample:\n- explain singly vs doubly\n- show how deletion works\n\nThen click "Polish with AI" to let the backend optimize it into a system blueprint.`}
              style={{ fieldSizing: "content" }}
              className={`w-full min-h-[180px] resize-none block border bg-bg-base px-3.5 py-3 font-mono text-[13px] md:text-[14px] leading-6 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 ${
                errors.instructions ? "border-danger focus:border-danger" : "border-border-default"
              }`}
            />
          </div>

          {errors.instructions && (
            <p className="text-xs font-medium text-danger tracking-wide">{errors.instructions}</p>
          )}

          {promptErrorMessage && (
            <div className="mt-2 animate-fade-in">
              <Alert title="Optimization Failed" message={promptErrorMessage} variant="danger" />
            </div>
          )}
        </div>

      </div>

      {/* Shared Global Processing Modal component overlay */}
      <NoteGeneratingModal 
        isOpen={loading} 
        title="AI is Compiling Theory Guide"
        subtitle="Structuring concept definitions, outlining layout chapters, and formatting working code blocks..."
      />
      
    </div>
  );
};

export default TheoryGenerator;