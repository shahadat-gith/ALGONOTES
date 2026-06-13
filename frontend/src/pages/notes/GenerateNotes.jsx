import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemById } from "../../api/problemApi";
import { generateAiNote } from "../../api/noteApi";
import { Sparkles, Loader2, Terminal, ShieldCheck, Cpu } from "lucide-react";
import toast from "react-hot-toast";

const GenerateNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pipelineStarted, setPipelineStarted] = useState(false);
  
  // Custom states to handle the visual AI agent simulation messages
  const [agentStatus, setAgentStatus] = useState("Getting things ready...");
  const [progressPercentage, setProgressPercentage] = useState(5);
  
  // Ref tracking ensures the pipeline is only ever fired exactly once in StrictMode
  const creationStartedRef = useRef(false);

  // Simulation Message Sequence Array - Rewritten in plain, simple language
  const agentMessages = [
    { text: "Starting up the AI assistant and preparing a safe workspace...", pct: 15 },
    { text: "Reading through your code to understand how your solution works...", pct: 32 },
    { text: "Writing down the basic, straightforward way to solve this problem...", pct: 48 },
    { text: "Figuring out the most efficient, clever way to optimize the solution...", pct: 64 },
    { text: "Creating a step-by-step example table to show exactly how the code runs...", pct: 81 },
    { text: "Checking for tricky situations, double-checking the notes, and saving everything...", pct: 95 }
  ];

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await getProblemById(id);
        if (response.success) {
          setProblem(response.problem);
          setLoading(false);
        }
      } catch (err) {
        toast.error("Could not trace problem references.");
        navigate("/problems");
      }
    };
    fetchContext();
  }, [id, navigate]);

  // 2. Automated AI Generation and Fake Agent Message Simulator Pipeline
  useEffect(() => {
    if (loading || !problem || creationStartedRef.current) return;
    
    creationStartedRef.current = true;
    setPipelineStarted(true);

    let MessageTimers = [];

    // Schedule the rolling display logs at periodic structural milestones
    agentMessages.forEach((msg, idx) => {
      const timer = setTimeout(() => {
        setAgentStatus(msg.text);
        setProgressPercentage(msg.pct);
      }, (idx + 1) * 1800); // Transitions smoothly roughly every ~1.8 seconds
      MessageTimers.push(timer);
    });

    const triggerGenerationAPI = async () => {
      try {
        const data = await generateAiNote(id);
        if (data.success) {
          // Complete the visual track instantly before shifting viewports
          setProgressPercentage(100);
          setAgentStatus("All done! Saving your new study guide now...");
          
          toast.success("AI Synthesis complete!");
          navigate(`/notes/${id}/edit`, { state: { draftData: data.draft } });
        }
      } catch (err) {
        toast.error("Something went wrong while generating notes.");
        navigate(`/problems/${id}`);
      }
    };

    triggerGenerationAPI();

    // Clear background interval timers gracefully if the page unmounts
    return () => {
      MessageTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [loading, problem, id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-[var(--primary)] animate-pulse">
        <Loader2 className="animate-spin mb-3" size={28} />
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-[var(--text-light)]">Opening your workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      
      {/* Top Graphic Heading Status Indicator */}
      <div className="text-center space-y-3">
        <div className="h-14 w-14 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto shadow-sm shadow-[var(--primary)]/10 animate-pulse relative">
          <Sparkles size={24} className="animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-0 rounded-2xl border border-[var(--primary)]/30 animate-ping opacity-40" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Writing Your Study Notes</h1>
          <p className="text-xs text-[var(--text-light)] font-sans">Problem: <span className="font-semibold text-[var(--text-muted)]">{problem?.title}</span></p>
        </div>
      </div>

      {/* Progress Metric Status bar Layout Component */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-sans font-bold text-[var(--text-light)] px-1">
          <span className="text-[var(--primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={14} className="animate-pulse" />
            AI Assistant Helper
          </span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-[var(--bg-soft)] rounded-full overflow-hidden border border-[var(--border-default)]/40 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-[var(--primary)] to-blue-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%`}}
          />
        </div>
      </div>

      {/* Stylized Simulated Terminal Console Logging Shell Component */}
      <div className="bg-[#1e1e2e] border border-neutral-800 rounded-xl overflow-hidden shadow-lg shadow-black/10">
        {/* Terminal Window Chrome Headers Bar */}
        <div className="px-4 py-2 bg-[#181825] border-b border-neutral-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-neutral-500" />
            <span className="text-[11px] font-sans font-bold text-neutral-400">live_progress_status.txt</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/40" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
            <div className="w-2 h-2 rounded-full bg-green-500/40" />
          </div>
        </div>

        {/* Real-Time Live Running Logging Space Content Terminal Console */}
        <div className="p-5 font-sans text-xs space-y-3 min-h-[120px] flex flex-col justify-center">
          <div className="flex items-start gap-2 text-neutral-400">
            <span className="text-[var(--success)] select-none font-bold">&gt;&gt;</span>
            <p className="text-neutral-200 leading-relaxed font-medium transition-all duration-300">
              {agentStatus}
            </p>
          </div>
          
          <div className="border-t border-neutral-800/60 pt-3 flex items-center gap-2 text-[10px] text-neutral-500 uppercase font-bold tracking-widest select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-ping" />
            Current Status: Working on your notes...
          </div>
        </div>
      </div>

      {/* Safety Bottom Information Card Box layout summary */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl flex items-center gap-3 shadow-inner">
        <ShieldCheck size={18} className="text-[var(--text-light)] shrink-0" />
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          Please keep this page open. It only takes a couple of seconds for the AI to put together your explanations, step-by-step memory tables, and tricky edge cases!
        </p>
      </div>

    </div>
  );
};

export default GenerateNotes;