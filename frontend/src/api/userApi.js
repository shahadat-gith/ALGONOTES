import axiosInstance from "./axiosInstance";

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.put("/users/profile", payload);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await axiosInstance.delete("/users/account");
  return data;
};

export const searchWorkspace = async (query) => {
  const { data } = await axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`);
  return data;
};

export const getDashboardMetrics = async () => {
  const { data } = await axiosInstance.get("/users/dashboard-metrics");
  return data;
};