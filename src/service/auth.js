import api from "../api/client";

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function register(body) {
  const { data } = await api.post("/auth/register", body);
  return data;
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function checkEmail(email) {
  const { data } = await api.post("/auth/checkEmail", { email });
  return data;
}
