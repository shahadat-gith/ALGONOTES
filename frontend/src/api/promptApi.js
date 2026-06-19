import api from "./axios";

export const optimizeTheoryInstructions = async (payload) => {
  const requestBody = {
    ...payload,
    language: payload.language ?? payload.code_language ?? null,
  };

  delete requestBody.code_language;

  const { data } = await api.post("/prompt/optimize-prompt", requestBody);
  return data; 
};

export const checkPromptOptimizationStatus = async (jobId) => {

  const { data } = await api.get(`/prompt/optimize-prompt/status/${jobId}`);
  return data;
};