import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, me } from "../service/auth";
import { cleanEmail } from "../utils/clean";
import { setToken } from "../utils/token";
import { useToast } from "../context/ToastContext";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const DEFAULT_AFTER_LOGIN = "/cabinet";

export default function LoginForm() {
  const nav = useNavigate();
  const location = useLocation();
  const { show } = useToast();

  const redirectFromState = location.state?.from?.pathname || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const errors = useMemo(() => {
    const e = {};
    const emailClean = cleanEmail(email);
    if (!emailClean) e.email = "Вкажіть email";
    else if (!EMAIL_RE.test(emailClean)) e.email = "Некоректний email";
    if (!password) e.password = "Вкажіть пароль";
    return e;
  }, [email, password]);

  const isValid = Object.keys(errors).length === 0;
  const markTouched = (f) => setTouched((t) => ({ ...t, [f]: true }));

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setErrorMsg(null);
    if (!isValid) return;

    try {
      setSubmitting(true);
      const { token } = await login(cleanEmail(email), password);
      if (!token) throw new Error("No token");
      setToken(token, 24 * 60 * 60);
      const user = await me();
      if (user) localStorage.setItem("finu_user", JSON.stringify(user));
      show("Успішний вхід", "success");
      const target = redirectFromState || DEFAULT_AFTER_LOGIN;
      nav(target, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      setErrorMsg(
        status === 401 ? (serverMsg || "Invalid credentials")
                       : "Сталася помилка. Спробуйте ще раз."
      );
      show(status === 401 ? "Невірний email або пароль" : "Помилка входу", "error");
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
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoComplete="email"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.email && errors.email ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                aria-invalid={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Пароль</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.password && errors.password ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
                aria-invalid={Boolean(touched.password && errors.password)}
              />
              {touched.password && errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
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
              <a href="/register" className="text-indigo-600 hover:underline">Зареєструватись</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
