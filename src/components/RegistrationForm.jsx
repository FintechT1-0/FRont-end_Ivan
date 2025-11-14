// src/components/RegistrationForm.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as apiRegister, checkEmail } from "../service/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function RegistrationForm() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    firstName: false, lastName: false, email: false, password: false, confirmPassword: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const errors = useMemo(() => {
    const e = {};
    const emailClean = String(email || "").trim().toLowerCase();

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
  const markTouched = (f) => setTouched((t) => ({ ...t, [f]: true }));

  async function handleSubmit(ev) {
    ev.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!isValid) return;

    try {
      setSubmitting(true);

      // 1) Опціонально: перевірка, чи email вже існує (POST /auth/checkEmail)
      try {
        const chk = await checkEmail(String(email).trim().toLowerCase());
        if (chk?.exists === true) {
          setErrorMsg("Email already in use");
          setSubmitting(false);
          return;
        }
      } catch (e) {
        // Якщо бек не піднятий для цього — просто ігноруємо та пробуємо реєстрацію
        console.log("CHECK_EMAIL_WARN:", e?.response?.data || e.message);
      }

      // 2) Реєстрація — бек очікує name/surname
      const payload = {
        name: firstName.trim(),
        surname: lastName.trim(),
        email: String(email).trim().toLowerCase(),
        password
      };

      const data = await apiRegister(payload);
      console.log("REGISTER_OK:", data);

      setSuccessMsg("Реєстрація успішна. Увійдіть у систему.");
      setTimeout(() => navigate("/login", { replace: true }), 600);
    } catch (err) {
      console.log("REGISTER_ERR_CATCH:", err?.response?.data || err.message);
      const status = err?.response?.status;
      const d = err?.response?.data;

      let msg =
        (typeof d === "string" && d) ||
        d?.message || d?.detail ||
        "Не вдалося зареєструватись.";

      if (status === 409) msg = "Email already in use";
      if (status === 405) msg = "Метод не дозволено (перевір URL/метод/Content-Type)";
      if (status === 400 && Array.isArray(d?.errors) && d.errors.length) {
        msg = d.errors[0]?.message || msg;
      }

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
            <h1 className="text-2xl font-semibold tracking-tight">FinTech UniVerse 1.0</h1>
            <p className="text-sm text-slate-500">Реєстрація акаунта</p>
          </header>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800" role="status">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Ім'я */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">Ім'я</label>
              <input
                id="firstName" type="text" autoComplete="given-name"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.firstName && errors.firstName ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => markTouched("firstName")}
              />
              {touched.firstName && errors.firstName && <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>}
            </div>

            {/* Прізвище */}
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Прізвище</label>
              <input
                id="lastName" type="text" autoComplete="family-name"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.lastName && errors.lastName ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => markTouched("lastName")}
              />
              {touched.lastName && errors.lastName && <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email" type="email" inputMode="email" autoCapitalize="none" autoComplete="email"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.email && errors.email ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
              />
              {touched.email && errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            {/* Пароль */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Пароль</label>
              <input
                id="password" type="password" autoComplete="new-password"
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

            {/* Повтор пароля */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Повторити пароль</label>
              <input
                id="confirmPassword" type="password" autoComplete="new-password"
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

            <p className="mt-4 text-center text-sm text-slate-600">
              Вже маєте акаунт?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">Увійти</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
