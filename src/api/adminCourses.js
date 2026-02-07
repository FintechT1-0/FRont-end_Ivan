import client from "./client";

function toNumberOrUndef(v) {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeNullableString(v) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}
export async function listCourses(params = {}) {
  const {
    page = 1,
    pageSize = 50,
    page_size,
    isPublished,
    category,
    title,
    tags,
  } = params;

  const query = {
    page: Number(page) || 1,
    page_size: Number(page_size ?? pageSize) || 50,
  };

  if (typeof isPublished === "boolean") query.isPublished = isPublished;
  if (category) query.category = category;
  if (title) query.title = title;
  if (Array.isArray(tags) && tags.length) query.tags = tags;

  const { data } = await client.get("/courses/", { params: query });
  return data;
}

export async function getCourse(id) {
  const { data } = await client.get(`/courses/${id}`);
  return data;
}

export async function createCourse(payload = {}) {
  const clean = {
    title_ua: normalizeNullableString(payload.title_ua),
    title_en: normalizeNullableString(payload.title_en),
    description_ua: normalizeNullableString(payload.description_ua),
    description_en: normalizeNullableString(payload.description_en),
    category: normalizeNullableString(payload.category),
    durationText: normalizeNullableString(payload.durationText),
    link: normalizeNullableString(payload.link),
    image: normalizeNullableString(payload.image),
    speaker: normalizeNullableString(payload.speaker),
    price: toNumberOrUndef(payload.price) ?? 0,
    isPublished: Boolean(payload.isPublished),
    isArchived: Boolean(payload.isArchived),
    tags: Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : payload.tags,
  };

  const { data } = await client.post("/courses/", clean);
  return data;
}

export async function updateCourse(id, payload = {}) {
  const clean = {};

  if ("title_ua" in payload) clean.title_ua = normalizeNullableString(payload.title_ua);
  if ("title_en" in payload) clean.title_en = normalizeNullableString(payload.title_en);
  if ("description_ua" in payload)
    clean.description_ua = normalizeNullableString(payload.description_ua);
  if ("description_en" in payload)
    clean.description_en = normalizeNullableString(payload.description_en);
  if ("category" in payload) clean.category = normalizeNullableString(payload.category);
  if ("durationText" in payload)
    clean.durationText = normalizeNullableString(payload.durationText);
  if ("link" in payload) clean.link = normalizeNullableString(payload.link);
  if ("image" in payload) clean.image = normalizeNullableString(payload.image);
  if ("speaker" in payload) clean.speaker = normalizeNullableString(payload.speaker);

  if ("price" in payload) clean.price = toNumberOrUndef(payload.price) ?? 0;
  if ("isPublished" in payload) clean.isPublished = Boolean(payload.isPublished);
  if ("isArchived" in payload) clean.isArchived = Boolean(payload.isArchived);
  if ("tags" in payload)
    clean.tags = Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : payload.tags;

  const { data } = await client.patch(`/courses/${id}`, clean);
  return data;
}

export async function deleteCourse(id) {
  const { data } = await client.delete(`/courses/${id}`);
  return data;
}