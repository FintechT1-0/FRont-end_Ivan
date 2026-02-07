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

export async function getCourses(params = {}) {
  const {
    tags,
    title,
    description,
    category,
    durationText,
    priceMin,
    priceMax,
    price_min,
    price_max,
    isPublished,
    page = 1,
    pageSize = 20,
    page_size,
  } = params;

  const query = {};

  if (title) query.title = title;
  if (description) query.description = description;
  if (category) query.category = category;
  if (durationText) query.durationText = durationText;

  const min = toNumberOrUndef(priceMin ?? price_min);
  const max = toNumberOrUndef(priceMax ?? price_max);
  if (typeof min === "number") query.price_min = min;
  if (typeof max === "number") query.price_max = max;

  if (typeof isPublished === "boolean") query.isPublished = isPublished;

  if (Array.isArray(tags) && tags.length) {
    // FastAPI: repeated query params ?tags=a&tags=b
    // axios зазвичай ок, якщо бекенд приймає tags як array
    query.tags = tags;
  }

  query.page = Number(page) || 1;
  query.page_size = Number(page_size ?? pageSize) || 20;

  const { data } = await client.get("/courses/", { params: query });
  return data;
}

export async function getCourseById(id) {
  const { data } = await client.get(`/courses/${id}`);
  return data;
}

export async function createCourse(payload = {}) {
  const clean = {
    ...payload,
    title_ua: normalizeNullableString(payload.title_ua),
    title_en: normalizeNullableString(payload.title_en),
    description_ua: normalizeNullableString(payload.description_ua),
    description_en: normalizeNullableString(payload.description_en),
    category: normalizeNullableString(payload.category),
    durationText: normalizeNullableString(payload.durationText),
    link: normalizeNullableString(payload.link),
    speaker: normalizeNullableString(payload.speaker),
    image: normalizeNullableString(payload.image),
    // price: тільки число або 0
    price: toNumberOrUndef(payload.price) ?? 0,
    // tags: якщо порожній масив — краще не слати (або слати [])
    tags: Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : payload.tags,
  };

  const { data } = await client.post("/courses/", clean);
  return data;
}

export async function updateCourse(id, payload = {}) {
  const clean = {
    ...payload,
    ...(payload.title_ua !== undefined && { title_ua: normalizeNullableString(payload.title_ua) }),
    ...(payload.title_en !== undefined && { title_en: normalizeNullableString(payload.title_en) }),
    ...(payload.description_ua !== undefined && {
      description_ua: normalizeNullableString(payload.description_ua),
    }),
    ...(payload.description_en !== undefined && {
      description_en: normalizeNullableString(payload.description_en),
    }),
    ...(payload.category !== undefined && { category: normalizeNullableString(payload.category) }),
    ...(payload.durationText !== undefined && { durationText: normalizeNullableString(payload.durationText) }),
    ...(payload.link !== undefined && { link: normalizeNullableString(payload.link) }),
    ...(payload.speaker !== undefined && { speaker: normalizeNullableString(payload.speaker) }),
    ...(payload.image !== undefined && { image: normalizeNullableString(payload.image) }),
  };

  if (payload.price !== undefined) {
    clean.price = toNumberOrUndef(payload.price) ?? 0;
  }

  if (payload.tags !== undefined) {
    clean.tags = Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : payload.tags;
  }

  const { data } = await client.patch(`/courses/${id}`, clean);
  return data;
}

export async function deleteCourse(id) {
  const { data } = await client.delete(`/courses/${id}`);
  return data;
}