import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getInsightsEn, getInsightsUa } from "../api/insights";
import { useLang } from "../context/LanguageContext";
import SafeImage from "../components/SafeImage";
import InsightsAssistant from "../components/InsightsAssistant";

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

const insightsCache = {
  ua: null,
  en: null,
};

function trimText(text = "", max = 120) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function normalizeInsights(items) {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item.url || `${item.title}-${index}`,
    title: item.title || "Insight",
    excerpt: item.excerpt || item.content || "",
    content: item.content || "",
    image: item.image || item.thumbnail || "",
    thumbnail: item.thumbnail || "",
    category: item.category || "FinTech",
    date: item.date || "",
    url: item.url || "",
    lang: item.lang || "",
  }));
}

function buildDetailsLink(url) {
  return `/insights/details?u=${encodeURIComponent(url || "")}`;
}

function TopInsightLarge({ item }) {
  return (
    <Link
      to={buildDetailsLink(item.url)}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
    >
      <article
        style={{
          ...glassCard,
          borderRadius: "24px",
          padding: "16px",
          color: "#FFFFFF",
          minHeight: "100%",
          transition: "transform 0.2s ease",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            ...imagePlaceholder,
            height: "320px",
            borderRadius: "20px",
            marginBottom: "16px",
            overflow: "hidden",
          }}
        >
          {item?.image || item?.thumbnail ? (
            <SafeImage
              src={item.image}
              fallbackSrc={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: "28px",
              padding: "0 12px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {item.category}
          </span>

          {item.date ? (
            <span
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "12px",
              }}
            >
              {item.date}
            </span>
          ) : null}
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            lineHeight: 1.2,
            fontWeight: 600,
          }}
        >
          {item.title}
        </h2>

        <p
          style={{
            margin: "12px 0 0",
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.55,
            fontSize: "14px",
          }}
        >
          {trimText(item.excerpt, 180)}
        </p>
      </article>
    </Link>
  );
}

