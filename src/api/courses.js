import client from "./client";

function toNumberOrUndef(value) {
  if (value === "" || value === null || value === undefined) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function normalizeOptionalString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const stringValue = String(value).trim();
  return stringValue === "" ? null : stringValue;
}

function normalizeRequiredString(value) {
  return String(value ?? "").trim();
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

  if (typeof isPublished === "boolean") {
    query.isPublished = isPublished;
  }

  if (Array.isArray(tags) && tags.length > 0) {
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
    title_ua: normalizeRequiredString(payload.title_ua),
    title_en: normalizeRequiredString(payload.title_en),
    description_ua: normalizeRequiredString(payload.description_ua),
    description_en: normalizeRequiredString(payload.description_en),
    category: normalizeRequiredString(payload.category),
    tags: Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : [],
    durationText: normalizeRequiredString(payload.durationText),
    price: toNumberOrUndef(payload.price) ?? 0,
    link: normalizeOptionalString(payload.link),
    speaker: normalizeOptionalString(payload.speaker),
    image: normalizeOptionalString(payload.image),
    isPublished: Boolean(payload.isPublished),
  };

  const { data } = await client.post("/courses/", clean);
  return data;
}

export async function updateCourse(id, payload = {}) {
  const clean = {};

  if (payload.title_ua !== undefined) {
    clean.title_ua = normalizeOptionalString(payload.title_ua);
  }

  if (payload.title_en !== undefined) {
    clean.title_en = normalizeOptionalString(payload.title_en);
  }

  if (payload.description_ua !== undefined) {
    clean.description_ua = normalizeOptionalString(payload.description_ua);
  }

  if (payload.description_en !== undefined) {
    clean.description_en = normalizeOptionalString(payload.description_en);
  }

  if (payload.category !== undefined) {
    clean.category = normalizeOptionalString(payload.category);
  }

  if (payload.durationText !== undefined) {
    clean.durationText = normalizeOptionalString(payload.durationText);
  }

  if (payload.link !== undefined) {
    clean.link = normalizeOptionalString(payload.link);
  }

  if (payload.speaker !== undefined) {
    clean.speaker = normalizeOptionalString(payload.speaker);
  }

  if (payload.image !== undefined) {
    clean.image = normalizeOptionalString(payload.image);
  }

  if (payload.price !== undefined) {
    clean.price = toNumberOrUndef(payload.price) ?? 0;
  }

  if (payload.tags !== undefined) {
    clean.tags = Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : [];
  }

  if (payload.isPublished !== undefined) {
    clean.isPublished = Boolean(payload.isPublished);
  }

  const { data } = await client.patch(`/courses/${id}`, clean);
  return data;
}

export async function deleteCourse(id) {
  const { data } = await client.delete(`/courses/${id}`);
  return data;
}