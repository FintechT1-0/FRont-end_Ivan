import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { useLang } from "../context/LanguageContext";

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return fallback;
}

export default function UserCabinetPage() {
  const { lang } = useLang();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "КАБІНЕТ" : "CABINET",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      fail:
        lang === "ua"
          ? "Не вдалося завантажити профіль"
          : "Failed to load profile",

      profile: lang === "ua" ? "Профіль" : "Profile",
      hint: lang === "ua" ? "Дані твого акаунта" : "Your account data",

      name: lang === "ua" ? "Імʼя" : "Name",
      surname: lang === "ua" ? "Прізвище" : "Surname",
      email: lang === "ua" ? "Пошта" : "Email",
      role: lang === "ua" ? "Роль" : "Role",
      status: lang === "ua" ? "Статус" : "Status",
      active: lang === "ua" ? "Активний" : "Active",
      suspended: lang === "ua" ? "Заблокований" : "Suspended",

      ai: lang === "ua" ? "AI-асистент" : "AI assistant",
      aiText:
        lang === "ua"
          ? "Асистент доступний через кнопку внизу. Він підбирає релевантні інсайти за твоїм запитом."
          : "Assistant is available via the floating button. It recommends relevant insights based on your request.",

      goCourses: lang === "ua" ? "Перейти до курсів" : "Go to courses",
      goInsights: lang === "ua" ? "Перейти до інсайтів" : "Go to insights",

      extra: lang === "ua" ? "Додаткові можливості" : "Extra features",
      saved: lang === "ua" ? "Збережені курси" : "Saved courses",
      viewed: lang === "ua" ? "Переглянуті інсайти" : "Viewed insights",
      recs: lang === "ua" ? "Рекомендації" : "Recommendations",

      dev: lang === "ua" ? "Сектор у розробці" : "In development",
      devText:
        lang === "ua"
          ? "Бекенд ще не віддає ці дані."
          : "Backend does not provide this data yet.",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setErrorText("");

        const { data } = await client.get("/auth/me");
        if (!active) return;

        setUser(data);
      } catch (e) {
        if (!active) return;
        setErrorText(getBackendError(e, t.fail));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [t.fail]);

  return (
    <div style={page}>
      <div style={wrap}>
        <h1 style={title}>{t.title}</h1>

        {loading ? (
          <div style={card}>
            <div style={message}>{t.loading}</div>
          </div>
        ) : errorText ? (
          <div style={card}>
            <div style={message}>{errorText}</div>
          </div>
        ) : user ? (
          <div style={card}>
            <div style={section}>
              <div>
                <h2 style={h2}>{t.profile}</h2>
                <p style={hint}>{t.hint}</p>
              </div>

              <div style={grid}>
                <Field label={t.name} value={user.name} />
                <Field label={t.surname} value={user.surname} />
                <Field label={t.email} value={user.email} />
                <Field label={t.role} value={user.role} />
                <Field
                  label={t.status}
                  value={user.is_suspended ? t.suspended : t.active}
                />
              </div>
            </div>

            <div style={section}>
              <div>
                <h2 style={h2}>{t.ai}</h2>
                <p style={hint}>{t.aiText}</p>
              </div>

              <div style={actions}>
                <Link to="/courses" style={btnPrimary}>
                  {t.goCourses}
                </Link>

                <Link to="/insights" style={btnGhost}>
                  {t.goInsights}
                </Link>
              </div>
            </div>

            <div style={sectionLast}>
              <div>
                <h2 style={h2}>{t.extra}</h2>
                <p style={hint}>{t.devText}</p>
              </div>

              <div style={extraGrid}>
                <DevCard title={t.saved} badge={t.dev} />
                <DevCard title={t.viewed} badge={t.dev} />
                <DevCard title={t.recs} badge={t.dev} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={input}>{value || "-"}</div>
    </div>
  );
}

function DevCard({ title, badge }) {
  return (
    <div style={devCard}>
      <div style={devTitle}>{title}</div>
      <div style={devBadge}>{badge}</div>
    </div>
  );
}

const page = {
  background: "#56677F",
  minHeight: "100vh",
  padding: "32px 16px",
};

const wrap = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const title = {
  color: "#FFFFFF",
  fontSize: "34px",
  fontWeight: 800,
  margin: "0 0 20px",
};

const card = {
  background: "#FFFFFF",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
};

const message = {
  padding: "24px 28px",
  color: "#101828",
  fontSize: "14px",
  fontWeight: 700,
};

const section = {
  display: "grid",
  gridTemplateColumns: "240px 1fr",
  gap: "30px",
  padding: "26px 28px",
  borderBottom: "1px solid #E3E7EE",
};

const sectionLast = {
  ...section,
  borderBottom: "none",
};

const h2 = {
  margin: 0,
  color: "#101828",
  fontSize: "18px",
  fontWeight: 800,
};

const hint = {
  fontSize: "12px",
  color: "#344054",
  margin: "6px 0 0",
  lineHeight: 1.5,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px 30px",
};

const labelStyle = {
  color: "#101828",
  fontSize: "13px",
  fontWeight: 800,
  marginBottom: "6px",
};

const input = {
  minHeight: "38px",
  border: "1px solid #C7CEDA",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  color: "#101828",
  background: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 700,
  wordBreak: "break-word",
};

const actions = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const btnPrimary = {
  background: "#2E5D8C",
  color: "#FFFFFF",
  padding: "9px 18px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: "13px",
};

const btnGhost = {
  border: "1px solid #2E5D8C",
  color: "#2E5D8C",
  background: "#FFFFFF",
  padding: "9px 18px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: "13px",
};

const extraGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "14px",
};

const devCard = {
  border: "1px dashed #B8C1CE",
  borderRadius: "12px",
  padding: "14px",
  background: "#F5F7FB",
};

const devTitle = {
  color: "#101828",
  fontWeight: 800,
  marginBottom: "8px",
  fontSize: "13px",
};

const devBadge = {
  color: "#2E5D8C",
  fontSize: "11px",
  fontWeight: 800,
  padding: "5px 10px",
  borderRadius: "999px",
  background: "#E3E9F2",
  display: "inline-block",
};