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
      fail: lang === "ua" ? "Не вдалося завантажити профіль" : "Failed to load profile",

      profile: lang === "ua" ? "Профіль" : "Profile",
      profileHint:
        lang === "ua"
          ? "Дані твого акаунта"
          : "Your account information",

      name: lang === "ua" ? "Імʼя" : "First name",
      surname: lang === "ua" ? "Прізвище" : "Last name",
      email: lang === "ua" ? "Пошта" : "Email address",
      role: lang === "ua" ? "Роль" : "Role",
      status: lang === "ua" ? "Статус" : "Status",
      active: lang === "ua" ? "Активний" : "Active",
      suspended: lang === "ua" ? "Заблокований" : "Suspended",

      ai: lang === "ua" ? "AI-асистент" : "AI assistant",
      aiText:
        lang === "ua"
          ? "Асистент доступний через плаваючу кнопку. Він підбирає релевантні інсайти за твоїм запитом."
          : "The assistant is available through the floating button. It recommends relevant insights based on your request.",

      courses: lang === "ua" ? "Курси" : "Courses",
      insights: lang === "ua" ? "Інсайди" : "Insights",
      openCourses: lang === "ua" ? "Перейти до курсів" : "Go to courses",
      openInsights: lang === "ua" ? "Перейти до інсайтів" : "Go to insights",

      extra: lang === "ua" ? "Додаткові можливості" : "Extra features",
      savedCourses: lang === "ua" ? "Збережені курси" : "Saved courses",
      viewedInsights: lang === "ua" ? "Переглянуті інсайти" : "Viewed insights",
      recommendations: lang === "ua" ? "Персональні рекомендації" : "Personal recommendations",

      inProgress: lang === "ua" ? "Сектор у розробці" : "Section in progress",
      inProgressText:
        lang === "ua"
          ? "Бекенд поки не передає ці дані."
          : "Backend does not return this data yet.",

      note:
        lang === "ua"
          ? "Фото профілю, мобільний номер, адреса та біо поки не реалізовані на бекенді."
          : "Profile photo, mobile number, address and bio are not implemented on the backend yet.",
    };
  }, [lang]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setErrorText("");

        const { data } = await client.get("/auth/me");
        if (!active) return;

        setUser(data);
      } catch (error) {
        if (!active) return;
        setUser(null);
        setErrorText(getBackendError(error, t.fail));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [t.fail]);

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>{t.title}</h1>

        {loading ? (
          <div style={whitePanel}>{t.loading}</div>
        ) : errorText ? (
          <div style={whitePanel}>{errorText}</div>
        ) : user ? (
          <div style={whitePanel}>
            <section style={topSection}>
              <div>
                <h2 style={sectionTitle}>{t.profile}</h2>
                <p style={sectionHint}>{t.profileHint}</p>
              </div>

              <div style={avatarWrap}>
                <div style={avatarCircle}>◉</div>
                <div style={mutedNote}>{t.note}</div>
              </div>
            </section>

            <section style={formSection}>
              <div>
                <h3 style={smallTitle}>{t.profile}</h3>
                <p style={sectionHint}>{t.profileHint}</p>
              </div>

              <div style={infoGrid}>
                <Info label={t.name} value={user.name || "-"} />
                <Info label={t.surname} value={user.surname || "-"} />
                <Info label={t.email} value={user.email || "-"} />
                <Info label={t.role} value={user.role || "-"} />
                <Info
                  label={t.status}
                  value={user.is_suspended ? t.suspended : t.active}
                />
              </div>
            </section>

            <section style={formSection}>
              <div>
                <h3 style={smallTitle}>{t.ai}</h3>
                <p style={sectionHint}>{t.aiText}</p>
              </div>

              <div style={actionsGrid}>
                <Link to="/courses" style={primaryBtn}>
                  {t.openCourses}
                </Link>

                <Link to="/insights" style={secondaryBtn}>
                  {t.openInsights}
                </Link>
              </div>
            </section>

            <section style={formSection}>
              <div>
                <h3 style={smallTitle}>{t.extra}</h3>
                <p style={sectionHint}>{t.inProgressText}</p>
              </div>

              <div style={cardsGrid}>
                <DisabledCard title={t.savedCourses} badge={t.inProgress} />
                <DisabledCard title={t.viewedInsights} badge={t.inProgress} />
                <DisabledCard title={t.recommendations} badge={t.inProgress} />
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={inputLike}>{value}</div>
    </div>
  );
}

function DisabledCard({ title, badge }) {
  return (
    <div style={disabledCard}>
      <div style={disabledTitle}>{title}</div>
      <div style={disabledBadge}>{badge}</div>
    </div>
  );
}

const page = {
  minHeight: "90vh",
  background: "#56677F",
  color: "#FFFFFF",
  padding: "34px 18px 54px",
};

const container = {
  maxWidth: "1120px",
  margin: "0 auto",
};

const title = {
  margin: "0 0 22px",
  color: "#FFFFFF",
  fontSize: "36px",
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "0.02em",
};

const whitePanel = {
  background: "#FFFFFF",
  color: "#101828",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const topSection = {
  display: "grid",
  gridTemplateColumns: "220px 1fr",
  gap: "32px",
  padding: "28px 32px",
  borderBottom: "1px solid #D9DEE7",
};

const formSection = {
  display: "grid",
  gridTemplateColumns: "220px 1fr",
  gap: "32px",
  padding: "26px 32px",
  borderBottom: "1px solid #D9DEE7",
};

const sectionTitle = {
  margin: 0,
  color: "#101828",
  fontSize: "18px",
  fontWeight: 800,
};

const smallTitle = {
  margin: 0,
  color: "#101828",
  fontSize: "17px",
  fontWeight: 800,
};

const sectionHint = {
  margin: "6px 0 0",
  color: "#101828",
  fontSize: "12px",
  lineHeight: 1.5,
};

const avatarWrap = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
};

const avatarCircle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: "#082947",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
};

const mutedNote = {
  maxWidth: "360px",
  color: "#667085",
  fontSize: "12px",
  lineHeight: 1.5,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px 42px",
};

const labelStyle = {
  color: "#101828",
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "8px",
};

const inputLike = {
  minHeight: "36px",
  borderRadius: "7px",
  border: "1px solid #AEB4BE",
  padding: "8px 12px",
  color: "#101828",
  fontSize: "13px",
  background: "#FFFFFF",
};

const actionsGrid = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
};

const primaryBtn = {
  minWidth: "150px",
  height: "36px",
  borderRadius: "7px",
  background: "#2E5D8C",
  color: "#FFFFFF",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
};

const secondaryBtn = {
  minWidth: "150px",
  height: "36px",
  borderRadius: "7px",
  border: "1px solid #2E5D8C",
  background: "#FFFFFF",
  color: "#2E5D8C",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "14px",
};

const disabledCard = {
  minHeight: "96px",
  borderRadius: "14px",
  border: "1px dashed #AEB4BE",
  background: "#F4F6F9",
  padding: "14px",
};

const disabledTitle = {
  color: "#101828",
  fontSize: "14px",
  fontWeight: 800,
  marginBottom: "12px",
};

const disabledBadge = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "24px",
  padding: "0 10px",
  borderRadius: "999px",
  background: "#E8EEF6",
  color: "#2E5D8C",
  fontSize: "11px",
  fontWeight: 800,
};