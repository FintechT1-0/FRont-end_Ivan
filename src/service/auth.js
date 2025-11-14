// src/service/auth.js
import api from "../api/client";
import { setToken, clearToken } from "../utils/token";

// УВАГА: лише відносні шляхи `/auth/...` — НІЯКИХ повних URL тут!
export async function checkEmail(email) {
  try {
    const { data } = await api.post("/auth/checkEmail", { email });
    return data; // { exists: boolean }
  } catch (e) {
    console.log("CHECK_EMAIL_ERROR:", e?.response?.data || e.message);
    throw e;
  }
}

export async function register({ name, surname, email, password }) {
  try {
    const { data } = await api.post("/auth/register", {
      name, surname, email, password
    });
    return data;
  } catch (e) {
    console.log("REGISTER_ERROR:", e?.response?.data || e.message);
    throw e;
  }
}

export async function login(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    const token =
      data?.token || data?.access_token || data?.accessToken || data?.jwt;
    const exp   =
      data?.exp || data?.expiresIn || data?.expires_in || 24 * 60 * 60;
    if (token) setToken(token, exp);
    return { token, user: data?.user ?? null };
  } catch (e) {
    console.log("LOGIN_ERROR:", e?.response?.data || e.message);
    throw e;
  }
}

export async function me() {
  try {
    const { data } = await api.get("/auth/me");
    return data?.user ?? data ?? null;
  } catch (e) {
    console.log("ME_ERROR:", e?.response?.data || e.message);
    throw e;
  }
}

export function logoutLocal() {
  clearToken();
}
