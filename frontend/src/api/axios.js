import axios from "axios";


const backendUrl = import.meta.env.DEV 
  ? import.meta.env.VITE_DEV_BACKEND_URL 
  : import.meta.env.VITE_PROD_BACKEND_URL ;

const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;