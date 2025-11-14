import axios from "axios";
import { getToken, clearToken, isExpired } from "../utils/token";

const baseURL = "https://fintechbackend.online";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (isExpired()) {
    clearToken();
    if (typeof window !== "undefined" && location.pathname !== "/login") {
      window.location.assign("/login");
    }
    return Promise.reject(new axios.Cancel("token expired"));
  }
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 403) {
      if (typeof window !== "undefined") window.location.assign("/login");
      return;
    }
    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined") window.location.assign("/login");
      return;
    }
    return Promise.reject(err);
  }
);

export default api;
