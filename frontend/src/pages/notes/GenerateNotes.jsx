import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { generateAiNote, checkNoteStatus } from "../../api/geminiApi";
import Steps from "./Steps";

import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const GenerateNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const problem = location?.state?.problem;

  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); 
  const pollTimer = useRef(null);

  const [steps, setSteps] = useState([
    { id: 1, text: "Initialising AI agent", status: "waiting" },
    { id: 2, text: "Generating the basic (brute-force) solution", status: "waiting" },
    { id: 3, text: "Thinking of the most optimal solution", status: "waiting" },
    { id: 4, text: "Breaking down the step-by-step algorithm", status: "waiting" },
    { id: 5, text: "Creating the code walkthrough and dry run", status: "waiting" },
    { id: 6, text: "Checking for tricky edge cases and saving", status: "waiting" },
  ]);

  useEffect(() => {
    if (!problem) {
      toast.error("Problem details missing.");
      navigate("/problems", { replace: true });
    }
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [problem, navigate]);

  const handleGenerationSuccess = (draftData) => {
    clearInterval(pollTimer.current);
    setSteps((prev) => prev.map((s) => ({ ...s, status: "completed" })));
    toast.success("Notes created successfully!");

    setTimeout(() => {
      navigate(`/notes/${id}/edit`, {
        replace: true,
        state: { draftData },
      });
    }, 800);
  };

  const handleGenerationFailure = () => {
    clearInterval(pollTimer.current);
    setLoading(false);
    setHasStarted(false);
    setSteps((prev) => prev.map((s) => ({ ...s, status: "waiting" })));
    toast.error("Something went wrong. Please try again.");
  };

  const startMakingNotes = async () => {
    setLoading(true);
    setHasStarted(true);
    
    // 💡 Initialize step 1 to running state immediately
    setSteps((prev) =>
      prev.map((s) => (s.id === 1 ? { ...s, status: "running" } : s))
    );

    try {
      const initResponse = await generateAiNote(id);
      if (!initResponse.success) throw new Error();

      let tickCount = 0;

      pollTimer.current = setInterval(async () => {
        tickCount++;
        try {
          const check = await checkNoteStatus(id);

          if (check.status === "draft") {
            handleGenerationSuccess(check.draft);
            return;
          }
          if (check.status === "failed") {
            handleGenerationFailure();
            return;
          }

          // 💡 FIXED: Dynamically scan the latest fresh state array at this specific interval tick execution.
          // This removes stale closure variables and guarantees Step 1 finishes cleanly.
          if (tickCount % 2 === 0) {
            setSteps((prevSteps) => {
              // Find which step index is currently running
              const activeIdx = prevSteps.findIndex((s) => s.status === "running");
              
              // If no step is running, or we reached the last one, maintain current array state
              if (activeIdx === -1 || activeIdx >= prevSteps.length - 1) {
                return prevSteps;
              }

              const updated = [...prevSteps];
              updated[activeIdx] = { ...updated[activeIdx], status: "completed" };
              updated[activeIdx + 1] = { ...updated[activeIdx + 1], status: "running" };
              return updated;
            });
          }
        } catch (pollErr) {
          console.error("Polling blip...", pollErr);
        }
      }, 2200);
    } catch (err) {
      handleGenerationFailure();
    }
  };

  if (!problem) return null;

  const processedSteps = steps.map(step => ({
    ...step,
    status: hasStarted ? step.status : "" 
  }));

  return (
    <div
      className="min-h-[85vh] max-w-md mx-auto flex flex-col justify-center px-6 py-12 space-y-8"
      style={{ color: "var(--text-main)" }}
    >
      {/* Header Block */}
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold tracking-tight">{problem?.title}</h1>
        <p
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {loading
            ? "Writing your study notes..."
            : "Ready to create your AI study guide"}
        </p>
      </div>

      {/* Checklist Card */}
      <Steps steps={processedSteps} />

      {/* Button Action */}
      <div className="w-full">
        {!loading && (
          <button
            onClick={startMakingNotes}
            className="w-full py-3.5 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--primary)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
          >
            <Sparkles size={14} /> Generate Now
          </button>
        )}
      </div>
    </div>
  );
};

export default GenerateNotes;