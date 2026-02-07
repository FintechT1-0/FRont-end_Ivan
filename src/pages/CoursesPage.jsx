import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../api/courses";
import CourseCard from "../components/courses/CourseCard";
import CoursesFilters from "../components/courses/CoursesFilters";
import { useLang } from "../context/LanguageContext";

function uniq(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

function formatCategoryLabel(value, lang) {
  if (!value) return lang === "en" ? "All categories" : "Всі категорії";
  const map = {
    ai_finance: { en: "AI in Finance", ua: "AI у фінансах" },
    fintech_digital_finance: { en: "Digital Finance", ua: "Цифрові фінанси" },
    it_architecture_fintech: { en: "IT Architecture & FinTech", ua: "IT архітектура та FinTech" },
    regtech_suptech: { en: "RegTech & SupTech", ua: "RegTech та SupTech" },
  };
  if (map[value]) return map[value][lang] || value;
  return value.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function useDebouncedValue(value, delayMs = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function parseTags(text) {
  const s = String(text || "").trim();
  if (!s) return undefined;
  const tags = s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return tags.length ? tags : undefined;
}

function toNumberOrUndefined(v) {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default function CoursesPage() {
  const { lang } = useLang();

  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    total_pages: 1,
    total_courses: 0,
    page_size: 24,
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // manual filters (під новий CoursesFilters)
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    durationText: "",
    priceMin: "",
    priceMax: "",
    tagsText: "",
  });

  const debouncedQ = useDebouncedValue(filters.q, 550);

  const [categoryOptions, setCategoryOptions] = useState([
    { value: "", label: formatCategoryLabel("", lang) },
  ]);

  const t = useMemo(() => {
    const en = lang === "en";
    return {
      title: en ? "FinTech Courses" : "Фінтех курси",
      subtitle: en
        ? "Explore curated fintech education programs in one place."
        : "Ознайомтесь з відібраними фінтех-курсами в одному місці.",
      loading: en ? "Loading…" : "Завантаження…",
      empty: en ? "No courses found" : "Курси не знайдено",
      error: en ? "Failed to load courses." : "Не вдалося завантажити курси.",
      showing: en ? "Showing" : "Показано",
      total: en ? "total" : "всього",
      hint: en
        ? "Tip: use filters to narrow results."
        : "Порада: використай фільтри, щоб звузити результати.",
    };
  }, [lang]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const tags = parseTags(filters.tagsText);
        const priceMin = toNumberOrUndefined(filters.priceMin);
        const priceMax = toNumberOrUndefined(filters.priceMax);

        // важливо: isPublished=true, щоб віддавало тільки published (публічна сторінка)
        const data = await getCourses({
          // API очікує title/description
          title: debouncedQ || undefined,
          description: debouncedQ || undefined,
          category: filters.category || undefined,
          durationText: filters.durationText?.trim() || undefined,
          tags,
          priceMin,
          priceMax,
         // isPublished: true,
          page: 1,
          pageSize: 24,
        });

        if (!alive) return;

        const list = Array.isArray(data?.courses) ? data.courses : [];
        setCourses(list);

        // meta (якщо бекенд повертає PaginationInfo)
        setMeta({
          current_page: Number(data?.current_page || 1),
          total_pages: Number(data?.total_pages || 1),
          total_courses: Number(data?.total_courses || list.length || 0),
          page_size: Number(data?.page_size || 24),
        });

        const cats = uniq(list.map((c) => c.category));
        setCategoryOptions([
          { value: "", label: formatCategoryLabel("", lang) },
          ...cats.map((c) => ({ value: c, label: formatCategoryLabel(c, lang) })),
        ]);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setCourses([]);
        setMeta({
          current_page: 1,
          total_pages: 1,
          total_courses: 0,
          page_size: 24,
        });
        setCategoryOptions([{ value: "", label: formatCategoryLabel("", lang) }]);
        setErr(t.error);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [
    debouncedQ,
    filters.category,
    filters.durationText,
    filters.priceMin,
    filters.priceMax,
    filters.tagsText,
    lang,
    t.error,
  ]);

  return (
    <div className="bg-[#0E3A73] text-white min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-center">{t.title}</h1>
        <p className="mt-4 text-center text-white/80 max-w-3xl mx-auto">{t.subtitle}</p>

        <CoursesFilters
          filters={filters}
          onChange={setFilters}
          categoryOptions={categoryOptions}
        />

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-white/80">
          <div>
            {t.showing}: <span className="text-white">{courses.length}</span> • {t.total}:{" "}
            <span className="text-white">{meta.total_courses}</span>
          </div>
          <div className="hidden md:block">{t.hint}</div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="text-center">{t.loading}</div>
          ) : err ? (
            <div className="text-center text-white/80">{err}</div>
          ) : courses.length === 0 ? (
            <div className="text-center opacity-70">{t.empty}</div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 items-stretch">
              {courses.map((course) => (
                <div key={course.id} className="flex">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}