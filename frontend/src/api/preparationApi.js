import axios from "axios";

const PREP_BASE = import.meta.env.VITE_PREPARATION_URL || "";
const api = axios.create({
  baseURL: PREP_BASE,
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
// APPLICATIONS
// ============================

export const createApplication = async (formData) => {
  const { data } = await api.post("/api/applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
  const { data } = await api.get(`/api/applications/${applicationId}/status`);
  return data;
};

// Normalizer for useBackoffPolling — maps "ready" → "completed"
export const checkApplicationStatusForPolling = async (applicationId) => {
  const res = await getApplicationStatus(applicationId);
  if (!res?.success) return { success: false, message: res?.message || "Failed" };
  const status = res.data?.status;
  const map = { ready: "completed", processing: "processing", failed: "failed" };
  return { status: map[status] || status, ...res.data };
};

export const deleteApplication = async (applicationId) => {
  const { data } = await api.delete(`/api/applications/${applicationId}`);
  return data;
};

// ============================
// TOPICS
// ============================

export const getTopicsByApplication = async (applicationId) => {
  const { data } = await api.get(`/api/topics/application/${applicationId}`);
  return data;
};

export const getTopic = async (topicId) => {
  const { data } = await api.get(`/api/topics/${topicId}`);
  return data;
};

export const generateDiscussion = async (topicId) => {
  const { data } = await api.post(`/api/topics/${topicId}/generate`);
  return data;
};

export const getDiscussionStatus = async (topicId) => {
  const { data } = await api.get(`/api/topics/${topicId}/discussion`);
  return data;
};

// Normalizer for useBackoffPolling — maps "ready" → "completed"
export const checkDiscussionStatusForPolling = async (topicId) => {
  const res = await getDiscussionStatus(topicId);
  if (!res?.success) return { success: false, message: res?.failureReason || "Failed" };
  const map = { ready: "completed", processing: "processing", pending: "pending", failed: "failed" };
  return { status: map[res.status] || res.status, ...res };
};

export const markTopicComplete = async (topicId) => {
  const { data } = await api.patch(`/api/topics/${topicId}/complete`);
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
