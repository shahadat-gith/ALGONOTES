import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { generateAiNote, checkNoteStatus } from "../../api/geminiApi"; 

import { Sparkles, Loader2, Terminal, Cpu, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const GenerateNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const problem = location?.state?.problem;

  const [noteStarted, setNoteStarted] = useState(false);
  const [message, setMessage] = useState("Ready to start making your notes.");
  const [progress, setProgress] = useState(0);

  const alreadyStarted = useRef(false);
  const pollIntervalId = useRef(null);

  // Dynamic status messages tied to polling progress milestones
  const updateProgressUi = (currentProgress) => {
    if (currentProgress < 25) {
      setMessage("Starting up the AI assistant and getting the workspace ready...");
    } else if (currentProgress < 50) {
      setMessage("Reading through your code to understand how your solution works...");
    } else if (currentProgress < 75) {
      setMessage("Writing down the basic, step-by-step explanation for this problem...");
    } else if (currentProgress < 95) {
      setMessage("Creating an easy-to-follow table to track exactly how the code runs...");
    }
  };

  useEffect(() => {
    if (!problem) {
      toast.error("Problem details missing. Redirecting...");
      navigate("/problems", { replace: true });
    }

    // Safely clear intervals on unmount to prevent component leak errors
    return () => {
      if (pollIntervalId.current) clearInterval(pollIntervalId.current);
    };
  }, [problem, navigate]);

  const startMakingNotes = async () => {
    if (alreadyStarted.current) return;

    alreadyStarted.current = true;
    setNoteStarted(true);
    setProgress(5);
    setMessage("Connecting to AI engine pipeline...");

    try {
      // 1. Fire off the background start signal (returns instantly)
      const data = await generateAiNote(id);

      if (data.success) {
        setProgress(15);
        setMessage("Starting up the AI assistant and getting the workspace ready...");

        // 2. Begin Polling the backend status route every 3 seconds
        pollIntervalId.current = setInterval(async () => {
          try {
            const statusData = await checkNoteStatus(id);

            if (statusData.status === "draft") {
              // Generation Complete!
              clearInterval(pollIntervalId.current);
              setProgress(100);
              setMessage("All done! Saving your new notes now...");
              toast.success("AI notes generated successfully!");

              // Delay redirect slightly so the user registers the 100% complete state
              setTimeout(() => {
                navigate(`/notes/${id}/edit`, {
                  replace: true,
                  state: { draftData: statusData.draft },
                });
              }, 800);

            } else if (statusData.status === "failed") {
              // Generation Failed internally on Backend
              clearInterval(pollIntervalId.current);
              setNoteStarted(false);
              alreadyStarted.current = false;
              setProgress(0);
              setMessage("Ready to start making your notes.");
              toast.error("The AI assistant hit a bump writing this note. Please try again.");

            } else {
              // Still Processing -> Tick the progress bar forward incrementally
              setProgress((oldProgress) => {
                const nextProgress = oldProgress < 90 ? oldProgress + 4 : oldProgress;
                updateProgressUi(nextProgress);
                return nextProgress;
              });
            }
          } catch (pollErr) {
            // Suppress minor network check blips but keep the thread alive
            console.error("Status polling check failed:", pollErr);
          }
        }, 3000);
      }
    } catch (err) {
      toast.error("Could not start note generation. Please try again.");
      setNoteStarted(false);
      alreadyStarted.current = false;
      setProgress(0);
      setMessage("Ready to start making your notes.");
    }
  };

  if (!problem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[var(--primary)]" size={24} />
        <span className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
          Going back...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in max-w-4xl mx-auto flex flex-col justify-center space-y-4">

      {/* MAIN UNIFIED MINIMAL TERMINAL CARD */}
      <div className="bg-[#1e1e2e] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Window Header */}
        <div className="h-12 px-4 bg-[#181825] border-b border-neutral-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-neutral-500" />
            <span className="text-xs font-mono font-bold text-neutral-400 tracking-wide">
              ai_notes_generator.sh
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700/50" />
          </div>
        </div>

        {/* Inner Content Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Problem Details Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/60 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 block">
                generate note for
              </span>
              <h1 className="text-lg font-bold text-neutral-100 tracking-tight">
                {problem?.title}
              </h1>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-[11px] text-neutral-400">
              <span className="text-neutral-500 uppercase tracking-wider font-bold text-[10px]">Problem ID</span>
              <span className="bg-[#181825] border border-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-mono text-xs font-semibold">
                {id?.slice(0, 8) || id}
              </span>
            </div>
          </div>

          {/* Progress Status Message Box */}
          <div className="min-h-[140px] flex flex-col justify-between bg-[#141421] border border-neutral-800/60 rounded-xl p-5 relative overflow-hidden group">
            
            {/* Background Loading Pulse */}
            {noteStarted && progress < 100 && (
              <div className="absolute inset-0 bg-[var(--primary)]/[0.015] pointer-events-none animate-pulse" />
            )}

            {/* Status Indicator Badge */}
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-neutral-500 uppercase select-none mb-4">
              <span className={`h-1.5 w-1.5 rounded-full ${noteStarted ? "bg-blue-400 animate-ping" : "bg-neutral-600"}`} />
              Status: {noteStarted ? "Writing notes..." : "Ready to start"}
            </div>

            {/* Current Step Text Display */}
            <div className="flex items-start gap-2.5 flex-1 text-xs">
              <span className="text-blue-400 font-bold select-none font-mono">&gt;</span>
              <p className="text-neutral-200 leading-relaxed font-medium transition-all duration-300">
                {message}
              </p>
            </div>

            {/* Percentage Number Counter */}
            {noteStarted && (
              <div className="absolute top-4 right-4 font-mono font-bold text-xs bg-neutral-900/80 border border-neutral-800 text-neutral-400 px-2 py-1 rounded-md shadow-sm">
                {progress}%
              </div>
            )}
          </div>

          {/* Progress Bar & Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            
            {/* Simple Progress Bar */}
            <div className="w-full sm:max-w-xs flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-500 font-bold tracking-wider uppercase flex items-center gap-1">
                <Cpu size={12} className={noteStarted && progress < 100 ? "animate-pulse text-blue-400" : ""} />
                Progress
              </span>
              <div className="h-1.5 w-full bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-blue-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {!noteStarted ? (
              <button
                onClick={startMakingNotes}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-white shadow-md shadow-[var(--primary)]/10 transition-all active:scale-[0.98]"
              >
                <Sparkles size={13} />
                Generate Notes
              </button>
            ) : (
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-neutral-400 cursor-not-allowed select-none">
                <Loader2 size={13} className="animate-spin text-blue-400" />
                Creating your notes...
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Subtext */}
      <p className="text-[10px] text-neutral-500 text-center select-none">
        The AI assistant will automatically create explanations, step-by-step runtime tables, and note down edge cases.
      </p>

    </div>
  );
};

export default GenerateNotes;