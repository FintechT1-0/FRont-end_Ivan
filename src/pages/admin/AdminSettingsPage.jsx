import { useMemo, useState } from "react";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";

function normalizeErr(error) {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;
  const message = error?.response?.data?.message;

  let msg = "Request failed";

  if (typeof detail === "string" && detail.trim()) {
    msg = detail;
  } else if (Array.isArray(detail) && detail.length > 0) {
    msg = detail.map((item) => item.msg).join(", ");
  } else if (typeof message === "string" && message.trim()) {
    msg = message;
  } else if (typeof error?.message === "string" && error.message.trim()) {
    msg = error.message;
  }

  return { status, msg };
}

export default function AdminSettingsPage() {
  const { lang } = useLang();
  const { user, refreshMe } = useAuth();

  const t = useMemo(() => {
    return {
      title: lang === "en" ? "SETTINGS" : "НАЛАШТУВАННЯ",
      profile: lang === "en" ? "Profile" : "Профіль",
      security: lang === "en" ? "Security" : "Безпека",
      name: lang === "en" ? "Name" : "Імʼя",
      surname: lang === "en" ? "Surname" : "Прізвище",
      email: lang === "en" ? "Email" : "Пошта",
      save: lang === "en" ? "Save changes" : "Зберегти зміни",
      curPass: lang === "en" ? "Current password" : "Поточний пароль",
      newPass: lang === "en" ? "New password" : "Новий пароль",
      repeat: lang === "en" ? "Repeat new password" : "Повторіть новий пароль",
      change: lang === "en" ? "Change password" : "Змінити пароль",
      saved: lang === "en" ? "Saved" : "Збережено",
      saving: lang === "en" ? "Saving..." : "Збереження...",
      passwordMismatch:
        lang === "en" ? "Passwords do not match" : "Паролі не співпадають",
      finalMsg:
        lang === "en"
          ? "This section will be available in the final version of the product."
          : "Цей розділ буде доступний у фінальній версії продукту.",
      adminPasswordNote:
        lang === "en"
          ? "admin_password cannot be changed here. It is used only during /auth/register."
          : "admin_password тут не змінюється. Він використовується лише під час /auth/register.",
    };
  }, [lang]);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
  });

  const [pass, setPass] = useState({
    currentPassword: "",
    newPassword: "",
    newPassword2: "",
  });

  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    setInfo("");
    setErr("");
    setLoadingProfile(true);

    try {
      await client.patch("/auth/me", {
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
      });

      await refreshMe();
      setInfo(t.saved);
    } catch (error) {
      const { status, msg } = normalizeErr(error);
      if ([404, 405, 501].includes(status)) setErr(t.finalMsg);
      else setErr(msg);
    } finally {
      setLoadingProfile(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setInfo("");
    setErr("");

    if (!pass.newPassword || pass.newPassword !== pass.newPassword2) {
      setErr(t.passwordMismatch);
      return;
    }

    setLoadingPass(true);

    try {
      await client.patch("/auth/password", {
        current_password: pass.currentPassword,
        new_password: pass.newPassword,
      });

      setInfo(t.saved);
      setPass({
        currentPassword: "",
        newPassword: "",
        newPassword2: "",
      });
    } catch (error) {
      const { status, msg } = normalizeErr(error);
      if ([404, 405, 501].includes(status)) setErr(t.finalMsg);
      else setErr(msg);
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "930px" }}>
      <h1
        style={{
          margin: "0 0 16px",
          color: "#FFFFFF",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        {t.title}
      </h1>

      {(info || err) && (
        <div style={{ marginBottom: "16px" }}>
          {info ? (
            <div
              style={{
                color: "#166534",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "13px",
              }}
            >
              {info}
            </div>
          ) : null}

          {err ? (
            <div
              style={{
                marginTop: info ? "8px" : 0,
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "13px",
              }}
            >
              {err}
            </div>
          ) : null}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        <form
          onSubmit={saveProfile}
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.08)",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {t.profile}
          </div>

          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <div style={labelStyle}>{t.name}</div>
              <input
                style={inputStyle}
                value={profile.name}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>

            <div>
              <div style={labelStyle}>{t.surname}</div>
              <input
                style={inputStyle}
                value={profile.surname}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, surname: event.target.value }))
                }
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={labelStyle}>{t.email}</div>
              <input
                type="email"
                style={inputStyle}
                value={profile.email}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
          </div>

          <button type="submit" disabled={loadingProfile} style={buttonStyle}>
            {loadingProfile ? t.saving : t.save}
          </button>
        </form>

        <form
          onSubmit={changePassword}
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.08)",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {t.security}
          </div>

          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gap: "16px",
            }}
          >
            <div>
              <div style={labelStyle}>{t.curPass}</div>
              <input
                type="password"
                style={inputStyle}
                value={pass.currentPassword}
                onChange={(event) =>
                  setPass((prev) => ({
                    ...prev,
                    currentPassword: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <div style={labelStyle}>{t.newPass}</div>
              <input
                type="password"
                style={inputStyle}
                value={pass.newPassword}
                onChange={(event) =>
                  setPass((prev) => ({
                    ...prev,
                    newPassword: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <div style={labelStyle}>{t.repeat}</div>
              <input
                type="password"
                style={inputStyle}
                value={pass.newPassword2}
                onChange={(event) =>
                  setPass((prev) => ({
                    ...prev,
                    newPassword2: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <button type="submit" disabled={loadingPass} style={buttonStyle}>
            {loadingPass ? t.saving : t.change}
          </button>
        </form>
      </div>

      <div
        style={{
          marginTop: "16px",
          color: "rgba(255,255,255,0.62)",
          fontSize: "12px",
        }}
      >
        {t.adminPasswordNote}
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#111827",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  height: "40px",
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.14)",
  padding: "0 12px",
  outline: "none",
  fontSize: "14px",
  color: "#111827",
  background: "#FFFFFF",
};

const buttonStyle = {
  marginTop: "24px",
  height: "44px",
  padding: "0 24px",
  borderRadius: "8px",
  border: "none",
  background: "#2E5D8C",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};