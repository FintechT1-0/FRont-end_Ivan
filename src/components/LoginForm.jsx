import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../service/auth";
import { setToken } from "../utils/token";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setErrorMsg(null);
    if (!isValid) return;

    try {
      setSubmitting(true);
      const data = await login(email.trim(), password);
      const token = data?.token || data?.accessToken || null;
      const exp = data?.exp ? Number(data.exp) * 1000 : undefined;
      if (token) setToken(token, exp);
      nav("/cabinet", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.response?.data?.detail;
      if (status === 401) setErrorMsg(msg || "Невірний email або пароль");
      else setErrorMsg(msg || "Сталася помилка. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#e7e4df]">
      <div className="w-full max-w-lg">
        <div className="mx-4 rounded-2xl bg-[#d9d9db] p-8">
          <div className="text-center text-2xl font-semibold mb-8">Sign In</div>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label className="block text-sm mb-2">E-mail</label>
              <input
                className={`w-full rounded-2xl px-4 py-3 bg-[#f5f5f5] outline-none ring-0 border ${
                  touched.email && errors.email ? "border-rose-300" : "border-slate-300"
                }`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                autoComplete="email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">Password</label>
              <input
                className={`w-full rounded-2xl px-4 py-3 bg-[#f5f5f5] outline-none ring-0 border ${
                  touched.password && errors.password ? "border-rose-300" : "border-slate-300"
                }`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full rounded-2xl bg-[#eeece7] py-3 text-lg font-semibold disabled:opacity-50"
            >
              {submitting ? "Входимо…" : "Sign In"}
            </button>

            <div className="mt-6 text-center text-sm">
              <Link to="/register" className="underline">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
