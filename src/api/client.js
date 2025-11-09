import axios from "axios";

// базова адреса — підстав свою (наприклад, http://localhost:3000)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// додаємо JWT у всі запити, якщо він є
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 403 => автоматичний логаут
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 403) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("finu_user");
      // можна додати тост тут
      window.location.assign("/login"); // редірект на сторінку логіну
      return; // важливо: перервати ланцюжок
    }
    return Promise.reject(err);
  }
);

export default api;
