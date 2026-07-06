import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_INTERVIEW_PREP_URL || "",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// Applications
// ============================

export const createApplication = async (formData) => {
  const { data } = await api.post("/api/applications", formData);
  return data;
};

export const getApplications = async () => {
  const { data } = await api.get("/api/applications");
  return data;
};

export const getApplication = async (applicationId) => {
  const { data } = await api.get(`/api/applications/${applicationId}`);
  return data;
};

export const getApplicationStatus = async (applicationId) => {
  const { data } = await api.get(
    `/api/applications/${applicationId}/status`
  );
  return data;
};

export const deleteApplication = async (applicationId) => {
  const { data } = await api.delete(`/api/applications/${applicationId}`);
  return data;
};

// ============================
// Topics
// ============================

export const getTopic = async (topicId) => {
  const { data } = await api.get(`/api/topics/topic/${topicId}`);
  return data;
};

// ============================
// Explanations
// ============================

export const requestExplanation = async (topicId, codeLanguage) => {
  const { data } = await api.post(
    `/api/topics/explanation/${topicId}`,
    { codeLanguage }
  );

  return data;
};

export const getExplanation = async (topicId) => {
  const { data } = await api.get(
    `/api/topics/explanation/${topicId}`
  );

  return data;
};

export const getExplanationStatus = async (topicId) => {
  const { data } = await api.get(
    `/api/topics/explanation/status/${topicId}`
  );

  return data;
};

export const deleteExplanation = async (topicId) => {
  const { data } = await api.delete(
    `/api/topics/explanation/${topicId}`
  );

  return data;
};

// ============================
// CHAT
// ============================

export const getChatMessages = async (topicId) => {
  const { data } = await api.get(`/api/chat/${topicId}`);
  return data;
};

export const sendChatMessage = async (topicId, message) => {
  const { data } = await api.post(`/api/chat/${topicId}`, { message });
  return data;
};
