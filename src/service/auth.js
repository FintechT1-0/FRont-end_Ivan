import api from "../api/client";

export async function register(payload) {
  // Бек може очікувати snake_case → шлемо обидва варіанти ключів
  const body = {
    ...payload,
    first_name: payload.first_name ?? payload.firstName,
    last_name:  payload.last_name  ?? payload.lastName,
  };
  const { data } = await api.post("/auth/register", body);
  return data; // очікуємо 201 { user: {...} } або 409 { message }
}

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
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
  return data; // { exists: boolean } – залежить від бекенду
}
