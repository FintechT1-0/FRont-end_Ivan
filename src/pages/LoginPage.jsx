import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { lang } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const t = useMemo(() => ({
    title: lang === "en" ? "Sign In" : "Вхід",
    email: "E-mail",
    password: lang === "en" ? "Password" : "Пароль",
    btn: lang === "en" ? "Sign In" : "Увійти",
    signup: lang === "en" ? "Create account" : "Зареєструватися",
    admin: lang === "en" ? "For admin" : "Для адміна",
    back: lang === "en" ? "Back" : "Назад",
    invalid: lang === "en"
      ? "Invalid email or password."
      : "Невірний e-mail або пароль.",
  }), [lang]);

  function handleBack() {
    const nextRaw = params.get("next");
    if (nextRaw) {
      navigate(decodeURIComponent(nextRaw));
    } else {
      navigate("/", { replace: true });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await login({ email, password });

      const nextRaw = params.get("next");
      const next = nextRaw ? decodeURIComponent(nextRaw) : null;

      if (next) {
        navigate(next, { replace: true });
        return;
      }

      if (data?.user?.role === "admin") navigate("/admin", { replace: true });
      else navigate("/cabinet", { replace: true });
    } catch {
      setErr(t.invalid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] bg-[#0E3A73] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 rounded-3xl p-8 relative">

        {/* BACK / CLOSE */}
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 text-xl opacity-80 hover:opacity-100"
          title={t.back}
        >
          ✕
        </button>

        <h1 className="text-3xl font-semibold">{t.title}</h1>

        {err && (
          <div className="mt-4 bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#A94F5E] hover:opacity-90 disabled:opacity-60 transition"
            type="submit"
          >
            {t.btn}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/85">
          <Link to="/register" className="underline">
            {t.signup}
          </Link>
          <Link to="/admin-auth" className="underline">
            {t.admin}
          </Link>
        </div>
      </div>
    </div>
  );
}