// src/api/client.js
import axios from "axios";
import { getToken, clearToken, isExpired } from "../utils/token";

const baseURL = import.meta.env.VITE_API_BASE; // одна точка правди
console.log("VITE_API_BASE =", baseURL);       // тимчасовий лог для перевірки

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  // якщо токен протух — чистимо і не шлемо запит
  if (isExpired()) {
    clearToken();
    return Promise.reject(new axios.Cancel("token expired"));
  }
  // додаємо токен у всі приватні запити
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;

  // діагностика: що саме відправляємо
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

    // діагностика відповіді
    try {
      console.log(
        "API ⨯",
        err?.config?.url,
        status,
        err?.response?.data || err.message
      );
    } catch (_) {}

    // універсальна обробка 401/403
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
