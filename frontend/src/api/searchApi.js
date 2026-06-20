import api from "./axios";

export const globalSearch = async (query) => {
  const { data } = await api.get("/search/global", {
    params: { q: query.trim() || undefined },
  });
  return data;
};
