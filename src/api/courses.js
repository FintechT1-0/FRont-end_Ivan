import client from "./client";

export async function getCourses(params = {}) {
  const { data } = await client.get("/courses/", { params });
  return data;
}