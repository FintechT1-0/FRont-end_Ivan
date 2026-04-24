import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../api/courses";
import { useLang } from "../context/LanguageContext";

const glassCard = {
  background:
    "linear-gradient(180deg, rgba(19, 54, 90, 0.78) 0%, rgba(10, 37, 67, 0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const imagePlaceholder = {
  background: "rgba(111, 134, 164, 0.78)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
};

function uniq(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

function formatCategoryLabel(value, lang) {
  if (!value) return lang === "en" ? "All categories" : "Всі категорії";

  const map = {
    ai_finance: { en: "AI in Finance", ua: "AI у фінансах" },
    fintech_digital_finance: { en: "Digital Finance", ua: "Цифрові фінанси" },
    it_architecture_fintech: {
      en: "IT Architecture & FinTech",
      ua: "IT архітектура та FinTech",
    },
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

function getLocalizedCourseTitle(course, lang) {
  return lang === "ua"
    ? course?.title_ua || course?.title_en || "Course"
    : course?.title_en || course?.title_ua || "Course";
}

function getLocalizedCourseDescription(course, lang) {
  return lang === "ua"
    ? course?.description_ua || course?.description_en || ""
    : course?.description_en || course?.description_ua || "";
}

function trimText(text = "", max = 120) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

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
      title: en ? "FinTech Courses" : "FinTech курси",
      search: en ? "Search courses" : "Пошук курсів",
      loading: en ? "Loading..." : "Завантаження...",
      empty: en ? "No courses found" : "Курси не знайдено",
      error: en ? "Failed to load courses." : "Не вдалося завантажити курси.",
      view: en ? "view course" : "переглянути курс",
      fallbackDescription: en
        ? "Course description will appear after content is added or updated."
        : "Опис курсу з’явиться після додавання або оновлення контенту.",
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
          ...cats.map((c) => ({
            value: c,
            label: formatCategoryLabel(c, lang),
          })),
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
        setCategoryOptions([
          { value: "", label: formatCategoryLabel("", lang) },
        ]);
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
    <div
      style={{
        background: "#082947",
        minHeight: "100vh",
        padding: "0 16px 32px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingTop: "24px",
        }}
      >
        <section style={{ paddingTop: "12px" }}>
          <h1
            style={{
              margin: "0 auto",
              maxWidth: "760px",
              textAlign: "center",
              color: "#FFFFFF",
              fontSize: "clamp(30px, 5vw, 58px)",
              fontWeight: 800,
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            {t.title}
          </h1>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "440px",
                height: "44px",
                background: "#FFFFFF",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                color: "#1E2D44",
              }}
            >
              <input
                value={filters.q}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    q: e.target.value,
                  }))
                }
                placeholder={t.search}
                type="text"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "14px",
                  color: "#1E2D44",
                }}
              />

              <span style={{ fontSize: "16px" }}>⌕</span>
            </div>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              style={{
                width: "120px",
                height: "44px",
                background: "#FFFFFF",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                padding: "0 12px",
                color: "#1E2D44",
                fontSize: "14px",
              }}
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "28px" }}>
            {loading ? (
              <div style={{ textAlign: "center", color: "#FFFFFF" }}>
                {t.loading}
              </div>
            ) : err ? (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                {err}
              </div>
            ) : courses.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                {t.empty}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {courses.map((course) => (
                  <article
                    key={course.id}
                    style={{
                      ...glassCard,
                      borderRadius: "24px",
                      padding: "12px",
                      color: "#FFFFFF",
                    }}
                  >
                    <div
                      style={{
                        ...imagePlaceholder,
                        height: "210px",
                        borderRadius: "18px",
                        marginBottom: "14px",
                        overflow: "hidden",
                      }}
                    >
                      {course?.image ? (
                        <img
                          src={course.image}
                          alt={getLocalizedCourseTitle(course, lang)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: 700,
                        lineHeight: 1.25,
                      }}
                    >
                      {getLocalizedCourseTitle(course, lang)}
                    </h3>

                    <p
                      style={{
                        margin: "10px 0 16px",
                        color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.45,
                        fontSize: "13px",
                        minHeight: "56px",
                      }}
                    >
                      {trimText(
                        getLocalizedCourseDescription(course, lang),
                        110
                      ) || t.fallbackDescription}
                    </p>

                    <button
                      type="button"
                      onClick={() => openCourse(course)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "28px",
                        padding: "0 16px",
                        borderRadius: "999px",
                        background: "#B3131A",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 500,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                      }}
                    >
                      {t.view}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}