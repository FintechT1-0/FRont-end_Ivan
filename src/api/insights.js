import client from "./client";

export async function getInsightsUa() {
  const { data } = await client.get("/insights/ua");
  return data;
}

export async function getInsightsEn() {
  const { data } = await client.get("/insights/en");
  return data;
}

export async function getInsights(lang = "ua") {
  return lang === "en" ? getInsightsEn() : getInsightsUa();
}
