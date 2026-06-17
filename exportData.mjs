import fs from "fs";
import path from "path";

const BASE_URL = "https://fintechbackend.online";

async function getJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Помилка ${response.status}: ${url}`);
  }

  return response.json();
}

async function getAllCourses() {
  const allCourses = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const data = await getJson(
      `${BASE_URL}/courses/?page=${page}&page_size=${pageSize}`
    );

    const courses = data.courses || [];

    allCourses.push(...courses);

    if (courses.length < pageSize) {
      break;
    }

    page++;
  }

  return allCourses;
}

async function exportData() {
  const courses = await getAllCourses();
  const insightsEn = await getJson(`${BASE_URL}/insights/en`);
  const insightsUa = await getJson(`${BASE_URL}/insights/ua`);

  const data = {
    courses,
    insights: {
      en: insightsEn,
      ua: insightsUa
    },
    exportedAt: new Date().toISOString()
  };

  const outputPath = path.resolve("exported-data.json");

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");

  console.log("JSON файл створено:", outputPath);
  console.log("Курсів:", courses.length);
  console.log("Insights EN:", insightsEn.length);
  console.log("Insights UA:", insightsUa.length);
}

exportData().catch((error) => {
  console.error("Export failed:", error.message);
});