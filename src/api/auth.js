import client from "./client";

export async function register({ name, surname, email, password }) {
  const { data } = await client.post("/auth/register", {
    name,
    surname,
    email,
    password,
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await client.post("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function me() {
  const { data } = await client.get("/auth/me");
  return data;
}