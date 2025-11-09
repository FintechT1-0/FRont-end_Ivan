import api from "../api/client";

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // очікуємо { token, user }
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data; // очікуємо { user } або сам user-об'єкт
}
