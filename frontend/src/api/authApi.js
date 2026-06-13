import axiosInstance from "./axiosInstance";

export const registerUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/login",payload);
  return data;
};


export const verifyUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/verify",payload);
  return data;
};

export const forgotPassword = async (payload) => {
  const { data } = await axiosInstance.post("/auth/forgot-password",payload);
  return data;
};

