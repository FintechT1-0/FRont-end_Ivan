import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../api/courses";
import SafeImage from "../components/SafeImage";
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

function normalizeCoursesResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.courses)) {
    return payload.courses;
  }

  return [];
}

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return fallback;
}

function getLocalizedTitle(course, lang) {
  if (lang === "ua") {
    return course?.title_ua || course?.title_en || "Course";
  }

  return course?.title_en || course?.title_ua || "Course";
}

function getLocalizedDescription(course, lang) {
  if (lang === "ua") {
    return course?.description_ua || course?.description_en || "";
  }

  return course?.description_en || course?.description_ua || "";
}

function trimText(text = "", max = 150) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function getAllCategories(courses) {
  return [...new Set(courses.map((course) => course.category).filter(Boolean))];
}

function getAllTags(courses) {
  return [...new Set(courses.flatMap((course) => course.tags || []).filter(Boolean))];
}

function courseMatchesFilters(course, filters, lang) {
  const title = getLocalizedTitle(course, lang).toLowerCase();
  const description = getLocalizedDescription(course, lang).toLowerCase();
  const category = (course?.category || "").toLowerCase();
  const speaker = (course?.speaker || "").toLowerCase();
  const tags = Array.isArray(course?.tags) ? course.tags : [];
  const tagsText = tags.join(" ").toLowerCase();
  const price = Number(course?.price || 0);

  const query = filters.search.trim().toLowerCase();

  const matchesSearch =
    !query ||
    title.includes(query) ||
    description.includes(query) ||
    category.includes(query) ||
    speaker.includes(query) ||
    tagsText.includes(query);

  const matchesCategory =
    !filters.category || course?.category === filters.category;

  const matchesTag =
    !filters.tag || tags.includes(filters.tag);

  const matchesPriceMin =
    filters.priceMin === "" || price >= Number(filters.priceMin);

  const matchesPriceMax =
    filters.priceMax === "" || price <= Number(filters.priceMax);

  return (
    matchesSearch &&
    matchesCategory &&
    matchesTag &&
    matchesPriceMin &&
    matchesPriceMax
  );
}

