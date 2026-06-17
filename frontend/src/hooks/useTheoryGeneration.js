import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateTheoryNote, checkTheoryStatus, deleteTheoryNote } from "../api/theoryApi"; 
import { useBackoffPolling } from "./useBackoffPolling";
import toast from "react-hot-toast";

const INITIAL_STEPS = [
  { id: 1, text: "Getting an overview of the topic you entered", status: "waiting" },
  { id: 2, text: "Planning the main sections and chapters", status: "waiting" },
  { id: 3, text: "Gathering core meanings, basic ideas, and rules", status: "waiting" },
  { id: 4, text: "Writing down the detailed explanations in simple English", status: "waiting" },
  { id: 5, text: "Checking all formula math and code examples for accuracy", status: "waiting" },
  { id: 6, text: "Polishing the layout and generating your study guide", status: "waiting" },
];

export const useTheoryGeneration = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  // Unified Form Data & Validation States
  const [formData, setFormData] = useState({ topic: "", instructions: "" });
  const [errors, setErrors] = useState({ topic: "", instructions: "" });
  
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const updateCurrentStep = useCallback(() => {
    setSteps((prevSteps) => {
      const activeIndex = prevSteps.findIndex((step) => step.status === "running");
      if (activeIndex === -1) {
        return prevSteps.map((step, index) =>
          index === 0 ? { ...step, status: "running" } : step
        );
      }
      if (activeIndex >= prevSteps.length - 1) return prevSteps;

      return prevSteps.map((step, index) => {
        if (index < activeIndex) return { ...step, status: "completed" };
        if (index === activeIndex) return { ...step, status: "completed" };
        if (index === activeIndex + 1) return { ...step, status: "running" };
        return step;
      });
    });
  }, []);

  const failActiveSteps = useCallback(() => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.status === "running" || step.status === "waiting"
          ? { ...step, status: "failed" }
          : step
      )
    );
  }, []);

  const handleGenerationFailure = useCallback(async (theoryId, message) => {
    failActiveSteps();
    setLoading(false);
    setApiErrorMessage(message);
    try {
      await deleteTheoryNote(theoryId);
    } catch (cleanError) {
      console.error("Rollback failed:", cleanError);
    }
  }, [failActiveSteps]);

  const startTheoryGeneration = async () => {
    if (loading) return;
    setApiErrorMessage("");
    setErrors({ topic: "", instructions: "" });

    // Validation Checks
    let alignmentFailed = false;
    const incomingErrors = { topic: "", instructions: "" };

    if (!formData.topic || !formData.topic.trim()) {
      incomingErrors.topic = "A topic or concept title is required.";
      alignmentFailed = true;
    }

    if (alignmentFailed) {
      setErrors(incomingErrors);
      return;
    }

    setLoading(true);
    setHasStarted(true);
    setSteps(INITIAL_STEPS.map((step, idx) => ({
      ...step,
      status: idx === 0 ? "running" : "waiting",
    })));

    try {
      // Dispatches the compiled payload containing instructions down to your FastAPI router
      const initResponse = await generateTheoryNote({ 
        topic: formData.topic.trim(),
        instructions: formData.instructions.trim() || undefined
      });

      console.log(initResponse)

      if (!initResponse?.success || !initResponse?.id) {
        throw new Error("Queue rejected.");
      }

      startPolling({
        resourceId: initResponse.id,
        checkStatusFn: checkTheoryStatus,
        onStepTick: updateCurrentStep,
        onSuccess: () => {
          setSteps((prev) => prev.map((s) => ({ ...s, status: "completed" })));
          toast.success("Theory Guide compiled successfully!");
          setTimeout(() => {
            navigate(`/theory/${initResponse.id}/edit`, { replace: true });
          }, 800);
        },
        onFailure: (errMsg) => handleGenerationFailure(initResponse.id, errMsg),
      });
    } catch (err) {
      stopPolling();
      failActiveSteps();
      setLoading(false);
      setApiErrorMessage(
        "Theory compile engines are packed right now. Please try again in a moment."
      );
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    hasStarted,
    steps,
    apiErrorMessage,
    startTheoryGeneration,
  };
};