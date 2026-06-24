import api from "./axios";

export const getLeetCodeProfile = async () => {
  const { data } = await api.get("/leetcode/profile");
  return data;
};
