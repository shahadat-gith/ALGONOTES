import api from "./axios";

/**
 * Initializes a new data structures and algorithms (DSA) study note record
 * and dispatches a generation worker task to the remote SQS background execution queue.
 * @param {Object} payload - Contains { problemLink, userCode, language, userNotes }
 * @returns {Promise<Object>} Server response payload: { success: true, id: "...", message: "..." }
 */
export const generateAiNote = async (payload) => {
  const { data } = await api.post("/notes/generate", payload);
  return data;
};

/**
 * Polls the background compilation workflow status of a specific DSA study note.
 * Intercepts 202 Accepted lifecycle criteria without triggering interceptor exception rejections.
 * @param {string} noteId - The unique identifier hash string of the target note entity.
 * @returns {Promise<Object>} Server status metadata mapping: { success: true, status: "processing" | "draft" | "failed" }
 */
export const checkNoteStatus = async (noteId) => {
  const { data } = await api.get(`/notes/status/${noteId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};

/**
 * Fetches the finalized structural property attributes and code examples of an individual note.
 * Retains 202 validation criteria in case the document properties are queried while processing.
 * @param {string} noteId - The unique identifier hash string of the targeted note.
 * @returns {Promise<Object>} Core note document properties block wrapper map.
 */
export const getNoteById = async (noteId) => {
  const { data } = await api.get(`/notes/${noteId}`, {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 202
  });
  return data;
};

/**
 * Modifies structural components, text updates, or status configurations of an existing study guide note.
 * @param {string} noteId - The target note identifier string.
 * @param {Object} payload - Object containing modified fields (e.g., content edits, status updates).
 * @returns {Promise<Object>} Server confirmation: { success: true, message: "..." }
 */
export const updateNote = async (noteId, payload) => {
  const { data } = await api.put(`/notes/${noteId}`, payload);
  return data;
};

/**
 * Retrieves a paginated list of all compiled or draft note summaries associated with the logged-in profile.
 * Supports active text query parameters to filter structural fields inside database clusters.
 * @param {number} [page=1] - Active page index number offset.
 * @param {number} [size=10] - Number of items to pull per page index layout block.
 * @param {string} [search=""] - Raw text query used to filter note topic title or block contents.
 * @returns {Promise<Object>} Paginated array results alongside standard structural pagination cursor meta objects.
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
 * Deletes a targeted note document straight from MongoDB and removes any associated cloud media folder structures.
 * @param {string} noteId - The identifier hash key of the document to pull out of existence.
 * @returns {Promise<Object>} Server response status confirmation mapping.
 */
export const deleteNote = async (noteId) => {
  const { data } = await api.delete(`/notes/${noteId}`);
  return data;
};