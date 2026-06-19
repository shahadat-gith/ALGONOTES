import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateAiNote, checkNoteStatus, deleteNote } from "../api/noteApi";
import { useBackoffPolling } from "./useBackoffPolling";
import toast from "react-hot-toast";

const INITIAL_STEPS = [
  { id: 1, text: "Reading problem link and solution code", status: "waiting" },
  { id: 2, text: "Extracting problem details and examples", status: "waiting" },
  { id: 3, text: "Analyzing custom instructions and observations", status: "waiting" },
  { id: 4, text: "Understanding your algorithmic approach", status: "waiting" },
  { id: 5, text: "Creating concise revision notes", status: "waiting" },
  { id: 6, text: "Preparing dry run, edge cases, and complexity", status: "waiting" },
  { id: 7, text: "Finalising the generated note", status: "waiting" },
];

export const useNoteGeneration = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  const [formData, setFormData] = useState({
    problemLink: "",
    userCode: "",
    language: "C++",
    userNotes: "",
  });
  const [errors, setErrors] = useState({ problemLink: "", userCode: "" });
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

  const handleGenerationFailure = useCallback(async (noteId, message) => {
    failActiveSteps();
    setLoading(false);
    setApiErrorMessage(message);
    try {
      // Corrected to pass the raw database target id securely down for rollbacks
      await deleteNote(noteId);
    } catch (cleanError) {
      console.error("Clean error during deletion rollback:", cleanError);
    }
  }, [failActiveSteps]);

  const startMakingNotes = async () => {
    if (loading) return;
    setApiErrorMessage("");
    let isValid = true;
    const newErrors = { problemLink: "", userCode: "" };

    if (!formData.problemLink.trim()) {
      newErrors.problemLink = "Problem link is required.";
      isValid = false;
    }
    if (!formData.userCode.trim()) {
      newErrors.userCode = "Solution source code block is required.";
      isValid = false;
    }
    setErrors(newErrors);
    if (!isValid) return;

    setLoading(true);
    setHasStarted(true);
    setSteps(INITIAL_STEPS.map((step, idx) => ({
      ...step,
      status: idx === 0 ? "running" : "waiting",
    })));

    try {
      const initResponse = await generateAiNote({
        problemLink: formData.problemLink.trim(),
        userCode: formData.userCode.trim(),
        language: formData.language,
        userNotes: formData.userNotes.trim(),
      });

      if (!initResponse?.success || !initResponse?.id) {
        throw new Error("Queue rejected.");
      }

      startPolling({
        resourceId: initResponse.id,
        checkStatusFn: checkNoteStatus,
        onStepTick: updateCurrentStep,
        onSuccess: () => {
          setSteps((prev) => prev.map((s) => ({ ...s, status: "completed" })));
          toast.success("Note generated successfully!");
          setTimeout(() => {
            // Keep initResponse.id here since the handshake mapping layer uses the uniform key syntax
            navigate(`/notes/${initResponse.id}/edit`, { replace: true });
          }, 800);
        },
        onFailure: (errMsg) => handleGenerationFailure(initResponse.id, errMsg),
      });
    } catch (error) {
      stopPolling();
      failActiveSteps();
      setLoading(false);
      setApiErrorMessage(
        "The AI generation queue is currently packed. Please try again shortly."
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
    startMakingNotes,
  };
};