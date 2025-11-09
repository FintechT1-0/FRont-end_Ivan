import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 403) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("finu_user");
      window.location.assign("/login");
      return;
    }
    return Promise.reject(err);
  }
);

export default api;
