import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../api/courses";
import CourseCard from "../components/courses/CourseCard";
import CoursesFilters from "../components/courses/CoursesFilters";
import { useLang } from "../context/LanguageContext";

function uniq(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

function durationSortKey(text) {
  const s = String(text || "").toLowerCase();
  const nums = s.match(/\d+([.,]\d+)?/g);
  const n = nums ? parseFloat(nums[0].replace(",", ".")) : NaN;
  if (Number.isNaN(n)) return Number.POSITIVE_INFINITY;
  if (s.includes("хв") || s.includes("min")) return n;
  if (s.includes("год") || s.includes("hour") || s.includes("hr")) return n * 60;
  if (s.includes("дн") || s.includes("day")) return n * 24 * 60;
  if (s.includes("тиж") || s.includes("week")) return n * 7 * 24 * 60;
  return n;
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

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function CoursesPage() {
  const { lang } = useLang();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: "",
    category: "",
    priceKey: "",
    durationIndex: 0,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const [priceOptions, setPriceOptions] = useState([]);

  const t = useMemo(() => {
    return {
      title: lang === "en" ? "FinTech Courses" : "Фінтех курси",
      subtitle:
        lang === "en"
          ? "Explore curated fintech education programs in one place."
          : "Ознайомтесь з відібраними фінтех-курсами в одному місці.",
      loading: lang === "en" ? "Loading…" : "Завантаження…",
      empty: lang === "en" ? "No courses found" : "Курси не знайдено",
    };
  }, [lang]);

  const computedPrice = useMemo(() => {
    const picked = priceOptions.find((p) => p.key === filters.priceKey);
    return {
      priceMin: picked?.min,
      priceMax: picked?.max,
    };
  }, [filters.priceKey, priceOptions]);

  const computedDurationText = useMemo(() => {
    if (!durationOptions.length) return undefined;
    const idx = Math.min(Math.max(filters.durationIndex || 0, 0), durationOptions.length - 1);
    const opt = durationOptions[idx];
    if (!opt?.key) return undefined;
    return opt.durationText || undefined;
  }, [filters.durationIndex, durationOptions]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const res = await getCourses({
          title: filters.q || undefined,
          description: filters.q || undefined,
          category: filters.category || undefined,
          price_min: computedPrice.priceMin,
          price_max: computedPrice.priceMax,
          durationText: computedDurationText,
          page: 1,
          page_size: 24,
        });

        if (!alive) return;

        const list = Array.isArray(res?.courses) ? res.courses : [];
        setCourses(list);

        const cats = uniq(list.map((c) => c.category));
        const catsWithAll = [
          { value: "", label: formatCategoryLabel("", lang) },
          ...cats.map((c) => ({ value: c, label: formatCategoryLabel(c, lang) })),
        ];
        setCategoryOptions(catsWithAll);

        const durations = uniq(list.map((c) => c.durationText))
          .sort((a, b) => durationSortKey(a) - durationSortKey(b));

        const durationWithAny = [
          {
            key: "",
            label: lang === "en" ? "Any duration" : "Будь-яка тривалість",
            durationText: "",
          },
          ...durations.map((d) => ({
            key: d,
            label: d,
            durationText: d,
          })),
        ];
        setDurationOptions(durationWithAny);

        const defaultPrices = [
          { key: "", label: lang === "en" ? "Any price" : "Будь-яка ціна", min: undefined, max: undefined },
          { key: "free", label: lang === "en" ? "Free" : "Безкоштовно", min: 0, max: 0 },
          { key: "paid", label: lang === "en" ? "Paid" : "Платні", min: 1, max: undefined },
        ];
        setPriceOptions(defaultPrices);

        setFilters((prev) => {
          const maxIndex = Math.max(durationWithAny.length - 1, 0);
          const safeIndex = Math.min(Math.max(prev.durationIndex || 0, 0), maxIndex);
          if (safeIndex === prev.durationIndex) return prev;
          return { ...prev, durationIndex: safeIndex };
        });
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setCourses([]);
        setCategoryOptions([{ value: "", label: formatCategoryLabel("", lang) }]);
        setDurationOptions([
          { key: "", label: lang === "en" ? "Any duration" : "Будь-яка тривалість", durationText: "" },
        ]);
        setPriceOptions([
          { key: "", label: lang === "en" ? "Any price" : "Будь-яка ціна", min: undefined, max: undefined },
        ]);
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
    filters.q,
    filters.category,
    computedPrice.priceMin,
    computedPrice.priceMax,
    computedDurationText,
    lang,
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
          priceOptions={priceOptions}
          durationOptions={durationOptions}
        />

        <div className="mt-10">
          {loading ? (
            <div className="text-center">{t.loading}</div>
          ) : courses.length === 0 ? (
            <div className="text-center opacity-70">{t.empty}</div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}