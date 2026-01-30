import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

/**
 * Courses page layout to match the mock:
 * - Dark blue background area
 * - Centered title + subtitle
 * - Filters row: Search (with magnifier inside), Category dropdown, Price dropdown
 * - Cards grid: 3 columns x 2 rows (6 cards per "page")
 * - Pagination dots under cards
 * - Uses backend data: GET /courses
 */

function MagnifierIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CourseCard({ course }) {
  // Map backend fields safely
  const title = course?.title ?? course?.name ?? "Course title";
  const description = course?.description ?? course?.short_description ?? "";
  const provider = course?.provider ?? course?.platform ?? "";
  const duration = course?.duration ?? course?.length ?? "";
  const price = course?.price ?? course?.cost ?? "";
  const url = course?.url ?? course?.link ?? "";

  return (
    <article className="rounded-[44px] bg-[#2E5D8C] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.15)]">
      {/* White image area */}
      <div className="bg-white h-[240px] md:h-[260px] rounded-[44px] m-5" />

      {/* Text area */}
      <div className="px-7 pb-7 text-white">
        <h3 className="text-[18px] md:text-[20px] leading-snug font-medium line-clamp-2">
          {title}
        </h3>

        <div className="mt-3 text-white/85 text-[14px] leading-relaxed line-clamp-3 min-h-[64px]">
          {description || " "}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-white/80 text-[13px]">
          <span className="truncate">{provider}</span>
          <span className="truncate">{duration}</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="text-white/90 text-[14px] truncate">
            {price !== "" ? `Price: ${price}` : " "}
          </div>

          <a
            href={url || "#"}
            target={url ? "_blank" : undefined}
            rel={url ? "noreferrer" : undefined}
            className="inline-flex items-center justify-center h-[34px] px-6 rounded-[10px] bg-white/25 text-white text-[14px] hover:bg-white/35 transition"
          >
            View
          </a>
        </div>
      </div>
    </article>
  );
}

function Dots({ total, active, onSelect }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={[
            "w-2.5 h-2.5 rounded-full transition",
            i === active ? "bg-black/90" : "bg-white/45 hover:bg-white/65",
          ].join(" ")}
          aria-label={`Go to page ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters (UI like mock; logic can be extended)
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState("all");

  // Pagination (6 cards per page = 3x2)
  const pageSize = 6;
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const { data } = await client.get("/courses");

        // Accept both: array OR { items: [] }
        const items = Array.isArray(data) ? data : data?.items ?? [];
        if (!cancelled) setAllCourses(items);
      } catch (e) {
        if (!cancelled) setAllCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allCourses.filter((c) => {
      const title = (c?.title ?? c?.name ?? "").toLowerCase();
      const desc = (c?.description ?? c?.short_description ?? "").toLowerCase();
      const tags = Array.isArray(c?.tags) ? c.tags.join(" ").toLowerCase() : "";
      const cat = (c?.category ?? c?.type ?? "").toLowerCase();

      const matchesQuery = !q || title.includes(q) || desc.includes(q) || tags.includes(q);

      const matchesCategory =
        category === "all" ? true : cat === category;

      const numericPrice = Number(c?.price ?? c?.cost);
      const matchesPrice =
        price === "all"
          ? true
          : price === "free"
          ? !Number.isFinite(numericPrice) || numericPrice === 0
          : price === "paid"
          ? Number.isFinite(numericPrice) && numericPrice > 0
          : true;

      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [allCourses, query, category, price]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    // If filters reduce results, keep page in range
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <section className="w-full">
      {/* Top spacing like mock (header already exists in Layout) */}
      <div className="px-6 md:px-10 pt-10 md:pt-12 pb-14">
        {/* Title + subtitle (center) */}
        <div className="max-w-[980px] mx-auto text-center">
          <div className="h-[10px] w-[520px] max-w-[85%] bg-white/90 rounded-full mx-auto mb-5" />
          <div className="h-[10px] w-[420px] max-w-[70%] bg-white/90 rounded-full mx-auto mb-10" />
        </div>

        {/* Filters row */}
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-center gap-5 md:gap-7 mb-12">
          {/* Search */}
          <div className="relative w-full md:w-[520px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder=""
              className="w-full h-[44px] rounded-full bg-[#A94F5E] text-white placeholder:text-white/70 outline-none px-6 pr-12"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/90">
              <MagnifierIcon className="w-5 h-5" />
            </span>
          </div>

          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-[240px] h-[44px] rounded-full bg-[#A94F5E] text-white outline-none px-5"
          >
            <option value="all">Category</option>
            <option value="fintech">FinTech</option>
            <option value="ai">AI</option>
            <option value="regtech">RegTech</option>
            <option value="blockchain">Blockchain</option>
          </select>

          {/* Price dropdown */}
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full md:w-[260px] h-[44px] rounded-full bg-[#A94F5E] text-white outline-none px-5"
          >
            <option value="all">Price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Cards grid */}
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[44px] bg-[#2E5D8C] h-[420px] animate-pulse"
                />
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="rounded-[32px] bg-white/10 border border-white/15 p-10 text-center text-white/85">
              No courses found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pageItems.map((course, idx) => (
                <CourseCard
                  key={course?.id ?? course?._id ?? `${page}-${idx}`}
                  course={course}
                />
              ))}
            </div>
          )}

          {/* Pagination dots (like mock) */}
          <Dots total={totalPages} active={page} onSelect={setPage} />
        </div>
      </div>
    </section>
  );
}