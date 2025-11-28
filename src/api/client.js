import axios from "axios";
import { getToken, clearToken } from "../utils/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearToken();
      if (location.pathname !== "/login") location.replace("/login");
    }
    if (status === 403) {
      if (location.pathname !== "/login") location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
