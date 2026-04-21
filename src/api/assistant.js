import client from "./client";

export async function promptAssistant({ prompt, lang }) {

  const payload = {

    prompt: String(prompt || "").trim(),

    lang: lang === "ua" ? "UA" : "EN",

  };

  const { data } = await client.post("/assistant/", payload);

  return data;

}