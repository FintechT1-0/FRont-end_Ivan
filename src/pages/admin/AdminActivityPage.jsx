import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import { useLang } from "../../context/LanguageContext";

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return fallback;
}

function formatDateLabel(dateString) {
  const date = new Date(dateString);

  return `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function groupDistributionByDay(distributionMap) {
  const grouped = {};

  Object.entries(distributionMap || {}).forEach(([timestamp, value]) => {
    const date = new Date(timestamp);
    const key = date.toISOString().slice(0, 10);

    grouped[key] = (grouped[key] || 0) + Number(value || 0);
  });

  return Object.entries(grouped)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, value]) => ({
      date,
      label: formatDateLabel(date),
      value,
    }));
}

function buildCountriesRows(countriesMap) {
  const rows = Object.entries(countriesMap || {})
    .map(([country, value]) => ({
      country,
      value: Number(value || 0),
    }))
    .sort((a, b) => b.value - a.value);

  const total = rows.reduce((sum, item) => sum + item.value, 0);

  return rows.map((item) => ({
    ...item,
    percent: total ? Math.round((item.value / total) * 100) : 0,
  }));
}

export default function AdminActivityPage() {
  const { lang } = useLang();

  const [loading, setLoading] = useState(true);
  const [since, setSince] = useState(7);
  const [distribution, setDistribution] = useState({});
  const [countries, setCountries] = useState({});
  const [numerical, setNumerical] = useState({
    total_users: 0,
    active_users: 0,
    total_courses: 0,
  });
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "АКТИВНІСТЬ" : "ACTIVITY",
      subtitle:
        lang === "ua"
          ? "Огляд активності користувачів за даними телеметрії"
          : "User activity overview based on telemetry data",
      period: lang === "ua" ? "Період" : "Period",
      days7: lang === "ua" ? "7 днів" : "7 days",
      days14: lang === "ua" ? "14 днів" : "14 days",
      days30: lang === "ua" ? "30 днів" : "30 days",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      noData: lang === "ua" ? "Немає даних" : "No data",
      chart:
        lang === "ua"
          ? "Активні користувачі по днях"
          : "Active users by day",
      countries: lang === "ua" ? "Країни" : "Countries",
      totalUsers: lang === "ua" ? "Усього користувачів" : "Total users",
      activeUsers: lang === "ua" ? "Активні користувачі" : "Active users",
      totalCourses: lang === "ua" ? "Усього курсів" : "Total courses",
      visits: lang === "ua" ? "активностей" : "activities",
      popularTags: lang === "ua" ? "Популярні теги" : "Popular tags",
      popularCourses:
        lang === "ua" ? "Популярні курси" : "Popular courses",
      popularInsights:
        lang === "ua" ? "Популярні інсайди" : "Popular insights",
      inProgress:
        lang === "ua" ? "Сектор у розробці" : "Section in progress",
      inProgressText:
        lang === "ua"
          ? "Бекенд поки не передає ці дані. Потрібні події перегляду курсів, інсайтів і тегів."
          : "Backend does not return this data yet. Course, insight and tag view events are needed.",
      explanation:
        lang === "ua"
          ? "Дані згруповані по днях на основі погодинної відповіді /telemetry/distribution."
          : "Data is grouped by day based on the hourly /telemetry/distribution response.",
      fail:
        lang === "ua"
          ? "Не вдалося завантажити телеметрію"
          : "Failed to load telemetry",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setErrorText("");

        const [distributionRes, numericalRes] = await Promise.all([
          client.get("/telemetry/distribution", { params: { since } }),
          client.get("/telemetry/numerical"),
        ]);

        if (!active) return;

        setDistribution(distributionRes.data?.distribution || {});
        setCountries(distributionRes.data?.countries || {});
        setNumerical({
          total_users: numericalRes.data?.total_users || 0,
          active_users: numericalRes.data?.active_users || 0,
          total_courses: numericalRes.data?.total_courses || 0,
        });
      } catch (error) {
        if (!active) return;

        setDistribution({});
        setCountries({});
        setErrorText(getBackendError(error, t.fail));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [since, t.fail]);

  const dailyRows = useMemo(
    () => groupDistributionByDay(distribution),
    [distribution]
  );

  const countriesRows = useMemo(
    () => buildCountriesRows(countries),
    [countries]
  );

  const maxDailyValue = Math.max(...dailyRows.map((item) => item.value), 1);

  return (
    <div style={{ width: "100%", maxWidth: "930px" }}>
      <div style={headerRow}>
        <div>
          <h1 style={pageTitle}>{t.title}</h1>
          <p style={subtitle}>{t.subtitle}</p>
        </div>

        <div style={periodWrap}>
          <span style={{ fontSize: "11px" }}>{t.period}</span>

          <button
            type="button"
            onClick={() => setSince(7)}
            style={periodButtonStyle(since === 7)}
          >
            {t.days7}
          </button>

          <button
            type="button"
            onClick={() => setSince(14)}
            style={periodButtonStyle(since === 14)}
          >
            {t.days14}
          </button>

          <button
            type="button"
            onClick={() => setSince(30)}
            style={periodButtonStyle(since === 30)}
          >
            {t.days30}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={panelStyle}>{t.loading}</div>
      ) : errorText ? (
        <div style={panelStyle}>{errorText}</div>
      ) : (
        <>
          <div style={statsGrid}>
            <StatCard label={t.totalUsers} value={numerical.total_users} />
            <StatCard label={t.activeUsers} value={numerical.active_users} />
            <StatCard label={t.totalCourses} value={numerical.total_courses} />
          </div>

          <div style={mainGrid}>
            <div style={panelStyle}>
              <div style={panelTitle}>{t.chart}</div>

              {dailyRows.length === 0 ? (
                <Empty text={t.noData} />
              ) : (
                <>
                  <div style={barChart}>
                    {dailyRows.map((item) => {
                      const height = Math.max(
                        8,
                        Math.round((item.value / maxDailyValue) * 180)
                      );

                      return (
                        <div key={item.date} style={barItem}>
                          <div style={barValue}>{item.value}</div>

                          <div
                            title={`${item.label}: ${item.value} ${t.visits}`}
                            style={{
                              ...bar,
                              height: `${height}px`,
                            }}
                          />

                          <div style={barLabel}>{item.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={chartNote}>{t.explanation}</div>
                </>
              )}
            </div>

            <div style={panelStyle}>
              <div style={panelTitle}>{t.countries}</div>

              {countriesRows.length === 0 ? (
                <Empty text={t.noData} />
              ) : (
                <div style={countriesGrid}>
                  {countriesRows.map((item) => (
                    <div key={item.country}>
                      <div style={countryTop}>
                        <span>{item.country}</span>
                        <span>
                          {item.value} · {item.percent}%
                        </span>
                      </div>

                      <div style={progressTrack}>
                        <div
                          style={{
                            ...progressFill,
                            width: `${item.percent}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={disabledGrid}>
            <DisabledPanel title={t.popularTags} text={t.inProgressText} badge={t.inProgress} />
            <DisabledPanel title={t.popularCourses} text={t.inProgressText} badge={t.inProgress} />
            <DisabledPanel title={t.popularInsights} text={t.inProgressText} badge={t.inProgress} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

function Empty({ text }) {
  return <div style={emptyState}>{text}</div>;
}

function DisabledPanel({ title, text, badge }) {
  return (
    <div style={disabledPanel}>
      <div style={disabledTop}>
        <div style={panelTitle}>{title}</div>
        <span style={disabledBadge}>{badge}</span>
      </div>

      <p style={disabledText}>{text}</p>
    </div>
  );
}

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "16px",
  marginBottom: "16px",
  flexWrap: "wrap",
};

