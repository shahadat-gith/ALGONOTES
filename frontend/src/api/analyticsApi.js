import api from "./axios";


export const getAnalyticsStats = async () => {
  const { data } = await api.get("/analytics/stats");
  return data;
};


export const trackPageVisit = async () => {
  const { data } = await api.post("/analytics/visits");
  return data;
};