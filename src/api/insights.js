import client from "./client";

export async function getInsightsEn() {
  const { data } = await client.get("/insights/en");
  return data;
}

export async function getInsightsUa() {
  const { data } = await client.get("/insights/ua");
  return data;
}

export async function getInsights(lang = "en") {
  return lang === "ua" ? getInsightsUa() : getInsightsEn();
}

const insightsApi = {
  getInsights,
  getInsightsEn,
  getInsightsUa,
};

export default insightsApi;