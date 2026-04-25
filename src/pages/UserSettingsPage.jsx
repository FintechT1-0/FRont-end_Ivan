import { useEffect, useMemo, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

function getBackendError(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return fallback;
}

export default function UserSettingsPage() {
  const { lang, toggleLang } = useLang();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");

  const t = useMemo(() => {
    return {
      title: lang === "ua" ? "НАЛАШТУВАННЯ" : "SETTINGS",
      profile: lang === "ua" ? "Профіль" : "Profile",
      account: lang === "ua" ? "Акаунт" : "Account",
      language: lang === "ua" ? "Мова інтерфейсу" : "Interface language",
      security: lang === "ua" ? "Безпека" : "Security",
      name: lang === "ua" ? "Імʼя" : "Name",
      surname: lang === "ua" ? "Прізвище" : "Surname",
      email: lang === "ua" ? "Пошта" : "Email",
      role: lang === "ua" ? "Роль" : "Role",
      status: lang === "ua" ? "Статус" : "Status",
      active: lang === "ua" ? "Активний" : "Active",
      suspended: lang === "ua" ? "Заблокований" : "Suspended",
      changeLang: lang === "ua" ? "Змінити на EN" : "Switch to UA",
      resend: lang === "ua" ? "Надіслати лист ще раз" : "Resend email",
      logout: lang === "ua" ? "Вийти з акаунта" : "Sign out",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      fail: lang === "ua" ? "Не вдалося завантажити профіль" : "Failed to load profile",
      resendOk:
        lang === "ua"
          ? "Лист підтвердження надіслано."
          : "Verification email has been sent.",
      resendFail:
        lang === "ua"
          ? "Не вдалося надіслати лист."
          : "Failed to resend email.",
      readonly:
        lang === "ua"
          ? "Ці дані доступні тільки для перегляду. Бекенд поки не має оновлення профілю або зміни пароля."
          : "These fields are read-only. Backend does not support profile update or password change yet.",
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
      } catch (error) {
        if (!active) return;
        setErrorText(getBackendError(error, t.fail));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [t.fail]);

  async function resendEmail() {
    if (!user?.email) return;

    try {
      setSending(true);
      setMessage("");
      setErrorText("");

      await client.post("/auth/resend", {
        email: user.email,
      });

      setMessage(t.resendOk);
    } catch (error) {
      setErrorText(getBackendError(error, t.resendFail));
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={page}>
      <div style={wrap}>
        <h1 style={title}>{t.title}</h1>

        {loading ? (
          <div style={card}>
            <div style={messageStyle}>{t.loading}</div>
          </div>
        ) : (
          <div style={card}>
            {message ? <div style={successBox}>{message}</div> : null}
            {errorText ? <div style={errorBox}>{errorText}</div> : null}

            <section style={section}>
              <div>
                <h2 style={h2}>{t.profile}</h2>
                <p style={hint}>{t.readonly}</p>
              </div>

              <div style={grid}>
                <Field label={t.name} value={user?.name} />
                <Field label={t.surname} value={user?.surname} />
                <Field label={t.email} value={user?.email} />
                <Field label={t.role} value={user?.role} />
                <Field
                  label={t.status}
                  value={user?.is_suspended ? t.suspended : t.active}
                />
              </div>
            </section>

            <section style={section}>
              <div>
                <h2 style={h2}>{t.language}</h2>
                <p style={hint}>UA / EN</p>
              </div>

              <div style={actions}>
                <button type="button" onClick={toggleLang} style={btnGhost}>
                  {t.changeLang}
                </button>
              </div>
            </section>

            <section style={sectionLast}>
              <div>
                <h2 style={h2}>{t.security}</h2>
                <p style={hint}>{t.account}</p>
              </div>

              <div style={actions}>
                <button
                  type="button"
                  onClick={resendEmail}
                  disabled={sending}
                  style={btnGhost}
                >
                  {sending ? t.loading : t.resend}
                </button>

                <button type="button" onClick={logout} style={btnDanger}>
                  {t.logout}
                </button>
              </div>
            </section>
          </div>
        )}
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
  color: "#344054",
  fontSize: "12px",
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
};

const actions = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const btnGhost = {
  minHeight: "38px",
  border: "1px solid #2E5D8C",
  color: "#2E5D8C",
  background: "#FFFFFF",
  padding: "0 16px",
  borderRadius: "8px",
  fontWeight: 800,
  fontSize: "13px",
  cursor: "pointer",
};

const btnDanger = {
  minHeight: "38px",
  border: "none",
  color: "#FFFFFF",
  background: "#B3131A",
  padding: "0 16px",
  borderRadius: "8px",
  fontWeight: 800,
  fontSize: "13px",
  cursor: "pointer",
};

const successBox = {
  margin: "20px 28px 0",
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#E7F6EC",
  color: "#137333",
  fontSize: "13px",
  fontWeight: 700,
};

const errorBox = {
  margin: "20px 28px 0",
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#FDECEC",
  color: "#B3131A",
  fontSize: "13px",
  fontWeight: 700,
};

const messageStyle = {
  padding: "24px 28px",
  color: "#101828",
  fontSize: "14px",
  fontWeight: 700,
};