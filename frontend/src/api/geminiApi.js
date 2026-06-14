import axiosInstance from "./axiosInstance";



export const generateAiNote = async (payload) => {
  const { data } = await axiosInstance.post("/ai/generate", payload);
  return data;
};

export const checkNoteStatus = async (noteId) => {
  const { data } = await axiosInstance.get(`/ai/status/${noteId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};