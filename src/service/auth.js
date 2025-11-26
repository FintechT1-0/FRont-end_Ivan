import api from "../api/client.js"

export async function checkEmail(email) {
  const { data } = await api.post("/auth/checkEmail", { email })
  return data
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload)
  return data
}

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password })
  return data
}

export async function me() {
  const { data } = await api.get("/auth/me")
  return data
}
