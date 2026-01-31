import client from "./client";

export async function checkEmail(email) {
  const { data } = await client.post("/auth/checkEmail", { email });
  return data;
}

export async function register({ name, surname, email, password, admin_password }) {
  const payload = { name, surname, email, password };
  if (admin_password) payload.admin_password = admin_password;

  const { data } = await client.post("/auth/register", payload);
  return data;
}

export async function login({ email, password }) {
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

export async function me() {
  const { data } = await client.get("/auth/me");
  return data;
}