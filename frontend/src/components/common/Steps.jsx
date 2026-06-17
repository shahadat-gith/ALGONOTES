import React from "react";
import { Check, Loader2, X } from "lucide-react";

/**
 * Steps Component
 * @param {Array} steps - Array of objects: [{ id: 1, text: "Step Text", status: "waiting" | "running" | "completed" | "failed" | "" }]
 */
const Steps = ({ steps = [] }) => {
  return (
    <div className="w-full max-w-sm mx-auto p-5 bg-bg-surface border border-border-default rounded-md shadow-card flex flex-col justify-start items-start space-y-8 select-none relative z-10 transition-all duration-300">
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isRunning = step.status === "running";
        const isFailed = step.status === "failed";
        const isWaiting = step.status === "waiting";
        const isUninitiated = step.status === ""; 

        // Determine typography and layout opacity baselines based on pipeline states
        const isActiveOrDone = isRunning || isCompleted || isFailed;

        return (
          <div 
            key={step.id} 
            className={`relative flex items-center gap-5 group w-full transition-all duration-500 ease-in-out ${
              isUninitiated 
                ? "opacity-40 scale-100" 
                : isRunning 
                ? "opacity-100 scale-[1.02]" 
                : isWaiting 
                ? "opacity-25 scale-100" 
                : "opacity-100 scale-100"
            }`}
          >
            
            {/* --- VERTICAL CONNECTING BRANCH LINE --- */}
            {index !== steps.length - 1 && (
              <div 
                className={`absolute left-[19px] top-10 w-0.5 h-9 transition-all duration-500 ease-in-out pointer-events-none ${
                  isCompleted 
                    ? "bg-success shadow-[0_0_8px_rgba(var(--success-rgb),0.3)] opacity-100" 
                    : isFailed 
                    ? "bg-danger shadow-[0_0_8px_rgba(var(--danger-rgb),0.3)] opacity-100" 
                    : "bg-border-default opacity-40"
                }`}
              />
            )}

            {/* --- STEP NODE CIRCLE --- */}
            <div className="relative z-10 flex items-center justify-center shrink-0">
              
              {/* Completed State: Solid Green Success Badge */}
              {isCompleted && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-success shadow-md shadow-success/20 animate-fade-in">
                  <Check size={16} className="stroke-[3]" />
                </div>
              )}

              {/* Active Running State: Bright Pulsing Accent Border */}
              {isRunning && (
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-bg-surface text-primary flex items-center justify-center shadow-md shadow-primary/20 animate-pulse">
                  <Loader2 size={15} className="animate-spin stroke-[2.25]" />
                </div>
              )}

              {/* Failed State: Solid Red Critical Cross Badge */}
              {isFailed && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-danger shadow-md shadow-danger/20 animate-fade-in">
                  <X size={16} className="stroke-[3]" />
                </div>
              )}

              {/* Inactive / Waiting State: Clean, Flat Disabled Ring */}
              {(isWaiting || isUninitiated) && (
                <div className="w-10 h-10 rounded-full border border-border-strong bg-bg-soft text-text-light flex items-center justify-center font-mono font-bold text-xs tracking-wide">
                  {step.id}
                </div>
              )}
            </div>

            {/* --- TEXT CONTENT --- */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span 
                className={`text-xs font-semibold tracking-wide transition-colors duration-300 truncate ${
                  isRunning 
                    ? "text-primary" 
                    : isFailed
                    ? "text-danger"
                    : isActiveOrDone 
                    ? "text-text-main" 
                    : "text-text-light"
                }`}
              >
                {step.text}
              </span>
              
              {/* Status Indicator Tag */}
              {!isUninitiated && (
                <span 
                  className={`text-[9px] font-bold font-mono uppercase tracking-widest transition-colors duration-300 ${
                    isRunning 
                      ? "text-primary" 
                      : isCompleted 
                      ? "text-success" 
                      : isFailed
                      ? "text-danger"
                      : "text-text-light" 
                  }`}
                >
                  {isCompleted && "Completed"}
                  {isRunning && "In Progress"}
                  {isFailed && "Failed"}
                  {isWaiting && "Pending"}
                </span>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Steps;