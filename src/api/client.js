import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3000" : undefined);

const api = axios.create({ baseURL });

function hardLogout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("finu_user");
  window.location.assign("/login");
}

// Додаємо Bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 403 → логаут. 401 (крім /auth/login) → логаут.
// 401 на /auth/login НЕ редіректить, щоб показати помилку на формі.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";

    if (status === 403) {
      hardLogout();
      return;
    }
    if (status === 401 && !url.includes("/auth/login")) {
      hardLogout();
      return;
    }
    return Promise.reject(err);
  }
);

export default api;
