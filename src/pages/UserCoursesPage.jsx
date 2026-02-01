import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import CourseCard from "../components/courses/CourseCard";

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
  if (map[value]) return map[value][lang];
  return value.replaceAll("_", " ");
}

export default function UserCoursesPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { lang } = useLang();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const [category, setCategory] = useState("");
  const [priceKey, setPriceKey] = useState("");
  const [durationIndex, setDurationIndex] = useState(0);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const priceOptions = useMemo(
    () => [
      { key: "", label: lang === "en" ? "Any price" : "Будь-яка ціна" },
      { key: "free", label: lang === "en" ? "Free" : "Безкоштовно" },
      { key: "paid", label: lang === "en" ? "Paid" : "Платні" },
    ],
    [lang]
  );

  const t = useMemo(() => {
    const ua = lang !== "en";
    return {
      title: ua ? "Мої курси" : "My courses",
      search: ua ? "Пошук" : "Search",
      cat: ua ? "Категорія" : "Category",
      price: ua ? "Ціна" : "Price",
      duration: ua ? "Тривалість" : "Duration",
      empty: ua ? "Курси не знайдено" : "No courses found",
      loading: ua ? "Завантаження…" : "Loading…",
    };
  }, [lang]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 650);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    async function load() {
      setLoading(true);
      try {
        const durationText = durationOptions[durationIndex]?.value || undefined;

        const params = {
          page: 1,
          page_size: 24,
          isPublished: true,
          title: debouncedQ || undefined,
          description: debouncedQ || undefined,
          category: category || undefined,
          durationText: durationText || undefined,
        };

        if (priceKey === "free") {
          params.price_min = 0;
          params.price_max = 0;
        }
        if (priceKey === "paid") {
          params.price_min = 1;
          params.price_max = undefined;
        }

        const res = await client.get("/courses/", { headers, params });
        const list = res?.data?.courses || [];
        setItems(list);

        const cats = uniq(list.map((c) => c.category));
        setCategoryOptions(
          [{ value: "", label: formatCategoryLabel("", lang) }].concat(
            cats.map((c) => ({ value: c, label: formatCategoryLabel(c, lang) }))
          )
        );

        const durations = uniq(list.map((c) => c.durationText));
        const opts = [{ value: "", label: lang === "en" ? "Any duration" : "Будь-яка тривалість" }].concat(
          durations.map((d) => ({ value: d, label: d }))
        );
        setDurationOptions(opts);

        setDurationIndex((prev) => Math.min(prev, Math.max(opts.length - 1, 0)));
      } catch {
        setItems([]);
        setCategoryOptions([{ value: "", label: formatCategoryLabel("", lang) }]);
        setDurationOptions([{ value: "", label: lang === "en" ? "Any duration" : "Будь-яка тривалість" }]);
        setDurationIndex(0);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, lang, debouncedQ, category, priceKey, durationIndex, durationOptions]);

  const durationLabel = durationOptions[durationIndex]?.label || (lang === "en" ? "Any duration" : "Будь-яка тривалість");

  return (
    <div className="text-white">
      <div className="text-2xl font-semibold">{t.title}</div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            className="w-full h-12 rounded-2xl bg-[#A35C6A] text-white placeholder:text-white/80 px-5 outline-none"
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-12 rounded-2xl bg-[#A35C6A] text-white px-4 outline-none"
          >
            {(categoryOptions.length ? categoryOptions : [{ value: "", label: formatCategoryLabel("", lang) }]).map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={priceKey}
            onChange={(e) => setPriceKey(e.target.value)}
            className="w-full h-12 rounded-2xl bg-[#A35C6A] text-white px-4 outline-none"
          >
            {priceOptions.map((o) => (
              <option key={o.key || "any"} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white/5 p-4">
        <div className="flex items-center justify-between gap-6">
          <div className="text-sm text-white/80">{t.duration}</div>
          <div className="text-sm">{durationLabel}</div>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(durationOptions.length - 1, 0)}
          value={durationIndex}
          onChange={(e) => setDurationIndex(Number(e.target.value))}
          className="w-full mt-3"
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="text-white/80">{t.loading}</div>
        ) : items.length === 0 ? (
          <div className="text-white/70">{t.empty}</div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-6">
            {items.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onView={() => {
                  localStorage.setItem("lastCourseId", String(course.id));
                  navigate(`/courses/${course.id}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}