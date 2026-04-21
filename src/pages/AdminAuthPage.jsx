import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
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

const fieldStyle = {
  width: "100%",
  height: "48px",
  border: "none",
  outline: "none",
  borderRadius: "999px",
  background: "#E9EEF4",
  padding: "0 16px",
  fontSize: "14px",
  color: "#18324B",
};

export default function AdminAuthPage() {
  const { lang } = useLang();
  const { refreshMe } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    admin_password: "",
  });

  const [loading, setLoading] = useState(false);

  const t = {
    title: lang === "ua" ? "РЕЄСТРАЦІЯ АДМІНА" : "ADMIN SIGN UP",
    subtitle:
      lang === "ua"
        ? "Доступ до цієї форми мають лише члени команди з admin password"
        : "This form requires a valid admin password",
    name: lang === "ua" ? "Ім'я" : "Name",
    surname: lang === "ua" ? "Прізвище" : "Surname",
    email: "Email",
    password: lang === "ua" ? "Пароль" : "Password",
    adminPassword: lang === "ua" ? "Admin password" : "Admin password",
    submit: lang === "ua" ? "Створити акаунт адміна" : "Create admin account",
    back: lang === "ua" ? "Назад" : "Back",
    fail:
      lang === "ua"
        ? "Не вдалося зареєструвати адміністратора"
        : "Failed to register admin",
  };

  function setField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);

      await registerUser(form);
      const loginData = await loginUser({
        email: form.email,
        password: form.password,
      });

      if (loginData?.token) {
        localStorage.setItem("token", loginData.token);
      }

      const me = await refreshMe();

      if (me?.role === "admin") {
        navigate("/admin");
        return;
      }

      alert(lang === "ua" ? "Користувач створений, але роль не admin" : "User created, but role is not admin");
    } catch (error) {
      alert(getBackendError(error, t.fail));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#082947",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "28px",
          padding: "28px",
          background:
            "linear-gradient(180deg, rgba(19,54,90,0.78) 0%, rgba(10,37,67,0.88) 100%)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.28)",
          color: "#FFFFFF",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            lineHeight: 1.15,
            fontWeight: 700,
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            margin: "10px 0 22px",
            color: "rgba(255,255,255,0.78)",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {t.subtitle}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder={t.name}
            style={fieldStyle}
          />

          <input
            value={form.surname}
            onChange={(e) => setField("surname", e.target.value)}
            placeholder={t.surname}
            style={fieldStyle}
          />

          <input
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder={t.email}
            type="email"
            style={fieldStyle}
          />

          <input
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            placeholder={t.password}
            type="password"
            style={fieldStyle}
          />

          <input
            value={form.admin_password}
            onChange={(e) => setField("admin_password", e.target.value)}
            placeholder={t.adminPassword}
            type="password"
            style={fieldStyle}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "6px",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                minWidth: "180px",
                height: "42px",
                border: "none",
                borderRadius: "999px",
                background: "#B3131A",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
              }}
            >
              {loading ? "..." : t.submit}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                minWidth: "100px",
                height: "42px",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "999px",
                background: "transparent",
                color: "#FFFFFF",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {t.back}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}