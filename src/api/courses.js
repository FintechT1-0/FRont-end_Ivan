import axios from "axios";
import client from "./client";

const publicClient = axios.create({
  baseURL: client.defaults.baseURL,
});

function toNumberOrUndef(value) {
  if (value === "" || value === null || value === undefined) return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function normalizeRequiredString(value) {
  return String(value ?? "").trim();
}

function normalizeOptionalString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const stringValue = String(value).trim();
  return stringValue === "" ? null : stringValue;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeEmbeddings(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeChapters(chapters) {
  if (!Array.isArray(chapters)) return null;

  const clean = chapters
    .map((chapter) => ({
      title_ua: normalizeRequiredString(chapter.title_ua),
      title_en: normalizeRequiredString(chapter.title_en),
      description_ua: normalizeRequiredString(chapter.description_ua),
      description_en: normalizeRequiredString(chapter.description_en),
      embeddings: normalizeEmbeddings(chapter.embeddings),
    }))
    .filter(
      (chapter) =>
        chapter.title_ua &&
        chapter.title_en &&
        chapter.description_ua &&
        chapter.description_en
    );

  return clean.length > 0 ? clean : null;
}

function buildCoursesQuery(params = {}, allowPublishedFilter = true) {
  const {
    tags,
    course_type,
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
  if (course_type) query.course_type = course_type;

  const min = toNumberOrUndef(priceMin ?? price_min);
  const max = toNumberOrUndef(priceMax ?? price_max);

  if (typeof min === "number") query.price_min = min;
  if (typeof max === "number") query.price_max = max;

  if (allowPublishedFilter && typeof isPublished === "boolean") {
    query.isPublished = isPublished;
  }

  const cleanTags = normalizeTags(tags);
  if (cleanTags.length > 0) {
    query.tags = cleanTags;
  }

  query.page = Number(page) || 1;
  query.page_size = Number(page_size ?? pageSize) || 20;

  return query;
}

export async function getPublicCourses(params = {}) {
  const query = buildCoursesQuery(params, false);

  const { data } = await publicClient.get("/courses/", {
    params: query,
  });

  return data;
}

export async function getPublicCourseById(id) {
  const { data } = await publicClient.get(`/courses/${id}`);
  return data;
}

export async function getCourses(params = {}) {
  const query = buildCoursesQuery(params, true);

  const { data } = await client.get("/courses/", {
    params: query,
  });

  return data;
}

export async function getCourseById(id) {
  const { data } = await client.get(`/courses/${id}`);
  return data;
}

export async function createCourse(payload = {}) {
  const courseType = payload.course_type || "external";

  const clean = {
    course_type: courseType,
    title_ua: normalizeRequiredString(payload.title_ua),
    title_en: normalizeRequiredString(payload.title_en),
    description_ua: normalizeRequiredString(payload.description_ua),
    description_en: normalizeRequiredString(payload.description_en),
    category: normalizeRequiredString(payload.category),
    tags: normalizeTags(payload.tags),
    durationText: normalizeRequiredString(payload.durationText),
    price: toNumberOrUndef(payload.price) ?? 0,
    link: normalizeOptionalString(payload.link),
    speaker: normalizeOptionalString(payload.speaker),
    image: normalizeOptionalString(payload.image),
    isPublished: Boolean(payload.isPublished),
  };

  if (courseType === "internal") {
    clean.chapters = normalizeChapters(payload.chapters);
  }

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
    clean.tags = normalizeTags(payload.tags);
  }

  if (payload.isPublished !== undefined) {
    clean.isPublished = Boolean(payload.isPublished);
  }

  if (payload.chapters !== undefined) {
    clean.chapters = normalizeChapters(payload.chapters);
  }

  const { data } = await client.patch(`/courses/${id}`, clean);
  return data;
}

export async function deleteCourse(id) {
  const { data } = await client.delete(`/courses/${id}`);
  return data;
}