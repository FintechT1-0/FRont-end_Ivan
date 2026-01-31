import client from "./client";

export async function getCourses(params = {}) {
  const {
    tags,
    title,
    description,
    category,
    durationText,
    priceMin,
    priceMax,
    isPublished,
    page = 1,
    pageSize = 6,
  } = params;

  const query = {};

  if (title) query.title = title;
  if (description) query.description = description;
  if (category) query.category = category;
  if (durationText) query.durationText = durationText;

  if (typeof priceMin === "number") query.price_min = priceMin;
  if (typeof priceMax === "number") query.price_max = priceMax;

  if (typeof isPublished === "boolean") query.isPublished = isPublished;

  if (Array.isArray(tags) && tags.length) query.tags = tags;

  query.page = page;
  query.page_size = pageSize;

  const { data } = await client.get("/courses/", { params: query });
  return data;
}

export async function getCourseById(id) {
  const { data } = await client.get(`/courses/${id}`);
  return data;
}

export async function createCourse(payload) {
  const { data } = await client.post("/courses/", payload);
  return data;
}

export async function updateCourse(id, payload) {
  const { data } = await client.patch(`/courses/${id}`, payload);
  return data;
}

export async function deleteCourse(id) {
  const { data } = await client.delete(`/courses/${id}`);
  return data;
}