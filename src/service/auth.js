import api from "../api/client";

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  // Нормалізуємо під різні бекенди:
  const token = data?.token || data?.access_token || data?.jwt || null;
  const user  = data?.user  || data?.data?.user   || null;
  return { token, user };
}

export async function me() {
  const { data } = await api.get("/auth/me");
  // Підтримуємо {user: {...}} або просто {...}
  return data?.user ?? data ?? null;
}
