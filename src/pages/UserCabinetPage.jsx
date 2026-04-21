import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { useLang } from "../context/LanguageContext";

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

const glassCard = {
  background:
    "linear-gradient(180deg, rgba(19, 54, 90, 0.78) 0%, rgba(10, 37, 67, 0.88) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

export default function UserCabinetPage() {
  const { lang } = useLang();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "КАБІНЕТ КОРИСТУВАЧА" : "USER CABINET",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      fail:
        lang === "ua"
          ? "Не вдалося завантажити профіль"
          : "Failed to load profile",
      name: lang === "ua" ? "Ім'я" : "Name",
      surname: lang === "ua" ? "Прізвище" : "Surname",
      email: "Email",
      role: lang === "ua" ? "Роль" : "Role",
      status: lang === "ua" ? "Статус" : "Status",
      active: lang === "ua" ? "Активний" : "Active",
      suspended: lang === "ua" ? "Заблокований" : "Suspended",
      courses: lang === "ua" ? "Перейти до курсів" : "Go to courses",
      insights: lang === "ua" ? "Перейти до інсайтів" : "Go to insights",
      assistant:
        lang === "ua"
          ? "AI-асистент доступний через плаваючу кнопку внизу екрана"
          : "AI assistant is available through the floating button at the bottom",
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
    <div className="min-h-[90vh] bg-[#082947] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8">{t.title}</h1>

        {loading ? (
          <div style={glassCard} className="rounded-[28px] p-6">
            {t.loading}
          </div>
        ) : errorText ? (
          <div style={glassCard} className="rounded-[28px] p-6">
            {errorText}
          </div>
        ) : user ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div style={glassCard} className="rounded-[28px] p-6">
              <div className="grid gap-4 text-sm">
                <div>
                  <span className="text-white/60">{t.name}: </span>
                  <span>{user.name || "-"}</span>
                </div>

                <div>
                  <span className="text-white/60">{t.surname}: </span>
                  <span>{user.surname || "-"}</span>
                </div>

                <div>
                  <span className="text-white/60">{t.email}: </span>
                  <span>{user.email || "-"}</span>
                </div>

                <div>
                  <span className="text-white/60">{t.role}: </span>
                  <span>{user.role || "-"}</span>
                </div>

                <div>
                  <span className="text-white/60">{t.status}: </span>
                  <span>{user.is_suspended ? t.suspended : t.active}</span>
                </div>
              </div>
            </div>

            <div style={glassCard} className="rounded-[28px] p-6">
              <div className="text-sm text-white/85 leading-7 mb-5">
                {t.assistant}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="px-5 py-2 rounded-full text-sm font-medium text-white"
                  style={{
                    background: "#B3131A",
                    boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
                  }}
                >
                  {t.courses}
                </Link>

                <Link
                  to="/insights"
                  className="px-5 py-2 rounded-full text-sm font-medium text-white bg-white/10 hover:bg-white/15"
                >
                  {t.insights}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}