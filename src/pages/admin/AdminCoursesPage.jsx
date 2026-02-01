import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await client.get("/courses", {
          params: { page: 1, page_size: 50 }, // ❗ НЕ limit
        });

        setCourses(
          Array.isArray(res.data?.items)
            ? res.data.items
            : Array.isArray(res.data)
            ? res.data
            : []
        );
      } catch (e) {
        console.error("Failed to load courses", e);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-medium">Courses</h1>
        <button
          onClick={() => navigate("/admin/courses/create")}
          className="h-10 px-4 rounded-md bg-[#2E5D8C] text-white"
        >
          + Add course
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-black/60">Loading…</p>
      ) : courses.length === 0 ? (
        <p className="mt-6 text-black/60">Курсів ще немає</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {courses.map((c) => (
            <li
              key={c.id}
              className="p-3 bg-white rounded border hover:bg-black/5 cursor-pointer"
              onClick={() => navigate(`/admin/courses/${c.id}`)}
            >
              {c.title_ua || c.title_en || "Без назви"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}