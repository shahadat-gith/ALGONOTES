import api from "./axios";



/**
 * Submits rough engineering or copy-pasted concepts to dispatch a transient prompt optimization task.
 * @param {Object} payload - Structural properties containing { topic, instructions, language }
 * @returns {Promise<Object>} Transient verification metadata containing: { success: true, jobId: "..." }
 */
export const optimizeTheoryInstructions = async (payload) => {
  const { data } = await api.post("/prompt/optimize-prompt", payload);
  return data; 
};

/**
 * Polls the running prompt optimization thread to see if the polished output string is ready.
 * Accepts HTTP 202 statuses safely to prevent breaking front-end polling custom hook intervals.
 * @param {string} jobId - Evolving short-lived job tracking database identifier.
 * @returns {Promise<Object>} Complete transient properties block containing optimization updates.
 */
export const checkPromptOptimizationStatus = async (jobId) => {
  const { data } = await api.get(`/prompt/optimize-prompt/status/${jobId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};