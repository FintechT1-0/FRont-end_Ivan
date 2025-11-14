// src/api/client.js
import axios from "axios";
import { getToken, clearToken, isExpired } from "../utils/token";

const baseURL = import.meta.env.VITE_API_BASE || '/';
console.log("VITE_API_BASE =", baseURL);

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const t = getToken();

  // якщо токен є, але прострочений — чистимо й не додаємо його
  if (t && isExpired()) {
    clearToken();
  } else if (t) {
    // валідний токен — додаємо в заголовок
    config.headers.Authorization = `Bearer ${t}`;
  }

  try {
    console.log(
      "API →",
      (config.method || "GET").toUpperCase(),
      (config.baseURL || "") + (config.url || "")
    );
  } catch (_) {}

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    try {
      console.log(
        "API ⨯",
        err?.config?.url,
        status,
        err?.response?.data || err.message
      );
    } catch (_) {}

    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined") window.location.assign("/login");
    }
    if (status === 403) {
      if (typeof window !== "undefined") window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
