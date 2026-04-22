import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser, loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

function getErrorMessage(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(", ");
  }

  return error?.response?.data?.message || error?.message || fallback;
}

export default function AdminAuthPage() {
  const navigate = useNavigate();
  const { refreshMe } = useAuth();
  const { lang } = useLang();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    adminPassword: "",
  });

  const t = {
    title: lang === "ua" ? "Адмін доступ" : "Admin access",
    login: lang === "ua" ? "Увійти" : "Login",
    register: lang === "ua" ? "Створити адміністратора" : "Create admin",
    name: lang === "ua" ? "Ім'я" : "Name",
    surname: lang === "ua" ? "Прізвище" : "Surname",
    email: "Email",
    password: lang === "ua" ? "Пароль" : "Password",
    adminPassword: lang === "ua" ? "Admin пароль" : "Admin password",
    switchToLogin: lang === "ua" ? "Вже є акаунт" : "Already have account",
    switchToRegister: lang === "ua" ? "Створити адміна" : "Create admin",
    error: lang === "ua" ? "Помилка" : "Error",
    created:
      lang === "ua"
        ? "Адміністратора створено. Тепер увійди."
        : "Admin created. Now sign in.",
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        const response = await loginUser({
          email: form.email,
          password: form.password,
        });

        if (response?.token) {
          localStorage.setItem("token", response.token);
        }

        const me = await refreshMe();

        if (me?.role === "admin") {
          navigate("/admin");
          return;
        }

        alert(lang === "ua" ? "Цей акаунт не є адміністратором" : "This account is not an admin");
      } else {
        await registerUser({
          name: form.name,
          surname: form.surname,
          email: form.email,
          password: form.password,
          admin_password: form.adminPassword,
        });

        alert(t.created);
        setIsLogin(true);
      }
    } catch (error) {
      alert(getErrorMessage(error, t.error));
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
        padding: "16px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "24px",
          borderRadius: "20px",
          background:
            "linear-gradient(180deg, rgba(19,54,90,0.8), rgba(10,37,67,0.9))",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>{t.title}</h2>

        {!isLogin && (
          <>
            <input
              name="name"
              placeholder={t.name}
              value={form.name}
              onChange={handleChange}
              required
              style={input}
            />

            <input
              name="surname"
              placeholder={t.surname}
              value={form.surname}
              onChange={handleChange}
              required
              style={input}
            />
          </>
        )}

        <input
          name="email"
          placeholder={t.email}
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          style={input}
        />

        <input
          name="password"
          type="password"
          placeholder={t.password}
          value={form.password}
          onChange={handleChange}
          required
          style={input}
        />

        {!isLogin && (
          <input
            name="adminPassword"
            type="password"
            placeholder={t.adminPassword}
            value={form.adminPassword}
            onChange={handleChange}
            required
            style={input}
          />
        )}

        <button type="submit" disabled={loading} style={button}>
          {loading ? "..." : isLogin ? t.login : t.register}
        </button>

        <p
          style={{
            marginTop: "12px",
            cursor: "pointer",
            opacity: 0.8,
          }}
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin ? t.switchToRegister : t.switchToLogin}
        </p>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "#fff",
};

const button = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#1e88e5",
  color: "#fff",
  cursor: "pointer",
};