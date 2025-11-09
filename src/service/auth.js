import api from "../api/client";

export async function login(email, password) {
  // очікуємо: { token: "...", user: { ... } } від бекенду
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

// перевірка активної сесії
export async function me() {
  const { data } = await api.get("/auth/me");
  return data; // очікуємо { user: {...} } або сам об'єкт користувача
}
