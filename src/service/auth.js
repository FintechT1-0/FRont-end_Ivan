// src/service/auth.js
import api from "../api/client";
import { setToken, clearToken } from "../utils/token";

/**
 * POST /auth/register
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<any>} server data
 */
export async function register(payload) {
  try {
    const { data } = await api.post("/auth/register", payload);
    // Реєстрація в MVP: після успіху токен не обов’язковий — редіректимо на /login у компоненті
    return data;
  } catch (error) {
    // Обов’язкове логування для дебагу
    console.log("REGISTER_ERROR:", error?.response?.data || error.message);
    throw error;
  }
}

/**
 * POST /auth/login
 * Зберігає токен та експірацію у LocalStorage через utils/token
 * @returns {Promise<any>} server data
 */
export async function login(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });

    // Очікуємо { token, exp, user } — але підстрахуємось під інші назви, якщо бекенд віддає інакше
    const token =
      data?.token || data?.accessToken || data?.jwt || data?.access_token;

    // exp: seconds from now або unix-час у секундах — залишаємо як є, утиліта прийме seconds
    const expSeconds =
      data?.exp ?? data?.expiresIn ?? data?.expires_in ?? null;

    if (token) {
      setToken(token, expSeconds);
    }

    return data;
  } catch (error) {
    console.log("LOGIN_ERROR:", error?.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /auth/me
 * @returns {Promise<any>} user payload or {user}
 */
export async function me() {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error) {
    console.log("ME_ERROR:", error?.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /auth/checkEmail?email=...
 * @returns {Promise<any>} server data (наприклад {available: boolean})
 */
export async function checkEmail(email) {
  try {
    const { data } = await api.get("/auth/checkEmail", {
      params: { email },
    });
    return data;
  } catch (error) {
    console.log("CHECK_EMAIL_ERROR:", error?.response?.data || error.message);
    throw error;
  }
}

/**
 * Хелпер для явного логауту (очищає токен локально)
 */
export function logoutLocal() {
  clearToken();
}
