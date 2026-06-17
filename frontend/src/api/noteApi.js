// /src/api/noteApi.js

import api from "./axios";

/**
 * Dispatches a payload to queue a fresh AI-generated coding note.
 * Target Backend: POST /api/v1/notes/generate
 */
export const generateAiNote = async (payload) => {
  const { data } = await api.post("/notes/generate", payload);
  return data;
};

/**
 * Polls the current processing status of an async note generation job.
 * Target Backend: GET /api/v1/notes/status/{noteId}
 */
export const checkNoteStatus = async (noteId) => {
  const { data } = await api.get(`/notes/status/${noteId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};

// ==========================================
// STANDARD CRUD OPERATIONS
// ==========================================

/**
 * Fetches a fully completed coding note document by its ID.
 * Target Backend: GET /api/v1/notes/{noteId}
 */
export const getNoteById = async (noteId) => {
  const { data } = await api.get(`/notes/${noteId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};

/**
 * Updates a coding note document via partial patch payloads.
 * Target Backend: PUT /api/v1/notes/{noteId}
 */
export const updateNote = async (noteId, payload) => {
  const { data } = await api.put(`/notes/${noteId}`, payload);
  return data;
};

/**
 * Pulls a paginated, searchable collection of notes owned by the current user.
 * Target Backend: GET /api/v1/notes/user
 */
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

/**
 * Permanently deletes a specific note document.
 * Target Backend: DELETE /api/v1/notes/{noteId}
 */
export const deleteNote = async (noteId) => {
  const { data } = await api.delete(`/notes/${noteId}`);
  return data;
};