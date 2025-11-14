// src/service/auth.js
import api from "../api/client";

/**
 * Логін користувача.
 * ВАЖЛИВО: відправляємо РІВНО { email, password }.
 * Повертаємо нормалізований об'єкт { token, user }.
 */
export async function login(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });

    // нормалізація на випадок різних назв полів на бекенді
    const token =
      data?.token ||
      data?.access_token ||
      data?.jwt ||
      data?.data?.token ||
      null;

    const user =
      data?.user ||
      data?.data?.user ||
      null;

    return { token, user };
  } catch (error) {
    // логування помилки (прохання Марини)
    console.log("LOGIN_ERROR:", error?.response?.data || error.message);
    throw error;
  }
}

/**
 * Реєстрація користувача.
 * Бек зазвичай очікує snake_case; дублюємо first_name/last_name.
 */
export async function register(payload) {
  try {
    const body = {
      email: payload.email,
      password: payload.password,
      first_name: payload.first_name ?? payload.firstName,
      last_name:  payload.last_name  ?? payload.lastName,
    };

    const { data } = await api.post("/auth/register", body);
    return data;
  } catch (error) {
    console.log("REGISTER_ERROR:", error?.response?.data || error.message);
    throw error;
  }
}

/**
 * Поточний користувач (перевірка сесії).
 * Повертаємо або data.user, або data як є — залежно від бекенда.
 */
export async function me() {
  const { data } = await api.get("/auth/me");
  return data?.user ?? data ?? null;
}

/**
 * Перевірка зайнятості email (якщо ендпойнт доступний).
 */
export async function checkEmail(email) {
  const { data } = await api.get("/auth/checkEmail", { params: { email } });
  return data;
}
