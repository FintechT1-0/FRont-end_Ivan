import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginForm() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const errors = useMemo(() => {
    const e = {};
    if (!email.trim()) e.email = "Вкажіть email";
    else if (!EMAIL_RE.test(email)) e.email = "Некоректний email";
    if (!password) e.password = "Вкажіть пароль";
    return e;
  }, [email, password]);

  const isValid = Object.keys(errors).length === 0;

  function markTouched(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setErrorMsg(null);
    if (!isValid) return;

    try {
      setSubmitting(true);
      const data = await login(email.trim(), password);

      // очікуємо поле token
      if (data?.token) {
        localStorage.setItem("jwt", data.token);
      }
      // збережемо користувача (якщо є)
      const user = data?.user ?? null;
      if (user) localStorage.setItem("finu_user", JSON.stringify(user));

      // редірект на Dashboard
      nav("/dashboard", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setErrorMsg("Невірний email або пароль");
      } else {
        setErrorMsg("Сталася помилка. Спробуйте ще раз.");
      }
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
          </form>
        </div>
      </div>
    </div>
  );
}
