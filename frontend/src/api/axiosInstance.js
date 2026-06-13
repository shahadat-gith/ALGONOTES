import axios from "axios";

const backendUrl = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_BACKEND_URL_DEV : import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: backendUrl
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;