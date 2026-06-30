import axios from "axios";

const backendUrl = import.meta.env.DEV 
  ? import.meta.env.VITE_DEV_BACKEND_URL 
  : import.meta.env.VITE_PROD_BACKEND_URL ;

const api = axios.create({
  baseURL: backendUrl,
});


api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("admin-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


const adminApi = {
  login: async (email, password) => {
    const { data } = await api.post("/admin/login", { email, password });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get("/admin/stats");
    return data;
  },

  getUsers: async (page = 1, pageSize = 20, search = "") => {
    const params = { page, pageSize };
    if (search) params.search = search;
    const { data } = await api.get("/admin/users", {
      params,
    });
    return data;
  },

  getLogs: async (page = 1, pageSize = 50, method = "", statusCode = "") => {
    const params = { page, pageSize };
    if (method) params.method = method;
    if (statusCode) params.status_code = statusCode;
    const { data } = await api.get("/admin/logs", {
      params,
    });
    return data;
  },

  getNotes: async (page = 1, pageSize = 20, status = "") => {
    const params = { page, pageSize };
    if (status) params.status = status;
    const { data } = await api.get("/admin/notes", {
      params,
    });
    return data;
  },

  getTheories: async (page = 1, pageSize = 20, status = "") => {
    const params = { page, pageSize };
    if (status) params.status = status;
    const { data } = await api.get("/admin/theories", {
      params,
    });
    return data;
  },
};

export default adminApi;