export default function CoursesPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tag: "",
    priceMin: "",
    priceMax: "",
  });

  const t = useMemo(() => {
    return {
      title:
        lang === "en"
          ? "DISCOVER COURSES THAT GROW YOUR FINTECH CAREER"
          : "ЗНАЙДИ КУРСИ ДЛЯ РОЗВИТКУ У FINTECH",
      btn: lang === "en" ? "View course" : "Переглянути",
      loading: lang === "en" ? "Loading..." : "Завантаження...",
      empty: lang === "en" ? "No courses yet" : "Курсів поки немає",
      error:
        lang === "en"
          ? "Failed to load courses"
          : "Не вдалося завантажити курси",
      search: lang === "en" ? "Search courses..." : "Пошук курсів...",
      category: lang === "en" ? "Category" : "Категорія",
      allCategories: lang === "en" ? "All categories" : "Усі категорії",
      tag: lang === "en" ? "Tag" : "Тег",
      allTags: lang === "en" ? "All tags" : "Усі теги",
      priceMin: lang === "en" ? "Min price" : "Мін. ціна",
      priceMax: lang === "en" ? "Max price" : "Макс. ціна",
      duration: lang === "en" ? "Duration" : "Тривалість",
      speaker: lang === "en" ? "Speaker" : "Спікер",
      price: lang === "en" ? "Price" : "Ціна",
      free: lang === "en" ? "Free" : "Безкоштовно",
      noLink:
        lang === "en"
          ? "Course link unavailable"
          : "Посилання на курс недоступне",
      reset: lang === "en" ? "Reset filters" : "Скинути фільтри",
      noResults:
        lang === "en"
          ? "No courses match your filters"
          : "Немає курсів за цими фільтрами",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        setLoading(true);
        setErrorText("");

        const data = await getCourses({
          isPublished: true,
          page: 1,
          page_size: 100,
        });

        if (!active) return;

        const normalized = normalizeCoursesResponse(data);
        setCourses(normalized);
      } catch (error) {
        if (!active) return;

        console.error(error);
        setCourses([]);
        setErrorText(getBackendError(error, t.error));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, [t.error]);

  const categories = useMemo(() => getAllCategories(courses), [courses]);
  const tags = useMemo(() => getAllTags(courses), [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => courseMatchesFilters(course, filters, lang));
  }, [courses, filters, lang]);

  function updateFilter(name, value) {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetFilters() {
    setFilters({
      search: "",
      category: "",
      tag: "",
      priceMin: "",
      priceMax: "",
    });
  }

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-[#082947] text-white flex items-center justify-center">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-[#082947] text-white px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold">{t.title}</h1>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div
            style={glassCard}
            className="rounded-full px-4 h-[44px] flex items-center xl:col-span-2"
          >
            <input
              type="text"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder={t.search}
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/60"
            />
          </div>

          <select
            value={filters.category}
            onChange={(event) => updateFilter("category", event.target.value)}
            style={glassCard}
            className="rounded-full px-4 h-[44px] text-sm text-white bg-transparent outline-none"
          >
            <option value="" className="text-black">
              {t.allCategories}
            </option>
            {categories.map((category) => (
              <option key={category} value={category} className="text-black">
                {category}
              </option>
            ))}
          </select>

          <select
            value={filters.tag}
            onChange={(event) => updateFilter("tag", event.target.value)}
            style={glassCard}
            className="rounded-full px-4 h-[44px] text-sm text-white bg-transparent outline-none"
          >
            <option value="" className="text-black">
              {t.allTags}
            </option>
            {tags.map((tag) => (
              <option key={tag} value={tag} className="text-black">
                {tag}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            style={glassCard}
            className="rounded-full px-4 h-[44px] text-sm text-white"
          >
            {t.reset}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-4 max-w-[520px]">
          <div
            style={glassCard}
            className="rounded-full px-4 h-[44px] flex items-center"
          >
            <input
              type="number"
              min="0"
              value={filters.priceMin}
              onChange={(event) => updateFilter("priceMin", event.target.value)}
              placeholder={t.priceMin}
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/60"
            />
          </div>

          <div
            style={glassCard}
            className="rounded-full px-4 h-[44px] flex items-center"
          >
            <input
              type="number"
              min="0"
              value={filters.priceMax}
              onChange={(event) => updateFilter("priceMax", event.target.value)}
              placeholder={t.priceMax}
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </div>

      {errorText ? (
        <div className="max-w-6xl mx-auto text-center text-white/80">
          {errorText}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="max-w-6xl mx-auto text-center text-white/70">
          {courses.length === 0 ? t.empty : t.noResults}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const title = getLocalizedTitle(course, lang);
            const description = trimText(getLocalizedDescription(course, lang), 150);

            return (
              <div
                key={course.id}
                style={glassCard}
                className="rounded-[28px] p-5 flex flex-col"
              >
                <div className="h-[180px] bg-[#6F86A4]/60 rounded-[18px] overflow-hidden">
                  <SafeImage
                    src={course.image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="mt-4 text-lg font-semibold min-h-[56px]">
                  {title}
                </h3>

                <p className="mt-2 text-sm text-white/80 min-h-[72px]">
                  {description}
                </p>

                <div className="mt-4 grid gap-2 text-xs text-white/75">
                  <div>
                    <span className="text-white/55">{t.category}: </span>
                    <span>{course.category || "-"}</span>
                  </div>

                  <div>
                    <span className="text-white/55">{t.duration}: </span>
                    <span>{course.durationText || "-"}</span>
                  </div>

                  <div>
                    <span className="text-white/55">{t.speaker}: </span>
                    <span>{course.speaker || "-"}</span>
                  </div>

                  <div>
                    <span className="text-white/55">{t.price}: </span>
                    <span>
                      {Number(course.price) > 0
                        ? `${course.price} USD`
                        : t.free}
                    </span>
                  </div>

                  {Array.isArray(course.tags) && course.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {course.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-[10px] bg-white/10 text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="px-6 py-2 rounded-full text-sm font-medium text-white"
                    style={{
                      background: "#B3131A",
                      boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                    }}
                  >
                    {t.btn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}