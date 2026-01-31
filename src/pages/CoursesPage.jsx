import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../api/courses";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatPrice(price) {
  const p = Number(price);
  if (!Number.isFinite(p)) return "—";
  if (p === 0) return "Free";
  return `$${Math.round(p)}`;
}

function CourseCard({ course }) {
  const title = course?.title_en || course?.title_ua || "Untitled course";
  const description = course?.description_en || course?.description_ua || "No description";
  const duration = course?.durationText || "";
  const speaker = course?.speaker || "";
  const link = course?.link || "";
  const image = course?.image || "";
  const tags = Array.isArray(course?.tags) ? course.tags : [];

  return (
    <div className="rounded-[44px] bg-[#3F5F8C] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="rounded-[36px] bg-white h-[180px] overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-white" />
        )}
      </div>

      <div className="mt-6 text-white flex-1 flex flex-col">
        <div className="text-lg md:text-xl font-semibold leading-snug line-clamp-2">{title}</div>

        <div className="mt-3 text-sm md:text-[15px] text-white/85 leading-relaxed line-clamp-3">
          {description}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-white/90">
          <div className="truncate">{duration}</div>
          <div className="font-semibold">{formatPrice(course?.price)}</div>
        </div>

        {speaker ? <div className="mt-2 text-sm text-white/80 truncate">Speaker: {speaker}</div> : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {tags.slice(0, 2).map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-[#2F4A70] text-white/90">
                {t}
              </span>
            ))}
          </div>

          <a
            href={link || "#"}
            target={link ? "_blank" : undefined}
            rel={link ? "noreferrer" : undefined}
            onClick={(e) => {
              if (!link) e.preventDefault();
            }}
            className={`text-xs md:text-sm px-4 py-2 rounded-md ${
              link ? "bg-[#B80A0A] hover:opacity-90" : "bg-white/25"
            }`}
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const priceRange = useMemo(() => {
    if (!price) return { priceMin: undefined, priceMax: undefined };
    if (price === "free") return { priceMin: 0, priceMax: 0 };
    if (price === "0-50") return { priceMin: 0, priceMax: 50 };
    if (price === "50-200") return { priceMin: 51, priceMax: 200 };
    if (price === "200+") return { priceMin: 201, priceMax: undefined };
    return { priceMin: undefined, priceMax: undefined };
  }, [price]);

  const [knownCategories, setKnownCategories] = useState([]);

  useEffect(() => {
    setPage(1);
  }, [q, category, price]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setFetchError("");

        const res = await getCourses({
          title: q || undefined,
          description: q || undefined,
          category: category || undefined,
          priceMin: priceRange.priceMin,
          priceMax: priceRange.priceMax,
          page,
          pageSize: 6,
        });

        if (!alive) return;

        const list = Array.isArray(res?.courses) ? res.courses : [];
        setCourses(list);

        const tp = Number(res?.total_pages);
        setTotalPages(Number.isFinite(tp) && tp >= 1 ? tp : 1);

        if (knownCategories.length === 0 && page === 1) {
          const set = new Set();
          list.forEach((c) => {
            if (c?.category) set.add(String(c.category));
          });
          setKnownCategories(Array.from(set).sort((a, b) => a.localeCompare(b)));
        }
      } catch (e) {
        if (!alive) return;
        setCourses([]);
        setTotalPages(1);
        setFetchError(e?.response?.data?.detail || e?.message || "Failed to load courses");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [q, category, priceRange, page]);

  return (
    <div className="bg-[#1E3A5F] text-white min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">FinTech Courses</h1>
          <p className="mt-4 max-w-3xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
            Explore curated fintech education programs in digital finance, blockchain, AI, RegTech, SupTech, and fintech
            product development. All courses are aggregated and monitored in one place.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-5 mb-10">
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full h-[54px] rounded-full bg-[#A35C6A] text-white placeholder-white/80 px-6 pr-14 outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center pointer-events-none">
              <SearchIcon />
            </div>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-[54px] md:w-[220px] rounded-xl bg-[#A35C6A] text-white px-5 outline-none"
          >
            <option value="" className="text-black">
              Category
            </option>
            {knownCategories.map((c) => (
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
            <option value="" className="text-black">
              Price
            </option>
            <option value="free" className="text-black">
              Free
            </option>
            <option value="0-50" className="text-black">
              $0 – $50
            </option>
            <option value="50-200" className="text-black">
              $50 – $200
            </option>
            <option value="200+" className="text-black">
              $200+
            </option>
          </select>
        </div>

        <div className="rounded-[36px] bg-[#2F4A70]/55 p-8 min-h-[220px]">
          {loading ? (
            <div className="text-center text-white/90">Loading...</div>
          ) : fetchError ? (
            <div className="text-center text-red-200">{fetchError}</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-white/85">No courses found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-3 h-3 rounded-full ${p === page ? "bg-black" : "bg-white/40"}`}
                aria-label={`Page ${p}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}