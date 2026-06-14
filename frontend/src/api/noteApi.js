import axiosInstance from "./axiosInstance";

// ==========================================
// NOTES MANAGEMENT API
// ==========================================

export const getNoteById = async (noteId) => {
  const { data } = await axiosInstance.get(`/notes/${noteId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};

export const updateNote = async (noteId, payload) => {
  const { data } = await axiosInstance.put(`/notes/${noteId}`, payload);
  return data;
};

export const getAllNotesByUser = async (page = 1, size = 10) => {
  const { data } = await axiosInstance.get("/notes/user", {
    params: { page, size }
  });
  return data;
};

export const deleteNote = async (noteId) => {
  const { data } = await axiosInstance.delete(`/notes/${noteId}`);
  return data;
};

