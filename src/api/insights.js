import client from "./client";

function authHeaders() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getInsightsUa() {
  const { data } = await client.get("/insights/ua", {
    headers: authHeaders(),
  });
  return data;
}

export async function getInsightsEn() {
  const { data } = await client.get("/insights/en", {
    headers: authHeaders(),
  });
  return data;
}

export async function getInsights(lang = "ua") {
  return lang === "en" ? getInsightsEn() : getInsightsUa();
}