function TopInsightMedium({ item }) {
  return (
    <Link
      to={buildDetailsLink(item.url)}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
    >
      <article
        style={{
          ...glassCard,
          borderRadius: "24px",
          padding: "16px",
          color: "#FFFFFF",
          minHeight: "100%",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            ...imagePlaceholder,
            height: "320px",
            borderRadius: "20px",
            marginBottom: "16px",
            overflow: "hidden",
          }}
        >
          {item?.image || item?.thumbnail ? (
            <SafeImage
              src={item.image}
              fallbackSrc={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: "24px",
            lineHeight: 1.2,
            fontWeight: 600,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            margin: "10px 0 0",
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.55,
            fontSize: "14px",
          }}
        >
          {trimText(item.excerpt, 130)}
        </p>
      </article>
    </Link>
  );
}

function TopInsightSmall({ item }) {
  return (
    <Link
      to={buildDetailsLink(item.url)}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
    >
      <article
        style={{
          ...glassCard,
          borderRadius: "24px",
          padding: "14px",
          minHeight: "172px",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            ...imagePlaceholder,
            height: "100%",
            minHeight: "144px",
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          {item?.image || item?.thumbnail ? (
            <SafeImage
              src={item.image}
              fallbackSrc={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
      </article>
    </Link>
  );
}

function InsightListItem({ item, lang }) {
  return (
    <Link
      to={buildDetailsLink(item.url)}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <article
        style={{
          ...glassCard,
          borderRadius: "22px",
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: "16px",
          alignItems: "stretch",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            ...imagePlaceholder,
            borderRadius: "18px",
            overflow: "hidden",
            minHeight: "130px",
          }}
        >
          {item?.image || item?.thumbnail ? (
            <SafeImage
              src={item.image}
              fallbackSrc={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div style={{ color: "#FFFFFF" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "26px",
                padding: "0 10px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {item.category}
            </span>

            {item.date ? (
              <span
                style={{
                  color: "rgba(255,255,255,0.68)",
                  fontSize: "12px",
                }}
              >
                {item.date}
              </span>
            ) : null}
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "22px",
              lineHeight: 1.25,
              fontWeight: 600,
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              margin: "10px 0 0",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            {trimText(item.excerpt || item.content, 220)}
          </p>

          <div
            style={{
              marginTop: "12px",
              color: "#E8EFF7",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {lang === "ua" ? "Читати деталі" : "Read details"}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function InsightsPage() {
  const { lang } = useLang();

  const [insights, setInsights] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadInsights() {
      try {
        setLoading(true);
        setErrorText("");

        if (insightsCache[lang]) {
          setInsights(insightsCache[lang]);
          setLoading(false);
          return;
        }

        const response = lang === "ua" ? await getInsightsUa() : await getInsightsEn();
        if (!active) return;

        const normalized = normalizeInsights(response);
        insightsCache[lang] = normalized;
        setInsights(normalized);
      } catch (error) {
        console.error("Failed to load insights:", error);
        if (!active) return;

        setInsights([]);
        setErrorText(
          lang === "ua"
            ? "Не вдалося завантажити інсайти."
            : "Failed to load insights."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInsights();

    return () => {
      active = false;
    };
  }, [lang]);

  const filteredInsights = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return insights;

    return insights.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const excerpt = item.excerpt?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";

      return (
        title.includes(query) ||
        excerpt.includes(query) ||
        category.includes(query)
      );
    });
  }, [insights, search]);

  const firstLarge = filteredInsights[0];
  const secondMedium = filteredInsights[1];
  const sideCards = filteredInsights.slice(2, 4);
  const restNews = filteredInsights.slice(4);

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontSize: "42px",
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                {lang === "ua" ? "Панель інсайтів" : "Insider panel"}
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.76)",
                  fontSize: "16px",
                }}
              >
                {lang === "ua"
                  ? "Останні fintech-інсайти, новини та оновлення"
                  : "Latest fintech insights, news and updates"}
              </p>
            </div>

            <div
              style={{
                ...glassCard,
                borderRadius: "999px",
                width: "100%",
                maxWidth: "420px",
                height: "48px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  lang === "ua" ? "Пошук інсайтів..." : "Search insights..."
                }
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#FFFFFF",
                  fontSize: "14px",
                }}
              />

              <span
                style={{
                  color: "rgba(255,255,255,0.70)",
                  fontSize: "16px",
                }}
              >
                ⌕
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              style={{
                background: "#B3131A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                minHeight: "42px",
                padding: "0 18px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
              }}
            >
              {lang === "ua" ? "AI-асистент" : "AI assistant"}
            </button>
          </div>

          {loading ? (
            <div
              style={{
                ...glassCard,
                borderRadius: "24px",
                padding: "40px 24px",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              {lang === "ua" ? "Завантаження..." : "Loading..."}
            </div>
          ) : errorText ? (
            <div
              style={{
                ...glassCard,
                borderRadius: "24px",
                padding: "40px 24px",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              {errorText}
            </div>
          ) : filteredInsights.length === 0 ? (
            <div
              style={{
                ...glassCard,
                borderRadius: "24px",
                padding: "40px 24px",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              {lang === "ua"
                ? "Інсайти не знайдено."
                : "No insights found."}
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1fr",
                  gap: "18px",
                  alignItems: "stretch",
                }}
              >
                <div>
                  {firstLarge ? <TopInsightLarge item={firstLarge} /> : null}
                </div>

                <div>
                  {secondMedium ? <TopInsightMedium item={secondMedium} /> : null}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: "1fr 1fr",
                    gap: "18px",
                  }}
                >
                  {sideCards.map((item) => (
                    <TopInsightSmall key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <section style={{ marginTop: "28px" }}>
                <h2
                  style={{
                    margin: "0 0 18px",
                    color: "#FFFFFF",
                    fontSize: "30px",
                    fontWeight: 600,
                  }}
                >
                  {lang === "ua" ? "Усі новини" : "All news"}
                </h2>

                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                  }}
                >
                  {restNews.length > 0 ? (
                    restNews.map((item) => (
                      <InsightListItem
                        key={item.id}
                        item={item}
                        lang={lang}
                      />
                    ))
                  ) : (
                    <div
                      style={{
                        ...glassCard,
                        borderRadius: "22px",
                        padding: "24px",
                        color: "#FFFFFF",
                        textAlign: "center",
                      }}
                    >
                      {lang === "ua"
                        ? "Додаткових новин поки немає."
                        : "No more news yet."}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </section>
      </div>

      <InsightsAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}