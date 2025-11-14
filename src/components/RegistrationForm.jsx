import React, { useMemo, useState } from "react";
import { register as apiRegister } from "../service/auth";
import { cleanEmail } from "../utils/clean";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function RegistrationForm() {
  const nav = useNavigate();
  const { show } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const errors = useMemo(() => {
    const e = {};
    const emailClean = cleanEmail(email);

    if (!firstName.trim()) e.firstName = "Вкажіть ім'я";
    if (!lastName.trim())  e.lastName  = "Вкажіть прізвище";

    if (!emailClean) e.email = "Вкажіть email";
    else if (!EMAIL_RE.test(emailClean)) e.email = "Некоректний email";

    if (!password) e.password = "Вкажіть пароль";
    else if (password.length < 8) e.password = "Мінімум 8 символів";

    if (!confirmPassword) e.confirmPassword = "Повторіть пароль";
    else if (confirmPassword !== password) e.confirmPassword = "Паролі не збігаються";

    return e;
  }, [firstName, lastName, email, password, confirmPassword]);

  const isValid = Object.keys(errors).length === 0;
  const markTouched = (f) => setTouched(t => ({ ...t, [f]: true }));

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    setErrorMsg(null);
    if (!isValid) return;

    try {
      setSubmitting(true);
      const payload = {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     cleanEmail(email),
        password
      };
      await apiRegister(payload);
      show("Реєстрація успішна. Увійдіть у систему.", "success");
      nav("/login", { replace: true }); // Sprint 2: редірект на логін
    } catch (err) {
      const status = err?.response?.status;
      const d = err?.response?.data;
      let msg =
        typeof d === "string" ? d
        : d?.message || "Не вдалося зареєструватись.";
      if (status === 409) msg = "Email already in use";
      if (status === 400 && Array.isArray(d?.errors) && d.errors.length) {
        // Беремо першу field error як коротке пояснення
        msg = d.errors[0]?.message || msg;
      }
      setErrorMsg(msg);
      show(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">FinTech UniVerse 1.0</h1>
            <p className="text-sm text-slate-500">Реєстрація акаунта</p>
          </header>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">Ім'я</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.firstName && errors.firstName ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => markTouched("firstName")}
              />
              {touched.firstName && errors.firstName && <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Прізвище</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.lastName && errors.lastName ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => markTouched("lastName")}
              />
              {touched.lastName && errors.lastName && <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
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
              />
              {touched.email && errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Пароль</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.password && errors.password ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
              />
              {touched.password && errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
              <p className="mt-1 text-[11px] text-slate-500">Мінімум 8 символів.</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Повторити пароль</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.confirmPassword && errors.confirmPassword ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched("confirmPassword")}
              />
              {touched.confirmPassword && errors.confirmPassword && <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm transition active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid || submitting}
              aria-busy={submitting}
            >
              {submitting ? "Створюємо акаунт…" : "Зареєструватись"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
