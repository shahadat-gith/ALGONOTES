import axiosInstance from "./axiosInstance";

/**
 * Triggers the background AI note generation loop.
 * Instantly returns a 202 status code while the backend handles processing.
 */
export const generateAiNote = async (problemId) => {
  const { data } = await axiosInstance.post(`/ai/generate/${problemId}`);
  return data;
};

/**
 * Periodically fetches the status of the note compiler.
 * Polled by the frontend loading screen while status === "processing".
 */
export const checkNoteStatus = async (problemId) => {
  const { data } = await axiosInstance.get(`/ai/status/${problemId}`);
  return data;
};

/**
 * Triggers a fresh background AI regeneration execution.
 * Instantly flags state to "processing" and returns.
 */
export const regenerateAiNote = async (problemId) => {
  const { data } = await axiosInstance.post(`/ai/regenerate/${problemId}`);
  return data;
};