// src/components/LoginForm.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../service/auth";
import { setToken } from "../utils/token";

// простий regex для MVP
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const errors = useMemo(() => {
    const e = {};
    const emailClean = String(email || "").trim().toLowerCase();

    if (!emailClean) e.email = "Вкажіть email";
    else if (!EMAIL_RE.test(emailClean)) e.email = "Некоректний email";

    if (!password) e.password = "Вкажіть пароль";

    return e;
  }, [email, password]);

  const isValid = Object.keys(errors).length === 0;
  const markTouched = (field) =>
    setTouched((t) => ({ ...t, [field]: true }));

  async function handleSubmit(ev) {
    ev.preventDefault();
    setTouched({ email: true, password: true });
    setErrorMsg(null);
    if (!isValid) return;

    try {
      setSubmitting(true);

      // (5) рівно { email, password }
      const { token, user } = await login(
        String(email).trim().toLowerCase(),
        password
      );

      if (!token) {
        throw new Error("No token in response");
      }

      // зберігаємо токен на 24 години (в utils/token.js ttl = 24h за замовчуванням)
      setToken(token);

      // опційно кешуємо користувача, якщо бек повернув
      if (user) {
        localStorage.setItem("finu.user", JSON.stringify(user));
      }

      // (вимога) після успішного login → /cabinet
      navigate("/cabinet", { replace: true });
    } catch (err) {
      // (3) логування помилки
      console.log("LOGIN_ERR_CATCH:", err?.response?.data || err.message);

      const status = err?.response?.status;
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string"
          ? err.response.data
          : null);

      // (6) обробка 401 — інтерсептор вже робить clear+redirect,
      // але тут показуємо зрозуміле повідомлення
      let msg = "Сталася помилка. Спробуйте ще раз.";
      if (status === 401) msg = serverMsg || "Невірний email або пароль";
      else if (status === 400) msg = serverMsg || "Некоректні дані";
      else if (status === 405) msg = "Метод не дозволено (очікується POST)";
      else if (serverMsg) msg = serverMsg;

      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">Вхід</h1>
            <p className="text-sm text-slate-500">FinTech UniVerse 1.0</p>
          </header>

          {errorMsg && (
            <div
              className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800"
              role="alert"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoComplete="email"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.email && errors.email
                    ? "border-rose-300 ring-rose-100"
                    : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                aria-invalid={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>

            {/* Пароль */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.password && errors.password
                    ? "border-rose-300 ring-rose-100"
                    : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
                aria-invalid={Boolean(touched.password && errors.password)}
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm transition active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid || submitting}
              aria-busy={submitting}
            >
              {submitting ? "Входимо…" : "Увійти"}
            </button>

            <p className="mt-4 text-center text-sm text-slate-600">
              Немає акаунта?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:underline"
              >
                Зареєструватись
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
