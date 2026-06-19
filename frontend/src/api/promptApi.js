import api from "./axios";


export const optimizeTheoryInstructions = async (payload) => {
  const { data } = await api.post("/prompt/optimize-prompt", payload);
  return data; 
};


export const checkPromptOptimizationStatus = async (jobId) => {
  const { data } = await api.get(`/prompt/optimize-prompt/status/${jobId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};