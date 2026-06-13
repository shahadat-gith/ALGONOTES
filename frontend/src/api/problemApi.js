import axiosInstance from "./axiosInstance";

export const createProblem = async (payload) => {
  const { data } = await axiosInstance.post("/problems", payload);
  return data;
};

export const getAllProblems = async () => {
  const { data } = await axiosInstance.get("/problems");
  return data;
};


export const getProblemStats = async () => {
  const { data } = await axiosInstance.get("/problems/stats");
  return data;
};

export const getProblemById = async (id) => {
  const { data } = await axiosInstance.get(`/problems/${id}`);
  return data;
};

export const updateProblem = async (id, payload) => {
  const { data } = await axiosInstance.put(`/problems/${id}`, payload);
  return data;
};

export const deleteProblem = async (id) => {
  const { data } = await axiosInstance.delete(`/problems/${id}`);
  return data;
};