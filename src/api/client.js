// src/api/client.js
import axios from "axios";
import { getToken, clearToken } from "../utils/token";

// У деві базовий шлях = '/' (проксі), у проді — домен
const baseURL = import.meta.env.DEV ? "/" : "https://fintechbackend.online";
console.log("API baseURL =", baseURL);

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const s = err?.response?.status;
    if (s === 401) {
      clearToken();
    }
    return Promise.reject(err);
  }
);

export default api;
