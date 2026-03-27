import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../api/courses";
import { useLang } from "../context/LanguageContext";
import Logo from "../assets/Logo.png";

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

function pickImage(course) {
  return course?.image || course?.thumbnail || null;
}

function courseTitle(course, lang) {
  if (!course) return "";
  return lang === "en"
    ? course?.title_en || course?.title || ""
    : course?.title_ua || course?.title || "";
}

function courseDesc(course, lang) {
  if (!course) return "";
  return lang === "en"
    ? course?.description_en || course?.description || ""
    : course?.description_ua || course?.description || "";
}

const glassCardStyle = {
  background:
    "linear-gradient(180deg, rgba(18,52,87,0.88) 0%, rgba(10,35,58,0.92) 100%)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.18)",
};

export default function CoursesPage() {
  const navigate = useNavigate();
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
      title: en
        ? "LOREM IPSUM LOREM IPSUM LOREM IPSUM"
        : "LOREM IPSUM LOREM IPSUM LOREM IPSUM",
      search: en ? "Search courses" : "Пошук курсів",
      category: en ? "Category" : "Категорія",
      loading: en ? "Loading…" : "Завантаження…",
      empty: en ? "No courses found" : "Курси не знайдено",
      error: en ? "Failed to load courses." : "Не вдалося завантажити курси.",
      view: en ? "view courses" : "переглянути курс",
      footerLead: en
        ? "lorem ipsum lorem ipsum lorem"
        : "lorem ipsum lorem ipsum lorem",
      footerText: en
        ? "FinTech ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem"
        : "FinTech ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem",
      follow: en ? "Follow FinTech" : "Follow FinTech",
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

        const data = await getCourses({
          title: debouncedQ || undefined,
          description: debouncedQ || undefined,
          category: filters.category || undefined,
          durationText: filters.durationText?.trim() || undefined,
          tags,
          priceMin,
          priceMax,
          isPublished: true,
          page: 1,
          pageSize: 24,
        });

        if (!alive) return;

        const list = Array.isArray(data?.courses) ? data.courses : [];
        setCourses(list);

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

  function openCourse(course) {
    if (course?.link) {
      window.open(course.link, "_blank", "noopener,noreferrer");
      return;
    }

    if (course?.id) {
      navigate(`/courses/${course.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#071F35] text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="text-center text-[26px] sm:text-[38px] md:text-[52px] font-extrabold leading-[1.05] tracking-[-0.03em] max-w-[820px] mx-auto">
          {t.title}
        </h1>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <div className="relative w-full max-w-[460px]">
            <input
              value={filters.q}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  q: e.target.value,
                }))
              }
              placeholder={t.search}
              className="w-full h-12 rounded-xl bg-white text-[#1f2f47] px-4 pr-12 outline-none"
              type="text"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1f2f47]">
              ⌕
            </span>
          </div>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            className="w-full sm:w-[180px] h-12 rounded-xl bg-white text-[#1f2f47] px-4 outline-none"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="text-center text-white/80">{t.loading}</div>
          ) : err ? (
            <div className="text-center text-white/80">{err}</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-white/70">{t.empty}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-[28px] border border-white/10 p-3 sm:p-4"
                  style={glassCardStyle}
                >
                  <div className="rounded-[22px] bg-white/30 h-[190px] sm:h-[220px] overflow-hidden grid place-items-center">
                    {pickImage(course) ? (
                      <img
                        src={pickImage(course)}
                        alt={courseTitle(course, lang)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-white/70" />
                    )}
                  </div>

                  <div className="mt-4 text-[24px] font-semibold leading-tight">
                    {courseTitle(course, lang) || "Lorem ipsum"}
                  </div>

                  <div className="mt-2 text-[13px] leading-relaxed text-white/80 line-clamp-4">
                    {courseDesc(course, lang) ||
                      "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"}
                  </div>

                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() => openCourse(course)}
                      className="inline-flex items-center justify-center min-w-[126px] h-9 rounded-full bg-[#A0141A] px-5 text-[13px] font-medium hover:opacity-90"
                    >
                      {t.view}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="mt-16 rounded-[28px] border border-white/10 px-6 py-8 sm:px-10 sm:py-10"
          style={glassCardStyle}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-[11px] sm:text-sm text-white/75">
            <div className="space-y-3">
              <div className="text-white/90 text-[14px] sm:text-[16px] font-medium leading-snug">
                {t.footerLead}
              </div>
              <div>{t.footerText}</div>
              <div>ipsum lorem</div>
            </div>

            <div className="space-y-3">
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
            </div>

            <div className="space-y-3">
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
              <div>ipsum lorem</div>
            </div>

            <div className="flex flex-col items-start">
              <div className="text-[14px] sm:text-[16px] text-white/90 leading-snug">
                {t.follow}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <a
                  href="#"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 1.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white">
                    <path d="M13.5 21v-7h2.3l.35-2.7H13.5V9.58c0-.78.22-1.3 1.34-1.3H16.3V5.86A17.7 17.7 0 0 0 14.18 5c-2.1 0-3.54 1.28-3.54 3.64v2.66H8.25V14h2.39v7Z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
                  aria-label="X"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white">
                    <path d="M18.244 2H21l-6.016 6.876L22 22h-5.49l-4.3-6.272L6.72 22H4l6.43-7.35L2 2h5.63l3.887 5.67L18.244 2Zm-.964 18.2h1.523L6.8 3.71H5.164Z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#A0141A] flex items-center justify-center"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white">
                    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0 11.94 11.94 0 0 0 1.74 17.9L0 24l6.27-1.64A11.94 11.94 0 0 0 24 12.06a11.82 11.82 0 0 0-3.48-8.58ZM12.06 21.5a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.72.98 1-3.63-.22-.37A9.43 9.43 0 1 1 12.06 21.5Zm5.18-7.04c-.28-.14-1.64-.81-1.9-.9-.25-.1-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.15.18-.31.21-.58.07-.28-.14-1.15-.42-2.19-1.33a8.17 8.17 0 0 1-1.52-1.88c-.16-.28 0-.43.12-.57.13-.13.28-.34.42-.5.14-.17.18-.28.28-.46.09-.18.04-.35-.03-.49-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.46.07-.7.35-.25.28-.94.92-.94 2.24s.96 2.6 1.1 2.78c.14.18 1.88 2.87 4.56 4.03.64.27 1.14.43 1.53.55.64.2 1.22.17 1.68.1.51-.08 1.64-.67 1.87-1.32.23-.64.23-1.2.16-1.31-.07-.12-.25-.19-.53-.33Z" />
                  </svg>
                </a>
              </div>

              <div className="mt-6">
                <img src={Logo} alt="FinTech UniVerse" className="h-12 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}