const pageTitle = {
  margin: 0,
  color: "#FFFFFF",
  fontSize: "18px",
  lineHeight: 1,
  fontWeight: 700,
  letterSpacing: "0.02em",
};

const subtitle = {
  margin: "8px 0 0",
  color: "rgba(255,255,255,0.75)",
  fontSize: "12px",
};

const periodWrap = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#FFFFFF",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "14px",
  marginBottom: "16px",
};

const statCard = {
  background: "#082947",
  borderRadius: "10px",
  padding: "16px",
  minHeight: "86px",
  color: "#FFFFFF",
  boxShadow: "0 10px 18px rgba(0,0,0,0.12)",
};

const statLabel = {
  fontSize: "12px",
  color: "rgba(255,255,255,0.75)",
  marginBottom: "12px",
};

const statValue = {
  fontSize: "26px",
  lineHeight: 1,
  fontWeight: 800,
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  alignItems: "start",
};

const panelStyle = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: "10px",
  padding: "16px",
  minHeight: "260px",
};

const panelTitle = {
  color: "#20324A",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "14px",
};

const barChart = {
  height: "250px",
  display: "flex",
  alignItems: "flex-end",
  gap: "6px",
  padding: "18px 4px 0",
  borderBottom: "1px solid #D6DCE5",
  overflowX: "auto",
};

const barItem = {
  flex: "1 0 22px",
  minWidth: "22px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  height: "100%",
};

const barValue = {
  color: "#20324A",
  fontSize: "10px",
  fontWeight: 700,
  marginBottom: "6px",
  minHeight: "12px",
};

const bar = {
  width: "100%",
  maxWidth: "28px",
  borderRadius: "8px 8px 0 0",
  background: "#0F2F52",
};

const barLabel = {
  marginTop: "8px",
  color: "#7D8796",
  fontSize: "10px",
};

const chartNote = {
  marginTop: "14px",
  color: "#6F7A89",
  fontSize: "11px",
  lineHeight: 1.5,
};

const countriesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px 18px",
};

const countryTop = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  marginBottom: "6px",
  color: "#20324A",
  fontSize: "11px",
};

const progressTrack = {
  width: "100%",
  height: "10px",
  borderRadius: "999px",
  background: "#E8ECF2",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  borderRadius: "999px",
  background: "#0F2F52",
};

const disabledGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
  marginTop: "16px",
};

const disabledPanel = {
  background: "rgba(255,255,255,0.78)",
  borderRadius: "10px",
  padding: "16px",
  minHeight: "130px",
  border: "1px dashed rgba(15,47,82,0.25)",
};

const disabledTop = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "flex-start",
};

const disabledBadge = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "22px",
  padding: "0 8px",
  borderRadius: "999px",
  background: "rgba(15,47,82,0.10)",
  color: "#0F2F52",
  fontSize: "10px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const disabledText = {
  margin: "8px 0 0",
  color: "#6F7A89",
  fontSize: "11px",
  lineHeight: 1.5,
};

const emptyState = {
  minHeight: "220px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6F7A89",
  fontSize: "12px",
};

function periodButtonStyle(active) {
  return {
    minWidth: "68px",
    height: "28px",
    borderRadius: "999px",
    border: active ? "none" : "1px solid rgba(255,255,255,0.18)",
    background: active ? "#B3131A" : "transparent",
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: active ? "0 8px 16px rgba(179,19,26,0.22)" : "none",
  };
}