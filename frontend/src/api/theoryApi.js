import api from "./axios";

/**
 * Initializes a new theoretical study note compilation job and pushes the metadata matrix to SQS.
 * @param {Object} payload - Contains { topic, code_language, instructions }
 * @returns {Promise<Object>} Server response: { success: true, id: "...", message: "..." }
 */
export const generateTheoryNote = async (payload) => {
  const { data } = await api.post("/theory/generate", payload);
  return data;
};

/**
 * Polls the backend background execution processing pipeline status for a specific theory note.
 * Accepts HTTP 202 status natively to handle active creation tracking safely without throwing exceptions.
 * @param {string} theoryId - Unique database hash key string of the requested theory record.
 * @returns {Promise<Object>} Status payload mapping: { success: true, status: "processing" | "draft" | "failed" }
 */
export const checkTheoryStatus = async (theoryId) => {
  const { data } = await api.get(`/theory/status/${theoryId}`, {
    validateStatus: (status) =>
      (status >= 200 && status < 300) || status === 202,
  });
  return data;
};

/**
 * Streams a local media file directly to your workspace backend to save it in Cloudinary remote buckets.
 * @param {string} theoryId - The owner workspace container theory index hash.
 * @param {File} fileObject - HTML5 File handler object from custom file pickers.
 * @returns {Promise<Object>} Content mapping response: { success: true, imageUrl: "..." }
 */
export const uploadTheoryImage = async (theoryId, fileObject) => {
  const formData = new FormData();
  formData.append("file", fileObject);

  const { data } = await api.post(
    `/theory/${theoryId}/upload-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
};

/**
 * Removes a targeted image asset reference straight out of remote Cloudinary infrastructure storage buckets.
 * @param {string} theoryId - The owner identifier string.
 * @param {string} imageUrl - Fully qualified remote secure asset destination URL string.
 * @returns {Promise<Object>} Purge confirmation status response block.
 */
export const deleteTheoryImage = async (theoryId, imageUrl) => {
  const { data } = await api.post(`/theory/${theoryId}/delete-image`, {
    image_url: imageUrl,
  });
  return data;
};

/**
 * Fetches a paginated, search-filtered list of theoretical summary resources belonging to the profile.
 * @param {number} [page=1] - Active paginated dashboard index viewing frame.
 * @param {number} [size=10] - Number of entities pulled from MongoDB storage records.
 * @param {string} [search=""] - Raw text term used to index against topic matching strings or code notes.
 * @returns {Promise<Object>} Paginated array map along with dynamic pagination bounding flags.
 */
export const getAllTheoriesByUser = async (
  page = 1,
  size = 10,
  search = "",
) => {
  const { data } = await api.get("/theory/user", {
    params: {
      page,
      size,
      search: search.trim() || undefined,
    },
  });
  return data;
};

/**
 * Queries structural database entries to grab full theoretical article string schemas.
 * @param {string} theoryId - The core targeting document index token wrapper string.
 * @returns {Promise<Object>} Complete payload wrapper mapping containing your markdown texts.
 */
export const getTheoryNote = async (theoryId) => {
  const { data } = await api.get(`/theory/${theoryId}`, {
    validateStatus: (status) =>
      (status >= 200 && status < 300) || status === 202,
  });
  return data;
};

/**
 * Commits textual modification rewrites or structural phase transitions directly down to storage collections.
 * @param {string} theoryId - Target entity identifier token array index hash.
 * @param {Object} payload - Properties tracking revised text structures.
 * @returns {Promise<Object>} Response schema context validation object.
 */
export const updateTheoryNote = async (theoryId, payload) => {
  const { data } = await api.put(`/theory/${theoryId}`, payload);
  return data;
};

/**
 * Completely purges a theory node instance and recursively drops its image dependencies.
 * @param {string} theoryId - Target asset index hash string keys.
 * @returns {Promise<Object>} Server resolution status payload mapping context.
 */
export const deleteTheoryNote = async (theoryId) => {
  const { data } = await api.delete(`/theory/${theoryId}`);
  return data;
};

