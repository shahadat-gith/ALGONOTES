import api from "./axios";

export const generateAiNote = async (payload) => {
  const { data } = await api.post("/notes/generate", payload);
  return data;
};

export const checkNoteStatus = async (noteId) => {

  const { data } = await api.get(`/notes/status/${noteId}`);

  return data;
};

export const getNoteById = async (noteId) => {
  const { data } = await api.get(`/notes/${noteId}`);
  return data;
};

export const updateNote = async (noteId, payload) => {
  const { data } = await api.put(`/notes/${noteId}`, payload);
  return data;
};

export const getAllNotesByUser = async (page = 1, size = 10, search = "") => {
  const { data } = await api.get("/notes/user", {
    params: { 
      page, 
      size,
      search: search.trim() || undefined 
    }
  });
  return data;
};

export const deleteNote = async (noteId) => {
  const { data } = await api.delete(`/notes/${noteId}`);
  return data;
};