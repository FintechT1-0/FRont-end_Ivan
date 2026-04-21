import client from "./client";

export async function loginUser(payload) {
  const { data } = await client.post("/auth/login", payload);
  return data;
}

export async function registerUser(payload) {
  const { data } = await client.post("/auth/register", payload);
  return data;
}

export async function resendVerification(payload) {
  const { data } = await client.post("/auth/resend", payload);
  return data;
}