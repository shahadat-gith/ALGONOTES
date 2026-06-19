import React, { useState, useEffect } from "react";
import { useTheoryGeneration } from "../../hooks/useTheoryGeneration";
import { optimizeTheoryInstructions, checkPromptOptimizationStatus } from "../../api/promptApi";

import { useBackoffPolling } from "../../hooks/useBackoffPolling";
import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Steps from "../../components/common/Steps";
import Alert from "../../components/common/Alert";
import toast from "react-hot-toast";

import { Sparkles, FileText, Wand2, Lightbulb, Code2, Loader2 } from "lucide-react";

const TheoryGenerator = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  const {
    formData = { topic: "", instructions: "", language: "C++" },
    setFormData,
    errors = {},
    setErrors,
    loading,
    setLoading,
    hasStarted,
    setHasStarted,
    steps,
    setSteps,
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
    
    // Filter out timestamps older than 1 minute
    timestamps = timestamps.filter((time) => NOW - time < ONE_MINUTE);
    
    if (timestamps.length >= MAX_ALLOWED_REQ_PER_MIN) {
      const oldestRemaining = timestamps[0];
      const secondsLeft = Math.ceil((ONE_MINUTE - (NOW - oldestRemaining)) / 1000);
      return { allowed: false, secondsLeft }; // Fixed: capitalized False to lowercase false
    }
    
    // Track new request timestamp safely
    timestamps.push(NOW);
    localStorage.setItem(storageKey, JSON.stringify(timestamps));
    return { allowed: true }; // Fixed: capitalized True to lowercase true
  };

  const handleTopicChange = (e) => {
    const uppercaseValue = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, topic: uppercaseValue }));
    if (errors.topic) setErrors((p) => ({ ...p, topic: "" }));
  };

  const handleLanguageChange = (e) => {
    setFormData((prev) => ({ ...prev, language: e.target.value }));
  };

  // Submits raw instructions to the backend for optimization with local rate limits
  // ASYNC POLLING FIX: Handles polishing rough notes into optimized AI prompts cleanly
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
      // 1. Kick off the asynchronous optimization background job task
      const res = await optimizeTheoryInstructions({
        topic: formData.topic,
        instructions: formData.instructions || "",
        language: formData.language,
      });

      // 2. Read the transient jobId from the 202 Accepted response payload
      if (res?.success && res?.jobId) {
        
        // 3. Hand over execution tracking straight to your backoff polling hook loop
        startPolling({
          resourceId: res.jobId,
          checkStatusFn: checkPromptOptimizationStatus, // Ensure this api function is passed down
          
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
          
          onStepTick: () => {
            // No sidebar step indicators are mapped to this background sub-task
          }
        });

      } else {
        throw new Error("Failed to initialize background optimization job.");
      }
    } catch (err) {
      setIsPromptLoading(false);
      setPromptErrorMessage("Could not connect to the prompt optimization pipeline.");
    }
  };
  // Handles the note generation polling pipeline with local rate limits
  const handleStartGenerationProcess = async () => {
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      toast.error(`Rate limit reached. Please wait ${rateLimit.secondsLeft}s before generating a new guide.`);
      return;
    }

    try {
      const res = await startTheoryGeneration();
      
      if (res?.success && res?.theoryId) {
        startPolling({
          resourceId: res.theoryId,
          checkStatusFn: checkTheoryStatus,
          
          onSuccess: (finalizedData) => {
            setLoading(false);
            toast.success("Study material built successfully!");
            navigate(`/theory/${res.theoryId}`);
          },
          
          onFailure: (errorMessage) => {
            setLoading(false);
            setHasStarted(false);
            toast.error(errorMessage || "Generation processing encountered a failure.");
          },
          
          onStepTick: () => {
            setSteps((prevSteps) => {
              const activeIndex = prevSteps.findIndex((s) => s.status === "current");
              if (activeIndex !== -1 && activeIndex < prevSteps.length - 1) {
                return prevSteps.map((s, idx) => {
                  if (idx === activeIndex) return { ...s, status: "complete" };
                  if (idx === activeIndex + 1) return { ...s, status: "current" };
                  return s;
                });
              }
              return prevSteps;
            });
          }
        });
      }
    } catch (err) {
      setLoading(false);
      setHasStarted(false);
      toast.error("Could not connect to the creation pipeline.");
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:h-[calc(100vh-6rem)] md:max-h-[calc(100vh-6rem)] md:overflow-hidden select-none animate-fade-in relative z-10 font-sans text-text-main">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] items-start lg:h-full lg:max-h-full">
        
        {/* Left Side: Creation Details Panel */}
        <div className="bg-bg-surface border border-border-default rounded-md p-5 sm:p-6 space-y-5 shadow-xs lg:h-full lg:max-h-full lg:overflow-y-auto custom-scrollbar pr-3">
          
          {/* Header section */}
          <div className="flex flex-col gap-1 border-b border-border-default pb-4">
            <h2 className="text-base font-bold tracking-tight text-text-main flex items-center gap-2">
              <Lightbulb size={16} className="text-primary stroke-[2]" />
              <span>Set Up Your Study Material</span>
            </h2>
            <p className="text-[11.5px] text-text-light">
              Enter your topic, choose your code preferences, and add simple rules to guide how your note is written.
            </p>
          </div>

          {/* Topic Input Field */}
          <div className="w-full">
            <Input
              label="Topic / Concept Title"
              type="text"
              name="topic"
              value={formData.topic || ""}
              onChange={handleTopicChange}
              disabled={loading || isPromptLoading}
              error={errors.topic}
              placeholder="E.G., LINKEDLIST BASICS OR MATRIX MULTIPLICATION"
              className="text-xs h-10 bg-bg-base border-border-default rounded-sm pl-3 font-semibold tracking-wide uppercase placeholder:normal-case"
            />
          </div>

          {/* Code Configuration Layout */}
          <div className="flex flex-col gap-1.5 w-full bg-bg-base/30 p-3 rounded-sm border border-border-default/60">
            <label className="text-xs font-bold text-text-light uppercase tracking-wider flex items-center gap-1.5">
              <Code2 size={14} className="text-text-light stroke-[2]" />
              <span>Does your note contain code? Select your desired language:</span>
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

          {/* Field Section: Text Instructions Container */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-light flex items-center gap-2 font-mono h-5">
              <FileText size={13} className="text-text-light stroke-[2.5]" />
              <span>Your Requirements or Rough Notes (Optional)</span>
            </label>

            {/* Top-Right "Polish with AI" Button */}
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

            {/* Core Textarea Wrapper Block with Localized Loader Card Element */}
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
                  setFormData((prev) => ({
                    ...prev,
                    instructions: e.target.value,
                  }));
                  if (errors.instructions)
                    setErrors((p) => ({ ...p, instructions: "" }));
                }}
                disabled={loading || isPromptLoading}
                rows={8}
                placeholder={`Type your rough points, copy-pasted concepts, or specific features here. \n\nExample:\n- explain singly vs doubly\n- show how deletion works\n\nThen click "Polish with AI" to let the backend optimize it into a system blueprint.`}
                className={`w-full resize-y block border bg-bg-base px-3.5 py-3 font-mono text-[13px] md:text-[14px] leading-6 text-text-main transition-all outline-hidden focus:border-primary/40 focus:bg-bg-base/80 custom-scrollbar ${
                  errors.instructions
                    ? "border-danger focus:border-danger"
                    : "border-border-default"
                }`}
              />
            </div>

            {errors.instructions && (
              <p className="text-xs font-medium text-danger tracking-wide">
                {errors.instructions}
              </p>
            )}

            {/* Inline Optimization Errors Render Area */}
            {promptErrorMessage && (
              <div className="mt-2 animate-fade-in">
                <Alert
                  title="Optimization Failed"
                  message={promptErrorMessage}
                  variant="danger"
                />
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <Button
            variant="primary"
            size="md"
            loading={loading}
            disabled={isPromptLoading || !formData.topic}
            onClick={handleStartGenerationProcess}
            className="w-full font-bold text-xs tracking-widest uppercase h-11 shadow-xs cursor-pointer mt-2 rounded-sm"
          >
            <Sparkles size={13} className="stroke-[2.5]" />
            <span>Generate Study Guide</span>
          </Button>
        </div>

        {/* Right Side: Live Status Tracker Progress Panel */}
        <div className="space-y-4 lg:h-full lg:max-h-full lg:overflow-y-auto lg:sticky lg:top-0 custom-scrollbar pr-1">
          <Steps
            steps={steps.map((s) => ({
              ...s,
              status: hasStarted ? s.status : "",
            }))}
          />

          {apiErrorMessage && (
            <Alert
              title="Process Interrupted"
              message={apiErrorMessage}
              variant="danger"
              actionLabel="Try Again"
              onAction={handleStartGenerationProcess}
            />
          )}
        </div>
        
      </div>
    </div>
  );
};

export default TheoryGenerator;