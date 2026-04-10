import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import { useLang } from "../../context/LanguageContext";

const cardGlass = {
  background:
    "linear-gradient(180deg, rgba(8,38,72,0.98) 0%, rgba(6,31,59,0.98) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 30px rgba(0,0,0,0.16)",
};

const blockGlass = {
  background:
    "linear-gradient(180deg, rgba(245,247,250,0.96) 0%, rgba(239,243,248,0.96) 100%)",
  border: "1px solid rgba(8,38,72,0.06)",
  boxShadow: "0 14px 28px rgba(0,0,0,0.10)",
};

function formatHour(isoString) {
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:00`;
  } catch {
    return isoString;
  }
}

function buildRows(distributionMap) {
  return Object.entries(distributionMap || {})
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .map(([date, value], index) => ({
      id: `${date}-${index}`,
      date,
      label: formatHour(date),
      activeUsers: value,
    }));
}

function buildCountryRows(countriesMap) {
  const rows = Object.entries(countriesMap || {})
    .sort((a, b) => b[1] - a[1])
    .map(([country, value]) => ({
      country,
      value,
    }));

  const total = rows.reduce((sum, item) => sum + item.value, 0);

  return rows.map((item) => ({
    ...item,
    percent: total ? Math.round((item.value / total) * 100) : 0,
  }));
}

export default function AdminActivityPage() {
  const { lang } = useLang();

  const [since, setSince] = useState(7);
  const [distribution, setDistribution] = useState({});
  const [countries, setCountries] = useState({});
  const [loading, setLoading] = useState(true);

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "АКТИВНІСТЬ" : "ACTIVITY",
      searchPlaceholder: lang === "ua" ? "Пошук..." : "Search...",
      period: lang === "ua" ? "Період" : "Period",
      recentActivity: lang === "ua" ? "Журнал активності" : "Activity Log",
      countries: lang === "ua" ? "Країни" : "Countries",
      time: lang === "ua" ? "Час" : "Time",
      users: lang === "ua" ? "Активні користувачі" : "Active users",
      totalRecords: lang === "ua" ? "Записів" : "Records",
      topCountry: lang === "ua" ? "Топ країна" : "Top country",
      peakHour: lang === "ua" ? "Пік активності" : "Peak hour",
      noData: lang === "ua" ? "Немає даних" : "No data",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      days: lang === "ua" ? "днів" : "days",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function loadActivity() {
      try {
        setLoading(true);

        const { data } = await client.get("/telemetry/distribution", {
          params: { since },
        });

        if (!active) return;

        setDistribution(data?.distribution || {});
        setCountries(data?.countries || {});
      } catch (error) {
        console.error("Failed to load activity:", error);

        if (!active) return;

        setDistribution({});
        setCountries({});
      } finally {
        if (active) setLoading(false);
      }
    }

    loadActivity();

    return () => {
      active = false;
    };
  }, [since]);

  const rows = useMemo(() => buildRows(distribution), [distribution]);
  const countryRows = useMemo(() => buildCountryRows(countries), [countries]);

  const peakHour = useMemo(() => {
    if (!rows.length) return "-";
    const top = [...rows].sort((a, b) => b.activeUsers - a.activeUsers)[0];
    return top?.label || "-";
  }, [rows]);

  const topCountry = useMemo(() => {
    if (!countryRows.length) return "-";
    return countryRows[0]?.country || "-";
  }, [countryRows]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "18px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: "36px",
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {t.title}
        </h1>

        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            height: "34px",
            borderRadius: "999px",
            background: "#173B66",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            color: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#FFFFFF",
              fontSize: "13px",
            }}
          />
          <span style={{ fontSize: "12px" }}>⌕</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr)) auto",
          gap: "14px",
          alignItems: "stretch",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            ...cardGlass,
            borderRadius: "8px",
            minHeight: "92px",
            padding: "12px",
            color: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "14px" }}>
            {t.totalRecords}
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700 }}>
            {rows.length}
          </div>
        </div>

        <div
          style={{
            ...cardGlass,
            borderRadius: "8px",
            minHeight: "92px",
            padding: "12px",
            color: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "14px" }}>
            {t.topCountry}
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700 }}>
            {topCountry}
          </div>
        </div>

        <div
          style={{
            ...cardGlass,
            borderRadius: "8px",
            minHeight: "92px",
            padding: "12px",
            color: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "14px" }}>
            {t.peakHour}
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700 }}>
            {peakHour}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "end",
          }}
        >
          <select
            value={since}
            onChange={(e) => setSince(Number(e.target.value))}
            style={{
              height: "34px",
              minWidth: "110px",
              borderRadius: "999px",
              border: "none",
              outline: "none",
              padding: "0 12px",
              fontSize: "12px",
              color: "#20324A",
              background: "#FFFFFF",
            }}
          >
            <option value={1}>1 {t.days}</option>
            <option value={3}>3 {t.days}</option>
            <option value={7}>7 {t.days}</option>
            <option value={14}>14 {t.days}</option>
            <option value={30}>30 {t.days}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            ...blockGlass,
            borderRadius: "18px",
            padding: "30px",
            textAlign: "center",
            color: "#082947",
          }}
        >
          {t.loading}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 250px",
            gap: "14px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                ...blockGlass,
                borderRadius: "8px 8px 0 0",
                minHeight: "32px",
                padding: "8px 12px",
                color: "#082947",
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              {t.recentActivity}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.55)",
                borderRadius: "0 0 8px 8px",
                overflow: "hidden",
                border: "1px solid rgba(8,38,72,0.06)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1fr",
                  gap: "12px",
                  padding: "6px 12px",
                  fontSize: "11px",
                  color: "#6C7480",
                  background: "rgba(255,255,255,0.55)",
                  borderBottom: "1px solid rgba(8,38,72,0.08)",
                }}
              >
                <div>{t.time}</div>
                <div>{t.users}</div>
              </div>

              <div
                style={{
                  minHeight: "320px",
                  background: "rgba(255,255,255,0.76)",
                  padding: "8px 0",
                }}
              >
                {rows.length === 0 ? (
                  <div
                    style={{
                      height: "280px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6C7480",
                      fontSize: "13px",
                    }}
                  >
                    {t.noData}
                  </div>
                ) : (
                  rows.map((row) => (
                    <div
                      key={row.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.8fr 1fr",
                        gap: "12px",
                        padding: "10px 12px",
                        fontSize: "12px",
                        color: "#20324A",
                        borderBottom: "1px solid rgba(8,38,72,0.06)",
                      }}
                    >
                      <div>{row.label}</div>
                      <div>{row.activeUsers}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              ...blockGlass,
              borderRadius: "8px",
              minHeight: "360px",
              padding: "12px",
            }}
          >
            <div
              style={{
                marginBottom: "12px",
                color: "#082947",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {t.countries}
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {countryRows.length === 0 ? (
                <div
                  style={{
                    color: "#6C7480",
                    fontSize: "12px",
                    textAlign: "center",
                    paddingTop: "20px",
                  }}
                >
                  {t.noData}
                </div>
              ) : (
                countryRows.map((item) => (
                  <div
                    key={item.country}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: "10px",
                      alignItems: "center",
                      fontSize: "12px",
                      color: "#20324A",
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(8,38,72,0.06)",
                    }}
                  >
                    <div>{item.country}</div>
                    <div>{item.value}</div>
                    <div>{item.percent}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}