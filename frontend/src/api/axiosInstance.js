import axios from "axios";

const axiosInstance = axios.create({
  // 🌟 Appended /v1 to match your FastAPI router prefix configuration cleanly
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1",
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