import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../api/courses";

function normalizeCourses(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function PriceOptionLabel({ value }) {
  if (value === "free") return "Free";
  if (value === "0-50") return "$0 – $50";
  if (value === "50-200") return "$50 – $200";
  if (value === "200+") return "$200+";
  return "Price";
}

function CategoryOptionLabel({ value }) {
  if (!value) return "Category";
  return value;
}

function CourseCard({ course }) {
  const title = course?.title_en || course?.title_ua || "Untitled course";
  const description =
    course?.description_en || course?.description_ua || "No description";

  const price =
    typeof course?.price === "number"
      ? course.price === 0
        ? "Free"
        : `$${course.price}`
      : "—";

  const duration = course?.durationText || "";
  const link = course?.link || "";
  const tags = Array.isArray(course?.tags) ? course.tags : [];

  return (
    <div className="rounded-[44px] bg-[#3F5F8C] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col min-h-[320px]">
      <div className="rounded-[36px] bg-white h-[180px] mb-6 overflow-hidden">
        {course?.image ? (
          <img
            src={course.image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="text-white">
        <div className="text-lg font-semibold leading-snug line-clamp-2">
          {title}
        </div>

        <div className="mt-3 text-sm opacity-90 line-clamp-2">
          {description}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-sm opacity-90">{duration}</div>
          <div className="text-sm font-semibold">{price}</div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-[#2F4A70] text-white/90"
              >
                {t}
              </span>
            ))}
          </div>

          <a
            href={link || "#"}
            target={link ? "_blank" : undefined}
            rel={link ? "noreferrer" : undefined}
            className={`text-xs px-4 py-2 rounded-md ${
              link ? "bg-[#B80A0A] hover:opacity-90" : "bg-white/25"
            }`}
            onClick={(e) => {
              if (!link) e.preventDefault();
            }}
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [rawCourses, setRawCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [pageIdx, setPageIdx] = useState(0);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setFetchError("");
      try {
        const data = await getCourses();
        const list = normalizeCourses(data);
        if (!alive) return;
        setRawCourses(list);
      } catch (e) {
        if (!alive) return;
        setFetchError("Failed to load courses");
        setRawCourses([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    rawCourses.forEach((c) => {
      if (c?.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, [rawCourses]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rawCourses.filter((c) => {
      const title = (c?.title_en || c?.title_ua || "").toLowerCase();
      const desc = (c?.description_en || c?.description_ua || "").toLowerCase();

      const matchQ =
        !query || title.includes(query) || desc.includes(query);

      const matchCategory = !category || c?.category === category;

      const p = typeof c?.price === "number" ? c.price : null;
      const matchPrice =
        !price ||
        (price === "free" && p === 0) ||
        (price === "0-50" && p !== null && p >= 0 && p <= 50) ||
        (price === "50-200" && p !== null && p > 50 && p <= 200) ||
        (price === "200+" && p !== null && p > 200);

      return matchQ && matchCategory && matchPrice;
    });
  }, [rawCourses, q, category, price]);

  const pages = useMemo(() => chunk(filtered, 6), [filtered]);
  const current = pages[pageIdx] || [];

  useEffect(() => {
    setPageIdx(0);
  }, [q, category, price]);

  return (
    <div className="bg-[#1E3A5F] text-white min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-14">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="h-[10px] w-[520px] max-w-full rounded-full bg-white/90" />
          <div className="h-[8px] w-[420px] max-w-full rounded-full bg-white/75" />
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-5 mb-10">
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full h-[54px] rounded-full bg-[#A35C6A] text-white placeholder-white/80 px-6 pr-14 outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
              onClick={() => {}}
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-95"
              >
                <path
                  d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-[54px] md:w-[220px] rounded-xl bg-[#A35C6A] text-white px-5 outline-none"
          >
            <option value="">{CategoryOptionLabel({ value: "" })}</option>
            {categories.map((c) => (
              <option key={c} value={c} className="text-black">
                {c}
              </option>
            ))}
          </select>

          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="h-[54px] md:w-[220px] rounded-xl bg-[#A35C6A] text-white px-5 outline-none"
          >
            <option value="">{PriceOptionLabel({ value: "" })}</option>
            <option value="free" className="text-black">Free</option>
            <option value="0-50" className="text-black">$0 – $50</option>
            <option value="50-200" className="text-black">$50 – $200</option>
            <option value="200+" className="text-black">$200+</option>
          </select>
        </div>

        <div className="rounded-[36px] bg-[#2F4A70]/55 p-8 min-h-[220px]">
          {loading ? (
            <div className="text-center opacity-90">Loading...</div>
          ) : fetchError ? (
            <div className="text-center text-red-200">{fetchError}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center opacity-90">No courses found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {current.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>

        {pages.length > 1 ? (
          <div className="flex items-center justify-center gap-2 mt-8">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPageIdx(i)}
                className={`w-3 h-3 rounded-full ${
                  i === pageIdx ? "bg-black" : "bg-white/40"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-8">
            <div className="w-3 h-3 rounded-full bg-black" />
          </div>
        )}
      </div>
    </div>
  );
}