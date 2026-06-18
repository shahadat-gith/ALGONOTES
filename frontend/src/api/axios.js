import axios from "axios";

// Dynamically select environment targets
const backendUrl = import.meta.env.DEV 
  ? import.meta.env.VITE_BACKEND_URL_DEV 
  : import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl // Fixed: passed backendUrl here instead of the hardcoded env variable
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