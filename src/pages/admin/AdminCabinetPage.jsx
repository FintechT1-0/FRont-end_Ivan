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

export default function AdminCabinetPage() {
  const { lang } = useLang();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_courses: 0,
  });
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "ПАНЕЛЬ" : "DASHBOARD",
      users: lang === "ua" ? "Користувачі" : "Users",
      activeUsers: lang === "ua" ? "Активні користувачі" : "Active users",
      courses: lang === "ua" ? "Курси" : "Courses",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      fail:
        lang === "ua"
          ? "Не вдалося завантажити статистику"
          : "Failed to load stats",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        setLoading(true);
        setErrorText("");

        const { data } = await client.get("/telemetry/numerical");
        if (!active) return;

        setStats(
          data || {
            total_users: 0,
            active_users: 0,
            total_courses: 0,
          }
        );
      } catch (error) {
        if (!active) return;
        setErrorText(getBackendError(error, t.fail));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, [t.fail]);

  return (
    <div style={{ width: "100%", maxWidth: "930px" }}>
      <h1
        style={{
          margin: "0 0 18px",
          color: "#FFFFFF",
          fontSize: "18px",
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        {t.title}
      </h1>

      {loading ? (
        <div style={panelStyle}>{t.loading}</div>
      ) : errorText ? (
        <div style={panelStyle}>{errorText}</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>{t.users}</div>
            <div style={valueStyle}>{stats.total_users}</div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>{t.activeUsers}</div>
            <div style={valueStyle}>{stats.active_users}</div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>{t.courses}</div>
            <div style={valueStyle}>{stats.total_courses}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const panelStyle = {
  borderRadius: "10px",
  background: "rgba(255,255,255,0.96)",
  padding: "16px",
  color: "#20324A",
  fontSize: "12px",
};

const cardStyle = {
  borderRadius: "10px",
  background: "#082947",
  color: "#FFFFFF",
  minHeight: "106px",
  padding: "16px",
};

const labelStyle = {
  fontSize: "12px",
  opacity: 0.9,
  marginBottom: "12px",
};

const valueStyle = {
  fontSize: "30px",
  fontWeight: 700,
};