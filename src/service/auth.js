import api from "../api/client";

export async function register(payload) {
  // { firstName, lastName, email, password }
  const { data } = await api.post("/auth/register", payload);
  // очікуємо 201 { user: {...} } або 409 { message: "Email already in use" }
  return data;
}

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  // нормалізація різних беків
  const token = data?.token || data?.access_token || data?.jwt || null;
  const user  = data?.user  || data?.data?.user   || null;
  return { token, user };
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data?.user ?? data ?? null;
}

export async function checkEmail(email) {
  const { data } = await api.get("/auth/checkEmail", { params: { email } });
  // очікуємо щось типу { exists: boolean }
  return data;
}
