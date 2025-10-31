import React, { useMemo, useState } from "react";

// FinTech UniVerse 1.0 — MVP Registration Form (React + Tailwind)
// Route suggestion: mount at /register
// Usage: <RegistrationForm onSuccess={() => console.log('Registered!')} />

// Minimal email regex good enough for MVP (not fully RFC compliant)
const EMAIL_RE = /^[^\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/i;

function RegistrationForm({ onSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // === Validation ===
  const errors = useMemo(() => {
    const e = {};
    if (!firstName.trim()) e.firstName = "Вкажіть ім'я";
    if (!lastName.trim()) e.lastName = "Вкажіть прізвище";

    if (!email.trim()) e.email = "Вкажіть email";
    else if (!EMAIL_RE.test(email)) e.email = "Некоректний email";

    if (!password) e.password = "Вкажіть пароль";
    else if (password.length < 8) e.password = "Мінімум 8 символів";

    if (!confirmPassword) e.confirmPassword = "Повторіть пароль";
    else if (confirmPassword !== password) e.confirmPassword = "Паролі не збігаються";

    return e;
  }, [firstName, lastName, email, password, confirmPassword]);

  const isValid = Object.keys(errors).length === 0;

  function markTouched(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    if (!isValid) return;

    setSubmitting(true);
    setSuccessMsg(null);

    // === Mock API call ===
    await new Promise((res) => setTimeout(res, 900));

    const payload = { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password };

    // Store mock token to localStorage for MVP demo only.
    localStorage.setItem("finu_mock_token", "demo-jwt-token");
    localStorage.setItem("finu_user", JSON.stringify({ firstName: payload.firstName, lastName: payload.lastName, email: payload.email }));

    setSubmitting(false);
    setSuccessMsg("Реєстрацію виконано! (мокове підтвердження)");
    if (onSuccess) onSuccess(payload);

    // Optionally clear sensitive fields
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">FinTech UniVerse 1.0</h1>
            <p className="text-sm text-slate-500">Реєстрація акаунта (MVP)</p>
          </header>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800" role="status">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* First Name */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                Ім'я
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.firstName && errors.firstName ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => markTouched("firstName")}
                aria-invalid={Boolean(touched.firstName && errors.firstName)}
                aria-describedby={touched.firstName && errors.firstName ? "firstName-err" : undefined}
              />
              {touched.firstName && errors.firstName && (
                <p id="firstName-err" className="mt-1 text-xs text-rose-600">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                Прізвище
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.lastName && errors.lastName ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => markTouched("lastName")}
                aria-invalid={Boolean(touched.lastName && errors.lastName)}
                aria-describedby={touched.lastName && errors.lastName ? "lastName-err" : undefined}
              />
              {touched.lastName && errors.lastName && (
                <p id="lastName-err" className="mt-1 text-xs text-rose-600">
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.email && errors.email ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? "email-err" : undefined}
              />
              {touched.email && errors.email && (
                <p id="email-err" className="mt-1 text-xs text-rose-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.password && errors.password ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
                aria-invalid={Boolean(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? "password-err" : undefined}
              />
              {touched.password && errors.password && (
                <p id="password-err" className="mt-1 text-xs text-rose-600">
                  {errors.password}
                </p>
              )}
              <p className="mt-1 text-[11px] text-slate-500">Мінімум 8 символів. Для продакшну додайте вимоги до складності.</p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Повторити пароль
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                  touched.confirmPassword && errors.confirmPassword ? "border-rose-300 ring-rose-100" : "border-slate-300 focus:ring-indigo-200"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched("confirmPassword")}
                aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
                aria-describedby={touched.confirmPassword && errors.confirmPassword ? "confirmPassword-err" : undefined}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p id="confirmPassword-err" className="mt-1 text-xs text-rose-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm transition active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid || submitting}
              aria-busy={submitting}
            >
              {submitting ? "Створюємо акаунт…" : "Зареєструватись"}
            </button>

            <p className="mt-3 text-center text-sm text-slate-500">
              Натискаючи кнопку, ви погоджуєтесь із умовами сервісу (демо).
            </p>
          </form>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} FinTech UniVerse. MVP Build.
        </footer>
      </div>
    </div>
  );
}

export default RegistrationForm;