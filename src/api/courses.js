import client from "./client";

export async function getCourses() {
  const { data } = await client.get("/courses/");
  return data;
}