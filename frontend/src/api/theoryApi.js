import api from "./axios";

export const generateTheoryNote = async (payload) => {
  const { data } = await api.post("/theory/generate", payload);
  return data;
};

export const checkTheoryStatus = async (theoryId) => {
 
  const { data } = await api.get(`/theory/status/${theoryId}`);

  return data;
};

export const uploadTheoryImage = async (theoryId, fileObject) => {
  const formData = new FormData();
  formData.append("file", fileObject);

  const { data } = await api.post(`/theory/${theoryId}/upload-image`, formData);
  return data;
};

export const deleteTheoryImage = async (theoryId, imageUrl) => {
  const { data } = await api.post(`/theory/${theoryId}/delete-image`, {
    image_url: imageUrl,
  });
  return data;
};

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

export const getTheoryNote = async (theoryId) => {
  const { data } = await api.get(`/theory/${theoryId}`);
  return data;
};

export const updateTheoryNote = async (theoryId, payload) => {
  const { data } = await api.put(`/theory/${theoryId}`, payload);
  return data;
};

export const deleteTheoryNote = async (theoryId) => {
  const { data } = await api.delete(`/theory/${theoryId}`);
  return data;
};