import client from "./client";

export async function listCourses(params = {}) {
  const { data } = await client.get("/courses/", { params });
  return data;
}

export async function getCourse(id) {
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