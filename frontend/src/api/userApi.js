import api from "./axios";

export const getCurrentUser = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/users/profile", payload);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete("/users/account");
  return data;
};

export const searchWorkspace = async (query) => {
  const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
  return data;
};

