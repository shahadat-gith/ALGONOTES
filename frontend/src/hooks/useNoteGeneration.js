import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateAiNote, checkNoteStatus, deleteNote } from "../api/noteApi";
import { useBackoffPolling } from "./useBackoffPolling";
import toast from "react-hot-toast";

const STORAGE_KEY = "dsa_note_generation";

export const useNoteGeneration = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cached DSA session data:", e);
      }
    }
    return { problemLink: "", userCode: "", language: "C++", userNotes: "" };
  });

  const [errors, setErrors] = useState({ problemLink: "", userCode: "" });
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const handleGenerationFailure = useCallback(async (noteId, message) => {
    setLoading(false);
    setApiErrorMessage(message);
    try {
      await deleteNote(noteId);
    } catch (cleanError) {
      console.error("Clean error during deletion rollback:", cleanError);
    }
  }, []);

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

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setLoading(true);

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
        onSuccess: () => {
          toast.success("Note generated!");
          sessionStorage.removeItem(STORAGE_KEY);
          setTimeout(() => {
            navigate(`/notes/${initResponse.id}/edit`, { replace: true });
          }, 800);
        },
        onFailure: (errMsg) => handleGenerationFailure(initResponse.id, errMsg),
      });
    } catch (error) {
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
    startMakingNotes,
  };
};