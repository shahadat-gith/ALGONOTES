import axios from "axios";

const backendType = "fastapi";

const productionUrls = {
  fastapi: import.meta.env.VITE_FASTAPI_URL,
  express: import.meta.env.VITE_EXPRESS_URL,
};

const backendUrl = import.meta.env.DEV 
  ? import.meta.env.VITE_DEV_BACKEND_URL 
  : productionUrls[backendType];

const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;