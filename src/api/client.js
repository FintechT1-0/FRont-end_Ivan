import axios from "axios";
import { getToken, clearToken, isExpired } from "../utils/token";

// Sprint 2: чітко вимагають цей домен
const baseURL = "https://fintechbackend.online";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  // якщо токен прострочений — одразу до логіну
  if (isExpired()) {
    clearToken();
    if (typeof window !== "undefined" && location.pathname !== "/login") {
      window.location.assign("/login");
    }
    // кидати помилку не будемо — нехай запит не піде
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
      // уніфікований: редірект на логін
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
      return;
    }
    if (status === 401) {
      // уніфікований: чистимо токен і на логін
      clearToken();
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
      return;
    }
    return Promise.reject(err);
  }
);

export default api;
