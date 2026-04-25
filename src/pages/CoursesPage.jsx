import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api/courses";
import SafeImage from "../components/SafeImage";
import { useLang } from "../context/LanguageContext";
import DesktopOnly from "../components/DesktopOnly";

const glassCard = {
  background:
    "linear-gradient(180deg, rgba(19,54,90,0.78) 0%, rgba(10,37,67,0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
};

function normalizeCourses(payload) {
  return payload?.courses || [];
}

export default function CoursesPage() {
  const { lang } = useLang();

  const [activeType, setActiveType] = useState("external");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: "",
    category: "",
    tags: "",
    price_min: "",
    price_max: "",
  });

  const t = useMemo(() => {
    return {
      title:
        lang === "ua"
          ? "ЗНАЙДИ КУРСИ ДЛЯ FINTECH"
          : "DISCOVER FINTECH COURSES",
      external: lang === "ua" ? "Зовнішні" : "External",
      internal: lang === "ua" ? "Внутрішні" : "Internal",
      search: lang === "ua" ? "Пошук" : "Search",
      category: lang === "ua" ? "Категорія" : "Category",
      tags: lang === "ua" ? "Теги" : "Tags",
      priceMin: lang === "ua" ? "Ціна від" : "Min price",
      priceMax: lang === "ua" ? "Ціна до" : "Max price",
      reset: lang === "ua" ? "Скинути" : "Reset",
      view: lang === "ua" ? "Деталі" : "Details",
    };
  }, [lang]);

  useEffect(() => {
    load();
  }, [filters, activeType]);

  async function load() {
    try {
      setLoading(true);

      const data = await getCourses({
        title: filters.title,
        category: filters.category,
        tags: filters.tags,
        price_min: filters.price_min,
        price_max: filters.price_max,
        course_type: activeType,
      });

      setCourses(normalizeCourses(data));
    } catch (e) {
      console.error(e);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      title: "",
      category: "",
      tags: "",
      price_min: "",
      price_max: "",
    });
  }

  return (
    <DesktopOnly>
      <div style={{ background: "#082947", minHeight: "100vh", padding: "20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* TITLE */}
          <h1
            style={{
              color: "#fff",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {t.title}
          </h1>

          {/* TABS */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={() => setActiveType("external")}
              style={tab(activeType === "external")}
            >
              {t.external}
            </button>

            <button
              onClick={() => setActiveType("internal")}
              style={tab(activeType === "internal")}
            >
              {t.internal}
            </button>
          </div>

          {/* FILTERS */}
          <div style={{ ...glassCard, padding: "16px", borderRadius: "20px", marginBottom: "20px" }}>
            
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              
              <input
                placeholder={t.search}
                value={filters.title}
                onChange={(e) => setFilter("title", e.target.value)}
                style={input}
              />

              <input
                placeholder={t.category}
                value={filters.category}
                onChange={(e) => setFilter("category", e.target.value)}
                style={input}
              />

              <input
                placeholder={t.tags}
                value={filters.tags}
                onChange={(e) => setFilter("tags", e.target.value)}
                style={input}
              />

              <input
                placeholder={t.priceMin}
                value={filters.price_min}
                onChange={(e) => setFilter("price_min", e.target.value)}
                type="number"
                style={input}
              />

              <input
                placeholder={t.priceMax}
                value={filters.price_max}
                onChange={(e) => setFilter("price_max", e.target.value)}
                type="number"
                style={input}
              />

              <button onClick={resetFilters} style={resetBtn}>
                {t.reset}
              </button>
            </div>
          </div>

          {/* LIST */}
          {loading ? (
            <div style={{ color: "#fff" }}>Loading...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
              {courses.map((c) => (
                <div key={c.id} style={{ ...glassCard, borderRadius: "20px", padding: "14px" }}>
                  
                  <div style={{ height: "160px", marginBottom: "10px", borderRadius: "12px", overflow: "hidden" }}>
                    <SafeImage src={c.image} alt="" />
                  </div>

                  <div style={{ color: "#fff", fontWeight: "600" }}>
                    {lang === "ua" ? c.title_ua : c.title_en}
                  </div>

                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    {c.category}
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    {c.price > 0 ? `${c.price}$` : "Free"}
                  </div>

                  <Link
                    to={`/courses/${c.id}`}
                    style={button}
                  >
                    {t.view}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DesktopOnly>
  );
}

/* styles */

const input = {
  height: "40px",
  borderRadius: "999px",
  border: "none",
  padding: "0 14px",
};

const resetBtn = {
  height: "40px",
  borderRadius: "999px",
  background: "transparent",
  border: "1px solid white",
  color: "#fff",
  padding: "0 16px",
};

const button = {
  marginTop: "10px",
  display: "block",
  textAlign: "center",
  background: "#B3131A",
  color: "#fff",
  padding: "8px",
  borderRadius: "999px",
  textDecoration: "none",
};

function tab(active) {
  return {
    padding: "10px 20px",
    borderRadius: "999px",
    background: active ? "#B3131A" : "transparent",
    color: "#fff",
    border: "1px solid white",
  };
}