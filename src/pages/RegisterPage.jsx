import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { lang } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const t = useMemo(() => {
    const en = lang === "en";
    return {
      title: en ? "Sign Up" : "Реєстрація",
      name: en ? "Name" : "Ім’я",
      surname: en ? "Surname" : "Прізвище",
      email: "E-mail",
      password: en ? "Password" : "Пароль",
      btn: en ? "Create account" : "Створити акаунт",
      signin: en ? "Already have an account? Sign In" : "Вже є акаунт? Увійти",
      ok: en
        ? "Account created. Check your email to verify it, then sign in."
        : "Акаунт створено. Підтвердь пошту в листі, після цього увійди.",
    };
  }, [lang]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setLoading(true);

    try {
      await register({ name, surname, email, password });
      setInfo(t.ok);
      setTimeout(() => {
        navigate("/login?verification=pending", { replace: true });
      }, 700);
    } catch (e2) {
      const detail = e2?.response?.data?.detail;
      setErr(detail || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0E3A73] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 rounded-3xl p-8">
        <h1 className="text-3xl font-semibold">{t.title}</h1>

        {info && (
          <div className="mt-4 bg-emerald-500/15 border border-emerald-400/30 rounded-xl p-3 text-sm">
            {info}
          </div>
        )}

        {err && (
          <div className="mt-4 bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full h-11 rounded-xl bg-white/10 px-4 outline-none"
            placeholder={t.surname}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />

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
            minLength={8}
          />

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#A94F5E] hover:opacity-90 disabled:opacity-60 transition"
            type="submit"
          >
            {t.btn}
          </button>
        </form>

        <div className="mt-6 text-sm text-white/85">
          <Link to="/login" className="underline">
            {t.signin}
          </Link>
        </div>
      </div>
    </div>
  );
}