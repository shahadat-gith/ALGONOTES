import React from "react";
import { Check, Loader2, X } from "lucide-react";

/**
 * Steps Component
 * @param {Array} steps - Array of objects: [{ id: 1, text: "Step Text", status: "waiting" | "running" | "completed" | "failed" | "" }]
 */
const Steps = ({ steps = [] }) => {
  return (
    <div 
      className="relative flex flex-col justify-start items-start space-y-8 select-none max-w-sm mx-auto p-5 rounded-3xl transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-card)"
      }}
    >
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isRunning = step.status === "running";
        const isFailed = step.status === "failed";
        const isWaiting = step.status === "waiting";
        const isUninitiated = step.status === ""; 

        // Determine if this row belongs to active/passed context or a future pending state
        const isActiveOrDone = isRunning || isCompleted || isFailed;
        const shouldDim = (isWaiting || isUninitiated) && !isRunning;

        return (
          <div 
            key={step.id} 
            className="relative flex items-center gap-6 group w-full transition-all duration-500 ease-in-out"
            style={{
              opacity: isUninitiated ? 0.4 : shouldDim ? 0.25 : 1,
              transform: isRunning ? "scale(1.02)" : "scale(1)"
            }}
          >
            
            {/* --- VERTICAL CONNECTING BRANCH LINE --- */}
            {index !== steps.length - 1 && (
              <div 
                className="absolute left-5 top-10 w-0.5 h-10 transition-all duration-500 ease-in-out"
                style={{
                  backgroundColor: isCompleted 
                    ? "var(--success)" 
                    : isFailed 
                    ? "var(--danger)" 
                    : "var(--border-default)",
                  boxShadow: isCompleted 
                    ? "0 0 8px rgba(16, 185, 129, 0.3)" 
                    : isFailed 
                    ? "0 0 8px rgba(239, 68, 68, 0.3)" 
                    : "none",
                  opacity: isCompleted || isFailed ? 1 : 0.4
                }}
              />
            )}

            {/* --- STEP NODE CIRCLE --- */}
            <div className="relative z-10 flex items-center justify-center transition-transform duration-300">
              {/* Completed State: Solid Green Success Badge */}
              {isCompleted && (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white animate-fade-in"
                  style={{
                    backgroundColor: "var(--success)",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)"
                  }}
                >
                  <Check size={18} strokeWidth={3} />
                </div>
              )}

              {/* Active Running State: Bright Pulsing Accent Border */}
              {isRunning && (
                <div 
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm animate-pulse"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                    boxShadow: "0 0 16px rgba(37, 99, 235, 0.35)"
                  }}
                >
                  <Loader2 size={16} className="animate-spin" />
                </div>
              )}

              {/* ADDED: Failed State: Solid Red Critical Cross Badge */}
              {isFailed && (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white animate-fade-in"
                  style={{
                    backgroundColor: "var(--danger)",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.35)"
                  }}
                >
                  <X size={18} strokeWidth={3} />
                </div>
              )}

              {/* Inactive / Waiting State: Clean, Flat Disabled Ring */}
              {(isWaiting || isUninitiated) && (
                <div 
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-soft)",
                    borderColor: "var(--border-strong)",
                    color: "var(--text-light)"
                  }}
                >
                  {step.id}
                </div>
              )}
            </div>

            {/* --- TEXT CONTENT --- */}
            <div className="flex flex-col space-y-0.5 transition-all duration-300">
              <span 
                className="text-sm font-semibold tracking-tight transition-colors duration-300"
                style={{
                  color: isRunning 
                    ? "var(--primary)" 
                    : isFailed
                    ? "var(--danger)"
                    : isActiveOrDone 
                    ? "var(--text-main)" 
                    : "var(--text-light)"
                }}
              >
                {step.text}
              </span>
              
              {/* Status Indicator Tag */}
              {!isUninitiated && (
                <span 
                  className="text-[10px] font-bold uppercase tracking-wider transition-colors duration-300" 
                  style={{ 
                    color: isRunning 
                      ? "var(--primary)" 
                      : isCompleted 
                      ? "var(--success)" 
                      : isFailed
                      ? "var(--danger)"
                      : "var(--text-light)" 
                  }}
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