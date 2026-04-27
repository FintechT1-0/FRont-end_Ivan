import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api/courses";
import SafeImage from "../components/SafeImage";
import DesktopOnly from "../components/DesktopOnly";
import { useLang } from "../context/LanguageContext";

const PAGE_BG = "#082947";
const RED = "#B3131A";

function normalizeCourses(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.courses || [];
}

function getTitle(course, lang) {
  return lang === "ua"
    ? course.title_ua || course.title_en || "Курс"
    : course.title_en || course.title_ua || "Course";
}

function getDescription(course, lang) {
  return lang === "ua"
    ? course.description_ua || course.description_en || ""
    : course.description_en || course.description_ua || "";
}

function getDurationNumber(durationText) {
  const match = String(durationText || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getUniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))];
}

function getUniqueTags(items) {
  return [
    ...new Set(
      items
        .flatMap((item) => (Array.isArray(item.tags) ? item.tags : []))
        .filter(Boolean)
    ),
  ];
}

export default function CoursesPage() {
  const { lang } = useLang();

  const [activeType, setActiveType] = useState("external");
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: "",
    category: "",
    tag: "",
    price: "",
    durationMax: 0,
  });

  const t = useMemo(() => {
    return {
      title:
        lang === "ua"
          ? "ЗНАЙДИ КУРСИ ДЛЯ FINTECH"
          : "DISCOVER FINTECH COURSES",
      external: lang === "ua" ? "Зовнішні" : "External",
      internal: lang === "ua" ? "Внутрішні" : "Internal",
      search: lang === "ua" ? "Пошук за назвою" : "Search by title",
      allCategories: lang === "ua" ? "Усі категорії" : "All categories",
      allTags: lang === "ua" ? "Усі теги" : "All tags",
      allPrices: lang === "ua" ? "Будь-яка ціна" : "Any price",
      freeOnly: lang === "ua" ? "Безкоштовні" : "Free only",
      paidOnly: lang === "ua" ? "Платні" : "Paid only",
      lowPrice: lang === "ua" ? "До 50" : "Up to 50",
      middlePrice: lang === "ua" ? "50 - 200" : "50 - 200",
      highPrice: lang === "ua" ? "Від 200" : "From 200",
      duration: lang === "ua" ? "Тривалість" : "Duration",
      allDurations: lang === "ua" ? "Будь-яка тривалість" : "Any duration",
      upTo: lang === "ua" ? "до" : "up to",
      hours: lang === "ua" ? "год" : "h",
      reset: lang === "ua" ? "Скинути" : "Reset",
      view: lang === "ua" ? "Деталі" : "Details",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      empty: lang === "ua" ? "Курсів не знайдено" : "No courses found",
      free: lang === "ua" ? "Безкоштовно" : "Free",
    };
  }, [lang]);

  useEffect(() => {
    loadCourses();
  }, [activeType]);

  async function loadCourses() {
    try {
      setLoading(true);

      const data = await getCourses({
        page: 1,
        page_size: 100,
        course_type: activeType,
        isPublished: true,
      });

      const normalized = normalizeCourses(data);
      setAllCourses(normalized);

      const maxDuration = Math.max(
        ...normalized.map((course) => getDurationNumber(course.durationText)),
        0
      );

      setFilters((prev) => ({
        ...prev,
        durationMax: 0,
      }));

      if (!maxDuration) {
        setFilters((prev) => ({
          ...prev,
          durationMax: 0,
        }));
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(
    () => getUniqueValues(allCourses, "category"),
    [allCourses]
  );

  const tags = useMemo(() => getUniqueTags(allCourses), [allCourses]);

  const maxDuration = useMemo(() => {
    return Math.max(
      ...allCourses.map((course) => getDurationNumber(course.durationText)),
      0
    );
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    const search = filters.title.trim().toLowerCase();

    return allCourses.filter((course) => {
      const title = getTitle(course, lang).toLowerCase();
      const price = Number(course.price || 0);
      const duration = getDurationNumber(course.durationText);
      const courseTags = Array.isArray(course.tags) ? course.tags : [];

      if (search && !title.includes(search)) return false;
      if (filters.category && course.category !== filters.category) return false;
      if (filters.tag && !courseTags.includes(filters.tag)) return false;

      if (filters.price === "free" && price !== 0) return false;
      if (filters.price === "paid" && price <= 0) return false;
      if (filters.price === "low" && price > 50) return false;
      if (filters.price === "middle" && (price < 50 || price > 200)) return false;
      if (filters.price === "high" && price < 200) return false;

      if (Number(filters.durationMax) > 0 && duration > Number(filters.durationMax)) {
        return false;
      }

      return true;
    });
  }, [allCourses, filters, lang]);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      title: "",
      category: "",
      tag: "",
      price: "",
      durationMax: 0,
    });
  }

  return (
    <DesktopOnly>
      <div style={page}>
        <div style={wrap}>
          <h1 style={title}>{t.title}</h1>

          <div style={tabs}>
            <button
              type="button"
              onClick={() => setActiveType("external")}
              style={tab(activeType === "external")}
            >
              {t.external}
            </button>

            <button
              type="button"
              onClick={() => setActiveType("internal")}
              style={tab(activeType === "internal")}
            >
              {t.internal}
            </button>
          </div>

          <div style={filtersPanel}>
            <input
              placeholder={t.search}
              value={filters.title}
              onChange={(e) => setFilter("title", e.target.value)}
              style={input}
            />

            <select
              value={filters.category}
              onChange={(e) => setFilter("category", e.target.value)}
              style={input}
            >
              <option value="">{t.allCategories}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.tag}
              onChange={(e) => setFilter("tag", e.target.value)}
              style={input}
            >
              <option value="">{t.allTags}</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            <select
              value={filters.price}
              onChange={(e) => setFilter("price", e.target.value)}
              style={input}
            >
              <option value="">{t.allPrices}</option>
              <option value="free">{t.freeOnly}</option>
              <option value="paid">{t.paidOnly}</option>
              <option value="low">{t.lowPrice}</option>
              <option value="middle">{t.middlePrice}</option>
              <option value="high">{t.highPrice}</option>
            </select>

            <div style={sliderBox}>
              <div style={sliderTop}>
                <span>{t.duration}</span>
                <span>
                  {Number(filters.durationMax) === 0
                    ? t.allDurations
                    : `${t.upTo} ${filters.durationMax} ${t.hours}`}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={maxDuration || 1}
                value={filters.durationMax}
                onChange={(e) => setFilter("durationMax", Number(e.target.value))}
                style={range}
              />
            </div>

            <button type="button" onClick={resetFilters} style={resetBtn}>
              {t.reset}
            </button>
          </div>

          {loading ? (
            <div style={message}>{t.loading}</div>
          ) : filteredCourses.length === 0 ? (
            <div style={message}>{t.empty}</div>
          ) : (
            <div style={grid}>
              {filteredCourses.map((course) => (
                <article key={course.id} style={card}>
                  <div style={imageBox}>
                    <SafeImage
                      src={course.image}
                      alt={getTitle(course, lang)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div style={cardBody}>
                    <div style={courseType}>
                      {course.course_type === "internal" ? t.internal : t.external}
                    </div>

                    <h2 style={courseTitle}>{getTitle(course, lang)}</h2>

                    <p style={description}>
                      {getDescription(course, lang)}
                    </p>

                    <div style={meta}>
                      <span>{course.category}</span>
                      <span>{course.durationText}</span>
                    </div>

                    <div style={meta}>
                      <span>{course.price > 0 ? `${course.price}$` : t.free}</span>
                      <span>
                        {Array.isArray(course.tags)
                          ? course.tags.slice(0, 2).join(", ")
                          : ""}
                      </span>
                    </div>

                    <Link to={`/courses/${course.id}`} style={button}>
                      {t.view}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </DesktopOnly>
  );
}

const page = {
  background: PAGE_BG,
  minHeight: "100vh",
  padding: "34px 18px 54px",
};

const wrap = {
  maxWidth: "1180px",
  margin: "0 auto",
};

const title = {
  color: "#FFFFFF",
  textAlign: "center",
  fontSize: "34px",
  fontWeight: 800,
  margin: "0 0 22px",
};

const tabs = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "22px",
};

const filtersPanel = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  padding: "18px",
  borderRadius: "24px",
  marginBottom: "24px",
  background:
    "linear-gradient(180deg, rgba(19,54,90,0.78) 0%, rgba(10,37,67,0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
};

const input = {
  width: "100%",
  height: "42px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.14)",
  outline: "none",
  padding: "0 14px",
  fontSize: "13px",
  color: "#101828",
  background: "#FFFFFF",
};

const sliderBox = {
  height: "42px",
  borderRadius: "999px",
  background: "#FFFFFF",
  padding: "6px 14px",
  color: "#101828",
};

const sliderTop = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "10px",
  fontWeight: 800,
  marginBottom: "3px",
};

const range = {
  width: "100%",
  cursor: "pointer",
};

const resetBtn = {
  height: "42px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.22)",
  background: "transparent",
  color: "#FFFFFF",
  padding: "0 18px",
  fontSize: "13px",
  fontWeight: 800,
  cursor: "pointer",
};

const message = {
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: 700,
  textAlign: "center",
  padding: "30px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "22px",
};

const card = {
  borderRadius: "24px",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(19,54,90,0.78) 0%, rgba(10,37,67,0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
};

const imageBox = {
  height: "170px",
  background: "#6F86A4",
  overflow: "hidden",
};

const cardBody = {
  padding: "16px",
};

const courseType = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "24px",
  padding: "0 10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.10)",
  color: "#FFFFFF",
  fontSize: "11px",
  fontWeight: 800,
  marginBottom: "10px",
};

const courseTitle = {
  color: "#FFFFFF",
  fontSize: "18px",
  fontWeight: 800,
  margin: "0 0 8px",
  lineHeight: 1.25,
};

const description = {
  color: "rgba(255,255,255,0.78)",
  fontSize: "13px",
  lineHeight: 1.5,
  minHeight: "58px",
  margin: "0 0 12px",
};

const meta = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  color: "rgba(255,255,255,0.68)",
  fontSize: "12px",
  marginTop: "8px",
};

const button = {
  marginTop: "16px",
  height: "38px",
  borderRadius: "999px",
  background: RED,
  color: "#FFFFFF",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
  boxShadow: "0 10px 18px rgba(179,19,26,0.22)",
};

function tab(active) {
  return {
    minWidth: "130px",
    height: "38px",
    borderRadius: "999px",
    background: active ? RED : "transparent",
    color: "#FFFFFF",
    border: active ? "none" : "1px solid rgba(255,255,255,0.24)",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: active ? "0 10px 18px rgba(179,19,26,0.22)" : "none",
  };
}