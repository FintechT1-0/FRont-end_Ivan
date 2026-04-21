import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import { useLang } from "../../context/LanguageContext";

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

function buildDistributionRows(distributionMap) {
  return Object.entries(distributionMap || {})
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([timestamp, value]) => {
      const date = new Date(timestamp);

      return {
        timestamp,
        value,
        label: `${String(date.getDate()).padStart(2, "0")}.${String(
          date.getMonth() + 1
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:00`,
      };
    });
}

function buildCountriesRows(countriesMap) {
  const rows = Object.entries(countriesMap || {})
    .map(([country, value]) => ({
      country,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const total = rows.reduce((sum, item) => sum + item.value, 0);

  return rows.map((item) => ({
    ...item,
    percent: total ? Math.round((item.value / total) * 100) : 0,
  }));
}

function buildLinePoints(rows, width = 760, height = 220) {
  if (!rows.length) return "";

  const maxValue = Math.max(...rows.map((item) => item.value), 1);
  const stepX = rows.length > 1 ? width / (rows.length - 1) : width / 2;

  return rows
    .map((item, index) => {
      const x = index * stepX;
      const y = height - (item.value / maxValue) * (height - 24) - 12;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function AdminActivityPage() {
  const { lang } = useLang();

  const [loading, setLoading] = useState(true);
  const [since, setSince] = useState(7);
  const [distribution, setDistribution] = useState({});
  const [countries, setCountries] = useState({});
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "АКТИВНІСТЬ" : "ACTIVITY",
      subtitle:
        lang === "ua"
          ? "Телеметрія активних користувачів"
          : "Active users telemetry",
      period: lang === "ua" ? "Період" : "Period",
      days7: lang === "ua" ? "7 днів" : "7 days",
      days14: lang === "ua" ? "14 днів" : "14 days",
      days30: lang === "ua" ? "30 днів" : "30 days",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      noData: lang === "ua" ? "Немає даних" : "No data",
      chart: lang === "ua" ? "Активні користувачі" : "Active users",
      countries: lang === "ua" ? "Країни" : "Countries",
      users: lang === "ua" ? "користувачів" : "users",
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

        const { data } = await client.get("/telemetry/distribution", {
          params: { since },
        });

        if (!active) return;

        setDistribution(data?.distribution || {});
        setCountries(data?.countries || {});
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

  const rows = useMemo(() => buildDistributionRows(distribution), [distribution]);
  const countriesRows = useMemo(() => buildCountriesRows(countries), [countries]);
  const polylinePoints = useMemo(() => buildLinePoints(rows), [rows]);

  return (
    <div style={{ width: "100%", maxWidth: "930px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#FFFFFF",
              fontSize: "18px",
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "rgba(255,255,255,0.75)",
              fontSize: "12px",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#FFFFFF",
          }}
        >
          <span style={{ fontSize: "11px" }}>{t.period}</span>

          <button type="button" onClick={() => setSince(7)} style={periodButtonStyle(since === 7)}>
            {t.days7}
          </button>

          <button type="button" onClick={() => setSince(14)} style={periodButtonStyle(since === 14)}>
            {t.days14}
          </button>

          <button type="button" onClick={() => setSince(30)} style={periodButtonStyle(since === 30)}>
            {t.days30}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={panelStyle}>{t.loading}</div>
      ) : errorText ? (
        <div style={panelStyle}>{errorText}</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <div style={panelStyle}>
            <div
              style={{
                color: "#20324A",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              {t.chart}
            </div>

            {rows.length === 0 ? (
              <div
                style={{
                  minHeight: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6F7A89",
                  fontSize: "12px",
                }}
              >
                {t.noData}
              </div>
            ) : (
              <>
                <svg
                  width="100%"
                  viewBox="0 0 760 240"
                  preserveAspectRatio="none"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "240px",
                  }}
                >
                  <line x1="0" y1="228" x2="760" y2="228" stroke="#D6DCE5" strokeWidth="1" />
                  <polyline
                    fill="none"
                    stroke="#0F2F52"
                    strokeWidth="4"
                    points={polylinePoints}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px 12px",
                    marginTop: "12px",
                  }}
                >
                  {rows.slice(-6).map((row) => (
                    <div key={row.timestamp}>
                      <div
                        style={{
                          color: "#7D8796",
                          fontSize: "10px",
                          marginBottom: "2px",
                        }}
                      >
                        {row.label}
                      </div>
                      <div
                        style={{
                          color: "#20324A",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {row.value} {t.users}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={panelStyle}>
            <div
              style={{
                color: "#20324A",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              {t.countries}
            </div>

            {countriesRows.length === 0 ? (
              <div
                style={{
                  minHeight: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6F7A89",
                  fontSize: "12px",
                }}
              >
                {t.noData}
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {countriesRows.map((item) => (
                  <div key={item.country}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "6px",
                        color: "#20324A",
                        fontSize: "11px",
                      }}
                    >
                      <span>{item.country}</span>
                      <span>{item.percent}%</span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        borderRadius: "999px",
                        background: "#E8ECF2",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.percent}%`,
                          height: "100%",
                          borderRadius: "999px",
                          background: "#0F2F52",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: "10px",
  padding: "16px",
  minHeight: "320px",
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