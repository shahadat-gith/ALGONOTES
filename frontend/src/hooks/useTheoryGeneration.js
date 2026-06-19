import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateTheoryNote, checkTheoryStatus, deleteTheoryNote } from "../api/theoryApi"; 
import { useBackoffPolling } from "./useBackoffPolling";
import toast from "react-hot-toast";

const STORAGE_KEY = "theory_note_generation";

export const useTheoryGeneration = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cached Theory session data:", e);
      }
    }
    return { topic: "", instructions: "" };
  });

  const [errors, setErrors] = useState({ topic: "", instructions: "" });
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const handleGenerationFailure = useCallback(async (theoryId, message) => {
    setLoading(false);
    setApiErrorMessage(message);
    try {
      await deleteTheoryNote(theoryId);
    } catch (cleanError) {
      console.error("Rollback failed:", cleanError);
    }
  }, []);

  const startTheoryGeneration = async () => {
    if (loading) return;
    setApiErrorMessage("");
    setErrors({ topic: "", instructions: "" });

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

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setLoading(true);

    try {
      const initResponse = await generateTheoryNote({ 
        topic: formData.topic.trim(),
        instructions: formData.instructions.trim() || undefined
      });

      const targetId = initResponse?.id || initResponse?.theoryId;

      if (!initResponse?.success || !targetId) {
        throw new Error("Queue rejected.");
      }

      startPolling({
        resourceId: targetId, 
        checkStatusFn: checkTheoryStatus,
        onSuccess: () => {
          toast.success("Theory generated!");
          sessionStorage.removeItem(STORAGE_KEY);
          setTimeout(() => {
            navigate(`/theory/${targetId}/edit`, { replace: true });
          }, 800);
        },
        onFailure: (errMsg) => handleGenerationFailure(targetId, errMsg),
      });
    } catch (err) {
      stopPolling();
      setLoading(false);
      setApiErrorMessage(
        "AI agent is currently unavailable! please try after sometime."
      );
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    apiErrorMessage,
    startTheoryGeneration,
  };
};